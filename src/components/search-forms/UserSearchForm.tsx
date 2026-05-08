export function UserSearchForm({ onSearch }) {
    return (
        <form onSubmit={onSearch}>
            <div className="filters">
                <label>
                    Search name
                    <input
                        name="name"
                        placeholder="Nhập tên..."
                    />
                </label>
                <label>
                    Search email
                    <input
                        name="email"
                        placeholder="Nhập email..."
                    />
                </label>
                <button type="submit">Search</button>
            </div>
        </form>
    )
}