import { BasicInput } from '../BasicInput';
import type { Props as BasicInputProps } from '../BasicInput';

type NumberInputProps = Omit<BasicInputProps, 'type'> & {
    allowNegative?: boolean;
    min?: number;
    max?: number;
};

export function NumberInput({ allowNegative = false, min, max, ...props }: NumberInputProps) {
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        console.log(val);
        if (!allowNegative && Number(val) < 0) {
            return;
        }
        if (min && Number(val) < min) {
            return;
        }
        if (max && Number(val) > max) {
            return;
        }

        props.onChange?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!allowNegative && (e.key === '-' || e.key === 'e' || e.key === 'E')) {
            e.preventDefault();
        }
    };

    return (
        <BasicInput
            {...props}
            type="number"
            onChange={handleNumberChange}
            onKeyDown={handleKeyDown}
        />
    );
}

