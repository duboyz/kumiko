import './LabeledInput.css'
interface LabeledInputProps {
  label: string
  placeholder: string
  type: 'text' | 'number' | 'email' | 'password'
  value: string
  onChange: (value: string) => void
  id: string
  className?: string
  srOnly?: boolean
}
export const LabeledInput = ({
  label,
  placeholder,
  type,
  value,
  onChange,
  id,
  className,
  srOnly = true,
}: LabeledInputProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {srOnly ? (
        <label className="sr-only" htmlFor={id}>
          {label}
        </label>
      ) : (
        <label className="uppercase text-xs text-gray-500" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className={`labled-input border-b border-gray-200 rounded-none px-0 py-3 placeholder:text-gray-300 text-foreground`}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
