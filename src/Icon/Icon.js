import React from 'react';
import range from 'lodash/utility/range';
import { pure, skinnable, props, t } from '../utils';
import cx from 'classnames';

const PositiveInteger = t.refinement(t.Number, x => x % 1 === 0 && x > 0, 'PositiveInteger');

@pure
@skinnable()
@props({
  icon: t.maybe(t.Str),
  className: t.maybe(t.Str),
  style: t.maybe(t.Obj),
  paths: t.maybe(PositiveInteger),
  onClick: t.maybe(t.Func)
})
export default class Icon extends React.Component {

  static defaultProps = {
    paths: 1,
    onClick: () => {}
  };

  getLocals() {
    return {
      ...this.props
    };
  }

  template({ icon, className, style, onClick, paths }) {
    return icon ? (
      <i className={cx('icon', `icon-${icon}`, className)} style={style} onClick={onClick}>
        {paths > 1 && range(paths).map(k => <span className={`path${k + 1}`} /> )}
      </i>
    )
    : null;
  }

}
