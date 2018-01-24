import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Table, Radio } from 'antd';
import styles from './index.less';
import TableForm from './TableForm'
  ;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(state => ({
  commodity: state.commodity,
  order: state.commodity.orders.filter(item => item.key === state.commodity.activeKey)[0],
  activeTabKey: state.commodity.activeKey,
}))

export default class Express extends PureComponent {
  render() {
    const { dispatch, order } = this.props;
    const { goodsPrice } = this.props.order;
    return (
      <div className={styles.expressWrapper}>
        <Row>
          <RadioGroup
            defaultValue="Local"
            onChange={e => dispatch({ type: 'commodity/clickChangeSaleTypeButton', payload: e.target.value })}
          >
            <RadioButton value="Local">本地</RadioButton>
            <RadioButton value="Express">邮寄</RadioButton>
          </RadioGroup>

          {/* <Row
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
              <span>邮费金额</span>
            </Col>
            <Col style={{ textAlign: 'right' }}>
              <Button>
                确认
              </Button>
            </Col>
          </Row> */}
        </Row>
        <TableForm
        dispatch={dispatch}
        dataSource={order.expressData || []}
         />
      </div>
    );
  }
}
