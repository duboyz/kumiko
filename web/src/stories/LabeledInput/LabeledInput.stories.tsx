import { LabeledInput } from './LabeledInput'
import { useState } from 'react'

export default {
  component: LabeledInput,
}

export const Text = () => {
  const [value, setValue] = useState('')
  return <LabeledInput label="Input" placeholder="Input" type="text" value={value} onChange={setValue} id="input" />
}
