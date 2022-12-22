import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Header} from '../components/Header';
import {PageContainer} from '../components/PageContainer';
import {Card} from '../components/Card';
import {AccountIcon} from '../components/icons/AccountIcon';
import {font} from '../styles/font';
import {colors} from '../styles/colors';
import {ArrowLeftIcon} from '../components/icons/ArrowLeftIcon';
import {BusinessInfoIcon} from '../components/icons/BusinessInfoIcon';
import {TermsIcon} from '../components/icons/TermsIcon';
import {PrivacyIcon} from '../components/icons/PrivacyIcon';
import {ContactUsIcon} from '../components/icons/ContactUsIcon';
import {SettingsStackRouteNames} from '../navigation/router-names';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SettingRouterParamList} from '../navigation/SettingsStackNavigator';

type Props = {
  navigation: NativeStackNavigationProp<SettingRouterParamList>;
};

export const Settings: React.FC<Props> = ({navigation}) => {
  const items = [
    {
      icon: <AccountIcon />,
      name: 'Account',
      onPress: () => navigation.navigate(SettingsStackRouteNames.Account),
    },
    {
      icon: <BusinessInfoIcon />,
      name: 'Business Info',
      onPress: () => navigation.navigate(SettingsStackRouteNames.BusinessInfo),
    },
    {
      icon: <TermsIcon />,
      name: 'Terms & Conditions',
      onPress: () => navigation.navigate(SettingsStackRouteNames.Terms),
    },
    {
      icon: <PrivacyIcon />,
      name: 'Privacy',
      onPress: () => navigation.navigate(SettingsStackRouteNames.Privacy),
    },
    {
      icon: <ContactUsIcon />,
      name: 'Contact Us',
      onPress: () => navigation.navigate(SettingsStackRouteNames.ContactUs),
    },
  ];

  return (
    <View style={styles.container}>
      <Header title={'Settings'} />
      <PageContainer>
        <ScrollView style={styles.scrollContainer}>
          {items.map(item => (
            <Card
              key={item.name}
              onPress={item.onPress}
              containerStyle={styles.menuItem}>
              {item.icon}
              <Text style={styles.menuTitle}>{item.name}</Text>
              <View style={styles.icon}>
                <ArrowLeftIcon />
              </View>
            </Card>
          ))}
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    transform: [
      {
        rotate: '180deg',
      },
    ],
  },
  menuTitle: {
    flex: 1,
    paddingLeft: 12,
    ...font(14),
    color: colors.text.grayText,
  },
});
