import { router } from 'umi';
import { reloadAuthorized } from './Authorized';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(): string | string[] {
  // const authorityString =
  //   typeof str === 'undefined' && localStorage ? localStorage.getItem('antd-pro-authority') : str;
  // // authorityString could be admin, "admin", ["admin"]
  // let authority;
  // try {
  //   if (authorityString) {
  //     authority = JSON.parse(authorityString);
  //   }
  // } catch (e) {
  //   authority = authorityString;
  // }
  // if (typeof authority === 'string') {
  //   return [authority];
  // }
  // // preview.pro.ant.design only do not use in your production.
  // // preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  // if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
  //   return ['admin'];
  // }
  // return authority;
  const storage = localStorage.getItem('hsweb-autz');
  if (storage) {
    try {
      const autz = storage && JSON.parse(storage)
      let authority = [];
      if (autz.currentAuthority) {
        authority = autz.currentAuthority;
      } else {
        authority = autz.permissions.map((item: any) => item.id);
      }
      if (autz.user?.username === 'admin') {
        return ['admin'];
      }
      return authority;
    } catch (error) {
      localStorage.removeItem('hsweb-autz');
      location.reload();
      return ['guest'];
    }
  } else {
    return ['guest'];
  }
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
  // auto reload
  reloadAuthorized();
}

// 用户
export class User {
  public readonly id: string;

  public readonly name: string;

  public readonly username: string;

  public readonly ext: {};

  constructor({ id, name, username, ext = {} }: User) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.ext = ext;
  }
}

// 角色
export class Role {
  public readonly id: string;

  public readonly name: string;

  constructor({ id, name }: Role) {
    this.id = id;
    this.name = name;
  }
}

// 权限
export class Permission {
  public id: string;

  public name: string;

  public actions: string[];

  public dataAccesses: DataAcctessConfig[];

  constructor({ id, name, actions, dataAccesses }: Permission) {
    this.id = id;
    this.name = name;
    this.actions = actions;
    this.dataAccesses = dataAccesses;
  }

  public hasAction(action: string): boolean {
    return this.actions.includes(action);
  }

  public hasAnyAction([...actionArr]): boolean {
    return this.actions.filter(act => actionArr.includes(act)).length > 0;
  }

  public hasActions([...actionArr]): boolean {
    const len = this.actions.filter(act => actionArr.includes(act)).length;
    return len === actionArr.length;
  }
}

// 数据权限配置
export class DataAcctessConfig {
  public action: string;

  public type: string;

  public config: any;

  constructor({ action, type, ...config }: DataAcctessConfig) {
    this.action = action;
    this.config = config;
    this.type = type;
  }
}

export class Authentication {
  public user: User;

  public roles: Role[];

  public permissions: Permission[];

  constructor({ user, roles, permissions }: Authentication) {
    this.user = user;
    this.roles = roles;
    this.permissions = permissions;
  }

  public getPermission(permission: string): Permission | undefined {
    return this.permissions.find(per => per.id === permission);
  }

  public getRole(roleId: string): Role | undefined {
    return this.roles.find(_role => _role.id === roleId);
  }

  public hasRole(roleId: string): boolean {
    return this.getRole(roleId) !== undefined;
  }

  public hasAnyRole([...roles]): boolean {
    return this.roles.find(_role => roles.includes(_role.id)) !== undefined;
  }

  public hasPermission([permission, ...actions]: string[]): boolean {
    return this.getPermission(permission)!.hasActions(actions);
  }

  public hasAnyPermission([...permission]: string[]): boolean {
    return this.permissions.find(per => permission.includes(per.id)) !== undefined;
  }
}

export function getAccessToken(): string {
  return localStorage.getItem('x-access-token') || 'null';
}

export function setAccessToken(token: string) {
  localStorage.setItem('x-access-token', token);
}

export function getAutz(): Authentication | undefined {
  if (!window.top.hsweb_autz) {
    const store = localStorage.getItem('hsweb-autz');
    if (store === null) {
      return undefined;
    }
    const authJson = JSON.parse(store);
    const autz = new Authentication(authJson);
    window.top.hsweb_autz = autz;
  }
  return window.top.hsweb_autz;
}

export function clearAutz() {
  window.top.hsweb_autz = undefined;
  localStorage.removeItem('hsweb-autz');
  localStorage.removeItem('x-access-token');
}

export function setAutz(info: Authentication): Authentication {
  window.top.hsweb_autz = new Authentication(info);
  const autz = new Authentication(info);
  if (JSON.stringify(info) !== 'undefined') {
    localStorage.setItem('hsweb-autz', JSON.stringify(info));
  }
  return autz;
}
