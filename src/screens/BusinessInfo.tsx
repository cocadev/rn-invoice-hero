import React, {useEffect, useMemo} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {Formik, useFormikContext} from 'formik';
import * as Yup from 'yup';
import {RouteProp} from '@react-navigation/native';
import {
  MainStackRouteNames,
  SettingsStackRouteNames,
} from '../navigation/router-names';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SettingRouterParamList} from '../navigation/SettingsStackNavigator';
import {InputField} from '../components/form/InputField';
import {FormField} from '../components/FormField';
import {commonView} from '../styles/common';
import {ArrowLeftIcon} from '../components/icons/ArrowLeftIcon';
import {colors} from '../styles/colors';
import {Button} from '../components/Button';
import {useDispatch, useSelector} from 'react-redux';
import {selectPayments} from '../store/selectors/payments';
import {selectCategories} from '../store/selectors/categories';
import {getUserBusiness} from '../store/thunk/business';
import {selectBusiness} from '../store/selectors/business';
import {selectUser} from '../store/selectors/user';
import {api, ApiRequestEnum} from '../utils/api';

type Props = {
  route: RouteProp<
    SettingRouterParamList,
    SettingsStackRouteNames.BusinessInfo
  >;
  navigation: NativeStackNavigationProp<
    SettingRouterParamList,
    SettingsStackRouteNames.BusinessInfo
  >;
};

const BusinessForm: React.FC<Props> = React.memo(({route, navigation}) => {
  const dispatch = useDispatch<any>();

  const formik = useFormikContext<any>();
  const payments = useSelector(selectPayments);
  const categories = useSelector(selectCategories);
  const business = useSelector(selectBusiness);

  useEffect(() => {
    dispatch(getUserBusiness());
  }, []);

  useEffect(() => {
    if (business.result) {
      formik.setValues({
        ...business.result,
        payments: (business.result.payments || []).map(payment => payment._id),
        tax: {
          rate: String(business.result?.tax?.rate || 0),
          cost: String(business.result?.tax?.cost || 0),
        },
      });
    }
  }, [business.result]);

  useEffect(() => {
    if (route.params?.address) {
      formik.setFieldValue('address', route.params?.address);
    }

    if (route.params?.payments) {
      formik.setFieldValue('payments', route.params?.payments);
    }

    if (route.params?.tax) {
      formik.setFieldValue('tax', route.params?.tax);
    }
  }, [route.params]);

  const onAddressAdd = () => {
    navigation.navigate<any>(MainStackRouteNames.AddAddress, {
      backScreen: SettingsStackRouteNames.BusinessInfo,
      returnValueName: 'address',
      value: formik.values.address,
    });
  };

  const onPaymentAdd = () => {
    navigation.navigate<any>(MainStackRouteNames.AddInvoicePayments, {
      backScreen: SettingsStackRouteNames.BusinessInfo,
      returnValueName: 'payments',
      value: formik.values.payments,
    });
  };

  const onTaxAdd = () => {
    navigation.navigate<any>(SettingsStackRouteNames.AddTax, {
      backScreen: SettingsStackRouteNames.BusinessInfo,
      returnValueName: 'tax',
      value: formik.values.tax,
    });
  };

  const onCategoryChange = () => {
    navigation.navigate<any>(SettingsStackRouteNames.ManageCategory);
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

    return array;
  }, [formik.values.address]);

  const formattedPayments = useMemo(() => {
    return (formik.values.payments || [])
      .map(payment => {
        return payments.find(p => p._id === payment)?.name || '-';
      })
      .join(', ');
  }, [formik.values.payments, payments]);

  const formattedCategories = useMemo(() => {
    return (categories || []).map(c => c.name).join(', ');
  }, [categories]);

  const formattedTax = useMemo(() => {
    const result = [];

    if (formik.values?.tax.rate) {
      result.push(`${formik.values?.tax.rate}%`);
    }

    if (formik.values?.tax.cost) {
      result.push(`$${formik.values?.tax.cost}`);
    }

    return result.join(', ');
  }, [formik.values.tax]);

  if (business.loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={'large'} color={colors.bluePrimary} />
      </View>
    );
  }

  return (
    <>
      <InputField
        label={'Business name'}
        name={'name'}
        placeholder={'Enter business name...'}
        containerStyle={styles.field}
      />
      <FormField
        onPress={onAddressAdd}
        label={'Address'}
        containerStyle={styles.field}>
        <View style={styles.row}>
          {formattedAddress.length ? (
            <Text style={commonView.cardRowValue}>
              {formattedAddress.join(', ')}
            </Text>
          ) : (
            <Text style={commonView.cardRowPlaceholder}>Add new</Text>
          )}
          <View style={styles.rowIcon}>
            <ArrowLeftIcon size={20} color={colors.gray} />
          </View>
        </View>
      </FormField>
      <InputField
        label={'Email'}
        placeholder={'Enter email...'}
        name={'email'}
        containerStyle={styles.field}
      />
      <InputField
        label={'Website'}
        placeholder={'Enter website url...'}
        name={'website'}
        containerStyle={styles.field}
      />
      <FormField
        onPress={onPaymentAdd}
        label={'Accepted Payment'}
        containerStyle={styles.field}>
        <View style={styles.row}>
          {formik.values.payments?.length ? (
            <Text style={commonView.cardRowValue}>{formattedPayments}</Text>
          ) : (
            <Text style={commonView.cardRowPlaceholder}>Manage payments</Text>
          )}
          <View style={styles.rowIcon}>
            <ArrowLeftIcon size={20} color={colors.gray} />
          </View>
        </View>
      </FormField>
      <FormField onPress={onTaxAdd} label={'Tax'} containerStyle={styles.field}>
        <View style={styles.row}>
          {formik.values?.tax ? (
            <Text style={commonView.cardRowValue}>{formattedTax}</Text>
          ) : (
            <Text style={commonView.cardRowPlaceholder}>Set tax rate</Text>
          )}
          <View style={styles.rowIcon}>
            <ArrowLeftIcon size={20} color={colors.gray} />
          </View>
        </View>
      </FormField>
      <FormField
        onPress={onCategoryChange}
        label={'Category'}
        containerStyle={styles.field}>
        <View style={styles.row}>
          {categories?.length ? (
            <Text style={commonView.cardRowValue}>{formattedCategories}</Text>
          ) : (
            <Text style={commonView.cardRowPlaceholder}>Add category</Text>
          )}
          <View style={styles.rowIcon}>
            <ArrowLeftIcon size={20} color={colors.gray} />
          </View>
        </View>
      </FormField>
      <View style={[styles.actions, {paddingBottom: 26}]}>
        <Button
          text={'Save'}
          containerStyle={styles.action}
          onPress={formik.handleSubmit}
          disabled={!formik.isValid}
        />
      </View>
    </>
  );
});

const initialValues: any = {
  name: '',
  email: '',
  website: '',
  tax: {
    rate: '0',
    cost: '0',
  },
  address: null,
  payments: [],
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required Field'),
  email: Yup.string().email().required('Required Field'),
  website: Yup.string(),
});

export const BusinessInfo: React.FC<Props> = props => {
  const user = useSelector(selectUser);

  const onSubmit = async (values: any) => {
    console.log('values', values);

    try {
      if (values?._id) {
        const {data} = await api.put(
          ApiRequestEnum.UPDATE_BUSINESS + values._id,
          {
            ...values,
            user: user?._id,
          },
        );
      } else {
        const {data} = await api.post(ApiRequestEnum.CREATE_BUSINESS, {
          ...values,
          user: user?._id,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={'Business Info'} showBackBtn={true} />
      <PageContainer>
        <ScrollView>
          <Formik
            initialValues={initialValues}
            validateOnMount={true}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            <BusinessForm {...props} />
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
