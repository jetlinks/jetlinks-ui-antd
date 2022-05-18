import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Popover, Row } from 'antd';
import ApiPage from '../Api/base';
import { useEffect, useState } from 'react';
import { useLocation } from 'umi';
import { service } from '@/pages/system/Platforms';

const defaultHeight = 50;

export default () => {
  const location = useLocation();

  const [clientId, setClientId] = useState('');
  const [secureKey, setSecureKey] = useState('');

  const getDetail = async (id: string) => {
    const resp = await service.getDetail(id);
    if (resp.status === 200) {
      setClientId(resp.result.id);
      setSecureKey(resp.result.secureKey);
    }
  };

  useEffect(() => {
    const param = new URLSearchParams(location.search);
    const code = param.get('code');
    if (code) {
      getDetail(code);
    }
  }, [location]);

  useEffect(() => {
    //  请求SDK下载地址
  }, []);

  const downLoadJDK = (
    <div>
      <div
        style={{
          width: 300,
          height: 120,
          padding: 12,
          border: '1px solid #e9e9e9',
          borderRadius: 2,
          marginBottom: 12,
        }}
      >
        暂时没有接口
      </div>
      <div>
        <Button type={'primary'}>jar下载</Button>
      </div>
    </div>
  );

  return (
    <PageContainer>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="基本信息">
                <div style={{ height: defaultHeight }}>
                  <div>
                    <span style={{ fontWeight: 'bold', fontSize: 16 }}>clientId: </span>
                    {clientId}
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', fontSize: 16 }}>secureKey: </span>
                    {secureKey}
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="SDK下载">
                <div style={{ height: defaultHeight }}>
                  <Popover trigger="click" title={'POM依赖'} content={downLoadJDK}>
                    <Button> Java </Button>
                  </Popover>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Card title={'API文档'}>
            <ApiPage showDebugger={true} isShowGranted={true} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
