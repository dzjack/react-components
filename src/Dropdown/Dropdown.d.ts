import { CSSProperties, PureComponent, SyntheticEvent, FocusEventHandler } from 'react'
import * as t from 'tcomb';
import { Option, MenuRendererProps } from 'react-select';

type Value = number | string | Option | Option[];

interface DropdownMenuRendererProps extends MenuRendererProps {
  instancePrefix: string,
  onFocus: FocusEventHandler<HTMLDivElement>,
  onSelect: (option: Option, e: SyntheticEvent<HTMLDivElement>) => void,
  groupByKey?: string,
  optionClassName: string,
  optionComponent: JSX.Element,
  optionRenderer: (option: Option, i: number) => React.ReactNode,
  optionGroupRenderer: (title: string) => React.ReactNode
  valueKey: any
}

export type DropdownProps = {
  value?: Value,
  valueLink?: {
    value?: Value,
    requestChange: (value: Value) => void
  },
  onChange?: (value?: Value) => void,
  onValueClick?: (value: string, event: SyntheticEvent<HTMLDivElement>) => void,
  options: Option[],
  size?: 'small' | 'medium',
  disabled?: boolean,
  searchable?: boolean,
  clearable?: boolean,
  backspaceRemoves?: boolean,
  multi?: boolean,
  flat?: boolean,
  autoBlur?: boolean,
  simpleValue?: boolean,
  menuPosition?: 'top' | 'bottom',
  menuRenderer?: (menuItem: DropdownMenuRendererProps) => React.ReactElement<any>, // TODO: t.ReactChildren
  groupByKey?: string,
  optionGroupRenderer?: DropdownMenuRendererProps['optionGroupRenderer'],
  placeholder?: string | React.ReactElement<any>, // TODO: t.maybe(t.union([t.String, t.ReactElement]))
  noResultsText?: string,
  allowCreate?: boolean,
  addLabelText?: string,
  valueRenderer?: (option: Option) => JSX.Element, // TODO: t.ReactChildren
  optionRenderer?: DropdownMenuRendererProps['optionRenderer'],
  delimiter?: string,
  onInputChange?: (inputValue: string) => void,
  onFocus?: FocusEventHandler<HTMLDivElement>,
  onBlur?: FocusEventHandler<HTMLDivElement>,
  onBlurResetsInput?: boolean,
  onCloseResetsInput?: boolean,
  isLoading?: boolean,
  id?: string,
  className?: string,
  style?: CSSProperties
}

export default class Dropdown extends PureComponent<DropdownProps> {}

export var Props: {
  [key: string]: t.Type<any>
};

