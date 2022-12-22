import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {loadInvoiceCategoriesOverview} from '../store/thunk/invoices';
import {CategoryOverview, InvoiceStatus} from '../models/invoice';
import {currencyFormatter} from '../utils/currency';
import {selectInvoiceCategoriesOverview} from '../store/selectors/invoices';
import {colors} from '../styles/colors';
import {Card} from './Card';
import {ArrowLeftIcon} from './icons/ArrowLeftIcon';
import {EmptyResult} from './EmptyResult';
import {useNavigation} from '@react-navigation/native';
import {MainStackRouteNames} from '../navigation/router-names';
import {commonView} from '../styles/common';
import {font} from '../styles/font';

type Props = {
  categories?: string[];
  statuses: InvoiceStatus[];
};

export const InvoiceCategoriesOverview: React.FC<Props> = ({
  categories = [],
  statuses = [InvoiceStatus.Paid, InvoiceStatus.Unpaid],
}) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();
  const categoryOverview = useSelector(selectInvoiceCategoriesOverview);

  useEffect(() => {
    dispatch(
      loadInvoiceCategoriesOverview({
        statuses,
        categories,
      }),
    );
  }, [categories]);

  if (categoryOverview.loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={'large'} color={colors.bluePrimary} />
      </View>
    );
  }

  if (!categoryOverview.loading && !categoryOverview.result.length) {
    return <EmptyResult />;
  }

  return (
    <View style={styles.container}>
      {categoryOverview.result.map((item: CategoryOverview) => {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(MainStackRouteNames.InvoiceSearch, {
                title: item?.category?.name,
                request: {
                  categories: [item._id],
                  statuses: [InvoiceStatus.Unpaid, InvoiceStatus.Paid],
                },
              })
            }
            key={`invoice_client_${item._id}`}
            style={[styles.touchableCard, commonView.commonShadow]}>
            <Card containerStyle={styles.card}>
              <Text style={styles.categoryName}>
                {item?.category?.name || 'None'}
              </Text>
              <Text style={styles.categorySum}>
                {currencyFormatter.format(item.sum)}
              </Text>
              <View style={styles.icon}>
                <ArrowLeftIcon color={'#D1D5DB'} />
              </View>
            </Card>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableCard: {
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  categoryName: {
    ...font(14, 16, '500'),
    color: colors.text.darkGrayText,
    flex: 1,
  },
  categorySum: {
    ...font(16, 18, '500'),
    color: colors.text.black,
  },
  icon: {
    marginLeft: 24,
    transform: [
      {
        rotate: '180deg',
      },
    ],
  },
});
