import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PageTemplateSelector } from './PageTemplateSelector'
import { PAGE_TEMPLATES } from '@shared/consts/pageTemplates'

const meta = {
  component: PageTemplateSelector,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onSelectTemplate: { action: 'selectTemplate' },
    onCreatePage: { action: 'createPage' },
  },
} satisfies Meta<typeof PageTemplateSelector>

export default meta

type Story = StoryObj<typeof PageTemplateSelector>

/**
 * Default state with all templates available
 */
export const Default: Story = {
  args: {
    templates: PAGE_TEMPLATES,
  },
}

/**
 * With a template selected
 */
export const WithSelection: Story = {
  args: {
    templates: PAGE_TEMPLATES,
    selectedTemplateId: 'frontpage',
  },
}

/**
 * Menu template selected
 */
export const MenuTemplateSelected: Story = {
  args: {
    templates: PAGE_TEMPLATES,
    selectedTemplateId: 'menu',
  },
}

/**
 * About template selected
 */
export const AboutTemplateSelected: Story = {
  args: {
    templates: PAGE_TEMPLATES,
    selectedTemplateId: 'about',
  },
}

/**
 * Without create button
 */
export const WithoutCreateButton: Story = {
  args: {
    templates: PAGE_TEMPLATES,
    selectedTemplateId: 'frontpage',
    showCreateButton: false,
  },
}
