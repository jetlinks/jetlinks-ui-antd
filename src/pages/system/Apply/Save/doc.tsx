import './index.less';
import { Image } from 'antd';

interface Props {
  type:
    | 'internal-standalone'
    | 'internal-integrated'
    | 'dingtalk-ent-app'
    | 'wechat-webapp'
    | 'third-party';
}

const Doc = (props: Props) => {
  const { type } = props;

  const img1 = require('/public/images/apply/1.png');
  const img2 = require('/public/images/apply/2.png');
  const img3 = require('/public/images/apply/3.png');
  const img4 = require('/public/images/apply/4.png');
  const img5 = require('/public/images/apply/5.png');

  return (
    <div className="doc">
      {type === 'internal-standalone' && (
        <>
          <h1>1.概述</h1>
          <div>
            内部独立应用适用于将<span>官方开发</span>的其他应用与<span>物联网平台相互集成</span>
            ，例如将可视化平台集成至物联网平台，或者将物联网平台集成至可视化平台。以实现多处访问、集中管控的业务场景。
          </div>
          <div>
            内部独立应用的<span>后端服务</span>相互<span>独立运行</span>，互不影响。
          </div>
          <div className="image">
            <Image width="100%" src={img1} />
          </div>

          <h1>2.接入方式说明</h1>
          <div>1、页面集成</div>
          <div>
            集成其他应用的<span>前端页面</span>至物联网平台中。为实现应用与物联网平台数据互联互通，
            <span>通常还需要配置API服务</span>。
          </div>
          <div>2、API客户端</div>
          <div>
            <span>物联网平台</span>请求<span>其他应用</span>
            的接口，以实现将物联网平台集成至其他应用系统。如需实现<span>其他应用</span>
            登录后可以访问<span>物联网平台</span>页面，<span>还需要配置单点登录</span>。
          </div>
          <div>3、API服务</div>
          <div>
            <span>外部应用</span>请求<span>物联网平台</span>的接口，实现物联网平台的服务调用能力，
            <span>通常还需要配置页面集成</span>。
          </div>
          <div>
            配置API服务后，系统将<span>自动创建</span>对应的<span>“第三方应用”用户</span>。用户的
            <span>账号/密码</span>分别对应appid/secureKey。
          </div>
          <div>
            第三方用户<span>可调用的API服务</span>在其应用管理卡片的<span>其他-{'>'}赋权</span>
            页面，进行<span>自定义配置</span>。
          </div>
          <div>4、单点登录</div>
          <div>
            通过<span>第三方平台账号</span>登录到物联网平台。
          </div>
        </>
      )}
      {type === 'internal-integrated' && (
        <>
          <h1>1.概述</h1>
          <div>
            内部集成应用适用于将<span>官方开发</span>的其他应用与<span>物联网平台相互集成</span>
            ，例如将可视化平台集成至物联网平台，或者将物联网平台集成至可视化平台。以实现多处访问、集中管控的业务场景。
          </div>
          <div>
            内部独立应用的<span>后端服务在同一个环境运行</span>。
          </div>
          <div className="image">
            <Image width="100%" src={img2} />
          </div>
          <h1>2.接入方式说明</h1>
          <div>1、页面集成</div>
          <div>
            集成其他应用的<span>前端页面</span>
            至物联网平台中。集成后系统顶部将新增对应的应用管理菜单
          </div>
          <div>2、API客户端</div>
          <div>
            <span>物联网平台</span>去请求其他应用的接口，以实现将物联网平台集成至其他应用
          </div>
        </>
      )}
      {type === 'dingtalk-ent-app' && (
        <>
          <div className={'url'}>
            钉钉开放平台：
            <a href="https://open-dev.dingtalk.com" target="_blank" rel="noopener noreferrer">
              https://open-dev.dingtalk.com
            </a>
          </div>
          <h1>1.概述</h1>
          <div>
            钉钉企业内部应用适用于通过钉钉登录<span>物联网平台</span>
          </div>
          <div className="image">
            <Image width="100%" src={img4} />
          </div>
          <h1>2.接入方式说明</h1>
          <div>1、单点登录</div>
          <div>通过钉钉账号登录到物联网平台。</div>
        </>
      )}
      {type === 'wechat-webapp' && (
        <>
          <div className={'url'}>
            微信开放平台：
            <a href="https://open.weixin.qq.com" target="_blank" rel="noopener noreferrer">
              https://open.weixin.qq.com
            </a>
          </div>
          <h1>1.概述</h1>
          <div>
            微信网站应用适用于通过微信授权登录<span>物联网平台</span>
          </div>
          <div className="image">
            <Image width="100%" src={img3} />
          </div>
          <h1>2.接入方式说明</h1>
          <div>1、单点登录</div>
          <div>通过微信账号登录到物联网平台。</div>
        </>
      )}
      {type === 'third-party' && (
        <>
          <h1>1. 概述</h1>
          <div>
            第三方应用适用于<span>第三方应用</span>与<span>物联网平台相互集成</span>
            。例如将公司业务管理系统集成至物联网平台，或者将物联网平台集成至业务管理系统。以实现多处访问、集中管控的业务场景。
          </div>
          <div className="image">
            <Image width="100%" src={img5} />
          </div>
          <h1>2.接入方式说明</h1>
          <div>1、页面集成</div>
          <div>
            集成其他应用的<span>前端页面</span>至物联网平台中。为实现应用与物联网平台数据互联互通，
            <span>还需要配置API服务</span>。
          </div>
          <div>2、API客户端</div>
          <div>
            <span>物联网平台</span>请求<span>第三方应用</span>
            的接口，以实现将物联网平台集成至其他应用。如需实现<span>第三方应用</span>登录后可以访问
            <span>物联网平台</span>页面，<span>还需要配置单点登录</span>。
          </div>
          <div>3、API服务</div>
          <div>
            <span>第三方应用</span>通过API服务配置，请求物联网平台接口，实现<span>物联网平台</span>
            的服务调用能力，<span>通常还需要配置页面集成</span>。
          </div>
          <div>
            配置API服务后，系统将<span>自动创建</span>对应的<span>“第三方应用”用户</span>。用户的
            <span>账号/密码</span>分别对应appid/secureKey。
          </div>
          <div>
            第三方用户<span>可调用的API服务</span>在其应用管理卡片的<span>其他-{'>'}赋权</span>
            页面，进行<span>自定义配置</span>。
          </div>
          <div>4、单点登录</div>
          <div>
            通过<span>第三方平台账号</span>登录到物联网平台。
          </div>
        </>
      )}
    </div>
  );
};
export default Doc;
