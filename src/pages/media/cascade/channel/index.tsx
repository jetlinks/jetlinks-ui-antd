import {Badge, Button, message, Modal, Table, Tabs} from "antd";
import React, {useEffect, useState} from "react";
import styles from '@/utils/table.less';
import SearchForm from "@/components/SearchForm";
import {ColumnProps, PaginationConfig, SorterResult} from "antd/lib/table";
import Service from "../service";
import encodeQueryParam from "@/utils/encodeParam";

interface Props {
  cascadeId: string;
  close: Function;
}

interface State {
  searchParam: any;
}

const initState: State = {
  searchParam: {terms: {}, sorts: {field: 'id', order: 'desc'}},
};
const ChoiceChannel: React.FC<Props> = props => {

  const {cascadeId} = props;

  const service = new Service('media/channel');
  const [loading, setLoading] = useState<boolean>(false);
  const [bindOrUnbind, setBindOrUnbind] = useState<string>('');
  const [bindChannelId, setBindChannelId] = useState<any[]>([]);
  const [unbindChannelId, setUnbindChannelId] = useState<any[]>([]);
  const [result, setResult] = useState<any[]>([]);

  const [searchParam] = useState(initState.searchParam);
  const statusMap = new Map();
  statusMap.set('online', 'success');
  statusMap.set('offline', 'error');
  statusMap.set('notActive', 'processing');

  const ptzType = new Map();
  ptzType.set(0, '未知');
  ptzType.set(1, '球体');
  ptzType.set(2, '半球体');
  ptzType.set(3, '固定枪机');
  ptzType.set(4, '遥控枪机');

  useEffect(() => {
    searchParam.terms = {id$cascade_channel: props.cascadeId};
    _bind_cascade_channel(searchParam);
  }, []);

  const _bind_cascade_channel = (params?: any) => {
    setLoading(true);
    service.mediaDeviceNoPaging(encodeQueryParam(params)).subscribe(
      (data) => {
        const temp = data.map((item: any) => ({parentId: item.parentChannelId, ...item}));
        setResult(temp);
      },
      () => {
      },
      () => setLoading(false));
  };

  const _unbind_cascade_channel = (params?: any) => {
    setLoading(true);
    service.mediaDeviceNoPaging(encodeQueryParam(params)).subscribe(
      (data) => {
        const temp = data.map((item: any) => ({parentId: item.parentChannelId, ...item}));
        setResult(temp);
      },
      () => {
      },
      () => setLoading(false));
  };


  const columns: ColumnProps<any>[] = [
    {
      title: '通道国标编号',
      dataIndex: 'channelId',
      ellipsis: true,
    },
    {
      title: '通道名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '厂商',
      dataIndex: 'manufacturer',
      ellipsis: true,
    },
    {
      title: '安装地址',
      dataIndex: 'address',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '云台类型',
      dataIndex: 'others.ptzType',
      width: 100,
      render: record => ptzType.get(record),
      ellipsis: true,
    },
    {
      title: '在线状态',
      dataIndex: 'status',
      width: 110,
      render: record => record ? <Badge status={statusMap.get(record.value)} text={record.text}/> : '',
      filters: [
        {
          text: '离线',
          value: 'offline',
        },
        {
          text: '在线',
          value: 'online',
        },
      ],
      filterMultiple: false,
    },
    {
      title: '子通道数',
      dataIndex: 'subCount',
      width: 100,
    },
  ];

  const bindTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<any>,
  ) => {
    filters['id$cascade_channel'] = props.cascadeId;
    searchParam.terms = filters;
    searchParam.sorts = sorter.field ? sorter : {field: 'id', order: 'desc'};

    _bind_cascade_channel(searchParam);
  };

  const unbindTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<any>,
  ) => {
    filters['id$cascade_channel'] = props.cascadeId;
    searchParam.terms = filters;
    searchParam.sorts = sorter.field ? sorter : {field: 'id', order: 'desc'};

    _bind_cascade_channel(searchParam);
  };

  const bindSelection = {
    onChange: (selectedRowKeys: any) => {
      setBindChannelId(selectedRowKeys);
    },
  };

  const unbindSelection = {
    onChange: (selectedRowKeys: any) => {
      setUnbindChannelId(selectedRowKeys);
    },
  };

  const _bind = () => {
    if (bindChannelId.length === 0) {
      message.error('请选择需绑定的通道');
      return;
    }
    service._bind(cascadeId, bindChannelId).subscribe(
      (data) => {
        console.log(data);
      },
      () => {
      },
      () => {
        setBindChannelId([]);
        setLoading(false);
      });
  };

  const _unbind = () => {
    if (bindChannelId.length === 0) {
      message.error('请选择需解绑的通道');
      return;
    }
    service._unbind(cascadeId, unbindChannelId).subscribe(
      (data) => {
        console.log(data);
      },
      () => {
      },
      () => {
        setUnbindChannelId([]);
        setLoading(false);
      });
  };
  return (
    <Modal
      width='50VW'
      title={`选择通道`}
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        props.close()
      }}
      onCancel={() => props.close()}
    >
      <div className={styles.tableList} style={{marginTop: -22}}>
        <div>
          <SearchForm
            search={(params: any) => {
              if (bindOrUnbind === 'channels_bind') {
                params['id$cascade_channel'] = props.cascadeId;
                _bind_cascade_channel(searchParam);
              } else {
                params['id$cascade_channel$not'] = props.cascadeId;
                _unbind_cascade_channel(searchParam);
              }
            }}
            formItems={[
              {
                label: '名称',
                key: 'name$LIKE',
                type: 'string',
              },
            ]}
          />
        </div>
      </div>
      <Tabs defaultActiveKey="channels_bind" tabPosition="top" type="card"
            onTabClick={(value: string) => {
              setBindOrUnbind(value);
              if (value === 'channels_bind') {
                searchParam.terms = {id$cascade_channel: props.cascadeId};
                _bind_cascade_channel(searchParam);
              } else {
                searchParam.terms = {id$cascade_channel$not: props.cascadeId};
                _unbind_cascade_channel(searchParam);
              }
            }}>
        <Tabs.TabPane tab="已绑定通道" key="channels_bind">
          <div style={{paddingBottom: 10}}>
            <Button icon="close" type="primary" onClick={() => {
              setLoading(true);
              _unbind();
            }}>
              解绑
            </Button>
          </div>
          <div className={styles.StandardTable}>
            <Table
              loading={loading}
              dataSource={result}
              columns={columns}
              rowKey="id"
              rowSelection={{
                type: 'checkbox',
                ...bindSelection,
              }}
              onChange={bindTableChange}
              pagination={{
                pageSize: 10
              }}/>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="未绑定通道" key="channels_unbind">
          <div style={{paddingBottom: 10}}>
            <Button icon="check" type="primary" onClick={() => {
              setLoading(true);
              _bind();
            }}>
              绑定
            </Button>
          </div>
          <div className={styles.StandardTable}>
            <Table
              loading={loading}
              dataSource={result}
              columns={columns}
              rowKey="id"
              rowSelection={{
                type: 'checkbox',
                ...unbindSelection,
              }}
              onChange={unbindTableChange}
              pagination={{
                pageSize: 10
              }}/>
          </div>
        </Tabs.TabPane>
      </Tabs>

    </Modal>
  )
};
export default ChoiceChannel;
