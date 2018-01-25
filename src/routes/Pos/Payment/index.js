import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Badge, Row, Col, Icon, Table, Radio, List } from 'antd';
import styles from './index.less';
import LocalSale from './LocalSale';
import Express from '../Express';
// import WareHouse from './WareHouse';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

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
    const { goodsPrice, expressCost, totalPrice, saleType, realMoney, changeMoney } = this.props.order;
    const priceList = [
      { title: '商品金额', value: goodsPrice },
      { title: '邮费金额', value: expressCost },
      { title: '应收金额', value: totalPrice },
      { title: '实收金额', value: realMoney },
      { title: '找零金额', value: changeMoney },
    ];
    return (
      <div className={styles.paymentLayout}>
        <div>left</div>
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
          <RadioGroup
            defaultValue="Local"
            onChange={e => dispatch({ type: 'commodity/clickChangeSaleTypeButton', payload: e.target.value })}
          >
            <RadioButton value="Local">本地</RadioButton>
            <RadioButton value="Express">邮寄</RadioButton>
          </RadioGroup>
          {
            saleType !== 'Local' ? <Express /> : null
          }
          <LocalSale
            totalPrice={goodsPrice}
            validate={this.validate}
          />
        </div>
        <div />
        <List
          dataSource={priceList}
          className={styles.priceList}
          renderItem={item => (
            <div className={styles.priceListItem}>
                  <h2>{item.title}:</h2>
                  <h2>{item.value}</h2>
            </div>
          )}
        />
      </div>
    );
  }
}
export default connect(state => ({
  order: state.commodity.orders.filter(item => item.key === state.commodity.activeKey)[0],
  activeTabKey: state.commodity.activeKey,
}))(Payment);
