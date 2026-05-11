import { useState } from 'react'
import { BasicInput } from '../BasicInput'
import type { Props as BasicInputProps } from '../BasicInput'

type PasswordInputProps = Omit<BasicInputProps, 'type'> & {
    showPasswordToggle?: boolean
}

export function PasswordInput(props: PasswordInputProps) {
    const { showPasswordToggle = true, ...rest } = props
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="mb-3 position-relative">
            <BasicInput {...rest} className="mb-0" type={showPassword ? 'text' : 'password'} />
            {showPasswordToggle && (
                <button
                    type="button"
                    className="btn btn-link btn-sm position-absolute text-decoration-none py-0"
                    style={{ top: '2.25rem', right: 0 }}
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? 'Ẩn' : 'Hiện'}
                </button>
            )}
        </div>
    )
}
