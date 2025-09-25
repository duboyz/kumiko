import { StoryObj } from '@storybook/nextjs-vite'
import { UpsertMenu } from './UpsertMenu'

const meta = {
  component: UpsertMenu,
  parameters: {
    layout: 'padded',
  },
}

export default meta

export const Default: StoryObj<typeof meta> = {
  args: {},
}
