/*
 * @Description: 
 * @Author: mazhengrong
 * @Date: 2020-10-12 18:15:28
 * @LastEditTime: 2020-10-13 14:27:51
 * @LastEditors: mazhengrong
 */
import  React,{ Component } from 'react'
// 引用样式
import './header.scss'


export default class Header extends Component {
    render() {
        return (
            <div className="title">
                <div className="title_logo">
                    <img src={require("../static/title_logo.png")} alt=""/>
                </div>
                <div className="title_list active">
                    <div className="title_icon">
                        <img src={require("../static/title_list.png")} alt=""/>
                    </div>
                    <div className="title_content">取位列表</div>
                </div>
                <div className="title_list">
                    <div className="title_icon">
                        <img src={require("../static/key_in.png")} alt=""/>
                    </div>
                    <div className="title_content">手工取位</div>
                </div>
                <div className="title_list">
                    <div className="title_icon">
                        <img src={require("../static/title_rule.png")} alt=""/>
                    </div>
                    <div className="title_content">取位规则</div>
                </div>   
                
            </div>
        )
    }
}
