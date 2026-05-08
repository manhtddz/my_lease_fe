type Props = {
    onClick: () => void
    disabled: boolean
    children: React.ReactNode
    className: string
}

export function BasicButton({ onClick, disabled, children, className }: Props) {
    return (
        <button
            type="button"
            className={className}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}