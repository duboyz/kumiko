export enum Language {
  Unspecified = 0,
  Norwegian = 1,
  English = 2,
  Swedish = 3,
  Danish = 4,
  Thai = 5,
}

export enum Currency {
  Unspecified = 0,
  EUR = 1,
  USD = 2,
  GBP = 3,
  NOK = 4,
  SEK = 5,
  ISK = 6,
  DKK = 7,
}

// Settings command/result types
export interface UpdateUserSettingsCommand {
  preferredLanguage: Language
}

export interface UpdateRestaurantSettingsCommand {
  currency: Currency
}

export interface UpdateHospitalitySettingsCommand {
  currency: Currency
}
