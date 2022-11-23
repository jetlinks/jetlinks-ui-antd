import { Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

interface Props {
  value: any;
  close: () => void;
  ok: (data: any) => void;
}

export default (props: Props) => {
  const monacoRef = useRef<any>();

  const [value, setValue] = useState<any>(props.value);
  const [loading, setLoading] = useState(false);

  const editorDidMountHandle = (editor: any) => {
    monacoRef.current = editor;
    editor.getAction('editor.action.formatDocument').run();
    editor.onDidContentSizeChange?.(() => {
      editor.getAction('editor.action.formatDocument').run();
    });
  };

  useEffect(() => {
    setValue(props?.value || '');
  }, [props.value]);

  return (
    <Modal
      visible
      title="编辑"
      width={700}
      onCancel={() => props.close()}
      onOk={() => {
        props.ok(value);
      }}
    >
      <div
        ref={() => {
          setTimeout(() => {
            setLoading(true);
          }, 100);
        }}
      >
        {loading && (
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
        )}
      </div>
    </Modal>
  );
};
