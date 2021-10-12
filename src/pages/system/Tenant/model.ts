import { model } from '@formily/reactive';
import type { TenantDetail } from '@/pages/system/Tenant/typings';
import type { TenantMember } from '@/pages/system/Tenant/typings';

type TenantModelType = {
  current: Partial<TenantDetail>;
  detail: Partial<TenantDetail>;
  bind: boolean;
  bindUsers: { name: string; userId: string }[];
  unBindUsers: string[];
  members: TenantMember[];
  assets: {
    device: {
      online: number;
      offline: number;
    };
    product: {
      0: number;
      1: number;
    };
  };
  assetsMemberId: string | undefined;
};
const TenantModel = model<TenantModelType>({
  current: {},
  detail: {},
  bind: false,
  bindUsers: [],
  unBindUsers: [],
  members: [],
  assets: {
    device: {
      online: 0,
      offline: 0,
    },
    product: {
      0: 0,
      1: 0,
    },
  },
  assetsMemberId: undefined,
});

export default TenantModel;
