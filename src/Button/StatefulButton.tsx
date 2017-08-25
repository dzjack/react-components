import * as React from 'react';
import pick = require('lodash/pick');
import { props, t } from '../utils';
import Button, { ButtonProps, ButtonPropTypes } from './Button';

// const PromiseType = t.irreducible('Promise', x => x instanceof Promise);

/**
 * A generic button wrapper; it handles processing/success/failure states
 *
 * If buttonState is passed in as a prop, all internal states are overridden.
 *
 * stableSuccess should not be changed for the lifetime of the component
 *
 * Otherwise, the following happens:
 *
 *   internalState = null
 *     |
 *     ? click
 *     | --> invoke onClick and grab promise
 *     V
 *   internalState = processing
 *     |                    \
 *     ? promise success     ------? promise failure
 *     |                            \
 *     V                             V
 *   internalState = success       internalState = error
 *     |                 \                           \
 *     |                  --------                    --------------------
 *     |                          \                                       \
 *     ? stableSuccess is true     ? stableSuccess is false                |
 *     |                           |                                       |
 *     O wait for prop change      * < wait for timerMillis milliseconds > *
 *                                 |                                      /
 *                                 |              ------------------------
 *                                 |             /
 *                                 V             V
 *                               internalState = null
 *
 */

 /**
 * ready or not-allowed; use it if you want button to handle its internal state and onClick is a promise
 */

export namespace StatefulButtonProps {
  export type ButtonBaseState = 'ready' | 'success' | 'not-allowed';
};

export interface StatefulButtonRequiredProps extends ButtonProps {
  /** callback */
  onClick: (e: React.SyntheticEvent<HTMLDivElement>) => Promise<any>
  /** ready, not-allowed, success, use it if you want button to be a functional component */
  baseState?: StatefulButtonProps.ButtonBaseState
};

export interface StatefulButtonDefaultProps {
  /** keep success state  */
  stableSuccess?: boolean
  /** time in millisecons to wait before state reset  */
  timerMillis?: number
}

export type StatefulButtonProps = StatefulButtonRequiredProps & Partial<StatefulButtonDefaultProps>;

export type StatefulButtonState = {
  internalState: 'error' | 'processing' | 'success' | null
};

const defaultProps: StatefulButtonDefaultProps = {
  stableSuccess: false,
  timerMillis: 2000
}
@props({
  ...ButtonPropTypes,
  baseState: t.maybe(t.enums.of(['ready', 'success', 'not-allowed'])),
  stableSuccess: t.maybe(t.Boolean),
  timerMillis: t.maybe(t.Number)
})
export default class StatefulButton extends React.PureComponent<StatefulButtonProps, StatefulButtonState> {

  private timeoutId: number | null
  private resetInternalStateAfterProcessing: boolean
  private _isMounted: boolean

  state = {
    internalState: null
  };

  constructor(props: StatefulButtonProps) {
    super(props);
    this.timeoutId = null;
    this.resetInternalStateAfterProcessing = false;
  }

  getProps = () => {
    return { ...defaultProps, ...this.props };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  doResetInternalState = () => {
    if (this._isMounted) {
      this.setState({
        internalState: null
      });
    }
  }

  componentWillReceiveProps(props: StatefulButtonProps) {
    if (process.env.NODE_ENV !== 'production') {
      t.assert(props.stableSuccess === this.getProps().stableSuccess);
    }

    if (props.buttonState) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    }
    if (props.baseState !== this.getProps().baseState) {
      if (this.state.internalState === 'processing') {
        this.resetInternalStateAfterProcessing = true;
      } else {
        this.doResetInternalState();
      }
    }
  }

  doResetInternalStateAfterTimer = () => {
    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;
      this.doResetInternalState();
    }, this.getProps().timerMillis);
  }

  attachPromiseHandlers = (promise: Promise<void>) => {
    promise.then(() => {
      return this._isMounted && this.setState({
        internalState: 'success'
      }, () => {
        if (!this.getProps().stableSuccess) {
          this.doResetInternalStateAfterTimer();
        } else if (this.resetInternalStateAfterProcessing) {
          this.doResetInternalState();
        }
      });
    }).catch(() => {
      if (this._isMounted) {
        this.setState({
          internalState: 'error'
        }, () => this.doResetInternalStateAfterTimer() );
      }
    });
  }

  getButtonState = () => (this.props.buttonState || this.state.internalState || this.props.baseState);

  onClick = (e: React.SyntheticEvent<HTMLDivElement>) => {
    if (this.getButtonState() === 'ready') {
      this.resetInternalStateAfterProcessing = false;
      const promise = this.getProps().onClick(e);
      if (!this.getProps().buttonState) {
        this.setState({
          internalState: 'processing'
        }, () => this.attachPromiseHandlers(promise) );
      }
    }
  };

  render() {
    const buttonProps = pick(this.getProps(), Object.keys(ButtonPropTypes));

    return <Button {...buttonProps} onClick={this.onClick} buttonState={this.getButtonState()} />;
  }

}
