import type { Option } from '@/components/BaseCrud/index';
import { Store } from 'jetlinks-store';
import SystemConst from '@/utils/const';
import { model } from '@formily/reactive';

export const CurdModel = model<Option>({
  model: 'add',
  current: undefined,
  visible: false,

  add() {
    Store.set(SystemConst.BASE_CURD_MODAL_VISIBLE, true);
    Store.set(SystemConst.BASE_CURD_CURRENT, {});
    Store.set(SystemConst.BASE_CURD_MODEL, 'add');
    this.model = 'add';
  },

  update(current: any) {
    console.log('触发编辑');
    Store.set(SystemConst.BASE_CURD_MODEL, 'edit');
    Store.set(SystemConst.BASE_CURD_MODAL_VISIBLE, true);
    Store.set(SystemConst.BASE_CURD_CURRENT, current);
    this.model = 'edit';
    this.current = current;
  },

  close() {
    Store.set(SystemConst.BASE_CURD_MODAL_VISIBLE, false);
    Store.set(SystemConst.BASE_CURD_CURRENT, {});
  },
});
