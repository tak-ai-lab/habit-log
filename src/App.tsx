import { useAuth } from './hooks/useAuth'
import { AuthPage } from './pages/AuthPage'
import { HomePage } from './pages/HomePage'
import styled from 'styled-components'

const AppContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  width: 100%;
  box-sizing: border-box; /* パディングを幅に含める */

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return <AppContainer>Loading...</AppContainer>
  }

  return (
    <AppContainer>
      {!session ? <AuthPage /> : <HomePage />}
    </AppContainer>
  )
}

export default App