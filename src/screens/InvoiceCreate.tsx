import React, {useState, useEffect, useMemo, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {Button} from '../components/Button';
import {useFormik} from 'formik';
import {FormField} from '../components/FormField';
import * as Yup from 'yup';
import {PlusIcon} from '../components/icons/PlusIcon';
import {DotsIcon} from '../components/icons/DotsIcon';
import {colors} from '../styles/colors';
import {useDispatch, useSelector} from 'react-redux';
import {selectClients} from '../store/selectors/clients';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../navigation/MainStackNavigator';
import {MainStackRouteNames} from '../navigation/router-names';
import {RouteProp} from '@react-navigation/native';
import {commonView} from '../styles/common';
import moment from 'moment';
import {selectCategories} from '../store/selectors/categories';
import {selectPayments} from '../store/selectors/payments';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Invoice, InvoiceStatus} from '../models/invoice';
import {updateInvoice} from '../store/thunk/invoices';
import {api, ApiRequestEnum} from '../utils/api';
import {selectInvoiceCount} from '../store/selectors/invoices';
import {increaseInvoiceCount} from '../store/reducers/invoices';
import {showMessage} from 'react-native-flash-message';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {AxiosError} from 'axios';
import {CustomTabs} from '../components/CustomTabs';
import {CustomInvoice} from '../components/CustomInvoice';

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.InvoiceCreate>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.InvoiceCreate
  >;
};

const formatInvoiceFromForm = (invoice: any) => {
  let result = {
    number: invoice.number,
    billTo: invoice.billTo,
    customs: invoice.customs || [],
    delivery: invoice.delivery || null,
    payments: invoice.payments || [],
    attachments: invoice.attachments || [],
    status: invoice.status,
  };

  if (invoice.date) {
    result = {
      ...result,
      ...invoice.date,
    };
  }

  if (invoice.items) {
    result = {
      ...result,
      ...invoice.items,
    };
  }

  return result;
};

const formatInvoiceToForm = (invoice: Invoice) => {
  let result = {
    number: invoice.number,
    billTo: invoice.billTo?._id || '',
    customs: invoice.customs || [],
    delivery: invoice.delivery || null,
    payments: (invoice.payments || []).map(payment => payment._id),
    status: invoice.status,
    attachments: invoice.attachments || [],
    date: {
      date: invoice?.date || null,
      dueDate: invoice?.dueDate || null,
      recurringPeriod: invoice?.recurringPeriod || null,
    },
    items: {
      subTotal: invoice?.subTotal || 0,
      discountRate: invoice?.discountRate ? String(invoice?.discountRate) : '0',
      discount: invoice?.discount ? String(invoice?.discount) : '0',
      tax: invoice?.tax ? String(invoice?.tax) : '0',
      taxRate: invoice?.taxRate ? String(invoice?.taxRate) : '0',
      total: invoice.total || 0,
      items: (invoice.items || []).map(item => {
        return {
          ...item,
          rate: String(item.rate || 0),
          hours: String(item.hours || 0),
        };
      }),
      category: invoice.category?._id || null,
    },
  };

  return result;
};

export const InvoiceCreate: React.FC<Props> = ({navigation, route}) => {
  const dispatch = useDispatch<any>();
  const invoiceId = useRef<string | null>(null);
  const TABS = [invoiceId.current ? 'Edit' : 'Create', 'Preview'];
  const clients = useSelector(selectClients);
  const categories = useSelector(selectCategories);
  const payments = useSelector(selectPayments);
  const invoiceCount = useSelector(selectInvoiceCount);
  const [activeTab, setActiveTab] = useState<string>();

  useEffect(() => {
    setActiveTab(invoiceId.current ? 'Edit' : 'Create');
  }, [invoiceId.current]);

  const insets = useSafeAreaInsets();

  const formik = useFormik({
    initialValues: {
      number: null,
      billTo: '',
      date: null,
      status: route.params?.estimate
        ? InvoiceStatus.Estimate
        : InvoiceStatus.Unpaid,
      items: null,
      payments: [],
      attachments: [],
      delivery: null,
      customs: [],
    },
    validationSchema: Yup.object().shape({
      billTo: Yup.string().required('Required Field'),
    }),
    onSubmit: async values => {
      const result = formatInvoiceFromForm(values);

      if (invoiceId.current) {
        dispatch(
          updateInvoice({
            id: invoiceId.current,
            ...result,
          }),
        );

        navigation.navigate(MainStackRouteNames.InvoiceSingle, {
          id: invoiceId.current,
          title: result.number,
          estimate: result.status === InvoiceStatus.Estimate,
        });
      } else {
        try {
          const {data} = await api.post(ApiRequestEnum.INVOICE_CREATE, {
            ...result,
            number: String(invoiceCount + 1).padStart(6, '0'),
          });

          dispatch(increaseInvoiceCount());

          showMessage({
            message:
              result.status === InvoiceStatus.Estimate
                ? 'Estimate created'
                : 'Invoice created',
            type: 'success',
          });

          navigation.replace(MainStackRouteNames.InvoiceSingle, {
            id: data._id,
            title: data.number,
            estimate: result.status === InvoiceStatus.Estimate,
          });
        } catch (e: AxiosError | any) {
          if (e?.response?.status === 405) {
            navigation.navigate(MainStackRouteNames.SubscriptionModal);
          }

          if (e) {
            showMessage({
              message:
                e.response.data?.error ||
                e.response.data?.message ||
                'Error happens',
              type: 'danger',
            });
            console.log(e.response.data.error);
          }
        }
      }
    },
  });

  useEffect(() => {
    if (route.params?.invoice) {
      invoiceId.current = route.params?.invoice?._id || null;
      const preparedInvoice = formatInvoiceToForm(route.params?.invoice);

      // @ts-ignore
      formik.setValues(preparedInvoice);
    }

    if (route.params?.billTo) {
      formik.setFieldValue('billTo', String(route.params?.billTo));
    }

    if (route.params?.date) {
      formik.setFieldValue('date', route.params?.date);
    }

    if (route.params?.items) {
      formik.setFieldValue('items', route.params?.items);
    }

    if (route.params?.payments) {
      formik.setFieldValue('payments', route.params?.payments);
    }

    if (route.params?.delivery) {
      formik.setFieldValue('delivery', route.params?.delivery);
    }

    if (route.params?.customs) {
      formik.setFieldValue('customs', route.params?.customs);
    }

    if (route.params?.attachments) {
      formik.setFieldValue('attachments', route.params?.attachments);
    }
  }, [route]);

  const formattedClients = useMemo(() => {
    return (clients || []).map(client => {
      return {
        label: client.name,
        value: client._id,
      };
    });
  }, [clients]);

  const formattedCategories = useMemo(() => {
    return (categories || []).map(c => {
      return {
        label: c.name,
        value: c._id,
      };
    });
  }, [categories]);

  const formattedItems = useMemo(() => {
    const items: any = formik.values.items;
    if (!items) {
      return '';
    }

    let category = '';
    if (items.category) {
      category =
        formattedCategories.find(c => c.value === items.category)?.label || '';
    }

    return `${category || 'No category'}: ${items.items
      .map((item: any) => item.description)
      .join(', ')}`;
  }, [formik.values.items, formattedCategories]);

  const formattedPayments = useMemo(() => {
    return (formik.values.payments || [])
      .map(payment => {
        return payments.find(p => p._id === payment)?.name || '-';
      })
      .join(', ');
  }, [formik.values.payments, payments]);

  const formattedCustoms = useMemo(() => {
    return (formik.values.customs || [])
      .map((custom: any) => custom?.name || 'None')
      .join(', ');
  }, [formik.values.customs]);

  const onSelectClient = () => {
    navigation.navigate(MainStackRouteNames.DropDownList, {
      title: 'Select client',
      list: formattedClients,
      returnValueName: 'billTo',
      backScreen: MainStackRouteNames.InvoiceCreate,
      selectedValue: formik.values.billTo || null,
    });
  };

  const onAddDate = () => {
    navigation.navigate(MainStackRouteNames.AddInvoiceDate, {
      backScreen: MainStackRouteNames.InvoiceCreate,
      returnValueName: 'date',
      value: formik.values.date,
    });
  };

  const clientPlusClick = () => {
    navigation.navigate(MainStackRouteNames.ClientCreate, {
      backScreen: MainStackRouteNames.InvoiceCreate,
      returnValueName: 'billTo',
    });
  };

  const onAddItems = () => {
    navigation.navigate(MainStackRouteNames.AddInvoiceItems, {
      backScreen: MainStackRouteNames.InvoiceCreate,
      returnValueName: 'items',
      value: formik.values.items,
    });
  };

  const onAddPayments = () => {
    navigation.navigate(MainStackRouteNames.AddInvoicePayments, {
      backScreen: MainStackRouteNames.InvoiceCreate,
      returnValueName: 'payments',
      value: formik.values.payments,
    });
  };

  const onAddDelivery = () => {
    navigation.navigate(MainStackRouteNames.AddInvoiceDelivery, {
      backScreen: MainStackRouteNames.InvoiceCreate,
      returnValueName: 'delivery',
      value: formik.values.delivery,
    });
  };

  const onAddCustoms = () => {
    navigation.navigate(MainStackRouteNames.AddInvoiceCustoms, {
      backScreen: MainStackRouteNames.InvoiceCreate,
      returnValueName: 'customs',
      value: formik.values.customs,
    });
  };

  const onAddAttachments = () => {
    navigation.navigate(MainStackRouteNames.AddInvoiceAttachments, {
      backScreen: MainStackRouteNames.InvoiceCreate,
      returnValueName: 'attachments',
      value: formik.values.attachments,
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title={`${invoiceId.current ? 'Edit' : 'Create'} ${
          formik.values.status === InvoiceStatus.Estimate
            ? 'Estimate'
            : 'Invoice'
        }`}
        showBackBtn={true}>
        <CustomTabs
          tabs={TABS}
          active={activeTab}
          setActiveTab={e => setActiveTab(e)}
        />
      </Header>

      <View
        style={{
          backgroundColor: '#fff',
          marginTop: -30,
          borderTopEndRadius: 20,
          borderTopLeftRadius: activeTab === 'Preview' ? 20 : 0,
          paddingTop: 12,
        }}>
        <ScrollView>
          {activeTab !== 'Preview' ? (
            <View style={{marginTop: 12}}>
              <FormField label={'Invoice number'} containerStyle={styles.field}>
                <Text style={commonView.cardRowValue}>
                  #
                  {formik.values.number ||
                    String(invoiceCount + 1).padStart(6, '0')}
                </Text>
              </FormField>
              <FormField
                onPress={onSelectClient}
                label={'Bill to'}
                containerStyle={styles.field}>
                <View style={styles.row}>
                  {formik.values.billTo ? (
                    <Text style={commonView.cardRowValue}>
                      {
                        formattedClients.find(
                          client => client.value === formik.values.billTo,
                        )?.label
                      }
                    </Text>
                  ) : (
                    <Text style={commonView.cardRowPlaceholder}>
                      Select client
                    </Text>
                  )}
                  <TouchableOpacity
                    onPress={clientPlusClick}
                    style={styles.rowIcon}>
                    <PlusIcon size={20} color={colors.gray} />
                  </TouchableOpacity>
                </View>
              </FormField>
              <FormField
                onPress={onAddDate}
                label={'Date'}
                containerStyle={styles.field}>
                <View style={styles.row}>
                  <View style={styles.rowValueContainer}>
                    {formik.values.date ? (
                      <Text style={commonView.cardRowValue}>
                        {`${moment(formik.values.date?.date).format(
                          'MMM DD, yyyy',
                        )} - ${moment(formik.values.date?.dueDate).format(
                          'MMM DD, yyyy',
                        )}`}
                        {Boolean(formik.values.date?.recurringPeriod) &&
                          `, Every ${formik.values.date?.recurringPeriod} months`}
                      </Text>
                    ) : (
                      <Text style={commonView.cardRowPlaceholder}>
                        Set date
                      </Text>
                    )}
                  </View>
                  <View style={styles.rowIcon}>
                    <PlusIcon size={20} color={colors.gray} />
                  </View>
                </View>
              </FormField>
              <FormField
                onPress={onAddItems}
                label={'Items'}
                containerStyle={styles.field}>
                <View style={styles.row}>
                  <View style={styles.rowValueContainer}>
                    {formik.values.items ? (
                      <Text style={commonView.cardRowValue}>
                        {formattedItems}
                      </Text>
                    ) : (
                      <Text style={commonView.cardRowPlaceholder}>
                        Add items
                      </Text>
                    )}
                  </View>
                  <View style={styles.rowIcon}>
                    <PlusIcon size={20} color={colors.gray} />
                  </View>
                </View>
              </FormField>
              <FormField
                onPress={onAddPayments}
                label={'Payment method'}
                containerStyle={styles.field}>
                <View style={styles.row}>
                  <View style={styles.rowValueContainer}>
                    {formik.values.payments?.length ? (
                      <Text style={commonView.cardRowValue}>
                        {formattedPayments}
                      </Text>
                    ) : (
                      <Text style={commonView.cardRowPlaceholder}>
                        Add payment method
                      </Text>
                    )}
                  </View>
                  <View style={styles.rowIcon}>
                    <PlusIcon size={20} color={colors.gray} />
                  </View>
                </View>
              </FormField>
              <FormField
                onPress={onAddDelivery}
                label={'Delivery method'}
                containerStyle={styles.field}>
                <View style={styles.row}>
                  <View style={styles.rowValueContainer}>
                    {formik.values.delivery ? (
                      <Text style={commonView.cardRowValue}>
                        {formik.values?.delivery?.email}{' '}
                        {formik.values?.delivery?.text}
                      </Text>
                    ) : (
                      <Text style={commonView.cardRowPlaceholder}>
                        Add delivery method
                      </Text>
                    )}
                  </View>
                  <View style={styles.rowIcon}>
                    <PlusIcon size={20} color={colors.gray} />
                  </View>
                </View>
              </FormField>
              <FormField
                onPress={onAddAttachments}
                label={'Attachments'}
                containerStyle={styles.field}>
                <View style={styles.row}>
                  <View style={styles.rowValueContainer}>
                    {formik.values.attachments?.length ? (
                      <Text style={commonView.cardRowValue}>
                        Selected {formik.values.attachments?.length} images
                      </Text>
                    ) : (
                      <Text style={commonView.cardRowPlaceholder}>
                        Add attachments
                      </Text>
                    )}
                  </View>
                  <View style={styles.rowIcon}>
                    <PlusIcon size={20} color={colors.gray} />
                  </View>
                </View>
              </FormField>
              <FormField
                onPress={onAddCustoms}
                label={'Other'}
                containerStyle={styles.field}>
                <View style={styles.row}>
                  <View style={styles.rowValueContainer}>
                    {formik.values.customs?.length ? (
                      <Text style={commonView.cardRowValue}>
                        {formattedCustoms}
                      </Text>
                    ) : (
                      <Text style={commonView.cardRowPlaceholder}>
                        Add custom fields
                      </Text>
                    )}
                  </View>
                  <View style={styles.rowIcon}>
                    <PlusIcon size={20} color={colors.gray} />
                  </View>
                </View>
              </FormField>
              <View
                style={[
                  styles.actionsContainer,
                  {paddingBottom: insets.bottom},
                ]}>
                <Button
                  text={'Save'}
                  disabled={!formik.isValid}
                  onPress={() => {
                    formik.handleSubmit();
                  }}
                  containerStyle={styles.btn}
                />
                {/*{formik.values.status !== InvoiceStatus.Estimate && (*/}
                {/*  <Button*/}
                {/*    text={'Save as draft'}*/}
                {/*    disabled={!formik.isValid}*/}
                {/*    type={BtnType.Outlined}*/}
                {/*    onPress={() => {*/}
                {/*      formik.setFieldValue('status', InvoiceStatus.Estimate);*/}
                {/*      formik.handleSubmit();*/}
                {/*    }}*/}
                {/*  />*/}
                {/*)}*/}
              </View>
              <View style={{height: 150}}/>
            </View>
          ) : (
            <View style={{margin: 12}}>
              <CustomInvoice
                data={{
                  number:
                    '#' +
                    (formik.values.number ||
                      String(invoiceCount + 1).padStart(6, '0')),
                  date: formik.values.date?.date
                    ? moment(formik.values.date?.date).format('MMM DD, yyyy')
                    : '-',
                  billTo: clients.find(
                    client => client._id === formik.values.billTo,
                  ),
                  items: formik.values.items,
                }}
                cData={formik.values}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },
  field: {
    marginBottom: 24,
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
  },
  btn: {
    marginBottom: 16,
  },
  actionsContainer: {
    paddingHorizontal: 24,
  },
});
