import { model } from '@formily/reactive';

const autzModel = model<{
  autzTarget: {
    id: string;
    name: string;
    type: 'user' | 'role';
  };
  visible: boolean;
}>({
  autzTarget: {
    id: '',
    name: '',
    type: 'user',
  },
  visible: false,
});

export default autzModel;

export const AuthorizationModel = model<{
  data: PermissionItem[];
  checkedPermission: Map<string, Set<string>>;
  filterParam: {
    type: string;
    name: string;
  };
  checkAll: boolean;
  spinning: boolean;
}>({
  data: [],
  checkedPermission: new Map(),
  filterParam: {
    type: 'all',
    name: '',
  },
  checkAll: false,
  spinning: true,
});
