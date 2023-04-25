import MonacoEditor from 'react-monaco-editor';
import { connect, mapProps } from '@formily/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { MonacoEditorProps } from 'react-monaco-editor/lib/types';

interface Props extends MonacoEditorProps {
  warpStyle?: any
}

export const JMonacoEditor = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const formatLock = useRef<boolean>(false);
  const monacoRef = useRef<any>();
  const monacoEditorRef = useRef<any>();

  const editorFormat = (editor: any) => {
    editor.getAction('editor.action.formatDocument')?.run();
  };

  useEffect(() => {
    if (formatLock.current === false && monacoEditorRef.current) {
      setTimeout(() => {
        editorFormat(monacoEditorRef.current);
      }, 300);
      formatLock.current = true;
    }
  }, [props.value, loading, monacoEditorRef.current]);

  const editorDidMountHandle = useCallback((editor: any, monaco: any) => {
    monacoEditorRef.current = editor;
    props.editorDidMount?.(editor, monaco);
  }, []);

  return (
    <div
      ref={() => {
        setTimeout(() => {
          setLoading(true);
        }, 100);
      }}
      style={{ height: '100%', width: '100%', ...(props.warpStyle || {}) }}
    >
      {loading && (
        <MonacoEditor
          ref={(r: any) => {
            monacoRef.current = r;
            if (r && formatLock.current === false) {
              editorFormat(r.editor);
            }
          }}
          {...props}
          options={{ wordWrap: 'on', automaticLayout: true }}
          editorDidMount={editorDidMountHandle}
        />
      )}
    </div>
  );
};

const FMonacoEditor = connect(JMonacoEditor, mapProps());
export default FMonacoEditor;
