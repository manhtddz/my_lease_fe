import { useMemo, useState } from "react";
import type { RoomSearchForm } from "../../types/RoomType";
import { useTranslation } from "react-i18next";
import { GroupCheckboxes } from "../forms/inputs/GroupCheckboxes";
import { RoomTypeEnum } from "../../types/enums/rooms/RoomType";
import { RoomStatusEnum } from "../../types/enums/rooms/RoomStatus";

type Props = {
  onSearch: (searchForm: RoomSearchForm) => void;
};

const INITIAL_FORM: RoomSearchForm = {
  room_number: "",
  room_type: [],
  status: [],
};

export function RoomSearchForm({ onSearch }: Props) {
  const { t } = useTranslation();

  const [searchForm, setSearchForm] = useState<RoomSearchForm>(INITIAL_FORM);
  const roomTypeOptions = useMemo(() => {
    return Object.entries(RoomTypeEnum).map(([key, value]) => ({
      value: key,
      label: t(value),
    }));
  }, [t]);

  const roomStatusOptions = useMemo(() => {
    return Object.entries(RoomStatusEnum).map(([key, value]) => ({
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
          {t('models.room.room_number')}
        </label>
        <input
          id="search-room_number"
          name="room_number"
          className="form-control form-control-sm"
          placeholder="Nhập tên..."
          value={searchForm.room_number}
          onChange={(e) =>
            setSearchForm((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </div>
      <div className="d-flex align-items-center gap-3 flex-wrap">
        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          <span className="text-nowrap fw-medium text-secondary small">
            {t('models.room.status')}
          </span>
          <GroupCheckboxes
            className="btn-group flex-wrap"
            options={roomStatusOptions}
            selectedValues={searchForm.status}
            onChange={(values: string[]) =>
              setSearchForm((prev) => ({ ...prev, status: values }))
            }
            name="status"
          />
        </div>

        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          <span className="text-nowrap fw-medium text-secondary small">
            {t('models.room.room_type')}
          </span>
          <GroupCheckboxes
            className="btn-group flex-wrap"
            options={roomTypeOptions}
            selectedValues={searchForm.room_type}
            onChange={(values: string[]) =>
              setSearchForm((prev) => ({ ...prev, room_type: values }))
            }
            name="room_type"
          />
        </div>
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