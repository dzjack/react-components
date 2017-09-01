import * as React from 'react';
import * as cx from '../utils/classnames';
import { props, t, ReactChildren, stateClassUtil } from '../utils';
import FormattedText from '../FormattedText/FormattedText';
import Popover from '../Popover/Popover';
import { ObjectOverwrite } from 'typelevel-ts';

import { PopoverProps } from '../Popover/Popover';

export namespace TooltipProps {
  type Type = 'light' | 'dark';
  type Size = 'small' | 'big';
}

export type TooltipProps = {
  /** the element over which the tooltip is shown */
  children: any, // TODO: t.ReactChildren
  /** popover props */
  popover: ObjectOverwrite<PopoverProps.Popover, {
    children?: undefined,
    content: string,
    event?: undefined
  }>,
  /** type - light | dark */
  type?: TooltipProps.Type,
  /** size - small | big */
  size?: TooltipProps.Size,
  /** add class name */
  className?: string,
  /** add id */
  id?: string,
  /** add custom css style */
  style?: React.CSSProperties
}


export const Props = {
  children: ReactChildren,
  popover: t.refinement(t.Object, p => t.String.is(p.content) && t.Nil.is(p.event)),
  type: t.enums.of(['light', 'dark']),
  size: t.enums.of(['small', 'big']),
  className: t.maybe(t.String),
  id: t.maybe(t.String),
  style: t.maybe(t.Object)
};

@props(Props)
export default class Tooltip extends React.PureComponent<TooltipProps> {

  static defaultProps = {
    type: 'dark',
    size: 'small'
  }

  getLocals() {
    const { children, type, size, ...props } = this.props;
    const popover = {
      ...props.popover,
      content: <FormattedText>{props.popover.content}</FormattedText>,
      event: 'hover',
      className: cx('tooltip', stateClassUtil([type, size]), props.popover.className)
    };
    return {
      children,
      type, size,
      popoverProps: { ...props, popover }
    };
  }

  template({ popoverProps, children }) {
    return (
      <Popover {...popoverProps}>
        {children}
      </Popover>
    );
  }

}
