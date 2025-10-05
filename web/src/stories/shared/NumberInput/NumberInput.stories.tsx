
import { NumberInput } from "./NumberInput";
import { useState } from "react";

export default {
  title: 'Shared/NumberInput'
}

export const Default = () => {
    const [value, setValue] = useState(0)
  return <div className="flex flex-col gap-2">
    <NumberInput value={value} onChange={value => setValue(Number(value))} type="float" />
    <p className="text-sm text-gray-500">Value: {value}</p>
  </div>
}