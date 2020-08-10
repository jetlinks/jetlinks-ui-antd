import React, {useEffect, useState} from 'react';
import {Button, Card, message, Spin} from 'antd';
import 'ace-builds';
import 'ace-builds/webpack-resolver';
import AceEditor from "react-ace";
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-json5';
import 'ace-builds/src-noconflict/mode-hjson';
import 'ace-builds/src-noconflict/mode-jsoniq';
import 'ace-builds/src-noconflict/snippets/json';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-eclipse';
import apis from "@/services";

interface Props {
  deviceId: string;
}

const Shadow: React.FC<Props> = (props) => {

  const [spinning, setSpinning] = useState(true);
  const [shadowData, setShadowData] = useState<any>();

  useEffect(() => {


    apis.deviceInstance.getDeviceShadow(props.deviceId)
      .then((response: any) => {
        if (response.status === 200) {
          try {
            setShadowData(JSON.stringify(JSON.parse(response.result), null, 2));
          } catch (error) {
            setShadowData(response.result);
          }
        }
        setSpinning(false);
      })
      .catch(() => {
      })
  }, []);

  const save = () => {
    apis.deviceInstance.saveDeviceShadow(props.deviceId, shadowData)
      .then((response: any) => {
        if (response.status === 200) {
          message.success('保存成功');
        }
        setSpinning(false);
      })
      .catch(() => {
      })
  };

  return (
    <div>
      <Spin spinning={spinning}>
        <Card style={{marginBottom: 20}} title={
          <Button
            type="primary"
            onClick={() => {
              setSpinning(true);
              save();
            }}
          >
            保存
          </Button>
        }
        >
          <AceEditor
            mode='json'
            theme="eclipse"
            name="app_code_editor"
            key='deviceShadow'
            fontSize={14}
            value={shadowData}
            onChange={value => {
              setShadowData(value);
            }}
            showPrintMargin
            showGutter
            wrapEnabled
            highlightActiveLine  //突出活动线
            enableSnippets  //启用代码段
            style={{width: '100%', height: '50vh'}}
            setOptions={{
              enableBasicAutocompletion: true,   //启用基本自动完成功能
              enableLiveAutocompletion: true,   //启用实时自动完成功能 （比如：智能代码提示）
              enableSnippets: true,  //启用代码段
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </Card>
      </Spin>
    </div>
  );
};

export default Shadow;
