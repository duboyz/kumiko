import { Language } from './localization.types'

export interface UserSdto {
  id: string
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  userType: UserType
  preferredLanguage: Language
}

export enum UserType {
  Standard = 0,
  Enterprise = 1,
}

export interface UpdateUserRdto {
  firstName?: string
  lastName?: string
}

export type User = UserSdto
