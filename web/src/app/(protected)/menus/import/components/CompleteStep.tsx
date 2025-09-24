'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, ArrowLeft, ArrowRight, Package, Eye } from 'lucide-react'

interface CompleteStepProps {
  onComplete: () => void
  onBack: () => void
  showSuccess: boolean
}

export function CompleteStep({ onComplete, onBack, showSuccess }: CompleteStepProps) {
  return (
    <div className="space-y-6">
      {/* Success Message */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">Menu Items Added Successfully!</h3>
              <p className="text-sm text-green-700">
                Your menu items have been processed and added to your menu. You can now view and manage them in your
                menu items list.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">What's Next?</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Eye className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Review Your Menu</p>
                <p className="text-xs text-muted-foreground">
                  Check your menu items and make any necessary adjustments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Organize Categories</p>
                <p className="text-xs text-muted-foreground">Arrange items into categories for better organization</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Publish Your Menu</p>
                <p className="text-xs text-muted-foreground">Your menu is ready to be shared with customers</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Review
        </Button>
        <Button onClick={onComplete} size="lg">
          View Menu Items
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
