import React, { useState, useEffect } from "react";
import { Card, TreeSelect, Button, Modal } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import api from '@/services'
import styles from './index.less';
import { List, Tooltip, Avatar } from "antd";
import { getAccessToken } from '@/utils/authority';
import { EditOutlined, SwitcherOutlined, DeleteOutlined, EyeOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Save from './save'
import Edit from './edit'
import AutoHide from "@/pages/analysis/components/Hide/autoHide";
import encodeQueryParam from "@/utils/encodeParam";

const { TreeNode } = TreeSelect;
const { confirm } = Modal;

interface Props {
  location: Location
}
export const TenantContext = React.createContext({});

const Screen = (props: Props) => {

  const defaultImg = 'https://oss.bladex.vip/caster/upload/20200512/f26107bbb77a84949285617848745d81.jpg'
  const [categoryList, setCategoryList] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [dataList, setDataList] = useState({
    data: [],
    pageIndex: 0,
    total: 0,
    pageSize: 0
  });
  const [id, setId] = useState('');
  const [saveVisible, setSaveVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [param, setParam] = useState({});
  const token = getAccessToken()

  const handleSearch = (params: any) => {
    api.screen.query(encodeQueryParam(params)).then(res => {
      if (res.status === 200) {
        setDataList(res.result)
      }
    })
  }
  let delConfirm = (id: string) => {
    confirm({
      title: '删除大屏',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        api.screen.remove(id).then(res => {
          if (res.status === 200) {
            console.log(id)
            handleSearch({ pageSize: 12, pageIndex: 0 });
          }
        })
      }
    });
  }
  function copyConfirm() {
    confirm({
      title: '复制大屏',
      icon: <ExclamationCircleOutlined />,
      content: '确认复制',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  const onChange = (page: number, pageSize: number) => {
    handleSearch({
      pageIndex: page - 1,
      pageSize,
      // categoryId: categoryId,
      terms: { categoryId: categoryId }
    });
  };
  useEffect(() => {
    api.categoty.query_tree({}).then(res => {
      if (res.status === 200) {
        setCategoryList(res.result)
        if (res.result.length > 0) {
          setCategoryId(res.result[0].id)
        }
      }
    })
    handleSearch({ pageSize: 12, pageIndex: 0 });
  }, []);

  function getView(view: any) {
    if (view.children && view.children.length > 0) {
      return (
        <TreeNode title={view.name} value={view.id}>
          {
            view.children.map((v: any) => {
              return getView(v)
            })
          }
        </TreeNode>
      )
    }
  }
  return (
    <PageHeaderWrapper title="大屏管理">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div>
            <TreeSelect
              style={{ width: '40%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择分类"
              allowClear
              onChange={(value: string) => {
                setCategoryId(value)
              }}
            >
              {
                categoryList.map((v) => {
                  return getView(v)
                })
              }
            </TreeSelect>
            <Button type="primary" icon="search" style={{ width: 80, textAlign: 'center', marginLeft: '10px' }} onClick={() => { handleSearch({ terms: { categoryId: categoryId }, pageSize: 12, pageIndex: 0 }) }}>查询</Button>
          </div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={i => setSaveVisible(true)}>新建大屏</Button>
          </div>
        </div>
      </Card>
      <div style={{ marginBottom: '30px' }}>
        <div className={styles.cardList}>
          <List<any>
            rowKey="id"
            grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
            dataSource={dataList.data || []}
            pagination={{
              current: dataList.pageIndex + 1,
              total: dataList.total,
              pageSize: dataList.pageSize,
              onChange,
              showQuickJumper: true,
              showSizeChanger: true,
              hideOnSinglePage: true,
              pageSizeOptions: ['8', '16', '40', '80'],
              style: { marginTop: -20 },
              showTotal: (total: number) =>
                `共 ${total} 条记录 第  ${dataList.pageIndex + 1}/${Math.ceil(
                  dataList.total / dataList.pageSize,
                )}页`
            }}
            renderItem={item => {
              if (item && item.id) {
                let metadata = item.metadata != undefined ? JSON.parse(item.metadata) : {};
                return (
                  <List.Item key={item.id}>
                    <Card hoverable bodyStyle={{ paddingBottom: 20 }}
                      onMouseEnter={i => setId(item.id)} onMouseLeave={i => setId('')}
                      actions={[
                        <Tooltip placement="bottom" title="删除">
                          <DeleteOutlined onClick={() => { delConfirm(item.id) }} />
                        </Tooltip>,
                        <Tooltip placement="bottom" title="编辑">
                          <EditOutlined onClick={() => { setEditVisible(true); setParam({ id: item.id, name: item.name, description: item.description, catalogId: props.data }) }} />
                        </Tooltip>,
                        <Tooltip placement="bottom" title="查看">
                          <EyeOutlined onClick={i => { window.open(`http://localhost:8080/view/${item.id}?token=${token}`, '_blank') }} />
                        </Tooltip>,
                        <Tooltip placement="bottom" title="复制">
                          <SwitcherOutlined onClick={copyConfirm} />
                        </Tooltip>
                      ]}
                    >
                      <Card.Meta
                        avatar={<Avatar size={60} src={metadata.visual != undefined ?  metadata.visual.backgroundUrl : defaultImg } />}
                        title={<AutoHide title={item.name} style={{ width: '95%' }} />}
                        description={<AutoHide title={item.id} style={{ width: '95%' }} />}
                      />
                      <div className={styles.status}>
                        <div>
                          <p>状态: 已{item.state.text}</p>
                        </div>
                        <div>
                          <p>类型: {item.type}</p>
                        </div>
                      </div>
                      <div className={styles.edit} style={{ display: item.id == id ? 'block' : 'none' }}>
                        <div className={styles.editBtn}><a onClick={i => { window.open(`http://localhost:8080/build/${id}?token=${token}`, '_blank') }}>编辑</a></div>
                      </div>
                    </Card>
                  </List.Item>
                );
              }
              return;
            }}
          />
        </div>
        {saveVisible && <Save data={categoryId} close={() => {
          setSaveVisible(false)
        }} save={() => { setSaveVisible(false); handleSearch({ pageSize: 12, pageIndex: 0 }); }} />}
        {editVisible && <Edit data={param} close={() => {
          setEditVisible(false)
        }} save={() => { setEditVisible(false); handleSearch({ pageSize: 12, pageIndex: 0 }); }} />}
      </div >
    </PageHeaderWrapper>
  )
}
export default Screen;