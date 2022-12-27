import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { JMonacoEditor } from '@/components/FMonacoEditor';
import { service } from '@/pages/edge/Resource';
import { onlyMessage } from '@/utils/util';
interface Props {
  data: Partial<ResourceItem>;
  cancel: () => void;
  reload: () => void;
}

export default (props: Props) => {
  const [monacoValue, setMonacoValue] = useState<string>(props.data?.metadata || '{}');

  useEffect(() => {
    setMonacoValue(props.data?.metadata || '{}');
  }, [props.data]);

  const editorDidMountHandle = (editor: any) => {
    editor.getAction('editor.action.formatDocument').run();
    editor.onDidContentSizeChange?.(() => {
      editor.getAction('editor.action.formatDocument').run();
    });
  };

  return (
    <Modal
      open
      title={'编辑'}
      onOk={async () => {
        if (props.data?.id) {
          const resp = await service.modify(props.data.id, { metadata: monacoValue });
          if (resp.status === 200) {
            props.reload();
            onlyMessage('操作成功', 'success');
          }
        }
      }}
      onCancel={() => {
        props.cancel();
      }}
      width={700}
    >
      <JMonacoEditor
        height={350}
        theme="vs"
        language={'json'}
        value={monacoValue}
        onChange={(newValue: any) => {
          setMonacoValue(newValue);
        }}
        editorDidMount={editorDidMountHandle}
      />
    </Modal>
  );
};
