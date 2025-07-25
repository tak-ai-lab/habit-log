
// src/types/styled.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryLight: string;
      primaryDark: string;
      text: string;
      textLight: string;
      background: string;
      border: string;
      lightBorder: string;
      error: string;
      success: string;
      todayBackground: string;
      checkboxBackground: string;
      checkboxBorder: string;
      checkboxChecked: string;
      checkboxCheckmark: string;
      disabledBackground: string;
      disabledColor: string;
      otherMonthBackground: string;
    };
  }
}
