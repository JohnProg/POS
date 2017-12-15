import React, { PureComponent } from 'react';
import { connect } from 'dva'
import { routerRedux, Link } from 'dva/router';
import { Tabs, Button, Badge, Row, Col, Icon, } from 'antd'
import moment from 'moment'
import styles from './Choose.less'
import GoodsList from '../../components/List/Goods/'
import ChooseCalculator from '../../components/Calculator/Choose/'
import SelectedGoods from '../../components/List/SelectedGoods/'
import Payment from './Payment'

const { TabPane } = Tabs


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
        if (activeKey === '+') {
        this.props.dispatch({type: 'commodity/clickAddButton'})
            return
        }
        if (activeKey === '-') {
            return
        }
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
        const createTabTitle = (title) => {
            if (title === '+') {
                return (
                    <div className={styles.operationButton}>
                        <Icon type='plus'/>
                    </div>
                )
            }
            if (title === '-') {
                return (
                    <div className={styles.operationButton}>
                        <Icon type="minus" onClick={this.remove.bind(this, currentIndex)} />
                    </div>
                )
            }
            if (typeof title === 'number') {
                const timeStamp = moment().format('x')
                const localTime = moment().format('HH:mm')
                const tabsBarElement = (
                    <div className={styles.tabsBarContent}>
                        <Badge count={title} overflowCount={1000} />
                        <span>{localTime}</span>
                    </div>
                )
                return tabsBarElement
            }
        }
        const leftHeader = (
                        <div className={styles.logo}>
                            <Link to="/">
                                <h1>POS</h1>
                            </Link>
                        </div>
        )
        const PosPhase = (item) => {
            switch (item.phase) {
                case 'choose':
                    return <GoodsList content={item.content} dispatch={this.props.dispatch} />
                case 'payment':
                    return <Payment />
                default:
                    return
            }
        }
        return (
            <div
                className={styles.tabsWrapper}
            >
                <Tabs
                    hideAdd
                    tabBarExtraContent={leftHeader}
                    onChange={this.onChange}
                    activeKey={activeKey}
                    type="card"
                    onEdit={this.onEdit}
                >
                    {
                        orders.map(orderItem => (
                        <TabPane tab={createTabTitle(orderItem.title)} key={orderItem.key}>
                                <div className={styles.tabContent}>
                            {
                                PosPhase(orderItem)
                            }
                                </div>
                        </TabPane>
                    ))
                    }
                </Tabs>
            </div>
        );
    }
}
