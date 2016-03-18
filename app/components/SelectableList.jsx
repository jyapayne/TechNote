import React from 'react'

import List from 'material-ui/lib/lists/list'
import { SelectableContainerEnhance } from '../enhance/SelectableEnhance'

let SelectableList = SelectableContainerEnhance(List)

function wrapState(ComposedComponent) {
  const StateWrapper = React.createClass({
    getInitialState() {
      if(typeof this.props.initialIndex == 'undefined')
        return {selectedIndex: -1};
      return {selectedIndex: this.props.initialIndex};
    },
    setIndex(i, func){
      this.setState({
        selectedIndex: i,
      }, func);
    },
    handleUpdateSelectedIndex(e, index) {
      this.setIndex(index);
    },
    render() {
      return (
        <ComposedComponent
          {...this.props}
          {...this.state}
          valueLink={{value: this.state.selectedIndex, requestChange: this.handleUpdateSelectedIndex}}
        />
      );
    },
  });
  return StateWrapper;
}

export default SelectableList = wrapState(SelectableList)
