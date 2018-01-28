import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, DatePicker, TimePicker, Input, Select, Popover, InputNumber } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FooterToolbar from '../../components/FooterToolbar';
import TableForm from './TableForm';
import styles from './style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

const fieldLabelsAndNamesMapping = {
  name: {
    label: '店名',
    name: 'ShopName',
  },
  shopAssistant: {
    label: '在岗营业员',
    name: 'ShopAssistant',
  },
  cash100: {
    label: '100',
    name: 'Cash100',
  },
  cash50: {
    label: '50',
    name: 'Cash50',
  },
  cash20: {
    label: '20',
    name: 'Cash20',
  },
  cash10: {
    label: '10',
    name: 'Cash10',
  },
  cash5: {
    label: '5',
    name: 'Cash5',
  },
  cash2: {
    label: '2',
    name: 'Cash2',
  },
  cash1: {
    label: '1',
    name: 'Cash1',
  },
  cash0Dot5: {
    label: '0.5',
    name: 'Cash0Dot5',
  },
  cash0Dot2: {
    label: '0.2',
    name: 'Cash0Dot2',
  },
  cash0Dot1: {
    label: '0.1',
    name: 'Cash0Dot1',
  },
  cashOpening: {
    label: '开箱金额',
    name: 'CashOpening',
  },
  cashClosing: {
    label: '闭箱金额',
    name: 'CashClosing',
  },
  bankSaving: {
    label: '存入银行',
    name: 'BankSaving',
  },
  unionPay: {
    label: '实际银联收款',
    name: 'UnionPay',
  },
  unionPayIncome: {
    label: '实际银联销售',
    name: 'UnionPayIncome',
  },
  unionPayServiceCharge: {
    label: '手续费',
    name: 'UnionPayServiceCharge',
  },
  unionPayIntoAccount: {
    label: '实际银联到账',
    name: 'UnionPayIntoAccount',
  },
  creditCard: {
    label: '实际 CreditCard 收款',
    name: 'CreditCard',
  },
  creditCardIncome: {
    label: '实际 CreditCard 销售',
    name: 'CreditCardIncome',
  },
  creditCardServiceCharge: {
    label: '手续费',
    name: 'creditCardServiceCharge',
  },
  aliPay: {
    label: '实际支付宝收款',
    name: 'AliPay',
  },
  aliPayIncome: {
    label: '实际支付宝销售',
    name: 'AliPayIncome',
  },
  aliPayServiceCharge: {
    label: '手续费',
    name: 'AliPayServiceCharge',
  },
  weChatPay: {
    label: '实际微信收款',
    name: 'WeChatPay',
  },
  weChatPayIncome: {
    label: '实际微信销售',
    name: 'WeChatPayIncome',
  },
  weChatPayServiceCharge: {
    label: '手续费',
    name: 'WeChatPayServiceCharge',
  },
  eftops: {
    label: '实际 EFTOPS 销售',
    name: 'EftopsIncome',
  },
  // eftops: {
  //   label: '实际 EFTOPS 销售',
  //   name: 'EftopsIncome',
  // },
};

const cashFieldsNameMap = {
  cash100: '100',
  cash50: '50',
  cash20: '20',
  cash10: '10',
  cash5: '5',
  cash2: '2',
  cash1: '1',
  cash0Dot5: '0Dot5',
  cash0Dot2: '0Dot2',
  cash0Dot1: '0Dot1',
};



class AdvancedForm extends PureComponent {
  calcTotalCash = () => {
    const cashValues = this.props.form.getFieldsValue(Object.values(cashFieldsNameMap));
    const tempArray = Object.entries(cashValues)
      .filter(item => (item[1]))
      .map(item => [item[0].replace('Dot', '.'), item[1]])
      .map(item => (item[0] - 0) * item[1]);
    const cashInBox = tempArray.length > 0
      ?
      tempArray.reduce((partial, value) => {
        return partial + value;
      })
      :
      0;
    const cashOpening = this.props.form.getFieldValue('cashOpening') || 0;
    const income = cashInBox - cashOpening;
    return income;
  }
  calcCashInBank = (cashIncome) => {
    const cashClosing = this.props.form.getFieldValue('cashClosing') || 0;
    const cashInBank = cashIncome - cashClosing || 0;
    return cashInBank;
  }
  render() {
    const { form, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const cashIncome = this.calcTotalCash();
    const cashInBank = this.calcCashInBank(cashIncome);
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        console.log(values);
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
        }
      });
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = (fieldKey) => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map((key) => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };
    const cashFormItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const formItemLayout = {
      labelCol: { span: 16 },
      wrapperCol: { span: 8 },
    }
    const extraCash = (
      <span>实际现金销售：{cashIncome}</span>
    );
    return (
      <PageHeaderLayout
        title="现金收款复查"
        wrapperClassName={styles.advancedForm}
      >
        <Card title="基本信息" className={styles.card} bordered={false} />
        <Card title="在岗营业员" className={styles.card} bordered={false}>
          <Form hideRequiredMark>
            <Row guuter={16}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label={fieldLabelsAndNamesMapping.shopAssistant.label}>
                  {getFieldDecorator(fieldLabelsAndNamesMapping.shopAssistant.name, {
                    rules: [{ required: true, message: '请选择在岗营业员' }],
                  })(
                    <Select placeholder="请选择在岗营业员" mode="multiple">
                      <Option value="xiao">哈登</Option>
                      <Option value="mao">保罗</Option>
                    </Select>
                    )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="实际收入" className={styles.card} bordered={false}>
          <Card title="现金" className={styles.card} type="inner" extra={extraCash}>
            <Form layout="horizontal" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.cash100.label} {...cashFormItemLayout}>
                    {getFieldDecorator(fieldLabelsAndNamesMapping.cash100.name, {
                    })(
                      <InputNumber min={0} precision={0}  />
                      )}
                  </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.cash50.label} {...cashFormItemLayout} >
                    {getFieldDecorator(fieldLabelsAndNamesMapping.cash50.name, {
                    })(
                      <InputNumber min={0} precision={0} />
                      )}
                  </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.cash20.label} {...cashFormItemLayout}>
                    {getFieldDecorator(fieldLabelsAndNamesMapping.cash20.name, {
                    })(
                      <InputNumber min={0} precision={0} />
                      )}
                  </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.cash10.label} {...cashFormItemLayout}>
                    {getFieldDecorator(fieldLabelsAndNamesMapping.cash10.name, {
                    })(
                      <InputNumber min={0} precision={0} />
                      )}
                  </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.cash5.label} {...cashFormItemLayout}>
                    {getFieldDecorator(fieldLabelsAndNamesMapping.cash5.name, {
                    })(
                      <InputNumber min={0} precision={0} />
                      )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.cash2.label} {...cashFormItemLayout}>
                    {getFieldDecorator(fieldLabelsAndNamesMapping.cash2.name, {
                    })(
                      <InputNumber min={0} precision={0}  />
                      )}
                  </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.cash1.label} {...cashFormItemLayout}>
                    {getFieldDecorator(fieldLabelsAndNamesMapping.cash1.name, {
                    })(
                      <InputNumber min={0} precision={0}  />
                      )}
                  </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.cash0Dot5.label} {...cashFormItemLayout}>
                    {getFieldDecorator(fieldLabelsAndNamesMapping.cash0Dot5.name, {
                    })(
                      <InputNumber min={0} precision={0}  />
                      )}
                  </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.cash0Dot2.label} {...cashFormItemLayout}>
                    {getFieldDecorator(fieldLabelsAndNamesMapping.cash0Dot2.name, {
                    })(
                      <InputNumber min={0} precision={0}  />
                      )}
                  </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.cash0Dot1.label} {...cashFormItemLayout}>
                    {getFieldDecorator(fieldLabelsAndNamesMapping.cash0Dot1.name, {
                    })(
                      <InputNumber min={0} precision={0}  />
                      )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.cashOpening.label} {...cashFormItemLayout}>
                    {getFieldDecorator(fieldLabelsAndNamesMapping.cashOpening.name, {
                      rules: [{ required: true, message: '开箱金额' }],
                    })(
                      <InputNumber min={0} />
                      )}
                  </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.cashClosing.label} {...cashFormItemLayout}>
                    {getFieldDecorator(fieldLabelsAndNamesMapping.cashClosing.name, {
                      rules: [{ required: true, message: '闭箱金额' }],
                    })(
                      <InputNumber min={0} />
                      )}
                  </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.bankSaving.label} {...cashFormItemLayout}>
                    {getFieldDecorator(fieldLabelsAndNamesMapping.bankSaving.name, {
                    })(
                      <span>{cashInBank}</span>
                      )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card title="非现金" className={styles.card} type="inner" extra={extraCash}>
            <Form layout="horizontal" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.unionPay.label} {...formItemLayout} >
                    {getFieldDecorator(fieldLabelsAndNamesMapping.unionPay.name, {
                    })(
                      <InputNumber min={0} precision={0}  />
                      )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.unionPayIncome.label} {...formItemLayout} >
                    {getFieldDecorator(fieldLabelsAndNamesMapping.unionPayIncome.name, {
                    })(
                      <span></span>
                      )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.unionPayServiceCharge.label} {...formItemLayout}>
                    {getFieldDecorator(fieldLabelsAndNamesMapping.unionPayServiceCharge.name, {
                    })(
                      <span></span>
                      )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.unionPayIntoAccount.label} {...formItemLayout}>
                    {getFieldDecorator(fieldLabelsAndNamesMapping.unionPayIntoAccount.name, {
                    })(
                      <span></span>
                      )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.creditCard.label} {...formItemLayout} >
                    {getFieldDecorator(fieldLabelsAndNamesMapping.creditCard.name, {
                    })(
                      <InputNumber min={0} precision={0}  />
                      )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.creditCardIncome.label} {...formItemLayout} >
                    {getFieldDecorator(fieldLabelsAndNamesMapping.creditCardIncome.name, {
                    })(
                      <span></span>
                      )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.creditCardServiceCharge.label} {...formItemLayout}>
                    {getFieldDecorator(fieldLabelsAndNamesMapping.creditCardServiceCharge.name, {
                    })(
                      <span></span>
                      )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.aliPay.label} {...formItemLayout} >
                    {getFieldDecorator(fieldLabelsAndNamesMapping.aliPay.name, {
                    })(
                      <InputNumber min={0} precision={0}  />
                      )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.aliPayIncome.label} {...formItemLayout} >
                    {getFieldDecorator(fieldLabelsAndNamesMapping.aliPayIncome.name, {
                    })(
                      <span></span>
                      )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.aliPayServiceCharge.label} {...formItemLayout}>
                    {getFieldDecorator(fieldLabelsAndNamesMapping.aliPayServiceCharge.name, {
                    })(
                      <span></span>
                      )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.weChatPay.label} {...formItemLayout} >
                    {getFieldDecorator(fieldLabelsAndNamesMapping.weChatPay.name, {
                    })(
                      <InputNumber min={0} precision={0}  />
                      )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.weChatPayIncome.label} {...formItemLayout} >
                    {getFieldDecorator(fieldLabelsAndNamesMapping.weChatPayIncome.name, {
                    })(
                      <span></span>
                      )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabelsAndNamesMapping.weChatPayServiceCharge.label} {...formItemLayout}>
                    {getFieldDecorator(fieldLabelsAndNamesMapping.weChatPayServiceCharge.name, {
                    })(
                      <span></span>
                      )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Card>

        <FooterToolbar>
          {getErrorInfo()}
          <Button type="primary" onClick={validate} loading={submitting}>
            提交
                  </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}

export default connect(state => ({
  collapsed: state.global.collapsed,
  submitting: state.form.advancedFormSubmitting,
}))(Form.create()(AdvancedForm));
