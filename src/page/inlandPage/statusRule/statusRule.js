/*
 * @Description: 自愿非自愿规则
 * @Author: wish.WuJunLong
 * @Date: 2020-12-17 10:26:48
 * @LastEditTime: 2021-01-12 09:38:37
 * @LastEditors: wish.WuJunLong
 */

import React, { Component } from "react";

import "./statusRule.scss";
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
        rules_type: null,
        airline_code: "",
        ticket_type: "",
        flight_change_type: "",
        applicable_rules: null,
        rule_state: 0,
      },
      dataList: [],

      selectedRowKeys: [], // 表格多选

      waitRuleModal: false, // 新增/编辑弹窗
      modalType: "新增", // 弹窗状态
      modalFrom: {}, // 弹窗数据

      ticketChangesType: [], // 航变类型

      changesChildType: [], // 航变子类型

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
    this.getChangesType();
    this.getTicketType();
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

  // 搜索按钮
  async searchBtn(){
    let data = JSON.parse(JSON.stringify(this.state.searchFrom))
    data.page_no = 1
    await this.setState({
      searchFrom: data,
    });
    await this.getData()
  }

  // 获取规则列表
  getData() {
    axios.post("api/DomcVTIRules/GetPage", this.state.searchFrom).then((res) => {
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

  // 获取航变类型
  getChangesType() {
    axios.get("api/pnr/GetFlightChangesType").then((res) => {
      if (res.data.status === 0) {
        this.setState({
          ticketChangesType: res.data.data,
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
    console.log(label, val, "changesChildType");

    let data = this.state.modalFrom;
    data[label] = val ? val.value : null;

    if (label === "flight_change_type") {
      let changeType = [];
      this.state.ticketChangesType.forEach((item) => {
        if (item.code === val.value) {
          changeType = item.child_typs;
        }
      });
      this.setState({
        changesChildType: changeType,
      });

      data["flight_change_child_type"] = [];
    }

    this.setState({
      modalFrom: data,
    });
  };

  // 弹窗选择器多选
  modalMultiple = (val) => {
    console.log(val);
    let data = this.state.modalFrom;
    data["flight_change_child_type"] = val ? val : [];
    this.setState({
      modalFrom: data,
    });
  };
   // 票证类型多选
   modalMultipleType = (val) => {
    console.log(val);
    let data = this.state.modalFrom;
    data["ticket_type"] = val ? val : [];
    this.setState({
      modalFrom: data,
    });
  };

  modalMultipleRule = (val) => {
    console.log(val);
    let data = this.state.modalFrom;
    data["applicable_rules"] = val ? val : [];
    this.setState({
      modalFrom: data,
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
      let changeType = [];
      this.state.ticketChangesType.forEach((item) => {
        if (item.code === val.flight_change_type) {
          changeType = item.child_typs;
        }
      });
      await this.setState({
        changesChildType: changeType,
      });
      let data = JSON.parse(JSON.stringify(val));
      data["flight_change_child_type"] = data.flight_change_child_type
        ? data.flight_change_child_type.split("/").filter(function (e) {
            return e.replace(/(\r\n|\n|\r)/gm, "");
          })
        : [];

      data["ticket_type"] =
        data.ticket_type && data.ticket_type.length > 0
          ? [...new Set(data.ticket_type.split("/"))].filter((d) => d)
          : [];

      data["applicable_rules"] = data.applicable_rules
        ? data.applicable_rules.split("/").filter(function (e) {
            return e.replace(/(\r\n|\n|\r)/gm, "");
          })
        : [];

      console.log(data);
      await this.setState({
        modalFrom: data,
      });
    } else {
      let data = {
        rules_type: 1,
        airline_code: "",
        applicable_rules: [],
        ticket_type: [],
        flight_change_type: "",
        flight_change_child_type: [],
        flight_change_diff: null,
        pnr_remarks_ins: "",
        is_generate_attachment: true,
        rule_state: 2,
        remarks: "",
      };
      this.setState({
        modalFrom: data,
      });
    }
    console.log(this.state.changesChildType);
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
  submitBtn = (val) => {
    this.setState({
      submitLoading: true,
    });
    console.log(this.state.modalFrom);
    let newData = JSON.parse(JSON.stringify(this.state.modalFrom));
    newData["flight_change_diff"] = newData.flight_change_diff
      ? Number(newData.flight_change_diff)
      : 0;
    newData["flight_change_child_type"] = newData.flight_change_child_type
      ? String(newData.flight_change_child_type).replace(/,/g, "/")
      : "";
    newData["applicable_rules"] = newData.applicable_rules
      ? String(newData.applicable_rules).replace(/,/g, "/")
      : "";
    newData["ticket_type"] =
      newData.ticket_type && newData.ticket_type.length > 1
        ? String(newData.ticket_type).replace(/,/g, "/")
        : String(newData.ticket_type);
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
    axios.post("api/DomcVTIRules/Set", data).then((res) => {
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
    axios.post("api/DomcVTIRules/Set", data).then((res) => {
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
      <div className="status_rule">
        <div className="search_box">
          <div className="box_list">
            <div className="list_title">规则类型</div>
            <div className="list_item">
              <Select
                placeholder="所有"
                labelInValue
                onChange={this.headSelect.bind(this, "rules_type")}
                defaultValue={{ value: 1 }}
              >
                <Option value={1}>航变规则</Option>
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
            <div className="list_title">航变类型</div>
            <div className="list_item">
              <Select
                allowClear
                placeholder="所有"
                labelInValue
                onChange={this.headSelect.bind(this, "flight_change_type")}
              >
                {this.state.ticketChangesType.map((item) => (
                  <Option value={item.code} key={item.code}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <div className="box_list">
            <div className="list_title">适用规则</div>
            <div className="list_item">
              <Select
                placeholder="所有"
                labelInValue
                onChange={this.headSelect.bind(this, "involuntary_switching")}
              >
                <Option value={1}>等待取位规则</Option>
                <Option value={2}>无需取位规则</Option>
              </Select>
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
            <Button className="search_btn" type="primary" onClick={() => this.searchBtn()}>
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
              title="规则类型"
              dataIndex="rules_type"
              render={(text) => <>{text === 1 ? "航变规则" : text}</>}
            />
            <Column title="航空公司" dataIndex="airline_code" />
            <Column title="适用规则" dataIndex="applicable_rules_text" />
            <Column
              title="判断规则"
              dataIndex="check_rules"
              render={(text) => (
                <Tooltip
                  title={() => (
                    <>
                      {text.tips.map((item, index) => (
                        <p
                          key={index}
                          style={{
                            fontSize: "12px",
                            color: "rgba(255, 255, 255, .8)",
                            minWidth: "200px",
                            marginBottom: "5px",
                          }}
                        >
                          {item}
                        </p>
                      ))}
                    </>
                  )}
                >
                  <span
                    style={{
                      display: "block",
                      maxWidth: "400px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {text.text}
                  </span>
                </Tooltip>
              )}
            />
            <Column
              title="执行规则"
              dataIndex="execute_rules"
              render={(text) => (
                <Tooltip
                  title={() => (
                    <>
                      {text.tips.map((item, index) => (
                        <p
                          key={index}
                          style={{
                            fontSize: "12px",
                            color: "rgba(255, 255, 255, .8)",
                            minWidth: "200px",
                            marginBottom: "5px",
                          }}
                        >
                          {item}
                        </p>
                      ))}
                    </>
                  )}
                >
                  <span>{text.text}</span>
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
          title={this.state.modalType + " - 非自愿规则"}
          visible={this.state.waitRuleModal}
          footer={null}
          width="880px"
          confirmLoading={this.state.submitLoading}
          maskClosable={false}
          onCancel={() => this.setState({ waitRuleModal: false })}
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
                  <div className="list_title">规则类型</div>
                  <div className="list_input">
                    <Select
                      labelInValue
                      onChange={this.modalSelect.bind(this, "rules_type")}
                      value={{ value: this.state.modalFrom.rules_type }}
                    >
                      <Option value={1}>航变规则</Option>
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
                  <div className="list_title">航变类型</div>
                  <div className="list_input">
                    <Select
                      placeholder="请选择"
                      labelInValue
                      onChange={this.modalSelect.bind(this, "flight_change_type")}
                      value={{ value: this.state.modalFrom.flight_change_type }}
                    >
                      {this.state.ticketChangesType.map((item) => (
                        <Option value={item.code} key={item.code}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              <div className="modal_box">
                <div className="modal_list">
                  <div className="list_title">航变差大于</div>
                  <div className="list_input refund_fee_input">
                    <Input
                      placeholder="请输入"
                      allowClear
                      onChange={this.modalInput.bind(this, "flight_change_diff")}
                      value={this.state.modalFrom.flight_change_diff}
                    />
                    <span style={{ flexShrink: 0, marginLeft: "5px" }}>分钟</span>
                  </div>
                </div>
                <div className="modal_list">
                  <div className="list_title">适用规则</div>
                  <div className="list_input">
                    <Select
                      placeholder="请选择"
                      mode="multiple"
                      allowClear
                      onChange={this.modalMultipleRule}
                      value={this.state.modalFrom.applicable_rules}
                    >
                      <Option value={"1"}>等待取位规则</Option>
                      <Option value={"2"}>无需取位规则</Option>
                    </Select>
                  </div>
                </div>
                <div className="modal_list">
                  <div className="list_title">航变子类型</div>
                  <div className="list_input">
                    <Select
                      placeholder="请选择"
                      mode="multiple"
                      allowClear
                      disabled={!this.state.modalFrom.flight_change_type}
                      onChange={this.modalMultiple}
                      value={this.state.modalFrom.flight_change_child_type}
                    >
                      {this.state.changesChildType.map((item) => (
                        <Option value={String(item.code)} key={item.code}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
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
                      onChange={this.modalMultipleType}
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
            </div>

            <div className="wait_rule_list">
              <div className="modal_title">执行规则</div>

              <div className="modal_box">
                <div className="modal_list">
                  <div className="list_title">生成附表</div>
                  <div className="list_input">
                    <Select
                      labelInValue
                      onChange={this.modalSelect.bind(this, "is_generate_attachment")}
                      value={{
                        value: this.state.modalFrom.is_generate_attachment,
                      }}
                    >
                      <Option value={true}>生成</Option>
                      <Option value={false}>不生成</Option>
                    </Select>
                  </div>
                </div>
                <div className="modal_list">
                  <div className="list_title"></div>
                  <div className="list_input"></div>
                </div>
              </div>

              <div className="modal_box">
                <div className="modal_list input_remark">
                  <div className="list_title">PNR备注</div>
                  <div className="list_input">
                    <TextArea
                      rows={2}
                      placeholder="请输入"
                      allowClear
                      onChange={this.modalInput.bind(this, "pnr_remarks_ins")}
                      value={this.state.modalFrom.pnr_remarks_ins}
                    />
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
              onClick={() => this.setState({ waitRuleModal: false })}
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
