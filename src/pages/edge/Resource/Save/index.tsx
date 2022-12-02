import { Modal } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import { useState } from 'react';
interface Props {
  data: any;
  cancel: () => void;
}

export default (props: Props) => {
  const [monacoValue, setMonacoValue] = useState<string>(props.data);

  const editorDidMountHandle = (editor: any) => {
    editor.getAction('editor.action.formatDocument').run();
    editor.onDidContentSizeChange?.(() => {
      editor.getAction('editor.action.formatDocument').run();
    });
  };

  return (
    <Modal
      open
      title={'编辑'}
      onOk={() => {
        props.cancel();
      }}
      onCancel={() => {
        props.cancel();
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
  );
};
