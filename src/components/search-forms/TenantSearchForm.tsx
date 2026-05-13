import { useState } from "react";
import type { TenantSearchForm } from "../../types/TenantType";
import { useTranslation } from "react-i18next";

type Props = {
  onSearch: (searchForm: TenantSearchForm) => void;
};

const INITIAL_FORM: TenantSearchForm = {
  name: "",
  phone_number: "",
};

export function TenantSearchForm({ onSearch }: Props) {
  const { t } = useTranslation();
  const [searchForm, setSearchForm] = useState<TenantSearchForm>(INITIAL_FORM);

  const handleSubmit = () => {
    onSearch(searchForm);
  };

  const handleReset = () => {
    setSearchForm(INITIAL_FORM);
    onSearch(INITIAL_FORM);
  };

  return (
    <div className="row g-2 align-items-end mb-4">
      <div className="col-md-4">
        <label className="form-label small mb-1" htmlFor="search-name">
          {t('models.tenant.name')}
        </label>
        <input
          id="search-name"
          name="name"
          className="form-control form-control-sm"
          placeholder="Nhập tên..."
          value={searchForm.name}
          onChange={(e) =>
            setSearchForm((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </div>

      <div className="col-md-4">
        <label className="form-label small mb-1" htmlFor="search-phone_number">
          {t('models.tenant.phone_number')}
        </label>
        <input
          id="search-phone_number"
          name="phone_number"
          className="form-control form-control-sm"
          placeholder="Nhập số điện thoại..."
          value={searchForm.phone_number}
          onChange={(e) =>
            setSearchForm((prev) => ({ ...prev, phone_number: e.target.value }))
          }
        />
      </div>

      <div className="col-md-auto d-flex gap-2">
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleSubmit}>
          {t('btn.search')}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={handleReset}
        >
          {t('btn.reset')}
        </button>
      </div>
    </div>
  );
}