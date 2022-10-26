import { Modal, Radio, Space } from 'antd';
import { useRef } from 'react';
import { service } from './index';
import { downloadFile } from '@/utils/util';

type ExportModalType = {
  onCancel: () => void;
  keys: string[];
};

const ExportModal = (props: ExportModalType) => {
  const type = useRef<string>('xlsx');

  const downloadFileFn = async () => {
    service._export(type.current, props.keys).then((res) => {
      if (res.status === 200) {
        const blob = new Blob([res.data], { type: type.current });
        const url = URL.createObjectURL(blob);
        downloadFile(url);
      }
    });
  };

  return (
    <Modal title={'导出'} visible={true} onCancel={props.onCancel} onOk={downloadFileFn}>
      <div style={{ paddingLeft: 30 }}>
        <Space>
          <span>文件格式：</span>
          <Radio.Group
            options={[
              { label: 'xlsx', value: 'xlsx' },
              { label: 'csv', value: 'csv' },
            ]}
            onChange={(e) => {
              type.current = e.target.value;
            }}
            defaultValue={type.current}
            optionType="button"
            buttonStyle="solid"
          />
        </Space>
      </div>
    </Modal>
  );
};

export default ExportModal;
