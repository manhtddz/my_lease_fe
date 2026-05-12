type Props = {
  disabled?: boolean
  value: boolean
  className?: string
  name?: string
  validationErrors?: Record<string, string[]>
  label?: string
  optionLabel?: string
  showError?: boolean
  onChange: (value: boolean) => void
}

export function Checkbox({
  disabled = false,
  value = false,
  label = '',
  optionLabel = '',
  className = 'mb-3',
  name = '',
  validationErrors = {},
  showError = false,
  onChange,
}: Props) {
  const errorMessage = name ? validationErrors?.[name]?.[0] : null
  const isSwitch = className.includes('form-switch')
  const handleCheckboxChange = (value: boolean) => {
    onChange(value)
  }

  return (
    <div className={className}>
      {label ? (
        <label className="form-label" htmlFor={name}>
          {label}
        </label>
      ) : null}
      <div className={`form-check${isSwitch ? ' form-switch' : ''}`}>
        <input
          type="checkbox"
          className="form-check-input"
          id={name}
          name={name}
          checked={value}
          onChange={(e) => handleCheckboxChange(e.target.checked)}
          disabled={disabled}
          role={isSwitch ? 'switch' : undefined}
        />
        <label className="form-check-label" htmlFor={name}>
          {optionLabel}
        </label>
      </div>

      {showError && errorMessage ? (
        <div className="invalid-feedback d-block">{errorMessage}</div>
      ) : null}
    </div>
  )
}
