import { model } from '@formily/reactive';
import type { OrgItem, OrgModelType } from '@/pages/system/Org/typings';

const OrgModel = model<OrgModelType>({
  edit: false,
  parentId: '',
  data: {},
  current: {},
  authorize: true,

  update(data: Partial<OrgItem>) {
    this.current = data;
    this.edit = true;
    this.parentId = undefined;
  },

  addNext(parentData: Partial<OrgItem>) {
    this.parentId = parentData.id;
    this.edit = true;
    this.current = {};
  },

  authorized(data: Partial<OrgItem>) {
    this.current = data;
    this.authorize = true;
  },
  closeEdit() {
    this.current = {};
    this.edit = false;
  },
});

export default OrgModel;
