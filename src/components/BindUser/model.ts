import { model } from '@formily/reactive';

export const BindModel = model<{
  visible: boolean;
  bind: boolean;
  bindUsers: { userId: string; userName: string }[];
  unBindUsers: string[];
  dimension: {
    id?: string;
    name?: string;
    type?: string;
  };
  queryUserTerms: string;
}>({
  visible: false,
  bind: false,
  bindUsers: [],
  unBindUsers: [],
  dimension: {},
  queryUserTerms: '',
});
