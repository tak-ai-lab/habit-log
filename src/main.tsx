
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { GlobalStyle } from './styles/GlobalStyles'

createRoot(document.getElementById('root')!).render(
  <>
    <GlobalStyle />
    <App />
  </>
)
