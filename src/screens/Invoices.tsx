import React, {useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {colors} from '../styles/colors';
import {InvoicesCorner} from '../components/icons/InvoicesCorner';
import {HeaderSearch} from '../components/HeaderSearch';
import {InvoiceBalanceOverview} from '../components/InvoiceBalanceOverview';
import {constants} from '../utils/constants';
import {Card} from '../components/Card';
import {ArrowDownIcon} from '../components/icons/ArrowDown';
import {InvoiceClientsOverview} from '../components/InvoiceClientsOverview';
import {useSelector} from 'react-redux';
import {selectClients} from '../store/selectors/clients';
import {HorizontalButtonsList} from '../components/HorizontalButtonsList';
import {selectCategories} from '../store/selectors/categories';
import {InvoiceCategoriesOverview} from '../components/InvoiceCategoriesOverview';
import {HeaderDateSelect} from '../components/HeaderDateSelect';
import {InvoiceDateOverview} from '../components/InvoiceDateOverview';
import {RouteProp} from '@react-navigation/native';
import {MainBottomTabsRouteNames} from '../navigation/router-names';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainBottomTabsParamList} from '../navigation/MainBottomTabs';
import {InvoiceStatus} from '../models/invoice';
import {font} from '../styles/font';

const tabs = ['All', 'Date', 'Categories', 'Clients'];

type Props = {
  route: RouteProp<
    MainBottomTabsParamList,
    MainBottomTabsRouteNames.Invoices | MainBottomTabsRouteNames.Estimate
  >;
  navigation: NativeStackNavigationProp<
    MainBottomTabsParamList,
    MainBottomTabsRouteNames.Invoices | MainBottomTabsRouteNames.Estimate
  >;
};

export const Invoices: React.FC<Props> = ({route}) => {
  const [showTabsList, setShowTabsList] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const [selectedClients, setSelectedClients] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [periodOfTime, setPeriodOfTime] = useState<any[] | null>(null);

  const clients = useSelector(selectClients);
  const categories = useSelector(selectCategories);

  const changeActiveTab = (tab: string) => {
    setShowTabsList(state => !state);
    setActiveTab(tab);

    setSelectedClients([]);
    setSelectedCategories([]);
    setPeriodOfTime(null);
  };

  const getHeaderContent = useMemo(() => {
    switch (activeTab) {
      case 'Date': {
        return (
          <HeaderDateSelect onDateChange={date => setPeriodOfTime(date)} />
        );
      }
      case 'Clients': {
        const formattedClients = clients.map(client => {
          return {label: client.name, value: client._id};
        });

        return (
          <HorizontalButtonsList
            data={formattedClients}
            onSelectedItemChange={result => setSelectedClients(result)}
          />
        );
      }
      case 'Categories': {
        const formattedCategories = categories.map(category => {
          return {label: category.name, value: category._id};
        });

        return (
          <HorizontalButtonsList
            data={formattedCategories}
            onSelectedItemChange={result => setSelectedCategories(result)}
          />
        );
      }
      default:
        return null;
    }
  }, [activeTab, clients, categories]);

  const getPageContent = useMemo(() => {
    switch (activeTab) {
      case 'All':
        return (
          <InvoiceBalanceOverview
            statuses={
              route.params.estimates
                ? [InvoiceStatus.Estimate]
                : [InvoiceStatus.Unpaid, InvoiceStatus.Paid]
            }
          />
        );
      case 'Clients':
        return (
          <InvoiceClientsOverview
            statuses={
              route.params.estimates
                ? [InvoiceStatus.Estimate]
                : [InvoiceStatus.Unpaid, InvoiceStatus.Paid]
            }
            clients={selectedClients}
          />
        );
      case 'Categories':
        return (
          <InvoiceCategoriesOverview
            statuses={
              route.params.estimates
                ? [InvoiceStatus.Estimate]
                : [InvoiceStatus.Unpaid, InvoiceStatus.Paid]
            }
            categories={selectedCategories}
          />
        );
      case 'Date':
        return (
          <InvoiceDateOverview
            statuses={
              route.params.estimates
                ? [InvoiceStatus.Estimate]
                : [InvoiceStatus.Unpaid, InvoiceStatus.Paid]
            }
            date={periodOfTime}
          />
        );
      default:
        return null;
    }
  }, [activeTab, selectedClients, selectedCategories, periodOfTime]);

  return (
    <View style={styles.container}>
      <Header title={route.params.estimates ? 'Estimates' : 'Invoices'}>
        <HeaderSearch />
        {getHeaderContent}
        <View style={styles.reviewContainer}>
          <View style={styles.reviewBlockTitle}>
            <Text style={styles.reviewByText}>Review by</Text>
          </View>
          <View style={styles.displayBlock}>
            <View style={styles.corner}>
              <InvoicesCorner color={colors.screenBackground} />
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.dropDownContainer}
              onPress={() => setShowTabsList(state => !state)}>
              <Text style={styles.displayBlockText}>{activeTab}</Text>
              <View style={showTabsList && styles.iconOpened}>
                <ArrowDownIcon />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Header>
      <PageContainer roundLeftTopBorder={false}>
        {showTabsList && (
          <Card containerStyle={styles.dropDownList}>
            {tabs.map(tab => {
              return (
                <TouchableOpacity
                  activeOpacity={0.5}
                  key={`elem_${tab}`}
                  onPress={() => changeActiveTab(tab)}
                  style={styles.dropDownListItem}>
                  <Text style={styles.dropDownListItemText}>{tab}</Text>
                </TouchableOpacity>
              );
            })}
          </Card>
        )}
        <ScrollView style={styles.content}>{getPageContent}</ScrollView>
      </PageContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reviewContainer: {
    height: 56,
    flexDirection: 'row',
    zIndex: 10,
    bottom: -5,
  },
  reviewBlockTitle: {
    backgroundColor: colors.screenBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    paddingLeft: 24,
    flex: 3,
  },
  reviewByText: {
    ...font(16, 18, '500'),
    color: colors.text.blue,
  },
  displayBlock: {
    flex: 4,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 24,
  },
  displayBlockText: {
    ...font(16, 18, '500'),
    color: colors.text.whiteText,
    marginRight: 8,
  },
  iconOpened: {
    transform: [
      {
        rotate: '180deg',
      },
    ],
  },
  corner: {
    position: 'absolute',
    bottom: -1,
    left: -1,
    width: 17,
    height: 16,
  },
  content: {
    flex: 1,
  },
  dropDownContainer: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropDownList: {
    position: 'absolute',
    top: -constants.pageContainerBorderHeight - 10,
    zIndex: 1,
    right: 24,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  dropDownListItem: {
    paddingHorizontal: 16,
    minWidth: 100,
    height: 40,
    justifyContent: 'center',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
  },
  dropDownListItemText: {
    color: colors.text.darkGrayText,
    ...font(14, 16),
  },
});
