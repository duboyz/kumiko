'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Settings } from 'lucide-react'
import { TextAlignment } from '@shared'
import { cn } from '@/lib/utils'

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
    color: textColor || '#1f2937',
  }

  const getAlignmentClass = () => {
    console.log('TextSection alignText value:', alignText, 'type:', typeof alignText)
    console.log(alignText === TextAlignment.Left)
    console.log(alignText === TextAlignment.Center)
    console.log(alignText === TextAlignment.Right)
    switch (alignText) {
      case TextAlignment.Left:
        return 'text-left'
      case TextAlignment.Center:
        return 'text-center'
      case TextAlignment.Right:
        return 'text-right'
      default:
        return 'text-left'
    }
  }

  return (
    <section className={`relative py-12 px-4 md:px-6 lg:px-8 ${className}`} style={sectionStyle}>
      {/* Floating Edit Button */}
      {isEditing && onUpdate && (
        <div className="absolute top-0 right-0 z-10">
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
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Text Alignment</label>
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
                </div>

                {/* Text Color */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Text Color</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={textColor || '#1f2937'}
                      onChange={e => onUpdate('textColor', e.target.value)}
                      className={cn('w-16 h-8 p-1 rounded border')}
                      title="Text Color"
                    />
                    <Input
                      value={textColor || '#1f2937'}
                      onChange={e => onUpdate('textColor', e.target.value)}
                      placeholder="Text color..."
                      className="flex-1 text-sm"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Content */}
      <div className={`max-w-4xl mx-auto space-y-6 ${getAlignmentClass()}`}>
        {/* Always show content with real-time updates */}

        {/* Title */}
        {isEditing && onUpdate ? (
          <Input
            value={title || ''}
            onChange={e => onUpdate('title', e.target.value)}
            placeholder="Enter section title (optional)..."
            className={`text-2xl md:text-3xl lg:text-4xl font-bold leading-tight min-h-[3rem] resize-none border-2 border-dashed border-blue-300 bg-blue-50/50 ${getAlignmentClass()}`}
          />
        ) : title ? (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">{title}</h2>
        ) : null}

        {/* Text */}
        {isEditing && onUpdate ? (
          <Textarea
            value={text || ''}
            onChange={e => onUpdate('text', e.target.value)}
            placeholder="Enter your text content (optional)..."
            className={`text-base md:text-lg leading-relaxed min-h-[8rem] resize-none border-2 border-dashed border-blue-300 bg-blue-50/50 ${getAlignmentClass()}`}
          />
        ) : text ? (
          <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">{text}</div>
        ) : null}

        {/* Show placeholder when both title and text are empty and not editing */}
        {!isEditing && !title && !text && (
          <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-lg">Empty Text Section</p>
            <p className="text-sm">Click to edit and add content</p>
          </div>
        )}
      </div>
    </section>
  )
}
