import { Col, message, Row } from 'antd';
import { PermissionButton } from '@/components';
import { Guide, Body } from '../components';
import Statistics from '../components/Statistics';
import Steps from '../components/Steps';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { useHistory } from '@/hooks';
import { service } from '..';
import { useEffect, useState } from 'react';

const Device = () => {
  const productPermission = PermissionButton.usePermission('device/Product').permission;
  const devicePermission = PermissionButton.usePermission('device/Instance').permission;
  const rulePermission = PermissionButton.usePermission('rule-engine/Instance').permission;

  const [productCount, setProductCount] = useState<number>(0);
  const [deviceCount, setDeviceCount] = useState<number>(0);

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

  const history = useHistory();
  // // 跳转

  const guideList = [
    {
      key: 'product',
      name: '创建产品',
      english: 'CREATE PRODUCT',
      auth: !!productPermission.add,
      url: 'device/Product',
      param: '?save=true',
    },
    {
      key: 'device',
      name: '创建设备',
      english: 'CREATE DEVICE',
      auth: !!devicePermission.add,
      url: 'device/Instance',
      param: '?save=true',
    },
    {
      key: 'rule-engine',
      name: '规则引擎',
      english: 'RULE ENGINE',
      auth: !!rulePermission.add,
      url: 'rule-engine/Instance',
      param: '?save=true',
    },
  ];

  // const statisticsList = [{
  //   key: 'product',
  //   name: '1、创建产品',
  //   auth: !!productPermission.add,
  //   url: 'device/Product',
  //   param: "?save=true"
  // }, {
  //   key: 'device',
  //   name: '2、创建设备',
  //   auth: !!devicePermission.add,
  //   url: 'device/Instance',
  //   param: "?save=true"
  // },
  // {
  //   key: 'rule-engine',
  //   name: '3、规则引擎',
  //   auth: !!rulePermission.add,
  //   url: 'rule-engine/Instance',
  //   param: "?save=true"
  // }
  // ];

  return (
    <Row gutter={24}>
      <Col span={14}>
        <Guide
          title="物联网引导"
          data={guideList}
          // jump={(auth: boolean, url: string, param: string) => {
          //   pageJump(auth, url, param);
          // }}
        />
      </Col>
      <Col span={10}>
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
      <Col span={24}>
        <Body title={'平台架构图'} english={'PLATFORM ARCHITECTURE DIAGRAM'} />
      </Col>
      <Col span={24}>
        <Steps />
      </Col>
    </Row>
  );
};
export default Device;
