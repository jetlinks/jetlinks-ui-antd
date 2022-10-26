// 平台类型
export const PlatformTypeList = [
  {
    label: '移动OneLink',
    value: 'OneLinkPB',
    imgUrl: require('/public/images/iot-card/onelink.png'),
  },
  {
    label: '电信Ctwing',
    value: 'CtwingCmp',
    imgUrl: require('/public/images/iot-card/ctwingcmp.png'),
  },
  {
    label: '联通Unicom',
    value: 'UnicomCmp',
    imgUrl: require('/public/images/iot-card/unicom.png'),
  },
];

//运营商
export const OperatorList = [
  {
    label: '移动',
    value: '移动',
  },
  {
    label: '电信',
    value: '电信',
  },
  {
    label: '联通',
    value: '联通',
  },
];

// 类型
export const TypeList = [
  {
    label: '年卡',
    value: 'year',
  },
  {
    label: '季卡',
    value: 'season',
  },
  {
    label: '月卡',
    value: 'month',
  },
  {
    label: '其他',
    value: 'other',
  },
];

// 支付方式
export const PaymentMethod = [
  {
    label: '支付宝手机网站支付',
    value: 'ALIPAY_WAP',
  },
  {
    label: '支付宝网页及时到账支付',
    value: 'ALIPAY_WEB',
  },
  {
    label: '微信公众号支付',
    value: 'WEIXIN_JSAPI',
  },
  {
    label: '微信扫码支付',
    value: 'WEIXIN_NATIVE',
  },
];
