import { Col, Input, Pagination, Row, Space, Spin, Table, Tooltip } from 'antd';
import CheckButton from '@/components/CheckButton';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PropertyMetadata } from '@/pages/device/Product/typings';
import PropertyCard from './PropertyCard';
import {
  ClockCircleOutlined,
  EditOutlined,
  SyncOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { InstanceModel, service } from '@/pages/device/Instance';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import { map } from 'rxjs/operators';
import EditProperty from './EditProperty';
import { useParams } from 'umi';
import PropertyLog from '../../MetadataLog/Property';
import styles from './index.less';
import { groupBy, throttle, toArray } from 'lodash';
import PropertyTable from './PropertyTable';
import { onlyMessage } from '@/utils/util';
import Indicators from './Indicators';
import { Empty } from '@/components';
import PermissionButton from '../../../../../../components/PermissionButton';

interface Props {
  data: Partial<PropertyMetadata>[];
}

const ColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const Property = (props: Props) => {
  const { data } = props;
  const device = InstanceModel.detail;
  const params = useParams<{ id: string }>();
  const [subscribeTopic] = useSendWebsocketMessage();
  const [visible, setVisible] = useState<boolean>(false);
  const [infoVisible, setInfoVisible] = useState<boolean>(false);
  const [currentInfo, setCurrentInfo] = useState<any>({});
  const [propertyValue, setPropertyValue] = useState<any>({});
  const [propertyList, setPropertyList] = useState<any[]>(data || []);
  const [dataSource, setDataSource] = useState<any>({
    total: data.length,
    data: (data || []).slice(0, 8),
    pageSize: 8,
    currentPage: 0,
  });
  const devicePermission = PermissionButton.usePermission('device/Instance').permission;
  const [indicatorVisible, setIndicatorVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [loading1, setLoading1] = useState<boolean>(true); // 使valueChange里面能拿到最新的propertyValue

  const [check, setCheck] = useState<boolean>(true);

  const refreshProperty = async (id: string) => {
    if (!id) return;
    const resp = await service.getProperty(params.id, id);
    if (resp.status === 200) {
      onlyMessage('操作成功');
    }
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      render: (text: any, record: any) => {
        return <PropertyTable type="value" value={propertyValue[record.id]} data={record} />;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'time',
      key: 'time',
      render: (text: any, record: any) => {
        return <PropertyTable type="time" value={propertyValue[record.id]} data={record} />;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          {record.expands?.type?.includes('write') && (
            <PermissionButton
              type={'link'}
              onClick={() => {
                setVisible(true);
                setCurrentInfo(record);
              }}
              tooltip={{
                placement: 'top',
                title: devicePermission.update ? '设置属性至设备' : '暂无权限，请联系管理员',
              }}
              style={{ padding: 0 }}
              key={'edit'}
              isPermission={devicePermission.update}
            >
              <EditOutlined />
            </PermissionButton>
          )}
          {(record.expands?.metrics || []).length > 0 &&
            ['int', 'long', 'float', 'double', 'string', 'boolean', 'date'].includes(
              record.valueType?.type || '',
            ) && (
              <Tooltip placement="top" title="指标">
                <a
                  onClick={() => {
                    setIndicatorVisible(true);
                    setCurrentInfo(record);
                  }}
                >
                  <ClockCircleOutlined />
                </a>
              </Tooltip>
              // <PermissionButton
              //   type={'link'}
              //   onClick={() => {
              //     setVisible(true);
              //     setCurrentInfo(record);
              //   }}
              //   tooltip={{
              //     placement: "top",
              //     title: devicePermission.update ? "指标" : '暂无权限，请联系管理员'
              //   }}
              //   style={{ padding: 0 }}
              //   key={'edit'}
              //   isPermission={devicePermission.update}
              // >
              //   <ClockCircleOutlined />
              // </PermissionButton>
            )}
          {record.expands?.type?.includes('read') && (
            <Tooltip placement="top" title="获取最新属性值">
              <a
                onClick={() => {
                  refreshProperty(record?.id);
                }}
              >
                <SyncOutlined />
              </a>
            </Tooltip>
          )}
          <Tooltip placement="top" title="详情">
            <a
              onClick={() => {
                setCurrentInfo(record);
                setInfoVisible(true);
              }}
            >
              <UnorderedListOutlined />
            </a>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const list = useRef<any[]>([]);

  const subRef = useRef<any>(null);

  const valueChange = useCallback(
    (payload: any) => {
      (payload || [])
        .sort((a: any, b: any) => a.timestamp - b.timestamp)
        .forEach((item: any) => {
          const { value } = item;
          propertyValue[value?.property] = { ...item, ...value };
        });
      setPropertyValue({ ...propertyValue });
      list.current = [];
    },
    [propertyValue],
  );

  const throttleFn = throttle(valueChange, 500);

  /**
   * 订阅属性数据
   */
  const subscribeProperty = () => {
    const id = `instance-info-property-${device.id}-${device.productId}-${dataSource.data
      .map((i: PropertyMetadata) => i.id)
      .join('-')}`;
    const topic = `/dashboard/device/${device.productId}/properties/realTime`;
    subRef.current = subscribeTopic!(id, topic, {
      deviceId: device.id,
      properties: dataSource.data.map((i: PropertyMetadata) => i.id),
      history: 1,
    })
      ?.pipe(map((res) => res.payload))
      .subscribe((payload: any) => {
        list.current = [...list.current, payload];
        throttleFn(list.current);
      });
  };

  const getDashboard = () => {
    const param = [
      {
        dashboard: 'device',
        object: device.productId,
        measurement: 'properties',
        dimension: 'history',
        params: {
          deviceId: device.id,
          history: 1,
          properties: dataSource.data.map((i: PropertyMetadata) => i.id),
        },
      },
    ];
    setLoading(true);
    service.propertyRealTime(param).subscribe({
      next: (resp) => {
        if (resp.status === 200) {
          const t1 = (resp?.result || []).map((item: any) => {
            return {
              timeString: item.data?.timeString,
              timestamp: item.data?.timestamp,
              ...item?.data?.value,
            };
          });
          const obj: any = {};
          toArray(groupBy(t1, 'property'))
            .map((item) => {
              return {
                list: item.sort((a, b) => b.timestamp - a.timestamp),
                property: item[0].property,
              };
            })
            .forEach((i) => {
              obj[i.property] = i.list[0];
            });
          setPropertyValue({ ...propertyValue, ...obj });
        }
        setLoading1(false);
        setLoading(false);
      },
    });
  };

  const memo = useMemo(
    () => (
      <EditProperty
        data={currentInfo}
        onCancel={() => {
          setVisible(false);
        }}
      />
    ),
    [propertyValue],
  );

  useEffect(() => {
    if (!loading1) {
      subscribeProperty();
    }
  }, [loading1]);

  useEffect(() => {
    if (dataSource.data.length > 0) {
      setLoading1(true);
      getDashboard();
    } else {
      setLoading(false);
    }
  }, [dataSource]);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      subRef.current && subRef.current?.unsubscribe();
    };
  }, []);

  return (
    <div>
      <Spin spinning={loading}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Input.Search
              allowClear
              placeholder="请输入名称"
              onSearch={(value: string) => {
                if (!!value) {
                  const li = data.filter((item) => {
                    return (
                      item.name && item.name.toLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
                    );
                  });
                  setPropertyList(li);
                  setDataSource({
                    total: li.length,
                    data: (li || []).slice(0, 8),
                    pageSize: 8,
                    currentPage: 0,
                  });
                } else {
                  setPropertyList(data);
                  setDataSource({
                    total: data.length,
                    data: (data || []).slice(0, 8),
                    pageSize: 8,
                    currentPage: 0,
                  });
                }
              }}
              style={{ width: 317 }}
            />
          </Space>
          <CheckButton
            value={check}
            change={(value: boolean) => {
              setCheck(value);
            }}
          />
        </div>
        {dataSource.data?.length > 0 ? (
          <div style={{ marginTop: '20px' }}>
            {check ? (
              <Row gutter={[16, 16]} style={{ minHeight: 450 }}>
                {dataSource.data.map((item: any) => (
                  <Col {...ColResponsiveProps} key={item.id}>
                    <PropertyCard data={item} value={item?.id ? propertyValue[item?.id] : ''} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Table
                pagination={false}
                columns={columns}
                dataSource={dataSource.data}
                rowKey="id"
                style={{ minHeight: 450 }}
              />
            )}
            <div
              style={{
                marginTop: '20px',
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Pagination
                className={styles.page}
                defaultCurrent={1}
                total={dataSource.total}
                showSizeChanger
                pageSize={dataSource.pageSize}
                pageSizeOptions={[8, 16, 32, 48]}
                onChange={(page: number, size: number) => {
                  setDataSource({
                    total: propertyList.length,
                    data: (propertyList || []).slice((page - 1) * size, page * size),
                    pageSize: size,
                    currentPage: page - 1,
                  });
                }}
              />
            </div>
          </div>
        ) : (
          <div
            style={{
              height: 400,
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <Empty />
          </div>
        )}
      </Spin>
      {visible && memo}
      {infoVisible && <PropertyLog data={currentInfo} close={() => setInfoVisible(false)} />}
      {indicatorVisible && (
        <Indicators
          data={currentInfo}
          onCancel={() => {
            setIndicatorVisible(false);
          }}
        />
      )}
    </div>
  );
};
export default Property;
