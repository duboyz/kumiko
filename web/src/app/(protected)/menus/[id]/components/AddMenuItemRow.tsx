import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Save, X, CornerDownRight, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface MenuItemOption {
  id: string
  name: string
  description: string
  price: number
}

interface AddMenuItemRowProps {
  onSave: (data: {
    name: string
    description: string
    price: string
    isAvailable: boolean
    allergenIds: string[]
    options: Array<{ name: string; description: string; price: number }>
  }) => void
  onCancel: () => void
  isSubmitting: boolean
}

export const AddMenuItemRow = ({ onSave, onCancel, isSubmitting }: AddMenuItemRowProps) => {
  const t = useTranslations('menus')
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    isAvailable: true,
    allergenIds: [] as string[],
    options: [] as MenuItemOption[],
  })
  const [showRemoveOptionDialog, setShowRemoveOptionDialog] = useState(false)
  const [optionToRemove, setOptionToRemove] = useState<number | null>(null)

  const hasOptions = data.options.length > 0

  const handleSave = () => {
    onSave(data)
  }

  const addOption = () => {
    setData(prev => {
      // If no options exist, add 2 (minimum required)
      if (prev.options.length === 0) {
        const basePrice = parseFloat(prev.price) || 0
        return {
          ...prev,
          options: [
            {
              id: `temp-${Date.now()}-1`,
              name: '',
              description: '',
              price: basePrice,
            },
            {
              id: `temp-${Date.now()}-2`,
              name: '',
              description: '',
              price: basePrice,
            },
          ],
        }
      }

      // Otherwise add 1 option
      return {
        ...prev,
        options: [
          ...prev.options,
          {
            id: `temp-${Date.now()}`,
            name: '',
            description: '',
            price: 0,
          },
        ],
      }
    })
  }

  const removeOption = (index: number) => {
    // If removing this option would leave us with only 1 option, show confirmation dialog
    if (data.options.length === 2) {
      setOptionToRemove(index)
      setShowRemoveOptionDialog(true)
    } else {
      // Safe to remove, more than 2 options
      setData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }))
    }
  }

  const confirmRemoveOption = () => {
    if (optionToRemove !== null) {
      // Convert to simple item by removing all options
      const priceToUse = data.options[optionToRemove === 0 ? 1 : 0].price.toString()
      setData(prev => ({
        ...prev,
        options: [],
        price: priceToUse,
      }))
      setShowRemoveOptionDialog(false)
      setOptionToRemove(null)
      toast.info(t('convertedToSimple'))
    }
  }

  const cancelRemoveOption = () => {
    setShowRemoveOptionDialog(false)
    setOptionToRemove(null)
  }

  const updateOption = (index: number, field: keyof MenuItemOption, value: string | number) => {
    setData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? { ...opt, [field]: value } : opt
      ),
    }))
  }

  const toggleHasOptions = (checked: boolean) => {
    if (checked) {
      // Convert to options - create 2 default options (minimum required)
      const basePrice = parseFloat(data.price) || 0
      setData(prev => ({
        ...prev,
        options: [
          {
            id: `temp-${Date.now()}-1`,
            name: '',
            description: '',
            price: basePrice,
          },
          {
            id: `temp-${Date.now()}-2`,
            name: '',
            description: '',
            price: basePrice,
          },
        ],
      }))
    } else {
      // Convert to simple item
      const priceToUse = data.options.length > 0 ? data.options[0].price.toString() : '0'
      setData(prev => ({
        ...prev,
        options: [],
        price: priceToUse,
      }))
    }
  }

  return (
    <>
      <TableRow className="bg-blue-50/50 border-l-4 border-l-blue-500">
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell>
          <Input
            value={data.name}
            onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
            placeholder={t('menuItemNamePlaceholder')}
            className="w-full"
            autoFocus
          />
        </TableCell>
        <TableCell>
          <Input
            value={data.description}
            onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
            placeholder={t('descriptionPlaceholder')}
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            step="0.01"
            value={data.price}
            onChange={(e) => setData(prev => ({ ...prev, price: e.target.value }))}
            placeholder={hasOptions ? "N/A" : t('pricePlaceholder')}
            className="w-24"
            disabled={hasOptions}
          />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Switch
              checked={hasOptions}
              onCheckedChange={toggleHasOptions}
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {hasOptions ? t('options') : t('noOptions')}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <Switch
            checked={data.isAvailable}
            onCheckedChange={(checked) => setData(prev => ({ ...prev, isAvailable: checked as boolean }))}
          />
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {/* Options rows */}
      {data.options.map((option, index) => (
        <TableRow key={option.id} className="bg-blue-50/50">
          <TableCell></TableCell>
          <TableCell>
            <CornerDownRight className="h-4 w-4" />
          </TableCell>
          <TableCell>
            <Input
              value={option.name}
              onChange={(e) => updateOption(index, 'name', e.target.value)}
              placeholder={t('optionNamePlaceholder')}
              className="w-full"
            />
          </TableCell>
          <TableCell>
            <Input
              value={option.description || ''}
              onChange={(e) => updateOption(index, 'description', e.target.value)}
              placeholder={t('optionDescriptionPlaceholder')}
              className="w-full"
            />
          </TableCell>
          <TableCell>
            <Input
              type="number"
              step="0.01"
              value={option.price || 0}
              onChange={(e) => updateOption(index, 'price', parseFloat(e.target.value) || 0)}
              placeholder={t('pricePlaceholder')}
              className="w-24"
            />
          </TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeOption(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}

      {/* Always show Add Another Option button */}
      <TableRow className="bg-blue-50/50">
        <TableCell colSpan={8} className="py-2">
          <Button onClick={addOption} className="w-full" variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            {t('addOption')}
          </Button>
        </TableCell>
      </TableRow>

      {/* Remove Option Confirmation Dialog */}
      <AlertDialog open={showRemoveOptionDialog} onOpenChange={setShowRemoveOptionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('removeOptionTitle')}</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              {t('removeOptionDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRemoveOption}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveOption}>
              {t('removeAndConvert')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
