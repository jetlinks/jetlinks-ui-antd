import {Badge, message, Modal, Table} from "antd";
import React, {useEffect, useState} from "react";
import styles from '@/utils/table.less';
import SearchForm from "@/components/SearchForm";
import {ColumnProps} from "antd/lib/table";
import Service from "../service";
import encodeQueryParam from "@/utils/encodeParam";
import ProTable from "@/pages/system/permission/component/ProTable";

interface Props {
  cascadeId: string;
  close: Function;
}

interface State {
  searchParam: any;
}

const initState: State = {
  searchParam: {pageIndex:0,pageSize: 10, terms: location?.query?.terms, sorts: {field: 'id', order: 'desc'}},
};
const ChoiceChannel: React.FC<Props> = props => {

  const {cascadeId} = props;

  const service = new Service('media/channel');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any[]>([]);
  const [bindList, setBindList] = useState<string[]>([]);

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [fixedParam] = useState({terms: {id$cascade_channel: props.cascadeId}, sorts: {field: 'id', order: 'desc'}});
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
    setLoading(true);
    _bind_cascade_channel(fixedParam);
    _channel(searchParam);
  }, []);

  const _bind_cascade_channel = (params?: any) => {
    setLoading(true);
    service.deviceChannelNoPaging(encodeQueryParam(params)).subscribe(
      (data: any) => {
        let list: string[] = [];
        data.map((item: any) => {
          list.push(item.id);
        });
        setBindList(list);
      },
      () => {
      },
      () => setLoading(false));
  };

  const _channel = (params?: any) => {
    setSearchParam(params);
    service.deviceChannel(encodeQueryParam(params)).subscribe(
      (data) => setResult(data),
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
      dataIndex: 'ptzType',
      width: 100,
      render: record => ptzType.get(record?.value || 0),
      ellipsis: true,
    },
    {
      title: '在线状态',
      dataIndex: 'status',
      width: 110,
      render: record => record ? <Badge status={statusMap.get(record.value)} text={record.text}/> : '',
    },
    {
      title: '子通道数',
      dataIndex: 'subCount',
      width: 100,
    },
  ];

  const unbindSelection = {
    onChange: (selectedRowKeys: any) => {
      setBindList(selectedRowKeys);
    },
    onSelect: (record: any, selected: any) => {
      setLoading(true);
      let list: string[] = [record.id];
      if (selected) {
        _bind(list);
      } else {
        _unbind(list);
      }
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      setLoading(true);
      let list: string[] = [];
      changeRows.map((item: any) => {
        list.push(item.id);
      });
      if (selected) {
        _bind(list);
      } else {
        _unbind(list);
      }
    },
  };

  const _bind = (channelId: string[]) => {
    service._bind(cascadeId, channelId).subscribe(
      () => {
        message.success('绑定成功');
        _bind_cascade_channel(fixedParam);
      },
      () => {
        message.error('绑定失败')
      },
      () => {
      });
  };

  const _unbind = (channelId: string[]) => {
    service._unbind(cascadeId, channelId).subscribe(
      () => {
        message.success('解绑成功');
        _bind_cascade_channel(fixedParam);
      },
      () => {
        message.error('解绑失败')
      },
      () => {
      });
  };

  return (
    <Modal
      width='50VW'
      title='选择通道'
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
              searchParam.terms = params;
              _channel(searchParam);
            }}
            formItems={[
              {
                label: '通道编码',
                key: 'channelId$LIKE',
                type: 'string',
              },
              {
                label: '通道名称',
                key: 'name$LIKE',
                type: 'string',
              },
            ]}
          />
        </div>
      </div>
      <div className={styles.StandardTable}>
        <ProTable
          loading={loading}
          dataSource={result?.data}
          columns={columns}
          rowKey="id"
          rowSelection={{
            selectedRowKeys: bindList,
            ...unbindSelection,
          }}
          onSearch={(params: any) => {
            params.sorts = params.sorts.field ? params.sorts : {field: 'id', order: 'desc'};
            _channel(params);
          }}
          paginationConfig={result}/>
      </div>

    </Modal>
  )
};
export default ChoiceChannel;
