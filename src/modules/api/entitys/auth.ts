export interface Auth{
  access_token: string
  role: RoleLevel
}

export enum RoleLevel{
  user,
  checker,
  adm,
  owner
}
