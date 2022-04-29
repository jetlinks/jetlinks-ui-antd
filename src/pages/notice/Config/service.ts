import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';
import { from, lastValueFrom, map, mergeMap, toArray, zip } from 'rxjs';

class Service extends BaseService<ConfigItem> {
  public getTypes = () =>
    request(`${this.uri}/types`, {
      method: 'GET',
    });

  public getMetadata = (type: string, provider: string) =>
    request(`${this.uri}/${type}/${provider}/metadata`, {
      method: 'GET',
    });

  public getTemplate = (configId: string, data: Record<string, any>) =>
    request(`${SystemConst.API_BASE}/notifier/template/${configId}/_query`, {
      method: 'POST',
      data,
    });

  public getTemplateVariable = (templateId: string) =>
    request(`${SystemConst.API_BASE}/notifier/template/${templateId}/detail`);

  public getHistoryLog = (configId: string, data: Record<string, any>) =>
    request(`${SystemConst.API_BASE}/notify/history/config/${configId}/_query`, {
      method: 'POST',
      data,
    });

  public debug = (id: string, templateId: string, data: Record<string, any>) =>
    request(`${SystemConst.API_BASE}/notifier/${id}/${templateId}/_send`, {
      method: 'POST',
      data,
    });

  syncUser = {
    dingTalkDept: (configId: string) =>
      request(`${SystemConst.API_BASE}/notifier/dingtalk/corp/${configId}/departments/tree`),
    dingTalkUser: (configId: string, departmentId: string) =>
      request(`${SystemConst.API_BASE}/notifier/dingtalk/corp/${configId}/${departmentId}/users`),
    wechatDept: (configId: string) =>
      request(`${SystemConst.API_BASE}/notifier/wechat/corp/${configId}/departments`),
    getDeptUser: (type: 'wechat' | 'dingTalk', configId: string, departmentId: string) =>
      request(`${SystemConst.API_BASE}/notifier/${type}/corp/${configId}/${departmentId}/users`, {
        method: 'GET',
      }),
    wechatUser: (configId: string, departmentId: string) =>
      request(`${SystemConst.API_BASE}/notifier/wechat/corp/${configId}/${departmentId}/users`),
    bindInfo: (type: string, provider: string, configId: string) =>
      request(`${SystemConst.API_BASE}/user/third-party/${type}_${provider}/${configId}`),
    noBindUser: (data: any) =>
      request(`${SystemConst.API_BASE}/user/_query/no-paging`, {
        method: 'POST',
        data,
      }),
    bindUser: (
      type: string,
      provider: string,
      configId: string,
      data: { userId: string; providerName: string; thirdPartyUserId: string }[],
    ) =>
      request(`${SystemConst.API_BASE}/user/third-party/${type}_${provider}/${configId}`, {
        method: 'PATCH',
        data,
      }),
    bindUserThirdParty: (type: string, provider: string, configId: string) =>
      request(`${SystemConst.API_BASE}/user/third-party/${type}_${provider}/${configId}`, {
        method: 'GET',
      }),
    getUserBindInfo: () =>
      request(`${SystemConst.API_BASE}/user/third-party/me`, { method: 'GET' }),
    unBindUser: (bindingId: string, data: any) =>
      request(`${SystemConst.API_BASE}/user/third-party/${bindingId}/_unbind`, {
        method: 'POST',
        data,
      }),
  };

  public queryZipSyncUser = (
    type: 'wechat' | 'dingTalk',
    _type: string,
    provider: string,
    configId: string,
    departmentId: string,
  ) =>
    lastValueFrom(
      zip(
        from(this.syncUser.getDeptUser(type, configId, departmentId)),
        from(this.syncUser.bindUserThirdParty(_type, provider, configId)),
        from(this.syncUser.noBindUser({ paging: false })),
      ).pipe(
        map((resp) => resp.map((i) => i.result)),
        mergeMap((res) => {
          const [resp1, resp2, resp3] = res;
          // 1.自动匹配
          // 2.已匹配
          // status: 1: 已匹配 0: 自动匹配，但是没有保存 -1: 未匹配
          const arr = resp1.map((item: { id: string; name: string }) => {
            let user = resp3.find((i: UserItem) => i?.name === item?.name);
            const thirdPartyUser = resp2.find(
              (i: { userId: string; providerName: string; thirdPartyUserId: string }) =>
                i?.thirdPartyUserId === item?.id,
            );
            if (thirdPartyUser) {
              user = resp3.find((i: UserItem) => i?.id === thirdPartyUser?.userId);
            }
            const status = thirdPartyUser ? 1 : user ? 0 : -1;
            return {
              thirdPartyUserId: item?.id,
              thirdPartyUserName: item?.name,
              bindingId: thirdPartyUser?.id,
              userId: user?.id,
              userName: user?.name,
              username: user?.username,
              status,
            };
          });
          return arr;
        }),
        toArray(),
      ),
    );
}

export default Service;
