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
import * as ruleInstance from "@/pages/rule-engine/instance/service";
import * as ruleModel from "@/pages/rule-engine/model/service";
import * as protocol from "@/pages/device/protocol/service";
import * as openApi from "@/pages/system/open-api/service";
import * as mqttClient from '@/pages/network/mqtt-client/service';
import * as certificate from "@/pages/network/certificate/service";
// import * as coapClient from '@/pages/network/coap-client/service';
// import * as httpClient from '@/pages/network/http-client/service';
// import * as tcpClient from '@/pages/network/tcp-client/service';
// import * as websocketClient from '@/pages/network/websocket-client/service';
import * as accessLogger from '@/pages/logger/access/service';
import * as systemLogger from '@/pages/logger/system/service';
const apis = {
  login,
  permission,
  role,
  users,
  deviceProdcut,
  deviceInstance,
  dimensions,
  ruleEngine,
  email,
  sms,
  ruleInstance,
  ruleModel,
  protocol,
  openApi,
  certificate,
  mqttClient,
  // coapClient,
  // httpClient,
  // tcpClient,
  // websocketClient,
  accessLogger,
  systemLogger,
}
export default apis;
