/*
 * @Description:
 * @Author: mazhengrong
 * @Date: 2020-10-12 10:59:32
 * @LastEditTime: 2020-10-20 14:52:45
 * @LastEditors: Please set LastEditors
 */
import React, { Component } from "react";
// 单选框
import { Radio, Select, DatePicker, Input, Button, Table, Tag , Tooltip} from "antd";

import Axios from "axios";

import "./App.scss";

import moment from "moment";

import "moment/locale/zh-cn";
import locale from "antd/lib/date-picker/locale/en_US";
import { Link } from "react-router-dom";
moment.locale("zh-cn");

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const columns = [
  {
    title: "编号",
    render: (text, record, index) => `${index + 1}`
  },
  {
    title: "操作",
    coldiv: 2,
    dataIndex: "action",
    key: 'action',
    render: (text, row, index) => {
      return (
        <div>
          <Link to="/detail">
            <Tag color="#5AB957">详</Tag>
          </Link>
          <Tooltip title={123}>
            <Tag color="#0070E2">处理</Tag>
          </Tooltip>
        </div>
      );
    },
  },
  {
    title: "PNR",
    dataIndex: "pnr_code",
    key: 'pnr_code'
  },
  {
    title: "票号",
    dataIndex: "ticket_no",
    key: "ticket_no"
  },
  {
    title: "PNR状态",
    dataIndex: "issue_dept_code",
    key: 'issue_dept_code'
  },
  {
    title: "GDS系统标识",
    dataIndex: "gds_type",
    key: "gds_type"
  },
  {
    title: "票证类型",
    dataIndex: "ticket_type",
    key: "ticket_type"
  },
  {
    title: "航司代码",
    dataIndex: "airline_code",
    key: "airline_code"
  },
  {
    title: "起飞时间",
    dataIndex: "fly_time",
    key: "fly_time",
    render: (state) => {
      return moment(state).format('YYYY-MM-DD HH:mm')
    }
  },
  {
    title: "乘客姓名",
    dataIndex: "passenger_name",
    key: "passenger_name"
  },
  {
    title: "航程类型",
    dataIndex: "route_type",
    key: "route_type",
    render: (text) => {
      let newType = text === 'OW'? '单程': ''
      return newType
    }
  },
  {
    title: "执行状态",
    dataIndex: "exec_state",
    key: "exec_state",
    render: (motion) => {
      let style
      let text 
      if(motion === 0){
          style = {
              color: '#0070E2'
          }
          text = '待取位'
      }else if(motion === 1){
          style = {
              color: '#5AB957'
          }
          text ='已取位'
      }else if(motion === 2){
          style = {
            color: '#5AB957'
          }
          text ='已航变'
      }else if(motion === 3){
        style = {
          color: '#5AB957'
        }
        text ='已退票'
      }else if(motion === 4){
        style = {
          color: '#999999'
        }
        text ='无需取位'
      }
      else if(motion === -1){
        style = {
          color: '#FF0000'
        }
        text ='取消失败'
      }
      return (
          <div style={style}>{text}</div>
      )
    }
  },
  {
    title: "规则匹配",
    dataIndex: "config_id",
    key: 'config_id',
    render: (state) => {
      let color
      let text
      if(state !== '0'){
          color = '#5AB957'
          text = '已关联'
      }else if(state === '0'){
          color = '#AFB9C4'
          text = '未关联'
      }
      return (
        <div>
          <Tag color={color}>{text}</Tag>
        </div>
      );
    },
  },
  {
    title: "已执行时间",
    dataIndex: "exec_time",
    key: "exec_time",
    render: (state) => {
      return moment(state).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: "预计下次执行时间",
    dataIndex: "next_exec_time",
    key: "next_exec_time",
    render: (state) => {
      return moment(state).format('YYYY-MM-DD HH:mm:ss')
    }
  },
];

export default class App extends Component {
  componentDidMount() {
    this.getToken()

  }

  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      data: [],
      itemType: '', //搜索类型
      itemValue: '',
      
      timeType: '', //日期类型
      timeValue: '',
    
      status: '', //执行状态
      type: '', //票证类型
      time: '', //执行时间
      air: '', //航空公司
      volun: '', //是否自愿
      orderType: 'false', //订单类型

      searchFrom: {}
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

  // 获取取位列表
  getDataList (val){
    let data
    if(val){
      data = val
    }else {
      data  = {
        page_no: 1, // 页码
        page_size: 20, // 当前页条数
        airline_code: "GJ", // 航空公司二字代码
        intl_flag: false, // 国际国内标识
      };
    }
    Axios.post("/api/pnr/getdata", data)
      .then((res) => {
        let newData = res.data.datas
        newData.forEach((item,index) => {
          item['key'] = index
        });
        this.setState({
          data: newData
        })
        console.log(this.state.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // 执行状态
  handleStatus = (val) =>{
    console.log(val)
    this.setState({
      status: val, 
    })
  } 

  // 票证类型
  handleType = (val) =>{
    console.log(val)
    this.setState({
      type: val, 
    })
  }

  // 是否自愿
  handleVolun = (val) =>{
    console.log(val)
    this.setState({
      volun: val, 
    })
  }

  // 日期类型
  handleTime = (val) =>{
    console.log('日期类型',val)
    this.setState({
        timeType: val.label, //日期类型
        timeValue: val.value 
    })
  }

  // 订单类型
  handleOrder = (val) => {
      console.log('订单类型',val.target.value)
      this.setState({
        orderType: val.target.value,
      })
  }

   // 搜索类型 点击事件
  handleChange = (val) => {
    console.log('搜索类型',val); 
    this.setState({
      itemType: val.label, //选择类型
      itemValue: val.value //
    })
  }



  // 搜索提交
  submitSeach = () => {

    
    let data = {
      page_no: 1, // 页码
      page_size: 20, // 当前页条数
      airline_code: "GJ", // 航空公司二字代码
      intl_flag: false, // 国际国内标识
      intl_flag: this.state.orderType, // 订单类型
      exec_state: this.state.status, // 执行状态
      ticket_type: this.state.type, // 票证类型
      date_type: this.state.timeType, // 日期类型  0:导入时间 1：起飞时间 2：执行时间
      refund_type: this.state.volun,  // 退票类型 0：所有 1：自愿 2：非自愿
      query_type: this.state.itemType, // 搜索类型 1:PNR编码 2:票号 3:订单号 4:乘客姓名
    }
    this.getDataList(data)
    console.log(data)
    // Axios.post("/api/pnr/getdata", data)
    //   .then((res) => {
    //     let newData = res.data.datas
    //     newData.forEach((item,index) => {
    //       item['key'] = index
    //     });
    //     this.setState({
    //       data: newData
    //     })
    //     console.log(this.state.data)
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

  }

  render() {
    return (
      <div className="centent">
        {/* 统计横幅 */}
        <div className="count">
          <RadioGroup>
            <RadioButton value="a">
              全部 <div className="count_tag">3236</div>
            </RadioButton>
            <RadioButton value="b">
              待取位 <div className="count_tag">832</div>
            </RadioButton>
            <RadioButton value="c">
              已取位 <div className="count_tag">2036</div>
            </RadioButton>
            <RadioButton value="d">
              已航变 <div className="count_tag">628</div>
            </RadioButton>
            <RadioButton value="d">
              已退票 <div className="count_tag">103</div>{" "}
            </RadioButton>
            <RadioButton value="d">
              无需取位 <div className="count_tag">65</div>
            </RadioButton>
            <RadioButton value="d">
              取消失败 <div className="count_tag">24</div>
            </RadioButton>
          </RadioGroup>
        </div>
        {/* 表格 */}
        <div className="table">
          <div className="table_type">
            {/* 订单类型 */}
            <div className="type_name">
              <div>订单类型</div>
              <div className="radio">
                <Radio.Group onChange={this.handleOrder} value={this.state.orderType}>
                  <Radio value="false">国内</Radio>
                  <Radio value="true">国际</Radio>
                </Radio.Group>
              </div>
            </div>
            {/* 执行状态 */}
            <div className="type_name">
              <div>执行状态</div>
              <div className="radio">
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="所有"
                  optionFilterProp="children"
                  notFoundContent="无法找到"
                  onChange={this.handleStatus}
                >
                  <Option value="all">所有</Option>
                  <Option value="0">待取位</Option>
                  <Option value="1">已取位</Option>
                  <Option value="2">已航变</Option>
                  <Option value="3">已退票</Option>
                  <Option value="4">无需取位</Option>
                  <Option value="-1">取消失败</Option>

                </Select>
              </div>
            </div>
            {/* 票证类型 */}
            <div className="type_name">
              <div>票证类型</div>
              <div className="radio">
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="所有"
                  optionFilterProp="children"
                  notFoundContent="无法找到"
                  onChange={this.handleType}
                >  
                  <Option value="all">所有</Option>
                  <Option value="BOP">BOP</Option>
                  <Option value="BSP">BSP</Option>
                  <Option value="B2B">B2B</Option>
                  <Option value="OP">OP</Option>
                </Select>
              </div>
            </div>
            {/* 执行时间 */}
            <div className="type_name">
              <Select
                defaultValue={{value: "2"}}
                labelInValue
                style={{ width: 100 }}
                bordered={false}
                onChange={this.handleTime}>
                <Option value="2">执行时间</Option>
                <Option value="1">起飞时间</Option>
                <Option value="0">导入时间</Option>
              </Select>
              <div className="radio">
                <DatePicker locale={locale} placeholder="选择时间" />-
                <DatePicker placeholder="选择时间" />
              </div>
            </div>
            {/* 航空公司 */}
            <div className="type_name">
              <div>航空公司</div>
              <div className="radio">
                <Input value={this.state.air} placeholder="请填写" />
              </div>
            </div>
            {/* 是否自愿 */}
            <div className="type_name">
              <div>是否自愿</div>
              <div className="radio">
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择"
                  optionFilterProp="children"
                  notFoundContent="无法找到"
                  onChange={this.handleVolun}
                >
                  <Option value="0">所有</Option>
                  <Option value="1">自愿</Option>
                  <Option value="2">非自愿</Option>
                </Select>
              </div>
            </div>
            {/* 乘客姓名 */}
            <div className="type_name">
              <Select
                defaultValue={{value: "4"}}
                labelInValue 
                style={{ width: 100 }}
                bordered={false}
                onChange={this.handleChange}>
                <Option value="4">乘客姓名</Option>
                <Option value="1">PNR编码</Option>
                <Option value="2">票号</Option>
                <Option value="3">订单号</Option>
              </Select>
              <div className="radio">
                <Input placeholder={'请输入'+ this.state.itemType} />
              </div>
            </div>
            {/* 搜索按钮 */}
            <div className="type_name">
              <Button type="primary" onClick={this.submitSeach}>搜索</Button>
            </div>
          </div>

          <div className="table_main">
            <Table columns={columns} dataSource={this.state.data} pagination={false} bordered />
          </div>
  
        </div>
      </div>
    );
  }
}
