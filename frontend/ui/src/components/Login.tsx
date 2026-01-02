import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import instance from '../api/axios'; // Import the configured axios instance
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    instance.post('/auth/authenticate', { loginIdentifier: username, password }) // Use instance and remove /api/v1
      .then(response => {
        localStorage.setItem('token', response.data.token);
        onLogin();
        navigate('/');
      })
      .catch(error => {
        setError(t('login.invalidCredentials')); // Translate error message
        console.error('Error logging in:', error);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Form onSubmit={handleLogin}>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>{t('login.username')}</Form.Label> {/* Translate Username */}
          <Form.Control type="text" placeholder={t('login.username')} value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>{t('login.password')}</Form.Label> {/* Translate Password */}
          <Form.Control type="password" placeholder={t('login.password')} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">
          {t('login.loginButton')} {/* Translate Login button */}
        </Button>
      </Form>
    </div>
  );
};

export default Login;
