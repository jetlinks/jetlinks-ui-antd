import {PageHeaderWrapper} from "@ant-design/pro-layout"
import {Badge, Button, Card, Divider, message, Popconfirm, Table} from "antd";
import React, {Fragment, useEffect, useState} from "react";
import styles from '@/utils/table.less';
import SearchForm from "@/components/SearchForm";
import ProTable from "@/pages/system/permission/component/ProTable";
import {ColumnProps} from "antd/lib/table";
import Service from "./service";
import encodeQueryParam from "@/utils/encodeParam";
import SaveCascade from "./save/index";
import ChoiceChannel from './channel/index';

interface Props {

}

interface State {
  searchParam: any;
}

const initState: State = {
  searchParam: {pageSize: 10, terms: location?.query?.terms, sorts: {field: 'id', order: 'desc'}},
};
const MediaCascade: React.FC<Props> = () => {
  const service = new Service('media/gb28181-cascade');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>({});
  const [saveVisible, setSaveVisible] = useState<boolean>(false);
  const [choiceVisible, setChoiceVisible] = useState<boolean>(false);
  const [mediaCascade, setMediaCascade] = useState<any>({});
  const [cascadeId, setCascadeId] = useState<string>('');

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const statusMap = new Map();
  statusMap.set('enabled', 'success');
  statusMap.set('disabled', 'error');

  const onlineStatusMap = new Map();
  onlineStatusMap.set('online', 'success');
  onlineStatusMap.set('offline', 'error');

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    setLoading(true);
    service.query(encodeQueryParam(params)).subscribe(
      (data) => setResult(data),
      () => {
      },
      () => setLoading(false))
  };

  const expandedRowRender = (record: any) => {
    const columns = [
      {
        title: '集群节点ID',
        dataIndex: 'clusterNodeId',
        ellipsis: true,
      },
      {
        title: 'SIP服务国标编号',
        dataIndex: 'sipId',
        ellipsis: true,
      },
      {
        title: 'SIP服务IP',
        dataIndex: 'remoteAddress',
        ellipsis: true,
      },
      {
        title: 'SIP服务域',
        dataIndex: 'domain',
        ellipsis: true,
      },
      {
        title: 'SIP服务端口',
        dataIndex: 'remotePort',
        width: 150,
        ellipsis: true,
      },
      {
        title: '设备国标编号',
        dataIndex: 'user',
        ellipsis: true,
      },
      {
        title: '注册周期(秒)',
        dataIndex: 'registerInterval',
        width: 150,
        ellipsis: true,
      },
      {
        title: '心跳周期(秒)',
        dataIndex: 'keepaliveInterval',
        width: 150,
        ellipsis: true,
      },
      {
        title: '传输信令',
        dataIndex: 'transport',
        width: 100,
        ellipsis: true,
      },
      {
        title: '字符集',
        dataIndex: 'charset',
        width: 100,
        ellipsis: true,
      },
    ];

    return <Table columns={columns} scroll={{x: '130%'}} dataSource={record.sipConfigs} pagination={false}/>;
  };

  const columns: ColumnProps<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      ellipsis: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '是否启用',
      dataIndex: 'status',
      width: 120,
      render: record => record ? <Badge status={statusMap.get(record.value)} text={record.text}/> : '/',
      filters: [
        {
          text: '禁用',
          value: 'disabled',
        },
        {
          text: '启用',
          value: 'enabled',
        },
      ],
      filterMultiple: false,
    },
    {
      title: '连接状态',
      dataIndex: 'onlineStatus',
      width: 120,
      render: record => record ? <Badge status={onlineStatusMap.get(record.value)} text={record.text}/> : '/',
      filters: [
        {
          text: '在线',
          value: 'online',
        },
        {
          text: '离线',
          value: 'offline',
        },
      ],
      filterMultiple: false,
    },
    {
      title: '集群节点ID',
      dataIndex: 'sipConfigs[0].clusterNodeId',
      ellipsis: true,
    },
    {
      title: 'SIP服务国标编号',
      dataIndex: 'sipConfigs[0].sipId',
      ellipsis: true,
    },
    {
      title: 'SIP服务IP',
      dataIndex: 'sipConfigs[0].remoteAddress',
      ellipsis: true,
    },
    {
      title: 'SIP服务域',
      dataIndex: 'sipConfigs[0].domain',
      ellipsis: true,
    },
    {
      title: 'SIP服务端口',
      dataIndex: 'sipConfigs[0].remotePort',
      ellipsis: true,
    },
    {
      title: '设备国标编号',
      dataIndex: 'sipConfigs[0].user',
      ellipsis: true,
    },
    {
      title: '注册周期(秒)',
      dataIndex: 'sipConfigs[0].registerInterval',
      ellipsis: true,
    },
    {
      title: '心跳周期(秒)',
      dataIndex: 'sipConfigs[0].keepaliveInterval',
      ellipsis: true,
    },
    {
      title: '传输信令',
      dataIndex: 'sipConfigs[0].transport',
      ellipsis: true,
    },
    {
      title: '字符集',
      dataIndex: 'sipConfigs[0].charset',
      ellipsis: true,
    },
    {
      title: '说明',
      dataIndex: 'description',
      width: '5%',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'center',
      fixed: 'right',
      width: '10%',
      render: (record: any) => (
        <Fragment>
          <a
            onClick={() => {
              setSaveVisible(true);
              setMediaCascade(record);
            }}
          >
            编辑
          </a>
          <Divider type="vertical"/>
          <a
            onClick={() => {
              setChoiceVisible(true);
              setCascadeId(record.id);
            }}
          >
            选择通道
          </a>
          {record.status.value === 'disabled' ? (
            <>
              <Divider type="vertical"/>
              <Popconfirm
                title="确认启用该级联吗？"
                onConfirm={() => {
                  setLoading(true);
                  service._enabled(record.id).subscribe(() => {
                      message.success('启用成功');
                      handleSearch(searchParam);
                    },
                    () => {
                      message.error('启用失败');
                    },
                    () => setLoading(false))
                }}>
                <a>启用</a>
              </Popconfirm>
              <Divider type="vertical"/>
              <Popconfirm
                title="确认删除该级联吗？"
                onConfirm={() => {
                  service.remove(record.id).subscribe(() => {
                      message.success("删除成功");
                      handleSearch(encodeQueryParam(searchParam));
                    },
                    () => {
                      message.error("删除失败");
                    },
                    () => setLoading(false))
                }}>
                <a>删除</a>
              </Popconfirm>
            </>
          ) : (
            <>
              <Divider type="vertical"/>
              <Popconfirm
                title="确认禁用该级联吗？"
                onConfirm={() => {
                  setLoading(true);
                  service._disabled(record.id).subscribe(() => {
                      message.success('禁用成功');
                      handleSearch(searchParam);
                    },
                    () => {
                      message.error('禁用失败');
                    },
                    () => setLoading(false))
                }}>
                <a>禁用</a>
              </Popconfirm>
              {/*<Divider type="vertical"/>
              <a
                onClick={() => {
                  setChoiceVisible(true);
                  setCascadeId(record.id);
                }}
              >
                选择通道
              </a>*/}
            </>
          )}
        </Fragment>
      )
    },
  ];
  return (
    <PageHeaderWrapper title="国标级联">
      <Card style={{marginBottom: 16}}>
        <div className={styles.tableList} style={{marginTop: -22}}>
          <div>
            <SearchForm
              search={(params: any) => {
                setSearchParam(params);
                handleSearch({terms: {...params}, pageSize: 10, sorts: {field: 'id', order: 'desc'}});
              }}
              formItems={[
                {
                  label: '级联名称',
                  key: 'name$LIKE',
                  type: 'string',
                },
              ]}
            />
          </div>
          <div style={{marginTop: -22}}>
            <Button icon="plus" type="primary" onClick={() => {
              setSaveVisible(true);
              setMediaCascade({});
            }}>
              新建
            </Button>
          </div>
        </div>
      </Card>
      <Card>
        <div className={styles.StandardTable}>
          <ProTable
            loading={loading}
            dataSource={result?.data}
            columns={columns}
            rowKey="id"
            /*expandedRowRender={expandedRowRender}*/
            scroll={{x: '150%'}}
            onSearch={(params: any) => {
              params.sorts = params.sorts.field ? params.sorts : {field: 'id', order: 'desc'};
              handleSearch(params);
            }}
            paginationConfig={result}
          />
        </div>
      </Card>

      {saveVisible &&
      <SaveCascade
        data={mediaCascade}
        close={() => {
          setSaveVisible(false);
          setMediaCascade({});
          handleSearch(searchParam);
        }}/>
      }

      {choiceVisible &&
      <ChoiceChannel
        cascadeId={cascadeId}
        close={() => {
          setChoiceVisible(false);
          setCascadeId('');
          handleSearch(searchParam);
        }}/>}
    </PageHeaderWrapper>
  )
};
export default MediaCascade;
