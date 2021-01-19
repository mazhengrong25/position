/*
 * @Description:
 * @Author: mazhengrong
 * @Date: 2020-10-12 10:59:32
 * @LastEditTime: 2021-01-14 14:21:17
 * @LastEditors: wish.WuJunLong
 */
import React from "react";
import ReactDOM from "react-dom";

// import Header from "./components/header";
// 登录页
import App from "./page/index";
// 国内取位
import Index from "./page/inlandPage/index/index";  // 国内取位中心列表
import Rule from "./page/inlandPage/rule/rule";  // 取位规则
import Detail from "./page/inlandPage/detail/detail";  // 取位详情
// 新增
import NewIndex from "./page/inlandPage/newIndex/newIndex";  // 国内取位中心列表
import NewStopRule from "./page/inlandPage/newStopRule/newStopRule"; // 无需取位规则
import WaitRule from "./page/inlandPage/waitRule/waitRule"; // 等待取位规则
import StatusRule from "./page/inlandPage/statusRule/statusRule"; // 非自愿规则

import VolunteerRule from "./page/inlandPage/volunteerRule"; // 自愿规则
// 国际取位
import interList from "./page/interPage/interIndex/interIndex"; // 国际取位
import Executable from "./page/interPage/executable/executable"; // 国际取位可执行规则
import IntelStopRule from "./page/interPage/intelStopRule/intelStopRule";  // 国际无需取位规则

import "./index.scss";

import { BrowserRouter as Router, Route } from "react-router-dom";

import zhCN from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'

import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

React.Component.prototype.$moment = moment

React.$filterUrlParams = function() {
  let str = window.location.search.replace('?', '')
  let arr = str.split('&')
  let obj = {}
  arr.forEach(e => {
    let key = e.split('=')
    obj[key[0]] = key[1]
  })
  return obj
};

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Router>
      {/* <Header></Header> */}
      {/* 登录页 */}
      <Route exact path="/" component={App}></Route>
      {/* 国内取位 */}
      <Route path="/list" component={Index}></Route>
      <Route path="/newList" component={NewIndex}></Route>
      <Route path="/rule" component={Rule}></Route>
      <Route path="/detail" component={Detail}></Route>
      {/* 国际取位 */}
      <Route path="/interList" component={interList}></Route>
      <Route path="/intelNeedRule" component={Executable}></Route>
      <Route path="/intelStopRule" component={IntelStopRule}></Route>
      {/* 新增 */}
      <Route path="/waitRule" component={WaitRule}></Route>
      <Route path="/statusRule" component={StatusRule}></Route>
      <Route path="/newStopRule" component={NewStopRule}></Route> 
      <Route path="/volunteerRule" component={VolunteerRule}></Route>
    </Router>
  </ConfigProvider>,

  document.getElementById("root")
);

