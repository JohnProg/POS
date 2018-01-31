import React, { PureComponent } from 'react';
import { Card, Form, Input, Row, Col, Cascader, } from 'antd'
import { connect } from 'dva';
import cascaderAddressOptions from '../../../utils/cascader-address-options';


const fieldLabels = {
  senderName: '寄件人姓名',
  senderPhoneNumber: '寄件人号码',
  receiverName: '收件人姓名',
  receiverPhoneNumber: '收件人号码',
  receiverIDNumber: '收件人身份证号',
  receiverAddress: '收件人地址',
  receiverDetailedAddress: '收件人详细地址（具体到门牌号）',
};


@connect(state => ({
  order: state.commodity.orders.filter(item => item.key === state.commodity.activeKey)[0],
  activeTabKey: state.commodity.activeKey,
}))



class MilkPowderHandler extends PureComponent {
  render() {

    const { form } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;

    return (
      <div>
        <Card title="奶粉下单地址"  bordered={false} style={{marginBottom: 24}}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.senderName}>
                  {getFieldDecorator('SenderName', {
                    rules: [{ required: true, message: '请输入寄件人姓名' }],
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.senderPhoneNumber}>
                  {getFieldDecorator('SenderPhoneNumber', {
                    rules: [{ required: true, message: '请输入寄件人电话' }],
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.receiverName}>
                  {getFieldDecorator('ReceiverName', {
                    rules: [{ required: true, message: '请输入收件人姓名' }],
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.receiverPhoneNumber}>
                  {getFieldDecorator('ReceiverPhoneNumber', {
                    rules: [{ required: true, message: '请输入收件人电话' }],
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.receiverIDNumber}>
                  {getFieldDecorator('ReceiverIDNumber', {
                    rules: [{ required: true, message: '请输入收件人身份证号' }],
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 12 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.receiverAddress}>
                  {getFieldDecorator('ReceiverAddress', {
                    rules: [{ required: true, message: '选择收件人地址' }],
                  })(
                    <Cascader
                     options={cascaderAddressOptions}
                      showSearch
                      placeholder="请选择"
                       />
                  )}
                </Form.Item>
              </Col>
              <Col lg={{ span: 12 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.receiverDetailedAddress}>
                  {getFieldDecorator('ReceiverDetailedAddress', {
                    rules: [{ required: true, message: '请输入收件人详细地址（具体到门牌号）' }],
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

      </div>
    );
  }
}

export default connect(({ global, loading }) => ({
}))(Form.create()(MilkPowderHandler));
