import { Input, Modal } from 'antd';
import type { CommandItem } from '@/pages/device/Command/typings';
import MonacoEditor from 'react-monaco-editor';

interface Props {
  close: () => void;
  data: CommandItem | undefined;
  visible: boolean;
}

const Cat = (props: Props) => {
  const { close, data, visible } = props;
  return (
    <Modal width="40vw" visible={visible} onCancel={() => close()} footer={null} title="查看指令">
      下发指令:
      <MonacoEditor
        height={300}
        language={'json'}
        editorDidMount={(editor) => {
          editor.onDidScrollChange?.(() => {
            editor
              .getAction('editor.action.formatDocument')
              .run()
              .finally(() => {
                editor.updateOptions({ readOnly: true });
              });
          });
        }}
        value={JSON.stringify(data?.downstream)}
      />
      回复结果:
      <Input.TextArea rows={3} />
    </Modal>
  );
};
export default Cat;
