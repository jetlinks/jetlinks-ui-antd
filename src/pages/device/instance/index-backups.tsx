import React, { Fragment, useEffect, useState } from 'react';
import styles from '@/utils/table.less';
import { Badge, Button, Card, Divider, message, Modal, Popconfirm, Spin, Table, Upload } from 'antd';
import { router } from 'umi';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/lib/table';
import { FormComponentProps } from 'antd/es/form';
import { ConnectState, Dispatch } from '@/models/connect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import encodeQueryParam from '@/utils/encodeParam';
import apis from '@/services';
import { getAccessToken } from '@/utils/authority';
import moment from 'moment';
import { UploadProps } from 'antd/lib/upload';
import Save from './Save';
import Search from './Search';
import { DeviceInstance } from './data.d';
import Process from './Process';

const template = require('./template.xlsx');

interface Props extends FormComponentProps {
  loading: boolean;
  dispatch: Dispatch;
  deviceInstance: any;
}
interface State {
  data: any;
  searchParam: any;
  addVisible: boolean;
  currentItem: Partial<DeviceInstance>;
  processVisible: boolean;
  importLoading: boolean;
  action: string;
}

const DeviceInstancePage: React.FC<Props> = props => {
  const { result } = props.deviceInstance;
  const initState: State = {
    data: result,
    searchParam: { pageSize: 10 },
    addVisible: false,
    currentItem: {},
    processVisible: false,
    importLoading: false,
    action: '',
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [addVisible, setAddvisible] = useState(initState.addVisible);
  const [currentItem, setCurrentItem] = useState(initState.currentItem);
  const [importLoading, setImportLoading] = useState(initState.importLoading);
  const [action, setAction] = useState(initState.action);
  const { dispatch } = props;

  const statusMap = new Map();
  statusMap.set('在线', 'success');
  statusMap.set('离线', 'error');
  statusMap.set('未激活', 'processing');

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    dispatch({
      type: 'deviceInstance/query',
      payload: encodeQueryParam(params),
    });
  };

  const delelteInstance = (record: any) => {
    apis.deviceInstance
      .remove(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('操作成功');
          handleSearch(searchParam);
        }
      })
      .catch(() => {});
  };

  const changeDeploy = (record: any) => {
    apis.deviceInstance
      .changeDeploy(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('操作成功');
          handleSearch(searchParam);
        }
      })
      .catch(() => {});
  };

  const unDeploy = (record: any) => {
    apis.deviceInstance
      .unDeploy(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('操作成功');
          handleSearch(searchParam);
        }
      })
      .catch(() => {});
  };
  const columns: ColumnProps<DeviceInstance>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
    },
    {
      title: '注册时间',
      dataIndex: 'registryTime',
      width: '200px',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: record =>
        record ? <Badge status={statusMap.get(record.text)} text={record.text} /> : '',
    },
    {
      title: '描述',
      dataIndex: 'describe',
    },
    {
      title: '操作',
      width: '200px',
      align: 'center',
      render: (record: any) => (
        <Fragment>
          <a
            onClick={() => {
              router.push(`/device/instance/save/${record.id}`);
            }}
          >
            查看
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setCurrentItem(record);
              setAddvisible(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          {record.state?.value === 'notActive' ? (
            <span>
              <Popconfirm
                title="确认激活？"
                onConfirm={() => {
                  changeDeploy(record);
                }}
              >
                <a>激活</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title="确认删除？"
                onConfirm={() => {
                  delelteInstance(record);
                }}
              >
                <a>删除</a>
              </Popconfirm>
            </span>
          ) : (
            <Popconfirm
              title="确认注销设备？"
              onConfirm={() => {
                unDeploy(record);
              }}
            >
              <a>注销</a>
            </Popconfirm>
          )}
        </Fragment>
      ),
    },
  ];

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const saveDeviceInstance = (item: any) => {
    dispatch({
      type: 'deviceInstance/update',
      payload: encodeQueryParam(item),
      callback: (response:any) => {
        if (response.status === 200) {
          message.success('保存成功');
          setAddvisible(false);
          router.push(`/device/instance/save/${item.id}`);
        }
      },
    });
  };

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<DeviceInstance>,
  ) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam.terms,
      sorts: sorter,
    });
  };

  const [processVisible, setProcessVisible] = useState(false);

  const [api, setAPI] = useState<string>('');

  const getSearchParam = () => {
    const data = encodeQueryParam(searchParam);
    let temp = '';
    Object.keys(data).forEach((i: string) => {
      if (data[i] && i !== 'pageSize' && i !== 'pageIndex') {
        temp += `${i}=${data[i]}&`;
      }
    });
    return encodeURI(temp.replace(/%/g, '%'));
  };
  // 激活全部设备
  const startImport = () => {
    // let dt = 0;
    setProcessVisible(true);
    const activeAPI = `/jetlinks/device-instance/deploy?${getSearchParam()}:X_Access_Token=${getAccessToken()} `;
    setAPI(activeAPI);
    setAction('active');
  };

  const startSync = () => {
    setProcessVisible(true);
    const syncAPI = `/jetlinks/device-instance/state/_sync/?${getSearchParam()}:X_Access_Token=${getAccessToken()}`;
    setAPI(syncAPI);
    setAction('sync');
  };

  const activeDevice = () => {
    Modal.confirm({
      title: `确认激活全部设备`,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        startImport();
      },
    });
  };

  const syncDevice = () => {
    Modal.confirm({
      title: '确定同步设备真实状态?',
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        // 同步设备
        startSync();
      },
    });
  };

  const [uploading, setUploading] = useState(false);
  const exportDevice = () => {
    const formElement = document.createElement('form');
    formElement.style.display = 'display:none;';
    formElement.method = 'post';
    formElement.action = `/jetlinks/device-instance/export?:X_Access_Token=${getAccessToken()}`;
    const params = encodeQueryParam(searchParam);
    Object.keys(params).forEach((key: string) => {
      const inputElement = document.createElement('input');
      inputElement.type = 'hidden';
      inputElement.name = key;
      inputElement.value = params[key];
      formElement.appendChild(inputElement);
    });
    document.body.appendChild(formElement);
    formElement.submit();
    document.body.removeChild(formElement);
  };

  const uploadProps: UploadProps = {
    accept: '.xlsx, .xls',
    action: '/jetlinks/file/static',
    headers: {
      'X-Access-Token': getAccessToken(),
    },
    showUploadList: false,
    onChange(info) {
      if (info.file.status === 'done') {
        setUploading(false);
        const fileUrl = info.file.response.result;
        const url = `/jetlinks/device-instance/import?fileUrl=${fileUrl}&:X_Access_Token=${getAccessToken()}`;
        setAPI(url);
        setAction('import');
        setImportLoading(true);
      }
      if (info.file.status === 'uploading') {
        setUploading(true);
      }
    },
  };

  return (
    <PageHeaderWrapper title="设备管理">
      <Spin spinning={uploading} tip="上传中...">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Search
                search={(params: any) => {
                  setSearchParam(params);
                  handleSearch({ terms: params, pageSize: 10 });
                }}
              />
            </div>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => {
                  setCurrentItem({});
                  setAddvisible(true);
                }}
              >
                新建
              </Button>

              <Divider type="vertical" />

              <Button href={template} download="设备模版" icon="download">
                下载模版
              </Button>
              <Divider type="vertical" />
              <Button icon="download" type="default" onClick={() => exportDevice()}>
                导出设备
              </Button>
              <Divider type="vertical" />
              <Upload {...uploadProps}>
                <Button icon="upload">导入设备</Button>
              </Upload>
              <Divider type="vertical" />
              <Button icon="check-circle" type="danger" onClick={() => activeDevice()}>
                激活全部设备
              </Button>
              <Divider type="vertical" />
              <Button icon="sync" type="danger" onClick={() => syncDevice()}>
                同步设备状态
              </Button>
            </div>
            <div className={styles.StandardTable}>
              <Table
                loading={props.loading}
                columns={columns}
                dataSource={(result || {}).data}
                rowKey="id"
                onChange={onTableChange}
                pagination={{
                  current: result.pageIndex + 1,
                  total: result.total,
                  pageSize: result.pageSize,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50', '100'],
                  showTotal: (total: number) =>
                    `共 ${total} 条记录 第  ${result.pageIndex + 1}/${Math.ceil(
                      result.total / result.pageSize,
                    )}页`,
                }}
              />
            </div>
          </div>
        </Card>
        {addVisible && (
          <Save
            data={currentItem}
            close={() => {
              setAddvisible(false);
              setCurrentItem({});
            }}
            save={(item: any) => {
              saveDeviceInstance(item);
            }}
          />
        )}
        {(processVisible || importLoading) && (
          <Process
            api={api}
            action={action}
            closeVisible={() => {
              setProcessVisible(false);
              setImportLoading(false);
              handleSearch(searchParam);
            }}
          />
        )}
      </Spin>
    </PageHeaderWrapper>
  );
};

export default connect(({ deviceInstance, loading }: ConnectState) => ({
  deviceInstance,
  loading: loading.models.deviceInstance,
}))(DeviceInstancePage);
