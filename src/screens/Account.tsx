import React, {useMemo} from 'react';
import moment from 'moment';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {FormField} from '../components/FormField';
import {commonView} from '../styles/common';
import {ArrowLeftIcon} from '../components/icons/ArrowLeftIcon';
import {colors} from '../styles/colors';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser} from '../store/selectors/user';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SettingRouterParamList} from '../navigation/SettingsStackNavigator';
import {
  MainStackRouteNames,
  SettingsStackRouteNames,
} from '../navigation/router-names';
import {LogoutIcon} from '../components/icons/LogoutIcon';

import {clearStoreUser} from '../store/reducers/user';
import {clearStoreClients} from '../store/reducers/clients';
import {clearStoreCategories} from '../store/reducers/categories';
import {clearStoreBusiness} from '../store/reducers/business';
import {clearStoreInvoices} from '../store/reducers/invoices';
import {clearStorePayments} from '../store/reducers/payments';
import {font} from '../styles/font';
import {clearStoreSubscriptions} from '../store/reducers/subscription';

type Props = {
  navigation: NativeStackNavigationProp<SettingRouterParamList>;
};

export const Account: React.FC<Props> = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const onPasswordChange = () => {
    navigation.navigate(SettingsStackRouteNames.ChangePassword);
  };

  const logout = () => {
    dispatch(clearStoreUser());
    dispatch(clearStoreClients());
    dispatch(clearStoreCategories());
    dispatch(clearStoreBusiness());
    dispatch(clearStoreInvoices());
    dispatch(clearStorePayments());
    dispatch(clearStoreSubscriptions());
  };

  const subscriptionExist = useMemo(() => {
    return (
      user?.subscriptionEndAt && moment().isBefore(user?.subscriptionEndAt)
    );
  }, [user]);

  return (
    <View style={styles.container}>
      <Header title={'Account'} showBackBtn={true} />
      <PageContainer>
        <ScrollView style={styles.scrollContainer}>
          <FormField label={'Email'} containerStyle={styles.field}>
            <Text style={commonView.cardRowValue}>{user?.email}</Text>
          </FormField>
          <FormField
            onPress={onPasswordChange}
            label={'Password'}
            containerStyle={styles.field}>
            <View style={styles.row}>
              <Text style={commonView.cardRowValue}>Change password</Text>
              <View style={styles.rowIcon}>
                <ArrowLeftIcon size={20} color={colors.gray} />
              </View>
            </View>
          </FormField>
          <FormField
            onPress={() => {
              if (!subscriptionExist) {
                navigation.navigate(MainStackRouteNames.SubscriptionModal);
              }
            }}
            label={'Subscription'}
            containerStyle={styles.field}>
            <Text style={commonView.cardRowValue}>
              {subscriptionExist
                ? `Subscription end at ${moment(user?.subscriptionEndAt).format(
                    'LT l',
                  )}`
                : 'No subscription'}
            </Text>
          </FormField>
          <FormField label={'Sync'} containerStyle={styles.field}>
            <View style={styles.row}>
              <Text style={commonView.cardRowValue}>
                {user
                  ? `Last update ${moment(
                      user.updatedAt || user.createdAt,
                    ).format('LT l')}`
                  : ''}
              </Text>
            </View>
          </FormField>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={logout}
            style={styles.logoutContainer}>
            <LogoutIcon />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
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
    paddingVertical: 15,
  },
  field: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowIcon: {
    flexShrink: 0,
    transform: [
      {
        rotate: '180deg',
      },
    ],
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 32,
  },
  logoutText: {
    marginLeft: 5,
    ...font(16, 19, '500'),
    color: colors.bluePrimary,
  },
});
