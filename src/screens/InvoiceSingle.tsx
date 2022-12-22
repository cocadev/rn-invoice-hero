import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {PermissionsAndroid, Alert} from 'react-native';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {MainStackRouteNames} from '../navigation/router-names';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {selectSingleInvoice} from '../store/selectors/invoices';
import {clearSingleInvoice} from '../store/reducers/invoices';
import {loadSingleInvoice, updateInvoice} from '../store/thunk/invoices';
import {colors} from '../styles/colors';
import {FormField} from '../components/FormField';
import {BtnType, Button} from '../components/Button';
import {MainStackParamList} from '../navigation/MainStackNavigator';
import {InvoiceStatus} from '../models/invoice';
import {font} from '../styles/font';
import {baseURL, api} from '../utils/api';
import {DotsIcon} from '../components/icons/DotsIcon';
import {commonView} from '../styles/common';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isIOS} from '../utils/constants';
import {showMessage} from 'react-native-flash-message';

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.InvoiceSingle>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.InvoiceSingle
  >;
};

export const InvoiceSingle: React.FC<Props> = ({route, navigation}) => {
  const dispatch = useDispatch<any>();
  const insets = useSafeAreaInsets();
  const singleInvoice = useSelector(selectSingleInvoice);
  const [showDotsPopup, setShowDotsPopup] = useState(false);
  const [estimate, setEstimate] = useState(!!route.params?.estimate);

  useFocusEffect(
    useCallback(() => {
      dispatch(loadSingleInvoice({id: route.params?.id}));

      return () => dispatch(clearSingleInvoice());
    }, [route.params?.id]),
  );

  const send = () => {
    if (!singleInvoice.result) {
      return;
    }

    dispatch(
      updateInvoice({
        id: singleInvoice.result?._id,
        status: InvoiceStatus.Unpaid,
      }),
    );

    setEstimate(true);
  };

  const changeStatus = () => {
    if (!singleInvoice.result) {
      return;
    }

    dispatch(
      updateInvoice({
        id: singleInvoice.result?._id,
        status:
          singleInvoice.result?.status === InvoiceStatus.Paid
            ? InvoiceStatus.Unpaid
            : InvoiceStatus.Paid,
      }),
    );
  };

  const onEditClick = () => {
    navigation.navigate(MainStackRouteNames.InvoiceCreate, {
      invoice: singleInvoice.result,
    });
  };

  const download = async (share = false) => {
    const id = route.params?.id;
    const {fs, android, ios} = RNFetchBlob;

    const dir = isIOS ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;

    setShowDotsPopup(false);

    try {
      const folder = await fs.exists(dir);
      if (!folder) {
        showMessage({
          message: 'Dont have access to folder',
          type: 'danger',
        });
        return;
      }

      const fileName = `${id}.pdf`;
      const path = `${dir}/${fileName}`;
      const mime = 'application/pdf';

      api
        .get(`/invoices/${id}/pdf`)
        .then(({data}) => fs.writeFile(path, data, 'base64'))
        .then(async () => {
          const shareOptions = {
            type: mime,
            url: path,
          };

          if (isIOS) {
            if (share) {
              await Share.open(shareOptions);
            } else {
              ios.previewDocument(path);
            }
          } else {
            android.addCompleteDownload({
              title: fileName,
              description: 'Invoice downloaded',
              mime,
              path,
              showNotification: true,
            });

            if (share) {
              await Share.open(shareOptions);
            } else {
              android.actionViewIntent(path, mime);
            }
          }
        })
        .catch(e => console.log(e));
    } catch (e) {
      console.log(e);
    }
  };

  const getContent = () => {
    if (singleInvoice.loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={'large'} color={colors.bluePrimary} />
        </View>
      );
    }

    const item = singleInvoice.result;

    const categoryItems = (item?.items || [])
      .map(i => i.description)
      .join(', ');
    const payments = (item?.payments || []).map(p => p.name).join(', ');
    const customs = (item?.customs || []).map(c => c.name).join(', ');

    return (
      <ScrollView style={styles.scrollContainer}>
        <FormField label={'Invoice #'} containerStyle={styles.field}>
          <Text style={styles.cardRowValue}>{item?.number}</Text>
        </FormField>
        <FormField label={'Bill to'} containerStyle={styles.field}>
          <Text style={styles.cardRowValue}>{item?.billTo?.name || '-'}</Text>
        </FormField>
        <FormField label={'Date'} containerStyle={styles.field}>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Invoice Date</Text>
            <Text style={styles.cardRowValue}>
              {item?.date ? moment(item?.date).format('MMM/DD/YYYY') : '-'}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Due date</Text>
            <Text style={styles.cardRowValue}>
              {item?.dueDate
                ? moment(item?.dueDate).format('MMM/DD/YYYY')
                : '-'}
            </Text>
          </View>
          {Boolean(item?.recurringPeriod) && (
            <View style={styles.cardRow}>
              <Text style={styles.cardRowLabel}>Recurring period</Text>
              <Text style={styles.cardRowValue}>
                Every {item?.recurringPeriod} months
              </Text>
            </View>
          )}
        </FormField>
        <FormField label={'Items'} containerStyle={styles.field}>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Category</Text>
            <Text style={styles.cardRowValue}>
              {item?.category?.name || '-'}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Items</Text>
            <Text style={styles.cardRowValue}>
              {categoryItems.length ? categoryItems : '-'}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Discount</Text>
            <Text style={styles.cardRowValue}>
              {item?.discountRate || 0}%, {item?.discount || 0}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Tax</Text>
            <Text style={styles.cardRowValue}>{item?.taxRate || 0}%</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Total</Text>
            <Text style={styles.cardRowValue}>${item?.total || 0}</Text>
          </View>
        </FormField>
        <FormField label={'Payment Method'} containerStyle={styles.field}>
          <Text style={styles.cardRowValue}>
            {payments.length ? payments : '-'}
          </Text>
        </FormField>
        <FormField label={'Delivery Method'} containerStyle={styles.field}>
          <Text style={styles.cardRowValue}>
            {item?.delivery
              ? `${item?.delivery.email} ${item?.delivery.text}`
              : '-'}
          </Text>
        </FormField>
        {Boolean(item?.customs?.length) && (
          <FormField label={'Other'} containerStyle={styles.field}>
            <Text style={styles.cardRowValue}>{customs}</Text>
          </FormField>
        )}
        <View style={styles.imagesContainer}>
          {item?.attachments.map(asset => {
            return (
              <View style={styles.imageBlock}>
                <Image source={{uri: asset}} style={styles.image} />
              </View>
            );
          })}
        </View>
        <View style={styles.actionsContainer}>
          <Button
            text={'Edit'}
            onPress={onEditClick}
            type={BtnType.Primary}
            containerStyle={styles.actionButton}
          />
          {singleInvoice.result?.status === InvoiceStatus.Estimate && (
            <Button text={'Send'} onPress={send} type={BtnType.Primary} />
          )}
          {singleInvoice.result?.status !== InvoiceStatus.Estimate && (
            <Button
              text={
                singleInvoice.result?.status === InvoiceStatus.Unpaid
                  ? 'Mark as Paid'
                  : 'Mark as Unpaid'
              }
              onPress={changeStatus}
              type={BtnType.Outlined}
            />
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {showDotsPopup && (
        <>
          <TouchableWithoutFeedback onPress={() => setShowDotsPopup(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View
            style={[
              styles.dotsDetailsContainer,
              commonView.commonShadow,
              {
                top: 60 + insets.top,
              },
            ]}>
            <TouchableOpacity
              onPress={() => download(false)}
              activeOpacity={0.7}
              style={styles.dotsDetailsItem}>
              <Text style={styles.dotsDetailsItemText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => download(true)}
              style={[
                styles.dotsDetailsItem,
                styles.dotsDetailsItemWithoutBorder,
              ]}>
              <Text style={styles.dotsDetailsItemText}>Share</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <Header
        title={`${estimate ? 'Estimate' : 'Invoice'} #${route.params?.title}`}
        showCloseBtn={true}
        rightSideComponent={
          <TouchableOpacity
            onPress={() => setShowDotsPopup(state => !state)}
            style={styles.dotsContainer}>
            <DotsIcon />
          </TouchableOpacity>
        }
      />
      <PageContainer>{getContent()}</PageContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    // paddingVertical: 15,
  },
  field: {
    marginBottom: 24,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRowLabel: {
    flex: 1,
    ...font(14, 21),
    color: colors.text.darkGrayText,
  },
  cardRowValue: {
    flex: 1,
    ...font(14, 21, '300'),
    color: colors.text.darkGrayText,
  },
  actionsContainer: {
    marginTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  actionButton: {
    marginBottom: 20,
  },
  imagesContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingHorizontal: 18,
  },
  imageBlock: {
    width: '50%',
    paddingHorizontal: 6,
  },
  image: {
    width: '100%',
    height: 200,
  },
  dotsContainer: {
    width: 24,
    height: 24,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  dotsDetailsContainer: {
    position: 'absolute',
    right: 24,
    backgroundColor: colors.whiteColor,
    zIndex: 30,
    borderRadius: 8,
  },
  dotsDetailsItem: {
    paddingHorizontal: 16,
    minWidth: 100,
    height: 40,
    justifyContent: 'space-between',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotsDetailsItemWithoutBorder: {
    borderBottomWidth: 0,
  },
  dotsDetailsItemText: {
    color: colors.text.darkGrayText,
    ...font(14, 16),
  },
});
