import React, {useEffect, useState} from "react";
import {Avatar, Button, Card, Dropdown, Icon, List, Menu, Modal, Popconfirm, Tooltip} from "antd";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import api from '@/services'
import styles from './index.less';
import {getAccessToken} from '@/utils/authority';
import {EditOutlined, ExclamationCircleOutlined, EyeOutlined, SwitcherOutlined} from "@ant-design/icons";
import Save from './save'
import Edit from './edit'
import AutoHide from "@/pages/analysis/components/Hide/autoHide";
import encodeQueryParam from "@/utils/encodeParam";
import SearchForm from "@/components/SearchForm";

const {confirm} = Modal;

interface Props {
  location: Location
}

export const TenantContext = React.createContext({});

const Screen = (props: Props) => {

  const defaultImg = 'https://oss.bladex.vip/caster/upload/20200512/f26107bbb77a84949285617848745d81.jpg'
  const [categoryList, setCategoryList] = useState([]);
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
  const [searchParam, setSearchParam] = useState({pageSize: 12, pageIndex: 0, terms: {type: 'big_screen'}});
  const token = getAccessToken();

  const handleSearch = (params: any) => {
    setSearchParam(params);
    api.screen.query(encodeQueryParam(params)).then(res => {
      if (res.status === 200) {
        setDataList(res.result)
      }
    })
  };

  let delConfirm = (id: string) => {
    api.screen.remove(id).then(res => {
      if (res.status === 200) {
        handleSearch(searchParam);
      }
    })
  };

  let updateState = (state: string, id: string) => {

    api.screen.update(id, {
      state: {
        value: state
      }
    }).then(res => {
      if (res.status === 200) {
        handleSearch(searchParam);
      }
    })
  };

  function copyConfirm() {
    confirm({
      title: '复制大屏',
      icon: <ExclamationCircleOutlined/>,
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
      terms: searchParam.terms
    });
  };
  useEffect(() => {

    api.categoty.queryNoPaging({})
      .then((response: any) => {
        setCategoryList(response.result.map((item: any) => ({
          id: item.id,
          pId: item.parentId,
          value: item.id,
          title: item.name
        })))
      })
      .catch(() => {
      });

    handleSearch(searchParam);
  }, []);

  return (
    <PageHeaderWrapper title="大屏管理">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div>
            <SearchForm
              search={(params: any) => {
                handleSearch({
                  terms: {...params, type: 'big_screen'},
                  pageSize: 8,
                });
              }}
              formItems={[{
                label: '大屏名称',
                key: 'name$LIKE',
                type: 'string',
              },
                {
                  label: '大屏分类',
                  key: 'catalogId',
                  type: 'treeSelect',
                  props: {
                    data: categoryList,
                    dropdownStyle: {maxHeight: 500}
                  }
                }]}
            />
          </div>

          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={i => setSaveVisible(true)}>新建大屏</Button>
          </div>
        </div>
      </Card>
      <div style={{marginBottom: '30px'}}>
        <div className={styles.cardList}>
          <List<any>
            rowKey="id"
            grid={{gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1}}
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
              style: {marginTop: -20},
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
                    <Card hoverable bodyStyle={{paddingBottom: 20}}
                          onMouseEnter={i => setId(item.id)} onMouseLeave={i => setId('')}
                          actions={[
                            <Tooltip placement="bottom" title="编辑">
                              <EditOutlined onClick={() => {
                                setEditVisible(true);
                                setParam({
                                  id: item.id,
                                  name: item.name,
                                  description: item.description,
                                  catalogId: props.data
                                })
                              }}/>
                            </Tooltip>,
                            <Tooltip placement="bottom" title="预览">
                              <EyeOutlined onClick={i => {
                                window.open(`http://localhost:8080/view/${item.id}?token=${token}`, '_blank')
                              }}/>
                            </Tooltip>,
                            <Tooltip placement="bottom" title="复制">
                              <SwitcherOutlined onClick={copyConfirm}/>
                            </Tooltip>,
                            <Tooltip key="more_actions" title="">
                              <Dropdown overlay={
                                <Menu>
                                  <Menu.Item key="1">
                                    <Popconfirm
                                      placement="topRight"
                                      title={item.state.value === 'enabled' ? '确定禁用此大屏吗？' : '确定启用此大屏吗？'}
                                      onConfirm={() => {
                                        let state;
                                        if (item.state.value === 'enabled') {
                                          state = 'disabled';
                                        } else {
                                          state = 'enabled';
                                        }
                                        updateState(state, item.id)
                                      }}
                                    >
                                      <Button icon={item.state.value === 'enabled' ? 'close' : 'check'} type="link">
                                        {item.state.value === 'enabled' ? '禁用' : '启用'}
                                      </Button>
                                    </Popconfirm>
                                  </Menu.Item>
                                  {item.state.value === 'disabled' && (
                                    <Menu.Item key="2">
                                      <Popconfirm
                                        placement="topRight"
                                        title='确认删除此大屏吗？'
                                        onConfirm={() => {
                                          delConfirm(item.id);
                                        }}
                                      >
                                        <Button icon="delete" type="link">
                                          删除
                                        </Button>
                                      </Popconfirm>
                                    </Menu.Item>
                                  )}
                                </Menu>
                              }>
                                <Icon type="ellipsis"/>
                              </Dropdown>
                            </Tooltip>,
                          ]}
                    >
                      <Card.Meta
                        avatar={<Avatar size={60}
                                        src={metadata.visual != undefined ? metadata.visual.backgroundUrl : defaultImg}/>}
                        title={<AutoHide title={item.name} style={{width: '95%'}}/>}
                        description={<AutoHide title={item.id} style={{width: '95%'}}/>}
                      />
                      <div className={styles.status}>
                        <div>
                          <p>状态: 已{item.state.text}</p>
                        </div>
                        <div>
                          <p>分类: {item.catalogId}</p>
                        </div>
                      </div>
                      <div className={styles.edit} style={{display: item.id == id ? 'block' : 'none'}}>
                        <div className={styles.editBtn}><a onClick={i => {
                          window.open(`http://localhost:8080/build/${id}?token=${token}`, '_blank')
                        }}>编辑</a></div>
                      </div>
                    </Card>
                  </List.Item>
                );
              }
              return;
            }}
          />
        </div>
        {saveVisible && <Save close={() => {
          setSaveVisible(false)
        }} save={() => {
          setSaveVisible(false);
          handleSearch({pageSize: 12, pageIndex: 0});
        }}/>}
        {editVisible && <Edit data={param} close={() => {
          setEditVisible(false)
        }} save={() => {
          setEditVisible(false);
          handleSearch({pageSize: 12, pageIndex: 0});
        }}/>}
      </div>
    </PageHeaderWrapper>
  )
};

export default Screen;
