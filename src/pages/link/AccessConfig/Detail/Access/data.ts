const MetworkTypeMapping = new Map();
MetworkTypeMapping.set('websocket-server', 'WEB_SOCKET_SERVER');
MetworkTypeMapping.set('http-server-gateway', 'HTTP_SERVER');
MetworkTypeMapping.set('udp-device-gateway', 'UDP');
MetworkTypeMapping.set('coap-server-gateway', 'COAP_SERVER');
MetworkTypeMapping.set('mqtt-client-gateway', 'MQTT_CLIENT');
MetworkTypeMapping.set('mqtt-server-gateway', 'MQTT_SERVER');
MetworkTypeMapping.set('tcp-server-gateway', 'TCP_SERVER');

const ProcotoleMapping = new Map();
ProcotoleMapping.set('websocket-server', 'WebSocket');
ProcotoleMapping.set('http-server-gateway', 'HTTP');
ProcotoleMapping.set('udp-device-gateway', 'UDP');
ProcotoleMapping.set('coap-server-gateway', 'CoAP');
ProcotoleMapping.set('mqtt-client-gateway', 'MQTT');
ProcotoleMapping.set('mqtt-server-gateway', 'MQTT');
ProcotoleMapping.set('tcp-server-gateway', 'TCP');
ProcotoleMapping.set('child-device', '');

const descriptionList = {
  'udp-device-gateway':
    'UDP可以让设备无需建立连接就可以与平台传输数据。在允许一定程度丢包的情况下，提供轻量化且简单的连接。',
  'tcp-server-gateway':
    'TCP服务是一种面向连接的、可靠的、基于字节流的传输层通信协议。设备可通过TCP服务与平台进行长链接，实时更新状态并发送消息。可自定义多种粘拆包规则，处理传输过程中可能发生的粘拆包问题。',
  'websocket-server':
    'WebSocket是一种在单个TCP连接上进行全双工通信的协议，允许服务端主动向客户端推送数据。设备通过WebSocket服务与平台进行长链接，实时更新状态并发送消息，且可以发布订阅消息',
  'mqtt-client-gateway':
    'MQTT是ISO 标准下基于发布/订阅范式的消息协议，具有轻量、简单、开放和易于实现的特点。平台使用指定的ID接入其他远程平台，订阅消息。也可添加用户名和密码校验。可设置最大消息长度。可统一设置共享的订阅前缀。',
  'http-server-gateway':
    'HTTP服务是一个简单的请求-响应的基于TCP的无状态协议。设备通过HTTP服务与平台进行灵活的短链接通信，仅支持设备和平台之间单对单的请求-响应模式',
  'mqtt-server-gateway':
    'MQTT是ISO 标准下基于发布/订阅范式的消息协议，具有轻量、简单、开放和易于实现的特点。提供MQTT的服务端，以供设备以长链接的方式接入平台。设备使用唯一的ID，也可添加用户名和密码校验。可设置最大消息长度。',
  'coap-server-gateway':
    'CoAP是针对只有少量的内存空间和有限的计算能力提供的一种基于UDP的协议。便于低功耗或网络受限的设备与平台通信，仅支持设备和平台之间单对单的请求-响应模式。',
};

export { MetworkTypeMapping, ProcotoleMapping, descriptionList };
