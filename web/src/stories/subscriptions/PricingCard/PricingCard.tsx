import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { SubscriptionPlanDto } from '@shared/types/subscription.types'

interface PricingCardProps {
  plan: SubscriptionPlanDto
  billingInterval: 'Monthly' | 'Yearly'
  isCurrentPlan?: boolean
  isPopular?: boolean
  onSelect: () => void
  loading?: boolean
}

export function PricingCard({
  plan,
  billingInterval,
  isCurrentPlan = false,
  isPopular = false,
  onSelect,
  loading = false,
}: PricingCardProps) {
  const price = billingInterval === 'Yearly' ? plan.yearlyPrice : plan.monthlyPrice
  const period = billingInterval === 'Yearly' ? 'year' : 'month'
  const yearlyDiscount = billingInterval === 'Yearly' ? Math.round((1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100) : 0

  const features = [
    `${plan.maxLocations === -1 ? 'Unlimited' : plan.maxLocations} location${plan.maxLocations !== 1 ? 's' : ''}`,
    `${plan.maxMenusPerLocation === -1 ? 'Unlimited' : plan.maxMenusPerLocation} menu${plan.maxMenusPerLocation !== 1 ? 's' : ''} per location`,
    'Custom domain support',
    'QR code generation',
    '24/7 Support',
  ]

  if (plan.tier === 'Enterprise') {
    features.push('Priority support', 'Custom integrations', 'Dedicated account manager')
  }

  return (
    <Card className={`relative ${isPopular ? 'border-primary shadow-lg' : ''}`}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          Most Popular
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>
          {plan.tier === 'Basic' && 'Perfect for getting started'}
          {plan.tier === 'Premium' && 'Best for growing businesses'}
          {plan.tier === 'Enterprise' && 'For large-scale operations'}
        </CardDescription>
        <div className="mt-4">
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">${price}</span>
            <span className="ml-2 text-muted-foreground">/{period}</span>
          </div>
          {billingInterval === 'Yearly' && yearlyDiscount > 0 && (
            <p className="mt-1 text-sm text-green-600">
              Save {yearlyDiscount}% with annual billing
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="mr-2 h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={onSelect}
          disabled={isCurrentPlan || loading}
          variant={isPopular ? 'default' : 'outline'}
        >
          {isCurrentPlan ? 'Current Plan' : loading ? 'Loading...' : 'Choose Plan'}
        </Button>
      </CardFooter>
    </Card>
  )
}
