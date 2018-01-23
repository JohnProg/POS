import React, { PureComponent } from 'react';
import { Card } from 'antd';
import styles from './CardItem.less';

const { Meta, Grid } = Card

export default class CardItem extends PureComponent {
  handleClick = (key) => {
    this.props.dispatch({ type: 'commodity/clickGoodsItem', payload: key });
    setTimeout(() => {
      this.props.dispatch({ type: 'commodity/clickGoodsItemTrue', payload: key });
    }, 0);
  }
  render() {
    const { saleType, item } = this.props;
    const { Name, UnitPrice, Image, Key, dataClicked } = item;
    const { A } = UnitPrice;
    return (
      <Grid
        className={styles.cardGrid}
      >
        <Card
          className={styles.commodityItem}
          bodyStyle={{ padding: 2 }}
          dataclicked={dataClicked}
          onClick={() => this.handleClick(Key)}
          cover={<img src={Image} alt="商品图片" />}
          actions={[<span>会员</span>, <span>{saleType}</span>, <span className={styles.priceTag}>{A[saleType]}</span>]}
        >
          <Meta
            title={Name}
          />
        </Card>
        {/* <div>
          <div className={styles.imgWrapper}>
            <img src={Image} alt="商品图片" />
          </div>
          <div className={styles.commodityName}>{Name}</div>
          <span className={styles.priceTag}>{A[saleType]}</span>
        </div> */}
      </Grid>
    );
  }
}
