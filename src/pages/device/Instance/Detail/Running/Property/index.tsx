import { Col, Input, message, Pagination, Row, Space, Table } from 'antd';
import CheckButton from '@/components/CheckButton';
import { useEffect, useState } from 'react';
import type { PropertyMetadata } from '@/pages/device/Product/typings';
import PropertyCard from './PropertyCard';
import { EditOutlined, SyncOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { InstanceModel, service } from '@/pages/device/Instance';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import { map } from 'rxjs/operators';
import EditProperty from './EditProperty';
import { useParams } from 'umi';
import PropertyLog from '../../MetadataLog/Property';
import moment from 'moment';
import styles from './index.less';

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

  const [check, setCheck] = useState<boolean>(true);

  const refreshProperty = async (id: string) => {
    if (!id) return;
    const resp = await service.getProperty(params.id, id);
    if (resp.status === 200) {
      message.success('操作成功');
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
      render: (text: any, record: any) => (
        <span>{propertyValue[record.id]?.formatValue || '--'}</span>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'time',
      key: 'time',
      render: (text: any, record: any) => (
        <span>{moment(propertyValue[record.id]?.timestamp).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          {(record.expands?.readOnly === false || record.expands?.readOnly === 'false') && (
            <a
              onClick={() => {
                setVisible(true);
              }}
            >
              <EditOutlined />
            </a>
          )}
          <a
            onClick={() => {
              refreshProperty(record?.id);
            }}
          >
            <SyncOutlined />
          </a>
          <a
            onClick={() => {
              setCurrentInfo(record);
              setInfoVisible(true);
            }}
          >
            <UnorderedListOutlined />
          </a>
        </Space>
      ),
    },
  ];

  /**
   * 订阅属性数据
   */
  const subscribeProperty = () => {
    const id = `instance-info-property-${device.id}-${device.productId}-${dataSource.data
      .map((i: PropertyMetadata) => i.id)
      .join('-')}`;
    const topic = `/dashboard/device/${device.productId}/properties/realTime`;
    subscribeTopic!(id, topic, {
      deviceId: device.id,
      properties: dataSource.data.map((i: PropertyMetadata) => i.id),
      history: 1,
    })
      ?.pipe(map((res) => res.payload))
      .subscribe((payload: any) => {
        const { value } = payload;
        propertyValue[value.property] = value;
        setPropertyValue({ ...propertyValue });
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

    service.propertyRealTime(param).subscribe({
      next: (resp) => {
        propertyValue[resp.property] = resp.list[0];
        setPropertyValue({ ...propertyValue });
      },
    });
  };

  useEffect(() => {
    if (dataSource.data.length > 0) {
      getDashboard();
      subscribeProperty();
    }
  }, [dataSource]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Input.Search
            allowClear
            placeholder="请输入名称"
            onSearch={(value: string) => {
              if (!!value) {
                const list = data.filter((item) => {
                  return (
                    item.name && item.name.toLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
                  );
                });
                setPropertyList(list);
                setDataSource({
                  total: list.length,
                  data: (list || []).slice(0, 8),
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
            style={{ width: 300 }}
          />
          {/* <Checkbox onChange={() => {

                    }}>仅显示当前有数据的属性</Checkbox> */}
        </Space>
        <CheckButton
          value={check}
          change={(value: boolean) => {
            setCheck(value);
          }}
        />
      </div>
      <div style={{ marginTop: '20px' }}>
        {check ? (
          <Row gutter={[16, 16]}>
            {dataSource.data.map((item: any) => (
              <Col {...ColResponsiveProps} key={item.id}>
                <PropertyCard data={item} value={item?.id ? propertyValue[item?.id] : '--'} />
              </Col>
            ))}
          </Row>
        ) : (
          <Table pagination={false} columns={columns} dataSource={dataSource.data} rowKey="id" />
        )}
        <div
          style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'flex-end' }}
        >
          <Pagination
            className={styles.page}
            defaultCurrent={1}
            total={dataSource.total}
            showSizeChanger
            pageSize={dataSource.pageSize}
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
      <EditProperty
        data={currentInfo}
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
      />
      <PropertyLog data={currentInfo} visible={infoVisible} close={() => setInfoVisible(false)} />
    </div>
  );
};
export default Property;
