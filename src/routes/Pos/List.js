import React, { PureComponent } from 'react';
import CardItem from './CardItem'
import styles from './List.less'


export default class GoodsList extends PureComponent {
    render() {
        const { content, dispatch } = this.props
        return (
            <div>
                {
                    Array.isArray(content) && content.map(item => <CardItem item={item} key={item.Key} dispatch={dispatch} />)
                }
            </div>
        )
    }
}
