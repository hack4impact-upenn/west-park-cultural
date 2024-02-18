// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import reportWebVitals from './reportWebVitals';
// import App from './App';
// import { AlertProvider } from './util/context/AlertContext';

// const container = document.getElementById('root');
// // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
// const root = createRoot(container!); // createRoot(container!) if you use TypeScript
// root.render(
//   <AlertProvider>
//     <App />
//   </AlertProvider>,
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom';
import TestPage from './TableTestPage'; // replace with the actual path to your TestPage.tsx file

ReactDOM.render(
  <React.StrictMode>
    <TestPage />
  </React.StrictMode>,
  document.getElementById('root'),
);
