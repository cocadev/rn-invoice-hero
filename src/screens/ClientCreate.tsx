import React, { useEffect, useMemo, useRef } from "react";
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../navigation/MainStackNavigator';
import {MainStackRouteNames} from '../navigation/router-names';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Formik, useFormikContext} from 'formik';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {InputField} from '../components/form/InputField';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BtnType, Button} from '../components/Button';
import {commonView} from '../styles/common';
import {colors} from '../styles/colors';
import {FormField} from '../components/FormField';
import {ArrowLeftIcon} from '../components/icons/ArrowLeftIcon';
import * as Yup from 'yup';
import {api, ApiRequestEnum} from '../utils/api';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser} from '../store/selectors/user';
import {loadClients} from '../store/thunk/clients';
import { showMessage } from "react-native-flash-message";

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.ClientCreate>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.ClientCreate
  >;
};

const ClientForm: React.FC<Props> = ({route, navigation}) => {
  const formik = useFormikContext<any>();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (route.params?.address) {
      formik.setFieldValue('address', route.params?.address);
    }
  }, [route.params]);

  const onAddressAdd = () => {
    navigation.navigate(MainStackRouteNames.AddAddress, {
      backScreen: MainStackRouteNames.ClientCreate,
      returnValueName: 'address',
      value: formik.values.address,
    });
  };

  const formattedAddress = useMemo(() => {
    const array = [];

    if (formik.values?.address?.street) {
      array.push(formik.values?.address?.street);
    }

    if (formik.values?.address?.city) {
      array.push(formik.values?.address?.city);
    }

    if (formik.values?.address?.zip) {
      array.push(formik.values?.address?.zip);
    }

    if (formik.values?.address?.country) {
      array.push(formik.values?.address?.country);
    }

    return array.join(', ');
  }, [formik.values.address]);

  const onCancel = () => {
    navigation.goBack();
  };

  return (
    <>
      <InputField
        label={'Name'}
        name={'name'}
        placeholder={'Enter name...'}
        containerStyle={styles.field}
      />
      <InputField
        label={'Company name'}
        placeholder={'Enter company name...'}
        name={'companyName'}
        containerStyle={styles.field}
      />
      <InputField
        label={'Mobile'}
        placeholder={'Enter mobile...'}
        name={'phoneNumber'}
        containerStyle={styles.field}
      />
      <InputField
        label={'Email'}
        placeholder={'Enter email...'}
        name={'email'}
        containerStyle={styles.field}
      />
      <FormField
        onPress={onAddressAdd}
        label={'Address'}
        containerStyle={styles.field}>
        <View style={styles.row}>
          {formik.values?.address ? (
            <Text style={commonView.cardRowValue}>{formattedAddress}</Text>
          ) : (
            <Text style={commonView.cardRowPlaceholder}>Add new</Text>
          )}
          <View style={styles.rowIcon}>
            <ArrowLeftIcon size={20} color={colors.gray} />
          </View>
        </View>
      </FormField>
      <InputField
        placeholder={'Enter notes...'}
        label={'Note'}
        name={'note'}
        containerStyle={styles.field}
      />
      <View style={[styles.actions, {paddingBottom: insets.bottom + 16}]}>
        <Button
          text={'Save'}
          containerStyle={styles.action}
          onPress={formik.handleSubmit}
          disabled={!formik.isValid}
        />
        <Button
          text={'Cancel'}
          type={BtnType.Outlined}
          containerStyle={styles.action}
          onPress={onCancel}
        />
      </View>
    </>
  );
};

const initialValues: any = {
  name: '',
  companyName: '',
  phoneNumber: '',
  email: '',
  address: null,
  note: '',
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required Field'),
  companyName: Yup.string().required('Required Field'),
  phoneNumber: Yup.string().required('Required Field'),
  email: Yup.string().email().required('Required Field'),
});

export const ClientCreate: React.FC<Props> = props => {
  const {route, navigation} = props;

  const returnValueName = useRef<string | null>(null);
  const backScreen = useRef<string | null>(null);

  const dispatch = useDispatch<any>();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (route.params?.returnValueName) {
      returnValueName.current = route.params?.returnValueName;
    }

    if (route.params?.backScreen) {
      backScreen.current = route.params?.backScreen;
    }
  }, [route]);

  const onSubmit = async (values: any) => {
    try {
      const {data} = await api.post(ApiRequestEnum.CLIENT_CREATE, {
        ...values,
        user: user?._id,
      });

      dispatch(loadClients());

      if (backScreen.current) {
        navigation.navigate<any>(backScreen.current, {
          [returnValueName.current!]: data._id,
        });
      } else {
        navigation.navigate(MainStackRouteNames.MainBottomTabs);
      }
    } catch (e) {
      showMessage({
        message:
          e?.response?.data?.error ||
          e?.response?.data?.message ||
          'Can`t create client',
        type: 'danger',
      });
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={'Client Profile'} showBackBtn={true} />
      <PageContainer>
        <ScrollView>
          <Formik
            initialValues={initialValues}
            validateOnMount={true}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            <ClientForm {...props} />
          </Formik>
        </ScrollView>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowValueContainer: {
    flex: 1,
  },
  rowIcon: {
    flexShrink: 0,
    transform: [
      {
        rotate: '180deg',
      },
    ],
  },
});
