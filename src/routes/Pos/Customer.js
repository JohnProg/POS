import React, { PureComponent } from 'react';
import { connect } from 'dva'
import { Tabs, Button, Badge, Row, Col, Icon, Table, Input, Divider, Form } from 'antd'
import styles from './Customer.less'
import LocalSale from './LocalSale'
import WareHouse from './WareHouse'

const { TabPane } = Tabs
const FormItem = Form.Item;

const fieldLabels = {
  name: '客户名',
  street: '街道',
  email: '电子邮箱',
  city: '城市',
  phone: '电话',
  postcode: '邮政编码',
  barcode: '条码',
  country: '国家',
  taxNumber: '税号',
};

const columns = [
    {
        title: '客户名称',
        dataIndex: 'Name',
    },
    {
        title: '地址',
        dataIndex: 'address',
    },
    {
        title: '电话',
        dataIndex: 'Phone',
    }
]

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16},
}

@Form.create()
class Payment extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isConfirmEnable: false,
        }
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'commodity/searchCustomer',
        })
    }
    handlePrevClick = () => {
        this.props.dispatch({type: 'commodity/changePhase', payload: {activeTabKey: this.props.activeTabKey, phase: 'choose'}})
    }
    validate = (bool) => {
        this.setState({
            isConfirmEnable: bool,
        })
    }
    handleFormSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
          console.log(values)
      }
    });
    }
    handleAddCustomerFormSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
          console.log(values)
      }
    });
    }
    render() {
        const { dispatch, form } = this.props
        const { totalPrice } = this.props.order
        const { getFieldDecorator } = form;
        const addCustomerForm = (
            <Form
                onSubmit={this.handleAddCustomerFormSubmit}
                className={styles.addCustomerForm}
            >
                <Row gutter={16}>
                    <Col lg={12} sm={24}>
                        <FormItem label={fieldLabels.name} { ...formItemLayout }>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入客户名' }],
                            })(
                                <Input placeholder="名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col lg={12} sm={24} pull={1} className={styles.submitFormItem}>
                        <FormItem>
                            <Button shape="circle">
                                <Icon type="minus-circle" />
                            </Button>
                            <Divider type="vertical" />
                            <Button htmlType="submit" shape="circle">
                                <Icon type="save" />
                            </Button>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col lg={12} sm={24}>
                        <FormItem label={fieldLabels.street} { ...formItemLayout }>
                            {getFieldDecorator('street')(
                                <Input placeholder="街道" />
                            )}
                        </FormItem>
                    </Col>
                    <Col lg={12} sm={24}>
                        <FormItem label={fieldLabels.email} { ...formItemLayout }>
                            {getFieldDecorator('email')(
                                <Input placeholder="电子邮箱" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col lg={12} sm={24}>
                        <FormItem label={fieldLabels.city} { ...formItemLayout }>
                            {getFieldDecorator('city')(
                                <Input placeholder="城市" />
                            )}
                        </FormItem>
                    </Col>
                    <Col lg={12} sm={24}>
                        <FormItem label={fieldLabels.phone} { ...formItemLayout }>
                            {getFieldDecorator('phone', {
                                rules: [{ required: true, message: '请输入电话' }],
                            })(
                                <Input placeholder="电话" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col lg={12} sm={24}>
                        <FormItem label={fieldLabels.postcode} { ...formItemLayout }>
                            {getFieldDecorator('postcode')(
                                <Input placeholder="邮政编码" />
                            )}
                        </FormItem>
                    </Col>
                    <Col lg={12} sm={24}>
                        <FormItem label={fieldLabels.barcode} { ...formItemLayout }>
                            {getFieldDecorator('barcode', {
                            })(
                                <Input placeholder="条码" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col lg={12} sm={24}>
                        <FormItem label={fieldLabels.country} { ...formItemLayout }>
                            {getFieldDecorator('country')(
                                <Input placeholder="国家" />
                            )}
                        </FormItem>
                    </Col>
                    <Col lg={12} sm={24}>
                        <FormItem label={fieldLabels.taxNumber} { ...formItemLayout }>
                            {getFieldDecorator('taxNumber', {
                            })(
                                <Input placeholder="税号" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
        return (
            <div className={styles.customerWrapper}>
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
                        <Input.Search
                            placeholder="搜索客户"
                            onSearch={this.handleFormSubmit}
                            style={{ width: 260 }}
                        />
                        <Divider type="vertical" />
                        <Button className={styles.addCustomer}>
                        <Icon type="user" />
                        <Icon type="plus" />
                        </Button>
                    </Col>
                    <Col style={{textAlign: 'right'}}>
                        <Button>
                            确认
                        </Button>
                    </Col>
                </Row>
                <div className={styles.displayArea}>
                    {
                        addCustomerForm
                    }
                </div>
                <div className={styles.customerTable}>
                            <Table
                                bordered
                                columns={columns}
                                rowKey={record => record.Key}
                            />
                </div>
            </div>
        )
    }
}
export default connect(state => ({
    order: state.commodity.orders.filter(item => item.key === state.commodity.activeKey)[0],
    activeTabKey: state.commodity.activeKey
}))(Payment)
