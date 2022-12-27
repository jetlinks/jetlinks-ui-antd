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
            <span>通常还需要配置API服务</span>。集成后系统顶部将新增对应的应用管理菜单。
          </div>
          <div>2、API客户端</div>
          <div>
            <span>物联网平台</span>请求<span>其他应用</span>
            的接口，以实现将物联网平台集成至其他应用系统。为实现应用与物联网平台数据互联互通，
            <span>通常还需要配置单点登录</span>。
          </div>
          <div>3、API服务</div>
          <div>
            <span>外部应用</span>请求<span>物联网平台</span>的接口，以调用物联网平台的能力。
            <span>通常还需要配置页面集成</span>。也可<span>不配置</span>页面集成，
            <span>自行开发</span>前端页面来调用API服务。
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

          <h1>3.配置说明</h1>
          <div>1、页面集成</div>
          <div>接入地址：</div>
          <div>访问其他平台的地址，url地址+端口</div>

          <div>2、API客户端</div>
          <div>接入地址：</div>
          <div>访问API服务的地址，url地址+端口</div>
          <div>授权地址：</div>
          <div>认证授权地址，url地址+端口</div>
          <div>回调地址:</div>
          <div>授权之后跳转到具体页面的回调地址，url地址+端口</div>
          <div>请求头:</div>
          <div>根据不同应用的调用规范，自定义请求头内容</div>

          <div>3、API服务</div>
          <div>appid:</div>
          <div>调用API服务时所需的用户账号</div>
          <div>secureKey:</div>
          <div>调用API服务时所需的用户密码</div>
          <div>回调地址:</div>
          <div>授权之后跳转到具体页面的回调地址，url地址+端口</div>
          <div>角色:</div>
          <div>为API用户分配角色，根据绑定的角色，进行系统菜单赋权</div>
          <div>组织：</div>
          <div>为API用户分配所属组织，根据绑定的组织，进行数据隔离</div>

          <div>4、单点登录</div>
          <div>授权地址:</div>
          <div>oauth2授权地址，url地址+端口</div>
          <div>回调地址:</div>
          <div>授权之后跳转到具体页面的回调地址，url地址+端口</div>
          <div>appid:</div>
          <div>应用唯一标识</div>
          <div>appkey:</div>
          <div>与应用匹配的唯一秘钥</div>
          <div>自动创建用户：</div>
          <div>
            开启后，第三方用户第一次授权登录系统时，无需进入授权绑定页面。系统默认创建一个新用户与之绑定。
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
      {type === 'dingtalk-ent-app' && <>3</>}
      {type === 'wechat-webapp' && <>4</>}
      {type === 'third-party' && <>5</>}
    </div>
  );
};
export default Doc;
