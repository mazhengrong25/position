/*
 * @Description: 
 * @Author: mazhengrong
 * @Date: 2020-10-12 10:59:32
 * @LastEditTime: 2020-10-16 09:45:20
 * @LastEditors: mazhengrong
 */
import React, { Component } from 'react'
// 单选框
import { Radio , Select , DatePicker , Input , Button , Table , Tag  } from 'antd';

import Axios from 'axios'


import './App.scss'


import moment from 'moment';

import "moment/locale/zh-cn"
import locale from 'antd/lib/date-picker/locale/en_US';
import { Link } from 'react-router-dom';
moment.locale('zh-cn')
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const renderContent = function (value, row, index) {
    const obj = {
      children: value,
      props: {},
    };
    return obj;
  };
const columns = [{
    title: '编号',
    dataIndex: 'number',
    render: renderContent,
  }, {
    title: '操作',
    coldiv: 2,
    dataIndex: 'age',
    render: (text, row, index) => {
    
      return  <div>
        <Link to ="/detail"> <Tag color="#5AB957">详</Tag></Link>
        <Tag color="#0070E2">处理</Tag>
      </div>
      
    },
  }, {
    title: 'PNR',
    // coldiv: 2,
    dataIndex: 'PNR',
    render: renderContent,
  }, {
    title: '票号',
    dataIndex: 'ticno',
    render: renderContent,
  }, {
    title: 'PNR状态',
    dataIndex: 'address',
    render: renderContent,
  }, {
    title: 'GDS系统标识',
    dataIndex: 'address',
    render: renderContent,
  }, {
    title: '票证类型',
    dataIndex: 'address',
    render: renderContent,
  }, {
    title: '航司代码',
    dataIndex: 'address',
    render: renderContent,
  }, {
    title: '起飞时间',
    dataIndex: 'address',
    render: renderContent,
  }, {
    title: '乘客姓名',
    dataIndex: 'address',
    render: renderContent,
  }, {
    title: '航程类型',
    dataIndex: 'address',
    render: renderContent,
  }, {
    title: '执行状态',
    dataIndex: 'address',
    render: renderContent,
  }, {
    title: '规则匹配',
    dataIndex: 'address',
    render: (text, row, index) => {

  
    
      return <div>
        <Tag color="#5AB957">已关联</Tag>
       
      </div>
      
    },
  }, {
    title: '已执行时间',
    dataIndex: 'address',
    render: renderContent,
  }, {
    title: '预计下次执行时间',
    dataIndex: 'address',
    render: renderContent,
  }

];
  const data = [];
  for (let i = 1; i < 46; i++) {
    data.push({
      key: i,
      number: `${i}`, //编号
      PNR:156, //PNR
      ticno:8865457746996, //票号
      age: 32,
      address: `London. ${i}`,
      tel: `0571- ${i}`,
      phone: `1888 ${1}`,
    });
  }
  

export default class App extends Component {

    componentDidMount() {
      let data = {
        airline_code:'', //航空公司二字代码
        exec_state:'', //执行状态  0：待取位 1：已取位 2：已航变 3:已退票 4：无需取位 -1:取消失败

      };
      Axios.post('/api/pnr/getdata',data)
      .then(res => {
          console.log(res)
      })
      .catch(err =>{
          console.log(err)
      })
  }
    render() {
        return (
            <div className="centent">
                {/* 统计横幅 */}
                <div className="count">
                  <RadioGroup>
                    <RadioButton value="a">全部 <div className="count_tag">3236</div></RadioButton>
                    <RadioButton value="b">待取位 <div className="count_tag">832</div></RadioButton>
                    <RadioButton value="c">已取位 <div className="count_tag">2036</div></RadioButton>
                    <RadioButton value="d">已航变 <div className="count_tag">628</div></RadioButton>
                    <RadioButton value="d">已退票 <div className="count_tag">103</div>  </RadioButton>
                    <RadioButton value="d">无需取位 <div className="count_tag">65</div></RadioButton>
                    <RadioButton value="d">取消失败 <div className="count_tag">24</div></RadioButton>

                  </RadioGroup>
                </div>
                {/* 表格 */} 
                <div className="table">
                    <div className="table_type">
                        {/* 订单类型 */}
                        <div className="type_name">
                            <div>订单类型</div>
                            <div className="radio">
                            <RadioGroup >
                                <Radio key="a" >国内</Radio>
                                <Radio key="b" >国际</Radio>
                            </RadioGroup>
                            </div>
                        </div>
                        {/* 执行状态 */}
                        <div className="type_name">
                            <div>执行状态</div>
                            <div className="radio">
                            <Select showSearch
                                style={{ width: 200 }}
                                placeholder="请选择人员"
                                optionFilterProp="children"
                                notFoundContent="无法找到"
                              
                            >
                                <Option value="jack">杰克</Option>
                                <Option value="lucy">露西</Option>
                                <Option value="tom">汤姆</Option>
                            </Select>
                            </div>
                        </div>
                        {/* 票证类型 */}
                        <div className="type_name">
                            <div>票证类型</div>
                            <div className="radio">
                            <Select showSearch
                                style={{ width: 200 }}
                                placeholder="请选择人员"
                                optionFilterProp="children"
                                notFoundContent="无法找到"
                              
                            >
                                <Option value="jack">杰克</Option>
                                <Option value="lucy">露西</Option>
                                <Option value="tom">汤姆</Option>
                            </Select>
                            </div>
                        </div>
                        {/* 执行时间 */}
                        <div className="type_name">
                            <Select defaultValue="执行时间" style={{ width: 100 }} bordered={false}>
                              <Option >执行时间</Option>
                              <Option >起飞时间</Option>
                            </Select>
                            <div className="radio">
                                <DatePicker locale={locale} placeholder="选择时间"/>-
                                <DatePicker placeholder="选择时间"/>
                            </div>
                        </div>
                        {/* 航空公司 */}
                        <div className="type_name">
                            <div>航空公司</div>
                            <div className="radio">
                                <Input placeholder="请填写" />
                            </div>
                        </div>
                        {/* 是否自愿 */}
                        <div className="type_name">
                            <div>是否自愿</div>
                            <div className="radio">
                                <Select showSearch
                                    style={{ width: 200 }}
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                
                                >
                                    <Option value="jack">杰克</Option>
                                    <Option value="lucy">露西</Option>
                                    <Option value="tom">汤姆</Option>
                                </Select>
                            </div>
                        </div>
                        {/* 乘客姓名 */}
                        <div className="type_name">
                          <Select defaultValue="乘客姓名" style={{ width: 100 }} bordered={false}>
                            <Option >乘客姓名</Option>
                            <Option >PNR编码</Option>
                            <Option >票号</Option>
                            <Option >订单号</Option>
                          </Select>
                          <div className="radio">
                              <Input placeholder="输入乘客姓名" />
                          </div>
                        </div>
                        {/* 搜索按钮 */}
                        <div className="type_name">
                            <Button type="primary">搜索</Button>
                        </div>
                    </div>

                    <div className="table_main">
                        <Table columns={columns} dataSource={data} bordered/>
                    </div>

                </div>
            </div>
        )
    }
}

