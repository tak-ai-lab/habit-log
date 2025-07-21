
import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    color: #213547;
    background-color: #fdfcfc; /* 非常に明るい背景色 */

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
    background-color: #fdfcfc; /* 明るい背景色 */
  }

  h1 {
    font-size: 3.2em;
    line-height: 1.1;
    color: #6a0dad; /* 紫系のアクセントカラー */
  }

  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #f0e6fa; /* 淡い紫 */
    cursor: pointer;
    transition: border-color 0.25s;
    color: #6a0dad;
  }
  button:hover {
    border-color: #6a0dad;
  }
  button:focus, button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }

  input[type="text"],
  input[type="email"] {
    border-radius: 8px;
    border: 1px solid #ccc;
    padding: 0.6em 1.2em;
    font-size: 1em;
    background-color: #fff;
    color: #333;
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
