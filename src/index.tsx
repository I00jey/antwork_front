import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import AccountStore from '../src/components/VirtualInvest/AccountStore';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={AccountStore}>
    <App />
  </Provider>
);
