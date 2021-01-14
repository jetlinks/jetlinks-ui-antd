import { ISchema } from "@formily/antd";

interface Config {
    id: string,
    type: string,
    preview: string,
    properties: ISchema | undefined
}
export const ChartsConfig: Config[] = [

    {
        id: 'LineChart',
        type: '折线图',
        preview: 'https://z.alicdn.com/alickn/chu-ko-no/2020-4-18/bizcharts/7362edf6-3fef-42b2-aafa-82c01d8d0ddc/7362edf6-3fef-42b2-aafa-82c01d8d0ddc.png',
        properties: {
            "type": "object",
            properties: {
                "title": {
                    "type": "string",
                    "title": "名称",
                    "x-component": "input"
                },
                "x": {
                    "type": "string",
                    "title": "X轴",
                    "x-component": "input"
                },
                "y": {
                    "type": "string",
                    "title": "Y轴",
                    "x-component": "input"
                },
                "properties": {
                    "type": "string",
                    "title": "设备属性",
                    "x-component": "select",
                    "enum": [],
                    // "x-props": {
                    // "hasFeedback": true
                    // }
                },
                "cols": {
                    "type": "string",
                    "title": "配置",
                    "x-component": "input"
                }
            }
        }
    },
    {
        id: 'ColumnChart',
        type: '柱形图',
        preview: 'https://z.alicdn.com/alickn/chu-ko-no/2020-4-18/bizcharts/1ac2ed65-5911-4422-8f6f-8b4b719d8555/1ac2ed65-5911-4422-8f6f-8b4b719d8555.png',
        properties: {
            "type": "object",
            "properties": {
                "NO_NAME_FIELD_$0": {
                    "type": "object",
                    "x-component": "card",
                    "x-component-props": {
                        "title": "基本信息"
                    },
                    properties: {
                        "title": {
                            "type": "string",
                            "title": "名称",
                            "x-component": "input"
                        },
                        "data": {
                            "type": "string",
                            "title": "数据",
                            "x-component": "input"
                        },
                        "cols": {
                            "type": "string",
                            "title": "配置",
                            "x-component": "input"
                        }
                    }
                }
            }
        }
    },
    {
        id: 'GaugeChart',
        type: '柱形图',
        preview: 'https://z.alicdn.com/alickn/chu-ko-no/2020-4-18/bizcharts/82f5bedc-7eee-43af-8ee4-18033826d03a/82f5bedc-7eee-43af-8ee4-18033826d03a.png',
        properties: {
            "type": "object",
            "properties": {
                "NO_NAME_FIELD_$0": {
                    "type": "object",
                    "x-component": "card",
                    "x-component-props": {
                        "title": "基本信息"
                    },
                    properties: {
                        "title": {
                            "type": "string",
                            "title": "名称",
                            "x-component": "input"
                        },
                        "data": {
                            "type": "string",
                            "title": "数据",
                            "x-component": "input"
                        },
                        "cols": {
                            "type": "string",
                            "title": "配置",
                            "x-component": "input"
                        }
                    }
                }
            }
        }
    },
    {
        id: 'Video',
        type: '视频',
        preview: 'https://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg',
        properties: {
            "type": "object",
            "properties": {

            }
        }
    },
    {
        id: 'Action',
        type: '操作',
        preview: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fku.90sjimg.com%2Felement_origin_min_pic%2F16%2F10%2F27%2Fc120bcc802865f7619c01aba37b27139.jpg&refer=http%3A%2F%2Fku.90sjimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1613187169&t=4d4e5cb3e59f6f1f1d66f403e18cbb73',
        properties: {}
    }
];
