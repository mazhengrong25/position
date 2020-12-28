/*
 * @Description: 取位国内列表
 * @Author: mazhengrong
 * @Date: 2020-10-12 10:59:32
 * @LastEditTime: 2020-12-25 18:20:53
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

import "./index.scss";

import HeaderTitle from "@/components/headerTitle"

import Detail from "@/page/inlandPage/detail/detail";

import RulePage from "@/page/inlandPage/rule/rule";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const { TextArea } = Input;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      itemType: 1, //搜索类型
      itemValue: "", //搜索关键字

      timeValue: 2, //日期类型

      status: null, //执行状态
      ticketTypeList: [], // 票证类型数组
      type: "", //票证类型
      time: null, //执行时间
      air: "", //航空公司
      volun: 0, //是否自愿
      orderType: "国内", //订单类型
      start: "", //开始日期
      end: "", // 结束日期

      columns: [
        {
          title: "编号",
          render: (text, record, index) => `${index + 1}`,
        },
        {
          title: "操作",
          coldiv: 2,
          render: (text, row) => {
            return (
              <div>
                <Tag color="#5AB957" onClick={() => this.jumpDetails(row)}>
                  详
                </Tag>

                <Tag color="#0070E2" onClick={() => this.openActionModal(row)}>
                  处理
                </Tag>
              </div>
            );
          },
        },
        {
          title: "PNR",
          render: (text, record) => (
            <>
              <Tooltip
                title={() => (
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
                      {record.pnr_state || ""}
                    </p>
                  </>
                )}
              >
                <div>{record.pnr_code}</div>
              </Tooltip>
            </>
          ),
        },
        {
          title: "票号",
          dataIndex: "ticket_no",
        },
        {
          title: "GDS系统标识",
          dataIndex: "gds_type",
        },
        {
          title: "票证类型",
          dataIndex: "ticket_type",
        },
        {
          title: "航司代码",
          dataIndex: "airline_code",
        },
        {
          title: "舱位",
          dataIndex: "cabin_code",
        },
        {
          title: "起飞时间",
          dataIndex: "fly_time",
          render: (state) => {
            return this.$moment(state).format("YYYY-MM-DD HH:mm");
          },
        },
        {
          title: "乘客姓名",
          dataIndex: "passenger_name",
        },
        {
          title: "航程类型",
          dataIndex: "route_type",
          render: (text) => {
            let newType = text === "OW" ? "单程" : "";
            return newType;
          },
        },
        {
          title: "执行状态",
          dataIndex: "exec_state",
          render: (text, record) => {
            return (
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
            );
          },
        },
        {
          title: "是否航变",
          dataIndex: "is_flight_changes",
          render: (text) => {
            return text ? "已航变" : "未航变";
          },
        },
        {
          title: "规则匹配",
          dataIndex: "config_id",
          render: (state) => {
            let color;
            let text;
            let style;
            if (state !== "0") {
              color = "#5AB957";
              text = "已关联";
            } else if (state === "0") {
              color = "#AFB9C4";
              text = "未关联";
              style = {
                cursor: "not-allowed",
              };
            }

            return (
              <div>
                <Tag
                  style={style}
                  onClick={() => this.jumpRule(state)}
                  color={color}
                >
                  {text}
                </Tag>
              </div>
            );
          },
        },
        {
          title: "已执行时间",
          render: (state, record) => {
            return (
              <>
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
                      <p style={{ width: "240px", marginBottom: "0" }}>
                        预计下次执行时间：
                        {this.$moment(record.next_exec_time).format(
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
              </>
            );
          },
        },
      ],

      headerStatus: "all", // 头部状态

      statistics: {},

      pageNumber: 1, // 分页-当前页数
      pageCount: 1, // 分页-总页码
      totalCount: 0, // 总条数
      pageSize: 10, // 分页-页面条数

      config_time: "",
      configStyle: "none",

      actionModal: false, // 处理弹窗
      actionType: "",
      actionMessage: "",
      actionKey: "",

      detailModal: false, // 取位详情弹窗
      details: {}, // 详情

      ruleModal: false,
      ruleKey: "", // 规则key

      pnr_code: "",
      ticket_no: "",

      is_flight_changes: 'null', // 是否航变

      exec_msg: '', // 航变执行信息

      depCode: '', // 退票部门code
    };
  }

  componentDidMount() {
    this.getDataList();
    this.getStatistic();
    this.getTicketType();
  }

  // 获取取位列表
  getDataList(page, size) {
    let data = {
      page_no: page || this.state.pageNumber,
      page_size: size || this.state.pageSize, // 当前页条数
      airline_code: this.state.air, // 航空公司二字代码
      intl_flag: false, // 订单类型
      ticket_type: this.state.type === "all" ? "" : this.state.type, // 票证类型
      date_type: Number(this.state.timeValue), // 日期类型  0:导入时间 1：起飞时间 2：执行时间
      refund_type: Number(this.state.volun), // 退票类型 0：所有 1：自愿 2：非自愿
      query_type: Number(this.state.itemType), // 搜索类型 1:PNR编码 2:票号 3:订单号 4:乘客姓名
      query_value: this.state.itemValue, // 类型：String  可有字段  备注：搜索关键字，取决于query_type的搜索类型
      begin_date: this.state.start, // 开始日期
      end_date: this.state.end, // 结束日期
      exec_state: this.state.headerStatus !== '2' ?Number(this.state.headerStatus) ?? null : null,
      pnr_code: this.state.pnr_code,
      ticket_no: this.state.ticket_no,
      is_flight_changes:
        this.state.is_flight_changes === "1"
          ? true
          : this.state.is_flight_changes === "2"
          ? false
          : null, // 是否航变
      exec_msg: this.state.exec_msg,
      refund_dept_code: this.state.depCode, // 退票部门code
    };
    axios.post("/api/pnr/getdata", data).then((res) => {
      if (res.data.status === 0) {
        let newData = res.data.datas || [];
        this.setState({
          data: newData,
          totalCount: res.data.total_count,
          pageNumber: res.data.page_no,
        });
      } else {
        this.setState({
          data: [],
          totalCount: res.data.total_count,
          pageNumber: res.data.page_no,
        });
        message.warning(res.data.message);
      }
    });
  }

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

  // 执行状态
  handleStatus = (val) => {
    console.log(val);
    this.setState({
      // headerStatus: Number(val),
      headerStatus: val,
    });
  };

  // 是否航变
  ticketChange = (val) => {
    console.log(val);
    this.setState({
      is_flight_changes: val,
    });
  };

  // 票证类型
  handleType = (val) => {
    console.log(val);
    this.setState({
      type: val,
    });
  };

  // 是否自愿
  handleVolun = (val) => {
    console.log(val);
    this.setState({
      volun: val,
    });
  };

  // 日期类型
  handleTime = (val) => {
    this.setState({
      timeValue: Number(val.value),
    });
  };

  // 订单类型
  handleOrder = (val) => {
    console.log("订单类型", val.target.value);
    this.setState({
      orderType: val.target.value,
    });
  };

  // 搜索类型 点击事件
  handleChange = (val) => {
    console.log(val.label);
    this.setState({
      itemType: Number(val.value),
    });
  };

  // 搜素类型 内容
  changeModalInpit(val) {
    this.setState({
      itemValue: val.target.value,
    });
  }

  // 日期选择  开始时间
  startChange = (date, dateString) => {
    console.log("开始时间", dateString);
    this.setState({
      start: dateString,
    });
  };

  // 日期选择  结束时间
  endChange = (date, dateString) => {
    console.log("结束时间", dateString);
    this.setState({
      end: dateString,
    });
  };

  // 航空公司
  handleAir = (val) => {
    console.log("航空公司", val.target.value);
    this.setState({
      air: val.target.value,
    });
  };

  changeInput = (label, e) => {
    if (label === "ticket_no") {
      this.setState({
        ticket_no: e.target.value,
      });
    }
    if (label === "pnr_code") {
      this.setState({
        pnr_code: e.target.value,
      });
    }
    if(label === 'exec_msg'){
      this.setState({
        exec_msg: e.target.value,
      });
    }
  };

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

  // 跳转规则页面
  jumpRule(val) {
    if (val === "0") {
      return false;
    }

    this.setState({
      ruleModal: true,
      ruleKey: val,
    });
  }

  // 统计
  getStatistic() {
    let data = {
      refund_dept_code: this.state.depCode, // 退票部门code
    };
    axios.post("/api/pnr/statistics", data).then((res) => {
      let statisticsTotal = res.data.statistics;
      this.setState({
        statistics: statisticsTotal,
      });
    });
  }

  // 统计 点击
  changeHeaderBtn = async (e) => {
    console.log(e)
    if(e.target.value === '2'){
      await this.setState({
        is_flight_changes: '1',
        headerStatus: e.target.value,
      });
      await this.getDataList();
      return;
    }
    await this.setState({
      headerStatus: e.target.value,
    });
    await this.getDataList();
  };

  // 取位执行时间弹窗
  hoverMotion(val) {
    console.log(val);
    if (val.exec_state !== 0) {
      return false;
    }
    this.setState({
      config_time: val.next_exec_time,
      configStyle: "block",
    });
    setTimeout(() => {
      this.setState({
        configStyle: "none",
      });
    }, 2000);
  }

  // 分页
  changePage = (page, size) => {
    this.setState({
      pageNumber: page,
      pageSize: size,
    });
    this.getDataList(page, size);
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

  // 头部信息  退票部门返回值
   headerSelect = async(e) => {
     await this.setState({
       depCode: e
      })
      console.log(e)
    await this.getDataList()
    await this.getStatistic()
  }

  jumpNewAddress(url){
    this.props.history.push('/'+url);
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
            <RadioButton value="all">
              全部{" "}
              <div className="count_tag">{this.state.statistics.total}</div>
            </RadioButton>
            <RadioButton value="0">
              待取位{" "}
              <div className="count_tag">
                {this.state.statistics.notcancelled_total}
              </div>
            </RadioButton>
            <RadioButton value="1">
              已取位{" "}
              <div className="count_tag">
                {this.state.statistics.cancelled_total}
              </div>
            </RadioButton>
            <RadioButton value="2">
              已航变{" "}
              <div className="count_tag">
                {this.state.statistics.flightchanges_total}
              </div>
            </RadioButton>
            <RadioButton value="3">
              已退票{" "}
              <div className="count_tag">
                {this.state.statistics.refunded_total}
              </div>
            </RadioButton>
            <RadioButton value="4">
              无需取位{" "}
              <div className="count_tag">
                {this.state.statistics.noneed_cancel_total}
              </div>
            </RadioButton>
            <RadioButton value="-1">
              取消失败{" "}
              <div className="count_tag">
                {this.state.statistics.cancel_failed_total}
              </div>
            </RadioButton>
            <RadioButton value="-2">
              无效编码{" "}
              <div className="count_tag">
                {this.state.statistics.invalid_pnr_total}
              </div>
            </RadioButton>
            <RadioButton value="-3">
              操作失败{" "}
              <div className="count_tag">
                {this.state.statistics.oper_failed_total}
              </div>
            </RadioButton>
            <RadioButton value="-4">
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
                  value={this.state.is_flight_changes}
                  onChange={this.ticketChange}
                >
                  <Option value="null">全部</Option>
                  <Option value="1">已航变</Option>
                  <Option value="2">未航变</Option>
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
                  onChange={this.handleType}
                >
                  {this.state.ticketTypeList.map((item) => (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            {/* 执行时间 */}
            <div className="type_name">
              <Select
                defaultValue={{ value: "2" }}
                labelInValue
                style={{ width: 100 }}
                bordered={false}
                onChange={this.handleTime}
              >
                <Option value="2">执行时间</Option>
                <Option value="1">起飞时间</Option>
                <Option value="0">导入时间</Option>
              </Select>
              <div className="radio">
                <DatePicker
                  placeholder="选择时间"
                  onChange={this.startChange}
                />
                -
                <DatePicker placeholder="选择时间" onChange={this.endChange} />
              </div>
            </div>
            {/* 航空公司 */}
            <div className="type_name">
              <div>航空公司</div>
              <div className="radio">
                <Input
                  allowClear
                  placeholder="请填写"
                  onChange={this.handleAir.bind(this)}
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
                defaultValue={{ value: "4" }}
                labelInValue
                style={{ width: 100 }}
                bordered={false}
                onChange={this.handleChange}
              >
                <Option value="4">乘客姓名</Option>
                <Option value="3">订单号</Option>
              </Select>
              <div className="radio">
                <Input
                  allowClear
                  onChange={this.changeModalInpit.bind(this)}
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
                  onChange={this.changeInput.bind(this, "pnr_code")}
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
                  onChange={this.changeInput.bind(this, "ticket_no")}
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
                  onChange={this.changeInput.bind(this, "exec_msg")}
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
            
            <div className="type_name">
            
            <Button type="link" onClick={() => this.jumpNewAddress("newList")}>新版列表</Button>
            </div>
          </div>

          <div className="table_main">
            <Table
              size="small"
              columns={this.state.columns}
              dataSource={this.state.data}
              pagination={false}
              bordered
              rowKey="key_id"
            />
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
                current={Number(this.state.pageNumber)}
                pageSize={Number(this.state.pageSize)}
                total={Number(this.state.totalCount)}
                position={this.state.bottom}
                onChange={this.changePage}
              />
              <div className="datas_total">
                共 <span>{ this.state.totalCount }</span> 条记录
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
          width={1200}
          visible={this.state.detailModal}
          onCancel={() => this.setState({ detailModal: false })}
        >
          <Detail details={this.state.details}></Detail>
        </Modal>

        {/* 取位规则弹窗 */}
        <Modal
          centered
          footer={null}
          title="取位规则"
          width={1200}
          visible={this.state.ruleModal}
          onCancel={() => this.setState({ ruleModal: false })}
        >
          <RulePage keyId={this.state.ruleKey}></RulePage>
        </Modal>
      </div>
    );
  }
}