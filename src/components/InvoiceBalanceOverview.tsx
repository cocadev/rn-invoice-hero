import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {loadInvoiceBalanceOverview} from '../store/thunk/invoices';
import {BalanceOverview, InvoiceStatus} from '../models/invoice';
import {currencyFormatter} from '../utils/currency';
import {selectInvoiceBalanceOverview} from '../store/selectors/invoices';
import {colors} from '../styles/colors';
import {Card} from './Card';
import {useNavigation} from '@react-navigation/native';
import {MainStackRouteNames} from '../navigation/router-names';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../navigation/MainStackNavigator';
import {commonView} from '../styles/common';
import {font} from '../styles/font';

type Props = {
  statuses: InvoiceStatus[];
};

const gap = 20;
const itemPerRow = 2;
const totalGapSize = (itemPerRow - 1) * gap;
const windowWidth = Dimensions.get('window').width - 48;
const childWidth = (windowWidth - totalGapSize) / itemPerRow;

export const InvoiceBalanceOverview: React.FC<Props> = ({
  statuses = [InvoiceStatus.Paid, InvoiceStatus.Unpaid],
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const dispatch = useDispatch<any>();
  const balanceOverview = useSelector(selectInvoiceBalanceOverview);

  useEffect(() => {
    dispatch(
      loadInvoiceBalanceOverview({
        statuses,
      }),
    );
  }, []);

  const getStyle = (type: InvoiceStatus) => {
    switch (type) {
      case InvoiceStatus.Paid:
        return styles.Paid;
      case InvoiceStatus.Unpaid:
        return styles.Unpaid;
      default:
        return null;
    }
  };

  if (balanceOverview.loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={'large'} color={colors.bluePrimary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {balanceOverview.result.map((item: BalanceOverview) => {
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate(MainStackRouteNames.InvoiceList, {
                activeTab: item._id,
              })
            }
            key={`balance_${item._id}`}>
            <Card
              containerStyle={[styles.balanceBlock, commonView.commonShadow]}>
              <Text style={styles.balanceBlockTitle}>{item._id} Invoices</Text>
              <Text
                style={[
                  styles.balanceBlockValue,
                  getStyle(item._id as InvoiceStatus),
                ]}>
                {currencyFormatter.format(item?.sum)}
              </Text>
            </Card>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginVertical: -(gap / 2),
    marginHorizontal: -(gap / 2),
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  touchable: {},
  balanceBlock: {
    width: childWidth,
    marginVertical: gap / 2,
    marginHorizontal: gap / 2,
  },
  balanceBlockTitle: {
    ...font(12, 18),
    color: colors.text.grayText,
    marginBottom: 2,
  },
  balanceBlockValue: {
    ...font(16, 24, '500'),
  },
  Paid: {
    color: colors.text.green,
  },
  Unpaid: {
    color: colors.text.red,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
