import { Avatar, Button, Card, Col, message, Row } from 'antd';
import { useEffect, useState } from 'react';
import Service from '@/pages/account/Center/service';
import styles from './index.less';

export const service = new Service();

const Bind = () => {
  const [bindUser, setBindUser] = useState<any>();
  const [user, setUser] = useState<any>();
  const [code, setCode] = useState<string>('');

  const iconMap = new Map();
  iconMap.set('dingtalk', require('/public/images/notice/dingtalk.png'));
  iconMap.set('wechat-webapp', require('/public/images/notice/wechat.png'));

  const bGroundMap = new Map();
  bGroundMap.set('dingtalk', require('/public/images/notice/dingtalk-background.png'));
  bGroundMap.set('wechat-webapp', require('/public/images/notice/wechat-background.png'));

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
    const params = window.location.href.split('?')[1].split('&')[1].split('=')[1];
    // const params = 'b584032923c78d69e6148cf0e9312723'
    setCode(params);
    bindUserInfo(params);
    getDetail();
  }, []);
  return (
    <>
      <Card>
        <div style={{ margin: '0 auto', width: 800 }}>
          <Row>
            <Col span={12} className={styles.col}>
              <Card title="个人信息">
                <div className={styles.item}>
                  <div style={{ height: 100 }}>
                    <Avatar size={90} src={user?.avatar} />
                  </div>
                  <p>登录账号：{user?.username}</p>
                  <p>姓名：{user?.name}</p>
                </div>
              </Card>
            </Col>
            <Col span={12} className={styles.col}>
              <Card title="三方账号信息">
                <div className={styles.item}>
                  <div style={{ height: 100 }}>
                    <img style={{ height: 80 }} src={iconMap.get(bindUser?.type)} />
                  </div>
                  <p>组织：{bindUser?.providerName}</p>
                  <p>名字：{bindUser?.result.others.name}</p>
                </div>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'center', marginTop: 20 }}>
              <Button
                type="primary"
                onClick={() => {
                  // window.close()
                  service.bind(code).then((res) => {
                    if (res.status === 200) {
                      message.success('绑定成功');
                      localStorage.setItem('onBind', 'true');
                      setTimeout(() => window.close(), 300);
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
        </div>
      </Card>
    </>
  );
};
export default Bind;
