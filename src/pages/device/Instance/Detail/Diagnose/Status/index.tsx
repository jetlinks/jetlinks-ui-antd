import TitleComponent from '@/components/TitleComponent';
import { Badge, Button, Col, message, Popconfirm, Row } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { InstanceModel, service } from '@/pages/device/Instance';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import type { ProductItem } from '@/pages/device/Product/typings';
import { Store } from 'jetlinks-store';
import { observer } from '@formily/reactive-react';
import { DiagnoseStatusModel } from './model';

interface Props {
  onChange: (type: string) => void;
  flag: boolean;
}

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

const Status = observer((props: Props) => {
  const time = 1000;

  const [list, setList] = useState<any[]>([]);

  const getDetail = (id: string) => {
    service.detail(id).then((response) => {
      InstanceModel.detail = response?.result;
    });
  };

  const initList = (proItem: ProductItem, configuration: any, deviceConfigs: any) => {
    const datalist = [
      {
        key: 'product',
        name: '产品状态',
        data: 'product',
        desc: '诊断产品状态是否已发布，未发布的状态将导致连接失败。',
      },
      {
        key: 'config',
        name: '设备接入配置',
        data: 'config',
        desc: '诊断设备接入配置是否正确，配置错误将导致连接失败。',
      },
      {
        key: 'device',
        name: '设备状态',
        data: 'device',
        desc: '诊断设备状态是否已启用，未启用的状态将导致连接失败。',
      },
    ];

    const deviceConfig = {
      key: 'device-config',
      name: '实例信息配置',
      data: 'deviceConfig',
      desc: '诊断设备实例信息是否正确，配置错误将导致连接失败。',
    };

    const gateway = {
      key: 'gateway',
      name: '设备接入网关状态',
      data: 'gateway',
      desc: '诊断设备接入网关状态是否已启用，未启用的状态将导致连接失败',
    };

    const network = {
      key: 'network',
      name: '网络信息',
      data: 'network',
      desc: '诊断网络组件配置是否正确，配置错误将导致连接失败。',
    };

    if (InstanceModel.detail?.state?.value === 'online') {
      setList([...datalist, deviceConfig, gateway, network]);
      return [...datalist, deviceConfig, gateway, network];
    } else {
      if (proItem?.accessId && Array.isArray(configuration) && configuration.length > 0) {
        datalist.push(deviceConfig);
      }
      if (proItem?.accessId) {
        datalist.push(gateway);
      }
      if (proItem?.accessId && deviceConfigs?.channel === 'network') {
        datalist.push(network);
      }
      setList([...datalist]);
      return datalist;
    }
  };

  const diagnoseProduct = (proItem: ProductItem) =>
    new Promise((resolve) => {
      let data: any = {};
      if (InstanceModel.detail?.state?.value === 'online') {
        data = { status: 'success', text: '已发布', info: null };
      } else {
        data = {
          status: proItem?.state === 1 ? 'success' : 'error',
          text: proItem?.state === 1 ? '已发布' : '未发布',
          info:
            proItem?.state === 1 ? null : (
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
                            DiagnoseStatusModel.status.product = {
                              status: 'success',
                              text: '已发布',
                              info: null,
                            };
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
      }
      DiagnoseStatusModel.status.product = data;
      setTimeout(() => resolve(data), time);
    });

  const diagnoseConfig = (proItem: ProductItem) =>
    new Promise((resolve) => {
      let data: any = {};
      if (InstanceModel.detail?.state?.value === 'online') {
        data = { status: 'success', text: '正常', info: null };
      } else if (proItem?.accessId) {
        data = {
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
                            diagnoseConfig(proItem);
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
      } else {
        data = {
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
                            diagnoseConfig(proItem);
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
      DiagnoseStatusModel.status.config = data;
      setTimeout(() => resolve(data), time);
    });

  const diagnoseDevice = () =>
    new Promise((resolve) => {
      let data: any = {};
      if (InstanceModel.detail?.state?.value === 'notActive') {
        data = {
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
                          DiagnoseStatusModel.status.device = {
                            status: 'success',
                            text: '已启用',
                            info: null,
                          };
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
        data = { status: 'success', text: '已启用', info: null };
      }
      DiagnoseStatusModel.status.device = data;
      setTimeout(() => resolve(data), time);
    });

  const diagnoseDeviceConfig = (proItem: ProductItem, configuration: any) =>
    new Promise((resolve) => {
      let data: any = {};
      if (InstanceModel.detail?.state?.value === 'online') {
        data = { status: 'success', text: '正常', info: null };
      } else if (proItem?.accessId && (configuration || []).length > 0) {
        data = {
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
                            diagnoseDeviceConfig(proItem, configuration);
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
      DiagnoseStatusModel.status.deviceConfig = data;
      setTimeout(() => resolve(data), time);
    });

  const diagnoseGateway = (proItem: ProductItem, deviceConfig: any) =>
    new Promise((resolve) => {
      let data: any = {};
      if (InstanceModel.detail?.state?.value === 'online') {
        data = { status: 'success', text: '已启用', info: null };
      } else {
        data = {
          status: deviceConfig?.state?.value === 'enabled' ? 'success' : 'error',
          text: deviceConfig?.state?.value === 'enabled' ? '已启用' : '未启用',
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
                          const resp = await service.startGateway(proItem?.accessId || '');
                          if (resp.status === 200) {
                            message.success('操作成功！');
                            DiagnoseStatusModel.status.gateway = {
                              status: 'success',
                              text: '已启用',
                              info: null,
                            };
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
      }
      DiagnoseStatusModel.status.gateway = data;
      setTimeout(() => resolve(data), time);
    });

  const diagnoseNetwork = (proItem: ProductItem, deviceConfig: any, network: any) =>
    new Promise((resolve) => {
      let data: any = {};
      if (InstanceModel.detail?.state?.value === 'online') {
        data = { status: 'success', text: '网络正常', info: null };
      } else if (proItem?.accessId && deviceConfig?.channel === 'network') {
        data = {
          status: network?.state?.value === 'enabled' ? 'success' : 'error',
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
                            const resp = await service.startNetwork(deviceConfig.result?.channelId);
                            if (resp.status === 200) {
                              message.success('操作成功！');
                              DiagnoseStatusModel.status.gateway = {
                                status: 'success',
                                text: '已启用',
                                info: null,
                              };
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
      }
      DiagnoseStatusModel.status.network = data;
      setTimeout(() => resolve(data), time);
    });

  const handleSearch = async () => {
    props.onChange('loading');
    DiagnoseStatusModel.status = {
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
      deviceConfig: {
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
    const proItem: any = await service.queryProductState(InstanceModel.detail?.productId || '');
    const configuration = await service.queryProductConfig(InstanceModel.detail?.productId || '');
    let deviceConfig: any = undefined;
    let network: any = undefined;
    if (proItem.result?.accessId) {
      deviceConfig = await service.queryGatewayState(proItem.result?.accessId);
    }
    if (deviceConfig?.result?.channelId && deviceConfig?.channel === 'network') {
      network = await service.queryNetworkState(deviceConfig?.channelId);
    }
    const list1 = initList(proItem.result, configuration.result, deviceConfig.result);

    diagnoseProduct(proItem.result)
      .then(() => diagnoseConfig(proItem.result))
      .then(() => diagnoseDevice())
      .then(() => diagnoseDeviceConfig(proItem?.result, configuration?.result))
      .then(() => diagnoseGateway(proItem?.result, deviceConfig?.result))
      .then(() => diagnoseNetwork(proItem?.result, deviceConfig.result, network?.result))
      .then(() => {
        let a = true;
        Object.keys(DiagnoseStatusModel.status).forEach((key) => {
          if (DiagnoseStatusModel.status[key].status !== 'success') {
            a = false;
          }
        });
        if (a) {
          Store.set('diagnose-status', {
            list: list1,
            status: DiagnoseStatusModel.status,
          });
          props.onChange('success');
        } else {
          props.onChange('error');
        }
      });
  };

  useEffect(() => {
    if (!props.flag) {
      handleSearch();
    } else {
      const dt = Store.get('diagnose-status');
      DiagnoseStatusModel.status = dt?.status;
      console.log(dt.status);
      setList(dt?.list || []);
      props.onChange('success');
    }
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
                      className={
                        DiagnoseStatusModel.status[item.data]?.status === 'loading'
                          ? styles.loading
                          : {}
                      }
                      src={
                        StatusMap.get(DiagnoseStatusModel.status[item.data]?.status) || 'loading'
                      }
                    />
                  </div>
                  <div className={styles.statusContext}>
                    <div className={styles.statusTitle}>{item.name}</div>
                    <div className={styles.statusDesc}>{item.desc}</div>
                    <div className={styles.info}>{DiagnoseStatusModel.status[item.data]?.info}</div>
                  </div>
                </div>
                <div
                  className={styles.statusRight}
                  style={{
                    color:
                      statusColor.get(DiagnoseStatusModel.status[item.data]?.status) || 'loading',
                  }}
                >
                  {DiagnoseStatusModel.status[item.data]?.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Col>
    </Row>
  );
});

export default Status;
