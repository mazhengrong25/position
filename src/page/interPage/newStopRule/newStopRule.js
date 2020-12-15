/*
 * @Author: your name
 * @Date: 2020-12-15 15:55:42
 * @LastEditTime: 2020-12-15 18:28:17
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
    // Modal,
    // Switch,
    Pagination,
    message
} from "antd";


  
const { Column } = Table;

const { Option } = Select;

// const { TextArea } = Input;

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

        axios.post("/api/DomcStopRules/GetPage",data).then((res => {

            if (res.data.status !== 0) {
                message.warning(res.data.message);
            }
            data.page_no = res.data.page_no;
            data.total_count = res.data.total_count;
            this.setState({
                dataList: res.data.datas,
                searchFrom: data,
      });
            
        }))
    }
  

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
                  
                >
                  <Option value="0">自愿</Option>
                  <Option value="1">非自愿</Option>
                </Select>
              </div>
            </div>

            <div className="search_list">
              <div className="list_name">航空公司</div>
              <div className="list_input">
                <Input
                  allowClear
                  placeholder="如：CA"
                  
                />
              </div>
            </div>
  
            <div className="search_list">
              <div className="list_name">舱位</div>
              <div className="list_input">
                <Input
                  allowClear
                  placeholder="如：M"
                 
                />
              </div>
            </div>

            <div className="search_list">
              <div className="list_name">票证类型</div>
              <div className="list_input">
                <Input
                  allowClear
                  placeholder="如：BOP"
                 
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
                  
                >
                  <Option value="0">已换编</Option>
                  <Option value="1">未换编</Option>
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
                  
                >
                  <Option value="1">不可转非自愿</Option>
                  <Option value="0">可转非自愿</Option>
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
                  
                >
                  <Option value="2">否</Option>
                  <Option value="1">是</Option>
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
                  
                >
                  <Option value="2">否</Option>
                  <Option value="1">是</Option>
                </Select>
              </div>
            </div>
  
            <div className="search_list">
              <Button
                className="search_btn"
                type="primary"
               
              >
                搜索
              </Button>
            </div>
          </div>
  
          <div className="tool_box">
            <Button >+新增</Button>
            <Button >批量启用</Button>
            <Button >批量停用</Button>
            <Button >批量删除</Button>
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
                    // onClick={() => this.tableOption(record)}
                  >
                    修改
                  </div>
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
              <Column title="票证类型" dataIndex="cabin_code" />
              <Column
                title="是否换编"
                dataIndex="is_change_pnr"
                render={(text) => <>{text ? "是" : "否"}</>}
              />
              <Column title="退票费判断设置" dataIndex="sales_channel_code" />
              <Column title="Office号" dataIndex="sales_channel_code" />
              <Column title="可转非自愿" dataIndex="sales_channel_code" />
              <Column title="提交模式" dataIndex="sales_channel_code" />
  
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
                // onChange={this.changePage}
              />
              <div className="datas_total">
                共 <span>{this.state.searchFrom.total_count}</span> 条记录
              </div>
            </div>
          </div>
  
        </div>
      );
    }
  }