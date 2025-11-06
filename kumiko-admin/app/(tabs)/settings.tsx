import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/contexts/auth.context'
import { useRouter } from 'expo-router'
import { restaurantService } from '@/services/restaurant.service'
import { UserRestaurantDto } from '@/types/restaurant.types'
import { notificationService } from '@/services/notification.service'
import * as Clipboard from 'expo-clipboard'

export default function SettingsScreen() {
  const { selectedLocation, logout, selectLocation } = useAuth()
  const [restaurants, setRestaurants] = useState<UserRestaurantDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null)
  const [isLoadingToken, setIsLoadingToken] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadRestaurants()
    loadExpoPushToken()
  }, [])

  const loadExpoPushToken = async () => {
    try {
      const token = await notificationService.getExpoPushToken()
      setExpoPushToken(token)
    } catch (error) {
      console.error('Failed to load expo push token:', error)
    } finally {
      setIsLoadingToken(false)
    }
  }

  const loadRestaurants = async () => {
    try {
      const result = await restaurantService.getUserRestaurants()
      setRestaurants(result.restaurants)
    } catch (error) {
      Alert.alert('Error', 'Failed to load restaurants')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectLocation = async (restaurant: UserRestaurantDto) => {
    try {
      await selectLocation(restaurant.restaurant.id)
      Alert.alert('Success', `Switched to ${restaurant.restaurant.name}`)
    } catch (error) {
      Alert.alert('Error', 'Failed to change location')
    }
  }

  const handleCopyToken = async () => {
    if (expoPushToken) {
      await Clipboard.setStringAsync(expoPushToken)
      Alert.alert('Copied', 'Push token copied to clipboard')
    }
  }

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout()
          router.replace('/login')
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        {selectedLocation && (
          <Text style={styles.subtitle}>{selectedLocation.restaurant.name}</Text>
        )}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Location</Text>
          {selectedLocation && (
            <View style={styles.currentLocationCard}>
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{selectedLocation.restaurant.name}</Text>
                <Text style={styles.locationAddress}>
                  {selectedLocation.restaurant.address}, {selectedLocation.restaurant.city}
                </Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>{selectedLocation.role}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Switch Location</Text>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#000" />
            </View>
          ) : (
            <View style={styles.locationsList}>
              {restaurants.map((restaurant) => {
                const isSelected = selectedLocation?.restaurant.id === restaurant.restaurant.id
                return (
                  <TouchableOpacity
                    key={restaurant.restaurant.id}
                    style={[styles.locationCard, isSelected && styles.locationCardSelected]}
                    onPress={() => handleSelectLocation(restaurant)}
                    disabled={isSelected}
                    activeOpacity={0.7}
                  >
                    <View style={styles.locationCardContent}>
                      <Text style={styles.restaurantName} numberOfLines={1}>
                        {restaurant.restaurant.name}
                      </Text>
                      <Text style={styles.restaurantCity} numberOfLines={1}>
                        {restaurant.restaurant.city}, {restaurant.restaurant.state}
                      </Text>
                    </View>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                )
              })}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          {isLoadingToken ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#000" />
            </View>
          ) : expoPushToken ? (
            <View style={styles.tokenCard}>
              <View style={styles.tokenContent}>
                <Text style={styles.tokenLabel}>Expo Push Token</Text>
                <Text style={styles.tokenText} numberOfLines={2} ellipsizeMode="middle">
                  {expoPushToken}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopyToken}
                activeOpacity={0.7}
              >
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.tokenCard}>
              <Text style={styles.noTokenText}>No push token available</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 15,
    color: '#a0a0a0',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -4,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  currentLocationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 28,
  },
  locationInfo: {
    flex: 1,
    gap: 4,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  locationAddress: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284c7',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  locationsList: {
    gap: 12,
    marginBottom: 8,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  locationCardSelected: {
    borderColor: '#000',
    backgroundColor: '#f9fafb',
  },
  locationCardContent: {
    flex: 1,
    gap: 4,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  restaurantCity: {
    fontSize: 14,
    color: '#6b7280',
  },
  checkmark: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 12,
  },
  logoutButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tokenCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  tokenContent: {
    gap: 8,
    marginBottom: 12,
  },
  tokenLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tokenText: {
    fontSize: 13,
    color: '#1f2937',
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  copyButton: {
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  noTokenText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
})
