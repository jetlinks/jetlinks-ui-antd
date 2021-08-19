import { InstanceModel } from '@/pages/device/Instance';

const Running = () => {
  return (
    <div>
      运行状态
      {JSON.stringify(JSON.parse(InstanceModel.detail.metadata as string))}
    </div>
  );
};
export default Running;
