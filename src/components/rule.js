/*
 * @Description: 
 * @Author: mazhengrong
 * @Date: 2020-10-12 18:15:28
 * @LastEditTime: 2020-10-15 17:56:46
 * @LastEditors: mazhengrong
 */
import  React,{ Component } from 'react'

import { Radio , Select  , Input , Button ,Table, Space  } from 'antd';

import Axios from 'axios'
// 引用样式
import './rule.scss'


const RadioGroup = Radio.Group;
const Option = Select.Option;

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

  const columns = [
    {
      title: '操作',
      dataIndex: 'name',
      key: 'name',
    
    },
    {
      title: '所属航司',
      dataIndex: 'age',
      key: 'age',
     
    },
    {
        title: '舱位模式',
        dataIndex: 'age',
        key: 'age',
       
    },
    {
        title: '舱位代码',
        dataIndex: 'age',
        key: 'age',
       
    },
    {
        title: '退票费区间',
        dataIndex: 'age',
        key: 'age',
       
    },
    {
        title: '最早取位时限',
        dataIndex: 'age',
        key: 'age',
       
    },
    {
        title: '实际取位时限',
        dataIndex: 'age',
        key: 'age',
       
    },
    {
        title: '最晚取位时限',
        dataIndex: 'age',
        key: 'age',
       
    },
    {
        title: '生效日期',
        dataIndex: 'age',
        key: 'age',
       
    },
    {
        title: '截止日期',
        dataIndex: 'age',
        key: 'age',
       
    },
    {
        title: '配置状态',
        dataIndex: 'age',
        key: 'age',
       
    },
    {
        title: '最后一次修改时间',
        dataIndex: 'age',
        key: 'age',
       
    },
  ];
  const selectedRowKeys=[];
  const hasSelected = selectedRowKeys.length > 0;
  const rowSelection = {
    selectedRowKeys,
    // onChange: this.onSelectChange,
  };
  
export default class Rule extends Component {


    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
      };
    
      start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
          this.setState({
            selectedRowKeys: [],
            loading: false,
          });
        }, 1000);
      };
    
      onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
      };

  
    render() {
        return (
        
                <div className="table">
                    <div className="table_type">
                        {/* 订单类型 */}
                        <div className="type_name">
                            {/* <div>订单类型</div> */}
                            <div className="radio">
                            <RadioGroup >
                                <Radio key="a" >国内</Radio>
                                <Radio key="b" >国际</Radio>
                            </RadioGroup>
                            </div>
                        </div>
                        {/* 航空公司 */}
                        <div className="type_name">
                            <div>航空公司</div>
                            <div className="radio">
                                <Input placeholder="请输入航司代码" />
                            </div>
                        </div>
                        {/* 舱位模式 */}
                        <div className="type_name">
                            <div>舱位模式</div>
                            <div className="radio">
                                <Select showSearch
                                    style={{ width: 200 }}
                                    placeholder="适用"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                
                                >
                                    <Option value="jack">杰克</Option>
                                    <Option value="lucy">露西</Option>
                                    <Option value="tom">汤姆</Option>
                                </Select>
                            </div>
                        </div>
                        {/* 舱位 */}
                        <div className="type_name">
                            <div>舱位</div>
                            <div className="radio">
                                <Select showSearch
                                    style={{ width: 200 }}
                                    placeholder="经济舱"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                
                                >
                                    <Option value="jack">杰克</Option>
                                    <Option value="lucy">露西</Option>
                                    <Option value="tom">汤姆</Option>
                                </Select>
                            </div>
                        </div>
                        {/* 配置状态 */}
                        <div className="type_name">
                            <div>配置状态</div>
                            <div className="radio">
                                <Select showSearch
                                    style={{ width: 200 }}
                                    placeholder="默认"
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
                        <Space style={{ marginBottom: 16 }}>
                            <Button onClick={this.setAgeSort}>+新增</Button>
                            <Button onClick={this.clearFilters}>批量启用</Button>
                            <Button onClick={this.clearAll}>批量停用</Button>
                            <Button onClick={this.clearAll}>批量删除</Button>
                        </Space>
                        <span style={{ marginLeft: 8 }}>
                            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                        </span>
                        <Table columns={columns} dataSource={data} rowSelection={rowSelection} onChange={this.handleChange} />
                    </div>

                </div>
        )
    }
}
