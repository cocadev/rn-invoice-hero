import React, {useMemo} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainBottomTabsRouteNames, MainStackRouteNames} from './router-names';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NavigationHelpers, TabNavigationState} from '@react-navigation/native';
import {BottomTabDescriptorMap} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {colors, gradients} from '../styles/colors';
import {getBottomTabPath} from '../helpers/path';
import LinearGradientComponent from 'react-native-linear-gradient';
import Svg, {Defs, LinearGradient, Path, Stop} from 'react-native-svg';
import {HomeIcon} from '../components/icons/HomeIcon';
import {InvoicesIcon} from '../components/icons/InvoicesIcon';
import {EstimateIcon} from '../components/icons/EstimateIcon';
import {SettingsIcon} from '../components/icons/SettingsIcon';
import {PlusIcon} from '../components/icons/PlusIcon';
import {Home} from '../screens/Home';
import {SettingsStackNavigator} from './SettingsStackNavigator';
import {Invoices} from '../screens/Invoices';
import {font} from '../styles/font';

const windowWidth = Dimensions.get('window').width;

const centerButtonWidth = 66;

export type MainBottomTabsParamList = {
  [MainBottomTabsRouteNames.Home]: any;
  [MainBottomTabsRouteNames.Invoices]: {
    left?: boolean;
    right?: boolean;
    estimates?: boolean;
  };
  [MainBottomTabsRouteNames.Estimate]: {
    left?: boolean;
    right?: boolean;
    estimates?: boolean;
  };
  [MainBottomTabsRouteNames.Settings]: any;
};

const BottomTabs = createBottomTabNavigator<MainBottomTabsParamList>();

const getIcon = (routeName: MainBottomTabsRouteNames) => {
  switch (routeName) {
    case MainBottomTabsRouteNames.Home:
      return <HomeIcon size={24} color={colors.whiteColor} />;
    case MainBottomTabsRouteNames.Invoices:
      return <InvoicesIcon size={24} color={colors.whiteColor} />;
    case MainBottomTabsRouteNames.Estimate:
      return <EstimateIcon size={24} color={colors.whiteColor} />;
    case MainBottomTabsRouteNames.Settings:
      return <SettingsIcon size={24} color={colors.whiteColor} />;
    default:
      return null;
  }
};

const TabBar: React.FC<{
  state: TabNavigationState<any>;
  descriptors: BottomTabDescriptorMap;
  navigation: NavigationHelpers<any>;
}> = ({state, navigation}) => {
  const insets = useSafeAreaInsets();
  const h = 78 + insets.bottom;

  const leftSide = state.routes.filter(route => route.params?.left === true);
  const rightSide = state.routes.filter(route => route.params?.right === true);

  const activeTabKey = state.routes[state.index].key;

  const d = useMemo(
    () => getBottomTabPath(windowWidth, h, centerButtonWidth),
    [h],
  );

  const onPress = (route: any) => {
    const options: any = {};
    if (route.state?.routeNames?.length) {
      options.screen = route.state?.routeNames[0];
    }

    navigation.navigate(route.name, {...options});
  };

  const displayItem = (route: any) => {
    return (
      <TouchableOpacity
        onPress={() => onPress(route)}
        activeOpacity={0.6}
        key={route.key}
        style={[styles.menuItem, activeTabKey !== route.key && {opacity: 0.7}]}>
        {getIcon(route.name)}
        <Text
          style={[
            styles.menuItemText,
            // activeTabKey === route.key && {fontWeight: '500'},
          ]}>
          {route.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.bottomTabNavigatorContainer,
        {height: h, paddingBottom: insets.bottom},
      ]}>
      <Svg
        width={windowWidth}
        height={h}
        style={styles.bottomTabNavigatorBackground}>
        <Path
          fill="url(#paint0_linear_1288_7469)"
          stroke={'#dddddd'}
          strokeWidth={0}
          {...{d}}
        />
        <Defs>
          <LinearGradient
            id="paint0_linear_1288_7469"
            x1="0"
            y1="0"
            x2="55.5311"
            y2="192.623"
            gradientUnits="userSpaceOnUse">
            <Stop stopColor="#2D7AEA" />
            <Stop offset="1" stopColor="#6FABFF" />
          </LinearGradient>
        </Defs>
      </Svg>
      <View style={styles.menuItems}>
        {leftSide.map(route => displayItem(route))}
      </View>
      <View style={styles.centralContainer} />
      <View style={styles.menuItems}>
        {rightSide.map(route => displayItem(route))}
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate(MainStackRouteNames.AddPopup)}
        activeOpacity={0.6}
        style={styles.centralButtonBlock}>
        <LinearGradientComponent
          {...gradients.mainBlueGradient}
          style={styles.centralButton}>
          <PlusIcon size={27} color={colors.whiteColor} />
        </LinearGradientComponent>
      </TouchableOpacity>
    </View>
  );
};

export const MainBottomTabs = () => {
  return (
    <BottomTabs.Navigator tabBar={props => <TabBar {...props} />}>
      <BottomTabs.Screen
        component={Home}
        name={MainBottomTabsRouteNames.Home}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
        initialParams={{left: true}}
      />
      <BottomTabs.Screen
        component={Invoices}
        name={MainBottomTabsRouteNames.Invoices}
        initialParams={{left: true}}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <BottomTabs.Screen
        component={Invoices}
        name={MainBottomTabsRouteNames.Estimate}
        initialParams={{right: true, estimates: true}}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <BottomTabs.Screen
        component={SettingsStackNavigator}
        name={MainBottomTabsRouteNames.Settings}
        initialParams={{right: true}}
        options={{
          headerShown: false,
        }}
      />
    </BottomTabs.Navigator>
  );
};

const styles = StyleSheet.create({
  bottomTabNavigatorContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.screenBackground,
  },
  bottomTabNavigatorBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuItems: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  centralContainer: {
    width: 84,
    minHeight: 10,
  },
  centralButtonBlock: {
    width: centerButtonWidth,
    height: centerButtonWidth,
    position: 'absolute',
    top: -centerButtonWidth / 2,
    left: '50%',
    overflow: 'hidden',
    borderRadius: centerButtonWidth / 2,
    transform: [{translateX: -centerButtonWidth / 2}],
  },
  centralButton: {
    width: centerButtonWidth,
    height: centerButtonWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    ...font(13, 16, '500'),
    marginTop: 10,
    color: colors.whiteColor,
  },
});
