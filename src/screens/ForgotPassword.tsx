import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {Formik} from 'formik';
import {AuthLayout} from '../components/AuthLayout';
import {BtnType, Button} from '../components/Button';
import {colors} from '../styles/colors';
import {FormField} from '../components/FormField';
import {commonInput, commonText} from '../styles/common';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthRouterParamList} from '../navigation/AuthStackNavigator';
import {font} from '../styles/font';

const initialValues = {
  email: '',
};

type Props = {
  navigation: NativeStackNavigationProp<AuthRouterParamList>;
};

export const ForgotPassword: React.FC<Props> = ({navigation}) => {
  const onSubmit = (values: any): any => {
    console.log(values);
  };

  return (
    <AuthLayout>
      <View style={styles.topBlock}>
        <Text style={styles.pageTitle}>Reset password</Text>
        <Text style={commonText.paragraphText}>
          We will send you an email with a link to reset your password
        </Text>
      </View>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <>
            <View style={styles.formContainer}>
              <FormField
                label={'Email'}
                containerStyle={styles.field}
                cardStyle={commonInput.container}>
                <TextInput
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  style={commonInput.input}
                />
              </FormField>
            </View>
            <View style={styles.actionContainer}>
              <Button
                text={'Reset Password'}
                onPress={handleSubmit}
                containerStyle={{marginBottom: 16}}
              />
              <Button
                text={'Cancel'}
                type={BtnType.Outlined}
                onPress={() => navigation.goBack()}
              />
            </View>
          </>
        )}
      </Formik>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  field: {
    marginBottom: 16,
  },
  topBlock: {
    paddingHorizontal: 24,
  },
  pageTitle: {
    ...font(24, 36, '600'),
    color: colors.bluePrimary,
    marginBottom: 16,
  },
  formContainer: {
    marginBottom: 10,
  },
  actionContainer: {
    paddingHorizontal: 24,
  },
});
