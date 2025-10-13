import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, Calendar, CreditCard, MapPin, Menu } from 'lucide-react'
import type { UserSubscriptionDto } from '@shared/types/subscription.types'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface SubscriptionStatusProps {
  subscription: UserSubscriptionDto
  currentLocations: number
  currentMenus: number
}

export function SubscriptionStatus({ subscription, currentLocations, currentMenus }: SubscriptionStatusProps) {
  const { plan, status, billingInterval, trialEndDate, currentPeriodEnd, isTrialing, isActive } = subscription

  const maxLocations = plan.maxLocations === -1 ? Infinity : plan.maxLocations
  const maxMenus = plan.maxMenusPerLocation === -1 ? Infinity : plan.maxMenusPerLocation

  const locationProgress = maxLocations === Infinity ? 0 : (currentLocations / maxLocations) * 100
  const menuProgress = maxMenus === Infinity ? 0 : (currentMenus / maxMenus) * 100

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = () => {
    switch (status) {
      case 'Trialing':
        return 'bg-blue-500'
      case 'Active':
        return 'bg-green-500'
      case 'Canceled':
        return 'bg-gray-500'
      case 'PastDue':
        return 'bg-red-500'
      case 'Expired':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{plan.name} Plan</CardTitle>
            <CardDescription>
              ${billingInterval === 'Yearly' ? plan.yearlyPrice : plan.monthlyPrice}/{billingInterval.toLowerCase()}
            </CardDescription>
          </div>
          <Badge className={getStatusColor()}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trial/Billing Period Info */}
        {isTrialing && trialEndDate && (
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              Your free trial ends on {formatDate(trialEndDate)}. After that, you'll be charged{' '}
              ${billingInterval === 'Yearly' ? plan.yearlyPrice : plan.monthlyPrice} per {billingInterval.toLowerCase()}.
            </AlertDescription>
          </Alert>
        )}

        {!isTrialing && isActive && currentPeriodEnd && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>Next billing date: {formatDate(currentPeriodEnd)}</span>
          </div>
        )}

        {status === 'PastDue' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your payment is past due. Please update your payment method to continue using the service.
            </AlertDescription>
          </Alert>
        )}

        {/* Usage Stats */}
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Locations</span>
              </div>
              <span className="font-medium">
                {currentLocations} / {maxLocations === Infinity ? '∞' : maxLocations}
              </span>
            </div>
            {maxLocations !== Infinity && (
              <Progress value={locationProgress} className="h-2" />
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Menu className="h-4 w-4" />
                <span>Menus (total across all locations)</span>
              </div>
              <span className="font-medium">
                {currentMenus}
              </span>
            </div>
            {maxMenus !== Infinity && (
              <div className="text-xs text-muted-foreground">
                Up to {maxMenus} menu{maxMenus !== 1 ? 's' : ''} per location
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
