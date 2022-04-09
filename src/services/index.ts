import * as login from '@/pages/user/login/service';
import * as permission from '@/pages/system/permission/service';
import * as role from '@/pages/system/role/service';
import * as users from '@/pages/system/users/service';
import * as deviceProdcut from '@/pages/device/product/service';
import * as deviceInstance from '@/pages/device/instance/service';
import * as dimensions from '@/pages/system/dimensions/service';
import * as ruleEngine from '@/pages/rule-engine/service';
import * as email from '@/pages/rule-engine/email/service';
import * as sms from '@/pages/rule-engine/sms/service';
import * as ruleInstance from '@/pages/rule-engine/instance/service';
import * as scene from '@/pages/rule-engine/scene/service'
import * as ruleModel from '@/pages/rule-engine/model/service';
import * as protocol from '@/pages/device/protocol/service';
import * as openApi from '@/pages/system/open-api/service';
import * as mqttClient from '@/pages/network/mqtt-client/service';
import * as opcUa from '@/pages/network/opc-ua/service';
import * as modbus from '@/pages/network/modbus/service';
import * as certificate from '@/pages/network/certificate/service';
import * as sqlRule from '@/pages/rule-engine/sqlRule/service';
import * as location from '@/pages/device/location/service';
import * as firmware from '@/pages/device/firmware/service';
import * as deviceGroup from '@/pages/device/group/service';
import * as system from '@/services/user';
import * as assets from '@/pages/assets/service';
// import * as coapClient from '@/pages/network/coap-client/service';
// import * as httpClient from '@/pages/network/http-client/service';
// import * as tcpClient from '@/pages/network/tcp-client/service';
// import * as websocketClient from '@/pages/network/websocket-client/service';
import * as accessLogger from '@/pages/logger/access/service';
import * as systemLogger from '@/pages/logger/system/service';
import * as authorization from '@/components/Authorization/service';
import * as network from '@/pages/network/type/service';
import * as gateway from '@/pages/network/gateway/service';
import * as deviceGateway from '@/pages/device/gateway/service';
import * as notifier from '@/pages/notice/service';
import * as org from '@/pages/system/org/service';
import * as analysis from '@/pages/analysis/service';
import * as deviceAlarm from '@/pages/device/alarm/service';
import * as visualization from '@/pages/device/visualization/service';
import * as systemConfig from '@/pages/system/config/service';
import * as notification from '@/pages/account/notification/service';
import * as screen from '@/pages/data-screen/screen/service';
import * as configuration from '@/pages/data-screen/visConfiguration/service';
import * as categoty from '@/pages/data-screen/category/service';
import * as productCategoty from '@/pages/device/product-category/service';
import * as aliyun from '@/pages/cloud/aliyun/service';
import * as onenet from '@/pages/cloud/onenet/service';
import * as ctwing from '@/pages/cloud/ctwing/service';
import * as edgeProduct from '@/pages/edge-gateway/product/service';
import * as edgeDevice from '@/pages/edge-gateway/device/service';

const apis = {
  login,
  permission,
  role,
  system,
  users,
  deviceProdcut,
  deviceInstance,
  dimensions,
  ruleEngine,
  email,
  sms,
  ruleInstance,
  scene, // 场景联动
  ruleModel,
  protocol,
  openApi,
  certificate,
  mqttClient,
  opcUa,
  modbus,
  // coapClient,
  // httpClient,
  // tcpClient,
  // websocketClient,
  accessLogger,
  systemLogger,
  authorization,
  network,
  gateway,
  deviceGateway,
  notifier,
  org,
  analysis,
  deviceAlarm,
  sqlRule,
  visualization,
  location,
  systemConfig,
  firmware,
  deviceGroup,
  notification,
  screen,
  configuration,
  categoty, // 大屏分类
  productCategoty,
  aliyun, // 阿里云
  onenet,
  ctwing,
  edgeProduct,
  edgeDevice,
  assets
};
export default apis;
