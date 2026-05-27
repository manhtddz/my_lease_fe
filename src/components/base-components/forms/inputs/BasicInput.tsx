export type Props = {
  disabled?: boolean
  className?: string
  inputClassName?: string
  id?: string
  name?: string
  autoComplete?: string
  required?: boolean
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  minLength?: number
  maxLength?: number
  validationErrors?: Record<string, string[]>
  showError?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function BasicInput({
  disabled = false,
  className = '',
  inputClassName = '',
  id = '',
  name = '',
  autoComplete = 'off',
  required = false,
  value = '',
  onChange = () => { },
  placeholder = '',
  type = 'text',
  minLength,
  maxLength,
  onKeyDown = () => { },
}: Props) {

  return (
    <div className={className}>
      <input
        id={id}
        name={name}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        minLength={minLength}
        maxLength={maxLength}
        onKeyDown={onKeyDown}
        className={`form-control${inputClassName ? ` ${inputClassName}` : ''}`}
      />
    </div>
  )
}
