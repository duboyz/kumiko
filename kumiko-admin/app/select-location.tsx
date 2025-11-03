import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/contexts/auth.context'
import { useRouter } from 'expo-router'
import { restaurantService } from '@/services/restaurant.service'
import { UserRestaurantDto } from '@/types/restaurant.types'

export default function SelectLocationScreen() {
  const [restaurants, setRestaurants] = useState<UserRestaurantDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { selectLocation, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    loadRestaurants()
  }, [])

  const loadRestaurants = async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true)
      const result = await restaurantService.getUserRestaurants()
      setRestaurants(result.restaurants)
    } catch (error) {
      Alert.alert('Error', 'Failed to load restaurants. Please try again.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleSelectLocation = async (restaurant: UserRestaurantDto) => {
    setSelectedId(restaurant.restaurant.id)
    try {
      await selectLocation(restaurant.restaurant.id)
      router.replace('/(tabs)')
    } catch (error) {
      setSelectedId(null)
      Alert.alert('Error', 'Failed to select location. Please try again.')
    }
  }

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout()
            router.replace('/login')
          },
        },
      ]
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading locations...</Text>
      </SafeAreaView>
    )
  }

  if (restaurants.length === 0) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>No Locations Found</Text>
          <Text style={styles.emptyStateText}>
            You don't have access to any restaurant locations yet.
          </Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Select Location</Text>
          <Text style={styles.subtitle}>Choose a restaurant to manage</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutLink}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.restaurant.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadRestaurants(true)}
              tintColor="#007AFF"
            />
          }
          renderItem={({ item }) => {
            const isSelected = selectedId === item.restaurant.id
            return (
              <TouchableOpacity
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => handleSelectLocation(item)}
                disabled={isSelected}
                activeOpacity={0.7}
              >
                <View style={styles.cardLeft}>
                  <View style={styles.cardContent}>
                    <Text style={styles.restaurantName} numberOfLines={1}>
                      {item.restaurant.name}
                    </Text>
                    <Text style={styles.restaurantAddress} numberOfLines={2}>
                      {item.restaurant.address}
                    </Text>
                    <Text style={styles.restaurantCity}>
                      {item.restaurant.city}, {item.restaurant.state}
                    </Text>
                    <View style={styles.roleBadge}>
                      <Text style={styles.roleBadgeText}>{item.role}</Text>
                    </View>
                  </View>
                </View>
                {isSelected ? (
                  <ActivityIndicator color="#007AFF" />
                ) : (
                  <Text style={styles.arrow}>›</Text>
                )}
              </TouchableOpacity>
            )
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#000000',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#a0a0a0',
    fontWeight: '500',
  },
  logoutLink: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -4,
  },
  list: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f7ff',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
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
  cardContent: {
    flex: 1,
    gap: 4,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },
  restaurantCity: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284c7',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  arrow: {
    fontSize: 32,
    color: '#d1d5db',
    marginLeft: 12,
    fontWeight: '300',
  },
  separator: {
    height: 12,
  },
  logoutButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
