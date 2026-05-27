type Props = {
    onClick: () => void
    disabled: boolean
    children: React.ReactNode
    className: string
    type?: "button" | "submit" | "reset"
}

export function BasicButton({ onClick, disabled = false, children, className, type = 'button' }: Props) {
    return (
        <button
            type={type}
            className={className}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}