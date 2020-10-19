/*
 * @Description: 
 * @Author: mazhengrong
 * @Date: 2020-10-12 18:15:28
 * @LastEditTime: 2020-10-19 16:41:29
 * @LastEditors: Please set LastEditors
 */
import  React,{ Component } from 'react'

import { Radio , Select  , Input , Button ,Table, Space , Modal , Pagination ,Tooltip } from 'antd';

import Axios from 'axios'
// 引用样式
import './rule.scss'
// 时间处理
import moment from 'moment'


const RadioGroup = Radio.Group;
const Option = Select.Option;

const selectedRowKeys=[];
const hasSelected = selectedRowKeys.length > 0;


// 分页  上一页  下一页
function itemRender(current, type, originalElement) {
    if (type === 'prev') {
      return <a>上一页</a>;
    }
    if (type === 'next') {
      return <a>下一页</a>;
    }
    return originalElement;
}

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
};
  
export default class Rule extends Component {

    componentDidMount() {
       this.getToken();
    }

    constructor(props) {
        console.log(props);
        super(props);
        this.state = { 
          data: [],
          modalVisible:false, //模态框
          top: 'topLeft',
          bottom: 'bottomRight',
        columns: [
            {
              title: '操作',
              dataIndex: 'name',
              key: 'name',
              render: (text, row, index) => {
            
                return (
                  <div>
                   <Button type="link" onClick={() => this.setModalVisible(true)}>修改</Button>
                   <Modal
                        title="修改规则"
                        centered
                        visible={this.state.modalVisible}
                        onOk={() => this.setModalVisible(false)}
                        onCancel={() => this.setModalVisible(false)}
                        >
                        <p>some contents...</p>
                        <p>some contents...</p>
                        <p>some contents...</p>
                    </Modal>
                  </div>
                );
              },
            
            },
            {
              title: '所属航司',
              dataIndex: 'airline_code',
              key: 'airline_code',
             
            },
            {
                title: '舱位模式',
                dataIndex: 'execute_mode',
                key: 'execute_mode',
                render: (mode) => {
                    let newmode = mode === 'true'?'适用':'禁止'      
                    return newmode
                }
               
            },
            {
                title: '舱位代码',
                dataIndex: 'cabin_code',
                key: 'cabin_code',
                render: (code) => {
                    return(
                        <Tooltip title={code}>
                        <span className="cabin_code">
                            {code}
                        </span>
                    </Tooltip>
                        
                    )
                }
               
            },
            {
                title: '退票费区间',
                render: (state) => {
                    return state.min_refund_fee.tofixed(2) + "-" + state.max_refund_fee.tofixed(2)
                }
               
            },
            {
                title: '最早取位时限',
                dataIndex: 'earliest_limit',
                key: 'earliest_limit',
                render: (state) => {
                    return state + '分'
                }
               
            },
            {
                title: '实际取位时限',
                dataIndex: 'execute_limit',
                key: 'execute_limit',
                render: (state) => {
                    return state + '分'
                }
               
            },
            {
                title: '最晚取位时限',
                dataIndex: 'latest_limit',
                key: 'latest_limit',
                render: (state) => {
                    return state + '分'
                }
               
            },
            {
                title: '生效日期',
                dataIndex: 'effect_date',
                key: 'effect_date',
                render: (state) => {
                    return moment(state).format('YYYY-MM-DD')
                }
               
            },
            {
                title: '截止日期',
                dataIndex: 'expiry_date',
                key: 'expiry_date',
                render: (state) => {
                    return moment(state).format('YYYY-MM-DD')
                }
            },
            {
                title: '配置状态',
                dataIndex: 'config_state',
                key: 'config_state',
                render: (config) => {
                    let style
                    let text 
                    if(config === 2){
                        style = {
                            color: '#5AB957'
                        }
                        text = '可用'
                    }else if(config === 1){
                        style = {
                            color: '#FF0000'
                        }
                        text ='不可用'
                    }
                    return (
                        <div style={style}>{text}</div>
                    )
                    
                }
               
            },
            {
                title: '最后一次修改时间',
                dataIndex: 'modify_time',
                key: 'modify_time',
                render: (state) => {
                    return moment(state).format('YYYY-MM-DD HH:mm:ss')
                }
               
            },
          ]
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

    //模态框 确定取消
    setModalVisible(val) {
        console.log(val)
        this.setState({modalVisible: val})
    }

    // 新增
    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
          key: count,
          name: `Edward King ${count}`,
          age: 32,
          address: `London, Park Lane no. ${count}`,
        };
        this.setState({
          dataSource: [this.state.data, newData],
          count: count + 1,
        });
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
                                    <Option value="jack">所有</Option>
                                    <Option value="lucy">适用</Option>
                                    <Option value="tom">禁止</Option>
                                </Select>
                            </div>
                        </div>
                        {/* 舱位 */}
                        <div className="type_name">
                            <div>舱位</div>
                            <div className="radio">
                                <Input placeholder="请输入舱位" />
                            </div>
                        </div>
                        {/* 配置状态 */}
                        <div className="type_name">
                            <div>配置状态</div>
                            <div className="radio">
                                <Select showSearch
                                    style={{ width: 200 }}
                                    placeholder="可用"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                
                                >
                                    <Option value="tom">所有</Option>
                                    <Option value="jack">可用</Option>
                                    <Option value="lucy">不可用</Option>
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
                            <Button onClick={this.handleAdd}>+新增</Button>
                            <Button onClick={this.clearFilters}>批量启用</Button>
                            <Button onClick={this.clearAll}>批量停用</Button>
                            <Button onClick={this.clearAll}>批量删除</Button>
                        </Space>
                        <span style={{ marginLeft: 8 }}>
                            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                        </span>
                        <Table columns={this.state.columns} dataSource={this.state.data}  
                        onChange={this.handleChange} 
                        rowSelection={rowSelection}
                        pagination={false}
                        // pagination={{ position: [ this.state.bottom] }}
                        bordered/>
                        {/* 分页 */}
                        <Pagination total={500} itemRender={itemRender}  position={this.state.bottom}/>
                    </div>

                </div>
        )
    }
}
