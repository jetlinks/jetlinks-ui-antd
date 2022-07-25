import { PageContainer } from '@ant-design/pro-layout';
import { observer } from '@formily/react';
import { Badge, Card, Col, Row } from 'antd';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { Tooltip } from 'antd';
import { useRef, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { EyeOutlined } from '@ant-design/icons';
// import { useHistory } from 'umi';
import type { FirmwareItem } from '@/pages/device/Firmware/typings';
import useDomFullHeight from '@/hooks/document/useDomFullHeight';
// import usePermissions from '@/hooks/permission';
import SearchComponent from '@/components/SearchComponent';
import { service } from '@/pages/device/Firmware';
import styles from './index.less';
import { model } from '@formily/reactive';

const colorMap = new Map();
colorMap.set('waiting', '#FF9000');
colorMap.set('loading', '#4293FF');
colorMap.set('finish', '#24B276');
colorMap.set('error', '#F76F5D');

const state = model<{
  waiting: number;
  loading: number;
  finish: number;
  error: number;
}>({
  waiting: 0,
  loading: 2,
  finish: 4,
  error: 0,
});

const Detail = observer(() => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const { minHeight } = useDomFullHeight(`.firmware-task-detail`, 24);
  // const { permission } = usePermissions('device/Firmware');
  const [param, setParam] = useState({});

  const arr = [
    {
      key: 'waiting',
      name: '等待升级',
      img: require('/public/images/firmware/waiting.png'),
    },
    {
      key: 'loading',
      name: '升级中',
      img: require('/public/images/firmware/loading.png'),
    },
    {
      key: 'finish',
      name: '升级完成',
      img: require('/public/images/firmware/finish.png'),
    },
    {
      key: 'error',
      name: '升级失败',
      img: require('/public/images/firmware/error.png'),
    },
  ];

  const columns: ProColumns<FirmwareItem>[] = [
    {
      title: '设备名称',
      ellipsis: true,
      dataIndex: 'name',
    },
    {
      title: '所属产品',
      ellipsis: true,
      dataIndex: 'version',
    },
    {
      title: '创建时间',
      ellipsis: true,
      dataIndex: 'signMethod',
    },
    {
      title: '完成时间',
      ellipsis: true,
      dataIndex: 'signMethod',
    },
    {
      title: '进度',
      ellipsis: true,
      dataIndex: 'signMethod',
    },
    {
      title: '状态',
      ellipsis: true,
      dataIndex: 'signMethod',
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: () => [
        <a onClick={() => {}} key="link">
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.detail',
              defaultMessage: '查看',
            })}
            key={'detail'}
          >
            <EyeOutlined />
          </Tooltip>
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <Card style={{ marginBottom: 20 }}>
        <Row gutter={24}>
          {arr.map((item) => (
            <Col span={6} key={item.key}>
              <div className={styles.firmwareDetailCard}>
                <div className={styles.firmwareDetailCardTitle}>
                  <Badge color={colorMap.get(item.key)} />
                  {item.name}
                </div>
                <div
                  className={styles.firmwareDetailCardNum}
                  style={{ color: colorMap.get(item.key) }}
                >
                  {state[item.key]}
                </div>
                <div className={styles.firmwareDetailCardImg}>
                  <img style={{ width: '100%' }} src={item.img} />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
      <SearchComponent<FirmwareItem>
        field={columns}
        target="firmware-task-detail"
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable<FirmwareItem>
        scroll={{ x: 1366 }}
        tableClassName={'firmware-task-detail'}
        tableStyle={{ minHeight }}
        search={false}
        columnEmptyText={''}
        params={param}
        request={async (params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
        columns={columns}
        actionRef={actionRef}
      />
    </PageContainer>
  );
});
export default Detail;
