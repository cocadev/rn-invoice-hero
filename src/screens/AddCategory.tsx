import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {SettingsStackRouteNames} from '../navigation/router-names';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {BtnType, Button} from '../components/Button';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {InputField} from '../components/form/InputField';
import {SettingRouterParamList} from '../navigation/SettingsStackNavigator';
import {useDispatch, useSelector} from 'react-redux';
import {createCategory} from '../store/thunk/categories';
import {selectUser} from '../store/selectors/user';

type Props = {
  route: RouteProp<SettingRouterParamList, SettingsStackRouteNames.AddCategory>;
  navigation: NativeStackNavigationProp<
    SettingRouterParamList,
    SettingsStackRouteNames.AddCategory
  >;
};

const initialValues = {
  name: '',
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
});

export const AddCategory: React.FC<Props> = ({route, navigation}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<any>();
  const user = useSelector(selectUser);

  const onSave = (values: any): void => {
    dispatch(
      createCategory({
        ...values,
        user: user?._id,
      }),
    );
    navigation.goBack();
  };

  const onCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title={'Add new category'} showBackBtn={true} />
      <PageContainer>
        <Formik
          initialValues={route.params?.value || initialValues}
          validateOnMount={true}
          validationSchema={validationSchema}
          onSubmit={onSave}>
          {({isValid, handleSubmit}) => (
            <>
              <ScrollView style={styles.container}>
                <InputField
                  label={'Name'}
                  name={'name'}
                  placeholder={'Enter category name...'}
                  containerStyle={styles.field}
                />
              </ScrollView>
              <View
                style={[styles.actions, {paddingBottom: insets.bottom + 16}]}>
                <Button
                  text={'Save'}
                  containerStyle={styles.action}
                  onPress={handleSubmit}
                  disabled={!isValid}
                />
                <Button
                  text={'Cancel'}
                  type={BtnType.Outlined}
                  containerStyle={styles.action}
                  onPress={onCancel}
                />
              </View>
            </>
          )}
        </Formik>
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
});
