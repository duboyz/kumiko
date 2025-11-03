export interface RegisterDeviceTokenCommand {
  restaurantId: string
  expoPushToken: string
  deviceType: 'ios' | 'android'
}

export interface RegisterDeviceTokenResult {
  success: boolean
  message: string
}
