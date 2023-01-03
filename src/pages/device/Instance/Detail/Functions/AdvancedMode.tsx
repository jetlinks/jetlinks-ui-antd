import type { FunctionMetadata } from '@/pages/device/Product/typings';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Input, message } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import { InstanceModel, service } from '@/pages/device/Instance';
import { isObject } from 'lodash';

import './index.less';
import { MetaDataJsonHandle } from '@/components/FormItems/MetadataJsonInput';
import { JMonacoEditor } from '@/components/FMonacoEditor';

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
    } else {
      if (!value) {
        message.warning('请输入内容');
      }
    }
  }, [value]);

  const handleData = (data: any) => {
    const obj = {};

    const properties = data.valueType ? data.valueType.properties : data.inputs;

    for (const datum of properties) {
      switch (datum.valueType.type) {
        case 'object':
          obj[datum.id] = MetaDataJsonHandle(datum?.json?.properties?.[0]);
          break;
        case 'array':
          obj[datum.id] = [];
          break;
        case 'int':
        case 'long':
        case 'float':
        case 'double':
          obj[datum.id] = 0;
          break;
        case 'boolean':
          obj[datum.id] = false;
          break;
        default:
          obj[datum.id] = '';
          break;
      }
      // obj[datum.id] = '';
    }
    setValue(JSON.stringify(obj));

    if (monacoRef.current) {
      monacoRef.current.getAction('editor.action.formatDocument').run(); // 格式化
    }
  };

  useEffect(() => {
    handleData(props.data);
  }, [props.data]);

  useEffect(() => {
    monacoRef.current?.layout();
  });

  return (
    <div className="device-function-content">
      <div className="left">
        <div style={{ marginBottom: 12 }}>
          <JMonacoEditor
            width={'100%'}
            height={400}
            theme="vs-dark"
            language={'json'}
            value={value}
            onChange={(newValue: any) => {
              setValue(newValue);
            }}
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
            清空
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
