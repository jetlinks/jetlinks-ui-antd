import { Modal } from 'antd';
import MetadataModel from '@/pages/device/components/Metadata/Base/model';

const PropertyImport = () => {
  return (
    <Modal
      visible
      onCancel={() => {
        MetadataModel.importMetadata = false;
      }}
      title="导入属性"
    >
      ...
    </Modal>
  );
};
export default PropertyImport;
