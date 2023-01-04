import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { JMonacoEditor } from '@/components/FMonacoEditor';

interface Props {
  value: any;
  close: () => void;
  ok: (data: any) => void;
}

export default (props: Props) => {
  const [value, setValue] = useState<any>(props.value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(props?.value || '');
  }, [props.value]);

  return (
    <Modal
      visible
      title="编辑"
      width={700}
      zIndex={1050}
      onCancel={() => props.close()}
      onOk={() => {
        props.ok(value);
      }}
    >
      <div
        ref={() => {
          setTimeout(() => {
            setLoading(true);
          }, 100);
        }}
      >
        {loading && (
          <JMonacoEditor
            width={'100%'}
            height={400}
            theme="vs-dark"
            language={'json'}
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
          />
        )}
      </div>
    </Modal>
  );
};
