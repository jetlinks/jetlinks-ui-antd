import {PageHeaderWrapper} from "@ant-design/pro-layout"
import {Badge, Card, Descriptions, Row} from "antd";
import React, {Fragment, useEffect, useState} from "react";
import styles from '@/utils/table.less';
import SearchForm from "@/components/SearchForm";
import ProTable from "@/pages/system/permission/component/ProTable";
import {ColumnProps} from "antd/lib/table";
import Service from "../service";
import encodeQueryParam from "@/utils/encodeParam";
import {router} from "umi";
import {Dispatch} from "@/models/connect";

interface Props {
  dispatch: Dispatch;
  location: Location;
}

interface State {
  searchParam: any;
}

const initState: State = {
  searchParam: {pageSize: 10, terms: location?.query?.terms, sorts: {field: 'id', order: 'desc'}},
};
const MediaDevice: React.FC<Props> = props => {
  const {location: {pathname},} = props;
  const service = new Service('media/channel');
  const [loading, setLoading] = useState<boolean>(false);
  const [deviceId, setDeviceId] = useState<string>("");
  const [result, setResult] = useState<any>({});
  const [deviceInfo, setDeviceInfo] = useState<any>({});

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const statusMap = new Map();
  statusMap.set('online', 'success');
  statusMap.set('offline', 'error');
  statusMap.set('notActive', 'processing');

  useEffect(() => {
    if (pathname.indexOf('channel') > 0) {
      const list = pathname.split('/');
      deviceDetail(list[list.length - 1]);
      setDeviceId(list[list.length - 1]);
      searchParam.terms = {deviceId: list[list.length - 1]};
      handleSearch(encodeQueryParam(searchParam));
    }
  }, [window.location.hash]);

  const deviceDetail = (deviceId: string) => {
    service.deviceDetail(deviceId).subscribe((data) => {
        setDeviceInfo(data);
      },
      () => {
      },
      () => {
      })
  };

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    setLoading(true);
    service.query(encodeQueryParam(params)).subscribe(
      (data) => setResult(data),
      () => {
      },
      () => setLoading(false))
  };


  const columns: ColumnProps<any>[] = [
    {
      title: '通道ID',
      dataIndex: 'channelId',
    },
    {
      title: '通道名称',
      dataIndex: 'name',
    },
    {
      title: '厂商',
      dataIndex: 'manufacturer',
    },
    {
      title: '安装地址',
      dataIndex: 'address',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: '90px',
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
      title: '描述',
      dataIndex: 'describe',
      width: '15%',
      ellipsis: true
    },
    {
      title: '操作',
      align: 'center',
      render: (record: any) => (
        <Fragment>
          {record.status.value === 'online' && (
            <a
              onClick={() => {

              }}
            >
              播放
            </a>
          )}
        </Fragment>
      )
    },
  ];

  const content = (
    <div style={{marginTop: 30}}>
      <Descriptions column={4}>
        <Descriptions.Item label="设备名称">
          <div>
            {deviceInfo.name}
            <a style={{marginLeft: 10}}
               onClick={() => {
                 router.push(`/device/instance/save/${deviceInfo.id}`);
               }}
            >查看</a>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="产品名称">
          <div>
            {deviceInfo.productName}
            <a style={{marginLeft: 10}}
               onClick={() => {
                 router.push(`/device/product/save/${deviceInfo.productId}`);
               }}
            >查看</a>
          </div>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  const titleInfo = (
    <Row>
      <div>
        <span style={{paddingRight: 20}}>
          通道列表：{deviceId}
        </span>
        <Badge status={statusMap.get(deviceInfo.state?.value)} text={deviceInfo.state?.text}/>
      </div>
    </Row>
  );

  return (
    <PageHeaderWrapper
      title={titleInfo}
      content={content}
    >
      <Card bordered={false} style={{marginBottom: 16}}>
        <div className={styles.tableList}>
          <div>
            <SearchForm
              search={(params: any) => {
                setSearchParam(params);
                params.deviceId = deviceId;
                handleSearch({terms: {...params}, pageSize: 10, sorts: {field: 'id', order: 'desc'}});
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
      </Card>
      <Card>
        <div className={styles.StandardTable}>
          <ProTable
            loading={loading}
            dataSource={result?.data}
            columns={columns}
            rowKey="id"
            onSearch={(params: any) => {
              params.terms['deviceId'] = deviceId;
              params.sorts = params.sorts.field ? params.sorts : {field: 'id', order: 'desc'};
              handleSearch(params);
            }}
            paginationConfig={result}
          />
        </div>
      </Card>
    </PageHeaderWrapper>
  )
};
export default MediaDevice;
