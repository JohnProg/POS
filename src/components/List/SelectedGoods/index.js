import React, { PureComponent } from 'react';
import classNames from 'classnames/bind'
import { Card, Row, Col, Divider } from 'antd'
import { connect } from 'dva';
import styles from './index.less'

let cx = classNames.bind(styles);

class SelectedGoods extends PureComponent {
    handleClick = (key) => {
        this.props.dispatch({type: 'commodity/toggleSelectedGoods', payload: key})
    }
    getTotalPrice = (selectedList) => {
        let totalPrice = 0
        selectedList.forEach(item => {
            const unitPrice = (item.NewUnitPrice || item.NewUnitPrice === 0) ? item.NewUnitPrice : item.UnitPrice 
            const count = item.Count
            const discount = item.Discount
            const price = unitPrice * count * (discount || 100)/100
            totalPrice = totalPrice + price
        })
        return totalPrice
    }
    generateSelectedListNode = (selectedList, activeSelectedKey) => (
        selectedList.map(item => {
            let className = cx({
                card: true,
                selected: item.Key === activeSelectedKey ? true : false,
            })
            const unitPrice = (item.NewUnitPrice || item.NewUnitPrice === 0) ? item.NewUnitPrice : item.UnitPrice 
            const count = item.Count
            const discount = item.Discount
            const price = unitPrice * count * (discount || 100)/100
            return (
                <Card
                    key={item.Key}
                    bodyStyle={{padding: '3px 15px 10px 15px'}}
                    bordered={false}
                    className={className}
                    selected={item.Key === activeSelectedKey ? true : false}
                    onClick={() => this.handleClick(item.Key)}
                >
                    <Row>
                        <Col span={20} className={styles.itemInCard}>{item.Name}</Col>
                        <Col span={4} 
                            style={{textAlign: 'right'}}
                            className={styles.itemInCard}
                        >
                            {price}
                        </Col>
                    </Row>
                    <Row style={{paddingLeft: 12}}>
                        <Col span={24}>
                            <span>
                                数量：{count}
                            </span>
                            <Divider type="vertical" className={styles.divider} />
                            <span>单价：</span>
                            <span className={(item.NewUnitPrice || item.NewUnitPrice === 0) ? styles.deletedText : null}>
                                {unitPrice}
                            </span>
                            {
                                (item.NewUnitPrice || item.NewUnitPrice === 0) ? (
                                    <span style={{marginLeft: 6}}>
                                        {
                                            item.NewUnitPrice
                                        }
                                    </span>
                                )
                                    : null
                            }
                        </Col>
                        {
                            discount ? (
                                <Col span={24}>
                                    {discount}% 折扣
                                </Col>
                            ) : null
                        }
                    </Row>
                </Card>
            )
        }
        )
    )
    render() {
        const { activeKey, orders } = this.props
        const currentOrder = orders.filter(item => item.key === activeKey)[0]
        const activeSelectedKey = currentOrder && currentOrder.activeKey
        const selectedList = currentOrder && currentOrder.selectedList
        const goodsList = (
            <div>
                {
                    selectedList
                        ?
                        selectedList.map(item => {
                            let className = cx({
                                card: true,
                                selected: item.Key === activeSelectedKey ? true : false,
                            })
                            const unitPrice = (item.NewUnitPrice || item.NewUnitPrice === 0) ? item.NewUnitPrice : item.UnitPrice 
                            const count = item.Count
                            const discount = item.Discount
                            const price = unitPrice * count * (discount || 100)/100
                            return (
                                <Card
                                    key={item.Key}
                                    bodyStyle={{padding: '3px 15px 10px 15px'}}
                                    bordered={false}
                                    className={className}
                                    selected={item.Key === activeSelectedKey ? true : false}
                                    onClick={() => this.handleClick(item.Key)}
                                >
                                    <Row>
                                        <Col span={20} className={styles.itemInCard}>{item.Name}</Col>
                                        <Col span={4} 
                                            style={{textAlign: 'right'}}
                                            className={styles.itemInCard}
                                        >
                                            {price}
                                        </Col>
                                    </Row>
                                    <Row style={{paddingLeft: 12}}>
                                        <Col span={24}>
                                            <span>
                                                数量：{item.Count}
                                            </span>
                                            <Divider type="vertical" className={styles.divider} />
                                            <span>单价：</span>
                                            <span className={(item.NewUnitPrice || item.NewUnitPrice === 0) ? styles.deletedText : null}>
                                                {item.UnitPrice}
                                            </span>
                                            {
                                                (item.NewUnitPrice || item.NewUnitPrice === 0) ? (
                                                    <span style={{marginLeft: 6}}>
                                                        {
                                                            item.NewUnitPrice
                                                        }
                                                    </span>
                                                )
                                                    : null
                                            }
                                        </Col>
                                        {
                                            item.Discount ? (
                                                <Col span={24}>
                                                    {item.Discount}% 折扣
                                                </Col>
                                            ) : null
                                        }
                                    </Row>
                                </Card>
                            )

                        }
                        )
                        :
                        null
                }
            </div>
        )

        if (!selectedList || (Array.isArray(selectedList) && selectedList.length === 0)) {
            return <div>购物车是空的</div>
        }
        if (Array.isArray(selectedList) && selectedList.length > 0) {
            return (
                <div className={styles.selectedGoodsWrapper}>
                    { this.generateSelectedListNode(selectedList, activeSelectedKey) }
                    <Card
                        bordered={false}
                        bodyStyle={{padding: '3px 15px 10px 15px'}}
                        className={styles.totalPriceCard}>
                        <span className={styles.totalPrice}>
                                总价： {this.getTotalPrice(selectedList)}
                        </span>
                    </Card>
                </div>
            )
        }
    }
}
export default connect(state => ({
    activeKey: state.commodity.activeKey,
    orders: state.commodity.orders,
}))(SelectedGoods)
