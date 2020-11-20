/*
 * @Description: 国际取位首页
 * @Author: wish.WuJunLong
 * @Date: 2020-11-16 17:10:51
 * @LastEditTime: 2020-11-20 11:24:25
 * @LastEditors: wish.WuJunLong
 */
import React, { Component } from "react";

import "./interIndex.scss";
import axios from "@/api/api";

import Details from "@/page/interPage/interDetails/interDetails";

import {
  Radio,
  message,
  Select,
  Input,
  Button,
  DatePicker,
  Table,
  Tag,
  Tooltip,
  Pagination,
  Modal,
  Switch,
} from "antd";

const { Column } = Table;

const { RangePicker } = DatePicker;

const { Option } = Select;

const { TextArea } = Input;

export default class interIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staticNumberFrom: {}, // 航变数量
      ticketTypeList: [], // 票证类型
      headerType: "null", // 顶部状态栏切换
      searchFrom: {
        page_no: 1,
        page_size: 10,
        total_count: 0,
        exec_state: "null",
        ticket_type: "",
        refund_type: "0",
        airline_code: "",
        date_type: "0",
        begin_date: "",
        end_date: "",
        pnr_code: "",
        ticket_no: "",
        query_type: "2",
        query_value: "",
        is_flight_changes: null,
      }, // 搜索框数据

      dataList: [], // 国际取位数据

      detailsData: {}, // 国际取位详情
      showDetails: false, // 详情弹窗

      actionFrom: {}, // 执行状态数据
      actionModal: false, // 执行状态弹窗

      actionLoading: false, // 航变提交加载
    };
  }

  componentDidMount() {
    this.getStaticNumber();
    this.getTicketType();
    this.getDataList();

    // this.openActionModal();
  }

  // 获取取位列表
  getDataList() {
    let data = JSON.parse(JSON.stringify(this.state.searchFrom));
    data.is_flight_changes =
      data.is_flight_changes === "1"
        ? true
        : data.is_flight_changes === "2"
        ? false
        : null;
    data.page_no = Number(data.page_no);
    data.page_size = Number(data.page_size);
    data.exec_state = data.exec_state !== null ? Number(data.exec_state) : null;
    data.refund_type = Number(data.refund_type);
    data.date_type = Number(data.date_type);
    data.query_type = Number(data.query_type);
    axios.post("api/IntlPnrData/GetPage", data).then((res) => {
      let page = JSON.parse(JSON.stringify(this.state.searchFrom));
      page.page_no = Number(res.data.page_no);
      page.total_count = Number(res.data.total_count);
      if (res.data.status === 0) {
        this.setState({
          dataList: res.data.datas,
          searchFrom: page,
        });
      } else {
        this.setState({
          dataList: [],
          searchFrom: page,
        });
        message.warning(res.data.message);
      }
    });
  }

  // 状态切换
  async checkedHeader(e) {
    console.log(e);
    let data = this.state.searchFrom;
    data["exec_state"] = e.target.value;
    await this.setState({
      searchFrom: data,
    });
    await this.getDataList();
  }

  // 获取取位状态数量
  getStaticNumber() {
    let data = {
      is_flight_changes: null,
    };
    axios.post("api/IntlPnrData/Statistics", data).then((res) => {
      if (res.data.status === 0) {
        this.setState({
          staticNumberFrom: res.data.statistics,
        });
      } else {
        message.warning(res.data.msg);
      }
    });
  }

  // 获取票证类型
  getTicketType() {
    axios.get("api/IntlPnrData/getTicketTypes").then((res) => {
      if (res.data.status === 0) {
        this.setState({
          ticketTypeList: res.data.ticket_types,
        });
      }
    });
  }

  // 搜索栏选择器返回值
  headSelect = (label, val) => {
    console.log(label, val);
    let data = this.state.searchFrom;
    data[label] = val ? val.value : null;
    this.setState({
      searchFrom: data,
    });
  };
  // 搜索栏输入框返回值
  headInput = (label, val) => {
    let data = this.state.searchFrom;
    data[label] = val.target.value;
    this.setState({
      searchFrom: data,
    });
  };
  // 搜索栏日期选择器
  changeDateType = (date, stringDate) => {
    let data = this.state.searchFrom;
    data["begin_date"] = stringDate[0];
    data["end_date"] = stringDate[1];
    this.setState({
      searchFrom: data,
    });
  };

  // 分页器
  changePage = async (page, size) => {
    let data = JSON.parse(JSON.stringify(this.state.searchFrom));
    data.page_no = page;
    data.page_size = size;
    await this.setState({
      searchFrom: data,
    });
    await this.getDataList();
  };

  // 分页器样式
  itemRender(current, type, originalElement) {
    if (type === "prev") {
      return <p>上一页</p>;
    }
    if (type === "next") {
      return <p>下一页</p>;
    }
    return originalElement;
  }

  // 打开详情弹窗
  jumpDetails = (val) => {
    this.setState({
      detailsData: val,
      showDetails: true,
    });
  };

  // 打开执行状态弹窗
  openActionModal = (val) => {
    console.log(val);
    let data = {
      key_id: val.key_id,
      exec_state: String(val.exec_state) || "0",
      exec_msg: val.exec_msg,
      ignore_stop_rule: val.rule_match_mode === 0,
      is_flight_changes: val.is_flight_changes,
      flight_changes_msg: val.flight_changes_msg,
    };
    this.setState({
      actionModal: true,
      actionFrom: data,
      actionLoading: false,
    });
  };
  // 提交处理执行状态
  submitAction = () => {
    this.setState({
      actionLoading: true,
    });

    let data = JSON.parse(JSON.stringify(this.state.actionFrom));
    data.exec_state = Number(data.exec_state);

    axios.post("api/IntlPnrData/UpdateExecuteState", data).then((res) => {
      if (res.data.status === 0) {
        this.setState({
          actionModal: false,
          actionLoading: false,
        });
        this.getDataList();
        message.success(res.data.message);
      } else {
        this.setState({
          actionLoading: false,
        });
        message.warning(res.data.message);
      }
    });

    console.log(this.state.actionFrom);
  };

  // 状态弹窗选择器返回值
  actionSelect = (val) => {
    console.log(val);
    let data = this.state.actionFrom;
    data["exec_state"] = val.value;
    data["exec_msg"] = val.label;
    this.setState({
      actionFrom: data,
    });
  };
  // 状态弹窗输入框返回值
  actionInput = (label, val) => {
    console.log(val);
    let data = this.state.actionFrom;
    data[label] = val.target.value;
    this.setState({
      actionFrom: data,
    });
  };
  // 状态弹窗开关返回值
  actionSwitch = (label, val) => {
    console.log(val);
    let data = this.state.actionFrom;
    data[label] = val;
    this.setState({
      actionFrom: data,
    });
  };

  jumpRule = (val, type) => {
    if (!val) {
      return false;
    }
    let url = type === 4 ? "/intelStopRule?key=" : "/intelNeedRule?key=";
    this.props.history.push(url + val);
  };

  render() {
    return (
      <div className="inter_index">
        <div className="inter_header">
          <Radio.Group
            onChange={this.checkedHeader.bind(this)}
            buttonStyle="solid"
            defaultValue="null"
          >
            <Radio.Button value="null">
              全部
              <span className="header_tag">
                {this.state.staticNumberFrom.total}
              </span>
            </Radio.Button>
            <Radio.Button value="0">
              待取位
              <span className="header_tag">
                {this.state.staticNumberFrom.notcancelled_total}
              </span>
            </Radio.Button>
            <Radio.Button value="1">
              已取位
              <span className="header_tag">
                {this.state.staticNumberFrom.cancelled_total}
              </span>
            </Radio.Button>
            <Radio.Button value="3">
              已退票
              <span className="header_tag">
                {this.state.staticNumberFrom.refunded_total}
              </span>
            </Radio.Button>
            <Radio.Button value="4">
              无需取位
              <span className="header_tag">
                {this.state.staticNumberFrom.noneed_cancel_total}
              </span>
            </Radio.Button>
            <Radio.Button value="-1">
              取消失败
              <span className="header_tag">
                {this.state.staticNumberFrom.cancel_failed_total}
              </span>
            </Radio.Button>
          </Radio.Group>
        </div>

        <div className="inter_main">
          <div className="search_box">
            <div className="search_list">
              <div className="list_title">是否航变</div>
              <div className="list_input">
                <Select
                  defaultValue={{ value: "null" }}
                  labelInValue
                  onChange={this.headSelect.bind(this, "is_flight_changes")}
                >
                  <Option value="null">全部</Option>
                  <Option value="1">已航变</Option>
                  <Option value="2">未航变</Option>
                </Select>
              </div>
            </div>

            <div className="search_list">
              <div className="list_title">票证类型</div>
              <div className="list_input">
                <Select
                  placeholder="请选择"
                  allowClear
                  labelInValue
                  onChange={this.headSelect.bind(this, "ticket_type")}
                >
                  {this.state.ticketTypeList.map((item) => (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="search_list">
              <div className="list_title">航司代码</div>
              <div className="list_input">
                <Input
                  allowClear
                  placeholder="如：CA"
                  onChange={this.headInput.bind(this, "airline_code")}
                />
              </div>
            </div>

            <div className="search_list">
              <div className="list_title">PNR编码</div>
              <div className="list_input">
                <Input
                  allowClear
                  placeholder="请输入"
                  onChange={this.headInput.bind(this, "pnr_code")}
                />
              </div>
            </div>

            <div className="search_list">
              <div className="list_title">票号</div>
              <div className="list_input">
                <Input
                  allowClear
                  placeholder="请输入"
                  onChange={this.headInput.bind(this, "ticket_no")}
                />
              </div>
            </div>

            <div className="search_list">
              <div className="list_title">是否自愿</div>
              <div className="list_input">
                <Select
                  defaultValue={{ value: "0" }}
                  labelInValue
                  onChange={this.headSelect.bind(this, "refund_type")}
                >
                  <Option value="0">所有</Option>
                  <Option value="1">自愿</Option>
                  <Option value="2">非自愿</Option>
                </Select>
              </div>
            </div>

            <div className="search_list">
              <div className="list_title">
                <Select
                  defaultValue={{ value: "2" }}
                  labelInValue
                  onChange={this.headSelect.bind(this, "query_type")}
                >
                  <Option value="1">订单号</Option>
                  <Option value="2">乘客姓名</Option>
                </Select>
              </div>
              <div className="list_input">
                <Input
                  allowClear
                  placeholder="请输入"
                  onChange={this.headInput.bind(this, "query_value")}
                />
              </div>
            </div>

            <div className="search_list">
              <div className="list_title">
                <Select
                  defaultValue={{ value: "0" }}
                  labelInValue
                  onChange={this.headSelect.bind(this, "date_type")}
                >
                  <Option value="0">导入时间</Option>
                  <Option value="1">起飞时间</Option>
                  <Option value="2">执行时间</Option>
                </Select>
              </div>
              <div className="list_input" style={{ width: "320px" }}>
                <RangePicker onChange={this.changeDateType} />
              </div>
            </div>

            <div className="search_list">
              <Button type="primary" onClick={() => this.getDataList()}>
                搜索
              </Button>
            </div>
          </div>

          <div className="inter_table">
            <Table
              dataSource={this.state.dataList}
              rowKey="key_id"
              size="small"
              bordered
              pagination={false}
            >
              <Column
                width="110px"
                title="操作"
                render={(text, record) => (
                  <>
                    <Tag
                      color="#5AB957"
                      onClick={() => this.jumpDetails(record)}
                    >
                      详
                    </Tag>
                    <Tag
                      color="#0070E2"
                      onClick={() => this.openActionModal(record)}
                    >
                      处理
                    </Tag>
                  </>
                )}
              />
              <Column title="PNR" dataIndex="pnr_code" />
              <Column title="票号" dataIndex="ticket_no" />
              <Column title="GDS系统标识" dataIndex="gds_type" />
              <Column
                title="数据类型"
                dataIndex="data_type"
                render={(text) => (
                  <>{text === 0 ? "取位" : text === 1 ? "退票" : text}</>
                )}
              />
              <Column
                title="退票类型"
                dataIndex="refund_type"
                render={(text) => (
                  <>{text === 1 ? "自愿" : text === 2 ? "非自愿" : text}</>
                )}
              />
              <Column title="票证类型" dataIndex="ticket_type" />
              <Column title="采购退票费" dataIndex="refund_fee" />
              <Column title="航司代码" dataIndex="airline_code" />
              <Column title="乘客姓名" dataIndex="passenger_name" />
              <Column
                title="航程类型"
                dataIndex="route_type"
                render={(text) => (
                  <>{text === "OW" ? "单程" : text === "RT" ? "往返" : text}</>
                )}
              />
              <Column
                title="执行状态"
                dataIndex="exec_state"
                render={(text, record) => (
                  <>
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
                            }}
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
                          : record.exec_state}
                      </div>
                    </Tooltip>
                  </>
                )}
              />
              <Column
                title="是否航变"
                render={(text, record) => (
                  <>
                    <Tooltip
                      overlayStyle={{
                        display: !record.is_flight_changes ? "none" : "",
                      }}
                      title={() => (
                        <>
                          <p style={{ fontSize: "14px", marginBottom: "5px" }}>
                            航变信息
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "rgba(255, 255, 255, .8)",
                              minWidth: "200px",
                              marginBottom: "5px",
                            }}
                          >
                            {record.flight_changes_msg}
                          </p>
                        </>
                      )}
                    >
                      <span>
                        {record.is_flight_changes ? "已航变" : "未航变"}
                      </span>
                    </Tooltip>
                  </>
                )}
              />
              <Column
                title="规则匹配"
                render={(text, record) => (
                  <>
                    <Tag
                      onClick={() =>
                        this.jumpRule(record.rule_id, record.exec_state)
                      }
                      color={record.rule_id ? "#5AB957" : "#AFB9C4"}
                    >
                      {record.rule_id ? "已匹配" : "未匹配"}
                    </Tag>
                  </>
                )}
              />
              <Column
                title="已执行时间"
                render={(text, record) => (
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
                        {this.$moment(record.exec_time).format(
                          "YYYY-MM-DD HH:mm"
                        )}
                      </span>
                    </Tooltip>
                  </>
                )}
              />
            </Table>
            <Pagination
              current={this.state.searchFrom.page_no}
              pageSize={this.state.searchFrom.page_size}
              total={this.state.searchFrom.total_count}
              onChange={this.changePage}
              itemRender={this.itemRender}
            />
          </div>
        </div>

        <Modal
          maskClosable={false}
          centered
          title="执行状态"
          visible={this.state.actionModal}
          onOk={this.submitAction}
          onCancel={() => this.setState({ actionModal: false })}
          confirmLoading={this.state.actionLoading}
        >
          <div className="action_main">
            <div className="main_list">
              <div className="list_title">执行状态</div>
              <div className="list_input">
                <Select
                  defaultValue={{ value: this.state.actionFrom.exec_state }}
                  labelInValue
                  style={{ width: "100%" }}
                  onChange={this.actionSelect.bind(this)}
                >
                  <Option value="0">待取位</Option>
                  <Option value="1">已取位</Option>
                  <Option value="3">已退票</Option>
                  <Option value="4">无需取位</Option>
                  <Option value="-1">取位失败</Option>
                </Select>
              </div>
            </div>

            <div className="main_list">
              <div className="list_title">执行消息</div>
              <div className="list_input">
                <Input
                  allowClear
                  onChange={this.actionInput.bind(this, "exec_msg")}
                  value={this.state.actionFrom.exec_msg}
                />
              </div>
            </div>

            <div className="main_list">
              <div className="list_title">匹配无需规则</div>
              <div className="list_input">
                <Switch
                  checkedChildren="匹配"
                  unCheckedChildren="不匹配"
                  defaultChecked={this.state.actionFrom.ignore_stop_rule}
                  onChange={this.actionSwitch.bind(this, "ignore_stop_rule")}
                />
              </div>
            </div>

            <div className="main_list">
              <div className="list_title">是否航变</div>
              <div className="list_input">
                <Switch
                  checkedChildren="已航变"
                  unCheckedChildren="未航变"
                  defaultChecked={this.state.actionFrom.is_flight_changes}
                  onChange={this.actionSwitch.bind(this, "is_flight_changes")}
                />
              </div>
            </div>

            <div className="main_list">
              <div className="list_title">航变提示信息</div>
              <div className="list_input">
                <TextArea
                  rows={3}
                  allowClear
                  onChange={this.actionInput.bind(this, "flight_changes_msg")}
                  value={this.state.actionFrom.flight_changes_msg}
                />
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          title="详细信息"
          footer={null}
          width={1200}
          visible={this.state.showDetails}
          onCancel={() => this.setState({ showDetails: false })}
        >
          <Details detailData={this.state.detailsData}></Details>
        </Modal>
      </div>
    );
  }
}
