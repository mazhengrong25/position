/*
 * @Description: 公用头部 - 退票部门列表
 * @Author: wish.WuJunLong
 * @Date: 2020-12-02 11:20:29
 * @LastEditTime: 2020-12-02 14:08:45
 * @LastEditors: wish.WuJunLong
 */

import React, { Component } from "react";

import "./headerTitle.scss";

import axios from "@/api/api";
import { TreeSelect } from "antd";

const { TreeNode } = TreeSelect;

export default class headerTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultDep: "", // 退票部门默认值
      depList: [], // 退票部门列表
    };
  }

  // 获取退票部门列表
  getDepList() {
    axios.get("api/pnr/GetRefundDepts").then((res) => {
      if (res.data.status === 0) {
        this.setState({
          depList: res.data.datas,
        });
      }
    });
  }
  // 切换选中退票部门
  editDepSelect = async(e) => {
    await this.setState({
      defaultDep: e,
    });
    await this.props.headerSelect(e);
  }
  componentDidMount() {
    this.getDepList();
  }
  render() {
    return (
      <div className="header_title">
        <div className="title_message">{this.props.titleName}</div>

        <div className="title_dept">
          <TreeSelect
            showSearch
            style={{ width: "100%" }}
            value={this.state.defaultDep}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            onChange={this.editDepSelect}
            treeNodeFilterProp="title"
          >
            <TreeNode value="" title="全部退票部门"></TreeNode>
            {this.state.depList.map((item) => (
              <TreeNode value={item.code} title={item.name} key={item.code}>
                {item.subsetList &&
                  item.subsetList.map((oitem) => (
                    <TreeNode
                      value={oitem.code}
                      title={oitem.name}
                      key={oitem.code}
                    ></TreeNode>
                  ))}
              </TreeNode>
            ))}
          </TreeSelect>
        </div>
      </div>
    );
  }
}
