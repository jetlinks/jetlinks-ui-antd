import React, { Fragment, useEffect, useState } from 'react';
import { Badge, Button, Card, Divider, message, Popconfirm, Spin, Table } from 'antd';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/lib/table';
import { DeviceInstance } from '@/pages/device/instance/data';
import moment from 'moment';
import { router } from 'umi';
import encodeQueryParam from '@/utils/encodeParam';
import apis from '@/services';
import Bind from '@/pages/device/gateway/bind';
import Save from '@/pages/device/instance/Save';
import styles from '@/utils/table.less';
import Search from '@/pages/device/instance/Search';

interface Props {
  deviceId: string;
  loading: boolean;
}

interface State {
  data: any;
  searchParam: any;
  currentItem: any;
  spinning: boolean;
  bindVisible: boolean;
  addVisible: boolean;
}

const Gateway: React.FC<Props> = (props) => {

  const initState: State = {
    data: {},
    searchParam: { pageSize: 10 },
    currentItem: {},
    spinning: false,
    bindVisible: false,
    addVisible: false,
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [data, setData] = useState(initState.data);
  const [spinning, setSpinning] = useState(initState.spinning);
  const [currentItem, setCurrentItem] = useState(initState.currentItem);
  const [addVisible, setAddVisible] = useState(initState.addVisible);
  const [bindVisible, setBindVisible] = useState(initState.bindVisible);

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    apis.deviceInstance.list(encodeQueryParam(params))
      .then((response: any) => {
          if (response.status === 200) {
            setData(response.result);
          }
          setSpinning(false);
        },
      ).catch(() => {
    });

  };

  useEffect(() => {
    setSpinning(true);
    handleSearch({
      pageSize: 10,
      terms: {
        parentId: props.deviceId,
      },
    });
  }, []);

  const changeDeploy = (record: any) => {
    setSpinning(true);
    apis.deviceInstance
      .changeDeploy(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('操作成功');
          handleSearch(searchParam);
        } else {
          setSpinning(false);
        }
      })
      .catch(() => {
      });
  };

  const unDeploy = (record: any) => {
    setSpinning(true);
    apis.deviceInstance
      .unDeploy(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('操作成功');
          handleSearch(searchParam);
        } else {
          setSpinning(false);
        }
      })
      .catch(() => {
      });
  };

  const unBindGateway = (id: string, deviceId: string) => {
    setSpinning(true);
    apis.deviceGateway.unBind(id, deviceId)
      .then(response => {
        if (response.status === 200) {
          message.success('解绑成功');
          handleSearch(searchParam);
        } else {
          setSpinning(false);
        }
      }).catch(() => {
    });
  };

  const statusMap = new Map();
  statusMap.set('online', 'success');
  statusMap.set('offline', 'error');
  statusMap.set('notActive', 'processing');

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
        record ? <Badge status={statusMap.get(record.value)} text={record.text}/> : '',
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
          <Divider type="vertical"/>
          <a
            onClick={() => {
              setCurrentItem(record);
              setAddVisible(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical"/>
          {record.state?.value === 'notActive' ? (
            <Popconfirm
              title="确认激活？"
              onConfirm={() => {
                changeDeploy(record);
              }}
            >
              <a>激活</a>
            </Popconfirm>
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

          <Divider type="vertical"/>
          <Popconfirm
            title="确认解绑？"
            onConfirm={() => {
              unBindGateway(props.deviceId, record.id);
            }}
          >
            <a>解绑</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

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

  const saveDeviceInstance = (item: any) => {
    setSpinning(true);
    apis.deviceInstance.saveOrUpdate(item)
      .then((response: any) => {
        if (response.status === 200) {
          message.success('保存成功');
          handleSearch(searchParam);
        } else {
          setSpinning(false);
        }
      }).catch(() => {
    });
  };

  const insert = (deviceData: any) => {
    setSpinning(true);
    apis.deviceGateway.bind(props.deviceId, deviceData).then(response => {
      if (response.status === 200) {
        message.success('保存成功');
        handleSearch(searchParam);
      } else {
        setSpinning(false);
      }
    }).catch(() => {
    });
  };

  const action = (
    <Button type="primary" icon="plus" onClick={() => setBindVisible(true)}>
      绑定子设备
    </Button>
  );

  return (
    <div>
      <Spin spinning={spinning}>
        <Card style={{ marginBottom: 20 }} title="子设备列表" extra={action}>
          <div className={styles.tableListForm}>
            <Search
              search={(params: any) => {
                setSearchParam(params);
                params.parentId = props.deviceId;
                handleSearch({ terms: params, pageSize: 10 });
              }}
            />
          </div>
          <Table
            loading={props.loading}
            columns={columns}
            dataSource={data?.data}
            rowKey="id"
            onChange={onTableChange}
            pagination={{
              current: data.pageIndex + 1,
              total: data.total,
              pageSize: data.pageSize,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total: number) =>
                `共 ${total} 条记录 第  ${data.pageIndex + 1}/${Math.ceil(
                  data.total / data.pageSize,
                )}页`,
            }}
          />
        </Card>
        {addVisible && (
          <Save
            data={currentItem}
            close={() => {
              setAddVisible(false);
              setCurrentItem({});
            }}
            save={(item: any) => {
              setAddVisible(false);
              saveDeviceInstance(item);
            }}
          />
        )}

        {bindVisible && (
          <Bind selectionType='checkbox'
                close={() => {
                  setBindVisible(false);
                }}
                save={(item: any) => {
                  setBindVisible(false);
                  insert(item);
                }}
          />
        )}
      </Spin>
    </div>
  );
};

export default Gateway;
