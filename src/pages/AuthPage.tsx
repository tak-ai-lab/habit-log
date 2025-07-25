import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import styled from 'styled-components'

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 20px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 300px;
  margin-top: 20px;
`;

const AuthInput = styled.input`
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 5px;
  font-size: 1em;
`;

const AuthButton = styled.button`
  padding: 10px 15px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.error};
  margin-top: 10px;
`;

export const AuthPage = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!supabase) {
      alert("Supabase is not configured. Please check your .env file.");
      return;
    }

    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error: any) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContainer>
      <h1>Habit Log</h1>
      <p>Sign in via magic link with your email below</p>
      <AuthForm onSubmit={handleLogin}>
        <AuthInput
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthButton type="submit" disabled={loading || !supabase}>
          {loading ? <span>Loading...</span> : <span>Send magic link</span>}
        </AuthButton>
      </AuthForm>
      {!supabase && <ErrorMessage>Supabase is not configured. Please check your .env file.</ErrorMessage>}
    </AuthContainer>
  )
}