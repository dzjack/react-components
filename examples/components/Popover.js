import React from 'react';
import { Popover } from '../../src';


const Example = React.createClass({

  propTypes: {},

  getInitialState() {
    return {
      isOpen: false
    };
  },

  toggle() {
    this.setState({isOpen: !this.state.isOpen});
  },

  getTemplate() {
    const content = (
      <div style={{backgroundColor: 'yellow', width: 200}}>
        <div>
          Popover Title
        </div>
        <div>
          <p>SONO</p>
          <p>UN</p>
          <p>POPOVER</p>
        </div>
      </div>
    );
    return (
      <div>
        <div style={{marginTop: 200, marginLeft: 130}}>
          <Popover popover={{content, position: 'bottom', anchor: 'left', attachToBody: true, event: 'click'}}>
            <button ref='target' onClick={this.toggle} style={{backgroundColor: 'green', display: 'inline-block'}}>
              ABSOLUTE
            </button>
          </Popover>
        </div>
        <div style={{marginTop: 200, marginLeft: 130}}>
          <Popover popover={{content, position: 'top', anchor: 'right'}}>
            <button ref='target' onClick={this.toggle} style={{backgroundColor: 'green', display: 'inline-block'}}>
              RELATIVE
            </button>
          </Popover>
        </div>
      </div>
    );
  },

  render() {
    return this.getTemplate();
  }

});

export default Example;
