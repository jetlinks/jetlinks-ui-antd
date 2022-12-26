import MonacoEditor from 'react-monaco-editor';
import { connect, mapProps } from '@formily/react';
import { useRef, useState } from 'react';

export const JMonacoEditor = (props: any) => {
  const [loading, setLoading] = useState(false);
  const monacoRef = useRef<any>();

  return (
    <div
      ref={() => {
        setTimeout(() => {
          setLoading(true);
        }, 100);
      }}
      style={{ height: '100%', width: '100%' }}
    >
      {loading && <MonacoEditor ref={monacoRef} {...props} />}
    </div>
  );
};

const FMonacoEditor = connect(JMonacoEditor, mapProps());
export default FMonacoEditor;
