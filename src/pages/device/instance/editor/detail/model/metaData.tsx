import React, { useEffect, useState } from 'react';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import { message, Modal, Tabs } from 'antd';
import 'ace-builds';
import 'ace-builds/webpack-resolver';
import AceEditor from "react-ace";
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/snippets/json';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-eclipse';
import { downloadObject } from "@/utils/utils";
import apis from "@/services";

interface Props extends FormComponentProps {
  close: Function;
  data?: string;
  deviceId: string;
}

const MetaData: React.FC<Props> = props => {

  const [metaData, setMetaData] = useState<string>();
  const [otherMetaData, setOtherMetaData] = useState<string>();
  const [data, setData] = useState<string>();
  const [modelFormat, setModelFormat] = useState([]);

  useEffect(() => {
    apis.deviceInstance.info(props.deviceId)
      .then((response: any) => {
        if (response.status === 200) {
          try {
            setData(response.result.metadata);
            setMetaData(JSON.stringify(JSON.parse(response.result.metadata), null, 2));
          } catch (error) {
            setMetaData(response.result.metadata);
          }
        }
      })
      .catch(() => {
      });
    apis.deviceProdcut.getModelFormat().then(res => {
      setModelFormat(res.result)
    })
  }, []);

  return (
    <Modal
      title='查看物模型'
      visible
      okText='导出模型文件'
      cancelText="取消"
      onOk={() => {
        if (data != null) {
          downloadObject(JSON.parse(data), `设备-物模型`);
        } else {
          message.error('请检查物模型');
        }
      }}
      onCancel={() => props.close()}
    >
      <div style={{ background: 'rgb(236, 237, 238)' }}>
        <p style={{ padding: 10 }}>
          物模型是对设备在云端的功能描述，包括设备的属性、服务和事件。物联网平台通过定义一种物的描述语言来描述物模型，称之为 TSL（即 Thing Specification Language），采用 JSON 格式，您可以根据
          TSL 组装上报设备的数据。您可以导出完整物模型，用于云端应用开发。
        </p>
      </div>
      <Tabs type="card" onChange={(key: string) => {
        if (key !== '' && key !== 'JetLinks') {
          apis.deviceProdcut.getOtherModel(key, metaData).then(res => {
            setData(JSON.stringify(res.result));
            setOtherMetaData(JSON.stringify(res.result, null, 2))
          })
        } else if (key === 'JetLinks') {
          apis.deviceInstance.info(props.deviceId)
            .then((response: any) => {
              if (response.status === 200) {
                try {
                  setData(response.result.metadata);
                  setMetaData(JSON.stringify(JSON.parse(response.result.metadata), null, 2));
                } catch (error) {
                  setMetaData(response.result.metadata);
                }
              }
            })
            .catch(() => {
            });
        }
      }}>
        <Tabs.TabPane tab="JetLinks" key="JetLinks">
          <div style={{ border: '1px solid #E9E9E9', marginTop: 20 }}>
            <AceEditor
              readOnly={true}
              mode='json'
              theme="eclipse"
              name="app_code_editor"
              fontSize={14}
              value={metaData}
              onChange={value => {
                setMetaData(value);
              }}
              showPrintMargin
              showGutter
              wrapEnabled
              highlightActiveLine  //突出活动线
              enableSnippets  //启用代码段
              style={{ width: '100%', height: 400 }}
              setOptions={{
                enableBasicAutocompletion: true,   //启用基本自动完成功能
                enableLiveAutocompletion: true,   //启用实时自动完成功能 （比如：智能代码提示）
                enableSnippets: true,  //启用代码段
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
          </div>
        </Tabs.TabPane>
        {
          modelFormat.map((item: any) => <Tabs.TabPane tab={item.name} key={item.id}>
            <div style={{ border: '1px solid #E9E9E9', marginTop: 20 }}>
              <AceEditor
                readOnly={true}
                mode='json'
                theme="eclipse"
                name="app_code_editor"
                fontSize={14}
                value={otherMetaData}
                onChange={value => {
                  setOtherMetaData(value);
                }}
                showPrintMargin
                showGutter
                wrapEnabled
                highlightActiveLine  //突出活动线
                enableSnippets  //启用代码段
                style={{ width: '100%', height: 400 }}
                setOptions={{
                  enableBasicAutocompletion: true,   //启用基本自动完成功能
                  enableLiveAutocompletion: true,   //启用实时自动完成功能 （比如：智能代码提示）
                  enableSnippets: true,  //启用代码段
                  showLineNumbers: true,
                  tabSize: 2,
                }}
              />
            </div>
          </Tabs.TabPane>)
        }
      </Tabs>
    </Modal>
  );
};

export default Form.create<Props>()(MetaData);
