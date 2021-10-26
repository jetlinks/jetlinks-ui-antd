import { Drawer } from 'antd';
import { observer } from '@formily/react';
import MetadataModel from '@/pages/device/Product/Detail/Metadata/Base/model';

const Edit = observer(() => {
  const metadataTypeMapping = {
    property: '属性',
    events: '事件',
    function: '功能',
    tag: '标签',
  };

  return (
    <Drawer
      width="20vw"
      visible={true}
      title={`编辑${metadataTypeMapping[MetadataModel.type]}`}
      onClose={() => {
        MetadataModel.edit = false;
        MetadataModel.item = {};
      }}
      destroyOnClose={true}
      zIndex={1000}
    >
      {MetadataModel.type}
      {JSON.stringify(MetadataModel.item)}
    </Drawer>
  );
});
export default Edit;
