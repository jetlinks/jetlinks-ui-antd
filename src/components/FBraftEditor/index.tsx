import { connect, mapProps } from '@formily/react';
import BraftEditor, { BraftEditorProps, EditorState } from 'braft-editor';
import 'braft-editor/dist/index.css';
import { useState } from 'react';

interface Props extends BraftEditorProps {
  value: any;
  onChange: (data: any) => void;
}

const FBraftEditor = connect((props: Props) => {
  const [editorState, setEditorState] = useState<EditorState>(
    BraftEditor.createEditorState(props.value),
  );

  return (
    <>
      {
        // @ts-ignore
        <BraftEditor
          value={editorState}
          onChange={(state) => {
            setEditorState(state);
            props.onChange(state.toHTML());
          }}
        />
      }
    </>
  );
}, mapProps());
export default FBraftEditor;
