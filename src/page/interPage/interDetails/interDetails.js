/*
 * @Description: 国际取位详情
 * @Author: wish.WuJunLong
 * @Date: 2020-11-19 10:41:17
 * @LastEditTime: 2020-11-19 15:14:53
 * @LastEditors: wish.WuJunLong
 */
import React, { Component } from "react";

import axios from "@/api/api";

import "./interDetails.scss";

import { Table, message } from "antd";

const { Column } = Table;

export default class interDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailsData: {},
      logsData: [], // 处理日志列表
    };
  }
  async componentDidMount() {
    await this.setState({
      detailsData: this.props.detailData,
    });
    console.log(this.props.detailData);

    await this.getLogsData();
  }

  // 获取操作日志列表
  getLogsData() {
    let data = {
      key_id: this.state.detailsData.key_id,
      type: 2,
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
      <div className="inter_detail">
        <div className="detail_title">基本信息</div>

        <div className="details_main base_message">
          <div className="base_list">
            <div className="list_title">订单号：</div>
            <div className="list_message" style={{ fontWeight: "bold" }}>
              {this.state.detailsData.order_no}
            </div>
          </div>

          <div className="base_list">
            <div className="list_title">编码：</div>
            <div className="list_message" style={{ color: "#FF0000" }}>
              {this.state.detailsData.pnr_code}
            </div>
          </div>

          <div className="base_list">
            <div className="list_title">票号：</div>
            <div className="list_message">
              {this.state.detailsData.ticket_no}
            </div>
          </div>

          <div className="base_list">
            <div className="list_title">是否换编：</div>
            <div className="list_message">
              {this.state.detailsData.is_change_pnr ? "是" : "否"}
            </div>
          </div>

          <div className="base_list">
            <div className="list_title">GDS系统：</div>
            <div className="list_message">{}</div>
          </div>

          <div className="base_list">
            <div className="list_title">票证类型：</div>
            <div className="list_message">
              {this.state.detailsData.ticket_type}
            </div>
          </div>

          <div className="base_list">
            <div className="list_title">是否自愿：</div>
            <div className="list_message">
              {this.state.detailsData.refund_type === 1
                ? "自愿"
                : this.state.detailsData.refund_type === 2
                ? "非自愿"
                : ""}
            </div>
          </div>

          <div className="base_list">
            <div className="list_title">编码状态：</div>
            <div className="list_message">
              {this.state.detailsData.pnr_state}
            </div>
          </div>

          <div className="base_list">
            <div className="list_title">OfficeNo：</div>
            <div className="list_message">
              {this.state.detailsData.office_no}
            </div>
          </div>

          <div className="base_list">
            <div className="list_title">是否部分退票：</div>
            <div className="list_message">
              {this.state.detailsData.is_part_refund ? "是" : "否"}
            </div>
          </div>

          <div className="base_list">
            <div className="list_title">采购退票费：</div>
            <div className="list_message">
              {this.state.detailsData.refund_fee}
            </div>
          </div>
        </div>

        <div className="detail_title">航程信息</div>
        <div className="details_main ticket_info">
          <div className="info_tag">
            {this.state.detailsData.order_no === "OW" ? "单程" : "往返"}
          </div>
          <div className="info_date">
            {this.$moment(this.state.detailsData.fly_time).format(
              "YYYY-MM-DD HH:mm"
            )}
          </div>
          <div className="info_address">
            【{this.state.detailsData.from_airport}】 - 【
            {this.state.detailsData.to_airport}】
          </div>
          <div className="info_message">
            <span>航班号：</span>
            {this.state.detailsData.flight_no}
          </div>
          <div className="info_message">
            <span>舱位：</span>
            {this.state.detailsData.cabin_code}
          </div>
        </div>

        <div className="detail_title">部门信息</div>
        <div className="details_main group_message">
          <div className="message_list">
            <div className="list_title">出票部门：</div>
            <div className="list_message">
              {this.state.detailsData.issue_dept_name}
            </div>
          </div>
          <div className="message_list">
            <div className="list_title">退票部门：</div>
            <div className="list_message">
              {this.state.detailsData.refund_dept_name}
            </div>
          </div>
          <div className="message_list">
            <div className="list_title">采购部门：</div>
            <div className="list_message">
              {this.state.detailsData.buy_channels_name}
            </div>
          </div>
        </div>

        <div className="detail_title">操作信息</div>
        <div className="details_main option_message">
          <div className="message_list">
            <div className="list_item">
              <div className="item_title">执行状态：</div>
              <div className="item_message">
                <div
                  style={{
                    color:
                      this.state.detailsData.exec_state === 0
                        ? "#0070E2"
                        : this.state.detailsData.exec_state === 1
                        ? "#5AB957"
                        : this.state.detailsData.exec_state === 3
                        ? "#5AB957"
                        : this.state.detailsData.exec_state === 4
                        ? "#999999"
                        : this.state.detailsData.exec_state === -1
                        ? "#FF0000"
                        : "",
                  }}
                >
                  {this.state.detailsData.exec_state === 0
                    ? "待取位"
                    : this.state.detailsData.exec_state === 1
                    ? "已取位"
                    : this.state.detailsData.exec_state === 3
                    ? "已退票"
                    : this.state.detailsData.exec_state === 4
                    ? "无需取位"
                    : this.state.detailsData.exec_state === -1
                    ? "取消失败"
                    : ""}
                </div>
              </div>
            </div>
            <div className="list_item">
              <div className="item_title">执行信息：</div>
              <div className="item_message">
                {this.state.detailsData.exec_msg}
              </div>
            </div>
          </div>

          <div className="message_list">
            <div className="list_item">
              <div className="item_title">导入时间：</div>
              <div className="item_message">
                {this.$moment(this.state.detailsData.import_time).format(
                  "YYYY-MM-DD HH:mm"
                )}
              </div>
            </div>
            <div className="list_item">
              <div className="item_title">执行时间：</div>
              <div className="item_message">
                {this.$moment(this.state.detailsData.exec_time).format(
                  "YYYY-MM-DD HH:mm"
                )}
              </div>
            </div>
            <div className="list_item">
              <div className="item_title">预计下次执行时间：</div>
              <div className="item_message">
                {this.$moment(this.state.detailsData.next_exec_time).format(
                  "YYYY-MM-DD HH:mm"
                )}
              </div>
            </div>
          </div>

          <div className="message_list">
            <div className="list_item">
              <div className="item_title">是否航变：</div>
              <div className="item_message">
                {this.state.detailsData.is_flight_changes ? "是" : "否"}
              </div>
            </div>
            <div className="list_item">
              <div className="item_title">航变信息：</div>
              <div className="item_message">
                {this.state.detailsData.flight_changes_msg}
              </div>
            </div>
          </div>
        </div>

        <div className="from">
          <Table
            size="small"
            dataSource={this.state.logsData}
            pagination={false}
            scroll={{ y: 240 }}
            rowKey="key_id"
            bordered
          >
            <Column
              title="操作者"
              dataIndex="creator"
              // render={(text) => (
              //   <>{text === 0 ? "取位" : text === 1 ? "退票" : text}</>
              // )}
            />
            <Column
              title="操作时间"
              dataIndex="create_time"
            />
            <Column
              title="日志内容"
              dataIndex="content"
            />
          </Table>
        </div>
      </div>
    );
  }
}
