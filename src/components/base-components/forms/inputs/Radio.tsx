type Props = {
    disabled?: boolean
    options: {
        value: string
        label: string
        selfDisabled?: boolean
    }[]
    className?: string
    name?: string
    value?: string | number
    onChange: (value: string | number) => void
}

export function Radio({
    disabled = false,
    options = [],
    className = 'mb-3',
    name = '',
    value = '',
    onChange,
}: Props) {
    return (
        <div className={className}>
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
        </div>
    )
}
