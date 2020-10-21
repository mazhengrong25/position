/*
 * @Description:
 * @Author: mazhengrong
 * @Date: 2020-10-12 18:15:28
 * @LastEditTime: 2020-10-21 18:11:04
 * @LastEditors: Please set LastEditors
 */
import React, { Component } from 'react';

import { Radio, Select, Input, Button, Table, Space, Modal, Pagination, Tooltip, Switch, DatePicker, message } from 'antd';

// const { TextArea } = Input;

import Axios from 'axios';
// 引用样式
import './rule.scss';
// 时间处理
import moment from 'moment';

const Option = Select.Option;

// 分页  上一页  下一页
function itemRender(current, type, originalElement) {
  if (type === 'prev') {
    return <p>上一页</p>;
  }
  if (type === 'next') {
    return <p>下一页</p>;
  }
  return originalElement;
}

export default class Rule extends Component {
  componentDidMount() {
      this.setState({
          keyId: this.props.history.location.search.split("=").pop() || 0
      })
      
    this.getToken();
  }


    constructor(props) {
        console.log(props);
        super(props);
        this.state = { 
            data: [],
            modalVisible:false, //模态框
            selectedRowKeys: [], //选中行
            orderType: '国内', //订单类型
            configType: 0, // 配置状态
            executeType: '0', // 执行模式
            cabinType:'', // 舱位模式
            air:'', // 航空公司
            columns: [
                {
                title: '操作',
                dataIndex: 'name',
                key: 'name',
                render: (text, row, index) => {
                
                    return (
                    <div>
                    <Button type="link" onClick={() => this.editModal(row, index)}>修改</Button>
                    </div>
                    );
                },
                
                },
                {
                title: '所属航司',
                dataIndex: 'airline_code',
                key: 'airline_code',
                
                },
                {
                    title: '舱位模式',
                    dataIndex: 'execute_mode',
                    key: 'execute_mode',
                    render: (mode) => {
                        return mode?'适用':'禁止'
                    }
                
                },
                {
                    title: '舱位代码',
                    dataIndex: 'cabin_code',
                    key: 'cabin_code',
                    render: (code) => {
                        return(
                            <Tooltip title={code}>
                            <span className="cabin_code">
                                {code}
                            </span>
                        </Tooltip>
                            
                        )
                    }
                
                },
                {
                    title: '退票费区间',
                    render: (state) => {
                        return state.min_refund_fee + "-" + state.max_refund_fee
                    }
                
                },
                {
                    title: '最早取位时限',
                    dataIndex: 'earliest_limit',
                    key: 'earliest_limit',
                    render: (state) => {
                        return state + '分'
                    }
                
                },
                {
                    title: '实际取位时限',
                    dataIndex: 'execute_limit',
                    key: 'execute_limit',
                    render: (state) => {
                        return state + '分'
                    }
                
                },
                {
                    title: '最晚取位时限',
                    dataIndex: 'latest_limit',
                    key: 'latest_limit',
                    render: (state) => {
                        return state + '分'
                    }
                
                },
                {
                    title: '生效日期',
                    dataIndex: 'effect_date',
                    key: 'effect_date',
                    render: (state) => {
                        return moment(state).format('YYYY-MM-DD')
                    }
                
                },
                {
                    title: '截止日期',
                    dataIndex: 'expiry_date',
                    key: 'expiry_date',
                    render: (state) => {
                        return moment(state).format('YYYY-MM-DD')
                    }
                },
                {
                    title: '配置状态',
                    dataIndex: 'config_state',
                    key: 'config_state',
                    render: (config) => {
                        let style
                        let text 
                        if(config === 2){
                            style = {
                                color: '#5AB957'
                            }
                            text = '可用'
                        }else if(config === 1){
                            style = {
                                color: '#FF0000'
                            }
                            text ='不可用'
                        }
                        return (
                            <div style={style}>{text}</div>
                        )
                        
                    }
                
                },
                {
                    title: '最后一次修改时间',
                    dataIndex: 'modify_time',
                    key: 'modify_time',
                    render: (state) => {
                        return moment(state).format('YYYY-MM-DD HH:mm:ss')
                    }
                
                },
            ],

            modalData: {},
            openModalType: '新增',

            airName: '', // 航空公司
            modalType: '国内', // 配置状态类型
            modalMode: '', // 舱位模式

            checkedList: [], // 选中列表

            pageNumber: 1, // 分页-当前页数
            pageCount: 1, // 分页-总页码
            totalCount: 0, // 总条数
            pageSize: 10, // 分页-页面条数

            keyId: 0,
        };
    }
    

  // 获取token
  getToken() {
    let data = {
      key: '',
    };

    Axios.get('api/token/Authenticate', data).then((res) => {
      console.log(res);
      if (res.data.status === 0) {
        let token = res.data.token;
        console.log(token);
        Axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

        this.getDataList();
      }
    });
  }

  //获取取位规则列表
  getDataList(page, size) {
    let data = {
      page_no: page || this.state.pageNumber, //类型：Number  必有字段  备注：页码
      page_size: size || this.state.pageSize, //类型：Number  必有字段  备注：显示数据条数
      airline_code: this.state.air, //类型：String  必有字段  备注：航空公司二字代码
      intl_flag: this.state.orderType === '国内'?false:true, // 订单类型 //类型：Boolean  必有字段  备注：国际国内标识 true:国际 false:国内
      execute_mode: this.state.executeType === '0'?null:this.state.executeType === 'true'?true:this.state.executeType === 'false'?false:null, //类型：Boolean  必有字段  备注：执行模式 true:执行取位 false:禁止取位
      cabin_code: this.state.cabinType, //类型：String  必有字段  备注：舱位模式
      config_state: Number(this.state.configType), //类型：Number  必有字段  备注：配置状态 0:所有 1：禁用 2：可用
      key_id: this.state.keyId, //类型：Number  可有字段  备注：表id
    };
    Axios.post('/api/pnrcancelconfig/getdata', data)
      .then((res) => {
        let newData = res.data.datas;
        if (newData === null || newData === "") {
            this.setState({
              data: [],
            });
            return message.warning(res.data.message);
        }
        newData.forEach((item, index) => {
          item['key'] = index;
        });
        this.setState({
          data: newData,
          totalCount: res.data.total_count,
          pageNumber: res.data.page_no,
        });
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
    let selectList = [];
    this.state.data.forEach((item, index) => {
      selectedRowKeys.forEach((oitem) => {
        if (index === oitem) {
          selectList.push(item);
        }
      });
    });
    this.setState({
      checkedList: selectList,
    });
  };

  //   关闭模态框
  closeModal = () => {
    this.setState({
      modalData: {},
      modalVisible: false,
    });
  };

  // 打开新增模态框
  openAddModal = () => {
    this.setState({
      modalData: {},
      openModalType: '添加',
      modalVisible: true,
    });
  };

  //打开修改模态框
  editModal(data, index) {
    console.log(data, index);
    let newData = JSON.parse(JSON.stringify(data));
    newData['config_state'] = newData.config_state === 2 ? true : false;
    this.setState({
      modalData: newData,
      openModalType: '修改',
      modalVisible: true,
    });
  }

  //   模态框状态开关
  modalChangeStatus = (type) => {
    console.log(type);
    let data = Object.assign({}, this.state.modalData, { config_state: type });
    this.setState({
      modalData: data,
    });
  };

  //   模态框修改配置状态
  modalChangeType = (val) => {
    console.log(val.target.value);
    this.setState({
      modalType: val.target.value,
    });
  };

  //   模态框修改舱位模式
  modalChangeMode = (val) => {
    let data = Object.assign({}, this.state.modalData, { execute_mode: val });
    this.setState({
      modalData: data,
    });
  };

  modalChangeStartTime(e, val) {
    console.log(e, val);
    let data = Object.assign({}, this.state.modalData, { effect_date: val });
    this.setState({
      modalData: data,
    });
  }

  modalChangeEndTime(e, val) {
    let data = Object.assign({}, this.state.modalData, { expiry_date: val });
    this.setState({
      modalData: data,
    });
  }

  //   模态框input框修改
  editAirInput(e) {
    let data = Object.assign({}, this.state.modalData, { airline_code: e.target.value });
    this.setState({
      modalData: data,
    });
  }
  editCainInput(e) {
    let data = Object.assign({}, this.state.modalData, { cabin_code: e.target.value });
    this.setState({
      modalData: data,
    });
  }
  editMinRefundInput(e) {
    let data = Object.assign({}, this.state.modalData, { min_refund_fee: e.target.value });
    this.setState({
      modalData: data,
    });
  }
  editMaxRefundInput(e) {
    let data = Object.assign({}, this.state.modalData, { max_refund_fee: e.target.value });
    this.setState({
      modalData: data,
    });
  }
  editEarliestInput(e) {
    let data = Object.assign({}, this.state.modalData, { earliest_limit: e.target.value });
    this.setState({
      modalData: data,
    });
  }
  editExecuteInput(e) {
    let data = Object.assign({}, this.state.modalData, { execute_limit: e.target.value });
    this.setState({
      modalData: data,
    });
  }
  editLatestInput(e) {
    let data = Object.assign({}, this.state.modalData, { latest_limit: e.target.value });
    this.setState({
      modalData: data,
    });
  }
  editRemarksInput(e) {
    let data = Object.assign({}, this.state.modalData, { remarks: e.target.value });
    this.setState({
      modalData: data,
    });
  }

  // 模态框数据提交
  submitModalBtn = () => {
    console.log('提交', this.state.modalData);
    let newConfig = this.state.modalData;
    newConfig.config_state = newConfig.config_state ? 2 : 1;

    let data = {
      action_code: this.state.openModalType === '修改' ? 'update' : this.state.openModalType === '添加' ? 'add' : '',
      configs: [newConfig],
    };
    Axios.post('api/pnrcancelconfig/set', data).then((res) => {
      if (res.status === 200) {
        message.success(res.data.message);
        this.getDataList();
        this.closeModal();
      } else {
        message.warning(res.data.message);
      }
    });
  };

  // 分页
  changePage = (page, size) => {
    this.setState({
      pageNumber: page,
      pageSize: size,
    });
    this.getDataList(page, size);
  };

  //   表格批量修改
  moreListEdit(type) {
    if (this.state.checkedList.length < 1) {
      return message.warning('请至少选择一条数据');
    }
    console.log(type, this.state.checkedList);
    let newData = this.state.checkedList;

    if (type === '禁用') {
      newData.forEach((item) => {
        item.config_state = 1;
      });
    }
    if (type === '启用') {
      newData.forEach((item) => {
        item.config_state = 2;
      });
    }

    let data = {
      action_code: type === '启用' ? 'enable' : type === '删除' ? 'delete' : type === '停用' ? 'disable' : '',
      configs: newData,
    };

    Axios.post('api/pnrcancelconfig/set', data).then((res) => {
        if (res.status === 200) {
          message.success(res.data.message);
          this.getDataList();
        } else {
          message.warning(res.data.message);
        }
      });
    }
    // 订单类型
    handleOrder = (val) => {
        console.log('订单类型',val.target.value)
        this.setState({
            orderType: val.target.value,
        })
    }

    // 配置状态
    handleConfig = (val) => {
        console.log('配置状态',val)
        this.setState({
            configType: val,
        })
    }

    // 执行模式
    handleExecute = (val) => {
        this.setState({
            executeType: val,
        })
        setTimeout(() =>{
            console.log('执行模式',this.state.executeType)
        },300)
    }

    // 航空公司
    handleAir = (val) => {
        console.log('航空公司',val.target.value)
        this.setState({
            air: val.target.value,
        })
    }

    // 舱位
    handleCabin = (val) => {

        console.log('舱位',val.target.value)
        this.setState({
            cabinType: val.target.value,
        })
    }

    // 搜索提交
    submitSeach = () => {
        this.getDataList();
    };

    render() {
        const { selectedRowKeys } = this.state;

        const { TextArea } = Input;

        const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
        };
        return (
        <div className="table">
            <div className="table_type">
            {/* 订单类型 */}
            <div className="type_name">
                {/* <div>订单类型</div> */}
                <div className="radio">
                    <Radio.Group onChange={this.handleOrder} value={this.state.orderType}>
                    <Radio value="国内">国内</Radio>
                    <Radio value="国际">国际</Radio>
                    </Radio.Group>
                </div>
            </div>
            {/* 航空公司 */}
            <div className="type_name">
                <div>航空公司</div>
                <div className="radio">
                <Input allowClear placeholder="请输入航司代码" onChange={this.handleAir.bind(this)}/>
                </div>
            </div>
            {/* 执行模式 */}
            <div className="type_name">
                <div>执行模式</div>
                <div className="radio">
                <Select allowClear style={{ width: 200 }} placeholder="适用" optionFilterProp="children" notFoundContent="无法找到"
                onChange={this.handleExecute}>
                    <Option value="0">所有</Option>
                    <Option value="true">适用</Option>
                    <Option value="false">禁止</Option>
                </Select>
                </div>
            </div>
            {/* 舱位 */}
            <div className="type_name">
                <div>舱位</div>
                <div className="radio">
                <Input allowClear placeholder="请输入舱位" onChange={this.handleCabin.bind(this)}/>
                </div>
            </div>
            {/* 配置状态 */}
            <div className="type_name">
                <div>配置状态</div>
                <div className="radio">
                <Select allowClear style={{ width: 200 }} placeholder="可用" optionFilterProp="children" notFoundContent="无法找到"
                onChange={this.handleConfig}>
                    <Option value="0">所有</Option>
                    <Option value="2">可用</Option>
                    <Option value="1">不可用</Option>
                </Select>
                </div>
            </div>
            {/* 搜索按钮 */}
            <div className="type_name">
                <Button type="primary" onClick={this.submitSeach}>搜索</Button>
            </div>
            </div>

            <div className="table_main">
            <Space style={{ marginBottom: 16 }}>
                <Button onClick={this.openAddModal}>+新增</Button>
                <Button onClick={() => this.moreListEdit('启用')}>
                批量启用
                </Button>
                <Button onClick={() => this.moreListEdit('停用')}>
                批量停用
                </Button>
                <Button onClick={() => this.moreListEdit('删除')}>
                批量删除
                </Button>
            </Space>
            <Table
                rowSelection={rowSelection}
                columns={this.state.columns}
                dataSource={this.state.data}
                onChange={this.handleChange}
                pagination={false}
                bordered
            />
            {/* 分页 */}
            <Pagination
                current={this.state.pageNumber}
                pageSize={this.state.pageSize}
                total={this.state.totalCount}
                itemRender={itemRender}
                position={this.state.bottom}
                onChange={this.changePage}
            />
            </div>

            <Modal title={this.state.openModalType + '规则'} width={820} centered visible={this.state.modalVisible} onOk={this.submitModalBtn} onCancel={this.closeModal}>
            <div className="rule_modal">
                <div className="modal_list">
                <div className="list_item">
                    <div className="list_title">配置状态</div>
                    <div className="list_box">
                    <Switch checkedChildren="可用" unCheckedChildren="不可用" onChange={this.modalChangeStatus} checked={this.state.modalData.config_state} />
                    </div>
                </div>
                <div className="list_item">
                    <div className="list_box">
                    <Radio.Group onChange={this.modalChangeType} value={this.state.modalType}>
                        <Radio value={'国内'}>国内</Radio>
                        <Radio value={'国际'}>国际</Radio>
                    </Radio.Group>
                    </div>
                </div>
                </div>
                <div className="modal_list">
                <div className="list_item">
                    <div className="list_title">航空公司</div>
                    <div className="list_box">
                    <Input  allowClear placeholder="请输入" value={this.state.modalData.airline_code} onChange={this.editAirInput.bind(this)} />
                    </div>
                </div>
                <div className="list_item">
                    <div className="list_title">舱位模式</div>
                    <div className="list_box">
                    <Select value={this.state.modalData.execute_mode ? '适用' : '禁止'} allowClear style={{ width: 120 }} onChange={this.modalChangeMode}>
                        <Option value={true}>适用</Option>
                        <Option value={false}>禁止</Option>
                    </Select>
                    </div>
                </div>
                <div className="list_item">
                    <div className="list_title">舱位代码</div>
                    <div className="list_box">
                    <Input  allowClear placeholder="请输入" defaultValue={this.state.modalData.cabin_code} onChange={this.editCainInput.bind(this)} />
                    </div>
                </div>
                </div>
                <div className="modal_list">
                <div className="list_item">
                    <div className="list_title">退票费</div>
                    <div className="list_box">
                    <Input allowClear placeholder="最低" defaultValue={this.state.modalData.min_refund_fee} onChange={this.editMinRefundInput.bind(this)} />
                    </div>
                </div>
                <div className="list_item">
                    <div className="list_box">
                    <Input allowClear placeholder="最高" defaultValue={this.state.modalData.max_refund_fee} onChange={this.editMaxRefundInput.bind(this)} />
                    </div>
                </div>
                </div>
                <div className="modal_list">
                <div className="list_item">
                    <div className="list_title">最早取位</div>
                    <div className="list_box">
                    <Input allowClear placeholder="单位分钟" defaultValue={this.state.modalData.earliest_limit} onChange={this.editEarliestInput.bind(this)} />
                    </div>
                </div>
                <div className="list_item">
                    <div className="list_title">实际取位</div>
                    <div className="list_box">
                    <Input allowClear placeholder="单位分钟" defaultValue={this.state.modalData.execute_limit} onChange={this.editExecuteInput.bind(this)} />
                    </div>
                </div>
                <div className="list_item">
                    <div className="list_title">最晚取位</div>
                    <div className="list_box">
                    <Input allowClear placeholder="单位分钟" defaultValue={this.state.modalData.latest_limit} onChange={this.editLatestInput.bind(this)} />
                    </div>
                </div>
                </div>
                <div className="modal_list">
                <div className="list_item">
                    <div className="list_title">生效时间</div>
                    <div className="list_box">
                    <DatePicker onChange={this.modalChangeStartTime.bind(this)} defaultValue={moment(this.state.modalData.effect_date || new Date(), 'YYYY-MM-DD')} />
                    </div>
                </div>
                <div className="list_item">
                    <div className="list_title">截止时间</div>
                    <div className="list_box">
                    <DatePicker onChange={this.modalChangeEndTime.bind(this)} defaultValue={moment(this.state.modalData.expiry_date || new Date(), 'YYYY-MM-DD')} />
                    </div>
                </div>
                </div>
                <div className="modal_list">
                <div className="list_item">
                    <div className="list_title">备注</div>
                    <div className="list_box">
                    <TextArea defaultValue={this.state.modalData.remarks} rows={4} onChange={this.editRemarksInput.bind(this)} />
                    </div>
                </div>
                </div>
            </div>
            </Modal>
        </div>
        );
    }
}
