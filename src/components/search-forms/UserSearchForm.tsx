type Props = {
  onSearch: (e: React.FormEvent<HTMLFormElement>) => void
}

export function UserSearchForm({ onSearch }: Props) {
  return (
    <form className="row g-2 align-items-end mb-4" onSubmit={onSearch}>
      <div className="col-md-4">
        <label className="form-label small mb-1" htmlFor="search-name">
          Tên
        </label>
        <input
          id="search-name"
          name="name"
          className="form-control form-control-sm"
          placeholder="Nhập tên..."
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
        />
      </div>
      <div className="col-md-auto">
        <button type="submit" className="btn btn-outline-primary btn-sm">
          Tìm kiếm
        </button>
      </div>
    </form>
  )
}
