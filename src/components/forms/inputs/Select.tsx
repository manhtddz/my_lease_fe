import { useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { removeAccents } from "../../../utils/simulator";

type Props = {
  options: { value: string | number; label: string }[];
  placeholder?: string;
  onChange?: (value) => void;
  className?: string;
  label?: string;
  name?: string;
  value?: string | number;
  validationErrors?: Record<string, string[]>;
  showError?: boolean;
  isSearch?: boolean;
};
const ITEM_HEIGHT = 32;
const MAX_HEIGHT = ITEM_HEIGHT * 7;

export function Select(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedOption = props.options.find(
    (opt) => opt.value === props.value
  );

  const errorMessage = props.name ? props.validationErrors?.[props.name]?.[0] : null;

  const handleSelect = (value: string | number) => {
    const newValue = selectedOption?.value === value ? '' : value;
    setIsOpen(false);
    props.onChange(newValue);
  };

  const filteredOptions = useMemo(() => {
    const searchSafe = removeAccents(searchTerm);
    if (!searchSafe) return props.options;

    return props.options.filter((opt) => {
      const labelSafe = removeAccents(opt.label);

      const isMatch = labelSafe.toLowerCase().includes(searchSafe.toLowerCase());
      return isMatch;
    });
  }, [searchTerm, props.options]);

  const dynamicHeight = Math.min(filteredOptions.length * ITEM_HEIGHT, MAX_HEIGHT);

  return (
    <div className="custom-select-container w-100 mb-3">
      {props.label && <label className="form-label">{props.label}</label>}

      <div className="position-relative">
        <div
          className={`form-select custom-select-trigger d-flex justify-content-between align-items-center ${props.showError && errorMessage ? "border-danger" : ""}`}
          style={{ cursor: 'pointer', zIndex: 1001, paddingRight: '16px' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`text-truncate ${!selectedOption ? 'text-muted' : ''}`}>
            {selectedOption ? selectedOption.label : props.placeholder}
          </span>

          {/* SVG Mũi tên có hiệu ứng xoay */}
          <svg
            width="12" height="12" fill="currentColor" viewBox="0 0 16 16"
            style={{
              transition: 'transform 0.2s',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              color: '#6c757d'
            }}
          >
            <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
          </svg>
        </div>

        {isOpen && (
          <div className="dropdown-menu custom-dropdown-menu w-100 shadow border-0 shadow-sm show"
            style={{ position: 'absolute', zIndex: 1050, marginTop: 0 }}>

            {/* Chỉ hiển thị ô search nếu isSearch={true} */}
            {props.isSearch && (
              <div className="p-2 border-bottom">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
            )}

            <Virtuoso
              style={{ height: `${dynamicHeight}px` }}
              data={filteredOptions}
              itemContent={(_, option) => (
                <div
                  onClick={() => handleSelect(option.value)}
                  className={`dropdown-item custom-dropdown-item ${selectedOption?.value === option.value ? 'active' : ''}`}
                  style={{ cursor: 'pointer', height: `${ITEM_HEIGHT}px` }}
                >
                  {option.label}
                </div>
              )}
            />
            {props.options.length === 0 && (
              <div className="p-3 text-center text-muted small">Không có dữ liệu</div>
            )}
          </div>
        )}
      </div>

      {props.showError && errorMessage ? (
        <div className="invalid-feedback d-block">{errorMessage}</div>
      ) : null}
    </div>
  );
}