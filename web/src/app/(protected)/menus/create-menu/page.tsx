'use client'

import { ContentContainer } from '@/components/ContentContainer'
import { UpsertMenu } from '@/stories/RestaurantMenu/UpsertMenu/UpsertMenu'
import { useState } from 'react'

export default function CreateMenuPage() {
  const [menuName, setMenuName] = useState('Create Menu')
  const [categories, setCategories] = useState([])

  return (
    <ContentContainer>
      <UpsertMenu
        menuName={menuName}
        setMenuName={setMenuName}
        categories={[]}
        onCategoryAdd={() => {}}
        onCategoryDelete={() => {}}
        onCategoryNameChange={() => {}}
        onItemAdd={() => {}}
        onItemUpdate={() => {}}
        onItemDelete={() => {}}
      />
    </ContentContainer>
  )
}
