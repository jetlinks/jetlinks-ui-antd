import { connect, mapProps } from '@formily/react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

const FBraftEditor = connect(BraftEditor, mapProps());
export default FBraftEditor;
