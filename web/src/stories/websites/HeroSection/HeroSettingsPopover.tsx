'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import { Settings, Upload } from 'lucide-react'
import { HeroSectionType } from '@shared'
import { useState, useEffect } from 'react'

interface HeroSettingsPopoverProps {
  type: HeroSectionType
  imageUrl?: string
  backgroundImageUrl?: string
  backgroundColor?: string
  textColor?: string
  backgroundOverlayColor?: string
  buttonText?: string
  buttonUrl?: string
  buttonTextColor?: string
  buttonBackgroundColor?: string
  onUpdate: (field: string, value: string) => void
  onTypeChange?: (type: HeroSectionType) => void
}

// Helper function to parse rgba color
function parseRgba(color?: string): { hex: string; opacity: number } {
  if (!color) return { hex: '#000000', opacity: 0.5 }

  // Check if it's rgba format
  const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (rgbaMatch) {
    const [, r, g, b, a] = rgbaMatch
    const hex = '#' + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('')
    return { hex, opacity: a ? parseFloat(a) : 1 }
  }

  // If it's hex format
  if (color.startsWith('#')) {
    return { hex: color, opacity: 1 }
  }

  return { hex: '#000000', opacity: 0.5 }
}

// Helper function to create rgba string
function createRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export function HeroSettingsPopover({
  type,
  imageUrl,
  backgroundImageUrl,
  backgroundColor,
  textColor,
  backgroundOverlayColor,
  buttonText,
  buttonUrl,
  buttonTextColor,
  buttonBackgroundColor,
  onUpdate,
  onTypeChange,
}: HeroSettingsPopoverProps) {
  // Parse overlay color and opacity
  const { hex: overlayHex, opacity: overlayOpacity } = parseRgba(backgroundOverlayColor)
  const [localOverlayHex, setLocalOverlayHex] = useState(overlayHex)
  const [localOverlayOpacity, setLocalOverlayOpacity] = useState(overlayOpacity)

  // Update local state when prop changes
  useEffect(() => {
    const { hex, opacity } = parseRgba(backgroundOverlayColor)
    setLocalOverlayHex(hex)
    setLocalOverlayOpacity(opacity)
  }, [backgroundOverlayColor])

  // Handle overlay color change
  const handleOverlayColorChange = (hex: string) => {
    setLocalOverlayHex(hex)
    onUpdate('backgroundOverlayColor', createRgba(hex, localOverlayOpacity))
  }

  // Handle overlay opacity change
  const handleOverlayOpacityChange = (opacity: number) => {
    setLocalOverlayOpacity(opacity)
    onUpdate('backgroundOverlayColor', createRgba(localOverlayHex, opacity))
  }

  return (
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

            {/* Type Selector */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Layout Type</label>
              <Select value={type} onValueChange={value => onTypeChange?.(value as HeroSectionType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={HeroSectionType.ImageRight}>Image Right</SelectItem>
                  <SelectItem value={HeroSectionType.BackgroundImage}>Background Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {type === HeroSectionType.ImageRight ? 'Main Image' : 'Background Image'}
              </label>
              <div className="flex gap-2">
                <Input
                  value={type === HeroSectionType.ImageRight ? imageUrl || '' : backgroundImageUrl || ''}
                  onChange={e =>
                    onUpdate(type === HeroSectionType.ImageRight ? 'imageUrl' : 'backgroundImageUrl', e.target.value)
                  }
                  placeholder={type === HeroSectionType.ImageRight ? 'Image URL...' : 'Background image URL...'}
                  className="text-sm"
                />
                <Button size="sm" variant="outline">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Colors</label>
              {type === HeroSectionType.ImageRight ? (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Input
                      type="color"
                      value={backgroundColor || '#ffffff'}
                      onChange={e => onUpdate('backgroundColor', e.target.value)}
                      className="w-full h-8 p-1 rounded border"
                      title="Background"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Background</span>
                  </div>
                  <div>
                    <Input
                      type="color"
                      value={textColor || '#1f2937'}
                      onChange={e => onUpdate('textColor', e.target.value)}
                      className="w-full h-8 p-1 rounded border"
                      title="Text"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Text</span>
                  </div>
                  <div>
                    <Input
                      type="color"
                      value={buttonBackgroundColor || '#3b82f6'}
                      onChange={e => onUpdate('buttonBackgroundColor', e.target.value)}
                      className="w-full h-8 p-1 rounded border"
                      title="Button"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Button</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        type="color"
                        value={backgroundColor || '#1f2937'}
                        onChange={e => onUpdate('backgroundColor', e.target.value)}
                        className="w-full h-8 p-1 rounded border"
                        title="Background"
                      />
                      <span className="text-xs text-gray-500 mt-1 block">Background</span>
                    </div>
                    <div>
                      <Input
                        type="color"
                        value={textColor || '#ffffff'}
                        onChange={e => onUpdate('textColor', e.target.value)}
                        className="w-full h-8 p-1 rounded border"
                        title="Text"
                      />
                      <span className="text-xs text-gray-500 mt-1 block">Text</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">Overlay</span>
                      <span className="text-xs text-gray-500">{Math.round(localOverlayOpacity * 100)}%</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={localOverlayHex}
                        onChange={e => handleOverlayColorChange(e.target.value)}
                        className="w-12 h-8 p-1 rounded border flex-shrink-0"
                        title="Overlay Color"
                      />
                      <Slider
                        value={[localOverlayOpacity]}
                        onValueChange={(values: number[]) => handleOverlayOpacityChange(values[0])}
                        min={0}
                        max={1}
                        step={0.05}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Button Settings */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Button</label>
              <div className="space-y-2">
                <Input
                  value={buttonText || ''}
                  onChange={e => onUpdate('buttonText', e.target.value)}
                  placeholder="Button text..."
                  className="text-sm"
                />
                <Input
                  value={buttonUrl || ''}
                  onChange={e => onUpdate('buttonUrl', e.target.value)}
                  placeholder="Button URL..."
                  className="text-sm"
                />
                {type === HeroSectionType.BackgroundImage && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <Input
                        type="color"
                        value={buttonBackgroundColor || '#3b82f6'}
                        onChange={e => onUpdate('buttonBackgroundColor', e.target.value)}
                        className="w-full h-8 p-1 rounded border"
                        title="Button Background"
                      />
                      <span className="text-xs text-gray-500 mt-1 block">Background</span>
                    </div>
                    <div>
                      <Input
                        type="color"
                        value={buttonTextColor || '#ffffff'}
                        onChange={e => onUpdate('buttonTextColor', e.target.value)}
                        className="w-full h-8 p-1 rounded border"
                        title="Button Text"
                      />
                      <span className="text-xs text-gray-500 mt-1 block">Text</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
