import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {RouteProp} from '@react-navigation/native';
import {MainStackRouteNames} from '../navigation/router-names';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BalanceOverview, DateOverview, InvoiceStatus} from '../models/invoice';
import {MainStackParamList} from '../navigation/MainStackNavigator';
import {Card} from '../components/Card';
import {InvoiceSmallCard} from '../components/InvoiceSmallCard';
import {colors} from '../styles/colors';
import {useDispatch, useSelector} from 'react-redux';
import {loadListInvoice} from '../store/thunk/invoices';
import {
  selectInvoiceBalanceOverview,
  selectListInvoice,
} from '../store/selectors/invoices';
import {clearListInvoice} from '../store/reducers/invoices';
import {currencyFormatter} from '../utils/currency';
import {EmptyResult} from '../components/EmptyResult';
import {font} from '../styles/font';

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.InvoiceList>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.InvoiceList
  >;
};

const tabs = [
  {
    label: 'All',
    value: null,
  },
  {
    label: 'Paid',
    value: InvoiceStatus.Paid,
  },
  {
    label: 'Unpaid',
    value: InvoiceStatus.Unpaid,
  },
  {
    label: 'Estimate',
    value: InvoiceStatus.Estimate,
  },
];

export const InvoiceList: React.FC<Props> = ({route}) => {
  const dispatch = useDispatch<any>();
  const [activeTab, setActiveTab] = useState(route?.params?.activeTab || null);
  const [page, setPage] = useState(1);

  const invoices = useSelector(selectListInvoice);
  const balanceOverview = useSelector(selectInvoiceBalanceOverview);

  useEffect(() => {
    return () => dispatch(clearListInvoice());
  }, []);

  useEffect(() => {
    dispatch(
      loadListInvoice({
        statuses: activeTab
          ? [activeTab]
          : [InvoiceStatus.Paid, InvoiceStatus.Unpaid],
        page,
      }),
    );
  }, [page, activeTab]);

  const total = useMemo(() => {
    if (!activeTab) {
      return (balanceOverview.result as BalanceOverview[]).reduce((a, c) => {
        if (c._id === InvoiceStatus.Unpaid || c._id === InvoiceStatus.Paid) {
          return a + c.sum;
        }

        return a;
      }, 0);
    }

    const foundedBalance = (balanceOverview.result as BalanceOverview[]).find(
      b => b._id === activeTab,
    );

    return foundedBalance ? foundedBalance.sum : 0;
  }, [activeTab, balanceOverview]);

  const tabLabel = useMemo(() => {
    return tabs.find(t => t.value === activeTab);
  }, [activeTab]);

  const renderItem = useCallback(({item}: any) => {
    return <InvoiceSmallCard item={item} />;
  }, []);

  const listHeaderComponent = useMemo(() => {
    return (
      <Card containerStyle={styles.shadowCard}>
        <Text style={styles.labelText}>Total</Text>
        <Text style={styles.totalText}>{currencyFormatter.format(total)}</Text>
      </Card>
    );
  }, [total]);

  return (
    <View style={styles.container}>
      <Header title={`${tabLabel?.label} Invoices`} showBackBtn={true} />
      <PageContainer>
        {page === 1 && invoices.loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={'large'} color={colors.bluePrimary} />
          </View>
        ) : (
          <FlatList<DateOverview>
            style={styles.scrollContainer}
            contentContainerStyle={{
              paddingTop: 20,
            }}
            data={invoices.result as DateOverview[]}
            renderItem={renderItem}
            ListEmptyComponent={<EmptyResult />}
            onEndReached={() => {
              if (invoices.loading || !invoices.next) {
                return;
              }

              setPage(state => state + 1);
            }}
            ListHeaderComponent={listHeaderComponent}
          />
        )}
      </PageContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    marginHorizontal: 24,
  },
  labelText: {
    ...font(14, 16),
    color: colors.text.grayText,
  },
  totalText: {
    ...font(16, 18, '500'),
    color: colors.text.darkGrayText,
  },
});
