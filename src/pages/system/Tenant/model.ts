import { model } from '@formily/reactive';
import type { TenantDetail } from '@/pages/system/Tenant/typings';

type TenantModelType = {
  current: Partial<TenantDetail>;
  detail: Partial<TenantDetail>;
};
const TenantModel = model<TenantModelType>({
  current: {},
  detail: {},
});

export default TenantModel;
