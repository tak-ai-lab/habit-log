
import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    color: ${props => props.theme.colors.text}; /* #213547 は一旦 text に集約 */
    background-color: ${props => props.theme.colors.background}; /* 非常に明るい背景色 */

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    margin: 0;
    display: flex;
    place-items: center;
    min-width: 320px;
    min-height: 100vh;
    background-color: ${props => props.theme.colors.background}; /* 明るい背景色 */
  }

  h1 {
    font-size: 3.2em;
    line-height: 1.1;
    color: ${props => props.theme.colors.primary}; /* 紫系のアクセントカラー */
  }

  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: ${props => props.theme.colors.primaryLight}; /* 淡い紫 */
    cursor: pointer;
    transition: border-color 0.25s;
    color: ${props => props.theme.colors.primary};
  }
  button:hover {
    border-color: ${props => props.theme.colors.primary};
  }
  button:focus, button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }

  input[type="text"],
  input[type="email"] {
    border-radius: 8px;
    border: 1px solid ${props => props.theme.colors.border};
    padding: 0.6em 1.2em;
    font-size: 1em;
    background-color: ${props => props.theme.colors.checkboxBackground};
    color: ${props => props.theme.colors.text};
  }

  /* App全体のコンテナ */
  #root {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
    width: 100%;
  }
`
