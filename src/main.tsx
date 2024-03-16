import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@/assets/styles/main.scss';
import { SnackbarProvider, SnackbarProviderProps } from 'notistack';

const snackbarSettings: SnackbarProviderProps = {
  maxSnack: 3,
  autoHideDuration: 1800,
  preventDuplicate: true,
  anchorOrigin: {
    horizontal: 'right',
    vertical: 'top',
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SnackbarProvider {...snackbarSettings}>
    <App />
  </SnackbarProvider>,
);
