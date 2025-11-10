import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CustomerInfo } from '../shared/types'
import { useTranslations } from 'next-intl'

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo
  onCustomerInfoChange: (field: keyof CustomerInfo, value: string) => void
}

export function CustomerInfoForm({ customerInfo, onCustomerInfoChange }: CustomerInfoFormProps) {
  const t = useTranslations('checkout')
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <Label htmlFor="customerName" className="text-sm sm:text-base">
            {t('name')} {t('requiredField')}
          </Label>
          <Input
            id="customerName"
            value={customerInfo.name}
            onChange={e => onCustomerInfoChange('name', e.target.value)}
            placeholder={t('namePlaceholder')}
            className="mt-1.5 sm:mt-2"
          />
        </div>
        <div>
          <Label htmlFor="customerPhone" className="text-sm sm:text-base">
            {t('phone')} {t('requiredField')}
          </Label>
          <Input
            id="customerPhone"
            value={customerInfo.phone}
            onChange={e => onCustomerInfoChange('phone', e.target.value)}
            placeholder={t('phonePlaceholder')}
            className="mt-1.5 sm:mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="customerEmail" className="text-sm sm:text-base">
          {t('email')} {t('requiredField')}
        </Label>
        <Input
          id="customerEmail"
          type="email"
          value={customerInfo.email}
          onChange={e => onCustomerInfoChange('email', e.target.value)}
          placeholder={t('emailPlaceholder')}
          className="mt-1.5 sm:mt-2"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <Label htmlFor="pickupDate" className="text-sm sm:text-base">
            {t('pickupDate')} {t('requiredField')}
          </Label>
          <Input
            id="pickupDate"
            type="date"
            value={customerInfo.pickupDate}
            onChange={e => onCustomerInfoChange('pickupDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="mt-1.5 sm:mt-2"
          />
        </div>
        <div>
          <Label htmlFor="pickupTime" className="text-sm sm:text-base">
            {t('pickupTime')} {t('requiredField')}
          </Label>
          <Input
            id="pickupTime"
            type="time"
            value={customerInfo.pickupTime}
            onChange={e => onCustomerInfoChange('pickupTime', e.target.value)}
            className="mt-1.5 sm:mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="additionalNote" className="text-sm sm:text-base">
          {t('additionalNotes')}
        </Label>
        <Textarea
          id="additionalNote"
          value={customerInfo.additionalNote}
          onChange={e => onCustomerInfoChange('additionalNote', e.target.value)}
          placeholder={t('additionalNotesPlaceholder')}
          rows={3}
          className="mt-1.5 sm:mt-2"
        />
      </div>
    </div>
  )
}
