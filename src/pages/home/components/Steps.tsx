import { RightOutlined } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';

const Steps = () => {
  return (
    <Card title={'设备接入推荐步骤'}>
      <Row gutter={24}>
        <Col span={4}>
          <Card
            bordered
            title="创建产品"
            onClick={() => {
              // pageJump(!!devicePermission.add, 'device/Instance')
            }}
          >
            产品是设备的集合，通常指一组具有相同功能的设备。物联设备必须通过产品进行接入方式配置。
          </Card>
        </Col>
        <Col span={1}>
          <RightOutlined />
        </Col>
        <Col span={4}>
          <Card bordered title="配置产品接入方式" onClick={() => {}}>
            通过产品对同一类型的所有设备进行统一的接入方式配置。请参照设备铭牌说明选择匹配的接入方式。
          </Card>
        </Col>
        <Col span={1}>
          <RightOutlined />
        </Col>
        <Col span={4}>
          <Card
            bordered
            title="添加测试设备"
            onClick={() => {
              // pageJump(!!devicePermission.add, 'device/Instance')
            }}
          >
            添加单个设备，用于验证产品模型是否配置正确。
          </Card>
        </Col>
        <Col span={1}>
          <RightOutlined />
        </Col>
        <Col span={4}>
          <Card bordered title="功能调试" onClick={() => {}}>
            对添加的测试设备进行功能调试，验证能否连接到平台，设备功能是否配置正确。
          </Card>
        </Col>
        <Col span={1}>
          <RightOutlined />
        </Col>
        <Col span={4}>
          <Card
            bordered
            title="批量添加设备"
            onClick={() => {
              // pageJump(!!devicePermission.add, 'device/Instance')
            }}
          >
            批量添加同一产品下的设备
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default Steps;
