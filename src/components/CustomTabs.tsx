import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../styles/colors';
import {font} from '../styles/font';
import {InvoicesCorner} from './icons/InvoicesCorner';

type Props = {
  tabs: [string];
  active: string;
  setActiveTab: () => void;
};

export const CustomTabs: React.FC<Props> = ({tabs, active, setActiveTab}) => {
  return (
    <View style={styles.tabsContainer}>
      {tabs.map((item, index) => (
        <View key={index} style={{position: 'relative'}}>
          {active === item && (
            <View style={styles.cornerLeft}>
              <InvoicesCorner color={colors.screenBackground} />
            </View>
          )}
          <TouchableOpacity
            style={active === item ? styles.tabBoxActive : styles.tabBox}
            onPress={() => setActiveTab(item)}>
            <Text
              style={[
                styles.text,
                {color: active === item ? colors.text.blue : colors.whiteColor},
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
          {active === item && (
            <View style={styles.cornerRight}>
              <InvoicesCorner color={colors.screenBackground} />
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBox: {
    paddingTop: 20,
    paddingBottom: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  tabBoxActive: {
    paddingTop: 20,
    paddingBottom: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: colors.whiteColor,
  },
  text: {
    paddingHorizontal: 32,
    color: colors.text.blue,
    ...font(16, 18, '500'),
  },
  cornerLeft: {
    position: 'absolute',
    bottom: -1,
    left: -15,
    width: 17,
    height: 16,
    transform: [{rotate: '270deg'}],
  },
  cornerRight: {
    position: 'absolute',
    bottom: -1,
    right: -16,
    width: 17,
    height: 16,
  },
});
