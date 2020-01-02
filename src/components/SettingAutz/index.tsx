import React, { Component } from 'react';
import { Modal, Row, Col, message, Affix, Anchor, Collapse, Switch, Divider, Checkbox, Spin } from 'antd';
import ConnectState from '@/models/connect';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { PermissionModelState } from '@/models/permission';
import { CurrentPermission, PermissionItem } from './data';
import { AutzSetting } from './AutzSetting';
const { Link } = Anchor;
const { Panel } = Collapse;

interface SettingAutzProps {
  dispatch?: Dispatch<any>;
  close: Function;
  loading?: boolean;
  permission?: PermissionModelState;
  settingType: string;
  settingId: string;
}

interface SettingAutzState {
  activeKey: string[] | any[];
  checkedPermission: string[] | any[] | never[];
  permissionData: PermissionItem[];
  currentPermission?: CurrentPermission | any;
  checkAll: boolean;
  indeterminate: boolean;
  tempPermission?: CurrentPermission | any;
}

const autzTypeMap = new Map();
autzTypeMap.set('role', '角色');
autzTypeMap.set('user', '用户');

const priorityMap = new Map();
priorityMap.set('user', 10);
priorityMap.set('role', '20');

// @connect(({ permission, loading }: ConnectState) => ({
//   permission,
//   loading: loading.models.permission,
// }))
class SettingAutz extends Component<SettingAutzProps, SettingAutzState> {

  state: SettingAutzState = {
    activeKey: [],
    checkedPermission: [],
    permissionData: [], //全部的权限
    currentPermission: undefined, //当前用户的权限
    checkAll: false,
    indeterminate: true,
    tempPermission: undefined,
  };

  private tempPermission: any;

  componentDidMount() {
    const { dispatch, settingId, settingType } = this.props;
    if (!dispatch) return;
    // dispatch({
    //   type: 'permission/fetch',
    //   payload: {
    //     paging: 'false',
    //   },
    // });
    //获取已经选择的节点
    if (settingId) {
      dispatch({
        type: 'permission/autzSetting',
        payload: {
          settingType,
          settingId,
        },
        callback: (response: any) => {
          let activeKey = [];
          let currentPermission = undefined;
          if (response.result) {
            activeKey = response.result.details.map((item: any) => item.permissionId);
            currentPermission = response.result;
          }
          this.setState({
            activeKey,
            currentPermission,
          });
        },
      });
    }
  }

  componentDidUpdate() {
    const { permission } = this.props;
    const { activeKey, currentPermission } = this.state;
    if (!permission) return;
    const permissionData = permission.result.data;
    const data = this.tempPermission ? this.tempPermission : currentPermission;
    if (currentPermission) {
      permissionData.forEach((item: PermissionItem) => {
        const current = data.details.find((c: { permissionId: string; }) => c.permissionId === item.id);
        if (activeKey.indexOf(item.id) > -1) {
          item.open = true;
          if (current) {
            item.checkedAction = current.actions;
          }
        } else {
          item.open = false;
        }
      });
    }
    this.setState({
      permissionData,
    });
  }

  componentWillUnmount() {
    this.tempPermission = undefined;
  }

  handlePermissionItem = (item: PermissionItem) => {
    const { permissionData, activeKey } = this.state;
    const data = permissionData;
    let keys = activeKey;
    data.forEach(i => {
      if (i.id === item.id) {
        i.open = !i.open;
        if (!i.open) {
          keys = activeKey.filter((k: string) => k !== item.id);
        } else {
          keys.push(item.id);
        }
      }
    });
    this.setState({
      permissionData: data,
      activeKey: keys,
    });
  };

  onChange = (checkedList: string[], id: string) => {
    const { permissionData } = this.state;
    permissionData.map(item => {
      if (item.id === id) {
        item.checkedAction = checkedList;
      }
    });
    this.setState({
      permissionData,
    });
  };

  onCheckAllChange = (e: any, id: string) => {
    const { permissionData } = this.state;
    permissionData.map(item => {
      if (item.id === id) {
        if (e.target.checked) {
          item.checkedAction = item.actions.map(e => e.action);
        } else {
          item.checkedAction = [];
        }
      }
    });

    this.setState({
      permissionData,
    });
  };

  renderPanle = (permissionData: PermissionItem[]) =>
    permissionData.map(item => {
      return (
        <Panel
          header={item.name}
          key={item.id}
          id={item.id}
          showArrow={false}
          extra={
            <div>
              <Switch
                checkedChildren="启用"
                unCheckedChildren="禁用"
                checked={item.open}
                onChange={() => this.handlePermissionItem(item)}
              />
              <Divider type="vertical" />
              {/* <a href="#">数据权限</a> */}
              <Divider type="vertical" />
              <a href="#">字段权限</a>
              <h2 hidden>{item.name}</h2>
            </div>
          }
        >
          <div>
            <Row>
              <Col span={6} style={{ height: 40 }}>
                <Checkbox
                  indeterminate={
                    !!(item.checkedAction || []).length &&
                    (item.checkedAction || []).length < item.actions.map(e => e.action).length
                  }
                  onChange={e => this.onCheckAllChange(e, item.id)}
                  checked={
                    (item.checkedAction || []).length === item.actions.map(e => e.action).length
                  }
                >
                  全 选
                </Checkbox>
              </Col>
              <Divider />
              <Checkbox.Group
                name={item.id}
                value={item.checkedAction}
                options={item.actions.map(e => {
                  return {
                    value: e.action,
                    label: <span style={{ marginRight: 30 }}>{e.describe}</span>,
                  };
                })}
                onChange={(checkedList: string[] | any[]) => this.onChange(checkedList, item.id)}
              />
            </Row>
          </div>
        </Panel>
      );
    });

  renderLink = (permissionData: PermissionItem[]) =>
    permissionData.map(item => <Link href={'#' + item.id} title={item.name} key={item.id} />);

  save = () => {
    const { settingType, settingId, dispatch } = this.props;
    if (!dispatch) return;
    const details = this.formatPermission();
    const autzSetData = new AutzSetting({
      type: settingType,
      settingFor: settingId,
      priority: priorityMap.get(settingType),
      menus: [],
      details: details,
      merge: true,
    });
    this.tempPermission = autzSetData;
    dispatch({
      type: 'permission/setAutzData',
      payload: autzSetData,
      callback: (response: any) => {
        message.success('保存成功！');
      },
    });
  };

  formatPermission = () => {
    const { permissionData } = this.state;
    const { settingType } = this.props;
    return permissionData.filter(e => e.open === true).map(e => {
      return {
        permissionId: e.id,
        priority: priorityMap.get(settingType),
        merge: true,
        dataAccesses: [],
        actions: e.checkedAction,
      };
    });
  }

  render() {
    const { activeKey, permissionData } = this.state;
    const { settingVisible, settingType, loading } = this.props;
    return (
      <Modal
        title={`${autzTypeMap.get(settingType)}赋权`}
        width={1040}
        onCancel={settingVisible}
        onOk={() => this.save()}
        destroyOnClose
        visible
      >
        {
          loading ? <Spin tip="加载中......" style={{ marginLeft: 450 }} /> : (
            <Row>
              <Col span={16} style={{ height: 600, overflow: 'auto' }}>
                <Collapse activeKey={activeKey}>{this.renderPanle(permissionData)}</Collapse>
              </Col>
              <Col span={6} offset={2} style={{ height: 600, overflow: 'auto' }}>
                <Affix>
                  <Anchor>{this.renderLink(permissionData)}</Anchor>
                </Affix>
              </Col>
            </Row>
          )
        }

      </Modal>
    );
  }
}
export default SettingAutz;
