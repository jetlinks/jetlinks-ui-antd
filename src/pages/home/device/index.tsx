import { Card, Col, message, Row } from 'antd';
import { PermissionButton } from '@/components';
import { getMenuPathByCode } from '@/utils/menu';
import Guide from '../components/Guide';
import Statistics from '../components/Statistics';
import Steps from '../components/Steps';

const Device = () => {
  const productPermission = PermissionButton.usePermission('device/Product').permission;
  const devicePermission = PermissionButton.usePermission('device/Instance').permission;
  const rulePermission = PermissionButton.usePermission('rule-engine/Instance').permission;
  // // 跳转
  const pageJump = (auth: boolean, url: string, param: string) => {
    if (auth) {
      // 判断是否有权限
      const path = getMenuPathByCode(url);
      if (path) {
        const tab: any = window.open(`${origin}/#${path}${param}`);
        tab!.onTabSaveSuccess = () => {
          // if (value.status === 200) {
          // }
        };
      }
    } else {
      message.error('暂无权限，请联系管理员');
    }
  };

  const guideList = [
    {
      key: 'product',
      name: '1、创建产品',
      auth: !!productPermission.add,
      url: 'device/Product',
      param: '?save=true',
    },
    {
      key: 'device',
      name: '2、创建设备',
      auth: !!devicePermission.add,
      url: 'device/Instance',
      param: '?save=true',
    },
    {
      key: 'rule-engine',
      name: '3、规则引擎',
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
      <Col span={12}>
        <Guide
          title="物联网引导"
          data={guideList}
          jump={(auth: boolean, url: string, param: string) => {
            pageJump(auth, url, param);
          }}
        />
      </Col>
      <Col span={12}>
        <Statistics />
      </Col>
      <Col span={24}>
        <Card style={{ margin: '20px 0' }} title="平台架构图">
          <img style={{ height: 500 }} src={require('/public/images/login.png')} />
        </Card>
      </Col>
      <Col span={24}>
        <Steps />
      </Col>
    </Row>
  );
};
export default Device;
