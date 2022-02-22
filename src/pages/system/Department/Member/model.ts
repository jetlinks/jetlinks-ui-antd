// 用户数据模型
import { model } from '@formily/reactive';

type MemberModelType = {
  bind: boolean;
  bindUsers: string[];
  unBindUsers: string[];
};

const MemberModel = model<MemberModelType>({
  bind: false,
  bindUsers: [],
  unBindUsers: [],
});

export default MemberModel;
