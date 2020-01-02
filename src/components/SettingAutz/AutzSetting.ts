export class AutzSetting {
  public type: string;
  public settingFor: string;
  public priority: string;
  public merge: boolean;
  public menus: Menu[] | any[] | never[];
  public details: Permission[] | any[] | never[];

  constructor({ type, settingFor, priority, merge, menus, details }: AutzSetting) {
    this.type = type;
    this.settingFor = settingFor;
    this.priority = priority;
    this.merge = merge;
    this.menus = menus;
    this.details = details;
  }
}

export class Menu {
  public id: string;
  public menuId: string;
  public parentId: string;
  public path: string;
  public settingId: string;
  public status: number;

  constructor({ id, menuId, parentId, path, settingId, status }: Menu) {
    this.id = id;
    this.menuId = menuId;
    this.parentId = parentId;
    this.path = path;
    this.settingId = settingId;
    this.status = status;
  }
}

export class Permission {
  public permissionId: string;
  public priority: string;
  public merge: boolean;
  public dataAccesses: string[];
  public actions: string[];

  constructor({ merge, permissionId, priority, dataAccesses, actions }: Permission) {
    this.merge = merge;
    this.permissionId = permissionId;
    this.priority = priority;
    this.dataAccesses = dataAccesses;
    this.actions = actions;
  }
}
