import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './globals.css';
import App from './App';
// ここではReact 18の新しいルートAPIを使用しています
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// APPコンポーネントをレンダリング
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);