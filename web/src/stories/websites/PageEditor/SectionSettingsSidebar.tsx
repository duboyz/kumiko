'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Upload, X } from 'lucide-react'
import { HeroSectionType, TextAlignment } from '@shared'
import { useState, useEffect } from 'react'
import type { WebsiteSectionDto, RestaurantMenuDto } from '@shared'

interface SectionSettingsSidebarProps {
    section: WebsiteSectionDto | null
    sectionUpdates: Record<string, any>
    onUpdate: (sectionId: string, field: string, value: string | boolean) => void
    onTypeChange: (sectionId: string, newType: HeroSectionType) => void
    onClose: () => void
    availableMenus?: RestaurantMenuDto[]
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

export function SectionSettingsSidebar({
    section,
    sectionUpdates,
    onUpdate,
    onTypeChange,
    onClose,
    availableMenus = [],
}: SectionSettingsSidebarProps) {
    if (!section) return null

    // Determine section type
    const sectionType = section.heroSection
        ? 'hero'
        : section.textSection
            ? 'text'
            : section.textAndImageSection
                ? 'textAndImage'
                : section.restaurantMenuSection
                    ? 'menu'
                    : null

    if (!sectionType) return null

    // Get the current section data with updates applied
    const currentData = {
        ...(section.heroSection || section.textSection || section.textAndImageSection || section.restaurantMenuSection),
        ...sectionUpdates[section.id],
    }

    // Parse overlay color and opacity (for hero sections)
    const { hex: overlayHex, opacity: overlayOpacity } = parseRgba(currentData.backgroundOverlayColor)
    const [localOverlayHex, setLocalOverlayHex] = useState(overlayHex)
    const [localOverlayOpacity, setLocalOverlayOpacity] = useState(overlayOpacity)

    // Update local state when prop changes
    useEffect(() => {
        if (sectionType === 'hero') {
            const { hex, opacity } = parseRgba(currentData.backgroundOverlayColor)
            setLocalOverlayHex(hex)
            setLocalOverlayOpacity(opacity)
        }
    }, [currentData.backgroundOverlayColor, sectionType])

    // Handle overlay color change
    const handleOverlayColorChange = (hex: string) => {
        setLocalOverlayHex(hex)
        onUpdate(section.id, 'backgroundOverlayColor', createRgba(hex, localOverlayOpacity))
    }

    // Handle overlay opacity change
    const handleOverlayOpacityChange = (opacity: number) => {
        setLocalOverlayOpacity(opacity)
        onUpdate(section.id, 'backgroundOverlayColor', createRgba(localOverlayHex, opacity))
    }

    const renderSectionTitle = () => {
        switch (sectionType) {
            case 'hero':
                return 'Hero Section Settings'
            case 'text':
                return 'Text Section Settings'
            case 'textAndImage':
                return 'Text & Image Settings'
            case 'menu':
                return 'Menu Section Settings'
            default:
                return 'Section Settings'
        }
    }

    return (
        <div className="w-80 border-l bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">{renderSectionTitle()}</h3>
                <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-6">
                {/* HERO SECTION SETTINGS */}
                {sectionType === 'hero' && (
                    <>
                        {/* Type Selector */}
                        <div>
                            <label className="text-sm font-medium text-gray-900 mb-2 block">Layout Type</label>
                            <Select value={currentData.type as HeroSectionType} onValueChange={value => onTypeChange(section.id, value as HeroSectionType)}>
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
                            <label className="text-sm font-medium text-gray-900 mb-2 block">
                                {currentData.type === HeroSectionType.ImageRight ? 'Main Image' : 'Background Image'}
                            </label>
                            <div className="space-y-2">
                                <Input
                                    value={currentData.type === HeroSectionType.ImageRight ? currentData.imageUrl || '' : currentData.backgroundImageUrl || ''}
                                    onChange={e =>
                                        onUpdate(section.id, currentData.type === HeroSectionType.ImageRight ? 'imageUrl' : 'backgroundImageUrl', e.target.value)
                                    }
                                    placeholder={currentData.type === HeroSectionType.ImageRight ? 'Image URL...' : 'Background image URL...'}
                                    className="text-sm"
                                />
                                <Button size="sm" variant="outline" className="w-full">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Image
                                </Button>
                            </div>
                        </div>

                        {/* Colors */}
                        <div>
                            <label className="text-sm font-medium text-gray-900 mb-2 block">Colors</label>
                            {currentData.type === HeroSectionType.ImageRight ? (
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="color"
                                                value={currentData.backgroundColor || '#ffffff'}
                                                onChange={e => onUpdate(section.id, 'backgroundColor', e.target.value)}
                                                className="w-12 h-10 p-1 rounded border flex-shrink-0"
                                                title="Background"
                                            />
                                            <span className="text-sm text-gray-700">Background Color</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="color"
                                                value={currentData.textColor || '#1f2937'}
                                                onChange={e => onUpdate(section.id, 'textColor', e.target.value)}
                                                className="w-12 h-10 p-1 rounded border flex-shrink-0"
                                                title="Text"
                                            />
                                            <span className="text-sm text-gray-700">Text Color</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="color"
                                                value={currentData.buttonBackgroundColor || '#3b82f6'}
                                                onChange={e => onUpdate(section.id, 'buttonBackgroundColor', e.target.value)}
                                                className="w-12 h-10 p-1 rounded border flex-shrink-0"
                                                title="Button"
                                            />
                                            <span className="text-sm text-gray-700">Button Color</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="color"
                                                value={currentData.backgroundColor || '#1f2937'}
                                                onChange={e => onUpdate(section.id, 'backgroundColor', e.target.value)}
                                                className="w-12 h-10 p-1 rounded border flex-shrink-0"
                                                title="Background"
                                            />
                                            <span className="text-sm text-gray-700">Background Color</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="color"
                                                value={currentData.textColor || '#ffffff'}
                                                onChange={e => onUpdate(section.id, 'textColor', e.target.value)}
                                                className="w-12 h-10 p-1 rounded border flex-shrink-0"
                                                title="Text"
                                            />
                                            <span className="text-sm text-gray-700">Text Color</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-700">Overlay</span>
                                            <span className="text-xs text-gray-500">{Math.round(localOverlayOpacity * 100)}%</span>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <Input
                                                type="color"
                                                value={localOverlayHex}
                                                onChange={e => handleOverlayColorChange(e.target.value)}
                                                className="w-12 h-10 p-1 rounded border flex-shrink-0"
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
                                </div>
                            )}
                        </div>

                        {/* Button Settings */}
                        <div>
                            <label className="text-sm font-medium text-gray-900 mb-2 block">Button</label>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Button Text</label>
                                    <Input
                                        value={currentData.buttonText || ''}
                                        onChange={e => onUpdate(section.id, 'buttonText', e.target.value)}
                                        placeholder="Button text..."
                                        className="text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Button URL</label>
                                    <Input
                                        value={currentData.buttonUrl || ''}
                                        onChange={e => onUpdate(section.id, 'buttonUrl', e.target.value)}
                                        placeholder="Button URL..."
                                        className="text-sm"
                                    />
                                </div>
                                {currentData.type === HeroSectionType.BackgroundImage && (
                                    <div className="space-y-3 pt-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="color"
                                                    value={currentData.buttonBackgroundColor || '#3b82f6'}
                                                    onChange={e => onUpdate(section.id, 'buttonBackgroundColor', e.target.value)}
                                                    className="w-12 h-10 p-1 rounded border flex-shrink-0"
                                                    title="Button Background"
                                                />
                                                <span className="text-sm text-gray-700">Button Background</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="color"
                                                    value={currentData.buttonTextColor || '#ffffff'}
                                                    onChange={e => onUpdate(section.id, 'buttonTextColor', e.target.value)}
                                                    className="w-12 h-10 p-1 rounded border flex-shrink-0"
                                                    title="Button Text"
                                                />
                                                <span className="text-sm text-gray-700">Button Text Color</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* TEXT SECTION SETTINGS */}
                {sectionType === 'text' && (
                    <>
                        {/* Text Alignment */}
                        <div>
                            <label className="text-sm font-medium text-gray-900 mb-2 block">Text Alignment</label>
                            <Select
                                value={currentData.alignText || TextAlignment.Center}
                                onValueChange={value => onUpdate(section.id, 'alignText', value)}
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
                            <label className="text-sm font-medium text-gray-900 mb-2 block">Text Color</label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="color"
                                    value={currentData.textColor || '#000000'}
                                    onChange={e => onUpdate(section.id, 'textColor', e.target.value)}
                                    className="w-12 h-10 p-1 rounded border flex-shrink-0"
                                    title="Text Color"
                                />
                                <Input
                                    value={currentData.textColor || '#000000'}
                                    onChange={e => onUpdate(section.id, 'textColor', e.target.value)}
                                    placeholder="Text color..."
                                    className="flex-1 text-sm"
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* TEXT AND IMAGE SECTION SETTINGS */}
                {sectionType === 'textAndImage' && (
                    <>
                        {/* Image URL */}
                        <div>
                            <label className="text-sm font-medium text-gray-900 mb-2 block">Image URL</label>
                            <Input
                                value={currentData.imageUrl || ''}
                                onChange={e => onUpdate(section.id, 'imageUrl', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="text-sm"
                            />
                        </div>

                        {/* Image Alt Text */}
                        <div>
                            <label className="text-sm font-medium text-gray-900 mb-2 block">Image Alt Text</label>
                            <Input
                                value={currentData.imageAlt || ''}
                                onChange={e => onUpdate(section.id, 'imageAlt', e.target.value)}
                                placeholder="Describe the image..."
                                className="text-sm"
                            />
                        </div>

                        {/* Text Alignment */}
                        <div>
                            <label className="text-sm font-medium text-gray-900 mb-2 block">Text Alignment</label>
                            <Select
                                value={currentData.alignment || TextAlignment.Left}
                                onValueChange={value => onUpdate(section.id, 'alignment', value)}
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

                        {/* Image Position */}
                        <div>
                            <label className="text-sm font-medium text-gray-900 mb-2 block">Image Position</label>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Image on left side</span>
                                <Switch
                                    checked={currentData.imageOnLeft || false}
                                    onCheckedChange={checked => onUpdate(section.id, 'imageOnLeft', checked)}
                                />
                            </div>
                        </div>

                        {/* Text Color */}
                        <div>
                            <label className="text-sm font-medium text-gray-900 mb-2 block">Text Color</label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="color"
                                    value={currentData.textColor || '#1f2937'}
                                    onChange={e => onUpdate(section.id, 'textColor', e.target.value)}
                                    className="w-12 h-10 p-1 rounded border flex-shrink-0"
                                    title="Text Color"
                                />
                                <Input
                                    value={currentData.textColor || '#1f2937'}
                                    onChange={e => onUpdate(section.id, 'textColor', e.target.value)}
                                    placeholder="Text color..."
                                    className="flex-1 text-sm"
                                />
                            </div>
                        </div>

                        {/* Button Color */}
                        <div>
                            <label className="text-sm font-medium text-gray-900 mb-2 block">Button Color</label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="color"
                                    value={currentData.buttonColor || '#3b82f6'}
                                    onChange={e => onUpdate(section.id, 'buttonColor', e.target.value)}
                                    className="w-12 h-10 p-1 rounded border flex-shrink-0"
                                    title="Button Color"
                                />
                                <Input
                                    value={currentData.buttonColor || '#3b82f6'}
                                    onChange={e => onUpdate(section.id, 'buttonColor', e.target.value)}
                                    placeholder="Button color..."
                                    className="flex-1 text-sm"
                                />
                            </div>
                        </div>

                        {/* Button Text Color */}
                        <div>
                            <label className="text-sm font-medium text-gray-900 mb-2 block">Button Text Color</label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="color"
                                    value={currentData.buttonTextColor || '#ffffff'}
                                    onChange={e => onUpdate(section.id, 'buttonTextColor', e.target.value)}
                                    className="w-12 h-10 p-1 rounded border flex-shrink-0"
                                    title="Button Text Color"
                                />
                                <Input
                                    value={currentData.buttonTextColor || '#ffffff'}
                                    onChange={e => onUpdate(section.id, 'buttonTextColor', e.target.value)}
                                    placeholder="Button text color..."
                                    className="flex-1 text-sm"
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* MENU SECTION SETTINGS */}
                {sectionType === 'menu' && (
                    <>
                        {/* Menu Selection */}
                        <div>
                            <label className="text-sm font-medium text-gray-900 mb-2 block">Select Menu</label>
                            <Select
                                value={currentData.restaurantMenuId || ''}
                                onValueChange={value => onUpdate(section.id, 'restaurantMenuId', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a menu" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableMenus.map(menu => (
                                        <SelectItem key={menu.id} value={menu.id}>
                                            {menu.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Allow Ordering Toggle */}
                        <div>
                            <label className="text-sm font-medium text-gray-900 mb-2 block">Ordering</label>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Allow ordering</span>
                                <Switch
                                    checked={currentData.allowOrdering !== false}
                                    onCheckedChange={checked => onUpdate(section.id, 'allowOrdering', checked)}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

