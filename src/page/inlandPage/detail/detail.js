/*
 * @Description:
 * @Author: mazhengrong
 * @Date: 2020-10-15 11:40:14
 * @LastEditTime: 2020-12-23 15:25:24
 * @LastEditors: Please set LastEditors
 */
import React, { Component } from "react";

import axios from "@/api/api";

import { message, Table } from "antd";

// 引用样式
import "./detail.scss";

import moment from "moment";

const columns = [
  {
    title: "操作者",
    dataIndex: "creator",
  },
  {
    title: "操作时间",
    dataIndex: "create_time",
  },
  {
    title: "日志内容",
    dataIndex: "content",
  },
];

export default class Detail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logsData: [], //详情中的表格
      detailsData: {}, 
      style: {
        background: "rgba(243, 218, 188, .8)",
        color: "#FB9826",
      },
      blue: { color: "#0070E2" },
      red: { color: "#FF0000" },
      gray: { color: "#999999" },
    };
  }

  

  async componentDidMount() {
    await this.setState({
      detailsData: this.props.details,
    });
    
    await this.getDataList(this.props.details);
  }

  // 获取操作日志列表
  getDataList(val) {
    let data = {
      key_id: val.key_id,
      type: 1
    };
    axios.post("/api/pnr/getcancelrecord", data).then((res) => {
      if (res.data.status === 0) {
        this.setState({
          logsData: res.data.datas,
        });
      } else {
        message.warning(res.data.message);
      }
    });
  }

  render() {
    return (
      <div className="content">
        {/* 导航栏 */}
        <div className="nav">
          <div className="tags"></div>
          <div className="text">基本信息</div>
        </div>
        <div className="level">
          <div className="name">订单号:</div>
          <div className="number_weight">{this.state.detailsData.order_no}</div>
          <div className="name">编码:</div>
          <div className="number_color">{this.state.detailsData.pnr_code}</div>
          <div className="name">票号:</div>
          <div className="number">{this.state.detailsData.ticket_no}</div>
          <div className="name">订单类型:</div>
          <div className="number">
            {this.state.detailsData.intl_flag === "true" ? "国际 " : "国内"}
          </div>
          <div className="name">GDS系统:</div>
          <div className="number">{this.state.detailsData.gds_type}</div>
          <div className="name">票证类型:</div>
          <div className="number">{this.state.detailsData.ticket_type} </div>
          <div className="name">是否自愿:</div>
          <div className="number">
            {this.state.detailsData.refund_type === 1
              ? "自愿"
              : this.state.detailsData.refund_type === 2
              ? "非自愿"
              : this.state.detailsData.refund_type === 0
              ? "所有"
              : ""}
          </div>
          <div className="name">编码状态:</div>
          <div className="number">{this.state.detailsData.pnr_state}</div>
          <div className="name">OfficeNo:</div>
          <div className="number">{this.state.detailsData.office_no}</div>
        </div>
        <div className="nav">
          <div className="tags"></div>
          <div className="text">航程信息</div>
        </div>
        <div className="flight">
          <div
            className="flight_type"
            style={
              this.state.detailsData.route_type !== "OW" ? this.state.style : {}
            }
          >
            {this.state.detailsData.route_type === "OW" ? "单程" : "往返"}
          </div>
          <div className="segment">
            <div className="segment_time">
              <div className="time_big">
                {moment(this.state.detailsData.fly_time).format("YYYY-MM-DD")}
              </div>
              <div className="time_small">
                {moment(this.state.detailsData.fly_time).format("HH:mm")}
              </div>
              <div className="time_middle">
                【{this.state.detailsData.from_airport}】 —{" "}
              </div>
              <div className="time_middle">
                【{this.state.detailsData.to_airport}】
              </div>
            </div>
          </div>
          <div className="name">航班号:</div>
          <div className="number">{this.state.detailsData.flight_no}</div>
          <div className="name">舱位:</div>
          <div className="number">{this.state.detailsData.cabin_code}</div>
          <div className="name">乘客类型:</div>
          <div className="number" style={this.state.blue}>{this.state.detailsData.passenger_type === "ADT" ? "成人票"
                                    :this.state.detailsData.passenger_type === "CHD" ? "儿童票"
                                    :this.state.detailsData.passenger_type === "INF" ? "婴儿票" : ""}</div>
          <div className="name">乘客姓名:</div>
          <div className="number">{this.state.detailsData.passenger_name}</div>
        </div>
        <div className="nav">
          <div className="tags"></div>
          <div className="text">部门信息</div>
        </div>
        <div className="level">
          <div className="name">出票部门:</div>
          <div className="number">{this.state.detailsData.issue_dept_name}</div>
          <div className="name">退票部门:</div>
          <div className="number">
            {this.state.detailsData.refund_dept_name}
          </div>
          <div className="name">采购部门:</div>
          <div className="number">
            {this.state.detailsData.buy_channels_name}
          </div>
          <div className="name">渠道名称:</div>
          <div className="number">
            {this.state.detailsData.sales_channels_name}
          </div>
          <div className="name">渠道代码:</div>
          <div className="number">
            {this.state.detailsData.sales_channels_code}
          </div>
        </div>
        <div className="nav">
          <div className="tags"></div>
          <div className="text">操作信息</div>
        </div>
        <div className="level">
          <div className="name">执行状态:</div>
          <div
            className="number_green"
            style={
              this.state.detailsData.exec_state === 0
                ? this.state.blue
                : this.state.detailsData.exec_state === -1
                ? this.state.red
                : this.state.detailsData.exec_state === -2
                ? this.state.red
                : this.state.detailsData.exec_state === -3
                ? this.state.red
                : this.state.detailsData.exec_state === -4
                ? this.state.red
                : this.state.detailsData.exec_state === 4
                ? this.state.gray
                : {}
            }
          >
            {this.state.detailsData.exec_state === 1
              ? "已取位"
              : this.state.detailsData.exec_state === 2
              ? "已航变"
              : this.state.detailsData.exec_state === 3
              ? "已退票"
              : this.state.detailsData.exec_state === 4
              ? "无需取位"
              : this.state.detailsData.exec_state === -1
              ? "取消失败"
              : this.state.detailsData.exec_state === 0
              ? "待取位"
              : this.state.detailsData.exec_state === -2
              ? "无效编码"
              : this.state.detailsData.exec_state === -3
              ? "操作失败"
              : this.state.detailsData.exec_state === -4
              ? "非法操作"
              : ""}
          </div>
          <div className="name">执行消息:</div>
          <div className="number">{this.state.detailsData.exec_msg}</div>
          <div className="name">导入时间:</div>
          <div className="number">{this.state.detailsData.import_time}</div>
          <div className="name">执行时间:</div>
          <div className="number">{this.state.detailsData.exec_time}</div>
          <div className="name">预订下次执行时间:</div>
          <div className="number">{this.state.detailsData.next_exec_time}</div>
          <div className="name">审核时间:</div>
          <div className="number">{this.state.detailsData.audit_time}</div>
        </div>
        <div className="nav">
          <div className="tags"></div>
          <div className="text">处理日志</div>
        </div>

        <div className="from">
          <Table
            size="small"
            columns={columns}
            dataSource={this.state.logsData}
            pagination={false}
            scroll={{ y: 240 }}
            rowKey="key_id"
            bordered
          />
        </div>
      </div>
    );
  }
}
