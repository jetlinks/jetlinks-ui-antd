import type { Option } from '@/components/BaseCrud/index';
import { Store } from 'jetlinks-store';
import SystemConst from '@/utils/const';

export const CurdModel = <Option>{
  model: 'edit',
  current: undefined,
  visible: false,

  add() {
    Store.set(SystemConst.BASE_CURD_MODAL_VISIBLE, true);
    Store.set(SystemConst.BASE_CURD_CURRENT, {});
    Store.set(SystemConst.BASE_CURD_MODEL, 'add');
  },

  update(current: any) {
    Store.set(SystemConst.BASE_CURD_MODEL, 'edit');
    Store.set(SystemConst.BASE_CURD_MODAL_VISIBLE, true);
    Store.set(SystemConst.BASE_CURD_CURRENT, current);
  },

  close() {
    Store.set(SystemConst.BASE_CURD_MODAL_VISIBLE, false);
    Store.set(SystemConst.BASE_CURD_CURRENT, {});
  },
};
