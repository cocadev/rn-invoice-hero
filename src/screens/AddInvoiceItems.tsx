import React, {useEffect, useMemo, useRef, useState} from 'react';
import {FieldArray, Formik} from 'formik';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BtnType, Button} from '../components/Button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../navigation/MainStackNavigator';
import {MainStackRouteNames} from '../navigation/router-names';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {InputField} from '../components/form/InputField';
import {CloseIcon} from '../components/icons/CloseIcon';
import {TrashIcon} from '../components/icons/TrashIcon';
import {DependFieldsInvoiceItems} from '../components/form/DependFieldsInvoiceItems';
import {useSelector} from 'react-redux';
import {selectCategories} from '../store/selectors/categories';
import {commonView} from '../styles/common';
import {FormField} from '../components/FormField';
import * as Yup from 'yup';

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.AddInvoiceItems>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.AddInvoiceItems
  >;
};

const initialValues = {
  items: [
    {
      description: '',
      rate: '',
      hours: '',
    },
  ],
  subTotal: 0,
  discountRate: '0',
  discount: '0',
  tax: '0',
  taxRate: '0',
  total: 0,
};

const validationSchema = Yup.object().shape({
  items: Yup.array()
    .of(
      Yup.object().shape({
        description: Yup.string().required(),
        rate: Yup.string().required(),
        hours: Yup.string().required(),
      }),
    )
    .required('Required'),
});
// TODO: This component should be rewriten
export const AddInvoiceItems: React.FC<Props> = ({route, navigation}) => {
  const categories = useSelector(selectCategories);

  const returnValueName = useRef<string | null>(
    route.params?.returnValueName || null,
  );
  const backScreen = useRef<string | null>(route.params?.backScreen || null);
  const [category, setCategory] = useState<string | null>(null);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (route.params?.category) {
      setCategory(route.params?.category);
    }

    if (route.params?.value && route.params.value?.category) {
      setCategory(route.params.value?.category);
    }
  }, [route]);

  const onSave = (values: any) => {
    navigation.navigate<any>(backScreen.current, {
      [returnValueName.current!]: {
        ...values,
        category,
      },
    });
  };

  const onCancel = () => {
    navigation.navigate<any>(backScreen.current);
  };

  const formattedCategories = useMemo(() => {
    return (categories || []).map(c => {
      return {
        label: c.name,
        value: c._id,
      };
    });
  }, [categories]);

  return (
    <View style={styles.container}>
      <Header title={'Add items'} showBackBtn={true} />
      <PageContainer>
        <Formik
          initialValues={route.params?.value || initialValues}
          validationSchema={validationSchema}
          onSubmit={onSave}>
          {({handleSubmit, values, isValid}) => (
            <>
              <ScrollView style={styles.container}>
                <FormField
                  onPress={() => {
                    navigation.navigate(MainStackRouteNames.DropDownList, {
                      title: 'Select categories',
                      list: formattedCategories,
                      returnValueName: 'category',
                      backScreen: MainStackRouteNames.AddInvoiceItems,
                      selectedValue: category || null,
                    });
                  }}
                  label={'Category'}
                  containerStyle={styles.field}>
                  {category ? (
                    <Text style={commonView.cardRowValue}>
                      {
                        formattedCategories.find(c => c.value === category)
                          ?.label
                      }
                    </Text>
                  ) : (
                    <Text style={commonView.cardRowPlaceholder}>
                      Select category
                    </Text>
                  )}
                </FormField>
                <FieldArray name={'items'}>
                  {({remove, push}) => {
                    return (
                      <View style={styles.field}>
                        {(values.items || []).map(
                          (item: any, index: number) => {
                            return (
                              <View key={index}>
                                <InputField
                                  label={'Description'}
                                  name={`items.${index}.description`}
                                  placeholder={'Description'}
                                />
                                <View style={styles.itemsRow}>
                                  <InputField
                                    label={'Rate'}
                                    name={`items.${index}.rate`}
                                    // placeholder={'Rate'}
                                    containerStyle={styles.itemsRowField}
                                    cardStyle={styles.itemsCard}
                                    keyboardType={'numeric'}
                                  />
                                  <View style={styles.itemsRowIcon}>
                                    <CloseIcon color={'#6B7280'} />
                                  </View>
                                  <InputField
                                    label={'Quantity'}
                                    labelStyle={styles.itemsCard}
                                    name={`items.${index}.hours`}
                                    // placeholder={'Quantity'}
                                    containerStyle={styles.itemsRowField}
                                    cardStyle={styles.itemsCard}
                                    keyboardType={'numeric'}
                                  />
                                  <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => {
                                      if (values.items.length > 1) {
                                        remove(index);
                                      }
                                    }}
                                    style={styles.itemsRowIcon}>
                                    <TrashIcon
                                      color={
                                        values.items.length > 1
                                          ? '#6B7280'
                                          : '#dedede'
                                      }
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            );
                          },
                        )}
                        <View style={styles.actions}>
                          <Button
                            text={'New item'}
                            type={BtnType.Outlined}
                            onPress={() =>
                              push({
                                description: '',
                                rate: '',
                                hours: '',
                              })
                            }
                          />
                        </View>
                      </View>
                    );
                  }}
                </FieldArray>
                <DependFieldsInvoiceItems />
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
              </ScrollView>
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
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  itemsCard: {
    marginHorizontal: 0,
  },
  itemsRowField: {
    flex: 1,
  },
  itemsRowIcon: {
    marginBottom: 16,
    paddingHorizontal: 15,
  },
});
