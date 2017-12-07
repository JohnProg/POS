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
    render() {
        const { activeKey, orders } = this.props
        const currentOrder = orders && orders.filter(item => item.key === activeKey)[0]
        const activeGoodsKey = currentOrder && currentOrder.activeKey
        const selectedList = currentOrder && currentOrder.selectedList
        const goodsList = (
            <div>
                {
                    selectedList
                        ?
                        selectedList.map(item => {
                            let className = cx({
                                card: true,
                                selected: item.Key === activeGoodsKey ? true : false,
                            })
                            const price = item.UnitPrice.valueOf() * item.Count.valueOf() * (item.Discount || 100)/100
                            return (
                                <Card
                                    key={item.Key}
                                    bodyStyle={{padding: '3px 15px 10px 15px'}}
                                    bordered={false}
                                    className={className}
                                    selected={item.Key === activeGoodsKey ? true : false}
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
                                            <Divider type="vertical" />
                                            <span>
                                                单价：{item.UnitPrice}
                                            </span>
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
                    { goodsList }
                </div>
            )
        }
    }
}
export default connect(state => ({
    activeKey: state.commodity.activeKey,
    orders: state.commodity.orders,
}))(SelectedGoods)
