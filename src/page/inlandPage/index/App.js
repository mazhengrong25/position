/*
 * @Description: 取位国内列表
 * @Author: mazhengrong
 * @Date: 2020-10-12 10:59:32
 * @LastEditTime: 2020-12-25 17:49:55
 * @LastEditors: wish.WuJunLong
 */
import React, { Component } from "react";
// 单选框
import {
  Radio,
  Select,
  DatePicker,
  Input,
  Button,
  Table,
  Tag,
  message,
  Pagination,
  Modal,
  Tooltip,
} from "antd";

import axios from "@/api/api";

import "./App.scss";

import HeaderTitle from "@/components/headerTitle"

import Detail from "@/page/inlandPage/detail/detail";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const { Column } = Table;

const { TextArea } = Input;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newData: [],
      returnData: {

        page_no: 1,
        page_size: 10, // 当前页条数
        total_count:0,
        airline_code: "", // 航空公司二字代码
        ticket_type: "", // 票证类型
        date_type: 0, // 日期类型  0:导入时间 1：起飞时间 2：执行时间
        refund_type: 0, // 退票类型 0：所有 1：自愿 2：非自愿 3：自愿转非自愿
        query_type: 1, // 搜索类型1:退票单号 2:订单号 3:乘客姓名
        query_value: "", // 类型：String  可有字段  备注：搜索关键字，取决于query_type的搜索类型
        begin_date: "", // 开始日期
        end_date: "", // 结束日期
        // 类型：Mixed  可有字段  备注：执行状态，不传或传null查询所有。0：待取位 1：已取位 2：已航变 3:已退票 4：无需取位 -1:取消失败 -2:无效编码 -3:操作失败 -4:非法操作
        exec_state: null,
        pnr_code: "",
        ticket_no: "",
        is_flight_changes:null,
        exec_msg: "",
        refund_dept_code: "", // 退票部门code

      },
      ticketTypeList: [], // 票证类型数组

      headerStatus: 'all', // 头部状态

      statistics: {},

      config_time: "", // 待取位
      configStyle: "none",

      actionModal: false, // 处理弹窗
      actionType: "",
      actionMessage: "",
      actionKey: "",

      detailModal: false, // 取位详情弹窗
      details: {}, // 详情 
    };
  }

  async componentDidMount() {
    let data = JSON.parse(JSON.stringify(this.state.returnData));
    await this.setState({
      returnData:data,
    })
    await this.getDataList();
    await this.getStatistic();
    this.getTicketType();
  }

  // 获取取位列表
  getDataList() {
    let data = JSON.parse(JSON.stringify(this.state.returnData));
    axios.post("/api/DomcPnrData/GetPage", data).then((res) => {

        if(res.data.status !== 0){
          message.warning(res.data.message);
        }
        data.total_count = res.data.data.total_count;
        data.page_no = res.data.data.page_no;

        this.setState({
          newData: res.data.data.datas,
          returnData: data
        });
      
    });
  }

  // 获取票证类型
  getTicketType() {
    axios.get("api/DomcPnrData/getTicketTypes").then((res) => {
      if (res.data.status === 0) {
        this.setState({
          ticketTypeList: res.data.ticket_types,
        });
      } else {
        message.warning(res.data.message);
      }
    });
  }

  // 点击执行信息提交筛选框
  changeExecMsg (e){
    console.log(e)
    this.setState({
      exec_msg: e,
    });
  }

  // 搜索提交
  submitSeach = () => {
    this.getDataList();
  };

  // 跳转页面
  jumpDetails(val) {
    console.log("页面跳转", val);
    this.setState({
      detailModal: true,
      details: val,
    });
  }

  // 打开处理弹窗
  openActionModal = (val) => {
    console.log(val);
    this.setState({
      actionKey: val.key_id,
      actionModal: true,
    });
  };

  // 统计
  getStatistic() {
    let data = {
      refund_dept_code: this.state.returnData.refund_dept_code, // 退票部门code
    };
    axios.post("api/DomcPnrData/Statistics", data).then((res) => {
      let statisticsTotal = res.data.data;
      this.setState({
        statistics: statisticsTotal,
      });
    });
  }

  // 统计 点击
  changeHeaderBtn = async (e) => {
    console.log(e)
    let newData = JSON.parse(JSON.stringify(this.state.returnData))
    newData.exec_state = e.target.value !== "all"?e.target.value: null
    // if(e.target.value === 2){
    //   newData.is_flight_changes = true
    //   await this.setState({
    //     headerStatus: e.target.value,
    //     returnData:newData
    //   });
    //   await this.getDataList();
    //   return;
    // }
    await this.setState({
      headerStatus: e.target.value,
      returnData:newData
    });
    await this.getDataList();
  };


  // 处理弹窗提交
  submitChangeAction = () => {
    let data = {
      key_id: this.state.actionKey, //类型：Number  必有字段  备注：表id
      exec_state: Number(this.state.actionType), //类型：Number  必有字段  备注：执行状态 0：待取位 1：已取位 2：已航变 3:已退票 4：无需取位
      exec_msg: this.state.actionMessage,
    };
    axios.post("api/pnr/updateExecuteState", data).then((res) => {
      if (res.data.status === 0) {
        this.closeChangeAction();
        this.getDataList();
        return message.success(res.data.message);
      } else {
        return message.warning(res.data.message);
      }
    });
  };
  // 关闭处理弹窗
  closeChangeAction = () => {
    this.setState({
      actionModal: false,
    });
  };

  // 处理弹窗选择器
  changeActionSelect = (val) => {
    this.setState({
      actionType: val,
    });
  };
  // 处理弹窗输入框
  changeActionMessage(val) {
    this.setState({
      actionMessage: val.target.value,
    });
  }

  // 选择器返回值
  openSelect = (label,val) => {
    console.log(label,val)
    let data = JSON.parse(JSON.stringify(this.state.returnData))
    data[label] = val;
    this.setState({
      returnData:data
    })
  };

  // 输入框返回值
  openInput = (label,val) => {
    console.log(label,val)
    let data = JSON.parse(JSON.stringify(this.state.returnData))
    data[label] = val.target.value;
    this.setState({
      returnData:data
    })
  }

  // 头部信息  退票部门返回值
   headerSelect = async(e) => {
     await this.setState({
       depCode: e
      })
      console.log(e)
    await this.getDataList()
    await this.getStatistic()
  }

  render() {
    return (
      <div className="centent">
        {/* 统计横幅 */}
        <div className="count">
          <RadioGroup
            onChange={this.changeHeaderBtn}
            buttonStyle="solid"
            value={this.state.headerStatus}
            optionType="button"
          >
            <RadioButton value={'all'}>
              全部{" "}
              <div className="count_tag">{this.state.statistics.total}</div>
            </RadioButton>
            <RadioButton value={0}>
              待取位{" "}
              <div className="count_tag">
                {this.state.statistics.notcancelled_total}
              </div>
            </RadioButton>
            <RadioButton value={1}>
              已取位{" "}
              <div className="count_tag">
                {this.state.statistics.cancelled_total}
              </div>
            </RadioButton>
            <RadioButton value={2}>
              已航变{" "}
              <div className="count_tag">
                {this.state.statistics.flightchanges_total}
              </div>
            </RadioButton>
            <RadioButton value={3}>
              已退票{" "}
              <div className="count_tag">
                {this.state.statistics.refunded_total}
              </div>
            </RadioButton>
            <RadioButton value={4}>
              无需取位{" "}
              <div className="count_tag">
                {this.state.statistics.noneed_cancel_total}
              </div>
            </RadioButton>
            <RadioButton value={-1}>
              取消失败{" "}
              <div className="count_tag">
                {this.state.statistics.cancel_failed_total}
              </div>
            </RadioButton>
            <RadioButton value={-2}>
              无效编码{" "}
              <div className="count_tag">
                {this.state.statistics.invalid_pnr_total}
              </div>
            </RadioButton>
            <RadioButton value={-3}>
              操作失败{" "}
              <div className="count_tag">
                {this.state.statistics.oper_failed_total}
              </div>
            </RadioButton>
            <RadioButton value={-4}>
              非法操作{" "}
              <div className="count_tag">
                {this.state.statistics.illegal_oper_total}
              </div>
            </RadioButton>
          </RadioGroup>
        </div>

        {/* 标题和退票部门 */}
        <HeaderTitle titleName="国内取位列表" headerSelect={this.headerSelect}></HeaderTitle>
        {/* 表格 */}
        <div className="table">
          <div className="table_type">
            {/* 是否航变 */}
            <div className="type_name">
              <div>是否航变</div>
              <div className="radio">
                <Select
                  style={{ width: 200 }}
                  placeholder="全部"
                  onChange={this.openSelect.bind(this,"is_flight_changes")}
                  value={this.state.returnData.is_flight_changes}
                >
                  <Option value={null}>全部</Option>
                  <Option value={true}>已航变</Option>
                  <Option value={false}>未航变</Option>
                </Select>
              </div>
            </div>
            {/* 票证类型 */}
            <div className="type_name">
              <div>票证类型</div>
              <div className="radio">
                <Select
                  allowClear
                  style={{ width: 200 }}
                  placeholder="所有"
                  onChange={this.openSelect.bind(this,"ticket_type")}
                >
                  {this.state.ticketTypeList.map((item) => (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            {/* 执行时间 起飞时间  导入时间*/}
            <div className="type_name">
              <Select
                defaultValue={2}
                style={{ width: 100 }}
                bordered={false}
                onChange={this.openSelect.bind(this,"date_type")}
              >
                <Option value={2}>执行时间</Option>
                <Option value={1}>起飞时间</Option>
                <Option value={0}>导入时间</Option>
              </Select>
              <div className="radio">
                <DatePicker
                  placeholder="选择时间"
                  onChange={this.openSelect.bind(this, "begin_date")}
                />
                -
                <DatePicker placeholder="选择时间" onChange={this.openSelect.bind(this,"end_date")} />
              </div>
            </div>
            {/* 航空公司 */}
            <div className="type_name">
              <div>航空公司</div>
              <div className="radio">
                <Input
                  allowClear
                  placeholder="请填写"
                  onChange={this.openInput.bind(this,"airline_code")}
                />
              </div>
            </div>
            {/* 是否自愿 */}
            <div className="type_name">
              <div>是否自愿</div>
              <div className="radio">
                <Select
                  allowClear
                  style={{ width: 200 }}
                  placeholder="所有"
                  onChange={this.openSelect.bind(this,"refund_type")}
                >
                  <Option value={0}>所有</Option>
                  <Option value={1}>自愿</Option>
                  <Option value={2}>非自愿</Option>
                  <Option value={3}>自愿转非自愿</Option>
                </Select>
              </div>
            </div>
            {/* 乘客姓名 退票单号  乘客姓名 搜索类型*/}
            <div className="type_name">
              <Select
                defaultValue={1}
                style={{ width: 100 }}
                bordered={false}
                onChange={this.openSelect.bind(this,"query_type")}
              >
                <Option value={1}>退票单号</Option>
                <Option value={2}>订单号</Option>
                <Option value={3}>乘客姓名</Option>
              </Select>
              <div className="radio">
                <Input
                  allowClear
                  onChange={this.openInput.bind(this,"query_value")}
                  placeholder="请输入"
                />
              </div>
            </div>
            {/* PNR编码 */}
            <div className="type_name">
              <div>PNR编码</div>
              <div className="radio">
                <Input
                  allowClear
                  onChange={this.openInput.bind(this, "pnr_code")}
                  placeholder="请输入"
                />
              </div>
            </div>
            
            {/* 票号 */}
            <div className="type_name">
              <div>票号</div>
              <div className="radio">
                <Input
                  allowClear
                  onChange={this.openInput.bind(this, "ticket_no")}
                  placeholder="请输入"
                />
              </div>
            </div>
            {/* 执行信息 */}
            <div className="type_name">
              <div>执行信息</div>
              <div className="radio">
                <Input
                  allowClear
                  value={this.state.exec_msg}
                  onChange={this.openInput.bind(this, "exec_msg")}
                  placeholder="请输入"
                />
              </div>
            </div>
            {/* 搜索按钮 */}
            <div className="type_name">
              <Button type="primary" onClick={this.submitSeach}>
                搜索
              </Button>
            </div>
          </div>

          <div className="table_main">
            <Table
              size="small"
              dataSource={this.state.newData}
              pagination={false}
              bordered
              rowKey="key_id"
            >
              <Column
                title="编号"
                render= {(text,record,index) => (<div>{index + 1}</div>)}
              />
              <Column
                title="操作"
                render={(text,record) => (
                  
                  <div>
                    <Tag color="#5AB957" onClick={() => this.jumpDetails(record)}>
                      详
                    </Tag>
    
                    <Tag color="#0070E2" onClick={() => this.openActionModal(record)}>
                      处理
                    </Tag>
                  </div>
                )}   
              />
              <Column
                title="PNR"
                dataIndex="pnr_code"
                render={(text) => (
                
                    <Tooltip title={() => (
                      <>
                        <p style={{ fontSize: "14px", marginBottom: "5px" }}>
                          PNR状态
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "rgba(255, 255, 255, .8)",
                            minWidth: "200px",
                            marginBottom: "5px",
                          }}
                        >
                          {text}
                        </p>
                      </>
                    )}>{text}
                    </Tooltip>
                )}   
              />
              <Column title="票号" dataIndex="ticket_no"/>
              <Column title="GDS系统标识" dataIndex="gds_type"/>
              <Column title="票证类型" dataIndex="ticket_type"/>
              <Column title="航司代码" dataIndex="airline_code"/>
              <Column title="舱位" dataIndex="cabin_code"/>
              <Column title="起飞时间" dataIndex="fly_time"/>
              <Column title="乘客姓名" dataIndex="passenger_name"/>
              <Column
                title="航程类型"
                dataIndex="route_type"
                render={(text) => <>{text === "OW" ? "单程" : ""}</>}
              />
              <Column
                title="执行状态" 
                dataIndex="exec_state"
                render={(text,record) =>(
                  <Tooltip
                    title={() => (
                      <>
                        <p style={{ fontSize: "14px", marginBottom: "5px" }}>
                          执行信息
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "rgba(255, 255, 255, .8)",
                            minWidth: "200px",
                            marginBottom: "5px",
                            cursor: 'pointer'
                          }}
                          onClick={() =>this.changeExecMsg(record.exec_msg)}
                        >
                          {record.exec_msg}
                        </p>
                      </>
                    )}
                  >
                    <div
                      style={{
                        color:
                          record.exec_state === 0
                            ? "#0070E2"
                            : record.exec_state === 1
                            ? "#5AB957"
                            : record.exec_state === 3
                            ? "#5AB957"
                            : record.exec_state === 4
                            ? "#999999"
                            : record.exec_state === -1
                            ? "#FF0000"
                            : record.exec_state === -2
                            ? "#FF0000"
                            : record.exec_state === -3
                            ? "#FF0000"
                            : record.exec_state === -4
                            ? "#FF0000"
                            : "",
                      }}
                    >
                      {record.exec_state === 0
                        ? "待取位"
                        : record.exec_state === 1
                        ? "已取位"
                        : record.exec_state === 3
                        ? "已退票"
                        : record.exec_state === 4
                        ? "无需取位"
                        : record.exec_state === -1
                        ? "取位失败"
                        : record.exec_state === -2
                        ? "无效编码"
                        : record.exec_state === -3
                        ? "操作失败"
                        : record.exec_state === -4
                        ? "非法操作"
                        : record.exec_state}
                    </div>
                </Tooltip>
                
                )}
              />
              <Column
                title="是否航变"
                dataIndex="is_flight_changes"
                render={(text) => <>{text ? "已航变" : "未航变"}</>}
              />
              <Column
                title="已执行时间"
                render={(text,record) => (
                  <Tooltip
                      placement="bottomLeft"
                      title={() => (
                        <>
                          <p style={{ width: "240px" }}>
                            已执行时间：
                            {this.$moment(record.exec_time).format(
                              "YYYY-MM-DD HH:mm"
                            )}
                          </p>
                          <p style={{ width: "240px" }}>
                            预计下次执行时间：
                            {this.$moment(record.next_exec_time).format(
                              "YYYY-MM-DD HH:mm"
                            )}
                          </p>
                          <p style={{ width: "240px", marginBottom: "0" }}>
                            审核时间：
                            {this.$moment(record.audit_time).format(
                              "YYYY-MM-DD HH:mm"
                            )}
                          </p>
                        </>
                      )}
                    >
                      <span>
                        {this.$moment(record.exec_time).format("YYYY-MM-DD HH:mm")}
                      </span>
                    </Tooltip>
                
                )}
              />
            </Table>
            <div
              style={{ display: this.state.configStyle }}
              className="config_modal"
            >
              <div className="config_title">执行消息</div>
              <div className="config_message">
                将在{this.state.config_time}的时候进行取位
              </div>
            </div>

            {/* 分页 */}
            <div className="table_pagination">
              <Pagination
                current={Number(this.state.returnData.page_no)}
                pageSize={Number(this.state.returnData.page_size)}
                total={Number(this.state.returnData.total_count)}
                position={this.state.bottom}
                onChange={this.changePage}
              />
              <div className="datas_total">
                共 <span>{ this.state.returnData.total_count }</span> 条记录
              </div>
            </div>
          </div>
        </div>

        <Modal
          maskClosable={false}
          centered
          title="执行状态"
          visible={this.state.actionModal}
          onOk={this.submitChangeAction}
          onCancel={this.closeChangeAction}
        >
          <div className="action_modal">
            <div className="modal_select">
              <div className="select_name">类型选择</div>
              <Select
                defaultValue="0"
                style={{ width: 120 }}
                onChange={this.changeActionSelect}
              >
                <Option value="0">待取位</Option>
                <Option value="1">已取位</Option>
                <Option value="2">已航变</Option>
                <Option value="3">已退票</Option>
                <Option value="4">无需取位</Option>
              </Select>
            </div>

            <div className="modal_input">
              <TextArea
                onChange={this.changeActionMessage.bind(this)}
                row={6}
                placeholder="请输入备注原因"
              />
            </div>
          </div>
        </Modal>

        {/* 详情信息弹窗 */}
        <Modal
          centered
          footer={null}
          title="详情信息"
          destroyOnClose
          width={1200}
          visible={this.state.detailModal}
          onCancel={() => this.setState({ detailModal: false })}
        >
          <Detail details={this.state.details}></Detail>
        </Modal>     
      </div>
    );
  }
}
