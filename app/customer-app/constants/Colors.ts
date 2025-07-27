/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#6ca867ff'; // green shade for light theme
const tintColorDark = '#9affa6ae'; // teal green shade for dark theme

export const Colors = {
  light: {
    text: '#243d30ff',
    background: '#fff',
    tint: tintColorLight,
    icon: '#68766bff',
    tabIconDefault: '#68766cff',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#d8eadcff',
    background: '#151815ff',
    tint: tintColorDark,
    icon: '#9ba69cff',
    tabIconDefault: '#9ca69bff',
    tabIconSelected: tintColorDark,
  },
};
