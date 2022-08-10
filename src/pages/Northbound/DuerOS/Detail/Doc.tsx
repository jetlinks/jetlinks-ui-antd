import { InfoCircleFilled } from '@ant-design/icons';
import { Alert, Image } from 'antd';

const image = require('/public/images/cloud/dueros-doc.jpg');
const image1 = require('/public/images/cloud/dueros-doc1.png');
const image2 = require('/public/images/cloud/dueros-doc2.png');
const image3 = require('/public/images/cloud/dueros-doc3.png');

const Doc = () => {
  return (
    <div className="doc">
      <div className="url">
        小度智能家居开放平台：
        <a
          href="https://dueros.baidu.com/dbp/bot/index#/iotopenplatform"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://dueros.baidu.com/dbp/bot/index#/iotopenplatform
        </a>
      </div>
      <h1>1. 概述</h1>
      <div>
        DuerOS支持家居场景下的云端控制，该页面主要将平台的产品与DuerOS支持语音控制的产品进行映射，以到达小度平台控制本平台设备的目的。
      </div>
      <h1>2. 操作步骤</h1>
      <div>
        <h2>1、在百度小度技能平台创建技能，并授权。完成物联网平台与DuerOS的关联。</h2>
        <div className={'image'}>
          <Image width="100%" src={image} />
        </div>
        <h1>授权地址</h1>
        <div>物联网平台的登录地址。注意需要为https。</div>
        <div>请复制并填写: https://{location.host}/#/user/login</div>
        <h1>Client_Id</h1>
        <div>请填写物联网平台-第三方平台的clientId。</div>
        <div className={'image'}>
          <Image width="100%" src={image1} />
        </div>
        <h1>回调地址</h1>
        <div>请复制DuerOS平台中的值，填写到第三方平台-redirectUrl中</div>
        <div>
          <Alert
            icon={<InfoCircleFilled style={{ fontSize: 16, marginTop: 5 }} />}
            description="注：需要将OAth2设置为开启状态。"
            showIcon
          />
        </div>
        <div className={'image'}>
          <Image width="100%" src={image2} />
        </div>
        <h1>Token地址</h1>
        <div>请复制并填写：HTTPS://{location.host}/api/v1/token</div>
        <h1>ClientSecret</h1>
        <div>请复制物联网平台-第三方平台中的secureKey，填写到DuerOS平台。</div>
        <div className={'image'}>
          <Image width="100%" src={image3} />
        </div>
        <div></div>
        <h1>WebService</h1>
        <div>请复制并填写：/dueros/product/_query</div>
        <h2>2、登录物联网平台，进行平台内产品与DuerOS产品的数据映射。</h2>
        <h2>
          3、智能家居用户通过物联网平台中的用户，登录小度APP，获取平台内当前用户的所属设备。获取后即可进行语音控制。
        </h2>
      </div>
      <h1>3. 配置说明</h1>
      <div>
        <h2>
          1、“设备类型”为DuerOS平台拟定的标准规范，设备类型将决定【动作映射】中“动作”的下拉选项，以及【属性映射】中“Dueros属性”的下拉选项
        </h2>
      </div>
    </div>
  );
};
export default Doc;
