import axios from 'axios';
import { toast } from 'react-toastify';
import i18n from '../i18n';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage;

    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          errorMessage = data?.message || i18n.t('errors.badRequest');
          break;
        case 401:
          errorMessage = i18n.t('errors.unauthorized');
          break;
        case 403:
          errorMessage = i18n.t('errors.forbidden');
          break;
        case 404:
          errorMessage = data?.message || i18n.t('errors.notFound');
          break;
        case 500:
          errorMessage = i18n.t('errors.serverError');
          break;
        default:
          errorMessage = data?.message || i18n.t('errors.generic', { status });
          break;
      }
    } else if (error.request) {
      errorMessage = i18n.t('errors.networkError');
    } else {
      errorMessage = error.message || i18n.t('errors.unexpected');
    }

    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

export default instance;
