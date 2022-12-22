import React from 'react';
import {AuthStackNavigatorName} from './router-names';
import {SignIn} from '../screens/SignIn';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ForgotPassword} from '../screens/ForgotPassword';
import {SignUp} from '../screens/SignUp';

export type AuthRouterParamList = {
  [AuthStackNavigatorName.SignIn]: any;
  [AuthStackNavigatorName.SignUp]: any;
  [AuthStackNavigatorName.ForgotPassword]: any;
};

const Stack = createNativeStackNavigator<AuthRouterParamList>();

export const AuthStackNavigator: React.FC<{}> = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={AuthStackNavigatorName.SignIn}>
      <Stack.Screen name={AuthStackNavigatorName.SignIn} component={SignIn} />
      <Stack.Screen name={AuthStackNavigatorName.SignUp} component={SignUp} />
      <Stack.Screen
        name={AuthStackNavigatorName.ForgotPassword}
        component={ForgotPassword}
      />
    </Stack.Navigator>
  );
};
