import React, { useState } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Select } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import { NodeProps } from '../data';
import styles from '../index.less';

interface Props extends FormComponentProps, NodeProps {}

interface State {
  lang: string;
  script: string;
}
const Route: React.FC<Props> = props => {
  const initState: State = {
    lang: props.config?.lang || 'javascript',
    script: props.config?.script || '',
  };

  const [lang, setLang] = useState(initState.lang);
  const [script, setScript] = useState(initState.script);

  const inlineFormItemLayout = {
    labelCol: {
      sm: { span: 5 },
    },
    wrapperCol: {
      sm: { span: 19 },
    },
  };

  const saveModelData = () => {
    props.save({ lang, script });
  };

  return (
    <div>
      <Form {...inlineFormItemLayout} className={styles.configForm}>
        <Form.Item label="脚本语言">
          <Select
            onChange={(value: string) => {
              setLang(value);
              saveModelData();
            }}
          >
            <Select.Option value="groovy">Groovy</Select.Option>
            <Select.Option value="javascript">JavaScript</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="脚本">
          <MonacoEditor
            // width="800"
            height="300"
            language={lang}
            value={script}
            options={{
              selectOnLineNumbers: true,
            }}
            onChange={(value: any) => {
              setScript(value);
            }}
            // editorDidMount={(editor, monaco) => editorDidMountHandle(editor, monaco)}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Form.create<Props>()(Route);
