import {TextStyle} from 'react-native';

type FontWeight = TextStyle['fontWeight'];

const FONT_WEIGHT_TO_FONT: {
  [key in Exclude<FontWeight, undefined>]: string;
} = {
  '100': 'Poppins-Thin',
  '200': 'Poppins-ExtraLight',
  '300': 'Poppins-Light',
  normal: 'Poppins-Regular',
  '400': 'Poppins-Regular',
  '500': 'Poppins-Medium',
  '600': 'Poppins-SemiBold',
  '700': 'Poppins-Bold',
  bold: 'Poppins-Bold',
  '800': 'Poppins-ExtraBold',
  '900': 'Poppins-Black',
};

export const font = (
  fontSize: number,
  lineHeight?: number,
  fontWeight: TextStyle['fontWeight'] = 'normal',
) => {
  const fontFamily = FONT_WEIGHT_TO_FONT[fontWeight];

  const style: TextStyle = {
    fontFamily,
    fontSize,
  };
  if (lineHeight !== undefined) {
    style.lineHeight = lineHeight;
  }
  if (fontWeight !== undefined) {
    style.fontWeight = fontWeight;
  }
  return style;
};
