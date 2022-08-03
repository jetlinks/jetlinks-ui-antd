import { forwardRef, useImperativeHandle, useState } from 'react';
import { service } from '../../index';
import Save from './save';

const Data = forwardRef((_, ref) => {
  const [flag, setFlag] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [values, setValues] = useState<any>({});

  const handleChange = () => {
    return new Promise(async (resolve) => {
      if (!Object.keys(values).length) {
        return resolve(true);
      }
      try {
        // 新增网络组件
        const network = await service.saveNetwork({
          type: 'MQTT_SERVER',
          shareCluster: true,
          name: 'MQTT网络组件',
          configuration: {
            host: '0.0.0.0',
            secure: false,
            port: values.port,
            publicHost: values.publicHost,
            publicPort: values.publicPort,
          },
        });
        // 保存协议
        const protocol = await service.saveProtocol();
        let protocolItem: any = undefined;
        if (protocol.status === 200) {
          const proid = await service.getProtocol();
          if (proid.status === 200) {
            protocolItem = (proid?.result || []).find((it: any) => it.name === 'JetLinks官方协议');
          }
        }
        // 新增设备接入网关
        const accessConfig = await service.saveAccessConfig({
          name: 'MQTT类型设备接入网关',
          provider: 'mqtt-server-gateway',
          protocol: protocolItem?.id,
          transport: 'MQTT',
          channel: 'network',
          channelId: network?.result?.id,
        });
        // 新增产品
        const product = await service.saveProduct({
          name: 'MQTT产品',
          messageProtocol: protocolItem?.id,
          protocolName: protocolItem?.name,
          transportProtocol: 'MQTT',
          deviceType: 'device',
          accessId: accessConfig.result?.id,
          accessName: accessConfig.result?.name,
          accessProvider: 'mqtt-server-gateway',
        });
        // 新增设备
        const device = await service.saveDevice({
          name: 'MQTT设备',
          productId: product?.result?.id,
          productName: product?.result?.name,
        });

        if (device.status === 200) {
          service.changeDeploy(product.result.id);
          service.deployDevice(device.result.id);
        }
        resolve(device.status === 200);
      } catch (e) {
        console.log(e);
        resolve(false);
      }
    });
  };

  useImperativeHandle(ref, () => ({
    save: handleChange,
  }));

  return (
    <div>
      <img
        style={{ width: 300 }}
        onClick={() => {
          if (flag) {
            setFlag(false);
          } else {
            setVisible(true);
          }
        }}
        src={
          flag
            ? require('/public/images/init-home/data-enabled.png')
            : require('/public/images/init-home/data-disabled.png')
        }
      />
      {visible && (
        <Save
          close={() => {
            setVisible(false);
          }}
          data={values}
          save={(data: any) => {
            setVisible(false);
            setFlag(true);
            setValues(data);
          }}
        />
      )}
    </div>
  );
});

export default Data;
