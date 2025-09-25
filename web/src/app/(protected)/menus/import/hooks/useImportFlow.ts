'use client'

import { useState, useCallback } from 'react'
import { ImportStep } from '../components/ImportWizard'
import {
  ParsedMenuStructure,
  EditableMenuStructure,
  EditableCategory,
  EditableMenuItem,
} from '@shared/types/menu-structure.types'

export interface ParsedMenuItem {
  id: string
  name: string
  description: string
  price: number
  confidence?: number
}

export function useImportFlow() {
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [parsedItems, setParsedItems] = useState<ParsedMenuItem[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [annotations, setAnnotations] = useState<any[]>([])

  // New state for menu structure parsing
  const [parsedStructure, setParsedStructure] = useState<ParsedMenuStructure | null>(null)
  const [editableStructure, setEditableStructure] = useState<EditableMenuStructure | null>(null)

  const resetImportFlow = useCallback(() => {
    setCurrentStep('upload')
    setImageFile(null)
    setImagePreview(null)
    setParsedItems([])
    setSelectedCategoryId('')
    setIsProcessing(false)
    setProcessingStep('')
    setErrorMessage(null)
    setShowSuccess(false)
    setAnnotations([])
    setParsedStructure(null)
    setEditableStructure(null)

    // Clean up image preview URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  return {
    currentStep,
    setCurrentStep,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    parsedItems,
    setParsedItems,
    selectedCategoryId,
    setSelectedCategoryId,
    isProcessing,
    setIsProcessing,
    processingStep,
    setProcessingStep,
    errorMessage,
    setErrorMessage,
    showSuccess,
    setShowSuccess,
    annotations,
    setAnnotations,
    parsedStructure,
    setParsedStructure,
    editableStructure,
    setEditableStructure,
    resetImportFlow,
  }
}
