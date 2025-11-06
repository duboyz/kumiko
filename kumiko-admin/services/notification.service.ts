import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform, Alert } from 'react-native'
import Constants from 'expo-constants'
import { apiClient } from './api.service'
import { RegisterDeviceTokenResult } from '@/types/notification.types'
import { ApiResponse } from '@/types/auth.types'

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      Alert.alert(
        'Notifications Not Available',
        'Push notifications only work on physical devices.'
      )
      return false
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please enable notifications in your device settings to receive order updates.'
      )
      return false
    }

    return true
  },

  async getExpoPushToken(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions()
      if (!hasPermission) {
        return null
      }

      // Get the projectId from expo-constants
      const projectId = Constants.expoConfig?.extra?.eas?.projectId

      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      })

      return token.data
    } catch (error) {
      console.error('Error getting push token:', error)
      Alert.alert('Error', 'Failed to get push notification token')
      return null
    }
  },

  async registerDeviceToken(
    restaurantId: string,
    expoPushToken: string
  ): Promise<boolean> {
    try {
      const deviceType = Platform.OS === 'ios' ? 'ios' : 'android'

      const { data } = await apiClient.post<ApiResponse<RegisterDeviceTokenResult>>(
        `/api/restaurants/${restaurantId}/register-device`,
        {
          expoPushToken,
          deviceType,
        }
      )

      if (!data.success) {
        throw new Error(data.message || 'Failed to register device token')
      }

      return true
    } catch (error) {
      console.error('Error registering device token:', error)
      return false
    }
  },

  async registerForRestaurant(restaurantId: string): Promise<void> {
    const token = await this.getExpoPushToken()
    if (!token) {
      console.log('No push token available, skipping registration')
      return
    }

    const success = await this.registerDeviceToken(restaurantId, token)
    if (success) {
      console.log('Token:', token)
      console.log('Device successfully registered for push notifications')
    } else {
      console.log('Failed to register device for push notifications')
    }
  },

  addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(callback)
  },

  addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback)
  },
}
