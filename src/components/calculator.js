/*
 * @Description:
 * @Author: wish.WuJunLong
 * @Date: 2020-11-24 16:23:26
 * @LastEditTime: 2020-11-24 16:27:27
 * @LastEditors: wish.WuJunLong
 */
import React, { Component } from "react";

import { Popconfirm,Input,Button } from "antd";

// 引用样式
import "./calculator.scss";

export default class calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toolFrom: {}, // 金额计算器
    };
  }
  // 计算器输入
  toolInput = (label, e) => {
    let data = this.state.toolFrom;
    data[label] = e.target.value;
    this.setState({
      toolFrom: data,
    });
  };

  // 精度处理
  NumberMul = (arg1, arg2) => {
    let m = 0;
    let s1 = arg1.toString();
    let s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length;
    } catch (e) {}
    try {
      m += s2.split(".")[1].length;
    } catch (e) {}

    return (
      (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
      Math.pow(10, m)
    );
  };

  // 金额计算
  submitTool = () => {
    let data = JSON.parse(JSON.stringify(this.state.toolFrom));
    data["day"] = Number(data["day"] || 0);
    data["hour"] = Number(data["hour"] || 0);
    data["minute"] = Number(data["minute"] || 0);

    console.log(data);

    data["total"] =
      this.NumberMul(data.day, 1440) +
      this.NumberMul(data.hour, 60) +
      data.minute;

    this.setState({
      toolFrom: data,
    });
  };
  render() {
    return (
      <div className="tool_box">
        <Popconfirm
          overlayClassName="tool_input"
          placement="right"
          icon={false}
          title={() => (
            <>
              <div className="tool_main">
                <p>点击计算后将输入的天、时、分自动计算为分钟数(支持小数点)</p>
                <p>
                  <Input
                    placeholder="天"
                    type="number"
                    onChange={this.toolInput.bind(this, "day")}
                  />
                  天
                </p>
                <p>
                  <Input
                    placeholder="小时"
                    type="number"
                    onChange={this.toolInput.bind(this, "hour")}
                  />
                  时
                </p>
                <p>
                  <Input
                    placeholder="分"
                    type="number"
                    onChange={this.toolInput.bind(this, "minute")}
                  />
                  分
                </p>
                <p>
                  <span>
                    {this.state.toolFrom.total
                      ? this.state.toolFrom.total + "分钟"
                      : ""}
                  </span>
                  <Button type="primary" size="small" onClick={this.submitTool}>
                    计算
                  </Button>
                </p>
              </div>
            </>
          )}
        >
          <a href="#">取位时间计算器</a>
        </Popconfirm>
      </div>
    );
  }
}
