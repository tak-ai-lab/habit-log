
import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3; /* Light grey */
  border-top: 4px solid #6a0dad; /* Purple */
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: ${spin} 0.8s linear infinite;
  margin: 20px auto;
`;
