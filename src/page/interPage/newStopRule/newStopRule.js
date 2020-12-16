/*
 * @Author: mzr
 * @Date: 2020-12-15 15:55:42
 * @LastEditTime: 2020-12-16 18:09:32
 * @LastEditors: Please set LastEditors
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
    Checkbox 
} from "antd";


  
const { Column } = Table;

const { Option } = Select;

const { TextArea } = Input;

const plainOptions = ['起飞前', '起飞后'];

const plainOptionsPoSition = ['已取位','未取位'];

export default class newStopRule extends Component {
    constructor(props) {
      super(props);
      this.state = {

        searchFrom: {
            page_no: 1, //类型：Number  必有字段  备注：页码
            page_size: 10,  //类型：Number  必有字段  备注：每页显示数据条数
            total_count: 0,
            key_id: "0",    //类型：String  可有字段  备注：表id用于取位数据列表关联

            airline_code: "",    //类型：String  可有字段  备注：航司代码
            cabin_code: "",  //类型：String  可有字段  备注：舱位
            is_change_pnr: null,     //类型：Boolean  可有字段  备注：是否换编 true：已换编 false：未换编 null:查询所有
            ticket_type: "", //类型：String  可有字段  备注：票证类型
            is_voluntary:null,  //类型：Boolean  可有字段  备注：是否自愿退票 true:自愿 false:非自愿 null:查询所有
            involuntary_switching:null,   //类型：Boolean  可有字段  备注：是否可转非自愿 true：可转非自愿 false：不可转非自愿 null:查询所有
            flight_category: 0, //类型：Number  可有字段  备注：起飞情况 0：所有 1：起飞前 2：起飞后
            cancel_type: 0,   //类型：Number  可有字段  备注：取位情况 0：所有 1：未取消 2：已消息
            rule_state: 2,     //类型：Number  可有字段  备注：规则状态 1：不可用 2：可用
           
        }, // 筛选数据

        dataList:[], //列表数据

        modalType: "新增", // 弹窗状态
        stopRuleModal: false, //  新增\编辑弹窗
        submitLoading: false, // 弹窗提交加载状态

        modalFrom: {}, // 新增\编辑弹窗数据
        
      };
    }
  
    async componentDidMount() {
      let data = JSON.parse(JSON.stringify(this.state.searchFrom));
      data['key_id'] = this.props.keyId || '0'
      await this.setState({
        searchFrom: data,
      });
      await this.getData();
    }

    // 获取数据
    getData() {

        let data = JSON.parse(JSON.stringify(this.state.searchFrom));
        data.flight_category = data.flight_category !== null ? Number(data.flight_category) : null;
        data.cancel_type = data.cancel_type !== null ? Number(data.cancel_type) : null;
        data.rule_state = data.rule_state !== null ? Number(data.rule_state) : null;
        
        //类型：Boolean  可有字段  备注：是否可转非自愿 
        data.involuntary_switching = 
            data.involuntary_switching !== null 
            ? data.involuntary_switching === '0'
                ? true 
                :false 
            :null; 
            
        //类型：Boolean  可有字段  备注：是否换编
        data.is_change_pnr = 
            data.is_change_pnr !== null 
            ? data.is_change_pnr === '0'
                ? true 
                :false 
            :null;  

        //类型：Boolean  可有字段  备注：是否自愿退票
        data.is_voluntary = 
            data.is_voluntary !== null 
            ? data.is_voluntary === '0'
                ? true 
                :false 
            :null;  

        axios.post("api/DomcStopRules/GetPage",data).then((res => {

            if (res.data.status !== 0) {
                message.warning(res.data.message);
            }
            data.page_no = res.data.data.page_no;
            data.total_count = res.data.data.total_count;
            this.setState({
                dataList: res.data.data.datas,
                searchFrom: data,
            });
            
        }))
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
        // "airline_code":"AA",                //类型：String  必有字段  备注：航司代码
        // "cabin_codes":"mock",                //类型：String  必有字段  备注：舱位集合，多个用“/”隔开
        // "ticket_type":"/BOP/",                //类型：String  必有字段  备注：票证类型集合，多个用“/”隔开
        // "flight_category":0,                //类型：Number  必有字段  备注：起飞情况 0：所有 1：起飞前 2：起飞后
        // "cancel_type":0,                //类型：Number  必有字段  备注：取位情况 0：所有 1：未取消 2：已消息
        // "is_voluntary":true,                //类型：Boolean  必有字段  备注：是否自愿退票 true:自愿 false:非自愿
        // "is_change_pnr":false,                //类型：Boolean  必有字段  备注：是否换编 true：已换编 false：未换编
        // "include_refund_type":0,                //类型：Number  必有字段  备注：退票费判断模式 0：不判断退票费 1：根据退票费判断 2：根据退票费百分比判断
        // "begin_refund_fee":0,                //类型：Number  必有字段  备注：退票费/率开始
        // "end_refund_fee":0,                //类型：Number  必有字段  备注：退票费/率结束
        // "stop_office_no":"mock",                //类型：String  必有字段  备注：无权取位office号，多个用“/”隔开，
        // "involuntary_switching":true,                //类型：Boolean  必有字段  备注：是否可转非自愿 true：可转非自愿 false：不可转非自愿
        // "submit_refund_mode":1,                //类型：Number  必有字段  备注： 提交退票模式 1：直接提交 2：按时限提交
        // "earliest_limit":0,                //类型：Number  必有字段  备注：最早提交时限 (单位：分钟)
        // "execute_limit":0,                //类型：Number  必有字段  备注：实际提交时限 (单位：分钟)
        // "latest_limit":0,                //类型：Number  必有字段  备注：最晚提交时限 (单位：分钟)
        // "after_waiting_time":20,                //类型：Number  必有字段  备注：飞后等待分钟数
        // "rule_state":2,                //类型：Number  必有字段  备注：规则状态 1：不可用 2：可用
        // "remarks":"mock"                //类型：String  必有字段  备注：备注
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

    // 无需取位规则操作接口
    setStopRuleData(data) {
      axios.post("api/DomcStopRules/Set", data).then((res) => {
        
      });
    }

    // 弹窗提交按钮
    submitBtn = () => {
      this.setState({
        submitLoading: true,
      });

      let newData = JSON.parse(JSON.stringify(this.state.modalFrom));

      // newData.data_type = Number(newData.data_type);
      // newData.refund_type = Number(newData.refund_type);
      // newData.is_change_pnr = newData.is_change_pnr === "true";
      // newData.config_state = Number(newData.config_state);

      let data = {
        action_code: this.state.modalType === "新增" ? "add" : "update",
        rules: [newData],
      };
      this.setStopRuleData(data);
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
                  allowClear
                  placeholder="所有"
                  labelInValue
                  onChange={this.headSelect.bind(this, "is_voluntary")}
                >
                  <Option value={0}>所有</Option>
                  <Option value={1}>自愿</Option>
                  <Option value={2}>非自愿</Option>
                </Select>
              </div>
            </div>

            <div className="search_list">
              <div className="list_name">航空公司</div>
              <div className="list_input">
                <Input
                  allowClear
                  placeholder="如：CA"
                  onChange={this.headInput.bind(this, 'airline_code')}
                />
              </div>
            </div>
  
            <div className="search_list">
              <div className="list_name">舱位</div>
              <div className="list_input">
                <Input
                  allowClear
                  placeholder="如：M"
                  onChange={this.headInput.bind(this, 'cabin_code')}
                />
              </div>
            </div>

            <div className="search_list">
              <div className="list_name">票证类型</div>
              <div className="list_input">
                <Input
                  allowClear
                  placeholder="如：BOP"
                  onChange={this.headInput.bind(this, 'ticket_type')}
                />
              </div>
            </div>
  
            <div className="search_list">
              <div className="list_name">是否换编</div>
              <div className="list_input">
                <Select
                  allowClear
                  placeholder="如：CKG"
                  labelInValue
                  onChange={this.headSelect.bind(this, "is_change_pnr")}
                >

                  <Option value={0}>所有</Option>
                  <Option value={1}>已换编</Option>
                  <Option value={2}>未换编</Option>
                </Select>
              </div>
            </div>
  
            
            <div className="search_list">
              <div className="list_name">可转非自愿</div>
              <div className="list_input">
                <Select
                  allowClear
                  placeholder="所有"
                  labelInValue
                  onChange={this.headSelect.bind(this, "involuntary_switching")}
                >
                  <Option value={0}>所有</Option>
                  <Option value={1}>可转非自愿</Option>
                  <Option value={2}>不可转非自愿</Option>
                </Select>
              </div>
            </div>

            <div className="search_list">
              <div className="list_name">起飞情况</div>
              <div className="list_input">
                <Select
                  allowClear
                  placeholder="可多选"
                  labelInValue
                  onChange={this.headSelect.bind(this, "flight_category")}
                >
                  <Option value={0}>所有</Option>
                  <Option value={1}>是</Option>
                  <Option value={2}>否</Option>
                </Select>
              </div>
            </div>

            <div className="search_list">
              <div className="list_name">取位情况</div>
              <div className="list_input">
                <Select
                  allowClear
                  placeholder="可多选"
                  labelInValue
                  onChange={this.headSelect.bind(this, "cancel_type")}
                >
                  <Option value={0}>所有</Option>
                  <Option value={1}>是</Option>
                  <Option value={2}>否</Option>
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
                title="退票类型"
                dataIndex="refund_type"
                render={(text) => <>{text ? "自愿" : "非自愿 "}</>}
              />
              <Column title="航空公司" dataIndex="airline_code" />
              <Column title="舱位代码" dataIndex="cabin_code" />
              <Column title="票证类型" dataIndex="ticket_type" />
              <Column
                title="是否换编"
                dataIndex="whether_change"
                render={(text) => <>{text ? "是" : "否"}</>}
              />
              <Column title="退票费判断设置" dataIndex="judgment_setting" />
              <Column title="Office号" dataIndex="office_no" />
              <Column 
                title="可转非自愿" 
                dataIndex="convertible_involuntary"
                render={(text) => <>{text ? "是" : "否 "}</>}
                />
              <Column title="提交模式" dataIndex="submission_mode" />
  
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
                        defaultChecked={this.state.modalFrom.config_state === 2}
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
                        onChange={this.modalSelect.bind(this, "refund_type")}
                        value={this.state.modalFrom.refund_type}
                      >
                        <Option value={1}>自愿</Option>
                        <Option value={2}>非自愿</Option>
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
                        onChange={this.modalInput.bind(this, "cabin_code")}
                        value={this.state.modalFrom.cabin_code}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal_box">
                  <div className="modal_list">
                    <div className="list_title">起飞情况</div>
                    <div className="list_input">
                      <Checkbox.Group options={plainOptions} defaultValue={['起飞前']} />
                    </div>
                  </div>

                  <div className="modal_list">
                    <div className="list_title">取位情况</div>
                    <div className="list_input">
                      <Checkbox.Group options={plainOptionsPoSition} defaultValue={['已取位']} />
                    </div>
                  </div>

                  <div className="modal_list">
                    <div className="list_title">票证类型</div>
                    <div className="list_input">
                      <Input
                        placeholder="如：M/T/R"
                        allowClear
                        onChange={this.modalInput.bind(this, "ticket_type")}
                        value={this.state.modalFrom.ticket_type}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal_box" style={{ marginBottom: "5px" }}>
                  <div className="modal_list">
                    <div className="list_title">是否换编</div>
                    <div className="list_input">
                      <Select
                        labelInValue
                        onChange={this.modalSelect.bind(this, "whether_change")}
                        value={{ value: this.state.modalFrom.whether_change }}
                      >
                        <Option value={true}>是</Option>
                        <Option value={false}>否</Option>
                      </Select>
                    </div>
                  </div>

                  <div className="modal_list">
                    <div className="list_title">office号</div>
                    <div className="list_input">
                      <Input
                        placeholder="请输入"
                        allowClear
                        onChange={this.modalInput.bind(this, "office_no")}
                        value={this.state.modalFrom.office_no}
                      />
                    </div>
                  </div>
                  
                  <div className="modal_list">
                    <div className="list_title">
                      <Select defaultValue="不判断退票费" style={{ width: 120 }} bordered={false}>
                        <Option value={0}>不判断退票费</Option>
                        <Option value={1}>判断退票费</Option>
                      </Select>
                    </div>
                    <div className="list_input">
                      <Input
                          placeholder="0"
                          allowClear
                          style={{ width : 70 }}
                      /> - 
                      <Input
                          placeholder="0"
                          allowClear
                          style={{ width : 70 }}
                      />
                    </div>
                  </div>
                  
                </div>
                <div className="modal_line"></div>
                <div className="modal_type">执行规则</div>
                <div className="modal_box">
                  <div className="modal_list">
                      <div className="list_title">可转非自愿</div>
                      <div className="list_input">
                        <Select
                          labelInValue
                          onChange={this.modalSelect.bind(this, "convertible_involuntary")}
                          value={this.state.modalFrom.convertible_involuntary}
                        >
                          <Option value={true}>是</Option>
                          <Option value={false}>否</Option>
                        </Select>
                      </div>
                  </div>
                  <div className="modal_list">
                      <div className="list_title">提交模式</div>
                      <div className="list_input">
                        <Select
                          labelInValue
                          onChange={this.modalSelect.bind(this, "submission_mode")}
                          value={{ value: String(this.state.modalFrom.submission_mode) }}
                        >
                          <Option value={true}>提交时限提交</Option>
                          <Option value={false}>提交时限提交</Option>
                        </Select>
                      </div>
                  </div>
                </div>

                <div className="modal_box">
                  <div className="modal_list">
                      <div className="list_title">最早提交</div>
                      <div className="list_input">
                        <Input
                          placeholder="分钟"
                          allowClear
                        />
                      </div>
                  </div>
                  <div className="modal_list">
                      <div className="list_title">实际提交</div>
                      <div className="list_input">
                        <Input
                            placeholder="分钟"
                            allowClear
                        />
                      </div>
                  </div>
                  <div className="modal_list">
                      <div className="list_title">最晚提交</div>
                      <div className="list_input">
                        <Input
                            placeholder="分钟"
                            allowClear
                        />
                      </div>
                  </div>  
                </div>

                <div className="modal_box">
                  <div className="modal_list input_remark">
                    <div className="list_title">备注</div>
                    <div className="list_input">
                      <TextArea
                        rows={1}
                        placeholder="添加备注"
                        allowClear
                  
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