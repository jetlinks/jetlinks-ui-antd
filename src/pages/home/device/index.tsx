import { Col, Row } from 'antd';
import { PermissionButton } from '@/components';
import { Body, Guide } from '../components';
import Statistics from '../components/Statistics';
import Steps from '../components/Steps';

const Device = () => {
  const productPermission = PermissionButton.usePermission('device/Product').permission;
  const devicePermission = PermissionButton.usePermission('device/Instance').permission;
  const rulePermission = PermissionButton.usePermission('rule-engine/Instance').permission;
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
              value: 111,
              img: '',
            },
            {
              name: '设备数量',
              value: 12,
              img: '',
            },
          ]}
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
