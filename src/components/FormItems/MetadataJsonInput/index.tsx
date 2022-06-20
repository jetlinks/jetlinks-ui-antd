import { Input, Modal } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { isObject } from 'lodash';

type MetaDataJsonInputProps = {
  json: Record<string, any>;
  value?: string;
  onChange?: (value: string) => void;
};

export const MetaDataJsonHandle = (data: any): Record<string, any> => {
  const _JSON = {};

  if (isObject(data)) {
    const type = (data as any).valueType.type;
    const id = (data as any).id;

    switch (type) {
      case 'object':
        _JSON[id] = MetaDataJsonHandle((data as any)['json']['properties'][0]);
        break;
      case 'array':
        _JSON[id] = [];
        break;
      case 'int':
      case 'long':
      case 'float':
      case 'double':
        _JSON[id] = 0;
        break;
      case 'boolean':
        _JSON[id] = false;
        break;
      default:
        _JSON[id] = '';
        break;
    }
  }

  return _JSON;
};

export default (props: MetaDataJsonInputProps) => {
  const [value, setValue] = useState(props.value || '');
  const [visible, setVisible] = useState(false);
  const [monacoValue, setMonacoValue] = useState<string>('');

  const onChange = (data: string) => {
    if (props.onChange) {
      const newData = data.replace(/[ ]/g, '');
      props.onChange(newData);
    }
  };

  const editorDidMountHandle = (editor: any) => {
    editor.onDidContentSizeChange?.(() => {
      editor.getAction('editor.action.formatDocument').run();
    });
  };

  useEffect(() => {
    setValue(props.value || '');
  }, [props.value]);

  useEffect(() => {
    if (props.json) {
      const _json = MetaDataJsonHandle(props.json);
      onChange(JSON.stringify(_json));
    }
  }, [props.json]);

  return (
    <>
      <Input
        addonAfter={
          <FormOutlined
            onClick={() => {
              setMonacoValue(value);
              setVisible(true);
            }}
          />
        }
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
      />
      <Modal
        visible={visible}
        title={'编辑'}
        onOk={() => {
          onChange(monacoValue);
          setVisible(false);
        }}
        onCancel={() => {
          setVisible(false);
        }}
        width={700}
      >
        <MonacoEditor
          width={'100%'}
          height={400}
          theme="vs-dark"
          language={'json'}
          value={monacoValue}
          onChange={(newValue) => {
            setMonacoValue(newValue);
          }}
          editorDidMount={editorDidMountHandle}
        />
      </Modal>
    </>
  );
};
