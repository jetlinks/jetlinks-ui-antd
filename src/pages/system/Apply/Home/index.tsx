import { Table } from 'antd';
import { JMonacoEditor } from '@/components/FMonacoEditor';
import './index.less';
const Home = () => {
  const data = [
    {
      key: '1',
      type: 'clientId',
      data: 'testId',
    },
    {
      key: '2',
      type: 'secureKey',
      data: 'testSecure',
    },
    {
      key: '3',
      type: '请求URI',
      data: '/api/v1/device/dev0001/log/_query',
    },
    {
      key: '4',
      type: '请求方式',
      data: 'GET',
    },
    {
      key: '5',
      type: '请求参数',
      data: 'pageSize=20&pageIndex=0',
    },
    {
      key: '6',
      type: '签名方式',
      data: 'MD5',
    },
    {
      key: '7',
      type: '签名示例时间戳',
      data: '1574993804802 ',
    },
  ];
  return (
    <div className="home">
      <h1>第三方接入说明</h1>
      <div style={{ color: '#666666' }}>
        第三方平台接口请求基于数据签名调用方式，使用签名来校验客户端请求的完整性以及合法性，您可以参看如下文档，来构造
        HTTP 接口以调用对应的第三方平台接口 。
      </div>
      <h2>签名示例说明</h2>
      <div className="h2-text">1. 签名方式,支持MD5和Sha256两种方式.</div>
      <div className="h2-text">2. 发起请求的签名信息都需要放到请求头中,而不是请求体.</div>
      <div
        style={{
          display: 'flex',
          border: '1px solid #e6e6e6',
          padding: 15,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h3>签名规则</h3>
          <p>注意：签名时间戳与服务器时间不能相差五分钟以上，否则服务器将拒绝本次请求</p>
          <div className="div-border ">
            <div className="h3-text">将参数key按ascii排序得到: pageIndex=0&pageSize=20</div>
            <div className="h3-text">
              使用拼接时间戳以及密钥得到: pageIndex=0&pageSize=201574993804802testSecure
            </div>
            <div className="h3-text">
              使用md5(pageIndex=0&pageSize=201574993804802testSecure)得到837fe7fa29e7a5e4852d447578269523
            </div>
          </div>
          <h3>请求头示例</h3>
          <div className="div-border ">
            <div className="h3-text">GET /api/device?pageIndex=0&amp;pageSize=20</div>
            <div className="h3-text">X-Client-Id: testId</div>
            <div className="h3-text">X-Timestamp: 1574993804802</div>
            <div className="h3-text">X-Sign: 837fe7fa29e7a5e4852d447578269523</div>
          </div>
          <h3>响应结果示例</h3>
          <div className="div-border ">
            <div className="h3-text">xxx</div>
            <div className="h3-text">HTTP/1.1 200 OK</div>
            <div className="h3-text">X-Timestamp: 1574994269075</div>
            <div className="h3-text">X-Sign: c23faa3c46784ada64423a8bba433f25</div>
            <div className="h3-text">{`{status:200,result:[ ]}`}</div>
          </div>
        </div>
        <div style={{ width: '50%' }}>
          <h3>示例数据</h3>
          <div>
            <Table
              dataSource={data}
              pagination={false}
              // size="small"
              columns={[
                {
                  title: '示例数据类型',
                  dataIndex: 'type',
                },
                {
                  title: '示例数据',
                  dataIndex: 'data',
                },
              ]}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          border: '1px solid #e6e6e6',
          padding: 15,
          justifyContent: 'space-between',
          marginTop: 20,
        }}
      >
        <div>
          <h3>服务器验签流程</h3>
          <div>
            <img src={require('/public/images/apiHome.png')} style={{ width: '80%' }} />
          </div>
        </div>
        <div style={{ width: '50%' }}>
          <h3>验签说明</h3>
          <div>
            <p>使用和签名相同的算法(不需要对响应结果排序)</p>
            <div>
              <JMonacoEditor
                width={'100%'}
                height={620}
                theme="vs-dark"
                language={'java'}
                value={`String secureKey = ...; //密钥\r\nString responseBody = ...;//服务端响应结果\r\nString timestampHeader = ...;//响应头: X-Timestamp\r\nString signHeader = ...; //响应头: X-Sign\r\n\r\nString sign = DigestUtils.md5Hex(responseBody+timestampHeader+secureKey);\r\nif(sign.equalsIgnoreCase(signHeader)){\r\n //验签通过\r\n}
                                    \r\n\r\n`}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2>java SDK接入说明</h2>
        <div className="div-border ">
          <div className="h3-text">JetLinks平台java SDK基于java 8版本开发。</div>
        </div>

        <h3>添加 SDK 依赖</h3>
        <div className="h3-text">将以下Maven依赖加入到pom.xml文件中</div>
        <div>
          <JMonacoEditor
            width={'100%'}
            height={100}
            theme="vs-dark"
            value={
              '<dependency>\r\n    <groupId>org.jetlinks.sdk</groupId>\r\n    <artifactId>api-sdk</artifactId>\r\n    <version>1.0.0</version>\r\n</dependency>'
            }
            language={'java'}
          />
        </div>
        <h3>SDK 客户端的初始化和请求方式</h3>
        <div>
          <JMonacoEditor
            width={'100%'}
            height={370}
            theme="vs-dark"
            value={
              '\r\n        //服务器的baseUrl\r\n        String baseUrl = "http://localhost:9000/jetlinks";\r\n  //客户端Id\r\n        String clientId = "aSoq98aAxzP";\r\n  //访问秘钥\r\n        String secureKey = "DaYsxpiWSfdTAPJyKW8rP2WAGyWErnsR";\r\n\r\n        ClientConfig clientConfig = new ClientConfig(baseUrl, clientId, secureKey);\r\n\r\n        ApiClient client = new WebApiClient(clientConfig);\r\n\r\nApiResponse < PagerResult < DeviceInfo >> response = client\r\n    .request(QueryDeviceRequest\r\n        .of(query -> query\r\n            .where("productId", "demo-device")\r\n            .doPaging(0, 100)));'
            }
            language={'java'}
          />
        </div>
      </div>
    </div>
  );
};
export default Home;
