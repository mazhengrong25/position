/*
 * @Description: 
 * @Author: mazhengrong
 * @Date: 2020-10-12 18:15:28
 * @LastEditTime: 2020-10-16 18:32:56
 * @LastEditors: Please set LastEditors
 */
import  React,{ Component } from 'react'

import { Radio , Select  , Input , Button ,Table, Space  } from 'antd';

import Axios from 'axios'
// 引用样式
import './rule.scss'


const RadioGroup = Radio.Group;
const Option = Select.Option;

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
        dataIndex: 'cabin_code',
        key: 'cabin_code',
       
    },
    {
        title: '退票费区间',
        dataIndex: 'age',
        key: 'age',
       
    },
    {
        title: '最早取位时限',
        dataIndex: 'earliest_limit',
        key: 'earliest_limit',
       
    },
    {
        title: '实际取位时限',
        dataIndex: 'execute_limit',
        key: 'execute_limit',
       
    },
    {
        title: '最晚取位时限',
        dataIndex: 'latest_limit',
        key: 'latest_limit',
       
    },
    {
        title: '生效日期',
        dataIndex: 'effect_date',
        key: 'effect_date',
       
    },
    {
        title: '截止日期',
        dataIndex: 'expiry_date',
        key: 'expiry_date',
       
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
  
export default class Rule extends Component {

    componentDidMount() {
       this.getToken();
    }

    constructor(props) {
        console.log(props);
        super(props);
        this.state = {
          data: [],
        };
    }

    // 获取token
    getToken (){
        let data = {
        key: ''
        }

        Axios.get('api/token/Authenticate',data)
        .then(res =>{
            console.log(res)
            if(res.data.status === 0){
            let token = res.data.token
            console.log(token)
            Axios.defaults.headers.common['Authorization'] = 'Bearer '+token;
    
            this.getDataList()
            }


        })

    }

    //获取取位规则列表
    getDataList () {

        let data = {
            "page_no":1,                //类型：Number  必有字段  备注：页码
            "page_size":10,                //类型：Number  必有字段  备注：显示数据条数
            "airline_code":"",                //类型：String  必有字段  备注：航空公司二字代码
            "intl_flag":false,                //类型：Boolean  必有字段  备注：国际国内标识 true:国际 false:国内
            "execute_mode":true,                //类型：Boolean  必有字段  备注：执行模式 true:执行取位 false:禁止取位
            "cabin_code":"",                //类型：String  必有字段  备注：舱位模式
            "config_state":0,                //类型：Number  必有字段  备注：配置状态 0:所有 1：禁用 2：可用
            "key_id":0               //类型：Number  可有字段  备注：表id
        };
        Axios.post("/api/pnrcancelconfig/getdata", data)
          .then((res) => {
            this.setState({
              data: res.data.datas
            })
            console.log(data)
          })
          .catch((err) => {
            console.log(err);
          });
    }

  
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
                        {/* 执行模式 */}
                        <div className="type_name">
                            <div>执行模式</div>
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
                        <Table columns={columns} dataSource={this.state.data}  onChange={this.handleChange} bordered/>
                    </div>

                </div>
        )
    }
}
