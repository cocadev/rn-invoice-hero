import React, {useEffect, useRef, useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import {MainStackParamList} from '../navigation/MainStackNavigator';
import {MainStackRouteNames} from '../navigation/router-names';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {BtnType, Button} from '../components/Button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CloseIcon} from '../components/icons/CloseIcon';
import {colors} from '../styles/colors';
import {isIOS} from '../utils/constants';
import {api, ApiRequestEnum} from '../utils/api';
import {getFileNameFromUri} from '../utils/files';

type Props = {
  route: RouteProp<
    MainStackParamList,
    MainStackRouteNames.AddInvoiceAttachments
  >;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.AddInvoiceAttachments
  >;
};

export const AddInvoiceAttachments: React.FC<Props> = ({route, navigation}) => {
  const insets = useSafeAreaInsets();
  const [selectedImages, setSelectedImages] = useState<any[]>([]);

  const returnValueName = useRef<string | null>(null);
  const backScreen = useRef<string | null>(null);

  useEffect(() => {
    if (route.params?.returnValueName) {
      returnValueName.current = route.params?.returnValueName;
    }

    if (route.params?.backScreen) {
      backScreen.current = route.params?.backScreen;
    }

    if (route.params?.value) {
      setSelectedImages(
        (route.params?.value || []).map(asset => {
          return {
            uri: asset,
            loading: false,
            location: asset,
          };
        }),
      );
    }
  }, [route]);

  const deleteImage = (index: number) => {
    setSelectedImages(state => {
      return [...state.filter((asset, i) => i !== index)];
    });
  };

  const uploadImage = async asset => {
    setSelectedImages(state => [
      ...state.map(img =>
        img.fileName === asset.fileName ? {...img, loading: true} : img,
      ),
    ]);
    try {
      const formData = new FormData();

      formData.append('file', {
        uri: isIOS ? asset.uri.replace('file://', '') : asset.uri,
        name: getFileNameFromUri(asset.uri),
        type: asset.type || 'image/jpeg',
      });

      console.log('formData', formData);
      const result = await api.post(
        ApiRequestEnum.ATTACHMENTS_UPLOAD,
        formData,
      );

      setSelectedImages(state => [
        ...state.map(img =>
          img.fileName === asset.fileName
            ? {...img, loading: false, location: result.data.Location}
            : img,
        ),
      ]);
      console.log('resukt', result.data);
    } catch (e) {
      console.log(e);
      setSelectedImages(state => [
        ...state.map(img =>
          img.fileName === asset.fileName ? {...img, loading: false} : img,
        ),
      ]);
    }
  };

  const onSave = () => {
    const assetsLocations = selectedImages.map(asset => asset.location);

    navigation.navigate<any>(backScreen.current, {
      [returnValueName.current!]: assetsLocations,
    });
  };

  const onImportClick = async () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0,
      },
      result => {
        setSelectedImages(state => {
          return [...state, ...(result?.assets || [])];
        });

        (result.assets || []).forEach(asset => {
          uploadImage(asset);
        });
      },
    );
  };

  console.log('selectedImages', selectedImages);

  return (
    <View style={styles.container}>
      <Header title={'Add Attachments'} showBackBtn={true} />
      <PageContainer>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.imageList}>
          {(selectedImages || []).map((asset, index) => {
            return (
              <View
                key={`asset_${index}`}
                style={[
                  styles.imageContainer,
                  (index + 1) % 2 === 1 ? styles.left : styles.right,
                ]}>
                <FastImage
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.image}
                  source={{uri: asset.uri}}
                />
                {!asset?.loading && (
                  <TouchableOpacity
                    onPress={() => deleteImage(index)}
                    activeOpacity={0.9}
                    style={styles.deleteImage}>
                    <CloseIcon color={colors.gray} size={16} />
                  </TouchableOpacity>
                )}
                {Boolean(asset?.loading) && (
                  <View style={styles.imageLoader}>
                    <ActivityIndicator size={'small'} />
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
        <View style={[styles.actions, {paddingBottom: insets.bottom + 16}]}>
          <Button
            text={'Add images'}
            type={BtnType.Outlined}
            containerStyle={styles.action}
            onPress={onImportClick}
          />
          <Button
            text={'Save'}
            disabled={selectedImages.some(asset => asset.loading)}
            containerStyle={styles.action}
            onPress={onSave}
          />
          <Button
            text={'Cancel'}
            type={BtnType.Outlined}
            containerStyle={styles.action}
            onPress={() => navigation.navigate<any>(backScreen.current)}
          />
        </View>
      </PageContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actions: {
    paddingHorizontal: 24,
  },
  action: {
    marginTop: 16,
  },
  field: {
    marginBottom: 16,
  },
  imageList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
  },
  imageContainer: {
    marginBottom: 12,
    alignItems: 'center',
    width: '50%',
  },
  deleteImage: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 8,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.whiteColor,
  },
  image: {
    // width: Dimensions.get('screen').width / 2 - 48 - 16,
    width: '100%',
    height: 200,
    backgroundColor: colors.screenBackground,
  },
  left: {
    paddingRight: 6,
  },
  right: {
    paddingLeft: 6,
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255, 255, 0.8)',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
