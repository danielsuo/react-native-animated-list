/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  LayoutAnimation
} from 'react-native';
import Animation, {
  Enter, Leave, Reset
} from './animations';

export default class DynamicListRow extends Component {
  constructor(props){
    super(props);
    this.state = {
      x: null,
      y: null,
      width: null,
      height: null
    };
    this._transitionTime = this.props.time || 200;
    this._measureView = this._measureView.bind(this);
  }
  componentWillMount(){
    this._controlVar = new Animated.Value(0);
  }

  componentWillUpdate(){
    LayoutAnimation.spring();
  }

  componentDidMount() {
    Enter(this._controlVar, this._transitionTime).start();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.remove) {
      this.onRemoving(nextProps.onRemoving);
    }
    else {
      this._reset();
    }
  }

  onRemoving(callback) {
    Leave(this._controlVar, this._transitionTime).start(callback);
  }

  _measureView(event) {
    this.setState({
            x: event.nativeEvent.layout.x,
            y: event.nativeEvent.layout.y,
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height
        });
  }

  _reset() {
    Reset(this._controlVar);
  }

  render() {

    const {width, height, x, y} = this.state;

    const animationFuncParams = {controlVar: this._controlVar, width, height, x, y};
    let rowAnimation = Animation(this.props.animation, animationFuncParams);
    if(this.props.animationFunc) {
      rowAnimation = this.props.animationFunc(animationFuncParams);
    }


      return (
          <Animated.View
              onLayout={(event) => this._measureView(event)}
              style={rowAnimation}>
                {this.props.children}
          </Animated.View>
      );
  }
}