import { useMemo, useState } from "react";
import { GroupCheckboxes } from "../base-components/forms/inputs/GroupCheckboxes";
import { UserStatusEnum } from "../../types/enums/users/UserStatus";
import { useTranslation } from "react-i18next";
import type { UserSearchForm } from "../../types/UserType";

type Props = {
  onSearch: (searchForm: UserSearchForm) => void;
};

const INITIAL_FORM: UserSearchForm = {
  name: "",
  email: "",
  status: [],
};

export function UserSearchForm({ onSearch }: Props) {
  const { t } = useTranslation();
  const [searchForm, setSearchForm] = useState<UserSearchForm>(INITIAL_FORM);

  const statusOptions = useMemo(() => {
    return Object.entries(UserStatusEnum).map(([key, value]) => ({
      value: key,
      label: t(value),
    }));
  }, [t]);

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
          Tên
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
        <label className="form-label small mb-1" htmlFor="search-email">
          Email
        </label>
        <input
          id="search-email"
          name="email"
          className="form-control form-control-sm"
          placeholder="Nhập email..."
          value={searchForm.email}
          onChange={(e) =>
            setSearchForm((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </div>

      <GroupCheckboxes
        options={statusOptions}
        selectedValues={searchForm.status}
        onChange={(values: string[]) =>
          setSearchForm((prev) => ({ ...prev, status: values }))
        }
        name="status"
        label="Trạng thái"
      />

      <div className="col-md-auto d-flex gap-2">
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleSubmit}>
          Tìm kiếm
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={handleReset}
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
}