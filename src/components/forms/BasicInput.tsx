export type Props = {
  disabled?: boolean
  className?: string
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
  label?: string
  showError?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function BasicInput({
  disabled = false,
  className = 'mb-3',
  id = '',
  name = '',
  autoComplete = 'off',
  required = false,
  value = '',
  onChange = () => {},
  placeholder = '',
  type = 'text',
  minLength,
  maxLength,
  validationErrors = {},
  label = '',
  showError = true,
  onKeyDown = () => {},
}: Props) {
  const errorMessage = name ? validationErrors?.[name]?.[0] : null
  const invalid = Boolean(showError && errorMessage)

  return (
    <div className={className}>
      {label ? (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      ) : null}
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
        className={`form-control${invalid ? ' is-invalid' : ''}`}
      />
      {showError && errorMessage ? (
        <div className="invalid-feedback d-block">{errorMessage}</div>
      ) : null}
    </div>
  )
}
