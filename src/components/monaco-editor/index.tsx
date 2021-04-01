import React from 'react';
import MonacoEditor from 'react-monaco-editor';

interface Props {
  value: any;
  onChange: Function;
  language: string;
  [name: string]: any;
}

const MonacoComponent = (props: Props) => {
  return (
    <MonacoEditor
      language={props.props['x-component-props'].language||'javascript'}
      theme="vs-dark"
      value={props.value}
      height={200}
      options={{
        automaticLayout: true,
        selectOnLineNumbers: true,
      }}
      onChange={value => props.mutators.change(value)}
    />
  );
};

MonacoComponent.isFieldComponent = true;
export default MonacoComponent;
