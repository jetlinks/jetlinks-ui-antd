import type { FunctionMetadata } from '@/pages/device/Product/typings';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Input, Button } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import { InstanceModel, service } from '@/pages/device/Instance';
import MonacoEditor from 'react-monaco-editor';
import { isObject } from 'lodash';

import './index.less';

type FunctionProps = {
  data: FunctionMetadata;
};

export default (props: FunctionProps) => {
  const intl = useIntl();
  const [result, setResult] = useState('');
  const [value, setValue] = useState('');
  const monacoRef = useRef<any>();
  /**
   * 执行
   */
  const actionRun = useCallback(async () => {
    const id = InstanceModel.detail?.id;
    if (id && value) {
      try {
        // 验证是否为json格式
        const objData: Record<string, unknown> = JSON.parse(value);
        const isObj = isObject(objData);

        if (!isObj) {
          return;
        }

        const res = await service.invokeFunction(id, props.data.id, objData);
        if (res.status === 200) {
          setResult(res.result);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, [value]);

  const handleData = (data: any) => {
    const obj = {};
    const properties = data.valueType ? data.valueType.properties : [];
    for (const datum of properties) {
      obj[datum.id] = '';
    }
    setValue(JSON.stringify(obj));

    if (monacoRef.current) {
      monacoRef.current.getAction('editor.action.formatDocument').run(); // 格式化
    }
  };

  const editorDidMountHandle = (editor: any) => {
    monacoRef.current = editor;
  };

  useEffect(() => {
    handleData(props.data);
  }, [props.data]);

  return (
    <div className="device-function-content">
      <div className="left">
        <div style={{ marginBottom: 12 }}>
          <MonacoEditor
            width={'100%'}
            height={400}
            theme="vs-dark"
            language={'json'}
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            editorDidMount={editorDidMountHandle}
          />
        </div>
        <div className="button-tool">
          <Button type={'primary'} onClick={actionRun}>
            {intl.formatMessage({
              id: 'pages.data.option.invoke',
              defaultMessage: '执行',
            })}
          </Button>
          <Button
            onClick={() => {
              setValue('');
            }}
          >
            {intl.formatMessage({
              id: 'pages.data.option.cancel',
              defaultMessage: '取消',
            })}
          </Button>
        </div>
      </div>
      <div className="right">
        <p>执行结果：</p>
        <Input.TextArea value={result} rows={6} />
      </div>
    </div>
  );
};
