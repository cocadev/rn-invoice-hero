import React from 'react';
import Svg, {Path} from 'react-native-svg';

type Props = {
  size: number;
  color: string;
};

export const SettingsIcon: React.FC<Props> = ({size, color}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 25 24" fill="none">
      <Path
        d="M12.7 15C14.3568 15 15.7 13.6569 15.7 12C15.7 10.3431 14.3568 9 12.7 9C11.0431 9 9.69998 10.3431 9.69998 12C9.69998 13.6569 11.0431 15 12.7 15Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.1 15C19.9669 15.3016 19.9272 15.6362 19.986 15.9606C20.0448 16.285 20.1994 16.5843 20.43 16.82L20.49 16.88C20.6759 17.0657 20.8235 17.2863 20.9241 17.5291C21.0247 17.7719 21.0766 18.0322 21.0766 18.295C21.0766 18.5578 21.0247 18.8181 20.9241 19.0609C20.8235 19.3037 20.6759 19.5243 20.49 19.71C20.3042 19.896 20.0837 20.0435 19.8409 20.1441C19.5981 20.2448 19.3378 20.2966 19.075 20.2966C18.8122 20.2966 18.5519 20.2448 18.3091 20.1441C18.0663 20.0435 17.8457 19.896 17.66 19.71L17.6 19.65C17.3643 19.4195 17.065 19.2648 16.7406 19.206C16.4162 19.1472 16.0816 19.1869 15.78 19.32C15.4842 19.4468 15.232 19.6572 15.0543 19.9255C14.8766 20.1938 14.7813 20.5082 14.78 20.83V21C14.78 21.5304 14.5693 22.0391 14.1942 22.4142C13.8191 22.7893 13.3104 23 12.78 23C12.2495 23 11.7408 22.7893 11.3658 22.4142C10.9907 22.0391 10.78 21.5304 10.78 21V20.91C10.7722 20.579 10.6651 20.258 10.4725 19.9887C10.2799 19.7194 10.0107 19.5143 9.69998 19.4C9.39837 19.2669 9.06379 19.2272 8.73939 19.286C8.415 19.3448 8.11566 19.4995 7.87998 19.73L7.81998 19.79C7.63424 19.976 7.41366 20.1235 7.17086 20.2241C6.92807 20.3248 6.66781 20.3766 6.40498 20.3766C6.14215 20.3766 5.8819 20.3248 5.6391 20.2241C5.3963 20.1235 5.17573 19.976 4.98998 19.79C4.80403 19.6043 4.65651 19.3837 4.55586 19.1409C4.45521 18.8981 4.40341 18.6378 4.40341 18.375C4.40341 18.1122 4.45521 17.8519 4.55586 17.6091C4.65651 17.3663 4.80403 17.1457 4.98998 16.96L5.04998 16.9C5.28052 16.6643 5.43517 16.365 5.49399 16.0406C5.55281 15.7162 5.5131 15.3816 5.37998 15.08C5.25322 14.7842 5.04274 14.532 4.77445 14.3543C4.50616 14.1766 4.19177 14.0813 3.86998 14.08H3.69998C3.16955 14.08 2.66084 13.8693 2.28577 13.4942C1.9107 13.1191 1.69998 12.6104 1.69998 12.08C1.69998 11.5496 1.9107 11.0409 2.28577 10.6658C2.66084 10.2907 3.16955 10.08 3.69998 10.08H3.78998C4.12098 10.0723 4.44199 9.96512 4.71128 9.77251C4.98058 9.5799 5.1857 9.31074 5.29998 9C5.4331 8.69838 5.47281 8.36381 5.41399 8.03941C5.35517 7.71502 5.20052 7.41568 4.96998 7.18L4.90998 7.12C4.72403 6.93425 4.57651 6.71368 4.47586 6.47088C4.37521 6.22808 4.32341 5.96783 4.32341 5.705C4.32341 5.44217 4.37521 5.18192 4.47586 4.93912C4.57651 4.69632 4.72403 4.47575 4.90998 4.29C5.09573 4.10405 5.3163 3.95653 5.5591 3.85588C5.8019 3.75523 6.06215 3.70343 6.32498 3.70343C6.58781 3.70343 6.84807 3.75523 7.09086 3.85588C7.33366 3.95653 7.55424 4.10405 7.73998 4.29L7.79998 4.35C8.03566 4.58054 8.335 4.73519 8.65939 4.794C8.98379 4.85282 9.31837 4.81312 9.61998 4.68H9.69998C9.99575 4.55324 10.248 4.34276 10.4257 4.07447C10.6034 3.80618 10.6987 3.49179 10.7 3.17V3C10.7 2.46957 10.9107 1.96086 11.2858 1.58579C11.6608 1.21071 12.1695 1 12.7 1C13.2304 1 13.7391 1.21071 14.1142 1.58579C14.4893 1.96086 14.7 2.46957 14.7 3V3.09C14.7013 3.41179 14.7966 3.72618 14.9743 3.99447C15.152 4.26276 15.4042 4.47324 15.7 4.6C16.0016 4.73312 16.3362 4.77282 16.6606 4.714C16.985 4.65519 17.2843 4.50054 17.52 4.27L17.58 4.21C17.7657 4.02405 17.9863 3.87653 18.2291 3.77588C18.4719 3.67523 18.7322 3.62343 18.995 3.62343C19.2578 3.62343 19.5181 3.67523 19.7609 3.77588C20.0037 3.87653 20.2242 4.02405 20.41 4.21C20.5959 4.39575 20.7435 4.61632 20.8441 4.85912C20.9447 5.10192 20.9966 5.36217 20.9966 5.625C20.9966 5.88783 20.9447 6.14808 20.8441 6.39088C20.7435 6.63368 20.5959 6.85425 20.41 7.04L20.35 7.1C20.1194 7.33568 19.9648 7.63502 19.906 7.95941C19.8472 8.28381 19.8869 8.61838 20.02 8.92V9C20.1467 9.29577 20.3572 9.54802 20.6255 9.72569C20.8938 9.90337 21.2082 9.99872 21.53 10H21.7C22.2304 10 22.7391 10.2107 23.1142 10.5858C23.4893 10.9609 23.7 11.4696 23.7 12C23.7 12.5304 23.4893 13.0391 23.1142 13.4142C22.7391 13.7893 22.2304 14 21.7 14H21.61C21.2882 14.0013 20.9738 14.0966 20.7055 14.2743C20.4372 14.452 20.2267 14.7042 20.1 15V15Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
