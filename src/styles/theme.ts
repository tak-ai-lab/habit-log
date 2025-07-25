
// src/styles/theme.ts
import type { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  colors: {
    primary: '#6a0dad', // メインの紫
    primaryLight: '#f0e6fa', // 淡い紫
    primaryDark: '#5a0c9d', // 濃い紫
    text: '#333',
    textLight: '#999',
    background: '#fdfcfc',
    border: '#ddd',
    lightBorder: '#eee',
    error: 'red',
    success: '#4CAF50', // 緑色
    todayBackground: '#ffe0b2', // 今日の日付の背景色
    checkboxBackground: '#fff',
    checkboxBorder: '#6a0dad',
    checkboxChecked: '#6a0dad',
    checkboxCheckmark: '#fff',
    disabledBackground: '#dcdcdc',
    disabledColor: '#a0a0a0',
    otherMonthBackground: '#f0f0f0',
  },
  // 必要に応じてフォントサイズ、スペーシングなども追加可能
  // fontSizes: {
  //   small: '0.8em',
  //   medium: '1em',
  //   large: '1.2em',
  // },
};

export default theme;
