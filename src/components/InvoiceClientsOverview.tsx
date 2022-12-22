import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {loadInvoiceClientsOverview} from '../store/thunk/invoices';
import {ClientOverview, InvoiceStatus} from '../models/invoice';
import {currencyFormatter} from '../utils/currency';
import {selectInvoiceClientsOverview} from '../store/selectors/invoices';
import {colors} from '../styles/colors';
import {font} from '../styles/font';
import {Card} from './Card';
import {ArrowLeftIcon} from './icons/ArrowLeftIcon';
import {EmptyResult} from './EmptyResult';
import {useNavigation} from '@react-navigation/native';
import {MainStackRouteNames} from '../navigation/router-names';

type Props = {
  clients?: string[];
  statuses: InvoiceStatus[];
};

export const InvoiceClientsOverview: React.FC<Props> = ({
  clients = [],
  statuses = [InvoiceStatus.Paid, InvoiceStatus.Unpaid],
}) => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<any>();
  const invoiceClientsOverview = useSelector(selectInvoiceClientsOverview);

  useEffect(() => {
    dispatch(
      loadInvoiceClientsOverview({
        statuses,
        clients,
      }),
    );
  }, [clients]);

  if (invoiceClientsOverview.loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={'large'} color={colors.bluePrimary} />
      </View>
    );
  }

  if (
    !invoiceClientsOverview.loading &&
    !invoiceClientsOverview.result.length
  ) {
    return <EmptyResult />;
  }

  return (
    <View style={styles.container}>
      {invoiceClientsOverview.result.map((item: ClientOverview) => {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            key={`invoice_client_${item._id}`}
            onPress={() =>
              navigation.navigate(MainStackRouteNames.InvoiceSearch, {
                title: item?.client?.name || 'None',
                request: {
                  clients: item?.client?._id ? [item?.client?._id] : [null],
                  statuses: [InvoiceStatus.Unpaid, InvoiceStatus.Paid],
                },
              })
            }
            style={styles.shadowCard}>
            <Card containerStyle={styles.card}>
              <Text style={styles.clientName}>
                {item?.client?.name || 'None'}
              </Text>
              <Text style={styles.clientSum}>
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
  shadowCard: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  clientName: {
    ...font(14, 16, '500'),
    color: colors.text.darkGrayText,
    flex: 1,
  },
  clientSum: {
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
