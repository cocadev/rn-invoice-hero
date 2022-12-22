import React from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import {Card} from './Card';
import {colors} from '../styles/colors';
import {font} from '../styles/font';

type Props = {
  label?: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  labelStyle?: ViewStyle;
  cardStyle?: ViewStyle | ViewStyle[];
  onPress?: () => void;
};

export const FormField: React.FC<Props> = ({
  label,
  children,
  containerStyle,
  cardStyle,
  labelStyle,
  onPress,
}) => {
  return (
    <View style={Boolean(containerStyle) && containerStyle}>
      {Boolean(label) && (
        <Text style={[styles.label, Boolean(labelStyle) && labelStyle]}>
          {label}
        </Text>
      )}
      <Card containerStyle={cardStyle} onPress={onPress}>
        {children}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    ...font(16, 24),
    marginBottom: 8,
    paddingHorizontal: 24,
    color: colors.text.grayText,
  },
});
