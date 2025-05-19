/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

const Colors = {
  light: {
    background: '#fdfaf6',    // 米白色背景
    card: '#f7f5f0',          // 卡片背景色
    button: '#f5f2ec',        // 按钮背景色
    textPrimary: '#3c3c3c',   // 主要文本
    textSecondary: '#6e6e6e', // 次要文本
    accent: '#dfcfc0',        // 强调色
    border: '#e8e8e8',        // 边框颜色
    shadow: 'rgba(0, 0, 0, 0.05)', // 阴影颜色
    text: '#11181C',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    background: '#292929',
    card: '#333333',
    button: '#404040',
    textPrimary: '#f0f0f0',
    textSecondary: '#b0b0b0',
    accent: '#dfcfc0',
    border: '#4a4a4a',
    shadow: 'rgba(0, 0, 0, 0.2)',
    text: '#ECEDEE',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export default Colors;
