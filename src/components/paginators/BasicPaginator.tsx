export function BasicPaginator({ effectivePage, pageCount, status, showLoadingPlaceholder, setPageIndex }) {
    return (
        <div className="app-pagination">
            <button
                type="button"
                className="app-btn"
                disabled={
                    effectivePage <= 0 ||
                    status === 'loading' ||
                    showLoadingPlaceholder
                }
                onClick={() => setPageIndex(effectivePage - 1)}
            >
                Trước
            </button>
            <span>
                Trang {effectivePage + 1} / {pageCount}
            </span>
            <button
                type="button"
                className="app-btn"
                disabled={
                    effectivePage >= pageCount - 1 ||
                    status === 'loading' ||
                    showLoadingPlaceholder
                }
                onClick={() => setPageIndex(effectivePage + 1)}
            >
                Sau
            </button>
        </div >
    )
}