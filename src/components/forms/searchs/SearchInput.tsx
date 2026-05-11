import type { Props as BasicInputProps } from '../BasicInput'
import { BasicInput } from '../BasicInput'

export function SearchInput(props: BasicInputProps) {
  const { className = '', ...rest } = props
  return (
    <div className="mb-0">
      <BasicInput {...rest} type="search" className={className.trim() || 'mb-3'} />
    </div>
  )
}
