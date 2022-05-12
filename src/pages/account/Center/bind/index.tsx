import { Button, Card, Col, message, Row } from 'antd';
import { useEffect, useState } from 'react';
import Service from '@/pages/account/Center/service';

export const service = new Service();

const Bind = () => {
  const [bindUser, setBindUser] = useState<any>();
  const [user, setUser] = useState<any>();
  const [code, setCode] = useState<string>('');

  const bindUserInfo = (params: string) => {
    service.bindUserInfo(params).then((res) => {
      if (res.status === 200) {
        setBindUser(res.result);
      }
    });
  };
  const getDetail = () => {
    service.getUserDetail().subscribe((res) => {
      setUser(res.result);
    });
  };

  useEffect(() => {
    // window.open('http://z.jetlinks.cn')
    // const item = `http://pro.jetlinks.cn/#/user/login?sso=true&code=4decc08bcb87f3a4fbd74976fd86cd3d&redirect=http://pro.jetlinks.cn/jetlinks`;
    const params = window.location.href.split('?')[1].split('&')[1].split('=')[1];
    setCode(params);
    bindUserInfo(params);
    getDetail();
  }, []);
  return (
    <>
      <Card>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Card title="个人信息">
              <p>登录账号：{user?.name}</p>
              <p>姓名：{user?.name}</p>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="三方账号信息">
              <p>类型：{bindUser?.type}</p>
              <p>组织：{bindUser?.providerName}</p>
            </Card>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={24} style={{ textAlign: 'center', marginTop: 20 }}>
            <Button
              type="primary"
              onClick={() => {
                service.bind(code).then((res) => {
                  if (res.status === 200) {
                    message.success('绑定成功');
                    if ((window as any).onBindSuccess) {
                      (window as any).onBindSuccess(res);
                      setTimeout(() => window.close(), 300);
                    }
                  } else {
                    message.error('绑定失败');
                  }
                });
              }}
            >
              立即绑定
            </Button>
          </Col>
        </Row>
      </Card>
    </>
  );
};
export default Bind;
