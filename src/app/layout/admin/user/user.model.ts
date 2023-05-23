export class UserModel {
  id: number;
  userId: string;
  userName: string;
  securityLevel: string;
  branchId: number;
  department: number;
  employeeId: number;
  isSalesMan: boolean;
  domainAccount: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  inactive: boolean;
  isAdmin: boolean;
  isEnable2FA: boolean;
  newFeature: number;
  password: string;
  userSecurityId: number;
  userBranch : UserBranch[] = [];
}

export class UserBranch {
  branchId: number;
  userId: number;
}
