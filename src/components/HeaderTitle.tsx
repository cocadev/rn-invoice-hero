import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../styles/colors';
import {BackArrowIcon} from './icons/BackArrow';
import {useNavigation} from '@react-navigation/native';
import {CloseIcon} from './icons/CloseIcon';
import {font} from '../styles/font';

type Props = {
  title: string;
  showBackBtn?: boolean;
  showCloseBtn?: boolean;
  rightSideComponent?: React.ReactNode;
};

export const HeaderTitle: React.FC<Props> = ({
  title,
  showBackBtn,
  showCloseBtn,
  rightSideComponent,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {Boolean(showBackBtn) && (
        <TouchableOpacity onPress={navigation.goBack} style={styles.icon}>
          <BackArrowIcon />
        </TouchableOpacity>
      )}
      {Boolean(showCloseBtn) && (
        <TouchableOpacity onPress={navigation.goBack} style={styles.icon}>
          <CloseIcon />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {Boolean(rightSideComponent) && rightSideComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 76,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    flex: 1,
    ...font(22, 26, '500'),
    color: colors.text.whiteText,
    top: 1,
  },
});
