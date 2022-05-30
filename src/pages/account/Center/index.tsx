import { PageContainer } from '@ant-design/pro-layout';
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  message,
  Popconfirm,
  Row,
  Upload,
} from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { UploadProps } from 'antd/lib/upload';
import Token from '@/utils/token';
import SystemConst from '@/utils/const';
import { EditOutlined, LockOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import InfoEdit from './edit/infoEdit';
import PasswordEdit from './edit/passwordEdit';
import Service from '@/pages/account/Center/service';
import moment from 'moment';
import { useModel } from 'umi';

export const service = new Service();

const Center = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [data, setData] = useState<any>();
  const [imageUrl, setImageUrl] = useState<string>('');
  // const [loading, setLoading] = useState<boolean>(false)
  const [infos, setInfos] = useState<boolean>(false);
  const [password, setPassword] = useState<boolean>(false);
  const [bindList, setBindList] = useState<any>([]);

  const iconMap = new Map();
  iconMap.set('dingtalk', require('/public/images/notice/dingtalk.png'));
  iconMap.set('wechat-webapp', require('/public/images/notice/wechat.png'));

  const bGroundMap = new Map();
  bGroundMap.set('dingtalk', require('/public/images/notice/dingtalk-background.png'));
  bGroundMap.set('wechat-webapp', require('/public/images/notice/wechat-background.png'));

  const uploadProps: UploadProps = {
    showUploadList: false,
    accept: 'image/jpeg,image/png',
    action: `/${SystemConst.API_BASE}/file/static`,
    headers: {
      'X-Access-Token': Token.get(),
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('请上传.png.jpg格式的文件');
      }
      return isJpgOrPng;
    },
    onChange(info) {
      if (info.file.status === 'uploading') {
        // setLoading(true);
      }
      if (info.file.status === 'done') {
        setImageUrl(info.file.response.result);
        service
          .saveUserDetail({
            name: data.name,
            avatar: info.file.response.result,
          })
          .subscribe((res) => {
            if (res.status === 200) {
              setImageUrl(info.file.response.result);
              message.success('上传成功');
            }
          });
        // setLoading(false);
      }
    },
  };

  const getDetail = () => {
    service.getUserDetail().subscribe((res) => {
      setData(res.result);
      setImageUrl(res.result.avatar);
      // setInitialState({
      //   ...initialState,
      //   currentUser:{

      //   }
      // })
    });
  };
  const saveInfo = (parms: UserDetail) => {
    service.saveUserDetail(parms).subscribe((res) => {
      if (res.status === 200) {
        message.success('保存成功');
        getDetail();
        setInfos(false);
      } else {
        message.success('保存失败');
      }
    });
  };
  const savePassword = (parms: { oldPassword: string; newPassword: string }) => {
    service.savePassWord(parms).subscribe((res) => {
      if (res.status === 200) {
        message.success('保存成功');
      }
    });
  };
  const getBindInfo = () => {
    service.bindInfo().then((res) => {
      if (res.status === 200) {
        setBindList(res.result);
      }
    });
  };
  const unBind = (type: string, provider: string) => {
    service.unbind(type, provider).then((res) => {
      if (res.status === 200) {
        message.success('解绑成功');
        getBindInfo();
      }
    });
  };

  useEffect(() => {
    getDetail();
    getBindInfo();
  }, []);

  useEffect(() => {
    if (data?.name) {
      const item = {
        ...initialState?.currentUser?.user,
        name: data.name,
      };
      setInitialState({
        ...initialState,
        currentUser: {
          ...initialState?.currentUser,
          user: item,
        },
      });
    }
  }, [data]);

  return (
    <PageContainer>
      <Card>
        <div className={styles.top}>
          <div className={styles.avatar}>
            <div>
              {data?.avatar ? (
                <Avatar size={140} src={imageUrl} />
              ) : (
                <Avatar size={140} icon={<UserOutlined />} />
              )}
            </div>
            <Upload {...uploadProps}>
              <Button>
                <UploadOutlined />
                更换头像
              </Button>
            </Upload>
          </div>
          <div className={styles.content}>
            <Descriptions column={4} layout="vertical" labelStyle={{ fontWeight: 600 }}>
              <Descriptions.Item label="登录账号">{data?.username}</Descriptions.Item>
              <Descriptions.Item label="账号ID">{data?.id}</Descriptions.Item>
              <Descriptions.Item label="注册时间">
                {moment(data?.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="电话">{data?.telephone || '-'}</Descriptions.Item>
              <Descriptions.Item label="姓名">{data?.name}</Descriptions.Item>
              <Descriptions.Item label="角色">{data?.roleList[0]?.name || '-'}</Descriptions.Item>
              <Descriptions.Item label="部门">{data?.orgList[0]?.name || '-'}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{data?.email || '-'}</Descriptions.Item>
            </Descriptions>
          </div>
          <a>
            {' '}
            <EditOutlined
              className={styles.action}
              onClick={() => {
                setInfos(true);
              }}
            />
          </a>
        </div>
      </Card>
      <Card
        className={styles.info}
        title={
          <div style={{ fontSize: '22px' }}>
            <Divider type="vertical" style={{ backgroundColor: '#2F54EB', width: 3 }} />
            修改密码
          </div>
        }
        extra={
          <a>
            {' '}
            <EditOutlined
              onClick={() => {
                setPassword(true);
              }}
            />
          </a>
        }
      >
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <div>
            <LockOutlined
              style={{
                color: '#1d39c4',
                fontSize: '70px',
              }}
            />
          </div>
          <div style={{ marginLeft: 5, color: 'rgba(0, 0, 0, 0.55)' }}>
            安全性高的密码可以使帐号更安全。建议您定期更换密码,设置一个包含字母,符号或数字中至少两项且长度超过8位的密码
          </div>
        </div>
      </Card>
      <Card
        className={styles.info}
        title={
          <div style={{ fontSize: '22px' }}>
            <Divider type="vertical" style={{ backgroundColor: '#2F54EB', width: 3 }} />
            绑定三方账号
          </div>
        }
      >
        <Row gutter={[24, 24]}>
          {bindList.map((item: any) => (
            <Col key={item.type}>
              <Card
                style={{
                  background: `url(${bGroundMap.get(item.type)}) no-repeat`,
                  backgroundSize: '100% 100%',
                  width: 415,
                }}
              >
                <div className={styles.bind}>
                  <div>
                    <img style={{ height: 56 }} src={iconMap.get(item.type)} />
                  </div>
                  <div>
                    {item.bound ? (
                      <div>
                        <div style={{ fontSize: '22px' }}>绑定名:{item.others.name}</div>
                        <div
                          style={{
                            fontSize: '14px',
                            lineHeight: '20px',
                            marginTop: '5px',
                            color: '#00000073',
                          }}
                        >
                          绑定时间: {moment(item.bindTime).format('YYYY-MM-DD HH:mm:ss')}
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '22px' }}>{`${
                        item.type === 'dingtalk' ? '钉钉' : '微信'
                      }未绑定`}</div>
                    )}
                  </div>
                  <div>
                    {item.bound ? (
                      <Popconfirm
                        title="确认解除绑定嘛?"
                        onConfirm={() => {
                          unBind(item.type, item.provider);
                        }}
                      >
                        <Button>解除绑定</Button>
                      </Popconfirm>
                    ) : (
                      <Button
                        type="primary"
                        onClick={() => {
                          window.open(`/${SystemConst.API_BASE}/sso/${item.provider}/login`);
                          // window.open(`/#/account/center/bind`);
                          localStorage.setItem('onBind', 'false');
                          localStorage.setItem('onLogin', 'yes');
                          window.onstorage = (e) => {
                            if (e.newValue) {
                              getBindInfo();
                            }
                          };
                        }}
                      >
                        立即绑定
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
      {infos && (
        <InfoEdit
          data={data}
          save={(item: any) => {
            saveInfo(item);
          }}
          close={() => {
            setInfos(false);
          }}
        />
      )}
      {password && (
        <PasswordEdit
          save={(item: any) => {
            savePassword(item);
          }}
          visible={password}
          close={() => {
            setPassword(false);
          }}
        />
      )}
    </PageContainer>
  );
};
export default Center;
