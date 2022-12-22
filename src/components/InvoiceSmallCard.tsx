import React from 'react';
import {MainStackRouteNames} from '../navigation/router-names';
import {Card} from './Card';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {currencyFormatter} from '../utils/currency';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {DateOverview, Invoice, InvoiceStatus} from '../models/invoice';
import {colors} from '../styles/colors';
import {font} from '../styles/font';

type Props = {
  item:
    | (Invoice & {
        client: {
          name: string;
        };
      })
    | DateOverview;
};

export const InvoiceSmallCard: React.FC<Props> = React.memo(({item}) => {
  const navigation = useNavigation<any>();

  const getStyleForStatusContainer = (
    status: InvoiceStatus,
  ): {block: ViewStyle; text: TextStyle} => {
    switch (status) {
      case InvoiceStatus.Paid:
        return {block: styles.paidBlock, text: styles.paidText};
      case InvoiceStatus.Unpaid:
        return {block: styles.unpaidBlock, text: styles.unpaidText};
      case InvoiceStatus.Estimate:
      default:
        return {block: styles.estimateBlock, text: styles.estimateText};
    }
  };

  const {block, text} = getStyleForStatusContainer(item.status);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate(MainStackRouteNames.InvoiceSingle, {
          title: item.number,
          id: item._id,
          estimate: item.status === InvoiceStatus.Estimate,
        })
      }>
      <Card containerStyle={styles.shadowCard}>
        <View style={styles.cardInnerContainerRow}>
          <View>
            <Text style={styles.invoiceNumber}>Invoice #{item?.number}</Text>
            <Text style={styles.invoiceClient}>
              {item?.client?.name || '-'}
            </Text>
          </View>
          <Text style={styles.invoiceSum}>
            {currencyFormatter.format(item.total || 0)}
          </Text>
        </View>
        <View style={[styles.cardInnerContainerRow, {marginTop: 10}]}>
          <Text style={styles.invoiceDate}>
            {moment(item.date).format('MMM DD, yyyy')}
          </Text>
          <View style={[styles.invoiceStatusBlock, block]}>
            <Text style={[styles.invoiceStatusText, text]}>{item.status}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  shadowCard: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 6,
    marginHorizontal: 24,
  },
  cardInnerContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceNumber: {
    color: colors.text.darkGrayText,
    ...font(12, 18, '500'),
  },
  invoiceClient: {
    color: colors.text.darkGrayText,
    ...font(14, 21, '600'),
  },
  invoiceDate: {
    color: colors.text.darkGrayText,
    ...font(14, 21, '500'),
  },
  invoiceSum: {
    color: colors.text.darkGrayText,
    ...font(20, 30, '600'),
  },
  invoiceStatusBlock: {
    height: 27,
    paddingHorizontal: 13,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoiceStatusText: {
    ...font(14, 16, '600'),
  },
  unpaidBlock: {
    backgroundColor: colors.lightRed,
  },
  paidBlock: {
    backgroundColor: colors.lightGreen,
  },
  estimateBlock: {},
  unpaidText: {
    color: colors.red,
  },
  paidText: {
    color: colors.green,
  },
  estimateText: {},
});
