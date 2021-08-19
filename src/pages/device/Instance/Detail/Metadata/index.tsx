import { observer } from '@formily/react';
import { InstanceModel } from '@/pages/device/Instance';

const Metadata = observer(() => {
  return <div>{JSON.stringify(JSON.parse(InstanceModel.detail.metadata as string))}</div>;
});
export default Metadata;
