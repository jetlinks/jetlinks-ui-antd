import { Input, Modal } from 'antd';
import type { CommandItem } from '@/pages/device/Command/typings';
import MonacoEditor from 'react-monaco-editor';
import { useIntl } from '@@/plugin-locale/localeExports';

interface Props {
  close: () => void;
  data: CommandItem | undefined;
  visible: boolean;
}

const Cat = (props: Props) => {
  const intl = useIntl();
  const { close, data, visible } = props;
  return (
    <Modal
      width="40vw"
      visible={visible}
      onCancel={() => close()}
      footer={null}
      title={intl.formatMessage({
        id: 'pages.device.command.look.command',
        defaultMessage: '查看指令',
      })}
    >
      {intl.formatMessage({
        id: 'pages.device.command',
        defaultMessage: '下发指令',
      })}
      :
      <MonacoEditor
        height={300}
        language={'json'}
        editorDidMount={(editor) => {
          editor.onDidContentSizeChange?.(() => {
            editor.getAction('editor.action.formatDocument').run();
            // .finally(() => {
            //   editor.updateOptions({ readOnly: true });
            // });
          });
        }}
        value={JSON.stringify(data?.downstream)}
      />
      {intl.formatMessage({
        id: 'pages.device.command.reply.result',
        defaultMessage: '回复结果',
      })}
      :
      <Input.TextArea rows={3} />
    </Modal>
  );
};
export default Cat;
