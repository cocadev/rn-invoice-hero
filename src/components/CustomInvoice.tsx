import React, {useRef} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {colors} from '../styles/colors';
import {font} from '../styles/font';

type Props = {
  onSearch?: (val: string) => void;
};

export const CustomInvoice: React.FC<Props> = ({data, cData}) => {
  const {number, date, billTo, items} = data;
  // console.log('items:', items)

  console.log('billTo:', billTo);

  return (
    <View style={styles.container}>
      <View style={{backgroundColor: '#e5e5e5'}}>
        <View style={styles.header}>
          <Text style={styles.headerText1}>{billTo?.companyName}</Text>
          <Text style={styles.headerText2}>INVOICE</Text>
        </View>

        <View style={styles.box}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Invoice {number}</Text>
          </View>
          <View style={{flexDirection: 'row', paddingRight: 12}}>
            <Text style={{...font(14, 19, '700'), marginRight: 3}}>Date</Text>
            <Text>{date}</Text>
          </View>
        </View>
      </View>

      <View style={{flexDirection: 'row', marginTop: 12}}>
        <View>
          <Text style={{...font(14, 15, '500')}}>Invoice to:</Text>
        </View>

        <View style={{marginLeft: 8, marginTop: -5}}>
          <Text>{billTo?.name}</Text>
          <Text>
            {billTo?.address?.street} {billTo?.address?.city}, {billTo?.address?.zip}
          </Text>
          <Text>{billTo?.address?.country}</Text>
        </View>
      </View>

      <View style={styles.box}>
        <View style={[styles.tag, { flex: 0.7}]}>
          <Text style={styles.tagText}>SL. Item Description</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingRight: 12,
            flex: 1,
            marginLeft: 10,
          }}>
          <View style={styles.sBox}>
            <Text style={styles.text}>Price</Text>
          </View>
          <View style={styles.sBox}>
            <Text style={styles.text}>Qty.</Text>
          </View>
          <View style={styles.sBox}>
            <Text style={styles.text}>Total</Text>
          </View>
        </View>
      </View>

      {items?.items?.map((x: any, key: number) => (
        <View key={key} style={[styles.box, { marginTop: 1}]}>
          <View style={{flex: 0.7, padding: 3, flexDirection: 'row'}}>
            <Text style={styles.description}>{key + 1}</Text>
            <Text style={styles.description}>{x?.description}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingRight: 12,
              flex: 0.8,
              marginLeft: 10,
            }}>
            <View style={styles.sBox}>
              <Text style={styles.text}>${x?.rate}</Text>
            </View>
            <View style={styles.sBox}>
              <Text style={styles.text}>{x?.hours}</Text>
            </View>
            <View style={styles.sBox}>
              <Text style={styles.text}>${x?.rate * x?.hours}</Text>
            </View>
          </View>
        </View>
      ))}

      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 0.76}} />
        <View style={{flexDirection: 'row', paddingRight: 12, flex: 1}}>
          <View style={styles.sBox} />
          <View style={styles.sBox}>
            <Text style={styles.text1}>Sub Total: </Text>
            <Text style={styles.text1}>Tax: </Text>
            <Text style={styles.text1}>Discount: </Text>
          </View>
          <View style={styles.sBox}>
            <Text style={styles.text1}>${items?.subTotal|| 0}</Text>
            <Text style={styles.text1}>{items?.taxRate|| 0}%</Text>
            <Text style={styles.text1}>${items?.discount|| 0}</Text>
          </View>
        </View>
      </View>

      <View style={{alignItems: 'flex-end'}}>
        <View
          style={[
            styles.tag,
            {flexDirection: 'row', marginTop: 11, paddingHorizontal: 20},
          ]}>
          <Text style={styles.headerText3}>Total:</Text>
          <Text style={styles.headerText3}>&nbsp;&nbsp;${items?.total || 0}</Text>
        </View>
      </View>

      <View style={styles.box}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Thank you for your business</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  headerText1: {
    fontSize: 14,
    ...font(16, 18, '500'),
  },
  headerText2: {
    ...font(32, 39, '700'),
    // color: colors.black,
  },
  headerText3: {
    fontSize: 14,
    ...font(16, 18, '500'),
    color: colors.whiteColor,
  },
  tag: {
    backgroundColor: '#4f7afb',
    paddingHorizontal: 15,
    paddingVertical: 8,
    paddingTop: 12,
    borderTopEndRadius: 15,
    borderBottomEndRadius: 15,
  },
  tagText: {
    color: '#fff',
    ...font(10, 11, '500'),
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e5e5e5',
    marginTop: 12,
  },
  text: {
    ...font(10, 11, '400'),
    paddingTop: 4,
  },
  text1: {
    ...font(10, 11, '600'),
    paddingTop: 4,
  },
  sBox: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    ...font(11, 12, '500'),
    marginLeft: 12,
    height: 30,
    paddingTop: 10
  }
});
