import React, { PureComponent } from 'react';
import { Table, Input, InputNumber } from 'antd';
import { calculateExpressOrShippingCost } from '../../../../utils/utils';

export default class TableForm extends PureComponent {
  handleFieldChange = (e, fieldName, key) => {
    const data = this.props.value
    const value = e && (e.target ? e.target.value : e);
    const newData = data.map(item => {
      if (item.ID === key) {
        return { ...item, [fieldName]: value };
      }
      return item;
    });
    const shippingData = newData.map(item => ({
      ...item, RealPrice: calculateExpressOrShippingCost(item.UnitPrice, item.Weight, item.WeightedWeight, ), Name: {Name: item.Name, ID: item.Name}
    }))
    // const setFieldsValueCallabck = this.props.from.setFieldsValue
    this.props.dispatch({ type: 'commodity/changeShippingDataAndSumCost', payload: shippingData })
  }
  render() {
    const columns = [{
      title: '快递公司',
      dataIndex: 'Name',
      render: (text, record) => <Input value={text} onChange={e => this.handleFieldChange(e, 'Name', record.ID)} />,
    }, {
      title: '重量',
      dataIndex: 'Weight',
      render: (text, record) => <InputNumber value={text} min={0} precision={2} onChange={e => this.handleFieldChange(e, 'Weight', record.ID)} />,
    }, {
      title: '加权重量',
      dataIndex: 'WeightedWeight',
      render: (text, record) => <InputNumber value={text} min={0} precision={2} onChange={e => this.handleFieldChange(e, 'WeightedWeight', record.ID)} />,
    }, {
      title: '快递单价',
      dataIndex: 'UnitPrice',
      render: (text, record) => <InputNumber value={text} min={0} precision={2} onChange={e => this.handleFieldChange(e, 'UnitPrice', record.ID)} />,
    }, {
      title: '包裹快递金额',
      dataIndex: 'RealPrice',
    }];

    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.props.value}
          pagination={false}
          rowKey={record => record.ID}
          size="small"
        />
      </div>
    );
  }
}
