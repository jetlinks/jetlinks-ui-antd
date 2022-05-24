import { Button, Card, message } from 'antd';
import { useEffect, useState } from 'react';
import Service from '@/pages/account/Center/service';
import styles from './index.less';

export const service = new Service();

const Bind = () => {
  const [bindUser, setBindUser] = useState<any>();
  const [user, setUser] = useState<any>();
  const [code, setCode] = useState<string>('');

  const bindPage = require('/public/images/bind/bindPage.png');
  const Vector = require('/public/images/bind/Vector.png');
  const Rectangle = require('/public/images/bind/Rectangle.png');
  const logo = require('/public/images/bind/jetlinksLogo.png');

  const iconMap = new Map();
  iconMap.set('dingtalk', require('/public/images/notice/dingtalk.png'));
  iconMap.set('wechat-webapp', require('/public/images/notice/wechat.png'));

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
      <div
        style={{
          width: '100%',
          height: '100%',
          background: `url(${bindPage}) no-repeat`,
          backgroundSize: '100% 100%',
        }}
      >
        <div className={styles.cards}>
          <div className={styles.title}>第三方账户绑定</div>
          <div className={styles.info}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div>
                    <img src={Rectangle} />
                  </div>
                  <div className={styles.infotitle}>个人信息</div>
                </div>
              }
            >
              <div className={styles.item}>
                <div style={{ height: 100, marginTop: 10, marginBottom: 10 }}>
                  <img src={logo} style={{ width: 90, height: 90 }} />
                </div>
                <p className={styles.fonts}>账号：{user?.username}</p>
                <p className={styles.fonts}>用户名：{user?.name}</p>
              </div>
            </Card>
            <div style={{ position: 'relative', top: '135px', margin: '0 20px' }}>
              <img src={Vector} />
            </div>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div>
                    <img src={Rectangle} />
                  </div>
                  <div className={styles.infotitle}>三方账户信息</div>
                </div>
              }
            >
              <div className={styles.item}>
                <div style={{ height: 100, marginTop: 10, marginBottom: 10 }}>
                  <img style={{ height: 80 }} src={iconMap.get(bindUser?.type)} />
                </div>
                <p className={styles.fonts}>账户：{bindUser?.providerName}</p>
                <p className={styles.fonts}>用户名：{bindUser?.result.others.name}</p>
              </div>
            </Card>
          </div>
          <div className={styles.btn}>
            <Button
              style={{ marginTop: 30, marginBottom: 30 }}
              type="primary"
              onClick={() => {
                // window.close()
                service.bind(code).then((res) => {
                  if (res.status === 200) {
                    message.success('绑定成功');
                    localStorage.setItem('onBind', 'true');
                    setTimeout(() => window.close(), 1000);
                  } else {
                    message.error('绑定失败');
                  }
                });
              }}
            >
              立即绑定
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Bind;
