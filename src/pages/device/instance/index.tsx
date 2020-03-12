import React, { Fragment, useEffect, useState } from 'react';
import styles from '@/utils/table.less';
import {
  Divider,
  Card,
  Table,
  Badge,
  Button,
  message,
  Modal,
  Popconfirm,
  Upload,
  Spin,
} from 'antd';
import { router } from 'umi';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/lib/table';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch, ConnectState } from '@/models/connect';
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
  activeCount: number;
  processVisible: boolean;
  importLoading: boolean;
}

const DeviceInstancePage: React.FC<Props> = props => {
  const { result } = props.deviceInstance;
  const initState: State = {
    data: result,
    searchParam: { pageSize: 10 },
    addVisible: false,
    currentItem: {},
    activeCount: 0,
    processVisible: false,
    importLoading: false,
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [addVisible, setAddvisible] = useState(initState.addVisible);
  const [currentItem, setCurrentItem] = useState(initState.currentItem);
  const [importLoading, setImportLoading] = useState(initState.importLoading);
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
      title: '设备型号',
      dataIndex: 'productName',
    },
    {
      title: '注册时间',
      dataIndex: 'registryTime',
      width: '200px',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
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
              title="确认取消激活？"
              onConfirm={() => {
                unDeploy(record);
              }}
            >
              <a>取消激活</a>
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
      callback: () => {
        message.success('保存成功');
        setAddvisible(false);
        handleSearch(searchParam);
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
  const [flag, setFlag] = useState(false);
  const [count, setCount] = useState(initState.activeCount);
  const [eventSource, setSource] = useState<any>();

  const getSearchParam = () => {
    const data = encodeQueryParam(searchParam);
    let temp = '';
    Object.keys(data).forEach((i: string) => {
      if (data[i] && i !== 'pageSize' && i !== 'pageIndex') {
        temp += `${i}=${data[i]}&`;
      }
    });
    return encodeURI(temp.replace(/%/g, '%25'));
  };
  // 激活全部设备
  const startImport = () => {
    let dt = 0;
    setProcessVisible(true);
    // const source = new EventSource(`${origin}/device-instance/deploy?:X_Access_Token=${getAccessToken()}`);
    const source = new EventSource(
      `/jetlinks/device-instance/deploy?${getSearchParam()}:X_Access_Token=${getAccessToken()} `,
    );
    source.onmessage = e => {
      const temp = JSON.parse(e.data).total;
      dt += temp;
      setCount(dt);
    };
    source.onerror = () => {
      setFlag(false);
      source.close();
    };
    source.onopen = () => {
      setFlag(true);
    };
    setSource(source);
  };

  const startSync = () => {
    let dt = 0;
    setProcessVisible(true);
    // http://2.jetlinks.org:9010/device-instance/state/_sync/?_=1&:X_Access_Token=96fcd43594a2cd467dc2b9581c49a79a
    const source = new EventSource(
      `/jetlinks/device-instance/state/_sync/?${getSearchParam()}:X_Access_Token=${getAccessToken()}`,
    );

    source.onmessage = e => {
      const temp = parseInt(e.data, 10);
      dt += temp;
      setCount(dt);
    };

    source.onerror = () => {
      setFlag(false);
      source.close();
    };

    source.onopen = () => {
      setFlag(true);
    };
    setSource(source);
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
    accept: '.xlsx',
    action: '/jetlinks/file/static',
    headers: {
      'X-Access-Token': getAccessToken(),
    },
    showUploadList: false,
    onChange(info) {
      setImportLoading(true);
      if (info.file.status === 'done') {
        let dt = 0;
        const fileUrl = info.file.response.result;
        const source = new EventSource(
          `/jetlinks/device-instance/import?fileUrl=${fileUrl}&:X_Access_Token=${getAccessToken()}`,
        );
        source.onmessage = e => {
          const res = JSON.parse(e.data);
          if (res.success) {
            const temp = res.total;
            dt += temp;
            setCount(dt);
          } else {
            message.error(res.message);
          }
        };
        source.onerror = () => {
          setImportLoading(false);
          source.close();
        };
        source.onopen = () => {
          setImportLoading(true);
          // console.log('daoru open');
          // setFlag(true);
        };
        // request(fileUrl, { method: 'GET' }).then(e => {
        //   dispatch({
        //     type: 'deviceProduct/insert',
        //     payload: e,
        //     callback: () => {
        //       message.success('导入成功');
        //     },
        //   });
        // });
      }
    },
  };

  return (
    <PageHeaderWrapper title="设备实例">
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
            <Button href={template} download="设备实例模版" icon="download">
              下载模版
            </Button>
            <Divider type="vertical" />
            <Button icon="download" type="default" onClick={() => exportDevice()}>
              导出实例
            </Button>
            <Divider type="vertical" />
            <Upload {...uploadProps}>
              <Button icon="upload">导入实例</Button>
            </Upload>
            <Divider type="vertical" />
            <Button icon="plus" type="danger" onClick={() => activeDevice()}>
              激活全部设备
            </Button>
            <Divider type="vertical" />
            <Button icon="sync" type="danger" onClick={() => syncDevice()}>
              同步设备状态
            </Button>
          </div>
          <div className={styles.StandardTable}>
            <Spin spinning={importLoading} tip="导入中">
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
            </Spin>
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
      {processVisible && (
        <Modal
          title="当前进度"
          visible
          confirmLoading={flag}
          onOk={() => {
            setProcessVisible(false);
            setCount(0);
            eventSource.close();
          }}
          onCancel={() => {
            setProcessVisible(false);
            setCount(0);
            eventSource.close();
          }}
        >
          {flag ? (
            <Badge status="processing" text="进行中" />
          ) : (
            <Badge status="success" text="已完成" />
          )}
          <p>总数量:{count}</p>
        </Modal>
      )}
    </PageHeaderWrapper>
  );
};

export default connect(({ deviceInstance, loading }: ConnectState) => ({
  deviceInstance,
  loading: loading.models.deviceInstance,
}))(DeviceInstancePage);
