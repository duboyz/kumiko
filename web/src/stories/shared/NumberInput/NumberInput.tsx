import { Input } from "@/components/ui/input"
import { ChangeEvent, useState, useEffect } from "react"

interface NumberInputProps {
    value: number
    onChange: (value: string | ChangeEvent<HTMLInputElement>) => void
    type: "integer" | "float"
}

export const NumberInput = ({ value, onChange, type, ...props }: NumberInputProps & React.InputHTMLAttributes<HTMLInputElement>) => {
    const [inputValue, setInputValue] = useState(value.toString())

    useEffect(() => {
        setInputValue(value.toString())
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value

        if (type === "float") {
            const normalized = newValue.replace(',', '.')

            if (newValue === '' || newValue === '-' || /^-?\d*[.,]?\d*$/.test(newValue)) {
                if (newValue.startsWith('0') && newValue.length > 1 && !newValue.startsWith('0.')) {
                    newValue = newValue.replace(/^0+/, '') || '0'
                    setInputValue(newValue)
                    onChange(newValue.replace(',', '.'))
                } else {
                    setInputValue(newValue)
                    onChange(normalized)
                }
            }
        } else {
            if (newValue === '' || newValue === '-' || /^-?\d*$/.test(newValue)) {

                if (newValue.startsWith('0') && newValue.length > 1) {
                    newValue = newValue.replace(/^0+/, '') || '0'
                    setInputValue(newValue)
                    onChange(newValue)
                } else {
                    setInputValue(newValue)
                    onChange(newValue)
                }
            }
        }
    }

    const handleBlur = () => {
        if (inputValue === '' || inputValue === '-') {
            setInputValue('0')
            onChange('0')
        }
    }

    return (
        <Input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            {...props}
        />
    )
}