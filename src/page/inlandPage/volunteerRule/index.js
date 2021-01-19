/*
 * @Description: 自愿规则列表
 * @Author: wish.WuJunLong
 * @Date: 2021-01-14 14:18:23
 * @LastEditTime: 2021-01-19 17:31:45
 * @LastEditors: wish.WuJunLong
 */
import React, { Component } from "react";
import {
  PlusSquareOutlined,
  MinusSquareOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import axios from "@/api/api";

import "./volunteerRule.scss";
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
  Spin,
  InputNumber,
} from "antd";

const { Column } = Table;

const { Option } = Select;

const { TextArea } = Input;

const { confirm } = Modal;

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      ticketTypeList: [], // 票证类型
      searchFrom: {
        // 数据筛选
        page_no: 1,
        page_size: 10,
        total_count: 0,
        airline_code: "",
        cabin_code: "",
        pnr_operable: null,
      },
      selectedRowKeys: [], // 多选列表
      modalStatus: false, // 新增编辑弹窗
      submitLoading: false, // 弹窗提交加载
      detailType: "新增", // 弹窗状态
      tableEditLoading: false, // 编辑弹窗打开加载动画
      detailData: {
        rule_opers: [],
      }, // 详情数据
    };
  }

  async componentDidMount() {
    await this.getRuleList();
    await this.getTicketType();
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
  async searchBtn() {
    let data = JSON.parse(JSON.stringify(this.state.searchFrom));
    data.page_no = 1;
    await this.setState({
      searchFrom: data,
    });
    await this.getRuleList();
  }

  // 获取自愿规则列表
  getRuleList() {
    axios.post("api/DomcVoluntaryRules/GetPage", this.state.searchFrom).then((res) => {
      console.log(res);
      if (res.data.status === 0) {
        let data = res.data.data.datas;
        data.forEach((item) => {
          item["continuation_rules"] = item.continuation_rules
            .replace("/1/", "/自愿转非自愿/")
            .replace("/2/", "/延缓规则/");
        });

        let newData = this.state.searchFrom;
        newData["page_no"] = res.data.data.page_no;
        newData["total_count"] = res.data.data.total_count;
        this.setState({
          searchFrom: newData,
          dataList: data,
        });
      } else {
        message.warning(res.data.message);
      }
    });
  }

  mergeCells(text, data, key, index) {
    // 上一行该列数据是否一样
    if (index !== 0 && text === data[index - 1][key]) {
      return 0;
    }
    let rowSpan = 1;
    // 判断下一行是否相等
    for (let i = index + 1; i < data.length; i++) {
      if (text !== data[i][key]) {
        break;
      }
      rowSpan++;
    }
    return rowSpan;
  }

  // 表格多选
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  // 表格操作
  setTableData(val) {
    if (this.state.selectedRowKeys.length < 1) {
      return message.warning("请选择需要操作的数据");
    }

    let data = {
      action_code: val,
      key_ids: this.state.selectedRowKeys,
    };

    if (val === "delete") {
      let _that = this
      confirm({
        title: "警告",
        icon: <ExclamationCircleOutlined />,
        centered: true,
        content: "是否确认删除所选数据？",
        onOk() {
          axios.post("api/DomcVoluntaryRules/BatchHandler", data).then((res) => {
            if (res.data.status === 0) {
              message.success(res.data.message);
              _that.getRuleList();
            } else {
              message.warning(res.data.message);
            }
          });
        },
      });
    } else {
      axios.post("api/DomcVoluntaryRules/BatchHandler", data).then((res) => {
        if (res.data.status === 0) {
          message.success(res.data.message);
          this.getRuleList();
        } else {
          message.warning(res.data.message);
        }
      });
    }
  }

  // 打开弹窗
  openModal(val) {
    if (val) {
      console.log(val);
      this.setState({
        tableEditLoading: true,
      });
      let data = {
        key_id: val.rule_key_id,
      };
      axios.get("api/DomcVoluntaryRules/PackGet", { params: data }).then((res) => {
        if (res.data.status === 0) {
          let editData = JSON.parse(JSON.stringify(res.data.data));
          editData["ticket_type"] = editData.ticket_type
            ? editData.ticket_type.split("/").filter(function (e) {
                return e.replace(/(\r\n|\n|\r)/gm, "");
              })
            : [];

          editData.rule_opers.forEach((item) => {
            item["continuation_rules"] = item.continuation_rules
              ? item.continuation_rules.split("/").filter(function (e) {
                  return e.replace(/(\r\n|\n|\r)/gm, "");
                })
              : [];
          });

          this.setState({
            tableEditLoading: false,
            detailData: editData,
            modalStatus: true,
            detailType: "编辑",
          });
        } else {
          this.setState({
            tableEditLoading: false,
          });
        }
      });
    } else {
      let newData = {
        airline_code: "",
        ticket_type: "",
        pnr_operable: null,
        remarks: "",
        suspend_type: "",
        rule_opers: [],
      };
      this.setState({
        detailData: newData,
        modalStatus: true,
        detailType: "新增",
      });
    }
  }

  // 弹窗数组删除
  removeModalArr(val, index) {
    console.log(val, index);

    let data = JSON.parse(JSON.stringify(this.state.detailData));
    let _that = this;

    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      centered: true,
      content: "是否确认删除该条数据？",
      onOk() {
        data.rule_opers.splice(
          data.rule_opers.findIndex((item) => item.key_id === val.key_id),
          1
        );
        _that.setState({
          detailData: data,
        });
      },
    });
  }

  // 新增弹窗数组
  addModalArr() {
    let data = JSON.parse(JSON.stringify(this.state.detailData));
    data.rule_opers.push({
      key_id: "0",
      rule_key_id: "0",
      cabin_codes: "",
      cancel_flag: true,
      suspend_type: 0,
      flight_before: true,
      cancel_limits: "",
      advance_time: 0,
      submit_type: 0,
      submit_delay: 0,
      include_refund_type: 0,
      begin_refund_fee: 0,
      end_refund_fee: 0,
      continuation_rules: [],
      rule_state: 2,
    });

    this.setState({
      detailData: data,
    });
  }

  // 弹窗输入框返回值
  modalHeadInput = (label, index, val) => {
    console.log(label, index, "下标 ", val);
    let data = JSON.parse(JSON.stringify(this.state.detailData));
    if (val) {
      data.rule_opers[index][label] = val.target.value;
    } else {
      data[label] = index.target.value;
    }
    this.setState({
      detailData: data,
    });
  };

  // 弹窗选择器返回值
  modalHeadSelect = (label, val) => {
    console.log(label, val);
    let data = JSON.parse(JSON.stringify(this.state.detailData));
    data[label] = val;
    this.setState({
      detailData: data,
    });
  };

  // 弹窗数字输入框返回值
  modalHeadNumber = (label, index, val) => {
    let data = JSON.parse(JSON.stringify(this.state.detailData));
    if (val) {
      data.rule_opers[index][label] = Number(val.target.value);
    } else {
      data[label] = index;
    }
    this.setState({
      detailData: data,
    });
  };

  // 弹窗数组选择器返回值
  modalArrSelect = (label, index, val) => {
    console.log(label, index, "下标 ", val);
    let data = JSON.parse(JSON.stringify(this.state.detailData));
    data.rule_opers[index][label] = val;
    this.setState({
      detailData: data,
    });
  };

  // 弹窗数组开关数据回调
  modalArrSelectSwitch = (label, index, val) => {
    console.log(label, index, val);
    let data = this.state.detailData;
    if (label === "rule_state") {
      data.rule_opers[index][label] = val ? 2 : 1;
    } else {
      data.rule_opers[index][label] = val;
    }
    console.log(data.rule_opers[index][label]);
    this.setState({
      detailData: data,
    });
  };

  // 弹窗数据提交
  submitModal() {
    let data = JSON.parse(JSON.stringify(this.state.detailData));
    data["ticket_type"] = data.ticket_type
      ? `/${String(data.ticket_type).replace(/,/g, "/")}/`
      : "";

    data.rule_opers.forEach((item) => {
      if (item.continuation_rules.length > 0) {
        item["continuation_rules"] = item.continuation_rules
          ? `/${String(item.continuation_rules).replace(/,/g, "/")}/`
          : "";
      } else {
        item.continuation_rules = "";
      }
    });
    axios.post("api/DomcVoluntaryRules/set", data).then((res) => {
      if (res.data.status === 0) {
        this.setState({
          modalStatus: false,
        });
        message.success(res.data.message);
        this.getRuleList();
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

  // 票证类型多选
  modalMultipleType = (val) => {
    console.log(val);
    let data = this.state.detailData;
    data["ticket_type"] = val ? val : [];
    this.setState({
      detailData: data,
    });
  };

  // 分页器切换
  changePage = async (page, size) => {
    let data = JSON.parse(JSON.stringify(this.state.searchFrom));
    data.page_no = page;
    data.page_size = size;
    await this.setState({
      searchFrom: data,
    });
    await this.getRuleList();
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className="volunteer_rule">
        <div className="search_box">
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
            <div className="list_title">舱位代码</div>
            <div className="list_item">
              <Input
                allowClear
                placeholder="如：A"
                onChange={this.headInput.bind(this, "cabin_code")}
              />
            </div>
          </div>

          <div className="box_list">
            <div className="list_title">操作编码</div>
            <div className="list_item">
              <Select
                placeholder="所有"
                labelInValue
                onChange={this.headSelect.bind(this, "pnr_operable")}
              >
                <Option value={null}>所有</Option>
                <Option value={0}>不可操作</Option>
                <Option value={1}>可操作</Option>
              </Select>
            </div>
          </div>

          <div className="box_list">
            <Button
              className="search_btn"
              type="primary"
              onClick={() => this.searchBtn()}
            >
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
          <Spin spinning={this.state.tableEditLoading} tip="合并自愿规则中...">
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
                render={(text, record, index) => {
                  const obj = {
                    children: (
                      <div
                        className="table_edit_btn"
                        onClick={() => this.openModal(record)}
                      >
                        修改
                      </div>
                    ),
                    props: {},
                  };
                  obj.props.rowSpan = record.opers_count;
                  return obj;
                }}
              />
              <Column
                title="航司"
                dataIndex="airline_code"
                render={(text, record, index) => {
                  const obj = {
                    children: text,
                    props: {},
                  };
                  obj.props.rowSpan = record.opers_count;
                  return obj;
                }}
              />
              <Column
                title="票证类型"
                dataIndex="ticket_type"
                render={(text, record, index) => {
                  const obj = {
                    children: text,
                    props: {},
                  };
                  obj.props.rowSpan = record.opers_count;
                  return obj;
                }}
              />
              <Column
                title="挂起类型"
                dataIndex="suspend_type"
                render={(text, record, index) => {
                  const obj = {
                    children:
                      text === 0
                        ? "不挂起"
                        : text === 1
                        ? "取位前挂起"
                        : text === 2
                        ? "取位后挂起"
                        : text,
                    props: {},
                  };
                  obj.props.rowSpan = record.opers_count;
                  return obj;
                }}
              />
              <Column
                title="编码操作"
                dataIndex="pnr_operable"
                render={(text, record, index) => {
                  const obj = {
                    children:
                      text === 0
                        ? "不可操作"
                        : text === 1
                        ? "可操作"
                        : text === 2
                        ? "所有"
                        : text,
                    props: {},
                  };
                  obj.props.rowSpan = record.opers_count;
                  return obj;
                }}
              />
              <Column title="舱位集合" dataIndex="cabin_codes" />
              <Column
                title="取位标识"
                dataIndex="cancel_flag"
                render={(text) => <>{text ? "取消" : "不取消"}</>}
              />
              <Column
                title="起飞前标识"
                dataIndex="flight_before"
                render={(text) => <>{text ? "起飞前" : "起飞后"}</>}
              />
              <Column title="时间时限" dataIndex="cancel_limits" />
              <Column
                title="提交模式"
                dataIndex="submit_type"
                render={(text) => (
                  <>
                    {text === 0
                      ? "不提交"
                      : text === 1
                      ? "起飞前提交"
                      : text === 2
                      ? "起飞后提交"
                      : text === 3
                      ? "完成后提交"
                      : text}
                  </>
                )}
              />
              <Column
                title="后续规则"
                dataIndex="continuation_rules"
                render={(text) => (
                  <>{text === "1" ? "自愿转非自愿" : text === "2" ? "延缓规则" : text}</>
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
              <Column title="修改者" dataIndex="modifier" />
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
          </Spin>
        </div>

        <Modal
          title={this.state.detailType + " - 自愿规则"}
          visible={this.state.modalStatus}
          width="1050px"
          confirmLoading={this.state.submitLoading}
          maskClosable={false}
          getContainer={false}
          centered
          onCancel={() => this.setState({ modalStatus: false })}
          onOk={() => this.submitModal()}
        >
          <div className="modal_status">
            <div className="modal_header">
              <div className="header_list">
                <div className="list_title">航司</div>
                <div className="list_item">
                  <Input
                    placeholder="请输入"
                    value={this.state.detailData.airline_code}
                    onChange={this.modalHeadInput.bind(this, "airline_code")}
                  />
                </div>
              </div>
              <div className="header_list">
                <div className="list_title">票证类型</div>
                <div className="list_item">
                  <Select
                    placeholder="所有"
                    mode="multiple"
                    style={{ width: "100%" }}
                    allowClear
                    maxTagCount={2}
                    onChange={this.modalMultipleType}
                    value={this.state.detailData.ticket_type}
                  >
                    {this.state.ticketTypeList.map((item) => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="header_list">
                <div className="list_title">操作编码</div>
                <div className="list_item">
                  <Select
                    value={this.state.detailData.pnr_operable}
                    style={{ width: 174 }}
                    onChange={this.modalHeadSelect.bind(this, "pnr_operable")}
                  >
                    <Option value={2}>所有</Option>
                    <Option value={0}>不可操作</Option>
                    <Option value={1}>可操作</Option>
                  </Select>
                </div>
              </div>
              <div className="header_list">
                <div className="list_title">挂起类型</div>
                <div className="list_item">
                  <Select
                    value={this.state.detailData.suspend_type}
                    style={{ width: 174 }}
                    onChange={this.modalHeadSelect.bind(this, "suspend_type")}
                  >
                    <Option value={0}>不挂起</Option>
                    <Option value={1}>取位前挂起</Option>
                    <Option value={2}>取位后挂起</Option>
                  </Select>
                </div>
              </div>
              <div className="header_list" style={{ flex: 1, minWidth: 600 }}>
                <div className="list_title">备注</div>
                <div className="list_item" style={{ flex: 1 }}>
                  <TextArea
                    placeholder="请输入"
                    rows={2}
                    value={this.state.detailData.remarks}
                    onChange={this.modalHeadInput.bind(this, "remarks")}
                  />
                </div>
              </div>
            </div>

            <div className="modal_tool">
              <PlusSquareOutlined
                style={{ cursor: "pointer", fontSize: 18, color: "green" }}
                onClick={() => this.addModalArr()}
              />
            </div>

            <div className="modal_table">
              <div className="table_header">
                <div className="table_td">舱位集合</div>
                <div className="table_td" style={{ width: 75 }}>
                  取位标识
                </div>
                <div className="table_td" style={{ width: 75 }}>
                  飞前标识
                </div>
                <div className="table_td">时间时限</div>
                <div className="table_td" style={{ width: 75 }}>
                  处理时间
                </div>
                <div className="table_td td_line" style={{ width: 95 }}>
                  提交模式
                </div>
                <div className="table_td" style={{ width: 75 }}>
                  延时时间
                </div>
                <div className="table_td" style={{ width: 95 }}>
                  退票费类型
                </div>
                <div className="table_td" style={{ width: 120 }}>
                  采购退票率
                </div>
                <div className="table_td" style={{ width: 140 }}>
                  规则匹配
                </div>
              </div>

              <div className="table_main">
                <div className="main">
                  <div
                    className="not_arr"
                    style={{
                      display:
                        this.state.detailData.rule_opers.length < 1 ? "block" : "none",
                    }}
                  >
                    请添加数据
                  </div>
                  {this.state.detailData.rule_opers.map((item, index) => (
                    <div className="main_tr" key={index}>
                      <div className="main_td">
                        <Input
                          placeholder="请输入"
                          value={item.cabin_codes}
                          style={{ width: 120 }}
                          onChange={this.modalHeadInput.bind(this, "cabin_codes", index)}
                        />
                      </div>
                      <div className="main_td" style={{ width: 75 }}>
                        <Switch
                          checkedChildren="取消"
                          unCheckedChildren="不取消"
                          checked={item.cancel_flag}
                          onChange={this.modalArrSelectSwitch.bind(
                            this,
                            "cancel_flag",
                            index
                          )}
                        />
                      </div>
                      <div className="main_td" style={{ width: 75 }}>
                        <Switch
                          checkedChildren="起飞前"
                          unCheckedChildren="起飞后"
                          checked={item.flight_before}
                          onChange={this.modalArrSelectSwitch.bind(
                            this,
                            "flight_before",
                            index
                          )}
                        />
                      </div>
                      <div className="main_td">
                        <Input
                          placeholder="请输入"
                          value={item.cancel_limits}
                          style={{ width: "100%" }}
                          onChange={this.modalHeadInput.bind(
                            this,
                            "cancel_limits",
                            index
                          )}
                        />
                      </div>
                      <div className="main_td" style={{ width: 75 }}>
                        <Input
                          placeholder="请输入"
                          value={item.advance_time}
                          style={{ width: "100%" }}
                          onChange={this.modalHeadNumber.bind(
                            this,
                            "advance_time",
                            index
                          )}
                        />
                      </div>
                      <div className="main_td td_line" style={{ width: 95 }}>
                        <Select
                          value={item.submit_type}
                          style={{ width: "100%" }}
                          onChange={this.modalArrSelect.bind(this, "submit_type", index)}
                        >
                          <Option value={0}>不提交</Option>
                          <Option value={1}>起飞前</Option>
                          <Option value={2}>起飞后</Option>
                          <Option value={3}>
                            {item.cancel_flag ? "取消后" : "完成后"}
                          </Option>
                        </Select>
                      </div>
                      <div className="main_td" style={{ width: 75 }}>
                        <Input
                          placeholder="请输入"
                          value={item.submit_delay}
                          style={{ width: "100%" }}
                          onChange={this.modalHeadNumber.bind(
                            this,
                            "submit_delay",
                            index
                          )}
                        />
                      </div>
                      <div className="main_td" style={{ width: 95 }}>
                        <Select
                          value={item.include_refund_type}
                          style={{ width: "100%" }}
                          onChange={this.modalArrSelect.bind(
                            this,
                            "include_refund_type",
                            index
                          )}
                        >
                          <Option value={0}>未设置</Option>
                          <Option value={1}>退票费</Option>
                          <Option value={2}>百分比</Option>
                        </Select>
                      </div>

                      <div className="main_td" style={{ width: 120 }}>
                        <Input
                          disabled={item.include_refund_type === 0}
                          placeholder="请输入"
                          value={item.begin_refund_fee}
                          style={{ width: "100%" }}
                          onChange={this.modalHeadNumber.bind(
                            this,
                            "begin_refund_fee",
                            index
                          )}
                        />{" "}
                        -
                        <Input
                          disabled={item.include_refund_type === 0}
                          placeholder="请输入"
                          value={item.end_refund_fee}
                          style={{ width: "100%" }}
                          onChange={this.modalHeadNumber.bind(
                            this,
                            "end_refund_fee",
                            index
                          )}
                        />
                      </div>
                      <div className="main_td" style={{ width: 140 }}>
                        <Select
                          value={item.continuation_rules}
                          style={{ width: "100%" }}
                          placeholder="全部"
                          allowClear
                          maxTagTextLength={3}
                          mode="multiple"
                          onChange={this.modalArrSelect.bind(
                            this,
                            "continuation_rules",
                            index
                          )}
                        >
                          <Option value={"1"}>自愿转非自愿</Option>
                          <Option value={"2"}>延缓规则</Option>
                        </Select>
                      </div>
                      <div className="main_td" style={{ width: 50 }}>
                        <MinusSquareOutlined
                          style={{ cursor: "pointer", fontSize: 18, color: "red" }}
                          onClick={() => this.removeModalArr(item, index)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
