/*
 * @Description: 
 * @Author: mazhengrong
 * @Date: 2020-10-15 11:40:14
 * @LastEditTime: 2020-10-15 18:13:39
 * @LastEditors: mazhengrong
 */
import  React,{ Component } from 'react'
import Axios from 'axios'

import {  Table  } from 'antd';

// 引用样式
import './detail.scss'

const renderContent = function (value, row, index) {
    const obj = {
      children: value,
      props: {},
    };
    return obj;
};
const columns = [{
    title: '操作者',
    dataIndex: 'name',
    render: renderContent,
  }, {
    title: '操作时间',
    coldiv: 2,
    dataIndex: 'time',
  }, {
    title: '日志内容',
    dataIndex: 'con',
    render: renderContent,
  }

];
const data = [];
  for (let i = 1; i < 4; i++) {
    data.push({
      key: i,
      name: `易烊千玺`, //编号
      time: `2020-10-20 13:23:00`,
      con: `这里是内容这里是内容这里是内容这里是内容这里是内容，这里是内容这里是内容`
    });
  }

export default class Detail extends Component{

    componentDidMount() {
        let data = {
            mock_key:'',
        };
        Axios.post('/api/pnr/getcancelrecord',data)
        .then(res => {
            console.log(res)
        })
        .catch(err =>{
            console.log(err)
        })
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
                        <div className="number_weight">5000202006241509412697348000000014</div>
                        <div className="name">编码:</div>
                        <div className="number_color">ODKPER</div>
                        <div className="name">票号:</div>
                        <div className="number">8865457746996</div>
                        <div className="name">订单类型:</div>
                        <div className="number">国内</div>
                        <div className="name">GDS系统:</div>
                        <div className="number">1E:TravelSky </div>
                        <div className="name">票证类型:</div>
                        <div className="number">BOP </div>
                        <div className="name">是否自愿:</div>
                        <div className="number">自愿 </div>
                        <div className="name">编码状态:</div>
                        <div className="number">HN </div>
                        <div className="name">OfficeNo:</div>
                        <div className="number">HN </div>
                    </div>
                    <div className="nav">
                        <div className="tags"></div>
                        <div className="text">航程信息</div>
                    </div>
                    <div className="flight">
                        <div className="flight_type">单程</div>
                        <div className="segment">
                            <div className="segment_time">
                                <div className="time_small">07:25</div>
                                <div className="time_big">(2020-06-28)</div>
                            </div>
                            <div className="time_middle">重庆江北国际机场</div>
                        </div>
                        <div className="logo">
                            <img src={require("../static/direction.png")} alt=""/>
                        </div>
                        <div className="segment">
                            <div className="segment_time">
                                <div className="time_small">09:40</div>
                                <div className="time_big">(2020-06-28)</div>
                            </div>
                            <div className="time_middle">深圳宝安国际机场</div>
                        </div>
                        <div className="name">航班号:</div>
                        <div className="number">CA1589</div>
                        <div className="name">舱位:</div>
                        <div className="number">经济舱</div>
                    </div>
                    <div className="nav">
                        <div className="tags"></div>
                        <div className="text">部门信息</div>
                    </div>
                    <div className="level">
                        <div className="name">出票部门:</div>
                        <div className="number">国内市场部</div>
                        <div className="name">退票部门:</div>
                        <div className="number">国内市场部</div>
                        <div className="name">采购部门:</div>
                        <div className="number">国内市场部</div>
                    </div>
                    <div className="nav">
                        <div className="tags"></div>
                        <div className="text">操作信息</div>
                    </div>
                    <div className="level">
                        <div className="name">执行状态:</div>
                        <div className="number_green">已取位</div>
                        <div className="name">执行消息:</div>
                        <div className="number">在2020-10-20 13:23:00的时候进行取位</div>
                        <div className="name">导入时间:</div>
                        <div className="number">2020-10-20 12:45</div>
                        <div className="name">执行时间:</div>
                        <div className="number">2020-10-20 12:45</div>
                        <div className="name">预订下次执行时间:</div>
                        <div className="number">2020-10-20 12:45</div>
                        <div className="name">延误消息:</div>
                        <div className="number">这里是消息内容</div>
                    </div>
                    <div className="nav">
                        <div className="tags"></div>
                        <div className="text">处理日志</div>
                    </div>

                    <div className="from">
                        <Table columns={columns} dataSource={data} bordered />
                    </div>
                    
                    
                </div>
        )
    }
}