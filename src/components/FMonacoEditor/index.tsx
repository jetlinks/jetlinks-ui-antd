import MonacoEditor from 'react-monaco-editor';
import { connect, mapProps } from '@formily/react';
import { useState } from 'react';

const JMonacoEditor = (props: any) => {
  const [loading, setLoading] = useState(false);

  return (
    <div
      ref={() => {
        setTimeout(() => {
          setLoading(true);
        }, 100);
      }}
      style={{ height: '100%', width: '100%' }}
    >
      {loading && <MonacoEditor {...props} />}
    </div>
  );
};

const FMonacoEditor = connect(JMonacoEditor, mapProps());
export default FMonacoEditor;
