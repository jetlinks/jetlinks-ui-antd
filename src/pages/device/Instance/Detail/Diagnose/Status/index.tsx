import TitleComponent from '@/components/TitleComponent';
import { Badge, Button, Col, message, Popconfirm, Row } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { InstanceModel, service } from '@/pages/device/Instance';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';

interface Props {
  onChange: (type: string) => void;
}

const Status = (props: Props) => {
  const StatusMap = new Map();
  StatusMap.set('error', require('/public/images/diagnose/status/error.png'));
  StatusMap.set('success', require('/public/images/diagnose/status/success.png'));
  StatusMap.set('warning', require('/public/images/diagnose/status/warning.png'));
  StatusMap.set('loading', require('/public/images/diagnose/status/loading.png'));

  const statusColor = new Map();
  statusColor.set('error', '#E50012');
  statusColor.set('success', '#24B276');
  statusColor.set('warning', '#FF9000');
  statusColor.set('loading', 'rgba(0, 0, 0, .8)');

  const initStatus = {
    product: {
      status: 'loading',
      text: '正在诊断中...',
      info: null,
    },
    config: {
      status: 'loading',
      text: '正在诊断中...',
      info: null,
    },
    device: {
      status: 'loading',
      text: '正在诊断中...',
      info: null,
    },
    'device-config': {
      status: 'loading',
      text: '正在诊断中...',
      info: null,
    },
    gateway: {
      status: 'loading',
      text: '正在诊断中...',
      info: null,
    },
    network: {
      status: 'loading',
      text: '正在诊断中...',
      info: null,
    },
  };

  const initList = [
    {
      key: 'product',
      name: '产品状态',
      desc: '诊断产品状态是否已发布，未发布的状态将导致连接失败。',
    },
    {
      key: 'config',
      name: '设备接入配置',
      desc: '诊断设备接入配置是否正确，配置错误将导致连接失败。',
    },
    {
      key: 'device',
      name: '设备状态',
      desc: '诊断设备状态是否已启用，未启用的状态将导致连接失败。',
    },
  ];
  const [list, setList] = useState<any[]>(initList);

  const [status, setStatus] = useState<any>(initStatus);

  const getDetail = (id: string) => {
    service.detail(id).then((response) => {
      InstanceModel.detail = response?.result;
    });
  };

  const handleSearch = async () => {
    props.onChange('loading');
    setList(initList);
    // 设备在线
    if (InstanceModel.detail?.state?.value === 'online') {
      setList([
        ...initList,
        {
          key: 'device-config',
          name: '实例信息配置',
          desc: '诊断设备实例信息是否正确，配置错误将导致连接失败。',
        },
        {
          key: 'gateway',
          name: '设备接入网关状态',
          desc: '诊断设备接入网关状态是否已启用，未启用的状态将导致连接失败',
        },
        {
          key: 'network',
          name: '网络信息',
          desc: '诊断网络组件配置是否正确，配置错误将导致连接失败。',
        },
      ]);
      setTimeout(() => {
        status.product = { status: 'success', text: '已发布', info: null };
        status.config = { status: 'success', text: '正常', info: null };
        status.device = { status: 'success', text: '已启用', info: null };
        status['device-config'] = { status: 'success', text: '正常', info: null };
        status.gateway = { status: 'success', text: '已启用', info: null };
        status.network = { status: 'success', text: '网络正常', info: null };
        setStatus({ ...status });
        props.onChange('success');
      }, 1000);
    } else if (InstanceModel.detail) {
      const datalist = [...initList];
      const product = await service.queryProductState(InstanceModel.detail?.productId || '');
      status.product = {
        status: product.result?.state === 1 ? 'success' : 'error',
        text: product.result?.state === 1 ? '已发布' : '未发布',
        info:
          product.result?.state === 1 ? null : (
            <div className={styles.infoItem}>
              <Badge
                status="default"
                text={
                  <span>
                    产品未发布，请
                    <Popconfirm
                      title="确认发布"
                      onConfirm={async () => {
                        const resp = await service.deployProduct(
                          InstanceModel.detail?.productId || '',
                        );
                        if (resp.status === 200) {
                          message.success('操作成功！');
                          status.product = { status: 'success', text: '已发布', info: null };
                          setStatus({ ...status });
                        }
                      }}
                    >
                      <a>发布</a>
                    </Popconfirm>
                    产品
                  </span>
                }
              />
            </div>
          ),
      };
      if (InstanceModel.detail?.state?.value === 'notActive') {
        status.device = {
          status: 'error',
          text: '未启用',
          info: (
            <div className={styles.infoItem}>
              <Badge
                status="default"
                text={
                  <span>
                    设备未启用，请
                    <Popconfirm
                      title="确认启用"
                      onConfirm={async () => {
                        const resp = await service.deployDevice(InstanceModel.detail?.id || '');
                        if (resp.status === 200) {
                          message.success('操作成功！');
                          status.device = { status: 'success', text: '已启用', info: null };
                          setStatus({ ...status });
                          getDetail(InstanceModel.detail?.id || '');
                        }
                      }}
                    >
                      <a>启用</a>
                    </Popconfirm>
                    设备
                  </span>
                }
              />
            </div>
          ),
        };
      } else {
        status.device = { status: 'success', text: '已启用', info: null };
      }
      if (product.result?.accessId) {
        const configuration = await service.queryProductConfig(
          InstanceModel.detail?.productId || '',
        );
        if ((configuration?.result || []).length > 0) {
          //实例信息
          datalist.push({
            key: 'device-config',
            name: '实例信息配置',
            desc: '诊断设备实例信息是否正确，配置错误将导致连接失败。',
          });
          status['device-config'] = {
            status: 'warning',
            text: '可能存在异常',
            info: (
              <div className={styles.infoItem}>
                <Badge
                  status="default"
                  text={
                    <span>
                      请检查
                      <a
                        onClick={() => {
                          //  跳转到设备实例页面
                          const url = getMenuPathByParams(
                            MENUS_CODE['device/Instance/Detail'],
                            InstanceModel.detail?.id,
                          );
                          const tab: any = window.open(`${origin}/#${url}?key=detail`);
                          tab!.onTabSaveSuccess = (value: any) => {
                            if (value) {
                              handleSearch();
                            }
                          };
                        }}
                      >
                        设备实例信息
                      </a>
                      是否正确填写
                    </span>
                  }
                />
              </div>
            ),
          };
        }
        status.config = {
          status: 'warning',
          text: '可能存在异常',
          info: (
            <div className={styles.infoItem}>
              <Badge
                status="default"
                text={
                  <span>
                    请检查
                    <a
                      onClick={() => {
                        //跳转到产品设备接入配置
                        const url = getMenuPathByParams(
                          MENUS_CODE['device/Product/Detail'],
                          InstanceModel.detail?.productId,
                        );
                        const tab: any = window.open(`${origin}/#${url}?key=access`);
                        tab!.onTabSaveSuccess = (value: any) => {
                          if (value) {
                            handleSearch();
                          }
                        };
                      }}
                    >
                      设备接入配置
                    </a>
                    是否正确填写
                  </span>
                }
              />
            </div>
          ),
        };
        const deviceConfig = await service.queryGatewayState(product.result?.accessId);
        status.gateway = {
          status: deviceConfig.result?.state?.value === 'enabled' ? 'success' : 'error',
          text: deviceConfig.result?.state?.value === 'enabled' ? '已启用' : '未启用',
          info:
            deviceConfig.result?.state?.value === 'enabled' ? null : (
              <div className={styles.infoItem}>
                <Badge
                  status="default"
                  text={
                    <span>
                      设备接入网关未启用，请
                      <Popconfirm
                        title="确认启用"
                        onConfirm={async () => {
                          const resp = await service.startGateway(product.result?.accessId || '');
                          if (resp.status === 200) {
                            message.success('操作成功！');
                            status.gateway = { status: 'success', text: '已启用', info: null };
                            setStatus({ ...status });
                          }
                        }}
                      >
                        <a>启用</a>
                      </Popconfirm>
                      设备接入网关
                    </span>
                  }
                />
              </div>
            ),
        };
        datalist.push({
          key: 'gateway',
          name: '设备接入网关状态',
          desc: '诊断设备接入网关状态是否已启用，未启用的状态将导致连接失败',
        });
        if (deviceConfig.result?.channel === 'network') {
          const network = await service.queryNetworkState(deviceConfig.result?.channelId);
          status.network = {
            status: network.result?.state?.value === 'enabled' ? 'success' : 'error',
            text: deviceConfig.result?.state?.value === 'enabled' ? '网络正常' : '网络异常',
            info:
              deviceConfig.result?.state?.value === 'enabled' ? null : (
                <div>
                  <div className={styles.infoItem}>
                    <Badge
                      status="default"
                      text={
                        <span>
                          网络组件未启用， 请
                          <Popconfirm
                            title="确认启用"
                            onConfirm={async () => {
                              const resp = await service.startNetwork(
                                deviceConfig.result?.channelId,
                              );
                              if (resp.status === 200) {
                                message.success('操作成功！');
                                status.gateway = { status: 'success', text: '已启用', info: null };
                                setStatus({ ...status });
                              }
                            }}
                          >
                            <a>启用</a>
                          </Popconfirm>
                          网络组件
                        </span>
                      }
                    />
                  </div>
                  <div className={styles.infoItem}>
                    <Badge
                      status="default"
                      text="请检查服务器端口是否开放，如未开放，请开放后尝试重新连接"
                    />
                  </div>
                  <div className={styles.infoItem}>
                    <Badge
                      status="default"
                      text="请检查服务器防火策略，如有开启防火墙，请关闭防火墙或调整防火墙策略后重试"
                    />
                  </div>
                </div>
              ),
          };
          datalist.push({
            key: 'network',
            name: '网络信息',
            desc: '诊断网络组件配置是否正确，配置错误将导致连接失败。',
          });
        }
      } else {
        status.config = {
          status: 'error',
          text: '未配置',
          info: (
            <div className={styles.infoItem}>
              <Badge
                status="default"
                text={
                  <span>
                    请进行
                    <a
                      onClick={() => {
                        const url = getMenuPathByParams(
                          MENUS_CODE['device/Product/Detail'],
                          InstanceModel.detail?.productId,
                        );
                        const tab: any = window.open(`${origin}/#${url}?key=access`);
                        tab!.onTabSaveSuccess = (value: any) => {
                          if (value) {
                            handleSearch();
                          }
                        };
                      }}
                    >
                      设备接入配置
                    </a>
                  </span>
                }
              />
            </div>
          ),
        };
      }
      setList([...datalist]);
      setStatus({ ...status });
      props.onChange('error');
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <Row gutter={24}>
      <Col span={16}>
        <div className={styles.statusBox}>
          <div className={styles.statusHeader}>
            <TitleComponent data={'连接详情'} />
            <Button
              onClick={() => {
                handleSearch();
              }}
            >
              重新诊断
            </Button>
          </div>
          <div className={styles.statusContent}>
            {list.map((item) => (
              <div key={item.key} className={styles.statusItem}>
                <div className={styles.statusLeft}>
                  <div className={styles.statusImg}>
                    <img
                      style={{ height: 32 }}
                      className={status[item.key]?.status === 'loading' ? styles.loading : {}}
                      src={StatusMap.get(status[item.key]?.status) || 'loading'}
                    />
                  </div>
                  <div className={styles.statusContext}>
                    <div className={styles.statusTitle}>{item.name}</div>
                    <div className={styles.statusDesc}>{item.desc}</div>
                    <div className={styles.info}>{status[item.key]?.info}</div>
                  </div>
                </div>
                <div
                  className={styles.statusRight}
                  style={{ color: statusColor.get(status[item.key]?.status) || 'loading' }}
                >
                  {status[item.key]?.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Status;
