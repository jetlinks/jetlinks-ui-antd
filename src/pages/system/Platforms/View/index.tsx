import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Input, Popover, Row } from 'antd';
import ApiPage from '../Api/base';
import { useEffect, useState } from 'react';
import { useLocation } from 'umi';
import { service } from '@/pages/system/Platforms';
import * as moment from 'moment';

const defaultHeight = 50;

export default () => {
  const location = useLocation();

  const [clientId, setClientId] = useState('');
  const [secureKey, setSecureKey] = useState('');
  const [sdkDetail, setSdkDetail] = useState<any>({});

  const getDetail = async (id: string) => {
    const resp = await service.getDetail(id);
    if (resp.status === 200) {
      setClientId(resp.result.id);
      setSecureKey(resp.result.secureKey);
    }
  };

  const getSDKDetail = async () => {
    const resp = await service.getSdk();
    if (resp.status === 200) {
      setSdkDetail(resp.result[0]);
    }
  };

  const downLoad = (url: string) => {
    if (url) {
      const downNode = document.createElement('a');
      downNode.href = url;
      downNode.download = `${moment(new Date()).format('YYYY-MM-DD-HH-mm-ss')}.sdk`;
      downNode.style.display = 'none';
      downNode.setAttribute('target', '_blank');
      document.body.appendChild(downNode);
      downNode.click();
      document.body.removeChild(downNode);
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
    getSDKDetail();
  }, []);

  const downLoadJDK = (
    <div>
      <div
        style={{
          width: 500,
          borderRadius: 2,
          marginBottom: 12,
        }}
      >
        <Input.TextArea value={sdkDetail?.dependency} rows={6} readOnly />
      </div>
      <Button
        type={'primary'}
        style={{ width: '100%' }}
        onClick={() => {
          downLoad(sdkDetail.sdk);
        }}
      >
        jar下载
      </Button>
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
            <ApiPage type={'authorize'} showDebugger={true} isShowGranted={true} showHome={true} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
