import React, { PureComponent } from 'react'
import Print from 'rc-print';
import { Radio, Card } from 'antd';
import ExpressHandler from '../ExpressHandler';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class SaleHander extends PureComponent {
  render() {
    const { saleType, dispatch } = this.props
    const title = (
      <div>
      <span>
        门店销售类型
      </span>
          <RadioGroup
            value={saleType}
            onChange={e => dispatch({ type: 'commodity/clickChangeSaleTypeButton', payload: e.target.value })}
            style={{marginLeft: 24}}
          >
            <RadioButton value="Local">本地</RadioButton>
            <RadioButton value="Express">邮寄</RadioButton>
            <RadioButton value="DropShipping">代发</RadioButton>
          </RadioGroup>
      </div>
    )
    return (
      <div>
        <Print
          ref="printForm"
          title="门店出口/邮寄/代发"
          style={{ display: 'none' }}
        >
          <div>
            <p className="red">first </p>
            <p className="green">second </p>
            <p className="pink">third </p>
          </div>
        </Print>
        <Card title={title} bordered={false} style={{marginBottom: 24}}>
        {
          saleType !== 'Local' ? <ExpressHandler /> : null
        }
        </Card>
      </div>
    )
  }
}
