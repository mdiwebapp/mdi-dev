export class UserpermissionModel {
  id: number;
  moduleName: string;
  moduleTabs: ModuleTabs[] = [];
}

export class ModuleTabs {
  tabName: string;
  isAccess: boolean;
  ActionTyes: ActionTyes[] = [];
}

export class ActionTyes {
  id: string;
  typeName: string;
  isAccess: boolean;
}

export class Permission {
  userId: string;
  permissionDepartmentId:number;
  permissionModuleId: number;
  PermissionModuleTabId: number;
  PermissionTypeId: number;
  isAccess: boolean;
}
