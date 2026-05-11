type Props = {
    disabled?: boolean
    options: {
        value: string
        label: string
        selfDisabled?: boolean
    }[]
    className?: string
    label?: string
    name?: string
    value?: string | number
    onChange: (value: string | number) => void
    validationErrors?: Record<string, string[]>
    showError?: boolean
}

export function Radio({
    disabled = false,
    options = [],
    label = '',
    className = 'mb-3',
    name = '',
    value = '',
    validationErrors = {},
    showError = false,
    onChange,
}: Props) {
    const errorMessage = name ? validationErrors?.[name]?.[0] : null

    return (
        <div className={className}>
            {label ? (
                <label className="form-label" htmlFor={name}>
                    {label}
                </label>
            ) : null}
            {options.map((opt) => {
                const inputId = `${name}-${opt.value}`.replace(/\s+/g, '-')
                return (
                    <div key={String(opt.value)} className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name={name}
                            id={inputId}
                            value={opt.value}
                            checked={value == opt.value}
                            disabled={disabled || opt.selfDisabled}
                            onChange={() => onChange(opt.value)}
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
