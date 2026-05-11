type Props = {
  disabled?: boolean
  options: {
    value: string | number
    label: string
    selfDisabled?: boolean
  }[]
  selectedValues: (string | number)[]
  className?: string
  name?: string
  validationErrors?: Record<string, string[]>
  label?: string
  showError?: boolean
  onChange: (value: (string | number)[]) => void
}

export function GroupCheckboxes({
  disabled = false,
  options = [],
  selectedValues = [],
  className = 'mb-3',
  name = '',
  validationErrors = {},
  showError = false,
  onChange,
}: Props) {
  const errorMessage = name ? validationErrors?.[name]?.[0] : null

  const handleCheckboxChange = (targetValue: string | number) => {
    const isChecked = selectedValues.includes(targetValue)
    const newValue = isChecked
      ? selectedValues.filter((v) => v !== targetValue)
      : [...selectedValues, targetValue]
    onChange(newValue)
  }

  return (
    <div className={className}>
      {options.map((opt) => {
        const inputId = `${name}-cb-${opt.value}`.replace(/\s+/g, '-')
        return (
          <div key={String(opt.value)} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={inputId}
              name={name}
              value={String(opt.value)}
              checked={selectedValues.includes(opt.value)}
              onChange={() => handleCheckboxChange(opt.value)}
              disabled={disabled || opt.selfDisabled}
            />
            <label className="form-check-label" htmlFor={inputId}>
              {opt.label}
            </label>
          </div>
        )
      })}
      {showError && errorMessage ? (
        <div className="invalid-feedback d-block">{errorMessage}</div>
      ) : null}
    </div>
  )
}
