/*
 * @Description: 
 * @Author: wish.WuJunLong
 * @Date: 2020-11-16 15:41:17
 * @LastEditTime: 2020-12-01 10:02:47
 * @LastEditors: wish.WuJunLong
 */
import React, { Component } from 'react';

import { message, Spin } from 'antd';

import '../index/index.scss';

import axios from '../../api/api';

export default class Rule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      key_id: '',
    };
  }

  async componentWillMount() {
    
  }

  async componentDidMount() {
    let data = React.$filterUrlParams(this.props.location.search)
    await this.setState({
      url: data.url,
      key_id: data.token
    });
    await this.getToken();
  }

  getToken() {
    let data = {
      key: this.state.key_id || 0,
    };
    
    axios.get('api/token/Authenticate', { params: data },{type: 'Auth'}).then((res) => {
      console.log(res);
      if (res.data.status === 0) {
        localStorage.setItem('token', res.data.token);
        this.props.history.push(this.state.url);
      } else {
        message.warning(res.data.message);
      }
    });
  }

  render() {
    return <div className="index">
      <Spin tip="正在进入取位中心..."/>
    </div>;
  }
}
