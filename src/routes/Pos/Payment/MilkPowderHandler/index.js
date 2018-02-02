import React, { PureComponent } from 'react';
import { Card, Form, Input, Row, Col, Cascader, } from 'antd'
import { connect } from 'dva';
import cascaderAddressOptions from '../../../../utils/cascader-address-options';
import TableForm from './TableForm'


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
  order: state.commodity.orders.filter(item => item.key === state.commodity.activeTabKey)[0],
  activeTabKey: state.commodity.activeTabKey,
}))



class MilkPowderHandler extends PureComponent {
  render() {
    const { form, order } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { selectedList } = order || []
    const waybillRequiredFiltered = selectedList.filter(item => item.Sku.includes('CGF') || item.Sku.includes('CGF'))
    const waybillUnRequiredFiltered = selectedList.filter(item => !item.Sku.includes('CGF') && !item.Sku.includes('CGF'))
    let selectedListForWaybill = []
    waybillRequiredFiltered.forEach(item => {
      for (let i=0; i<item.Count; i++) {
        selectedListForWaybill.push({
          ...item, Key: `${item.Sku}-${i}`, Count: 1
        })
      }
    })
    selectedListForWaybill = [ ...selectedListForWaybill, ...waybillUnRequiredFiltered ]
    return (
      <div>
        <Card title="抓取运单号" bordered={false} style={{marginBottom: 24}}>
        {getFieldDecorator('waybill', {
          initialValue: selectedListForWaybill,
        })(
          <TableForm />
        )}
        </Card>
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
