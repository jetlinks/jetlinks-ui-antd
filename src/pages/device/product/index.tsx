import React, { Fragment, useEffect, useState } from 'react';
import styles from '@/utils/table.less';
import { DeviceProduct } from '@/pages/device/product/data';
import Search from './search';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Badge, Button, Card, Divider, Icon, message, Popconfirm, Table, Upload } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import { CommonEnum, SimpleResponse } from '@/utils/common';
import moment from 'moment';
import { connect } from 'dva';
import { ConnectState, Dispatch } from '@/models/connect';
import { router } from 'umi';
import encodeQueryParam from '@/utils/encodeParam';
import { SorterResult } from 'antd/es/table';
import { UploadProps } from 'antd/lib/upload';
import { getAccessToken } from '@/utils/authority';
import request from '@/utils/request';
import Save from './save';
import { downloadObject } from '@/utils/utils';

interface Props {
  dispatch: Dispatch;
  deviceProduct: any;
  location: Location;
  loading: boolean;
}

interface State {
  data: any;
  searchParam: any;
  saveVisible: boolean;
}

const DeviceModel: React.FC<Props> = props => {
  const {result} = props.deviceProduct;
  const initState: State = {
    data: result,
    searchParam: { pageSize: 10 },
    saveVisible: false,
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);

  const { dispatch } = props;

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    dispatch({
      type: 'deviceProduct/query',
      payload: encodeQueryParam(params),
    });
  };

  const deploy = (record: any) => {
    dispatch({
      type: 'deviceProduct/deploy',
      payload: record.id,
      callback: response => {
        if (response.status === 200) {
          message.success('操作成功');
          handleSearch(searchParam);
        }
      },
    });
  };
  const unDeploy = (record: any) => {
    dispatch({
      type: 'deviceProduct/unDeploy',
      payload: record.id,
      callback: response => {
        if (response.status === 200) {
          message.success('操作成功');
          handleSearch(searchParam);
        }
      },
    });
  };

  const handleDelete = (params: any) => {
    dispatch({
      type: 'deviceProduct/remove',
      payload: params.id,
      callback: response => {
        if (response.status === 200) {
          message.success('删除成功');
          handleSearch(searchParam);
        }
      },
    });
  };

  const columns: ColumnProps<DeviceProduct>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '250px',
    },
    {
      title: '型号名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'deviceType',
      width: '150px',
      align: 'center',
      render: (text: CommonEnum) => (text || {}).text,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '200px',
      align: 'center',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
    },
    {
      title: '发布状态',
      dataIndex: 'state',
      align: 'center',
      render: (text: any) => {
        const color = text === 0 ? 'red' : 'green';
        const status = text === 0 ? '未发布' : '已发布';
        return <Badge color={color} text={status} />;
      },
    },
    {
      title: '操作',
      width: '300px',
      align: 'center',
      render: (record: DeviceProduct) => (
        <Fragment>
          <a
            onClick={() => {
              router.push(`/device/product/save/${record.id}`);
            }}
          >
            查看
          </a>
          <Divider type="vertical" />
          {record.state === 0 ? (
            <span>
              <Popconfirm
                title="确认发布？"
                onConfirm={() => {
                  deploy(record);
                }}
              >
                <a>发布</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          ) : (
            <Popconfirm
              title="确认停用"
              onConfirm={() => {
                unDeploy(record);
              }}
            >
              <a>停用</a>
            </Popconfirm>
          )}
          <Divider type="vertical" />
          <a
            onClick={() => {
              downloadObject(record, '设备型号');
            }}
          >
            下载配置
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              router.push(`/device/instance?productId$LIKE=${record.id}`);
            }}
          >
            查看设备
          </a>
        </Fragment>
      ),
    },
  ];

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const handeSave = (record: any) => {
    dispatch({
      type: 'deviceProduct/insert',
      payload: record,
      callback: response => {
        if (response.status === 200) {
          setSaveVisible(false);
          message.success('保存成功');
          router.push(`/device/product/save/${record.id}`);
        }
      },
    });
  };

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<DeviceProduct>
  ) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam,
      sorts: sorter,
    });
  };
  const uploadProps: UploadProps = {
    accept: '.json',
    action: '/jetlinks/file/static',
    headers: {
      'X-Access-Token': getAccessToken(),
    },
    showUploadList: false,
    onChange(info) {
      if (info.file.status === 'done') {
        const fileUrl = info.file.response.result;
        request(fileUrl, { method: 'GET' }).then(e => {
          dispatch({
            type: 'deviceProduct/insert',
            payload: e,
            callback: (response: SimpleResponse) => {
              if (response.status === 200) {
                message.success('导入成功');
                handleSearch(searchParam);
              }
            },
          });
        });
      }
    },
  };

  return (
    <PageHeaderWrapper title="设备型号">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div>
            <Search
              search={(params: any) => {
                setSearchParam(params);
                handleSearch({ terms: params, pageSize: 10 });
              }}
            />
          </div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => setSaveVisible(true)}>
              新建
            </Button>
            <Divider type="vertical" />
            <Upload {...uploadProps}>
              <Button>
                <Icon type="upload" /> 导入配置
              </Button>
            </Upload>
          </div>
          <div className={styles.StandardTable}>
            <Table
              loading={props.loading}
              dataSource={(result || {}).data}
              columns={columns}
              rowKey='id'
              onChange={onTableChange}
              pagination={{
                current: result.pageIndex + 1,
                total: result.total,
                pageSize: result.pageSize,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total: number) => (
                    `共 ${total} 条记录 第  ${
                    result.pageIndex + 1
                    }/${
                    Math.ceil(result.total / result.pageSize)
                    }页`
                  ),
              }}
            />
          </div>
        </div>
      </Card>
      {saveVisible && <Save close={() => setSaveVisible(false)} save={item => handeSave(item)} />}
    </PageHeaderWrapper>
  );
};
export default connect(({ deviceProduct, loading }: ConnectState) => ({
  deviceProduct,
  loading: loading.models.deviceProduct,
}))(DeviceModel);
