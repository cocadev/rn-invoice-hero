import React, {useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useDebouncedCallback} from 'use-debounce';
import {RouteProp} from '@react-navigation/native';
import {getSubscriptions, requestSubscription} from 'react-native-iap';
import {MainStackParamList} from '../navigation/MainStackNavigator';
import {MainStackRouteNames} from '../navigation/router-names';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Overlay} from '../components/Overlay';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {colors, gradients} from '../styles/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {font} from '../styles/font';
import {Button} from '../components/Button';
import LinearGradient from 'react-native-linear-gradient';
import {Images} from '../assets/images';
import {useSelector} from 'react-redux';
import {selectSubscriptions} from '../store/selectors/subscriptions';

type Props = {
  route: RouteProp<MainStackParamList, MainStackRouteNames.SubscriptionModal>;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    MainStackRouteNames.SubscriptionModal
  >;
};

const features = [
  {
    title: 'Weekly plan',
    description: 'Only 2.99$',
    image: Images.weeklySubscription,
    price: '299',
  },
  {
    title: 'Monthly plan',
    description: 'Save 50%',
    image: Images.monthlySubscription,
    price: '599',
  },
  {
    title: 'Yearly plan',
    description: 'Yearly 69%',
    image: Images.yearlySubscription,
    price: '4499',
  },
];

export const SubscriptionModal: React.FC<Props> = ({navigation}) => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const insets = useSafeAreaInsets();

  const subscriptions = useSelector(selectSubscriptions);

  const animatedProgress = useSharedValue(-1);

  useEffect(() => {
    animatedProgress.value = withSpring(0);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedProgress.value,
      [-1, 0],
      [0, 1],
      Extrapolate.CLAMP,
    ),
  }));

  const onClose = () => {
    animatedProgress.value = withTiming(
      -1,
      {
        duration: 300,
      },
      canceled => {
        runOnJS(goBack)();
      },
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  const selectSubscription = useDebouncedCallback(async v => {
    try {
      if (selectedPlan === null) {
        return;
      }

      const subscription = subscriptions.result[selectedPlan];

      const result = await getSubscriptions({skus: [subscription.androidId]}); // this is required otherwise sku not found error would be thourn when requestSub

      await requestSubscription({
        sku: subscription.androidId,
        subscriptionOffers: [
          {
            sku: subscription.androidId,
            offerToken: result[0].subscriptionOfferDetails[0].offerToken,
          },
        ],
      });

      console.log('go to onclose');

      onClose();
    } catch (e) {
      console.log(e);
    }
  }, 400);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable onPress={onClose} style={StyleSheet.absoluteFillObject}>
        <Overlay animatedProgress={animatedProgress} />
      </Pressable>
      <View
        style={[styles.modal, {top: insets.top + 24, bottom: insets.bottom}]}>
        <View style={styles.topBlock}>
          <Text style={styles.title}>
            Upgrade for {'\n'}
            <Text style={styles.titleBold}>
              unlimited access {'\n'} and free cloud storage {'\n'}
            </Text>{' '}
            on all plans.
          </Text>
        </View>
        <View style={styles.plansBlock}>
          {subscriptions.result.map((subscription, index) => {
            return (
              <TouchableWithoutFeedback
                onPress={() => setSelectedPlan(index)}
                key={`feature_${index}`}>
                <LinearGradient
                  {...gradients.planGradient}
                  style={[
                    styles.plan,
                    selectedPlan === index && styles.planActive,
                  ]}>
                  <View style={styles.leftBlock}>
                    <Text style={styles.planTitle}>{subscription.name}</Text>
                    <Text style={styles.planPrice}>
                      <Text style={styles.planDollar}>$ </Text>
                      {Number(subscription.cost) / 100}
                    </Text>
                    <Text style={styles.planDescription}>
                      {subscription.description}
                    </Text>
                  </View>
                  <View style={styles.rightBlock}>
                    <Image
                      style={styles.planImage}
                      source={Images[subscription.image]}
                    />
                  </View>
                </LinearGradient>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
        <View style={styles.actionBlock}>
          <Button
            disabled={selectedPlan === null}
            text={'Select plan'}
            onPress={selectSubscription}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    opacity: 0,
  },
  modal: {
    position: 'absolute',
    backgroundColor: colors.screenBackground,
    left: 24,
    right: 24,
    borderRadius: 15,
    paddingHorizontal: 25,
  },
  topBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plansBlock: {},
  actionBlock: {
    flex: 1,
  },
  title: {
    ...font(20, 24, '400'),
    color: '#4c4c4c',
    textAlign: 'center',
  },
  titleBold: {
    ...font(20, 24, '500'),
    color: '#000',
  },
  plan: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 15,
    height: 120,
    marginBottom: 15,
    flexDirection: 'row',
  },
  planActive: {
    borderWidth: 1,
    borderColor: colors.bluePrimary,
  },
  leftBlock: {
    flex: 1,
    paddingLeft: 20,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  rightBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planTitle: {
    ...font(15, 16, '500'),
  },
  planDollar: {
    ...font(13, 30, '500'),
  },
  planPrice: {
    color: colors.text.darkGrayText,
    ...font(27, 30, '600'),
  },
  planDescription: {
    ...font(12, 13, '500'),
    color: colors.bluePrimary,
  },
  planImage: {
    height: '90%',
  },
});
