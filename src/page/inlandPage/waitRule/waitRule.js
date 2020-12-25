/*
 * @Description: 国际等待取位规则
 * @Author: wish.WuJunLong
 * @Date: 2020-12-15 15:58:19
 * @LastEditTime: 2020-12-18 16:35:34
 * @LastEditors: wish.WuJunLong
 */

import React, { Component } from "react";

import "./waitRule.scss";
import axios from "@/api/api";

import {
  Select,
  Button,
  Input,
  Table,
  message,
  Modal,
  Switch,
  Pagination,
  Tooltip,
} from "antd";

const { Column } = Table;

const { Option } = Select;

const { TextArea } = Input;

export default class intlStopRule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFrom: {
        page_no: 1,
        page_size: 10,
        total_count: 0,
        airline_code: "",
        cabin_code: "",
        ticket_type: "",
        is_voluntary: null,
        is_change_pnr: null,
        involuntary_switching: null,
        rule_state: 0,
      },
      dataList: [],

      selectedRowKeys: [], // 表格多选

      waitRuleModal: false, // 新增/编辑弹窗
      modalType: "新增", // 弹窗状态
      modalFrom: {}, // 弹窗数据

      ticketTypeList: [], // 票证类型
    };
  }

  async componentDidMount() {
    let data = JSON.parse(JSON.stringify(this.state.searchFrom));
    data["key_id"] = this.props.keyId || "0";
    await this.setState({
      searchFrom: data,
    });
    await this.getData();
    this.getTicketType();
  }

  // 选择器返回值
  headSelect = (label, val) => {
    console.log(label, val);
    let data = JSON.parse(JSON.stringify(this.state.searchFrom));
    data[label] = val ? val.value : null;
    this.setState({
      searchFrom: data,
    });
  };

  // 输入框返回值
  headInput = (label, val) => {
    let data = JSON.parse(JSON.stringify(this.state.searchFrom));
    data[label] = val.target.value;
    this.setState({
      searchFrom: data,
    });
  };

  // 分钟转换
  timeStamp(StatusMinute) {
    let day = parseInt(StatusMinute / 60 / 24);
    let hour = parseInt((StatusMinute / 60) % 24);
    let min = parseInt(StatusMinute % 60);
    StatusMinute = StatusMinute > 0 ? "" : "0";
    if (day > 0) {
      StatusMinute = day + "天";
    }
    if (hour > 0) {
      StatusMinute += hour + "小时";
    }
    if (min > 0) {
      StatusMinute += parseFloat(min) + "分";
    }
    return StatusMinute;
  }

  // 获取待取位规则列表
  getData() {
    axios.post("api/DomcWaitRules/GetPage", this.state.searchFrom).then((res) => {
      console.log(res);
      if (res.data.status === 0) {
        let newData = this.state.searchFrom;
        newData["page_no"] = res.data.data.page_no;
        newData["total_count"] = res.data.data.total_count;
        this.setState({
          dataList: res.data.data.datas,
          searchFrom: newData,
        });
      } else {
        message.warning(res.data.message);
      }
    });
  }

  // 获取票证类型
  getTicketType() {
    axios.get("api/pnr/GetTicketTypes").then((res) => {
      if (res.data.status === 0) {
        this.setState({
          ticketTypeList: res.data.data,
        });
      } else {
        message.warning(res.data.message);
      }
    });
  }

  // 表格多选
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  // 弹窗选择器数据回调
  modalSelect = (label, val) => {
    console.log(label, val);
    let data = this.state.modalFrom;
    data[label] = val ? val.value : null;
    this.setState({
      modalFrom: data,
    });
  };

  // 弹窗多选框数据回调
  modalMultiple = (val) => {
    console.log(val);
    // let data = []
    // val.forEach(item =>{
    //   data.push(item.value)
    // })
    let newData = this.state.modalFrom;
    newData["ticket_type"] = val;
    this.setState({
      modalFrom: newData,
    });
  };

  // 弹窗输入框数据回调
  modalInput = (label, val) => {
    let data = this.state.modalFrom;
    data[label] = val.target.value;
    this.setState({
      modalFrom: data,
    });
  };

  // 弹窗开关数据回调
  changeSwitch = (val) => {
    console.log(val);
    let data = this.state.modalFrom;
    data.config_state = val ? 2 : 1;
    this.setState({
      modalFrom: data,
    });
  };

  // 新增/编辑弹窗
  async openModal(val) {
    if (val) {
      let data = JSON.parse(JSON.stringify(val));
      data["ticket_type"] =
        data.ticket_type && data.ticket_type.length > 0
          ? [...new Set(data.ticket_type.split("/"))].filter((d) => d)
          : [];
      await this.setState({
        modalFrom: data,
      });
    } else {
      let data = {
        airline_code: "",
        cabin_codes: "",
        ticket_type: [],
        is_voluntary: true,
        is_change_pnr: false,
        include_refund_type: 0,
        begin_refund_fee: "",
        end_refund_fee: "",
        involuntary_switching: true,
        cancel_mode: 1,
        earliest_limit: null,
        execute_limit: null,
        latest_limit: null,
        suspend_type: 0,
        submit_refund_mode: 1,
        submit_waiting_time: null,
        rule_state: 2,
        remarks: "",
      };
      await this.setState({
        modalFrom: data,
      });
    }

    console.log(this.state.modalFrom);
    await this.setState({
      modalType: val ? "编辑" : "新增",
      waitRuleModal: true,
    });
  }

  // 弹窗开关数据回调
  changeSwitch = (val) => {
    console.log(val);
    let data = this.state.modalFrom;
    data.rule_state = val ? 2 : 1;
    this.setState({
      modalFrom: data,
    });
  };

  // 弹窗提交按钮
  submitBtn = () => {
    this.setState({
      submitLoading: true,
    });
    console.log(this.state.modalFrom);
    let type = this.state.modalType === "编辑" ? "update" : "add";
    let newData = JSON.parse(JSON.stringify(this.state.modalFrom));
    newData["begin_refund_fee"] = newData.begin_refund_fee
      ? Number(newData.begin_refund_fee)
      : 0;
    newData["end_refund_fee"] = newData.end_refund_fee
      ? Number(newData.end_refund_fee)
      : 0;
    newData["ticket_type"] =
      newData.ticket_type && newData.ticket_type.length > 1
        ? String(newData.ticket_type).replace(/,/g, "/")
        : String(newData.ticket_type);
    newData["earliest_limit"] = newData["earliest_limit"]
      ? Number(newData.earliest_limit)
      : 0;
    newData["execute_limit"] = newData["execute_limit"]
      ? Number(newData.execute_limit)
      : 0;
    newData["latest_limit"] = newData["latest_limit"] ? Number(newData.latest_limit) : 0;
    newData["submit_waiting_time"] = newData["submit_waiting_time"]
      ? Number(newData.submit_waiting_time)
      : 0;
    console.log(newData["ticket_type"]);
    let data = {
      action_code: type,
      rules: [newData],
    };
    axios.post("api/DomcWaitRules/Set", data).then((res) => {
      this.setState({
        submitLoading: false,
      });
      if (res.data.status === 0) {
        this.setState({
          waitRuleModal: false,
        });
        message.success(res.data.message);
        this.getData();
      } else {
        message.warning(res.data.message);
      }
    });
  };

  // 状态修改
  setTableData(type) {
    console.log(type);
    let dataList = [];
    this.state.dataList.forEach((item) => {
      this.state.selectedRowKeys.forEach((oitem) => {
        if (item.key_id === oitem) {
          dataList.push(item);
        }
      });
    });
    let data = {
      action_code: type,
      rules: dataList,
    };
    axios.post("api/DomcWaitRules/Set", data).then((res) => {
      if (res.data.status === 0) {
        message.success(res.data.message);
        this.getData();
      } else {
        message.warning(res.data.message);
      }
    });
  }

  // 分页器切换
  changePage = async (page, size) => {
    let data = JSON.parse(JSON.stringify(this.state.searchFrom));
    data.page_no = page;
    data.page_size = size;
    await this.setState({
      searchFrom: data,
    });
    await this.getData();
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className="wait_rule">
        <div className="search_box">
          <div className="box_list">
            <div className="list_title">退票类型</div>
            <div className="list_item">
              <Select
                placeholder="所有"
                labelInValue
                onChange={this.headSelect.bind(this, "is_voluntary")}
                defaultValue={{ value: null }}
              >
                <Option value={null}>所有</Option>
                <Option value={true}>自愿</Option>
                <Option value={false}>非自愿</Option>
              </Select>
            </div>
          </div>

          <div className="box_list">
            <div className="list_title">航空公司</div>
            <div className="list_item">
              <Input
                allowClear
                placeholder="如：CA"
                onChange={this.headInput.bind(this, "airline_code")}
              />
            </div>
          </div>

          <div className="box_list">
            <div className="list_title">舱位</div>
            <div className="list_item">
              <Input
                allowClear
                placeholder="如：M"
                onChange={this.headInput.bind(this, "cabin_code")}
              />
            </div>
          </div>

          <div className="box_list">
            <div className="list_title">票证类型</div>
            <div className="list_item">
              <Select
                placeholder="所有"
                labelInValue
                allowClear
                onChange={this.headSelect.bind(this, "ticket_type")}
                defaultValue={{ value: null }}
              >
                {this.state.ticketTypeList.map((item) => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <div className="box_list">
            <div className="list_title">是否换编</div>
            <div className="list_item">
              <Select
                placeholder="所有"
                labelInValue
                onChange={this.headSelect.bind(this, "is_change_pnr")}
                defaultValue={{ value: null }}
              >
                <Option value={null}>所有</Option>
                <Option value={true}>已换编</Option>
                <Option value={false}>未换编</Option>
              </Select>
            </div>
          </div>

          <div className="box_list">
            <div className="list_title">可转非自愿</div>
            <div className="list_item">
              <Select
                placeholder="所有"
                labelInValue
                onChange={this.headSelect.bind(this, "involuntary_switching")}
                defaultValue={{ value: null }}
              >
                <Option value={null}>所有</Option>
                <Option value={true}>可转非自愿</Option>
                <Option value={false}>不可转非自愿</Option>
              </Select>
            </div>
          </div>

          <div className="box_list">
            <Button className="search_btn" type="primary" onClick={() => this.getData()}>
              搜索
            </Button>
          </div>
        </div>

        <div className="tool_box">
          <Button onClick={() => this.openModal()}>+新增</Button>
          <Button onClick={() => this.setTableData("enable")}>批量启用</Button>
          <Button onClick={() => this.setTableData("disable")}>批量停用</Button>
          <Button onClick={() => this.setTableData("delete")}>批量删除</Button>
        </div>

        <div className="table_main">
          <Table
            dataSource={this.state.dataList}
            rowKey="key_id"
            size="small"
            rowSelection={rowSelection}
            bordered
            pagination={false}
          >
            <Column
              title="操作"
              render={(text, record) => (
                <div className="table_edit_btn" onClick={() => this.openModal(record)}>
                  修改
                </div>
              )}
            />
            <Column
              title="退票类型"
              dataIndex="is_voluntary"
              render={(text) => <>{text ? "自愿" : "非自愿"}</>}
            />
            <Column title="航空公司" dataIndex="airline_code" />
            <Column
              title="舱位代码"
              dataIndex="cabin_codes"
              render={(text) => (
                <Tooltip title={() => <>{text}</>}>
                  <span
                    style={{
                      display: "block",
                      maxWidth: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {text}
                  </span>
                </Tooltip>
              )}
            />
            <Column
              title="票证类型"
              dataIndex="ticket_type"
              render={(text) => (
                <Tooltip title={() => <>{text}</>}>
                  <span
                    style={{
                      display: "block",
                      maxWidth: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {text}
                  </span>
                </Tooltip>
              )}
            />
            <Column
              title="是否换编"
              dataIndex="is_change_pnr"
              render={(text) => <>{text ? "已换编" : "未换编"}</>}
            />
            <Column
              title="退票费判断"
              dataIndex="include_refund_type"
              render={(text) => (
                <>
                  {text === 0
                    ? "不判断退票费"
                    : text === 1
                    ? "根据退票费判断"
                    : text === 2
                    ? "根据退票费百分比判断"
                    : text}
                </>
              )}
            />
            <Column
              title="可转非自愿"
              dataIndex="involuntary_switching"
              render={(text) => <>{text ? "可转非自愿" : "不可转非自愿"}</>}
            />
            <Column
              title="取位模式"
              render={(text, record) => (
                <div>
                  <div style={{ display: record.cancel_mode === 2 ? "block" : "none" }}>
                    <Tooltip
                      title={() => (
                        <>
                          <p style={{ fontSize: "14px", marginBottom: "5px" }}>
                            最早取位时限
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "rgba(255, 255, 255, .8)",
                              minWidth: "200px",
                              marginBottom: "5px",
                            }}
                          >
                            {this.timeStamp(record.earliest_limit)}
                          </p>
                          <p style={{ fontSize: "14px", marginBottom: "5px" }}>
                            实际取位时限
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "rgba(255, 255, 255, .8)",
                              minWidth: "200px",
                              marginBottom: "5px",
                            }}
                          >
                            {this.timeStamp(record.execute_limit)}
                          </p>
                          <p style={{ fontSize: "14px", marginBottom: "5px" }}>
                            最晚取位时限
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "rgba(255, 255, 255, .8)",
                              minWidth: "200px",
                              marginBottom: "5px",
                            }}
                          >
                            {this.timeStamp(record.latest_limit)}
                          </p>
                        </>
                      )}
                    >
                      {record.cancel_mode === 1
                        ? "直接取消"
                        : record.cancel_mode === 2
                        ? "按时限取消"
                        : record.cancel_mode}
                    </Tooltip>
                  </div>
                  <div style={{ display: record.cancel_mode === 1 ? "block" : "none" }}>
                    {record.cancel_mode === 1
                      ? "直接取消"
                      : record.cancel_mode === 2
                      ? "按时限取消"
                      : record.cancel_mode}
                  </div>
                </div>
              )}
            />
            <Column
              title="提交模式"
              dataIndex="submit_refund_mode"
              render={(text) => (
                <>
                  {text === 1
                    ? "取位后提交"
                    : text === 2
                    ? "提飞前提交"
                    : text === 3
                    ? "提飞后提交"
                    : text}
                </>
              )}
            />
            <Column
              title="挂起类型"
              dataIndex="suspend_type"
              render={(text) => (
                <>
                  {text === 0
                    ? "不挂起"
                    : text === 1
                    ? "取位前挂起"
                    : text === 2
                    ? "取位后挂起"
                    : text}
                </>
              )}
            />

            <Column
              title="配置状态"
              dataIndex="rule_state"
              render={(text) => (
                <div
                  style={{
                    color: text === 1 ? "#FF0000" : text === 2 ? "#5AB957" : "",
                  }}
                >
                  {text === 1 ? "不可用" : text === 2 ? "可用" : text}
                </div>
              )}
            />
            <Column title="修改时间" dataIndex="modify_time" />
          </Table>
          {/* 分页 */}
          <div className="table_pagination">
            <Pagination
              current={Number(this.state.searchFrom.page_no)}
              pageSize={Number(this.state.searchFrom.page_size)}
              total={Number(this.state.searchFrom.total_count)}
              onChange={this.changePage}
            />
            <div className="datas_total">
              共 <span>{this.state.searchFrom.total_count}</span> 条记录
            </div>
          </div>
        </div>

        <Modal
          title={this.state.modalType + " - 等待取位规则"}
          visible={this.state.waitRuleModal}
          onOk={this.submitBtn}
          onCancel={() => this.setState({ waitRuleModal: false })}
          width="880px"
          confirmLoading={this.state.submitLoading}
          maskClosable={false}
        >
          <div className="wait_rule_modal">
            <div className="wait_rule_list">
              <div className="modal_title">判断规则</div>

              <div className="modal_box">
                <div className="modal_list">
                  <div className="list_title">配置状态</div>
                  <div className="list_input">
                    <Switch
                      checkedChildren="可用"
                      unCheckedChildren="不可用"
                      defaultChecked={this.state.modalFrom.rule_state === 2}
                      onChange={this.changeSwitch}
                    />
                  </div>
                </div>
              </div>
              <div className="modal_box">
                <div className="modal_list">
                  <div className="list_title">退票类型</div>
                  <div className="list_input">
                    <Select
                      labelInValue
                      onChange={this.modalSelect.bind(this, "is_voluntary")}
                      value={{ value: this.state.modalFrom.is_voluntary }}
                    >
                      <Option value={true}>自愿</Option>
                      <Option value={false}>非自愿</Option>
                    </Select>
                  </div>
                </div>

                <div className="modal_list">
                  <div className="list_title">航空公司</div>
                  <div className="list_input">
                    <Input
                      placeholder="请输入"
                      allowClear
                      onChange={this.modalInput.bind(this, "airline_code")}
                      value={this.state.modalFrom.airline_code}
                    />
                  </div>
                </div>
                <div className="modal_list">
                  <div className="list_title long_title">舱位代码</div>
                  <div className="list_input">
                    <Input
                      placeholder="请输入"
                      allowClear
                      onChange={this.modalInput.bind(this, "cabin_codes")}
                      value={this.state.modalFrom.cabin_codes}
                    />
                  </div>
                </div>
              </div>

              <div className="modal_box" style={{ marginBottom: "5px" }}>
                <div className="modal_list">
                  <div className="list_title">票证类型</div>
                  <div className="list_input">
                    <Select
                      placeholder="请选择"
                      mode="multiple"
                      allowClear
                      onChange={this.modalMultiple}
                      value={this.state.modalFrom.ticket_type}
                    >
                      {this.state.ticketTypeList.map((item) => (
                        <Option value={item} key={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="modal_list">
                  <div className="list_title">是否换编</div>
                  <div className="list_input">
                    <Select
                      labelInValue
                      onChange={this.modalSelect.bind(this, "is_change_pnr")}
                      value={{
                        value: this.state.modalFrom.is_change_pnr,
                      }}
                    >
                      <Option value={true}>已换编</Option>
                      <Option value={false}>未换编</Option>
                    </Select>
                  </div>
                </div>

                <div className="modal_list">
                  <div className="list_title long_title">
                    <Select
                      labelInValue
                      onChange={this.modalSelect.bind(this, "include_refund_type")}
                      value={{ value: this.state.modalFrom.include_refund_type }}
                    >
                      <Option value={0}>不判断退票费</Option>
                      <Option value={1}>退票费判断</Option>
                      <Option value={2}>退票费百分比判断</Option>
                    </Select>
                  </div>
                  <div className="list_input refund_fee_input">
                    <Input
                      allowClear
                      onChange={this.modalInput.bind(this, "begin_refund_fee")}
                      value={this.state.modalFrom.begin_refund_fee}
                    />
                    <span
                      style={{
                        display:
                          this.state.modalFrom.include_refund_type === 2
                            ? "block"
                            : "none",
                      }}
                    >
                      %
                    </span>
                    <p>-</p>
                    <Input
                      allowClear
                      onChange={this.modalInput.bind(this, "end_refund_fee")}
                      value={this.state.modalFrom.end_refund_fee}
                    />
                    <span
                      style={{
                        display:
                          this.state.modalFrom.include_refund_type === 2
                            ? "block"
                            : "none",
                      }}
                    >
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="wait_rule_list">
              <div className="modal_title">执行规则</div>

              <div className="modal_box">
                <div className="modal_list">
                  <div className="list_title">可否非自愿</div>
                  <div className="list_input">
                    <Select
                      labelInValue
                      onChange={this.modalSelect.bind(this, "involuntary_switching")}
                      value={{
                        value: this.state.modalFrom.involuntary_switching,
                      }}
                    >
                      <Option value={true}>可转非自愿</Option>
                      <Option value={false}>不可转非自愿</Option>
                    </Select>
                  </div>
                </div>
                <div className="modal_list">
                  <div className="list_title">挂起类型</div>
                  <div className="list_input">
                    <Select
                      labelInValue
                      onChange={this.modalSelect.bind(this, "suspend_type")}
                      value={{
                        value: this.state.modalFrom.suspend_type,
                      }}
                    >
                      <Option value={0}>不挂起</Option>
                      <Option value={1}>取位前挂起</Option>
                      <Option value={2}>取位后挂起</Option>
                    </Select>
                  </div>
                </div>

                <div className="modal_list">
                  <div className="list_title">取位模式</div>
                  <div className="list_input">
                    <Select
                      labelInValue
                      onChange={this.modalSelect.bind(this, "cancel_mode")}
                      value={{ value: this.state.modalFrom.cancel_mode }}
                    >
                      <Option value={1}>直接取消</Option>
                      <Option value={2}>按时限取消</Option>
                    </Select>
                  </div>
                </div>
              </div>
              <div
                className="modal_box"
                style={{
                  display: this.state.modalFrom.cancel_mode === 2 ? "flex" : "none",
                }}
              >
                <div className="modal_list">
                  <div className="list_title">最早取位时限</div>
                  <div className="list_input">
                    <Input
                      allowClear
                      placeholder="单位：分钟"
                      onChange={this.modalInput.bind(this, "earliest_limit")}
                      value={this.state.modalFrom.earliest_limit}
                    />
                  </div>
                </div>

                <div className="modal_list">
                  <div className="list_title">实际取位时限</div>
                  <div className="list_input">
                    <Input
                      allowClear
                      placeholder="单位：分钟"
                      onChange={this.modalInput.bind(this, "execute_limit")}
                      value={this.state.modalFrom.execute_limit}
                    />
                  </div>
                </div>

                <div className="modal_list">
                  <div className="list_title">最晚取位时限</div>
                  <div className="list_input">
                    <Input
                      allowClear
                      placeholder="单位：分钟"
                      onChange={this.modalInput.bind(this, "latest_limit")}
                      value={this.state.modalFrom.latest_limit}
                    />
                  </div>
                </div>
              </div>
              <div className="modal_box">
                <div className="modal_list">
                  <div className="list_title">提交模式</div>
                  <div
                    className="list_input"
                    style={{ display: "flex", alignItems: "center", width: "auto" }}
                  >
                    <Select
                      style={{ width: "90px" }}
                      labelInValue
                      onChange={this.modalSelect.bind(this, "submit_refund_mode")}
                      value={{ value: this.state.modalFrom.submit_refund_mode }}
                    >
                      <Option value={1}>取位后</Option>
                      <Option value={2}>起飞前</Option>
                      <Option value={3}>起飞后</Option>
                    </Select>
                    <Input
                      allowClear
                      style={{ width: "80px", marginLeft: "5px" }}
                      onChange={this.modalInput.bind(this, "submit_waiting_time")}
                      value={this.state.modalFrom.submit_waiting_time}
                    />
                    <span style={{ flexShrink: 0, marginLeft: "5px" }}>分钟提交</span>
                  </div>
                </div>
              </div>

              <div className="modal_box">
                <div className="modal_list input_remark">
                  <div className="list_title">备注</div>
                  <div className="list_input">
                    <TextArea
                      rows={4}
                      placeholder="添加备注"
                      allowClear
                      onChange={this.modalInput.bind(this, "remarks")}
                      value={this.state.modalFrom.remarks}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
