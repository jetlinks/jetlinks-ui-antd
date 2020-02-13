import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useEffect, useState, Fragment } from 'react';
import { Card, Form, Col, Input, Row, Table, Divider, message } from 'antd';
import apis from '@/services';
import { Dispatch, ConnectState } from '@/models/connect';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import encodeQueryParam from '@/utils/encodeParam';
import { downloadObject } from '@/utils/utils';
import Save from './save';
import StandardFormRow from '../components/standard-form-row';
import TagSelect from '../components/tag-select';
import styles from '../index.less';

interface Props extends FormComponentProps {
  dispatch: Dispatch;
  noticeTemplate: any;
  loading: boolean;
}
interface State {
  typeList: any[];
  // activeType: string;
  saveVisible: boolean;
  currentItem: any;
  searchParam: any;
  filterType: string[];
  filterName: string;
}

const formItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const Config: React.FC<Props> = props => {
  const { noticeTemplate, loading, dispatch } = props;

  const initState: State = {
    typeList: [],
    // activeType: '',
    saveVisible: false,
    currentItem: {},
    searchParam: {},
    filterType: [],
    filterName: '',
  };
  const [typeList, setTypeList] = useState(initState.typeList);
  // const [activeType, setActiveType] = useState(initState.activeType);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [currentItem, setCurrentItem] = useState(initState.currentItem);
  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [filterType, setFilterType] = useState(initState.filterType);
  const [filterName, setFilterName] = useState(initState.filterName);

  const handlerSearch = (params?: any) => {
    dispatch({
      type: 'noticeTemplate/query',
      payload: encodeQueryParam(params),
    });
    setSearchParam(params);
  };

  const onSearch = (type?: string[], name?: string) => {
    const tempType = type || filterType;
    const tempName = name || filterName;
    // console.log(tempName, 'name');
    dispatch({
      type: 'noticeConfig/query',
      payload: encodeQueryParam({
        paging: false,
        sorts: {
          field: 'id',
          order: 'desc',
        },
        terms: {
          type$IN: tempType,
          name$LIKE: tempName,
        },
      }),
    });
  };

  useEffect(() => {
    apis.notifier.configType().then((res: any) => {
      if (res) {
        setTypeList(res.result);
      }
    });
    handlerSearch({
      pageIndex: 0,
      pageSize: 10,
    });
  }, []);

  const remove = (record: any) => {
    dispatch({
      type: 'noticeConfig/remove',
      payload: record.id,
      callback: () => {
        message.error('删除成功');
        handlerSearch(searchParam);
      },
    });
  };

  const debug = () => {};

  const saveData = (item: any) => {
    dispatch({
      type: 'noticeConfig/insert',
      payload: item,
      callback: () => {
        message.success('保存成功');
        setSaveVisible(false);
        handlerSearch(searchParam);
      },
    });
  };

  return (
    <PageHeaderWrapper title="通知模版">
      <div className={styles.filterCardList}>
        <Card bordered={false}>
          <Form layout="inline">
            <StandardFormRow title="组件类型" block style={{ paddingBottom: 11 }}>
              <Form.Item>
                <TagSelect
                  expandable
                  onChange={(value: any[]) => {
                    setFilterType(value);
                    onSearch(value, undefined);
                  }}
                >
                  {typeList.map(item => (
                    <TagSelect.Option key={item.id} value={item.id}>
                      {item.name}
                    </TagSelect.Option>
                  ))}
                </TagSelect>
              </Form.Item>
            </StandardFormRow>
            <StandardFormRow title="其它选项" grid last>
              <Row gutter={16}>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <Form.Item {...formItemLayout} label="配置名称">
                    <Input
                      onChange={e => {
                        setFilterName(e.target.value);
                        onSearch(undefined, e.target.value);
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </StandardFormRow>
          </Form>
        </Card>
        <br />
        <Card>
          <Table
            rowKey="id"
            loading={loading}
            columns={[
              {
                dataIndex: 'id',
                title: 'ID',
              },
              {
                dataIndex: 'name',
                title: '配置名称',
              },
              {
                dataIndex: 'type',
                title: '通知类型',
              },
              {
                dataIndex: 'provider',
                title: '服务商',
              },
              {
                dataIndex: 'option',
                title: '操作',
                render: (text, record: any) => (
                  <Fragment>
                    <a
                      onClick={() => {
                        setCurrentItem(record);
                        setSaveVisible(true);
                      }}
                    >
                      编辑
                    </a>
                    <Divider type="vertical" />
                    <a onClick={() => remove(record)}>删除</a>
                    <Divider type="vertical" />
                    <a onClick={() => downloadObject(record, '通知模版')}>下载配置</a>
                    <Divider type="vertical" />
                    <a onClick={() => debug(record)}>调试</a>
                  </Fragment>
                ),
              },
            ]}
            dataSource={noticeTemplate.result?.data}
            pagination={false}
          />
        </Card>
        {/* <Card>
                    <Tabs
                        onChange={key => {
                            setActiveType(key);
                            handlerSearch({
                                pageIndex: 0,
                                pageSize: 10,
                                terms: {
                                    type: key,
                                }
                            })
                        }}
                        activeKey={activeType}
                        tabPosition="left"
                        style={{ height: '60VH' }}>
                        {
                            typeList.map(item =>
                                <Tabs.TabPane
                                    tab={<span>{item.name}</span>}
                                    key={item.id}
                                >
                                    <Row>
                                        <Col span={8}>
                                            <Form.Item label="配置名称" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Button type="primary" style={{ marginTop: 2, marginRight: 10 }}>查询</Button>
                                            <Button style={{ marginTop: 2, marginRight: 10 }}>重置</Button>

                                        </Col>
                                    </Row>
                                    <Row style={{ marginBottom: 15 }}>
                                        <Button
                                            type="primary"
                                            style={{ marginTop: 2, marginRight: 10 }}
                                            onClick={() => {
                                                setCurrentItem({ type: activeType })
                                                setSaveVisible(true);
                                            }}
                                        >新建</Button>
                                        <Button style={{ marginTop: 2, marginRight: 10 }}>批量导出</Button>
                                        <Button style={{ marginTop: 2, marginRight: 10 }}>导入配置</Button>
                                    </Row>

                                </Tabs.TabPane>
                            )
                        }
                    </Tabs>
                </Card> */}
      </div>

      {saveVisible && (
        <Save
          data={currentItem}
          close={() => setSaveVisible(false)}
          save={(item: any) => saveData(item)}
        />
      )}
    </PageHeaderWrapper>
  );
};

export default connect(({ noticeTemplate, loading }: ConnectState) => ({
  noticeTemplate,
  loading: loading.models.noticeTemplate,
}))(Form.create<Props>()(Config));
