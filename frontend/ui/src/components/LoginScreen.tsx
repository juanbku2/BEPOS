import React, { useState } from 'react';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import instance, { getUserProfile } from '../api/axios'; // Import getUserProfile
import './LoginScreen.css'; // Import custom CSS for this component
import { User } from '../types/User'; // Import User type

const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    instance.post('/auth/authenticate', { loginIdentifier: username, password })
      .then(response => {
        const token = response.data.token;
        localStorage.setItem('token', token);

        // Now fetch user profile
        return getUserProfile(); // This requires a backend /users/me endpoint
      })
      .then((userProfile: User) => {
        localStorage.setItem('user', JSON.stringify(userProfile)); // Store full user profile
        window.dispatchEvent(new Event('storage')); // Simulate storage event
        toast.success(t('login.success'));
        navigate('/select-module'); // Redirect to module selector after successful login
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(t('login.invalidCredentials'));
        }
        console.error('Error logging in or fetching profile:', err);
      });
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <Card style={{ width: '22rem', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-4 bm-login-text-gray">{t('login.loginButton')}</h2>
          <Form onSubmit={handleLogin}>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3" controlId="formLoginUsername">
              <Form.Label className="bm-login-text-gray">{t('login.username')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('login.enterUsername')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formLoginPassword">
              <Form.Label className="bm-login-text-gray">{t('login.password')}</Form.Label>
              <Form.Control
                type="password"
                placeholder={t('login.enterPassword')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" className="w-100 bm-login-button">
              {t('login.loginButton')}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginScreen;
