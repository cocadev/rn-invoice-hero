import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Formik} from 'formik';
import {AuthLayout} from '../components/AuthLayout';
import {Button} from '../components/Button';
import {colors} from '../styles/colors';
import {font} from '../styles/font';
import {AuthStackNavigatorName} from '../navigation/router-names';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthRouterParamList} from '../navigation/AuthStackNavigator';
import * as Yup from 'yup';
import {InputField} from '../components/form/InputField';
import {useDispatch, useSelector} from 'react-redux';
import {signIn} from '../store/thunk/user';
import {AppDispatch} from '../store/store';
import {AnyAction} from 'redux';
import {selectSignIn} from '../store/selectors/user';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {LoginButton, AccessToken} from 'react-native-fbsdk';

const initialValues = {
  email: '',
  password: '',
};

type Props = {
  navigation: NativeStackNavigationProp<AuthRouterParamList>;
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required('Required Field'),
  password: Yup.string().required('Required Field'),
});

const onGoogleSign = async () => {
  GoogleSignin.configure({
    offlineAccess: false,
    webClientId: '57002573218-6v86g1cq8256g74o05l36amubabpgrpt.apps.googleusercontent.com',
    androidClientId: '57002573218-6v86g1cq8256g74o05l36amubabpgrpt.apps.googleusercontent.com',
    iosClientId: '57002573218-6v86g1cq8256g74o05l36amubabpgrpt.apps.googleusercontent.com',
  });
  GoogleSignin.hasPlayServices()
    .then(hasPlayService => {
      if (hasPlayService) {
        GoogleSignin.signIn()
          .then(userInfo => {
            console.log(JSON.stringify(userInfo));
          })
          .catch(e => {
            console.log('ERROR IS: ' + JSON.stringify(e));
          });
      }
    })
    .catch(e => {
      console.log('ERROR IS: ' + JSON.stringify(e));
    });
};

export const SignIn: React.FC<Props> = ({navigation}) => {
  const signInStore = useSelector(selectSignIn);

  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = (values: any): any => {
    dispatch(
      signIn({
        ...values,
        email: values.email?.toLowerCase(),
      }) as unknown as AnyAction,
    );
  };

  return (
    <AuthLayout>
      <Text style={styles.pageTitle}>Sign In</Text>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        validateOnMount={true}
        onSubmit={onSubmit}>
        {({handleSubmit, isValid}) => (
          <>
            <View style={styles.formContainer}>
              <InputField label={'Email'} name={'email'} />
              <InputField
                label={'Password'}
                name={'password'}
                secureTextEntry={true}
              />
              <View style={styles.forgotPasswordBlock}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate(AuthStackNavigatorName.ForgotPassword)
                  }>
                  <Text style={styles.forgotPasswordText}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.actionContainer}>
              <Button
                text={'Sign in'}
                disabled={!isValid}
                onPress={handleSubmit}
                loading={signInStore.loading}
              />
            </View>
            {/* <View style={[styles.actionContainer, {marginTop: 12}]}>
              <Button
                text={'Google Sign in'}
                // disabled={!isValid}
                onPress={onGoogleSign}
                // loading={signInStore.loading}
              />
            </View> */}
            {/* <LoginButton
              style={styles.fbBtn}
              onLoginFinished={(error, result) => {
                if (error) {
                  console.log('login has error: ' + result.error);
                } else if (result.isCancelled) {
                  console.log('login is cancelled.');
                } else {
                  AccessToken.getCurrentAccessToken().then(data => {
                    console.log(data.accessToken.toString());
                  });
                }
              }}
              onLogoutFinished={() => console.log('logout.')}
            /> */}
          </>
        )}
      </Formik>
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate(AuthStackNavigatorName.SignUp)}>
          <Text style={[styles.signUpText, styles.signUpLink]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageTitle: {
    ...font(23, 36, '600'),
    color: colors.bluePrimary,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  formContainer: {
    marginBottom: 15,
  },
  signUpContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: {
    color: colors.text.grayText,
    ...font(16, 18),
  },
  signUpLink: {
    ...font(14, 16, '500'),
    color: colors.bluePrimary,
    marginLeft: 4,
  },
  forgotPasswordBlock: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginTop: 8,
  },
  forgotPasswordText: {
    ...font(16, 24),
    color: colors.text.grayText,
  },
  actionContainer: {
    paddingHorizontal: 24,
  },
  fbBtn: {
    // width: '100%',
    // height: 50,
    marginTop: 12,
    marginHorizontal: 24,
    padding: 20,
  }
});
