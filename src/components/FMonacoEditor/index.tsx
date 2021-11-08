import MonacoEditor from 'react-monaco-editor';
import { connect, mapProps } from '@formily/react';

const FMonacoEditor = connect(MonacoEditor, mapProps());
export default FMonacoEditor;
