import { Modal, Radio, Space } from 'antd';
import { useRef, useState } from 'react';
import { service } from './index';
import { downloadFileByUrl } from '@/utils/util';
import moment from 'moment';

type ExportModalType = {
  onCancel: () => void;
  keys: string[];
};

const ExportModal = (props: ExportModalType) => {
  const type = useRef<string>('xlsx');
  const [loading, setLoading] = useState(false);

  const downloadFileFn = async () => {
    setLoading(true);

    service._export(type.current, props.keys).then((res) => {
      setLoading(false);
      if (res) {
        const blob = new Blob([res]);
        const url = URL.createObjectURL(blob);
        downloadFileByUrl(
          url,
          `物联卡管理-${moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}`,
          type.current,
        );
      }
    });
  };

  return (
    <Modal
      title={'导出'}
      visible={true}
      onCancel={props.onCancel}
      onOk={downloadFileFn}
      confirmLoading={loading}
    >
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
