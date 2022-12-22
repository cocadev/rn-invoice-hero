import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainStackRouteNames} from './router-names';
import {MainBottomTabs} from './MainBottomTabs';
import {useDispatch} from 'react-redux';
import {getUser} from '../store/thunk/user';
import {loadClients} from '../store/thunk/clients';
import {loadCategories} from '../store/thunk/categories';
import {InvoiceStatus} from '../models/invoice';
import {InvoiceList} from '../screens/InvoiceList';
import {InvoiceSingle} from '../screens/InvoiceSingle';
import {InvoiceOverview} from '../dto/invoices';
import {InvoiceSearch} from '../screens/InvoiceSearch';
import {Notifications} from '../screens/Notifications';
import {AddPopup} from '../screens/AddPopup';
import {InvoiceCreate} from '../screens/InvoiceCreate';
import {DropDownList} from '../screens/DropDownList';
import {AddInvoiceDate} from '../screens/AddInvoiceDate';
import {AddInvoiceItems} from '../screens/AddInvoiceItems';
import {AddInvoicePayments} from '../screens/AddInvoicePayments';
import {AddInvoiceDelivery} from '../screens/AddInvoiceDelivery';
import {loadPayments} from '../store/thunk/payments';
import {AddInvoiceCustoms} from '../screens/AddInvoiceCustomts';
import {AddInvoiceAttachments} from '../screens/AddInvoiceAttachments';
import {getInvoiceCount} from '../store/thunk/invoices';
import {ClientCreate} from '../screens/ClientCreate';
import {AddAddress} from '../screens/AddAddress';
import {SearchPopup} from '../screens/SearchPopup';
import {SubscriptionModal} from '../screens/SubscriptionModal';
import {loadSubscriptions} from '../store/thunk/subscriptions';
import {useConfigureInAppPurchase} from '../hooks/use-configure-iap';

export type MainStackParamList = {
  [MainStackRouteNames.MainBottomTabs]: any;
  [MainStackRouteNames.Notifications]: any;
  [MainStackRouteNames.AddPopup]: undefined;
  [MainStackRouteNames.SearchPopup]: undefined;
  [MainStackRouteNames.SubscriptionModal]: undefined;
  [MainStackRouteNames.InvoiceCreate]: any;
  [MainStackRouteNames.InvoiceCreate]: any;
  [MainStackRouteNames.ClientCreate]: {
    value?: any;
    backScreen: MainStackRouteNames;
    returnValueName: string;
  };
  [MainStackRouteNames.AddAddress]: {
    backScreen: MainStackRouteNames;
    returnValueName: string;
  };
  [MainStackRouteNames.AddInvoiceDate]: {
    value?: any;
    backScreen: MainStackRouteNames;
    returnValueName: string;
    recurringPeriod?: any;
  };
  [MainStackRouteNames.AddInvoiceItems]: {
    value?: any;
    backScreen: MainStackRouteNames;
    returnValueName: string;
    category?: string;
  };
  [MainStackRouteNames.AddInvoicePayments]: {
    value?: string[];
    backScreen: MainStackRouteNames;
    returnValueName: string;
  };
  [MainStackRouteNames.AddInvoiceAttachments]: {
    value?: any;
    backScreen: MainStackRouteNames;
    returnValueName: string;
  };
  [MainStackRouteNames.AddInvoiceCustoms]: {
    value?: any;
    backScreen: MainStackRouteNames;
    returnValueName: string;
  };
  [MainStackRouteNames.AddInvoiceDelivery]: {
    value?: any;
    backScreen: MainStackRouteNames;
    returnValueName: string;
  };
  [MainStackRouteNames.DropDownList]: {
    title: string;
    list: any[];
    selectedValue?: any;
    returnValueName: string;
    backScreen: MainStackRouteNames;
  };
  [MainStackRouteNames.InvoiceList]: {
    showTabs?: boolean;
    activeTab?: InvoiceStatus | null;
  };
  [MainStackRouteNames.InvoiceSingle]: {
    title: string;
    id: string;
    estimate?: boolean;
  };
  [MainStackRouteNames.InvoiceSearch]: {
    title: string;
    request: InvoiceOverview;
  };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStackNavigator: React.FC<{}> = () => {
  const dispatch = useDispatch<any>();
  useConfigureInAppPurchase();

  useEffect(() => {
    dispatch(getUser());
    dispatch(loadClients());
    dispatch(loadCategories());
    dispatch(loadPayments());
    dispatch(getInvoiceCount());
    dispatch(loadSubscriptions());
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={MainStackRouteNames.MainBottomTabs}>
      <Stack.Screen
        name={MainStackRouteNames.MainBottomTabs}
        component={MainBottomTabs}
      />
      <Stack.Screen
        component={ClientCreate}
        name={MainStackRouteNames.ClientCreate}
      />
      <Stack.Screen
        component={AddAddress}
        name={MainStackRouteNames.AddAddress}
      />
      <Stack.Screen
        component={InvoiceList}
        name={MainStackRouteNames.InvoiceList}
      />
      <Stack.Screen
        component={InvoiceSingle}
        name={MainStackRouteNames.InvoiceSingle}
      />
      <Stack.Screen
        component={InvoiceCreate}
        name={MainStackRouteNames.InvoiceCreate}
      />
      <Stack.Screen
        component={InvoiceSearch}
        name={MainStackRouteNames.InvoiceSearch}
      />
      <Stack.Screen
        component={Notifications}
        name={MainStackRouteNames.Notifications}
      />
      <Stack.Screen
        component={SubscriptionModal}
        name={MainStackRouteNames.SubscriptionModal}
        options={{
          presentation: 'transparentModal',
          animation: 'none',
        }}
      />
      <Stack.Screen
        component={DropDownList}
        name={MainStackRouteNames.DropDownList}
      />
      <Stack.Screen
        component={AddInvoiceDate}
        name={MainStackRouteNames.AddInvoiceDate}
      />
      <Stack.Screen
        component={AddInvoiceItems}
        name={MainStackRouteNames.AddInvoiceItems}
      />
      <Stack.Screen
        component={AddInvoicePayments}
        name={MainStackRouteNames.AddInvoicePayments}
      />
      <Stack.Screen
        component={AddInvoiceDelivery}
        name={MainStackRouteNames.AddInvoiceDelivery}
      />
      <Stack.Screen
        component={AddInvoiceCustoms}
        name={MainStackRouteNames.AddInvoiceCustoms}
      />
      <Stack.Screen
        component={AddInvoiceAttachments}
        name={MainStackRouteNames.AddInvoiceAttachments}
      />
      <Stack.Screen
        name={MainStackRouteNames.AddPopup}
        component={AddPopup}
        options={{
          presentation: 'transparentModal',
          animation: 'none',
        }}
      />
      <Stack.Screen
        name={MainStackRouteNames.SearchPopup}
        component={SearchPopup}
        options={{
          presentation: 'transparentModal',
          animation: 'none',
        }}
      />
    </Stack.Navigator>
  );
};
