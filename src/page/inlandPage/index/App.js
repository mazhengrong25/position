/*
 * @Description:
 * @Author: mazhengrong
 * @Date: 2020-10-12 10:59:32
 * @LastEditTime: 2020-11-19 14:19:31
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
} from "antd";

import axios from "@/api/api";

import "./App.scss";

import Detail from "@/page/inlandPage/detail/detail";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const { TextArea } = Input;

// 分页  上一页  下一页
function itemRender(current, type, originalElement) {
  if (type === "prev") {
    return <p>上一页</p>;
  }
  if (type === "next") {
    return <p>下一页</p>;
  }
  return originalElement;
}

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
          dataIndex: "action",
          key: "action",
          render: (text, row, index) => {
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
          dataIndex: "pnr_code",
          key: "pnr_code",
        },
        {
          title: "票号",
          dataIndex: "ticket_no",
          key: "ticket_no",
        },
        {
          title: "PNR状态",
          dataIndex: "issue_dept_code",
          key: "issue_dept_code",
        },
        {
          title: "GDS系统标识",
          dataIndex: "gds_type",
          key: "gds_type",
        },
        {
          title: "票证类型",
          dataIndex: "ticket_type",
          key: "ticket_type",
        },
        {
          title: "航司代码",
          dataIndex: "airline_code",
          key: "airline_code",
        },
        {
          title: "起飞时间",
          dataIndex: "fly_time",
          key: "fly_time",
          render: (state) => {
            return this.$moment(state).format("YYYY-MM-DD HH:mm");
          },
        },
        {
          title: "乘客姓名",
          dataIndex: "passenger_name",
          key: "passenger_name",
        },
        {
          title: "航程类型",
          dataIndex: "route_type",
          key: "route_type",
          render: (text) => {
            let newType = text === "OW" ? "单程" : "";
            return newType;
          },
        },
        {
          title: "执行状态",
          // dataIndex: "exec_state",
          // key: "exec_state",
          render: (motion) => {
            let style;
            let text;
            if (motion.exec_state === 0) {
              style = {
                color: "#0070E2",
              };
              text = "待取位";
            } else if (motion.exec_state === 1) {
              style = {
                color: "#5AB957",
              };
              text = "已取位";
            } else if (motion.exec_state === 2) {
              style = {
                color: "#5AB957",
              };
              text = "已航变";
            } else if (motion.exec_state === 3) {
              style = {
                color: "#5AB957",
              };
              text = "已退票";
            } else if (motion.exec_state === 4) {
              style = {
                color: "#999999",
              };
              text = "无需取位";
            } else if (motion.exec_state === -1) {
              style = {
                color: "#FF0000",
              };
              text = "取消失败";
            }
            return (
              <div onMouseEnter={() => this.hoverMotion(motion)} style={style}>
                {text}
              </div>
            );
          },
        },
        {
          title: "规则匹配",
          dataIndex: "config_id",
          key: "config_id",
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
          dataIndex: "exec_time",
          key: "exec_time",
          render: (state) => {
            return this.$moment(state).format("YYYY-MM-DD HH:mm");
          },
        },
        {
          title: "预计下次执行时间",
          dataIndex: "next_exec_time",
          key: "next_exec_time",
          render: (state) => {
            return this.$moment(state).format("YYYY-MM-DD HH:mm");
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
    };
  }

  componentDidMount() {
    this.getDataList();
    this.getStatistic();
    this.getTicketType()
  }

  // 获取取位列表
  getDataList(page, size) {
    let data = {
      page_no: page || this.state.pageNumber,
      page_size: size || this.state.pageSize, // 当前页条数
      airline_code: this.state.air, // 航空公司二字代码
      intl_flag: this.state.orderType === "国内" ? false : true, // 订单类型
      ticket_type: this.state.type === "all" ? "" : this.state.type, // 票证类型
      date_type: Number(this.state.timeValue), // 日期类型  0:导入时间 1：起飞时间 2：执行时间
      refund_type: Number(this.state.volun), // 退票类型 0：所有 1：自愿 2：非自愿
      query_type: Number(this.state.itemType), // 搜索类型 1:PNR编码 2:票号 3:订单号 4:乘客姓名
      query_value: this.state.itemValue, // 类型：String  可有字段  备注：搜索关键字，取决于query_type的搜索类型
      begin_date: this.state.start, // 开始日期
      end_date: this.state.end, // 结束日期
      exec_state: Number(this.state.headerStatus) ?? null,
    };
    axios
      .post("/api/pnr/getdata", data)
      .then((res) => {
        if(res.data.status === 0){
          let newData = res.data.datas || [];
          this.setState({
            data: newData,
            totalCount: res.data.total_count,
            pageNumber: res.data.page_no,
          });
        }else {
          this.setState({
            data: [],
            totalCount: res.data.total_count,
            pageNumber: res.data.page_no,
          });
          message.warning(res.data.message)
        }
      })
  }

  getTicketType(){
    axios.get('api/DomcPnrData/getTicketTypes')
      .then(res =>{
        if(res.data.status === 0){
          this.setState({
            ticketTypeList: res.data.ticket_types
          })
        }else{
          message.warning(res.data.message)
        }
      })
  }

  // 执行状态
  handleStatus = (val) => {
    console.log(val);
    this.setState({
      // headerStatus: Number(val),
      headerStatus: val,
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
    setTimeout(() => {
      console.log("日期类型", this.state.timeValue);
    }, 300);
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
    setTimeout(() => {
      console.log("搜索类型", this.state.itemType, this.state.itemValue);
    }, 300);
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
    console.log(val);
    if (val === "0") {
      return false;
    }
    this.props.history.push("/rule?key=" + val);
  }

  // 统计
  getStatistic() {
    let data = {
      intl_flag: false,
    };
    axios.post("/api/pnr/statistics", data).then((res) => {
      let statisticsTotal = res.data.statistics;
      this.setState({
        statistics: statisticsTotal,
      });
    });
  }

  // 统计 点击
  changeHeaderBtn = async(e) => {
    await this.setState({
      headerStatus: e.target.value,
    });
    await this.getDataList()
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
          </RadioGroup>
        </div>
        {/* 表格 */}
        <div className="table">
          <div className="table_type">
            {/* 订单类型 */}
            <div className="type_name">
              <div>订单类型</div>
              <div className="radio">
                <Radio.Group
                  onChange={this.handleOrder}
                  value={this.state.orderType}
                >
                  <Radio value="国内">国内</Radio>
                  <Radio value="国际">国际</Radio>
                </Radio.Group>
              </div>
            </div>
            {/* 执行状态 */}
            {/* <div className="type_name">
              <div>执行状态</div>
              <div className="radio">
                <Select
                  allowClear
                  style={{ width: 200 }}
                  placeholder="所有"
                  optionFilterProp="children"
                  notFoundContent="无法找到"
                  onChange={this.handleStatus}
                  value={this.state.headerStatus || "all"}
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
            </div> */}
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
                  {
                    this.state.ticketTypeList.map(item =>(
                      <Option value={item} key={item}>{item}</Option>
                    ))
                  }
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
                <Option value="1">PNR编码</Option>
                <Option value="2">票号</Option>
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
            <Pagination
              current={this.state.pageNumber}
              pageSize={this.state.pageSize}
              total={this.state.totalCount}
              itemRender={itemRender}
              position={this.state.bottom}
              onChange={this.changePage}
            />
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
      </div>
    );
  }
}
