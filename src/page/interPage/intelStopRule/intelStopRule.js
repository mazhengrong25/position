/*
 * @Description: 无需取位规则
 * @Author: wish.WuJunLong
 * @Date: 2020-11-18 17:19:52
 * @LastEditTime: 2020-12-15 15:46:00
 * @LastEditors: Please set LastEditors
 */
import React, { Component } from "react";

import "./intelStopRule.scss";
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
} from "antd";

const { Column } = Table;

const { Option } = Select;

const { TextArea } = Input;

export default class intelStopRule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [], // 可执行取位列表
      pageNumber: 1, // 当前分页下标
      pageTotal: 0, // 数据总条数
      pageSize: 10, // 每页数据条数

      searchFrom: {
        page_no: 1,
        page_size: 10,
        total_count: 0,
        key_id: "0",
        data_type: null,
        refund_type: null,
        config_state: null,
        airline_code: "",
        cabin_code: "",
        is_change_pnr: null,
        sales_channel_code: "",
      }, // 筛选数据

      selectedRowKeys: [], // 表格多选

      modalType: "新增", // 弹窗状态
      stopRuleModal: false, //  新增\编辑弹窗
      modalFrom: {}, // 新增\编辑弹窗数据

      submitLoading: false, // 弹窗提交加载状态
    };
  }

  async componentDidMount() {
    let data = JSON.parse(JSON.stringify(this.state.searchFrom));
    data.key_id = this.props.keyId || '0'
    await this.setState({
      searchFrom: data,
    });
    await this.getData();
  }

  // 获取无需取位列表
  getData() {
    let data = JSON.parse(JSON.stringify(this.state.searchFrom));
    data.data_type = data.data_type !== null ? Number(data.data_type) : null;
    data.refund_type =
      data.refund_type !== null ? Number(data.refund_type) : null;
    data.config_state =
      data.config_state !== null ? Number(data.config_state) : null;

    data.is_change_pnr =
      data.is_change_pnr !== null
        ? data.is_change_pnr === "0"
          ? true
          : false
        : null;

    axios.post("/api/IntlStopRule/getpage", data).then((res) => {
      if (res.data.status !== 0) {
        message.warning(res.data.message);
      }
      data.page_no = res.data.page_no;
      data.total_count = res.data.total_count;
      this.setState({
        dataList: res.data.datas,
        searchFrom: data,
      });
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

  // 导航栏搜索
  searchBtn() {
    console.log(this.state.searchFrom);
  }

  // 表格数据禁用启用
  setTableData(type) {
    if (this.state.selectedRowKeys.length < 1) {
      return message.warning("请至少选择一条数据");
    }

    let newList = [];
    this.state.selectedRowKeys.forEach((item) => {
      this.state.dataList.forEach((oitem) => {
        if (item === oitem.key_id) {
          newList.push(oitem);
        }
      });
    });

    let data = {
      action_code: type,
      rules: newList,
    };
    this.setStopRuleData(data);
  }

  // 打开新增规则弹窗
  openAddModal() {
    let data = {
      data_type: "1",
      refund_type: "1",
      airline_code: "",
      cabin_code: "",
      is_change_pnr: "true",
      sales_channel_code: "",
      config_state: "1",
      remarks: "",
    };
    this.setState({
      stopRuleModal: true,
      modalFrom: data,
      modalType: "新增",
    });
  }

   // 打开修改规则弹窗
   tableOption(val) {
    console.log(val);
    this.setState({
      stopRuleModal: true,
      modalFrom: JSON.parse(JSON.stringify(val)),
      modalType: "修改",
    });
  }

  // 可执行取位规则操作接口
  setStopRuleData(data) {
    axios.post("api/IntlStopRule/set", data).then((res) => {
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

  // 弹窗提交按钮
  submitBtn = () => {
    this.setState({
      submitLoading: true,
    });

    let newData = JSON.parse(JSON.stringify(this.state.modalFrom));

    newData.data_type = Number(newData.data_type);
    newData.refund_type = Number(newData.refund_type);
    newData.is_change_pnr = newData.is_change_pnr === "true";
    newData.config_state = Number(newData.config_state);

    let data = {
      action_code: this.state.modalType === "新增" ? "add" : "update",
      rules: [newData],
    };
    this.setStopRuleData(data);
  };

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
            <div className="list_name">数据类型</div>
            <div className="list_input">
              <Select
                allowClear
                placeholder="所有"
                labelInValue
                onChange={this.headSelect.bind(this, "data_type")}
              >
                <Option value="0">废票</Option>
                <Option value="1">退票</Option>
              </Select>
            </div>
          </div>

          <div className="search_list">
            <div className="list_name">退票类型</div>
            <div className="list_input">
              <Select
                allowClear
                placeholder="所有"
                labelInValue
                onChange={this.headSelect.bind(this, "refund_type")}
              >
                <Option value="1">自愿</Option>
                <Option value="2">非自愿</Option>
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
            <div className="list_name">是否换编</div>
            <div className="list_input">
              <Select
                allowClear
                placeholder="所有"
                labelInValue
                onChange={this.headSelect.bind(this, "is_change_pnr")}
              >
                <Option value="0">已换编</Option>
                <Option value="1">未换编</Option>
              </Select>
            </div>
          </div>

          <div className="search_list">
            <div className="list_name">销售渠道代码</div>
            <div className="list_input">
              <Input
                allowClear
                placeholder="如：PEK"
                onChange={this.headInput.bind(this, "sales_channel_code")}
              />
            </div>
          </div>

          <div className="search_list">
            <div className="list_name">配置状态</div>
            <div className="list_input">
              <Select
                allowClear
                placeholder="所有"
                labelInValue
                onChange={this.headSelect.bind(this, "config_state")}
              >
                <Option value="2">可用</Option>
                <Option value="1">禁用</Option>
              </Select>
            </div>
          </div>

          <div className="search_list">
            <Button
              className="search_btn"
              type="primary"
              onClick={() => this.getData()}
            >
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
                <div
                  style={{ color: "#0070E2", cursor: "pointer" }}
                  onClick={() => this.tableOption(record)}
                >
                  修改
                </div>
              )}
            />
            <Column
              title="数据类型"
              dataIndex="data_type"
              render={(text) => (
                <>{text === 0 ? "废票" : text === 1 ? "退票" : text}</>
              )}
            />
            <Column
              title="退票类型"
              dataIndex="refund_type"
              render={(text) => (
                <>
                  {text === 0
                    ? "不限"
                    : text === 1
                    ? "自愿"
                    : text === 2
                    ? "非自愿"
                    : text}
                </>
              )}
            />
            <Column title="航空公司" dataIndex="airline_code" />
            <Column title="舱位代码" dataIndex="cabin_code" />

            <Column
              title="是否换编"
              dataIndex="is_change_pnr"
              render={(text) => <>{text ? "已换编" : "未换编"}</>}
            />
            <Column title="销售渠道代码" dataIndex="sales_channel_code" />

            <Column
              title="配置状态"
              dataIndex="config_state"
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
          title={this.state.modalType + "规则"}
          visible={this.state.stopRuleModal}
          onOk={this.submitBtn}
          onCancel={() => this.setState({ stopRuleModal: false })}
          width="800px"
          confirmLoading={this.state.submitLoading}
          maskClosable={false}
        >
          <div className="executable_modal">
            <div className="modal_box">
              <div className="modal_list">
                <div className="list_title">配置状态</div>
                <div className="list_input">
                  <Switch
                    checkedChildren="可用"
                    unCheckedChildren="不可用"
                    defaultChecked={this.state.modalFrom.config_state === 2}
                    onChange={this.changeSwitch}
                  />
                </div>
              </div>
            </div>
            <div className="modal_box">
              <div className="modal_list">
                <div className="list_title">数据类型</div>
                <div className="list_input">
                  <Select
                    labelInValue
                    onChange={this.modalSelect.bind(this, "data_type")}
                    value={{ value: String(this.state.modalFrom.data_type) }}
                  >
                    <Option value="0">废票</Option>
                    <Option value="1">退票</Option>
                  </Select>
                </div>
              </div>

              <div className="modal_list">
                <div className="list_title">退票类型</div>
                <div className="list_input">
                  <Select
                    labelInValue
                    onChange={this.modalSelect.bind(this, "refund_type")}
                    value={{ value: String(this.state.modalFrom.refund_type) }}
                  >
                    <Option value="1">自愿</Option>
                    <Option value="2">非自愿</Option>
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
            </div>

            <div className="modal_box" style={{ marginBottom: "5px" }}>
              <div className="modal_list">
                <div className="list_title">舱位代码</div>
                <div className="list_input">
                  <Input
                    placeholder="请输入"
                    allowClear
                    onChange={this.modalInput.bind(this, "cabin_code")}
                    value={this.state.modalFrom.cabin_code}
                  />
                </div>
              </div>

              <div className="modal_list">
                <div className="list_title">是否换编</div>
                <div className="list_input">
                  <Select
                    labelInValue
                    onChange={this.modalSelect.bind(this, "is_change_pnr")}
                    value={{
                      value: String(this.state.modalFrom.is_change_pnr),
                    }}
                  >
                    <Option value="true">是</Option>
                    <Option value="false">否</Option>
                  </Select>
                </div>
              </div>

              <div className="modal_list">
                <div className="list_title">销售渠道</div>
                <div className="list_input">
                  <Input
                    placeholder="请输入"
                    allowClear
                    onChange={this.modalInput.bind(this, "sales_channel_code")}
                    value={this.state.modalFrom.sales_channel_code}
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
        </Modal>
      </div>
    );
  }
}
