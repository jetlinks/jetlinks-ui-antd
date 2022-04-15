import {connect, mapProps} from '@formily/react';
import BraftEditor, {BraftEditorProps, EditorState} from 'braft-editor';
import 'braft-editor/dist/index.css';
import {useState} from 'react';

interface Props extends BraftEditorProps {
  value: any;
  onChange: (data: any) => void;
  placeholder?: string;
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
          placeholder={props.placeholder}
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
