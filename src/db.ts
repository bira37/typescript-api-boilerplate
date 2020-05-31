export interface DBBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface DBUser extends DBBase {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  isSuperUser: string;
}
