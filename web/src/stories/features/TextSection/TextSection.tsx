'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Settings } from 'lucide-react'
import { TextAlignment } from '@shared'
import { cn } from '@/lib/utils'
import { FormField } from '@/stories/shared/FormField/FormField'

interface TextSectionProps {
  title?: string
  text?: string
  alignText: TextAlignment
  textColor?: string
  className?: string
  isEditing?: boolean
  onUpdate?: (field: string, value: string) => void
}

export function TextSection({
  title,
  text,
  alignText,
  textColor,
  className = '',
  isEditing,
  onUpdate,
}: TextSectionProps) {
  const sectionStyle = {
    color: textColor || '#000000',
  }

  const getAlignmentClass = () => {
    switch (alignText) {
      case TextAlignment.Left:
        return 'text-left'
      case TextAlignment.Center:
        return 'text-center'
      case TextAlignment.Right:
        return 'text-right'
      default:
        return 'text-center'
    }
  }

  const getMaxWidth = () => {
    return 'max-w-[800px]'
  }

  return (
    <section className={`relative py-20 px-10 bg-white ${className}`} style={sectionStyle}>
      {/* Floating Edit Button */}
      {isEditing && onUpdate && (
        <div className="absolute top-4 right-4 z-10">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="bg-white shadow-lg border-gray-300">
                <Settings className="w-4 h-4" color="#000" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-900 mb-3">Section Settings</h4>

                {/* Text Alignment */}
                <FormField label="Text Alignment" htmlFor="textAlignment">
                  <Select
                    value={alignText}
                    onValueChange={value => {
                      onUpdate?.('alignText', value)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TextAlignment.Left}>Left</SelectItem>
                      <SelectItem value={TextAlignment.Center}>Center</SelectItem>
                      <SelectItem value={TextAlignment.Right}>Right</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Text Color */}
                <FormField label="Text Color" htmlFor="textColor">
                  <div className="flex gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={textColor || '#000000'}
                      onChange={e => onUpdate('textColor', e.target.value)}
                      className={cn('w-16 h-8 p-1 rounded border')}
                      title="Text Color"
                    />
                    <Input
                      value={textColor || '#000000'}
                      onChange={e => onUpdate('textColor', e.target.value)}
                      placeholder="Text color..."
                      className="flex-1 text-sm"
                    />
                  </div>
                </FormField>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Content */}
      <div className={`${getMaxWidth()} mx-auto ${getAlignmentClass()}`}>
        {/* Title */}
        {isEditing && onUpdate ? (
          <Input
            value={title || ''}
            onChange={e => onUpdate('title', e.target.value)}
            placeholder="Enter section title (optional)..."
            className={`text-4xl font-light leading-tight mb-8 min-h-[3rem] resize-none border-2 border-dashed border-blue-300 bg-blue-50/50 ${getAlignmentClass()}`}
          />
        ) : title ? (
          <h2 className="text-4xl font-light leading-tight mb-8">{title}</h2>
        ) : null}

        {/* Text */}
        {isEditing && onUpdate ? (
          <Textarea
            value={text || ''}
            onChange={e => onUpdate('text', e.target.value)}
            placeholder="Enter your text content (optional)..."
            className={`text-base text-muted-foreground leading-relaxed min-h-[8rem] resize-none border-2 border-dashed border-blue-300 bg-blue-50/50 ${getAlignmentClass()}`}
          />
        ) : text ? (
          <div className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap [&>p]:mb-6 [&>p:last-child]:mb-0">
            {text.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : null}

        {/* Show placeholder when both title and text are empty and not editing */}
        {!isEditing && !title && !text && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed">
            <p className="text-lg">Empty Text Section</p>
            <p className="text-sm">Click to edit and add content</p>
          </div>
        )}
      </div>
    </section>
  )
}
