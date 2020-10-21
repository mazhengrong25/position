/*
 * @Description:
 * @Author: mazhengrong
 * @Date: 2020-10-12 10:59:32
 * @LastEditTime: 2020-10-21 14:09:55
 * @LastEditors: Please set LastEditors
 */
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import Rule from "./components/rule";
import Header from "./components/header";
import Detail from "./components/detail";

import "./index.scss";

import * as serviceWorker from "./serviceWorker";

import { BrowserRouter as Router, Route } from "react-router-dom";

import zhCN from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'

import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Router>
      <Header></Header>
      <Route exact path="/" component={App}></Route>
      <Route path="/rule" component={Rule}></Route>
      <Route path="/detail" component={Detail}></Route>
    </Router>
  </ConfigProvider>,

  document.getElementById("root")
);

serviceWorker.unregister();
