/*
 * @Description: 
 * @Author: mazhengrong
 * @Date: 2020-10-12 10:59:32
 * @LastEditTime: 2020-10-14 09:43:33
 * @LastEditors: mazhengrong
 */
import React, { Component } from 'react'
// 单选框
import { Radio , Select , DatePicker , Input , Button , Table} from 'antd';

import './App.scss'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const renderContent = function (value, row, index) {
    const obj = {
      children: value,
      props: {},
    };
    if (index === 4) {
      obj.props.colSpan = 0;
    }
    return obj;
  };
const columns = [{
    title: '编号',
    dataIndex: 'name',
    render(text, row, index) {
    //   if (index < 4) {
    //     return <a href="#">{text}</a>;
    //   }
    //   return {
    //     children: <a href="#">{text}</a>,
    //     props: {
    //       colSpan: 5,
    //     },
    //   };
    },
  }, {
    title: '操作',
    dataIndex: 'age',
    render: renderContent,
  }, {
    title: 'PNR',
    colSpan: 2,
    dataIndex: 'tel',
    render(value, row, index) {
      const obj = {
        children: value,
        props: {},
      };
      // 第三列的第三行行合并
      if (index === 2) {
        obj.props.rowSpan = 2;
      }
  
      // 第三列的第四行被合并没了，设置 rowSpan = 0 直接不用渲染
      if (index === 3) {
        obj.props.rowSpan = 0;
      }
  
      if (index === 4) {
        obj.props.colSpan = 0;
      }
      return obj;
    },
  }, {
    title: '票号',
    colSpan: 0,
    dataIndex: 'phone',
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
    render: renderContent,
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

  const data = [{
    key: '1',
    name: '胡彦斌',
    age: 32,
    tel: '0571-22098909',
    phone: 18889898989,
    address: '西湖区湖底公园1号',
  }, {
    key: '2',
    name: '胡彦祖',
    tel: '0571-22098333',
    phone: 18889898888,
    age: 42,
    address: '西湖区湖底公园1号',
  }, {
    key: '3',
    name: '李大嘴',
    age: 32,
    tel: '0575-22098909',
    phone: 18900010002,
    address: '西湖区湖底公园1号',
  }, {
    key: '4',
    name: '李夫人',
    age: 18,
    tel: '0575-22098909',
    phone: 18900010002,
    address: '西湖区湖底公园1号',
  }, {
    key: '5',
    name: '习大大',
    age: 18,
    tel: '0575-22098909',
    phone: 18900010002,
    address: '西湖区湖底公园1号',
  }];
  

export default class App extends Component {
    render() {
        return (
            <div className="centent">
                {/* 统计横幅 */}
                <div className="count">
                  <RadioGroup>
                    <RadioButton value="a">全部</RadioButton>
                    <RadioButton value="b">待取位</RadioButton>
                    <RadioButton value="c">已取位</RadioButton>
                    <RadioButton value="d">已航变</RadioButton>
                    <RadioButton value="d">已退票</RadioButton>
                    <RadioButton value="d">无需取位</RadioButton>
                    <RadioButton value="d">取消失败</RadioButton>

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
                        {/* 执行类型 */}
                        <div className="type_name">
                            <div>执行类型</div>
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
                            <div>执行时间</div>
                            <div className="radio">
                                <DatePicker
                                   
                                    placeholder="选择时间"
                                   
                                />-
                                <DatePicker
                                   
                                    placeholder="选择时间"
                                   
                                />
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
                            <div>乘客姓名</div>
                            <div className="radio">
                                <Select showSearch
                                    style={{ width: 200 }}
                                    placeholder="输入乘客姓名"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                
                                >
                                    <Option value="jack">杰克</Option>
                                    <Option value="lucy">露西</Option>
                                    <Option value="tom">汤姆</Option>
                                </Select>
                            </div>
                        </div>
                        {/* 搜索按钮 */}
                        <div className="type_name">
                            <Button type="primary">搜索</Button>
                        </div>
                    </div>

                    <div className="table_main">
                        <Table columns={columns} dataSource={data} bordered />
                    </div>

                </div>
            </div>
        )
    }
}

