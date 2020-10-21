/*
 * @Description: 
 * @Author: mazhengrong
 * @Date: 2020-10-12 18:15:28
 * @LastEditTime: 2020-10-15 17:56:37
 * @LastEditors: mazhengrong
 */
import  React,{ Component } from 'react'
import { message } from 'antd';
// 引用样式
import './header.scss'

import { Link  } from 'react-router-dom';

const info = () => {
    message.info('功能开发中');
};


export default class Header extends Component {
    componentDidMount() {
    }
    constructor(props) {
        super(props);
        this.state = {
        }
      }
      getPathname ()  {
        console.log(this.props.location.pathname);
        }
    render() {
        return (
            <div className="title">
                
                <div className="title_logo">
                    <img src={require("../static/title_logo.png")} alt=""/>
                </div>
                <Link className="title_list" to="/">
                    <div className="title_icon">
                        <img src={require("../static/title_list.png")} alt=""/>
                    </div>
                    <div className="title_content">取位列表</div>
                </Link>
                <div className="title_list" onClick={info}>
                    <div className="title_icon">
                        <img src={require("../static/key_in.png")} alt=""/>
                    </div>
                    <div className="title_content">手工取位</div>
                </div>
                <Link className="title_list" to="/rule" >
                    <div className="title_icon">
                        <img src={require("../static/title_rule.png")} alt=""/>
                    </div>
                    <div className="title_content">取位规则</div>
                </Link>   
                
            </div>
        )
    }
}
