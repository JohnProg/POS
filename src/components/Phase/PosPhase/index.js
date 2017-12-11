import React, { PureComponent } from 'react';
import GoodsList from '../../List/Goods/'

export default class PosPhase extends PureComponent {
    render() {
        if (this.props.phase === 'choose') {
            return <GoodsList { ...this.props } />
        }
        if (this.props.phase === 'payment') {
            return 111
        }
        return 222
    }
}
