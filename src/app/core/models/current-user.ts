import { DropDownModel } from './drop-down.model';
import { GeneralSettingsModel } from './general-settings';

export interface CurrentUserModel {
  email: string;
  expiredAfter: string;
  firstName: string;
  name: string;
  lastName: string;
  loginReportId: number;
  refreshToken: string;
  roleId: number;
  roleName: string;
  token: string;
  userId: number;
  userName: string;
  userPicUrl: string;
  rights: any;
  generalSettings: GeneralSettingsModel;
  roles: DropDownModel[];
  roleTokenId: any;
  isAuthenticated: boolean;
  isFirstTime: boolean;
  userPermissions: any;
  isAdmin: string;
  userBranch: any;
  id: number;
}
