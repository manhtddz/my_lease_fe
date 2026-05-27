import type { Props as BasicInputProps } from '../inputs/BasicInput'
import { BasicInput } from '../inputs/BasicInput'

export function SearchInput(props: BasicInputProps) {
  const { className = '', ...rest } = props
  return (
    <div className="mb-0">
      <BasicInput {...rest} type="search" className={className.trim() || 'mb-3'} />
    </div>
  )
}
