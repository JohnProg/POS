import React, { PureComponent } from 'react';
import { connect } from 'dva'
import { Tabs, Button, Badge, Row, Col } from 'antd'
import moment from 'moment'
import styles from './Choose.less'
import GoodsList from '../../components/List/Goods/'

const { TabPane  } = Tabs

@connect(state => ({
    commodity: state.commodity,
}))

export default class Choose extends PureComponent {
    componentDidMount() {
        if (this.props.commodity.orders.length === 0) {
            this.props.dispatch({type: 'commodity/clickAddButton'})
        }

    }
    onChange = (activeKey) => {
        this.props.dispatch({type: 'commodity/changeTab', payload: activeKey})
    }
    add = () => {
        this.props.dispatch({type: 'commodity/clickAddButton'})
    }
    remove = (currentIndex) => {
        this.props.dispatch({type: 'commodity/clickRemoveButton', payload: currentIndex})
    }
    render() {
        const { orders, activeKey } = this.props.commodity || {}
        const currentIndex = orders.findIndex(item => item.key === activeKey)
        const extraAddButton = (
            <div style={{ marginBottom: 16 }}>
                <Button onClick={this.add}>+</Button>
                <Button onClick={this.remove.bind(this, currentIndex)}>-</Button>
            </div>
        )
        return (
            <div
                className={styles.tabsWrapper}
            >
                <Tabs
                    hideAdd
                    tabBarExtraContent={extraAddButton}
                    onChange={this.onChange}
                    activeKey={activeKey}
                    type="card"
                    onEdit={this.onEdit}
                >
                    {
                        orders.map(orderItem => (
                        <TabPane tab={orderItem.title} key={orderItem.key}>
                            <GoodsList
                                content={orderItem.content}
                                dispatch={this.props.dispatch}
                            />
                        </TabPane>
                    ))
                    }
                </Tabs>
            </div>
        );
    }
}
