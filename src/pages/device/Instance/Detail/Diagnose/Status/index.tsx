import TitleComponent from '@/components/TitleComponent';
import { Badge, Button, message, Popconfirm, Space } from 'antd';
import styles from './index.less';
import { observer } from '@formily/reactive-react';
import type { ListProps } from './model';
import { urlMap } from './model';
import { gatewayList } from './model';
import { textColorMap } from './model';
import {
  DiagnoseStatusModel,
  StatusMap,
  networkInitList,
  childInitList,
  cloudInitList,
  channelInitList,
  mediaInitList,
} from './model';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { InstanceModel, service } from '@/pages/device/Instance';
import _ from 'lodash';
import { onlyMessage } from '@/utils/util';
import { getMenuPathByCode, getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
// import PermissionButton from '@/components/PermissionButton';
import ManualInspection from './ManualInspection';
import useHistory from '@/hooks/route/useHistory';
import DiagnosticAdvice from './DiagnosticAdvice';
interface Props {
  providerType: 'network' | 'child-device' | 'media' | 'cloud' | 'channel' | undefined;
}

const Status = observer((props: Props) => {
  const { providerType } = props;
  const time = 1000;
  const device = { ...InstanceModel.detail };
  const history = useHistory();

  // const productPermission = PermissionButton.usePermission('device/Product').permission;
  // const networkPermission = PermissionButton.usePermission('link/Type').permission;
  // const devicePermission = PermissionButton.usePermission('device/Instance').permission;
  // const accessPermission = PermissionButton.usePermission('link/AccessConfig').permission;

  const [artificialVisible, setArtificialVisible] = useState<boolean>(false);
  const [artificiaData, setArtificiaData] = useState<any>({});
  const [diagnoseVisible, setDiagnoseVisible] = useState<boolean>(false);
  const [diagnoseData, setDiagnoseData] = useState<any>({});

  // 跳转到产品设备接入配置
  const jumpAccessConfig = () => {
    const purl = getMenuPathByCode(MENUS_CODE['device/Product/Detail']);
    if (purl) {
      history.push(
        `${getMenuPathByParams(MENUS_CODE['device/Product/Detail'], device.productId)}`,
        {
          tab: 'access',
        },
      );
    } else {
      message.error('规则可能有加密处理，请联系管理员');
    }
  };

  //跳转到实例信息页面
  const jumpDeviceConfig = () => {
    InstanceModel.active = 'detail';
  };

  //人工检查
  const manualInspection = (params: any) => {
    setArtificialVisible(true);
    setArtificiaData({ ...params });
  };

  const modifyArrayList = (oldList: ListProps[], item: ListProps, index?: number) => {
    let newList: ListProps[] = [];
    if (index !== 0 && !index) {
      for (let i = 0; i < oldList.length; i++) {
        const dt = oldList[i];
        if (item.key === dt.key) {
          newList.push(item);
        } else {
          newList.push(dt);
        }
      }
    } else {
      oldList.splice(index, 0, item);
      newList = [...oldList];
    }
    return newList;
  };

  // 网络信息
  const diagnoseNetwork = () =>
    new Promise((resolve) => {
      if (device.state?.value === 'online') {
        setTimeout(() => {
          DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
            key: 'network',
            name: '网络组件',
            desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
            status: 'success',
            text: '正常',
            info: null,
          });
          DiagnoseStatusModel.count++;
          resolve({});
        }, time);
      } else {
        if (device?.accessId) {
          service.queryGatewayState(device.accessId).then((response: any) => {
            if (response.status === 200) {
              DiagnoseStatusModel.gateway = response.result;
              const address = response.result?.channelInfo?.addresses || [];
              const _label = address.some((i: any) => i.health === -1);
              const __label = address.every((i: any) => i.health === 1);
              const health = _label ? -1 : __label ? 1 : 0;
              let item: ListProps | undefined = undefined;
              if (health === 1) {
                item = {
                  key: 'network',
                  name: '网络组件',
                  desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
                  status: 'success',
                  text: '正常',
                  info: null,
                };
              } else {
                item = {
                  key: 'network',
                  name: '网络组件',
                  desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
                  status: 'error',
                  text: '异常',
                  info:
                    health === -1 ? (
                      <div>
                        <div className={styles.infoItem}>
                          <Badge
                            status="default"
                            text={
                              // networkPermission.action ? (
                              <span>
                                网络组件已禁用，请先
                                <Popconfirm
                                  title="确认启用"
                                  onConfirm={async () => {
                                    const res = await service.startNetwork(
                                      DiagnoseStatusModel.gateway?.channelId,
                                    );
                                    if (res.status === 200) {
                                      onlyMessage('操作成功！');
                                      DiagnoseStatusModel.list = modifyArrayList(
                                        DiagnoseStatusModel.list,
                                        {
                                          key: 'network',
                                          name: '网络组件',
                                          desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
                                          status: 'success',
                                          text: '正常',
                                          info: null,
                                        },
                                      );
                                    }
                                  }}
                                >
                                  <a>启用</a>
                                </Popconfirm>
                              </span>
                              // ) : (
                              //   '暂无权限，请联系管理员'
                              // )
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
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
              setTimeout(() => {
                if (item) {
                  DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, item);
                }
                DiagnoseStatusModel.count++;
                resolve({});
              }, time);
            } else {
              resolve({});
            }
          });
        }
      }
    });

  // 设备接入网关
  const diagnoseGateway = () =>
    new Promise((resolve) => {
      if (device.state?.value === 'online') {
        setTimeout(() => {
          DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
            key: 'gateway',
            name: '设备接入网关',
            desc: '诊断设备接入网关状态是否正常，禁用状态将导致连接失败',
            status: 'success',
            text: '正常',
            info: null,
          });
          DiagnoseStatusModel.count++;
          resolve({});
        }, time);
      } else {
        let item: ListProps | undefined = undefined;
        if (Object.keys(DiagnoseStatusModel.gateway).length === 0) {
          if (device.accessId) {
            service.queryGatewayState(device.accessId).then((response: any) => {
              if (response.status === 200) {
                DiagnoseStatusModel.gateway = response.result;
                if (response.result?.state?.value === 'enabled') {
                  item = {
                    key: 'gateway',
                    name: '设备接入网关',
                    desc: '诊断设备接入网关状态是否正常，禁用状态将导致连接失败',
                    status: 'success',
                    text: '正常',
                    info: null,
                  };
                } else {
                  item = {
                    key: 'gateway',
                    name: '设备接入网关',
                    desc: '诊断设备接入网关状态是否正常，禁用状态将导致连接失败',
                    status: 'error',
                    text: '异常',
                    info: (
                      <div>
                        <div className={styles.infoItem}>
                          <Badge
                            status="default"
                            text={
                              // accessPermission.action ? (
                              <span>
                                设备接入网关已禁用，请先
                                <Popconfirm
                                  title="确认启用"
                                  onConfirm={async () => {
                                    const resp = await service.startGateway(device.accessId || '');
                                    if (resp.status === 200) {
                                      onlyMessage('操作成功！');
                                      DiagnoseStatusModel.list = modifyArrayList(
                                        DiagnoseStatusModel.list,
                                        {
                                          key: 'gateway',
                                          name: '设备接入网关',
                                          desc: '诊断设备接入网关状态是否正常，禁用状态将导致连接失败',
                                          status: 'success',
                                          text: '正常',
                                          info: null,
                                        },
                                      );
                                    }
                                  }}
                                >
                                  <a>启用</a>
                                </Popconfirm>
                              </span>
                              // ) : (
                              //   '暂无权限，请联系管理员处理'
                              // )
                            }
                          />
                        </div>
                      </div>
                    ),
                  };
                }
                setTimeout(() => {
                  if (item) {
                    DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, item);
                  }
                  DiagnoseStatusModel.count++;
                  resolve({});
                }, time);
              } else {
                resolve({});
              }
            });
          }
        } else {
          if (DiagnoseStatusModel.gateway?.state?.value === 'enabled') {
            item = {
              key: 'gateway',
              name: '设备接入网关',
              desc: '诊断设备接入网关状态是否正常，禁用状态将导致连接失败',
              status: 'success',
              text: '正常',
              info: null,
            };
          } else {
            item = {
              key: 'gateway',
              name: '设备接入网关',
              desc: '诊断设备接入网关状态是否正常，禁用状态将导致连接失败',
              status: 'error',
              text: '异常',
              info: (
                <div>
                  <div className={styles.infoItem}>
                    <Badge
                      status="default"
                      text={
                        // accessPermission.action ? (
                        <span>
                          设备接入网关已禁用，请先
                          <Popconfirm
                            title="确认启用"
                            onConfirm={async () => {
                              const resp = await service.startGateway(device.accessId || '');
                              if (resp.status === 200) {
                                onlyMessage('操作成功！');
                                DiagnoseStatusModel.list = modifyArrayList(
                                  DiagnoseStatusModel.list,
                                  {
                                    key: 'gateway',
                                    name: '设备接入网关',
                                    desc: '诊断设备接入网关状态是否正常，禁用状态将导致连接失败',
                                    status: 'success',
                                    text: '正常',
                                    info: null,
                                  },
                                );
                              }
                            }}
                          >
                            <a>启用</a>
                          </Popconfirm>
                        </span>
                        // ) : (
                        //   '暂无权限，请联系管理员处理'
                        // )
                      }
                    />
                  </div>
                </div>
              ),
            };
          }
          setTimeout(() => {
            if (item) {
              DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, item);
            }
            resolve({});
          }, time);
        }
      }
    });

  // 网关父设备
  const diagnoseParentDevice = () =>
    new Promise(async (resolve) => {
      DiagnoseStatusModel.count++;
      if (device.state?.value === 'online') {
        setTimeout(() => {
          DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
            key: 'parent-device',
            name: '网关父设备',
            desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
            status: 'success',
            text: '正常',
            info: null,
          });
          DiagnoseStatusModel.count++;
          resolve({});
        }, time);
      } else {
        if (!device?.parentId) {
          setTimeout(() => {
            DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
              key: 'parent-device',
              name: '网关父设备',
              desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
              status: 'error',
              text: '异常',
              info: (
                <div>
                  <div className={styles.infoItem}>
                    <Badge
                      status="default"
                      text={
                        <span>
                          未绑定父设备，请先<a>绑定</a>父设备后重试
                        </span>
                      }
                    />
                  </div>
                </div>
              ),
            });
            DiagnoseStatusModel.count++;
            resolve({});
          }, time);
        } else {
          let item: ListProps | undefined = undefined;
          const response = await service.detail(device?.parentId);
          if (response.status === 200) {
            if (response?.state?.value === 'notActive') {
              item = {
                key: 'parent-device',
                name: '网关父设备',
                desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                status: 'error',
                text: '异常',
                info: (
                  <div>
                    <div className={styles.infoItem}>
                      <Badge
                        status="default"
                        text={
                          <span>
                            网关父设备已禁用，请先<a>启用</a>
                          </span>
                        }
                      />
                    </div>
                  </div>
                ),
              };
            } else if (response?.state?.value === 'online') {
              item = {
                key: 'parent-device',
                name: '网关父设备',
                desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                status: 'success',
                text: '正常',
                info: null,
              };
            } else {
              item = {
                key: 'parent-device',
                name: '网关父设备',
                desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                status: 'error',
                text: '异常',
                info: (
                  <div>
                    <div className={styles.infoItem}>
                      <Badge
                        status="default"
                        text={<span>网关父设备已离线，请先排查网关设备故障</span>}
                      />
                    </div>
                  </div>
                ),
              };
            }
            setTimeout(() => {
              if (item) {
                DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, item);
                DiagnoseStatusModel.count++;
              }
              resolve({});
            }, time);
          }
        }
      }
      setTimeout(() => {
        resolve({});
      }, time);
    });

  // 产品状态
  const diagnoseProduct = () =>
    new Promise((resolve) => {
      DiagnoseStatusModel.count++;
      if (device.state?.value === 'online') {
        setTimeout(() => {
          DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
            key: 'product',
            name: '产品状态',
            desc: '诊断产品状态是否正常，禁用状态将导致设备连接失败',
            status: 'success',
            text: '正常',
            info: null,
          });
          DiagnoseStatusModel.count++;
          resolve({});
        }, time);
      } else {
        if (device?.productId) {
          service.queryProductState(device.productId).then((response: any) => {
            if (response.status === 200) {
              DiagnoseStatusModel.product = response.result;
              let item: ListProps | undefined = undefined;
              const state = response.result?.state;
              item = {
                key: 'product',
                name: '产品状态',
                desc: '诊断产品状态是否正常，禁用状态将导致设备连接失败',
                status: state === 1 ? 'success' : 'error',
                text: state === 1 ? '正常' : '异常',
                info:
                  state === 1 ? null : (
                    <div>
                      <div className={styles.infoItem}>
                        <Badge
                          status="default"
                          text={
                            // productPermission.action ? (
                            <span>
                              产品已禁用，请
                              <Popconfirm
                                title="确认启用"
                                onConfirm={async () => {
                                  const resp = await service.deployProduct(device.productId || '');
                                  if (resp.status === 200) {
                                    onlyMessage('操作成功！');
                                    DiagnoseStatusModel.list = modifyArrayList(
                                      DiagnoseStatusModel.list,
                                      {
                                        key: 'product',
                                        name: '产品状态',
                                        desc: '诊断产品状态是否正常，禁用状态将导致设备连接失败',
                                        status: 'success',
                                        text: '正常',
                                        info: null,
                                      },
                                    );
                                  }
                                }}
                              >
                                <a>启用</a>
                              </Popconfirm>
                              产品
                            </span>
                            // ) : (
                            //   '暂无权限，请联系管理员处理'
                            // )
                          }
                        />
                      </div>
                    </div>
                  ),
              };
              setTimeout(() => {
                if (item) {
                  DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, item);
                }
                DiagnoseStatusModel.count++;
                resolve({});
              }, time);
            } else {
              resolve({});
            }
          });
        }
      }
    });

  // 设备状态
  const diagnoseDevice = () =>
    new Promise((resolve) => {
      DiagnoseStatusModel.count++;
      if (device.state?.value === 'online') {
        setTimeout(() => {
          DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
            key: 'device',
            name: '设备状态',
            desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
            status: 'success',
            text: '正常',
            info: null,
          });
          DiagnoseStatusModel.count++;
          resolve({});
        }, time);
      } else {
        let item: ListProps | undefined = undefined;
        if (InstanceModel.detail?.state?.value === 'notActive') {
          item = {
            key: 'device',
            name: '设备状态',
            desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
            status: 'error',
            text: '异常',
            info: (
              <div>
                <div className={styles.infoItem}>
                  <Badge
                    status="default"
                    text={
                      // devicePermission.action ? (
                      <span>
                        设备已禁用，请
                        <Popconfirm
                          title="确认启用"
                          onConfirm={async () => {
                            const resp = await service.deployDevice(device?.id || '');
                            if (resp.status === 200) {
                              InstanceModel.detail.state = { value: 'offline', text: '离线' };
                              onlyMessage('操作成功！');
                              DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                                key: 'device',
                                name: '设备状态',
                                desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
                                status: 'success',
                                text: '正常',
                                info: null,
                              });
                            }
                          }}
                        >
                          <a>启用</a>
                        </Popconfirm>
                        设备
                      </span>
                      // ) : (
                      //   '暂无权限，请联系管理员处理'
                      // )
                    }
                  />
                </div>
              </div>
            ),
          };
        } else {
          item = {
            key: 'device',
            name: '设备状态',
            desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
            status: 'success',
            text: '正常',
            info: null,
          };
        }
        setTimeout(() => {
          if (item) {
            DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, item);
          }
          DiagnoseStatusModel.count++;
          resolve({});
        }, time);
      }
    });

  // 产品认证配置
  const diagnoseProductAuthConfig = () =>
    new Promise(async (resolve) => {
      if (device?.productId) {
        const response = await service.queryDeviceConfig(device.productId);
        if (response.status === 200 && response.result.length > 0) {
          DiagnoseStatusModel.configuration.product = response.result;
          const list = [...DiagnoseStatusModel.list];
          const configuration = DiagnoseStatusModel.product?.configuration || {};
          response.result.map((item: any, i: number) => {
            if (!_.map(list, 'key').includes(`product-auth${i}`)) {
              DiagnoseStatusModel.list = modifyArrayList(
                DiagnoseStatusModel.list,
                {
                  key: `product-auth${i}`,
                  name: `产品-${item?.name}`,
                  desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                  status: 'loading',
                  text: '正在诊断中...',
                  info: null,
                },
                list.length,
              );
            }
            const properties = _.map(item?.properties, 'property');
            if (device.state?.value === 'online') {
              setTimeout(() => {
                DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                  key: `product-auth${i}`,
                  name: `产品-${item?.name}`,
                  desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                  status: 'success',
                  text: '正常',
                  info: null,
                });
                DiagnoseStatusModel.count++;
                resolve({});
              }, time);
            } else if (properties.length > 0 && Object.keys(configuration).length > 0) {
              if (
                _.union(Object.keys(configuration), properties).length <
                Object.keys(configuration).length + properties.length
              ) {
                setTimeout(() => {
                  DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                    key: `product-auth${i}`,
                    name: `产品-${item?.name}`,
                    desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                    status: 'error',
                    text: '可能存在异常',
                    info: (
                      <div>
                        <div className={styles.infoItem}>
                          <Badge
                            status="default"
                            text={
                              <span>
                                请
                                <a
                                  onClick={() => {
                                    manualInspection({
                                      type: 'product',
                                      key: `product-auth${i}`,
                                      name: `产品-${item?.name}`,
                                      desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                                      data: { ...item },
                                      configuration,
                                      productId: device.productId,
                                    });
                                  }}
                                >
                                  人工检查
                                </a>
                                产品{item.name}
                                配置是否已填写正确,若您确定该项无需诊断可
                                <Popconfirm
                                  title="确认忽略？"
                                  onConfirm={() => {
                                    DiagnoseStatusModel.list = modifyArrayList(
                                      DiagnoseStatusModel.list,
                                      {
                                        key: `product-auth${i}`,
                                        name: `产品-${item?.name}`,
                                        desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                                        status: 'success',
                                        text: '正常',
                                        info: null,
                                      },
                                    );
                                  }}
                                >
                                  <a>忽略</a>
                                </Popconfirm>
                              </span>
                            }
                          />
                        </div>
                      </div>
                    ),
                  });
                  DiagnoseStatusModel.count++;
                  resolve({});
                }, time);
              } else {
                setTimeout(() => {
                  DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                    key: `product-auth${i}`,
                    name: `产品-${item?.name}`,
                    desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                    status: 'error',
                    text: '异常',
                    info: (
                      <div>
                        <div className={styles.infoItem}>
                          <Badge
                            status="default"
                            text={
                              <span>
                                请根据设备接入配置需要
                                <a
                                  onClick={() => {
                                    jumpAccessConfig();
                                  }}
                                >
                                  填写
                                </a>
                                ，若您确定该项无需诊断可
                                <Popconfirm
                                  title="确认忽略？"
                                  onConfirm={() => {
                                    DiagnoseStatusModel.list = modifyArrayList(
                                      DiagnoseStatusModel.list,
                                      {
                                        key: `product-auth${i}`,
                                        name: `产品-${item?.name}`,
                                        desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                                        status: 'success',
                                        text: '正常',
                                        info: null,
                                      },
                                    );
                                  }}
                                >
                                  <a>忽略</a>
                                </Popconfirm>
                              </span>
                            }
                          />
                        </div>
                      </div>
                    ),
                  });
                  DiagnoseStatusModel.count++;
                  resolve({});
                }, time);
              }
            } else if (properties.length > 0 && Object.keys(configuration).length === 0) {
              setTimeout(() => {
                DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                  key: `product-auth${i}`,
                  name: `产品-${item?.name}`,
                  desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                  status: 'error',
                  text: '异常',
                  info: (
                    <div>
                      <div className={styles.infoItem}>
                        <Badge
                          status="default"
                          text={
                            <span>
                              请根据设备接入配置需要
                              <a
                                onClick={() => {
                                  jumpAccessConfig();
                                }}
                              >
                                填写
                              </a>
                              ，若您确定该项无需诊断可
                              <Popconfirm
                                title="确认忽略？"
                                onConfirm={() => {
                                  DiagnoseStatusModel.list = modifyArrayList(
                                    DiagnoseStatusModel.list,
                                    {
                                      key: `product-auth${i}`,
                                      name: `产品-${item?.name}`,
                                      desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                                      status: 'success',
                                      text: '正常',
                                      info: null,
                                    },
                                  );
                                }}
                              >
                                <a>忽略</a>
                              </Popconfirm>
                            </span>
                          }
                        />
                      </div>
                    </div>
                  ),
                });
                DiagnoseStatusModel.count++;
                resolve({});
              }, time);
            }
          });
        } else {
          resolve({});
        }
      }
    });

  // 设备认证配置
  const diagnoseDeviceAuthConfig = () =>
    new Promise(async (resolve) => {
      if (device?.id) {
        const response = await service.queryDeviceConfig(device.id);
        if (response.status === 200 && response.result.length > 0) {
          DiagnoseStatusModel.configuration.device = response.result;
          const list = [...DiagnoseStatusModel.list];
          const configuration = device?.configuration || {};
          response.result.map((item: any, i: number) => {
            if (!_.map(list, 'key').includes(`device-auth${i}`)) {
              DiagnoseStatusModel.list = modifyArrayList(
                DiagnoseStatusModel.list,
                {
                  key: `device-auth${i}`,
                  name: `设备-${item?.name}`,
                  desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                  status: 'loading',
                  text: '正在诊断中...',
                  info: null,
                },
                list.length,
              );
            }
            const properties = _.map(item?.properties, 'property');
            if (device.state?.value === 'online') {
              setTimeout(() => {
                DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                  key: `device-auth${i}`,
                  name: `设备-${item?.name}`,
                  desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                  status: 'success',
                  text: '正常',
                  info: null,
                });
                DiagnoseStatusModel.count++;
                resolve({});
              }, time);
            } else if (properties.length > 0 && Object.keys(configuration).length > 0) {
              if (
                _.union(Object.keys(configuration), properties).length <
                Object.keys(configuration).length + properties.length
              ) {
                setTimeout(() => {
                  DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                    key: `device-auth${i}`,
                    name: `设备-${item?.name}`,
                    desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                    status: 'error',
                    text: '可能存在异常',
                    info: (
                      <div>
                        <div className={styles.infoItem}>
                          <Badge
                            status="default"
                            text={
                              <span>
                                请
                                <a
                                  onClick={() => {
                                    manualInspection({
                                      type: 'device',
                                      key: `device-auth${i}`,
                                      name: `设备-${item?.name}`,
                                      desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                                      data: { ...item },
                                      configuration,
                                      productId: device.productId,
                                    });
                                  }}
                                >
                                  人工检查
                                </a>
                                设备{item.name}
                                配置是否已填写正确,若您确定该项无需诊断可
                                <Popconfirm
                                  title="确认忽略？"
                                  onConfirm={() => {
                                    DiagnoseStatusModel.list = modifyArrayList(
                                      DiagnoseStatusModel.list,
                                      {
                                        key: `device-auth${i}`,
                                        name: `设备-${item?.name}`,
                                        desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                                        status: 'success',
                                        text: '正常',
                                        info: null,
                                      },
                                    );
                                  }}
                                >
                                  <a>忽略</a>
                                </Popconfirm>
                              </span>
                            }
                          />
                        </div>
                      </div>
                    ),
                  });
                  DiagnoseStatusModel.count++;
                  resolve({});
                }, time);
              } else {
                setTimeout(() => {
                  DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                    key: `device-auth${i}`,
                    name: `设备-${item?.name}`,
                    desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                    status: 'error',
                    text: '异常',
                    info: (
                      <div>
                        <div className={styles.infoItem}>
                          <Badge
                            status="default"
                            text={
                              <span>
                                请根据设备接入配置需要
                                <a
                                  onClick={() => {
                                    jumpDeviceConfig();
                                  }}
                                >
                                  填写
                                </a>
                                ，若您确定该项无需诊断可
                                <Popconfirm
                                  title="确认忽略？"
                                  onConfirm={() => {
                                    DiagnoseStatusModel.list = modifyArrayList(
                                      DiagnoseStatusModel.list,
                                      {
                                        key: `device-auth${i}`,
                                        name: `设备-${item?.name}`,
                                        desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                                        status: 'success',
                                        text: '正常',
                                        info: null,
                                      },
                                    );
                                  }}
                                >
                                  <a>忽略</a>
                                </Popconfirm>
                              </span>
                            }
                          />
                        </div>
                      </div>
                    ),
                  });
                  DiagnoseStatusModel.count++;
                  resolve({});
                }, time);
              }
            } else if (properties.length > 0 && Object.keys(configuration).length === 0) {
              setTimeout(() => {
                DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                  key: `device-auth${i}`,
                  name: `设备-${item?.name}`,
                  desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                  status: 'error',
                  text: '异常',
                  info: (
                    <div>
                      <div className={styles.infoItem}>
                        <Badge
                          status="default"
                          text={
                            <span>
                              请根据设备接入配置需要
                              <a
                                onClick={() => {
                                  jumpDeviceConfig();
                                }}
                              >
                                填写
                              </a>
                              ，若您确定该项无需诊断可
                              <Popconfirm
                                title="确认忽略？"
                                onConfirm={() => {
                                  DiagnoseStatusModel.list = modifyArrayList(
                                    DiagnoseStatusModel.list,
                                    {
                                      key: `device-auth${i}`,
                                      name: `设备-${item?.name}`,
                                      desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                                      status: 'success',
                                      text: '正常',
                                      info: null,
                                    },
                                  );
                                }}
                              >
                                <a>忽略</a>
                              </Popconfirm>
                            </span>
                          }
                        />
                      </div>
                    </div>
                  ),
                });
                DiagnoseStatusModel.count++;
                resolve({});
              }, time);
            }
          });
        } else {
          resolve({});
        }
      }
    });

  // // opc
  // const diagnoseOpcua = () => new Promise(() => {

  // })
  // //modbus
  // const diagnoseModbus = () => new Promise(() => {

  // })

  // 设备离线且全部诊断项都是正确的情况后
  const diagnoseNetworkOtherConfig = async () => {
    if (device.state?.value != 'online') {
      const item: ReactNode[] = [];
      if (providerType === 'network') {
        DiagnoseStatusModel.configuration.product.map((it) => {
          item.push(
            <Badge
              status="default"
              text={
                <span>
                  产品-{it.name}规则可能有加密处理，请认真查看
                  <a
                    onClick={() => {
                      jumpAccessConfig();
                    }}
                  >
                    设备接入配置
                  </a>
                  中【消息协议】说明
                </span>
              }
            />,
          );
        });
        DiagnoseStatusModel.configuration.device.map((it) => {
          item.push(
            <Badge
              status="default"
              text={
                <span>
                  设备-{it.name}规则可能有加密处理，请认真查看
                  <a
                    onClick={() => {
                      jumpAccessConfig();
                    }}
                  >
                    设备接入配置
                  </a>
                  中【消息协议】说明
                </span>
              }
            />,
          );
        });
        if (
          device?.protocol &&
          device?.accessProvider &&
          gatewayList.includes(device?.accessProvider)
        ) {
          const response = await service.queryProcotolDetail(device.protocol, 'MQTT');
          if (response.status === 200) {
            if ((response.result?.routes || []).length > 0) {
              item.push(
                <Badge
                  status="default"
                  text={
                    // accessPermission.view ? (
                    <span>
                      请根据
                      <a
                        onClick={() => {
                          jumpAccessConfig();
                        }}
                      >
                        设备接入配置
                      </a>
                      中${urlMap.get(device?.accessProvider) || ''}信息，任意上报一条数据
                    </span>
                    // ) : (
                    //   `请联系管理员提供${
                    //     urlMap.get(device?.accessProvider) || ''
                    //   }信息，并根据URL信息任意上报一条数据）`
                    // )
                  }
                />,
              );
            } else {
              item.push(
                <Badge
                  status="default"
                  text={
                    <span>
                      请联系管理员提供${urlMap.get(device?.accessProvider) || ''}
                      信息，并根据URL信息任意上报一条数据
                    </span>
                  }
                />,
              );
            }
          }
        }
      } else if (providerType === 'child-device') {
      } else if (providerType === 'media') {
      } else if (providerType === 'cloud') {
      } else if (providerType === 'channel') {
      }
      item.push(<Badge status="default" text="请检查设备是否已开机" />);
      setDiagnoseData(item);
      setDiagnoseVisible(true);
    } else {
      DiagnoseStatusModel.state = 'success';
    }
  };

  useEffect(() => {
    if (DiagnoseStatusModel.status === 'finish') {
      const list = _.uniq(_.map(DiagnoseStatusModel.list, 'status'));
      if (device.state?.value !== 'online') {
        DiagnoseStatusModel.state = 'error';
        if (list[0] === 'success' && list.length === 1) {
          diagnoseNetworkOtherConfig();
        }
      } else {
        DiagnoseStatusModel.state = 'success';
      }
    }
  }, [DiagnoseStatusModel.status, DiagnoseStatusModel.list]);

  const handleSearch = async () => {
    DiagnoseStatusModel.gateway = {};
    DiagnoseStatusModel.product = {};
    DiagnoseStatusModel.configuration = {
      product: [],
      device: [],
    };
    DiagnoseStatusModel.count = 0;
    DiagnoseStatusModel.status = 'loading';
    DiagnoseStatusModel.percent = 0;
    if (providerType === 'network') {
      DiagnoseStatusModel.list = [...networkInitList];
      await diagnoseNetwork();
      DiagnoseStatusModel.percent = 20;
      await diagnoseGateway();
      DiagnoseStatusModel.percent = 40;
      await diagnoseProduct();
      await diagnoseDevice();
      DiagnoseStatusModel.percent = 60;
      await diagnoseProductAuthConfig();
      await diagnoseDeviceAuthConfig();
    } else if (providerType === 'child-device') {
      DiagnoseStatusModel.list = [...childInitList];
      await diagnoseNetwork();
      await diagnoseGateway();
      DiagnoseStatusModel.percent = 40;
      await diagnoseParentDevice();
      await diagnoseProduct();
      await diagnoseDevice();
    } else if (providerType === 'media') {
      DiagnoseStatusModel.list = [...mediaInitList];
      await diagnoseGateway();
      DiagnoseStatusModel.percent = 40;
      await diagnoseProduct();
      await diagnoseDevice();
    } else if (providerType === 'cloud') {
      DiagnoseStatusModel.list = [...cloudInitList];
      await diagnoseGateway();
      DiagnoseStatusModel.percent = 40;
      await diagnoseProduct();
      await diagnoseDevice();
    } else if (providerType === 'channel') {
      DiagnoseStatusModel.list = [...channelInitList];
      await diagnoseGateway();
      DiagnoseStatusModel.percent = 40;
      await diagnoseProduct();
      await diagnoseDevice();
    }
    DiagnoseStatusModel.percent = 100;
    DiagnoseStatusModel.status = 'finish';
  };

  useEffect(() => {
    if (DiagnoseStatusModel.state === 'loading' && providerType) {
      handleSearch();
    }
  }, [DiagnoseStatusModel.state, providerType]);

  return (
    <div className={styles.statusBox}>
      <div className={styles.statusHeader}>
        <TitleComponent data={'连接详情'} />
        <Space>
          {/* <Button type='primary'>一键修复</Button> */}
          <Button
            onClick={() => {
              DiagnoseStatusModel.state = 'loading';
            }}
          >
            重新诊断
          </Button>
        </Space>
      </div>
      <div className={styles.statusContent}>
        {DiagnoseStatusModel.list.map((item: ListProps) => (
          <div key={item.key} className={styles.statusItem}>
            <div className={styles.statusLeft}>
              <div className={styles.statusImg}>
                <img
                  style={{ height: 32 }}
                  className={item.status === 'loading' ? styles.loading : {}}
                  src={StatusMap.get(item.status)}
                />
              </div>
              <div className={styles.statusContext}>
                <div className={styles.statusTitle}>{item.name}</div>
                <div className={styles.statusDesc}>{item.desc}</div>
                <div className={styles.info}>{item?.info}</div>
              </div>
            </div>
            <div className={styles.statusRight} style={{ color: textColorMap.get(item.status) }}>
              {item?.text}
            </div>
          </div>
        ))}
      </div>
      {diagnoseVisible && (
        <DiagnosticAdvice
          data={diagnoseData}
          close={() => {
            setDiagnoseVisible(false);
          }}
        />
      )}
      {artificialVisible && (
        <ManualInspection
          data={artificiaData}
          close={() => {
            setArtificialVisible(false);
          }}
          save={(params: any) => {
            DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
              key: params.key,
              name: params.name,
              desc: params.desc,
              status: 'success',
              text: '正常',
              info: null,
            });
            setArtificialVisible(false);
          }}
        />
      )}
    </div>
  );
});

export default Status;
