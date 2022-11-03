import './index.less';
import { Image } from 'antd';
interface Props {
  type: 'onelink' | 'ctwing' | 'unicom' | any;
}

const Doc = (props: Props) => {
  const { type } = props;

  return (
    <>
      {type === 'onelink' && (
        <div className="doc">
          <div className="url">
            中国移动物联卡能力开放平台：
            <a
              style={{ wordBreak: 'break-all' }}
              href="https://api.iot.10086.cn/api/index.html#/login"
              target={'_blank'}
              rel="noreferrer"
            >
              https://api.iot.10086.cn/api/index.html#/login
            </a>
          </div>
          <h1>1.概述</h1>
          <p>平台对接通过API的方式与三方系统进行数据对接，为物联卡的管理提供数据交互支持。</p>
          <h1>2.配置说明</h1>
          <h2>1、APP ID</h2>
          <p>
            第三方应用唯一标识，中国移动物联网全网管理员在 OneLink
            能力开放平台上分配并展示给集团客户。
            <br />
            获取路径：“中移物联卡能力开放平台”--“个人中心”--“客户信息”--“接入信息”
          </p>
          <div className={'image'}>
            <Image width="100%" src={require('/public/images/iot-card/onelink-appid.png')} />
          </div>
          <h2>2、Password</h2>
          <p>
            API 接入秘钥,由中国移动物联网提供，集团客户从“OneLink 能力开放平台”获取。
            <br />
            获取路径：“中移物联卡能力开放平台”--“个人中心”--“客户信息”--“接入信息”
          </p>
          <div className={'image'}>
            <Image width="100%" src={require('/public/images/iot-card/onelink-pass.png')} />
          </div>
          <h2>3、接口地址</h2>
          <p>
            https://api.iot.10086.cn/v5/ec/get/token
            <br />
            token后缀请根据实际情况填写
            <br />
            示例：https://api.iot.10086.cn/v5/authService?appid=xxx&password=xxx&transid=xxx
          </p>
        </div>
      )}

      {type === 'ctwing' && (
        <div className="doc">
          <div className="url">
            5G连接管理平台：
            <a
              style={{ wordBreak: 'break-all' }}
              href="https://cmp.ctwing.cn:4821/login"
              target={'_blank'}
              rel="noreferrer"
            >
              https://cmp.ctwing.cn:4821/login
            </a>
          </div>
          <div>
            <h1>1.概述</h1>
            <p>平台对接通过API的方式与三方系统进行数据对接，为物联卡的管理提供数据交互支持。</p>
            <h1>2.配置说明</h1>
            <h2>1、用户 id</h2>
            <p>
              5G连接管理平台用户的唯一标识，用于身份识别。
              <br />
              获取路径：“5G连接管理平台”--“能力开放”--“API网关账号管理”
            </p>
            <div className={'image'}>
              <Image width="100%" src={require('/public/images/iot-card/ctwing-id.png')} />
            </div>

            <h2>2、密码</h2>
            <p>
              用户id经加密之后的密码。
              <br />
              获取路径：“5G连接管理平台”--“能力开放”--“API网关账号管理”
            </p>
            <div className={'image'}>
              <Image width="100%" src={require('/public/images/iot-card/ctwing-pass.png')} />
            </div>

            <h2>3、secretKey</h2>
            <p>
              APP secret唯一秘钥。
              <br />
              获取路径：“5G连接管理平台”--“能力开放”--“API网关账号管理”
            </p>
            <div className={'image'}>
              <Image width="100%" src={require('/public/images/iot-card/ctwing-secret.png')} />
            </div>
          </div>
        </div>
      )}
      {type === 'unicom' && (
        <div className="doc">
          <div className="url">
            雁飞智连CMP平台：
            <a
              style={{ wordBreak: 'break-all' }}
              href="  https://cmp.10646.cn/webframe/login"
              target={'_blank'}
              rel="noreferrer"
            >
              https://cmp.10646.cn/webframe/login
            </a>
          </div>

          <div>
            <h1>1.概述</h1>
            <p>平台对接通过API的方式与三方系统进行数据对接，为物联卡的管理提供数据交互支持。</p>
            <h1>2.配置说明</h1>
            <h2>1、APP ID</h2>
            <p>
              第三方应用唯一标识。
              <br />
              获取路径：“雁飞智连CMP平台”--“我的应用”--“应用列表”
            </p>
            <div className={'image'}>
              <Image width="100%" src={require('/public/images/iot-card/unicom-id.png')} />
            </div>

            <h2>2、App Secret</h2>
            <p>
              API 接入秘钥。
              <br />
              获取路径：“雁飞智连CMP平台”--“我的应用”--“应用列表”
            </p>
            <div className={'image'}>
              <Image width="100%" src={require('/public/images/iot-card/unicom-secret.png')} />
            </div>

            <h2>3、创建者ID</h2>
            <p>
              接口参数中的 OpenId。
              <br />
              获取路径：“雁飞智连CMP平台”--“我的应用”--“应用列表”
              <br />
            </p>
            <div className={'image'}>
              <Image width="100%" src={require('/public/images/iot-card/unicom-openid.png')} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Doc;
