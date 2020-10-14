/*
 * @Description: 
 * @Author: mazhengrong
 * @Date: 2020-10-12 10:59:32
 * @LastEditTime: 2020-10-13 18:38:13
 * @LastEditors: mazhengrong
 */
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import Header from './components/header';

import './index.scss'

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  
  <React.StrictMode>
    <Header></Header>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
