import React, { PureComponent } from 'react';
import { connect } from 'dva'
import { Row, Col, Table, Button, Icon } from 'antd'
import styles from './LocalSale.less'
import PaymentCalculator from '../../components/Calculator/Payment/'

class LocalSale extends PureComponent {
    componentDidMount() {
        const paymentData = this.props.order.paymentData
        Array.isArray(paymentData) && paymentData.length > 0 && this.props.dispatch({type: 'commodity/checkPaymentData'})
    }
    handleRemoveClick = (index) => {
        this.props.dispatch({type: 'commodity/clickRemovePaymentDataItemButton', payload: index})
    }
    handleCashClick = () => {
        this.props.dispatch({type: 'commodity/clickCashButton'})
    }
    handleRowClick = (record, index) => {
        return {
            onClick: () => {
                if (record.method) {
                    if (index === this.props.order.activePaymentDataIndex) { return }
                    this.props.dispatch({type: 'commodity/changeActivePaymentDataIndex', payload: index})
                }
            },
        }
    }
    render() {
        const { totalPrice, paymentData } = this.props.order
        const columns = [{
            title: '还需',
            dataIndex: 'demand',
            key: 'demand',
        }, {
            title: '收款',
            dataIndex: 'cash',
            key: 'cash',
            className: styles.price,
        }, {
            title: '找零',
            dataIndex: 'giveChange',
            key: 'giveChange',
            className: styles.hasGiveChange,
        }, {
            title: '方法',
            dataIndex: 'method',
            key: 'method',
        }, {
            key: 'delete',
            render: (text, record, index) => {
                return <Icon
                    type="close-circle"
                    style={{cursor: 'pointer'}}
                    onClick={this.handleRemoveClick.bind(this, index)}
                />
            }
        }]
        return (
            <Row>
                <Col span={8}
                    className={styles.leftContent}
                >
                    <Button
                        ghost 
                        type="primary"
                        onClick={this.handleCashClick}
                    >
                        现金
                    </Button>
                </Col>
                <Col span={16}>
                    <Row className={styles.rightContent}>
                        <Col span={24} className={styles.top}>
                            <Table
                                columns={columns}
                                dataSource={paymentData}
                                pagination={false}
                                onRow={this.handleRowClick}
                                rowClassName={(record, index) => {
                                    if (index === this.props.order.activePaymentDataIndex) {
                                        if (record.giveChange > 0) {
                                            return styles.hasGiveChangeRow
                                        }
                                        return styles.clickedRow
                                    }
                                    if (!record.method) {
                                        return styles.extra
                                    }
                                    return ''
                                }}
                            />
                        </Col>
                        <Col span={24} className={styles.bottom}>
                            <Row>
                                <Col span={12}>
                                    <PaymentCalculator />
                                </Col>
                                <Col span={12}>
                                    <div className={styles.options}>
                                        <Button>
                                            客户
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}
export default connect(state => ({
    order: state.commodity.orders.filter(item => item.key === state.commodity.activeKey)[0],
    activeTabKey: state.commodity.activeKey
}))(LocalSale)
