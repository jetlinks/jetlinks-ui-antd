import { Button, Card, Col, Input, Popover, Row } from 'antd';
import { useEffect, useState } from 'react';
import { service } from '@/pages/system/Platforms';
import Service from '../service';
import * as moment from 'moment';
import ApiPage from '@/pages/system/Platforms/Api/base';

const defaultHeight = 50;

export default () => {
  const api = new Service();
  const [clientId, setClientId] = useState('');
  const [secureKey, setSecureKey] = useState('');
  const [sdkDetail, setSdkDetail] = useState<any>({});

  const getDetail = async (id: string) => {
    const resp = await service.getDetail(id);
    if (resp.status === 200) {
      setClientId(resp.result?.id);
      setSecureKey(resp.result?.secureKey);
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
    //  请求SDK下载地址
    getSDKDetail();
    api.userDetail().then((res) => {
      if (res.status === 200) {
        api
          .apiDetail({
            terms: [
              {
                column: 'userId',
                value: res.result.id,
              },
            ],
          })
          .then((response) => {
            if (response.status === 200) {
              getDetail(response.result.data[0].id);
            }
          });
      }
    });
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
  );
};
