

export class BasicsettingModel {
    userId: string;
    menuName: string;
    subMenuName: string;
    subMenuId: string;
}

export class SavedMenuAddRequestModel {
    userId: number;
    menuName: string;
    subMenuName: string;
    subMenuId: string;
    title: string;
    userName: string;
}

export class SavedMenuViewModel {
    userId: string;
    menuName: string;
    subMenuName: string;
    subMenuId: string;
}

export class SavedGridColumnAddUpdateRequestModel {
    id: number;
    userId: string;
    moduleName: string;
    columns: string;

}
