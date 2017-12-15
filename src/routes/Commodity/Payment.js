import React, { PureComponent } from 'react';
import { connect } from 'dva'
import { Tabs, Button, Badge, Row, Col, Icon, Table } from 'antd'
import styles from './Payment.less'
import LocalSale from './LocalSale'
import WareHouse from './WareHouse'

const { TabPane } = Tabs



class Payment extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isConfirmEnable: false,
        }
    }
    handlePrevClick = () => {
        this.props.dispatch({type: 'commodity/changePhase', payload: {activeTabKey: this.props.activeTabKey, phase: 'choose'}})
    }
    validate = (bool) => {
        this.setState({
            isConfirmEnable: bool,
        })
    }
    render() {
        const { dispatch } = this.props
        const { totalPrice } = this.props.order
        return (
            <div className={styles.paymentWrapper}>
                <Row
                    type="flex"
                    className={styles.header}
                    justify="space-between"
                    align="middle"
                >
                    <Col>
                        <Button onClick={this.handlePrevClick}>回退</Button>
                    </Col>
                    <Col style={{textAlign: 'center'}}>
                        <h1>付款金额:{totalPrice}</h1>
                    </Col>
                    <Col style={{textAlign: 'right'}}>
                        <Button 
                            disabled={!this.state.isConfirmEnable}
                        >确认</Button>
                    </Col>
                </Row>
                <Tabs defaultActiveKey="0" size="large">
                    <TabPane tab="本地销售" key="0" forceRender={true}>
                        <LocalSale
                            totalPrice={totalPrice}
                            validate={this.validate}
                        />
                    </TabPane>
                    <TabPane tab="仓库代发" key="1">
                        <WareHouse />
                    </TabPane>
                    <TabPane tab="门店出口" key="2">Content of tab 2</TabPane>
                    <TabPane tab="奶粉订单" key="3">Content of tab 3</TabPane>
                </Tabs>
            </div>
        )
    }
}
export default connect(state => ({
    order: state.commodity.orders.filter(item => item.key === state.commodity.activeKey)[0],
    activeTabKey: state.commodity.activeKey
}))(Payment)
