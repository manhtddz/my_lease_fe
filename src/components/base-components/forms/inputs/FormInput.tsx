import type { ReactNode } from "react";

interface FormFieldProps {
    idlabel?: string;
    label?: string;
    error?: string | string[];
    required?: boolean;
    labelClass?: string;
    errorClass?: string;
    rootClass?: string;

    labelSlot?: ReactNode;
    errorSlot?: (error?: string | string[]) => ReactNode; // Scoped slot dạng function

    children?: ReactNode;
}

export const FormInput: React.FC<FormFieldProps> = ({
    idlabel,
    label,
    error,
    required = false,
    labelClass,
    errorClass,
    rootClass,
    labelSlot,
    errorSlot,
    children,
}) => {
    const hasError = Array.isArray(error) ? error.length > 0 : !!error;

    return (
        <div className={rootClass}>
            {(label || labelSlot) && (
                <div className="field-label">
                    {labelSlot ? (
                        labelSlot
                    ) : (
                        <label className={labelClass} htmlFor={idlabel}>
                            {label}
                            {required && <span className="required">*</span>}
                        </label>
                    )}
                </div>
            )}

            <div className="field-input">
                {children}
            </div>
            <div className="mb-3">
                {(hasError || errorSlot) && (
                    <>
                        {errorSlot ? (
                            errorSlot(error)
                        ) : Array.isArray(error) ? (
                            error.map((msg, i) => (
                                <div key={i}>
                                    <p className={errorClass}>{msg}</p>
                                </div>
                            ))
                        ) : (
                            <p className={errorClass}>{error}</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};