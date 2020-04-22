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
    }, {
        id: 'SalesChart',
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
    }];
