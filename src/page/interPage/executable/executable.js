/*
 * @Description: 国际取位 - 可执行取位规则
 * @Author: wish.WuJunLong
 * @Date: 2020-11-16 17:10:12
 * @LastEditTime: 2020-11-20 10:29:39
 * @LastEditors: wish.WuJunLong
 */
import React, { Component } from "react";

import "./executable.scss";
import axios from "@/api/api";

import { Select, Button, Input, Table, message, Modal, Switch, Pagination } from "antd";

const { Column } = Table;

const { Option } = Select;

const { TextArea } = Input;

export default class executable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [], // 可执行取位列表
      pageNumber: 1, // 当前分页下标
      pageTotal: 0, // 数据总条数
      pageSize: 10, // 每页数据条数

      keyID: '0', // 

      searchFrom: {
        data_type: null,
        refund_type: null,
        config_state: null,
        airline_code: "",
        cabin_code: "",
        departure_code: "",
        arrival_code: "",
      }, // 筛选数据

      selectedRowKeys: [], // 表格多选

      modalType: "新增", // 弹窗状态
      executableModal: false, //  新增\编辑弹窗
      modalFrom: {}, // 新增\编辑弹窗数据

      submitLoading: false, // 弹窗提交加载状态
    };
  }

  async componentDidMount() {
    await this.setState({
      keyID: this.props.history.location.search.split("=").pop() || '0',
    });
    await this.getData();
  }


  // 获取可执行取位列表
  getData() {
    let data = JSON.parse(JSON.stringify(this.state.searchFrom));
    data.data_type = data.data_type !== null ? Number(data.data_type) : null;
    data.refund_type =
      data.refund_type !== null ? Number(data.refund_type) : null;
    data.config_state =
      data.config_state !== null ? Number(data.config_state) : null;
    data["page_no"] = this.state.pageNumber;
    data["page_size"] = this.state.pageSize;
    data["key_id"] = this.state.keyID;

    axios.post("/api/IntlNeedRule/getpage", data).then((res) => {
      if (res.data.status !== 0) {
        message.warning(res.data.message);
      }
      this.setState({
        dataList: res.data.datas,
        pageNumber: Number(res.data.page_no),
        pageTotal: Number(res.data.total_count),
      });
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

  // 导航栏搜索
  searchBtn() {
    console.log(this.state.searchFrom);
  }

  // 表格多选
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  // 表格分页器
  changePage = async (page, size) => {
    await this.setState({
      pageNumber: page,
      pageSize: size,
    });
    await this.getData();
  };

  // 分页器样式
  itemRender(current, type, originalElement) {
    if (type === 'prev') {
      return <p>上一页</p>;
    }
    if (type === 'next') {
      return <p>下一页</p>;
    }
    return originalElement;
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
    this.setExecutableData(data);
  }

  // 可执行取位规则操作接口
  setExecutableData(data) {
    axios.post("api/IntlNeedRule/set", data).then((res) => {
      if (res.data.status === 0) {
        message.success(res.data.message);
        this.getData();
        this.setState({
          executableModal: false
        })
      } else {
        message.warning(res.data.message);
      }
      this.setState({
        submitLoading: false
      })
    });
  }

  // 打开新增规则弹窗
  openAddModal() {
    let data = {
      data_type: "0",
      refund_type: "0",
      airline_code: "",
      cabin_code: "",
      departure_mode: "0",
      departure_code: "",
      arrival_mode: "0",
      arrival_code: "",
      cancel_of_change: "",
      include_refund_fee: "-1",
      begin_refund_fee: "",
      end_refund_fee: "",
      cancel_mode: "1",
      earliest_limit: "",
      execute_limit: "",
      latest_limit: "",
      suspend_type: "0",
      config_state: 2,
      remarks: "",
    };
    this.setState({
      executableModal: true,
      modalFrom: data,
      modalType: "新增",
    });
  }

  // 打开修改规则弹窗
  tableOption(val) {
    console.log(val);
    this.setState({
      executableModal: true,
      modalFrom: JSON.parse(JSON.stringify(val)),
      modalType: "修改",
    });
  }

  // 弹窗选择器数据回调
  modalSelect = (label, val) => {
    let data = this.state.modalFrom;
    data[label] = val ? val.value : null;

    if(label === 'cancel_mode' && val.value ===  '1'){
      data['earliest_limit'] = ""
      data['execute_limit'] = ""
      data['latest_limit'] = ""
    }
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
  changeSwitch = (val) =>{
    console.log(val)
    let data = this.state.modalFrom;
    data.config_state = val? 2: 1;
    this.setState({
      modalFrom: data,
    });
  }

  // 弹窗提交按钮
  submitBtn = () => {
    this.setState({
      submitLoading: true
    })

    let newData = JSON.parse(JSON.stringify(this.state.modalFrom))

    newData.data_type = Number(newData.data_type)
    newData.refund_type = Number(newData.refund_type)
    newData.departure_mode = Number(newData.departure_mode)
    newData.arrival_mode = Number(newData.arrival_mode)
    newData.include_refund_fee = Number(newData.include_refund_fee)
    newData.cancel_mode = Number(newData.cancel_mode)
    newData.cancel_of_change = Number(newData.cancel_of_change)
    newData.begin_refund_fee = Number(newData.begin_refund_fee)
    newData.end_refund_fee = Number(newData.end_refund_fee)
    newData.earliest_limit = Number(newData.earliest_limit)
    newData.execute_limit = Number(newData.execute_limit)
    newData.latest_limit = Number(newData.latest_limit)
    newData.suspend_type = Number(newData.suspend_type)

    let data = {
      action_code: this.state.modalType === '新增'?'add':'update',
      rules: [newData],
    };
    this.setExecutableData(data);
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className="executable">
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
            <div className="list_name">出发地</div>
            <div className="list_input">
              <Input
                allowClear
                placeholder="如：CKG"
                onChange={this.headInput.bind(this, "departure_code")}
              />
            </div>
          </div>

          <div className="search_list">
            <div className="list_name">到达地</div>
            <div className="list_input">
              <Input
                allowClear
                placeholder="如：PEK"
                onChange={this.headInput.bind(this, "arrival_code")}
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
            <Column title="出发地" dataIndex="departure_code" />
            <Column title="到达地" dataIndex="arrival_code" />
            <Column
              title="航变差大于"
              dataIndex="cancel_of_change"
              render={(text) => <>{text === 0 ? "不受影响" : text + "分钟"}</>}
            />
            <Column
              title="退票费区间"
              render={(text, record) => (
                <>{record.begin_refund_fee + " - " + record.end_refund_fee}</>
              )}
            />
            <Column
              title="取位模式"
              dataIndex="cancel_mode"
              render={(text) => (
                <>
                  {text === 1 ? "直接取消" : text === 2 ? "按时限取消" : text}
                </>
              )}
            />
            <Column title="最早取位时限" dataIndex="earliest_limit" />
            <Column title="实际取位时限" dataIndex="execute_limit" />
            <Column title="最晚取位时限" dataIndex="latest_limit" />
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
          <Pagination
            current={this.state.pageNumber}
            pageSize={this.state.pageSize}
            total={this.state.pageTotal}
            onChange={this.changePage}
            itemRender={this.itemRender}
          />
        </div>

        <Modal
          title={this.state.modalType + "规则"}
          visible={this.state.executableModal}
          onOk={this.submitBtn}
          onCancel={() => this.setState({ executableModal: false })}
          width="880px"
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
              <div className="modal_list">
                <div className="list_title">挂起类型</div>
                <div className="list_input">
                  <Select
                    labelInValue
                    onChange={this.modalSelect.bind(this, "suspend_type")}
                    value={{ value: String(this.state.modalFrom.suspend_type) }}
                  >
                    <Option value="0">不挂起</Option>
                    <Option value="1">取位前挂起</Option>
                    <Option value="2">取位后挂起</Option>
                  </Select>
                </div>
              </div>
              <div className="modal_list">
              <div className="list_title"></div>
                <div className="list_input"></div>
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
                    <Option value="0">不限</Option>
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
                <div className="list_title">出发地模式</div>
                <div className="list_input">
                  <Select
                    labelInValue
                    onChange={this.modalSelect.bind(this, "departure_mode")}
                    value={{
                      value: String(this.state.modalFrom.departure_mode),
                    }}
                  >
                    <Option value="0">所有</Option>
                    <Option value="1">机场</Option>
                    <Option value="2">城市</Option>
                    <Option value="3">国家</Option>
                  </Select>
                </div>
              </div>

              <div className="modal_list">
                <div className="list_title">到达地模式</div>
                <div className="list_input">
                  <Select
                    labelInValue
                    onChange={this.modalSelect.bind(this, "arrival_mode")}
                    value={{ value: String(this.state.modalFrom.arrival_mode) }}
                  >
                    <Option value="0">所有</Option>
                    <Option value="1">机场</Option>
                    <Option value="2">城市</Option>
                    <Option value="3">国家</Option>
                  </Select>
                </div>
              </div>
            </div>

            <div
              className="modal_box input_air_address"
              style={{
                height:
                  String(this.state.modalFrom.departure_mode) !== "0" ||
                  String(this.state.modalFrom.arrival_mode) !== "0"
                    ? "96px"
                    : "",
              }}
            >
              <div
                className="address_input dep_address"
                style={{
                  display:
                    String(this.state.modalFrom.departure_mode) === "0" ? "none" : "",
                }}
              >
                <TextArea
                  rows={4}
                  placeholder="请输入"
                  allowClear
                  onChange={this.modalInput.bind(this, "departure_code")}
                  value={this.state.modalFrom.departure_code}
                />
              </div>
              <div
                className="address_input arr_address"
                style={{
                  display:
                    String(this.state.modalFrom.arrival_mode) === "0" ? "none" : "",
                }}
              >
                <TextArea
                  rows={4}
                  placeholder="请输入"
                  allowClear
                  onChange={this.modalInput.bind(this, "arrival_code")}
                  value={this.state.modalFrom.arrival_code}
                />
              </div>
            </div>

            <div className="modal_box">
              <div className="modal_list">
                <div className="list_title">航变差大于</div>
                <div className="list_input">
                  <Input
                    placeholder="请输入"
                    allowClear
                    onChange={this.modalInput.bind(this, "cancel_of_change")}
                    value={this.state.modalFrom.cancel_of_change}
                  />
                </div>
              </div>

              <div className="modal_list">
                <div className="list_title">
                  <Select
                    labelInValue
                    onChange={this.modalSelect.bind(this, "include_refund_fee")}
                    value={{
                      value: String(this.state.modalFrom.include_refund_fee),
                    }}
                  >
                    <Option value="-1">不限</Option>
                    <Option value="0">不含退票费</Option>
                    <Option value="1">包含退票费</Option>
                  </Select>
                </div>
                <div className="list_input refund_fee_input">
                  <Input
                    placeholder="0"
                    allowClear
                    onChange={this.modalInput.bind(this, "begin_refund_fee")}
                    value={this.state.modalFrom.begin_refund_fee}
                  />
                  <p>-</p>
                  <Input
                    placeholder="0"
                    allowClear
                    onChange={this.modalInput.bind(this, "end_refund_fee")}
                    value={this.state.modalFrom.end_refund_fee}
                  />
                </div>
              </div>

              <div className="modal_list">
                <div className="list_title">取位模式</div>
                <div className="list_input">
                  <Select
                    labelInValue
                    onChange={this.modalSelect.bind(this, "cancel_mode")}
                    value={{ value: String(this.state.modalFrom.cancel_mode) }}
                  >
                    <Option value="1">直接取消</Option>
                    <Option value="2">按时限取消</Option>
                  </Select>
                </div>
              </div>
            </div>

            <div className="modal_box" style={{display: this.state.modalFrom.cancel_mode === '1'?'none':''}}>
              <div className="modal_list">
                <div className="list_title">最早取位</div>
                <div className="list_input">
                  <Input
                    placeholder="单位分钟"
                    allowClear
                    onChange={this.modalInput.bind(this, "earliest_limit")}
                    value={this.state.modalFrom.earliest_limit}
                  />
                </div>
              </div>

              <div className="modal_list">
                <div className="list_title">实际取位</div>
                <div className="list_input">
                  <Input
                    placeholder="单位分钟"
                    allowClear
                    onChange={this.modalInput.bind(this, "execute_limit")}
                    value={this.state.modalFrom.execute_limit}
                  />
                </div>
              </div>

              <div className="modal_list">
                <div className="list_title">最晚取位</div>
                <div className="list_input">
                  <Input
                    placeholder="单位分钟"
                    allowClear
                    onChange={this.modalInput.bind(this, "latest_limit")}
                    value={this.state.modalFrom.latest_limit}
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
