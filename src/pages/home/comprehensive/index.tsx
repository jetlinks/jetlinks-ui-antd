import { PermissionButton } from '@/components';
import useHistory from '@/hooks/route/useHistory';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { Col, message, Row, Tooltip } from 'antd';
import Body from '../components/Body';
// import Guide from '../components/Guide';
import Statistics from '../components/Statistics';
import Steps from '../components/Steps';
import { service } from '..';
import { useEffect, useState } from 'react';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import { map } from 'rxjs';
import Pie from '../components/Pie';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ProductChoose from '../components/ProductChoose';
import DeviceChoose from '../components/DeviceChoose';
import GuideHome from '../components/GuideHome';

const Comprehensive = () => {
  const [subscribeTopic] = useSendWebsocketMessage();
  const productPermission = PermissionButton.usePermission('device/Product').permission;
  const devicePermission = PermissionButton.usePermission('device/Instance').permission;
  const rulePermission = PermissionButton.usePermission('rule-engine/Instance').permission;
  const accessPermission = getMenuPathByCode(MENUS_CODE['link/AccessConfig']);
  const logPermission = getMenuPathByCode(MENUS_CODE['Log']);
  const linkPermission = getMenuPathByCode(MENUS_CODE['link/DashBoard']);

  const [productCount, setProductCount] = useState<number>(0);
  const [deviceCount, setDeviceCount] = useState<number>(0);
  const [cpuValue, setCpuValue] = useState<number>(0);
  const [jvmValue, setJvmValue] = useState<number>(0);
  const [productVisible, setProductVisible] = useState<boolean>(false);
  const [deviceVisible, setDeviceVisible] = useState<boolean>(false);

  const getProductCount = async () => {
    const resp = await service.productCount({});
    if (resp.status === 200) {
      setProductCount(resp.result);
    }
  };

  const getDeviceCount = async () => {
    const resp = await service.deviceCount();
    if (resp.status === 200) {
      setDeviceCount(resp.result);
    }
  };

  useEffect(() => {
    getProductCount();
    getDeviceCount();
  }, []);

  useEffect(() => {
    const cpuRealTime = subscribeTopic!(
      `operations-statistics-system-info-cpu-realTime`,
      `/dashboard/systemMonitor/stats/info/realTime`,
      {
        type: 'cpu',
        interval: '2s',
        agg: 'avg',
      },
    )
      ?.pipe(map((res) => res.payload))
      .subscribe((payload: any) => {
        setCpuValue(payload.value?.systemUsage || 0);
      });

    const jvmRealTime = subscribeTopic!(
      `operations-statistics-system-info-memory-realTime`,
      `/dashboard/systemMonitor/stats/info/realTime`,
      {
        type: 'memory',
        interval: '2s',
        agg: 'avg',
      },
    )
      ?.pipe(map((res) => res.payload))
      .subscribe((payload: any) => {
        setJvmValue(payload.value?.jvmHeapUsage || 0);
      });

    return () => {
      cpuRealTime?.unsubscribe();
      jvmRealTime?.unsubscribe();
    };
  }, []);

  const history = useHistory();
  // // 跳转
  const guideList = [
    {
      key: 'product',
      name: '创建产品',
      img: require('/public/images/home/guide-home1.png'),
      english: 'CREATE PRODUCT',
      auth: !!productPermission.add,
      url: 'device/Product',
      param: {
        save: true,
      },
    },
    {
      key: 'device',
      name: '创建设备',
      english: 'CREATE DEVICE',
      img: require('/public/images/home/guide-home2.png'),
      auth: !!devicePermission.add,
      url: 'device/Instance',
      param: {
        save: true,
      },
    },
    {
      key: 'rule-engine',
      name: '规则引擎',
      english: 'RULE ENGINE',
      img: require('/public/images/home/guide-home3.png'),
      auth: !!rulePermission.add,
      url: 'rule-engine/Instance',
      param: {
        save: true,
      },
    },
  ];

  const guideOpsList = [
    {
      key: 'access',
      name: '设备接入配置',
      img: require('/public/images/home/guide-home4.png'),
      english: 'DEVICE ACCESS CONFIGURATION',
      auth: !!accessPermission,
      url: accessPermission,
    },
    {
      key: 'logger',
      name: '日志排查',
      english: 'LOG SCREEN',
      img: require('/public/images/home/guide-home5.png'),
      auth: !!logPermission,
      url: logPermission,
      param: {
        key: 'system',
      },
    },
    {
      key: 'realtime',
      name: '实时监控',
      img: require('/public/images/home/guide-home6.png'),
      english: 'REAL-TIME MONITORING',
      auth: !!linkPermission,
      url: linkPermission,
      param: {
        save: true,
      },
    },
  ];

  return (
    <Row gutter={24}>
      <Col span={6}>
        <GuideHome title="物联网引导" data={guideList} />
        <GuideHome title="运维引导" data={guideOpsList} />
      </Col>
      <Col span={18}>
        <Row gutter={24}>
          <Col span={12}>
            <Statistics
              data={[
                {
                  name: '产品数量',
                  value: productCount,
                  children: '',
                },
                {
                  name: '设备数量',
                  value: deviceCount,
                  children: '',
                },
              ]}
              title="设备统计"
              extra={
                <div style={{ fontSize: 14, fontWeight: 400 }}>
                  <a
                    onClick={() => {
                      const url = getMenuPathByCode(MENUS_CODE['device/DashBoard']);
                      if (!!url) {
                        history.push(`${url}`);
                      } else {
                        message.warning('暂无权限，请联系管理员');
                      }
                    }}
                  >
                    详情
                  </a>
                </div>
              }
            />
          </Col>
          <Col span={12}>
            <Statistics
              data={[
                {
                  name: 'CPU使用率',
                  value: String(cpuValue) + '%',
                  children: <Pie value={cpuValue} />,
                },
                {
                  name: 'JVM内存',
                  value: String(jvmValue) + '%',
                  children: <Pie value={jvmValue} />,
                },
              ]}
              title="基础统计"
              extra={
                <div style={{ fontSize: 14, fontWeight: 400 }}>
                  <a
                    onClick={() => {
                      const url = getMenuPathByCode(MENUS_CODE['link/DashBoard']);
                      if (!!url) {
                        history.push(`${url}`);
                      } else {
                        message.warning('暂无权限，请联系管理员');
                      }
                    }}
                  >
                    详情
                  </a>
                </div>
              }
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24} style={{ marginTop: 24 }}>
            <Body title={'平台架构图'} english={'PLATFORM ARCHITECTURE DIAGRAM'} />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Steps
          title={
            <span>
              设备接入推荐步骤
              <Tooltip title={'不同的设备因为通信协议的不同，存在接入步骤的差异'}>
                <QuestionCircleOutlined style={{ paddingLeft: 12 }} />
              </Tooltip>
            </span>
          }
          data={[
            {
              title: '创建产品',
              content:
                '产品是设备的集合，通常指一组具有相同功能的设备。物联设备必须通过产品进行接入方式配置。',
              onClick: () => {
                const path = getMenuPathByCode('device/Product');
                if (path && !!productPermission.add) {
                  history.push(`${path}`, {
                    save: true,
                  });
                } else {
                  message.warning('暂无权限，请联系管理员');
                }
              },
            },
            {
              title: '配置产品接入方式',
              content:
                '通过产品对同一类型的设备进行统一的接入方式配置。请参照设备铭牌说明选择匹配的接入方式。',
              onClick: () => {
                if (!!productPermission.update) {
                  setProductVisible(true);
                } else {
                  message.warning('暂无权限，请联系管理员');
                }
              },
            },
            {
              title: '添加测试设备',
              content: '添加单个设备，用于验证产品模型是否配置正确。',
              onClick: () => {
                const path = getMenuPathByCode('device/Instance');
                if (path && !!devicePermission.add) {
                  history.push(`${path}`, {
                    save: true,
                  });
                } else {
                  message.warning('暂无权限，请联系管理员');
                }
              },
            },
            {
              title: '功能调试',
              content: '对添加的测试设备进行功能调试，验证能否连接到平台，设备功能是否配置正确。',
              onClick: () => {
                if (!!devicePermission.update) {
                  setDeviceVisible(true);
                } else {
                  message.warning('暂无权限，请联系管理员');
                }
              },
            },
            {
              title: '批量添加设备',
              content: '批量添加同一产品下的设备',
              onClick: () => {
                const path = getMenuPathByCode('device/Instance');
                if (path && !!devicePermission.import) {
                  history.push(`${path}`, {
                    import: true,
                  });
                } else {
                  message.warning('暂无权限，请联系管理员');
                }
              },
            },
          ]}
        />
      </Col>
      <Col span={24} style={{ marginTop: 24 }}>
        <Steps
          title={
            <span>
              运维管理推荐步骤
              <Tooltip title="请根据业务需要对下述步骤进行选择性操作。">
                <QuestionCircleOutlined style={{ paddingLeft: 12 }} />
              </Tooltip>
            </span>
          }
          data={[
            {
              title: '协议管理',
              content: '根据业务需求自定义开发对应的产品（设备模型）接入协议，并上传到平台。',
              url: require('/public/images/home/bottom-1.png'),
              onClick: () => {
                const url = getMenuPathByCode(MENUS_CODE['link/Protocol']);
                if (!!url) {
                  history.push(url);
                } else {
                  message.warning('暂无权限，请联系管理员');
                }
              },
            },
            {
              title: '证书管理',
              content: '统一维护平台内的证书，用于数据通信加密。',
              url: require('/public/images/home/bottom-6.png'),
              onClick: () => {
                const url = getMenuPathByCode(MENUS_CODE['link/Certificate']);
                if (!!url) {
                  history.push(url);
                } else {
                  message.warning('暂无权限，请联系管理员');
                }
              },
            },
            {
              title: '网络组件',
              content: '根据不同的传输类型配置平台底层网络组件相关参数。',
              url: require('/public/images/home/bottom-3.png'),
              onClick: () => {
                const url = getMenuPathByCode(MENUS_CODE['link/Type']);
                if (!!url) {
                  history.push(url);
                } else {
                  message.warning('暂无权限，请联系管理员');
                }
              },
            },
            {
              title: '设备接入网关',
              content: '根据不同的传输类型，关联消息协议，配置设备接入网关相关参数。',
              url: require('/public/images/home/bottom-4.png'),
              onClick: () => {
                const url = getMenuPathByCode(MENUS_CODE['link/AccessConfig']);
                if (!!url) {
                  history.push(url);
                } else {
                  message.warning('暂无权限，请联系管理员');
                }
              },
            },
            {
              title: '日志管理',
              content: '监控系统日志，及时处理系统异常。',
              url: require('/public/images/home/bottom-5.png'),
              onClick: () => {
                const url = getMenuPathByCode(MENUS_CODE['Log']);
                if (!!url) {
                  history.push(url, {
                    key: 'system',
                  });
                } else {
                  message.warning('暂无权限，请联系管理员');
                }
              },
            },
          ]}
        />
      </Col>
      <ProductChoose
        visible={productVisible}
        close={() => {
          setProductVisible(false);
        }}
      />
      <DeviceChoose
        visible={deviceVisible}
        onCancel={() => {
          setDeviceVisible(false);
        }}
      />
    </Row>
  );
};
export default Comprehensive;
