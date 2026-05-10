import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #093c5d 0%, #3b7597 50%, #6fd1da 100%);
  padding: 20px;
`;

const FormCard = styled.div`
  background: white;
  padding: 45px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 420px;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 35px;

  h1 {
    font-size: 28px;
    color: #093c5d;
    margin-bottom: 5px;
  }

  p {
    color: #666;
    font-size: 14px;
  }

  span {
    color: #75df8d;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px 16px 50px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #6fd1da;
    box-shadow: 0 0 0 3px rgba(111, 209, 218, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const Icon = styled.span`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #093c5d, #3b7597);
  color: white;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(9, 60, 93, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Error = styled.p`
  color: #e74c3c;
  text-align: center;
  font-size: 14px;
  padding: 10px;
  background: #fdeaea;
  border-radius: 8px;
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 25px;
  color: #666;
  font-size: 14px;

  a {
    color: #3b7597;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormCard>
        <Logo>
          <h1>Team<span>Task</span></h1>
          <p>Sign in to your account</p>
        </Logo>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Icon><FaEnvelope /></Icon>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Icon><FaLock /></Icon>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          {error && <Error>{error}</Error>}
          <Button type="submit" disabled={loading}>
            <FaSignInAlt /> {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form>
        <LinkText>
          Don't have an account? <Link to="/register">Create one</Link>
        </LinkText>
      </FormCard>
    </Container>
  );
};

export default Login;