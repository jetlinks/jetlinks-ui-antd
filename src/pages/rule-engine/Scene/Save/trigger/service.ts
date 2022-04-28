import { request } from '@@/plugin-request/request';
import SystemConst from '@/utils/const';

export const querySelector = () =>
  request(`${SystemConst.API_BASE}/scene/device-selectors`, {
    method: 'GET',
  });

export const queryOrgTree = (id: string) =>
  request(`${SystemConst.API_BASE}/organization/_all/tree`, {
    method: 'POST',
    data: {
      paging: false,
      sorts: [{ name: 'sortIndex', order: 'asc' }],
      terms: [
        {
          column: 'id',
          termType: 'assets-dim',
          value: {
            assetType: 'product',
            assetIds: [id],
            dimensionType: 'org',
          },
        },
      ],
    },
  });
