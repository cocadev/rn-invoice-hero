import React from 'react';
import {commonInput} from '../../styles/common';
import {KeyboardType, StyleSheet, TextInput, ViewStyle} from 'react-native';
import {FormField} from '../FormField';
import {useField} from 'formik';

type Props = {
  label?: string;
  name: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  inputIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  cardStyle?: ViewStyle;
  labelStyle?: ViewStyle;
  keyboardType?: KeyboardType;
  onManualChange?: (val: string) => void;
};

export const InputField: React.FC<Props> = ({
  label,
  name,
  secureTextEntry = false,
  containerStyle = {},
  inputIcon,
  cardStyle,
  labelStyle,
  placeholder,
  onManualChange,
  keyboardType = 'default',
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <FormField
      label={label}
      containerStyle={{
        ...styles.field,
        ...containerStyle,
      }}
      labelStyle={labelStyle}
      cardStyle={[
        commonInput.container,
        meta.touched && meta.error ? commonInput.containerError : {},
        cardStyle ? cardStyle : {},
      ]}>
      {Boolean(inputIcon) && inputIcon}
      <TextInput
        secureTextEntry={secureTextEntry}
        onChangeText={val => {
          helpers.setValue(val);
          if (onManualChange) {
            onManualChange(val);
          }
        }}
        placeholder={placeholder || ''}
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        style={commonInput.input}
        keyboardType={keyboardType}
      />
    </FormField>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
});
