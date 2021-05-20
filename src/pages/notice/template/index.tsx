import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Fragment, useEffect, useState } from 'react';
import { Button, Card, Col, Divider, Form, Icon, Input, message, Popconfirm, Row, Table } from 'antd';
import apis from '@/services';
import { ConnectState, Dispatch } from '@/models/connect';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import encodeQueryParam from '@/utils/encodeParam';
import { downloadObject } from '@/utils/utils';
import { PaginationConfig } from 'antd/lib/table';
import Save from './save';
import StandardFormRow from '../components/standard-form-row';
import TagSelect from '../components/tag-select';
import styles from '../index.less';
import Debug from './debugger';
import Upload from 'antd/lib/upload';
import { getAccessToken } from '@/utils/authority';

interface Props extends FormComponentProps {
  dispatch: Dispatch;
  noticeTemplate: any;
  loading: boolean;
}

interface State {
  typeList: any[];
  activeType: string;
  saveVisible: boolean;
  currentItem: any;
  searchParam: any;
  filterType: string[];
  filterName: string;
  debugVisible: boolean;
}

const formItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const Template: React.FC<Props> = props => {
  const { noticeTemplate, loading, dispatch } = props;

  const initState: State = {
    typeList: [],
    activeType: '',
    saveVisible: false,
    currentItem: {},
    searchParam: {},
    filterType: [],
    filterName: '',
    debugVisible: false,
  };
  const [typeList, setTypeList] = useState(initState.typeList);
  // const [activeType, setActiveType] = useState(initState.activeType);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [currentItem, setCurrentItem] = useState(initState.currentItem);
  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [filterType, setFilterType] = useState(initState.filterType);
  const [filterName, setFilterName] = useState(initState.filterName);
  const [debugVisible, setDebugVisible] = useState(initState.debugVisible);

  const handlerSearch = (params?: any) => {
    const temp = params;
    temp.sorts = {
      field: 'id',
      order: 'desc',
    };
    dispatch({
      type: 'noticeTemplate/query',
      payload: encodeQueryParam(temp),
    });
    setSearchParam(temp);
  };

  const onSearch = (type?: string[], name?: string) => {
    const tempType = type || filterType;
    const tempName = name || filterName;

    dispatch({
      type: 'noticeTemplate/query',
      payload: encodeQueryParam({
        paging: false,
        sorts: {
          field: 'id',
          order: 'desc',
        },
        terms: {
          type$IN: tempType,
          name$LIKE: name === '' ? undefined : tempName,
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
      type: 'noticeTemplate/remove',
      payload: record.id,
      callback: (res) => {
        if (res.status === 200) {
          message.success('删除成功');
          handlerSearch(searchParam);
        }
      },
    });
  };

  const saveData = (item: any) => {
    dispatch({
      type: 'noticeTemplate/insert',
      payload: item,
      callback: (res) => {
        if (res.status === 200) {
          message.success('保存成功');
          setSaveVisible(false);
          handlerSearch(searchParam);
        }
      },
    });
  };

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: any,
    // extra: any,
  ) => {
    handlerSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam,
      sorts: sorter,
    });
  };

  const uploadProps = (item: any) => {
    dispatch({
      type: 'noticeTemplate/insert',
      payload: item,
      callback: (res) => {
        if (res.status === 200) {
          message.success('导入成功');
          handlerSearch(searchParam);
        }
      },
    });
  };

  /*const uploadProps: UploadProps = {
    accept: '.json',
    action: '/jetlinks/file/static',
    headers: {
      'X-Access-Token': getAccessToken(),
    },
    showUploadList: false,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        const fileUrl = info.file.response.result;
        request(fileUrl, { method: 'GET' }).then(e => {
          dispatch({
            type: 'noticeTemplate/insert',
            payload: e,
            callback: () => {
              message.success('导入成功');
              handlerSearch(searchParam);
            },
          });
        });
      }
      if (info.file.status === 'error') {
        message.error(`${info.file.name} 导入失败.`);
      }
    },
  };*/

  return (
    <PageHeaderWrapper title="通知模版">
      <div className={styles.filterCardList}>
        <Card bordered={false}>
          <Form layout="inline">
            <StandardFormRow title="组件类型" block style={{ paddingBottom: 11 }}>
              <Form.Item>
                <TagSelect
                  // expandable
                  onChange={(value: any[]) => {
                    setFilterType(value);
                    onSearch(value, undefined);
                  }}
                >
                  {typeList?.map(item => (
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
                        const tempValue = e.target.value;
                        setFilterName(tempValue);
                        onSearch(undefined, tempValue === '' ? undefined : tempValue);
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
          <Button
            onClick={() => {
              setCurrentItem({});
              setSaveVisible(true);
            }}
            type="primary"
            style={{ marginBottom: 16 }}
          >
            新建
          </Button>
          <Divider type="vertical" />
          <Button
            onClick={() => {
              downloadObject(noticeTemplate.result?.data, '通知模板');
            }}
            style={{ marginBottom: 16 }}
          >
            导出配置
          </Button>
          <Divider type="vertical" />
          {/*<Upload {...uploadProps}>
            <Button type="primary" style={{ marginBottom: 16 }}>
              导入配置
            </Button>
          </Upload>*/}
          <Upload
          action="/jetlinks/file/static"
          headers={{
            'X-Access-Token': getAccessToken(),
          }}
            showUploadList={false} accept='.json'
            beforeUpload={(file) => {
              const reader = new FileReader();
              reader.readAsText(file);
              reader.onload = (result) => {
                try {
                  uploadProps(JSON.parse(result.target.result));
                } catch (error) {
                  message.error('文件格式错误');
                }
              }
            }}
          >
            <Button>
              <Icon type="upload" />导入配置
            </Button>
          </Upload>

          <Table
            rowKey="id"
            onChange={onTableChange}
            loading={loading}
            columns={[
              {
                dataIndex: 'id',
                title: 'ID',

                defaultSortOrder: 'descend',
              },
              {
                dataIndex: 'name',
                title: '模版名称',
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
                    <Popconfirm
                      title="确认删除？"
                      onConfirm={() => {
                        remove(record);
                      }}
                    >
                      <a>删除</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <a onClick={() => downloadObject(record, '通知模版')}>下载配置</a>
                    <Divider type="vertical" />
                    <a
                      onClick={() => {
                        setCurrentItem(record);
                        setDebugVisible(true);
                      }}
                    >
                      调试
                    </a>
                  </Fragment>
                ),
              },
            ]}
            dataSource={noticeTemplate.result?.data}
            pagination={{
              current: noticeTemplate.result?.pageIndex + 1,
              total: noticeTemplate.result?.total,
              pageSize: noticeTemplate.result?.pageSize,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total: number) =>
                `共 ${total} 条记录 第  ${noticeTemplate.result?.pageIndex + 1}/${Math.ceil(
                  noticeTemplate.result?.total / noticeTemplate.result?.pageSize,
                )}页`,
            }}
          />
        </Card>
      </div>

      {saveVisible && (
        <Save
          data={currentItem}
          close={() => setSaveVisible(false)}
          save={(item: any) => saveData(item)}
        />
      )}
      {debugVisible && <Debug data={currentItem} close={() => setDebugVisible(false)} />}
    </PageHeaderWrapper>
  );
};

export default connect(({ noticeTemplate, loading }: ConnectState) => ({
  noticeTemplate,
  loading: loading.models.noticeTemplate,
}))(Form.create<Props>()(Template));
