import { Button, Checkbox, Drawer, Form, Icon, Input, Select, Table, Tabs, Divider } from "antd";
import React, { Fragment, useState, useEffect } from "react";
import apis from "@/services";
import { DimensionsItem, DimensionType } from "@/pages/system/dimensions/data";
import { groupBy } from "lodash";

interface Props {
  close: Function,
  targetId?: string,
  targetType?: string,
}
interface State {
  dataAccessVisible: boolean;
  permissionList: any[];
  checkPermission: any;
  permissionType: string;
  searchText: string;
  dimensionList: any[];
}
const Authorization: React.FC<Props> = (props) => {
  const initState: State = {
    dataAccessVisible: false,
    permissionList: [],
    checkPermission: {},
    permissionType: 'all',
    searchText: '',
    dimensionList: [],
  }
  const [permissionList, setPermissionList] = useState(initState.permissionList);
  const [dataAccessVisible, setDataAccessVisible] = useState(initState.dataAccessVisible);
  const [checkPermission, setCheckPermission] = useState(initState.checkPermission);
  const [permissionType, setPermissionType] = useState(initState.permissionType);
  const [searchText, setSearchText] = useState(initState.searchText);
  const [dimensionList, setDimensionList] = useState(initState.dimensionList);


  useEffect(() => {
    apis.permission.listNoPaging().then(response => {
      if (response.status === 200) {
        const temp: any[] = response.result;
        const list = temp.filter(item => (item.actions || []).length > 0);
        setPermissionList(list);
      }
    });
    getDimensions();
  }, []);

  const getDimensions = () => {
    apis.dimensions.typeList().then(e => {
      if (e && e.status === 200) {
        apis.dimensions.treeList().then(d => {
          if (d.status === 200) {
            const dimensionList = d.result.map((dr: DimensionsItem) => {
              let type = e.result.find((t: DimensionType) => t.id === dr.typeId);
              if (type) {
                let typeName = type.name;
                return { typeName, ...dr }
              }
              return dr;
            });
            setDimensionList(dimensionList);
          }
        });
      }
    });
  }

  return (
    <Drawer
      title='授权'
      visible
      width={'50VW'}
      onClose={() => props.close()}
    >
      <Form>
        <Form.Item label="被授权主体">
          <Select mode="multiple">
            {Array.from(new Set<string>(dimensionList.map((item: any) => item.typeName))).map(type => {
              const typeData = groupBy(dimensionList, item => item.typeName)[type];

              return (
                <Select.OptGroup label={type} key={type}>
                  {
                    typeData.map((e: any) => {
                      return <Select.Option value={e.id} key={e.id}>{e.name}</Select.Option>
                    })
                  }
                </Select.OptGroup>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="选择权限">
          <Input.Group compact style={{ marginBottom: '10px' }}>
            <Select style={{ width: '15%' }} defaultValue='all' onChange={(value: string) => setPermissionType(value)}>
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="default">默认</Select.Option>
              <Select.Option value="system">系统</Select.Option>
              <Select.Option value="biz">业务功能</Select.Option>
              <Select.Option value="open-api">OpenAPI</Select.Option>
            </Select>
            <Input.Search style={{ width: '85%' }} placeholder="请输入权限名称" onChange={(event) => { setSearchText(event.target.value) }} />
            {/* <Button type="primary" style={{ width: '5%' }}><Icon type='search' /></Button> */}
          </Input.Group>
          <Table
            rowKey={'id'}
            style={{ height: '65vh', overflow: 'auto' }}
            pagination={false}
            columns={[
              {
                dataIndex: 'name',
                title: '权限名称',
              },
              {
                dataIndex: 'actions',
                title: '权限操作',
                render: (text: { action: string, name: string }[], record: any) => {
                  return (text || []).map((e: { action: string, name: string }) => <Checkbox name={e.action} key={e.action}>{e.name}</Checkbox>)
                }
              },
              {
                dataIndex: 'properties',
                title: '操作',
                render: (text, record: any) =>
                  <Fragment>
                    {
                      (text && text.supportDataAccessTypes || [])
                        .some((i: string) => i === 'DENY_FIELDS') &&
                      <a onClick={() => { setDataAccessVisible(true); setCheckPermission(record) }}>数据权限</a>
                    }
                  </Fragment>
              }
            ]}
            dataSource={
              permissionType !== 'all' ?
                searchText.length > 0 ?
                  JSON.parse(JSON.stringify(permissionList))
                    .filter((item: any) => (item.properties || {}).type === permissionType)
                    .filter((item: any) => item.name.indexOf(searchText) > -1) :
                  JSON.parse(JSON.stringify(permissionList))
                    .filter((item: any) => (item.properties || {}).type === permissionType)
                : searchText.length > 0 ?
                  JSON.parse(JSON.stringify(permissionList))
                    .filter((item: any) => item.name.indexOf(searchText) > -1) :
                  permissionList}
          />
        </Form.Item>
      </Form>
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={() => { props.close() }} style={{ marginRight: 8 }}>
          关闭
        </Button>
        <Button onClick={() => { }} type="primary">
          保存
        </Button>
      </div>
      {
        dataAccessVisible &&
        <Drawer
          visible
          title="数据权限配置"
          onClose={() => { setDataAccessVisible(false) }}
          width={'30VW'}
        >
          <Tabs defaultActiveKey="field">
            <Tabs.TabPane tab="字段权限" key="field">
              <Table
                rowKey={'name'}
                columns={[
                  {
                    dataIndex: 'name',
                    title: '字段名称',
                  },
                  {
                    title: '操作',
                    render: (record) =>
                      <Checkbox.Group
                        onChange={(value) => { console.log(value, '字段权限') }}
                        options={
                          (checkPermission.actions || [])
                            .filter((item: any) =>
                              ((item.properties || {}).supportDataAccess || '').indexOf('DENY_FIELDS') > -1)
                            .map((e: { action: string, name: string }) => { return { 'label': e.name, 'value': record.name + ':' + e.action } })
                        } />

                  }
                ]}
                dataSource={checkPermission.optionalFields}
              />

            </Tabs.TabPane>
            <Tabs.TabPane tab="数据权限" key="data">
              <Table
                rowKey='name'
                columns={[
                  {
                    dataIndex: 'name',
                    title: '名称'
                  }, {
                    title: '操作',
                    render: (record) =>
                      <Checkbox.Group
                        onChange={(value) => { console.log(value, '数据权限') }}
                        options={
                          (checkPermission.actions || [])
                            .filter((item: any) =>
                              ((item.properties || {}).supportDataAccess || '').indexOf('org') > -1)
                            .map((e: { action: string, name: string }) => { return { 'label': e.name, 'value': 'org:' + e.action } })
                        }
                      />
                  }
                ]}
                dataSource={
                  checkPermission.properties.supportDataAccessTypes.some((e: string) => e === 'org') ? [
                    { name: '仅限所在组织架构数据' }
                  ] : []
                }
              />
            </Tabs.TabPane>
          </Tabs>
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={() => { setDataAccessVisible(false) }} style={{ marginRight: 8 }}>
              关闭
            </Button>
            <Button onClick={() => { }} type="primary">
              保存
            </Button>
          </div>
        </Drawer>
      }
    </Drawer>
  )
}
export default Authorization;