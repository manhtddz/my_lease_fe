import type { PageLoadStatusType } from '../../types/enums/PageLoadStatus'

type Props = {
  effectivePage: number
  pageCount: number
  status: PageLoadStatusType
  showLoadingPlaceholder: boolean
  setPageIndex: (page: number) => void
}

export function BasicPaginator({
  effectivePage,
  pageCount,
  status,
  showLoadingPlaceholder,
  setPageIndex,
}: Props) {
  const loading = status === 'loading'

  return (
    <div className="d-flex align-items-center justify-content-end gap-2 gap-md-3 mt-3 small text-body-secondary">
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        disabled={
          effectivePage <= 0 || loading || showLoadingPlaceholder
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
        className="btn btn-outline-secondary btn-sm"
        disabled={
          effectivePage >= pageCount - 1 ||
          loading ||
          showLoadingPlaceholder
        }
        onClick={() => setPageIndex(effectivePage + 1)}
      >
        Sau
      </button>
    </div>
  )
}
