import { LabeledInput } from './LabeledInput'
import { useState } from 'react'

const meta = {
  component: LabeledInput,
  parameters: {
    layout: 'padded',
  },
}

export default meta

export const Default = () => {
  const [value, setValue] = useState('')
  return <LabeledInput label="Input" placeholder="Input" type="text" value={value} onChange={setValue} id="input" />
}

export const WithVisibleLabel = () => {
  const [value, setValue] = useState('')
  return <LabeledInput label="Email Address" placeholder="Enter your email" type="email" value={value} onChange={setValue} id="email" srOnly={false} />
}

export const NumberInput = () => {
  const [value, setValue] = useState('')
  return <LabeledInput label="Price" placeholder="0.00" type="number" value={value} onChange={setValue} id="price" srOnly={false} />
}

export const PasswordInput = () => {
  const [value, setValue] = useState('')
  return <LabeledInput label="Password" placeholder="Enter your password" type="password" value={value} onChange={setValue} id="password" srOnly={false} />
}
