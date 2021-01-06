/*
 * @Author: mzr
 * @Date: 2020-12-15 15:55:42
 * @LastEditTime: 2021-01-06 15:49:54
 * @LastEditors: wish.WuJunLong
 * @Description: 新增  无需取位规则
 * @FilePath: \position\src\page\interPage\newStopRule\newStopRule.js
 */
import React, { Component } from "react";

import "./newStopRule.scss";
import axios from "@/api/api";

import {
  Select,
  Button,
  Input,
  Table,
  Modal,
  Switch,
  Pagination,
  message,
  Checkbox,
  Tooltip,
} from "antd";

const { Column } = Table;

const { Option } = Select;

const { TextArea } = Input;
export default class newStopRule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFrom: {
        page_no: 1, //类型：Number  必有字段  备注：页码
        page_size: 10, //类型：Number  必有字段  备注：每页显示数据条数
        total_count: 0,

        airline_code: "", //类型：String  可有字段  备注：航司代码
        cabin_code: "", //类型：String  可有字段  备注：舱位
        is_change_pnr: null, //类型：Boolean  可有字段  备注：是否换编 true：已换编 false：未换编 null:查询所有
        ticket_type: "", //类型：String  可有字段  备注：票证类型
        is_voluntary: null, //类型：Boolean  可有字段  备注：是否自愿退票 true:自愿 false:非自愿 null:查询所有
        involuntary_switching: null, //类型：Boolean  可有字段  备注：是否可转非自愿 true：可转非自愿 false：不可转非自愿 null:查询所有
        flight_category: 0, //类型：Number  可有字段  备注：起飞情况 0：所有 1：起飞前 2：起飞后
        cancel_type: 0, //类型：Number  可有字段  备注：取位情况 0：所有 1：未取消 2：已消息
        rule_state: 0, //类型：Number  可有字段  备注：规则状态 1：不可用 2：可用
      }, // 筛选数据
      // 起飞情况
      plainOptions: [
        {
          label: "起飞前",
          value: 1,
        },
        {
          label: "起飞后",
          value: 2,
        },
      ],
      // 取位情况
      plainOptionsPositon: [
        {
          label: "已取位",
          value: 2,
        },
        {
          label: "未取位",
          value: 1,
        },
      ],

      dataList: [], //列表数据

      modalType: "新增", // 弹窗状态
      stopRuleModal: false, //  新增\编辑弹窗
      submitLoading: false, // 弹窗提交加载状态

      modalFrom: {}, // 新增\编辑弹窗数据

      ticketTypeList: [], //票证类型
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

  // 获取数据
  getData() {
    let data = JSON.parse(JSON.stringify(this.state.searchFrom));
    data.cancel_type = data.cancel_type !== null ? Number(data.cancel_type) : null;
    data.rule_state = data.rule_state !== null ? Number(data.rule_state) : null;

    axios.post("api/DomcStopRules/GetPage", data).then((res) => {
      if (res.data.status !== 0) {
        message.warning(res.data.message);
      }
      data.page_no = res.data.data.page_no;
      data.total_count = res.data.data.total_count;
      this.setState({
        dataList: res.data.data.datas,
        searchFrom: data,
      });
    });
  }

  // 表格分页器
  changePage = async (page, size) => {
    let data = JSON.parse(JSON.stringify(this.state.searchFrom));
    data.page_no = page;
    data.page_size = size;
    await this.setState({
      searchFrom: data,
    });
    await this.getData();
  };

  // 打开新增规则弹窗
  openAddModal() {
    let data = {
      airline_code: "", //类型：String  必有字段  备注：航司代码
      cabin_codes: "", //类型：String  必有字段  备注：舱位集合，多个用“/”隔开
      ticket_type: [], //类型：String  必有字段  备注：票证类型集合，多个用“/”隔开
      flight_category: 0, //类型：Number  必有字段  备注：起飞情况 0：所有 1：起飞前 2：起飞后
      cancel_type: 0, //类型：Number  必有字段  备注：取位情况 0：所有 1：未取消 2：已消息
      is_voluntary: true, //类型：Boolean  必有字段  备注：是否自愿退票 true:自愿 false:非自愿
      is_change_pnr: false, //类型：Boolean  必有字段  备注：是否换编 true：已换编 false：未换编
      include_refund_type: 0, //类型：Number  必有字段  备注：退票费判断模式 0：不判断退票费 1：根据退票费判断 2：根据退票费百分比判断
      begin_refund_fee: 0, //类型：Number  必有字段  备注：退票费/率开始
      end_refund_fee: 0, //类型：Number  必有字段  备注：退票费/率结束
      stop_office_no: "", //类型：String  必有字段  备注：无权取位office号，多个用“/”隔开，
      involuntary_switching: true, //类型：Boolean  必有字段  备注：是否可转非自愿 true：可转非自愿 false：不可转非自愿
      submit_refund_mode: 1, //类型：Number  必有字段  备注： 提交退票模式 1：直接提交 2：按时限提交
      earliest_limit: 0, //类型：Number  必有字段  备注：最早提交时限 (单位：分钟)
      execute_limit: 0, //类型：Number  必有字段  备注：实际提交时限 (单位：分钟)
      latest_limit: 0, //类型：Number  必有字段  备注：最晚提交时限 (单位：分钟)
      after_waiting_time: 0, //类型：Number  必有字段  备注：飞后等待分钟数
      rule_state: 2, //类型：Number  必有字段  备注：规则状态 1：不可用 2：可用
      remarks: "", //类型：String  必有字段  备注：备注
    };
    this.setState({
      stopRuleModal: true,
      modalFrom: data,
      modalType: "新增",
    });
  }

  // 打开修改规则弹窗
  tableOption(val) {
    let data = JSON.parse(JSON.stringify(val));

    data["flight_category"] =
      data.flight_category === 0 ? [1, 2] : [data["flight_category"]];
    data["cancel_type"] = data.cancel_type === 0 ? [1, 2] : [data["cancel_type"]];
    data["ticket_type"] =
      data.ticket_type && data.ticket_type.length > 0
        ? [...new Set(data.ticket_type.split("/"))].filter((d) => d)
        : [];

    console.log(data);
    this.setState({
      stopRuleModal: true,
      modalFrom: data,
      modalType: "修改",
    });
  }

  // 表格多选
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  // 选择器返回值
  headSelect = (label, val) => {
    console.log(label, val);
    let data = JSON.parse(JSON.stringify(this.state.searchFrom));
    data[label] = val ? val.value : 0;
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

  // 表格数据禁用启用
  setTableData(type) {
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
    axios.post("api/DomcStopRules/Set", data).then((res) => {
      if (res.data.status === 0) {
        message.success(res.data.message);
        this.getData();
      } else {
        message.warning(res.data.message);
      }
    });
  }

  // 无需取位规则操作接口
  setStopRuleData(data) {
    axios.post("api/DomcStopRules/Set", data).then((res) => {
      if (res.data.status === 0) {
        message.success(res.data.message);
        this.getData();
        this.setState({
          stopRuleModal: false,
        });
      } else {
        message.warning(res.data.message);
      }
      this.setState({
        submitLoading: false,
      });
    });
  }

  // 弹窗提交按钮
  submitBtn = (val) => {
    this.setState({
      submitLoading: true,
    });

    let newData = JSON.parse(JSON.stringify(this.state.modalFrom));

    newData["flight_category"] =
      newData.flight_category && newData.flight_category.length === 2
        ? 0
        : Number(newData.flight_category) || 0;
    console.log(newData["flight_category"]);
    newData["cancel_type"] =
      newData.cancel_type && newData.cancel_type.length === 2
        ? 0
        : Number(newData.cancel_type) || 0;
    newData["ticket_type"] =
      newData.ticket_type && newData.ticket_type.length > 1
        ? String(newData.ticket_type).replace(/,/g, "/")
        : String(newData.ticket_type);

    newData["after_waiting_time"] = Number(newData.after_waiting_time) || 0;
    newData["earliest_limit"] = Number(newData.earliest_limit) || 0;
    newData["execute_limit"] = Number(newData.execute_limit) || 0;
    newData["latest_limit"] = Number(newData.latest_limit) || 0;
    let type;
    if (val) {
      type = "add";
      delete newData["key_id"];
    } else {
      type = this.state.modalType === "编辑" ? "update" : "add";
    }
    let data = {
      action_code: type,
      rules: [newData],
    };
    this.setStopRuleData(data);
  };

  // 弹窗开关数据回调
  changeSwitch = (val) => {
    console.log(val);
    let data = this.state.modalFrom;
    data.rule_state = val ? 2 : 1;
    this.setState({
      modalFrom: data,
    });
  };

  // 弹窗选择器数据回调
  modalSelect = (label, val) => {
    let data = this.state.modalFrom;
    data[label] = val ? val.value : null;
    this.setState({
      modalFrom: data,
    });
  };

  // 弹窗输入框数据回调
  modalInput = (label, val) => {
    console.log("输入框回调", val.target.value);
    let data = this.state.modalFrom;
    data[label] = val.target.value;
    this.setState({
      modalFrom: data,
    });
  };

  // 弹窗多选框数据回掉
  modalCheck = (label, val) => {
    console.log("多选框回调", val);
    let data = this.state.modalFrom;
    data[label] = val;
    this.setState({
      modalFrom: data,
    });
  };

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

  // 弹窗多选框数据回调
  modalMultiple = (val) => {
    console.log(val);
    let newData = this.state.modalFrom;
    newData["ticket_type"] = val;
    this.setState({
      modalFrom: newData,
    });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className="intl_stop_rule">
        <div className="search_header">
          <div className="search_list">
            <div className="list_name">退票类型</div>
            <div className="list_input">
              <Select
                placeholder="所有"
                labelInValue
                defaultValue={{ value: null }}
                onChange={this.headSelect.bind(this, "is_voluntary")}
              >
                <Option value={null}>所有</Option>
                <Option value={true}>自愿</Option>
                <Option value={false}>非自愿</Option>
              </Select>
            </div>
          </div>

          <div className="search_list">
            <div className="list_name">航空公司</div>
            <div className="list_input">
              <Input
                allowClear
                placeholder="如：CA"
                onChange={this.headInput.bind(this, "airline_code")}
              />
            </div>
          </div>

          <div className="search_list">
            <div className="list_name">舱位</div>
            <div className="list_input">
              <Input
                allowClear
                placeholder="如：M"
                onChange={this.headInput.bind(this, "cabin_code")}
              />
            </div>
          </div>

          <div className="search_list">
            <div className="list_name">票证类型</div>
            <div className="list_input">
              <Select
                allowClear
                placeholder="所有"
                labelInValue
                defaultValue={{ value: null }}
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
            <div className="list_name">是否换编</div>
            <div className="list_input">
              <Select
                placeholder="所有"
                labelInValue
                defaultValue={{ value: null }}
                onChange={this.headSelect.bind(this, "is_change_pnr")}
              >
                <Option value={null}>所有</Option>
                <Option value={true}>已换编</Option>
                <Option value={false}>未换编</Option>
              </Select>
            </div>
          </div>

          <div className="search_list">
            <div className="list_name">可转非自愿</div>
            <div className="list_input">
              <Select
                placeholder="所有"
                labelInValue
                defaultValue={{ value: null }}
                onChange={this.headSelect.bind(this, "involuntary_switching")}
              >
                <Option value={null}>所有</Option>
                <Option value={true}>可转非自愿</Option>
                <Option value={false}>不可转非自愿</Option>
              </Select>
            </div>
          </div>

          <div className="search_list">
            <div className="list_name">起飞情况</div>
            <div className="list_input">
              <Select
                placeholder="所有"
                labelInValue
                defaultValue={{ value: 0 }}
                onChange={this.headSelect.bind(this, "flight_category")}
              >
                <Option value={0}>所有</Option>
                <Option value={1}>起飞前</Option>
                <Option value={2}>起飞后</Option>
              </Select>
            </div>
          </div>

          <div className="search_list">
            <div className="list_name">取位情况</div>
            <div className="list_input">
              <Select
                placeholder="所有"
                labelInValue
                defaultValue={{ value: 0 }}
                onChange={this.headSelect.bind(this, "cancel_type")}
              >
                <Option value={0}>所有</Option>
                <Option value={1}>未取位</Option>
                <Option value={2}>已取位</Option>
              </Select>
            </div>
          </div>

          <div className="search_list">
            <Button className="search_btn" type="primary" onClick={() => this.getData()}>
              搜索
            </Button>
          </div>
        </div>

        <div className="tool_box">
          <Button onClick={() => this.openAddModal()}>+新增</Button>
          <Button onClick={() => this.setTableData("enable")}>批量启用</Button>
          <Button onClick={() => this.setTableData("disable")}>批量停用</Button>
          <Button onClick={() => this.setTableData("delete")}>批量删除</Button>
        </div>

        <div className="executable_table">
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
                <div className="table_edit_btn" onClick={() => this.tableOption(record)}>
                  修改
                </div>
              )}
            />
            <Column
              title="退票类型"
              dataIndex="is_voluntary"
              render={(text) => <>{text ? "自愿" : "非自愿 "}</>}
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
              render={(text) => <>{text === 2?'所有': text === 1 ? "已换编" : "未换编"}</>}
            />
            <Column
              title="退票费判断设置"
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
            <Column title="Office号" dataIndex="stop_office_no" />
            <Column
              title="可转非自愿"
              dataIndex="involuntary_switching"
              render={(text) => <>{text ? "可转非自愿 " : "不可转非自愿  "}</>}
            />
            <Column
              title="提交模式"
              dataIndex="submit_refund_mode"
              render={(text) => (
                <>{text === 1 ? "直接提交" : text === 2 ? "按时限提交" : text} </>
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
          title={this.state.modalType + " - 无需取位规则"}
          visible={this.state.stopRuleModal}
          footer={null}
          width="880px"
          confirmLoading={this.state.submitLoading}
          maskClosable={false}
          onCancel={() => this.setState({ waitRuleModal: false })}
        >
          <div className="executable_modal">
            <div className="modal_type">
              判断规则
              <div className="modal_add">(满足以下条件调用执行规则)</div>
            </div>
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
                <div className="list_title">舱位代码</div>
                <div className="list_input">
                  <Input
                    placeholder="如：M/T/R"
                    allowClear
                    onChange={this.modalInput.bind(this, "cabin_codes")}
                    value={this.state.modalFrom.cabin_codes}
                  />
                </div>
              </div>
            </div>

            <div className="modal_box">
              <div className="modal_list">
                <div className="list_title">起飞情况</div>
                <div className="list_input">
                  <Checkbox.Group
                    options={this.state.plainOptions}
                    onChange={this.modalCheck.bind(this, "flight_category")}
                    value={this.state.modalFrom.flight_category}
                  />
                </div>
              </div>

              <div className="modal_list">
                <div className="list_title">取位情况</div>
                <div className="list_input">
                  <Checkbox.Group
                    options={this.state.plainOptionsPositon}
                    onChange={this.modalCheck.bind(this, "cancel_type")}
                    value={this.state.modalFrom.cancel_type}
                  />
                </div>
              </div>

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
            </div>

            <div className="modal_box" style={{ marginBottom: "5px" }}>
              <div className="modal_list">
                <div className="list_title">是否换编</div>
                <div className="list_input">
                  <Select
                    labelInValue
                    onChange={this.modalSelect.bind(this, "is_change_pnr")}
                    value={{ value: this.state.modalFrom.is_change_pnr }}
                  >
                    <Option value={2}>所有</Option>
                    <Option value={1}>已换编</Option>
                    <Option value={0}>未换编</Option>
                  </Select>
                </div>
              </div>

              <div className="modal_list">
                <div className="list_title">office号</div>
                <div className="list_input">
                  <Input
                    placeholder="请输入"
                    allowClear
                    onChange={this.modalInput.bind(this, "stop_office_no")}
                    value={this.state.modalFrom.stop_office_no}
                  />
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
                        this.state.modalFrom.include_refund_type === 2 ? "block" : "none",
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
                        this.state.modalFrom.include_refund_type === 2 ? "block" : "none",
                    }}
                  >
                    %
                  </span>
                </div>
              </div>
            </div>
            <div className="modal_line"></div>
            <div className="modal_type">执行规则(飞前)</div>
            <div className="modal_box">
              <div className="modal_list">
                <div className="list_title">可转非自愿</div>
                <div className="list_input">
                  <Select
                    labelInValue
                    onChange={this.modalSelect.bind(this, "involuntary_switching")}
                    value={{ value: this.state.modalFrom.involuntary_switching }}
                  >
                    <Option value={true}>可转非自愿</Option>
                    <Option value={false}>不可转非自愿</Option>
                  </Select>
                </div>
              </div>
              <div className="modal_list">
                <div className="list_title">提交模式</div>
                <div className="list_input">
                  <Select
                    labelInValue
                    onChange={this.modalSelect.bind(this, "submit_refund_mode")}
                    value={{ value: this.state.modalFrom.submit_refund_mode }}
                  >
                    <Option value={1}>直接提交</Option>
                    <Option value={2}>按时限提交</Option>
                  </Select>
                </div>
              </div>
              <div className="modal_list">
                <div className="list_title"></div>
                <div className="list_input"></div>
              </div>
            </div>

            <div
              className="modal_box"
              style={{
                display: this.state.modalFrom.submit_refund_mode === 1 ? "none" : "flex",
              }}
            >
              <div className="modal_list">
                <div className="list_title">最早提交</div>
                <div className="list_input">
                  <Input
                    placeholder="分钟"
                    allowClear
                    onChange={this.modalInput.bind(this, "earliest_limit")}
                    value={this.state.modalFrom.earliest_limit}
                  />
                </div>
              </div>
              <div className="modal_list">
                <div className="list_title">实际提交</div>
                <div className="list_input">
                  <Input
                    placeholder="分钟"
                    allowClear
                    onChange={this.modalInput.bind(this, "execute_limit")}
                    value={this.state.modalFrom.execute_limit}
                  />
                </div>
              </div>
              <div className="modal_list">
                <div className="list_title">最晚提交</div>
                <div className="list_input">
                  <Input
                    placeholder="分钟"
                    allowClear
                    onChange={this.modalInput.bind(this, "latest_limit")}
                    value={this.state.modalFrom.latest_limit}
                  />
                </div>
              </div>
            </div>
            <div className="modal_line"></div>
            <div className="modal_type">执行规则(飞后)</div>
            <div className="modal_box">
              <div className="modal_list">
                <div className="list_title">飞后等待</div>
                <div className="list_input">
                  <Input
                    placeholder="分钟"
                    allowClear
                    onChange={this.modalInput.bind(this, "after_waiting_time")}
                    value={this.state.modalFrom.after_waiting_time}
                  />
                </div>
                &nbsp;分钟提交
              </div>
            </div>
            <div className="modal_line"></div>
            <div className="modal_box">
              <div className="modal_list input_remark">
                <div className="list_title">备注</div>
                <div className="list_input">
                  <TextArea
                    rows={2}
                    placeholder="添加备注"
                    allowClear
                    onChange={this.modalInput.bind(this, "remarks")}
                    value={this.state.modalFrom.remarks}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal_footer">
            <Button
              type="primary"
              className="repeat_btn"
              onClick={() => this.submitBtn("repeat")}
            >
              新增
            </Button>
            <Button
              type="default"
              onClick={() => this.setState({ stopRuleModal: false })}
            >
              取消
            </Button>
            <Button type="primary" onClick={() => this.submitBtn()}>
              确定
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}
