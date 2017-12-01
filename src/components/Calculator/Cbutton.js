import React from 'react';
import PropTypes from 'prop-types'
import styles from './Cbutton.less'
import { Button } from 'antd'

class Cbutton extends React.Component {
  handleClick = () => {
    this.props.clickHandler(this.props.name);
  }

  render() {
    let className = styles.buttonWrapper

    return (
      <div
        className={className}
      >
        <Button
          onClick={this.handleClick}
        >
          {this.props.name}
        </Button>
      </div>
    );
  }
}
Button.propTypes = {
  name: React.PropTypes.string,
  clickHandler: React.PropTypes.func,
};
export default Cbutton;
