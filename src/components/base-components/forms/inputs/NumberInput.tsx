import { BasicInput } from './BasicInput';
import type { Props as BasicInputProps } from './BasicInput';

type NumberInputProps = Omit<BasicInputProps, 'type'> & {
    allowNegative?: boolean;
    min?: number;
    max?: number;
};

export function NumberInput({ allowNegative = false, min, max, ...props }: NumberInputProps) {
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        console.log(val);
        
        if (typeof val === 'string' && (val === '' || isNaN(Number(val)))) {            
            props.onChange?.(e);
            return;
        }
        
        const numValue = Number(val);
        if (!isNaN(numValue)) {
            if (!allowNegative && numValue < 0) return;
            if (min !== undefined && numValue < min) return;
            if (max !== undefined && numValue > max) return;
        }

        props.onChange?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!allowNegative && e.key === '-') {
            e.preventDefault();
        }
    };

    return (
        <BasicInput
            {...props}
            type="text"
            onChange={handleNumberChange}
            onKeyDown={handleKeyDown}
        />
    );
}

