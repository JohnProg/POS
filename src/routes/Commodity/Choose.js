import React, { PureComponent } from 'react';
import { connect } from 'dva'
import { Tabs, Button, Badge, Row, Col } from 'antd'
import moment from 'moment'
import styles from './Choose.less'
import CommodityList from '../../components/CommodityList/'

const { TabPane  } = Tabs

@connect(state => ({
    commodity: state.commodity,
}))

export default class Choose extends PureComponent {
    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        const panes = []
        this.state = {
            activeKey: null,
            panes,
        };
    }

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
    remove = () => {
        this.props.dispatch({type: 'commodity/removeTab'})
    }
    render() {
        const { orders, activeKey } = this.props.commodity || {}
        const extraAddButton = (
            <div style={{ marginBottom: 16 }}>
                <Button onClick={this.add}>+</Button>
                <Button onClick={this.remove}>-</Button>
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
                            <CommodityList
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
