import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Badge, Row, Col, Icon, Table } from 'antd';
import styles from './index.less';
import LocalSale from './LocalSale';
import Express from '../Express';
// import WareHouse from './WareHouse';


@connect(state => ({
  order: state.commodity.orders.filter(item => item.key === state.commodity.activeKey)[0],
  activeTabKey: state.commodity.activeKey,
}))
class Payment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isConfirmEnable: false,
    };
  }
    handlePrevClick = () => {
      this.props.dispatch(routerRedux.goBack());
    }
    validate = (bool) => {
      this.setState({
        isConfirmEnable: bool,
      });
    }
    render() {
      const { dispatch } = this.props;
      const { goodsPrice, expressCost } = this.props.order;
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
            <Col style={{ textAlign: 'center' }}>
              <span>商品金额:{goodsPrice}</span>
              <span>邮费金额:{expressCost}</span>
            </Col>
            <Col style={{ textAlign: 'right' }}>
              <Button
                disabled={!this.state.isConfirmEnable}
              >确认
              </Button>
            </Col>
          </Row>
          <Express />
          <LocalSale
            totalPrice={goodsPrice}
            validate={this.validate}
          />
        </div>
      );
    }
}
export default connect(state => ({
  order: state.commodity.orders.filter(item => item.key === state.commodity.activeKey)[0],
  activeTabKey: state.commodity.activeKey,
}))(Payment);
