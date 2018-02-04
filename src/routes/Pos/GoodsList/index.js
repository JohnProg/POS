import React, { PureComponent } from 'react';
import { Card, Button, Layout, Icon, Radio, Spin, } from 'antd';
import CardItem from './CardItem';
import ChooseCalculator from '../../../components/Calculator/Choose/';
import SelectedGoods from '../../../components/List/SelectedGoods/';
import HeaderSearch from '../../../components/HeaderSearch';
import styles from './index.less';
import classNames from 'classnames';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { POS_TAB_TYPE } from '../../../constant';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


const { Sider, Content } = Layout;
const cx = classNames.bind(styles);

@connect(state => ({ commodity: state.commodity }))

export default class GoodsList extends PureComponent {
  render() {
    const { commodity, dispatch } = this.props;
    const view = this.props.location && this.props.location.pathname.replace('/pos/', '');
    const { milkPowderGoodsList, commonLoading, } = commodity
    const currentOrder = commodity.orders.filter(item => (item.key === commodity.activeTabKey))[0];
    const { content, display, saleType, type } = currentOrder;
    const displayTable = cx({
      [styles.trigger]: true,
      [styles.activeTrigger]: view === 'table',
    });
    const displayCardList = cx({
      [styles.trigger]: true,
      [styles.activeTrigger]: view === 'list',
    });
    const generateGoods = () => {
      switch (type) {
        case POS_TAB_TYPE.MILKPOWDER: {
          return milkPowderGoodsList
        }
        default: {
          return []
        }
      }
    }
    return (
      <Layout>
        <Sider
          width={440}
          className={styles.sider}
        >
          <Content
            className={styles.leftContent}
          >
            <SelectedGoods saleType={saleType} />
          </Content>
          <div
            className={styles.calculator}
          >
            <ChooseCalculator />
          </div>
        </Sider>
        <Content className={styles.rightContent}>
          <div className={styles.header}>
            <Icon
              className={styles.trigger}
              type="home"
            />
            <Icon
              className={displayCardList}
              type="table"
              onClick={() => { dispatch(routerRedux.push('/pos/list')); }}
            />
            <Icon
              className={displayTable}
              type="profile"
              onClick={() => { dispatch(routerRedux.push('/pos/table')); }}
            />

            {
              type === POS_TAB_TYPE.SALE && (

                <RadioGroup
                  value={saleType}
                  onChange={e => dispatch({ type: 'commodity/clickChangeSaleTypeButton', payload: e.target.value })}
                  style={{ marginLeft: 24 }}
                >
                  <RadioButton value="Local">本地</RadioButton>
                  <RadioButton value="Express">邮寄</RadioButton>
                  <RadioButton value="DropShipping">代发</RadioButton>
                </RadioGroup>
              )
            }
            <div className={styles.right}>
              <HeaderSearch
                className={`${styles.action} ${styles.search}`}
                placeholder="商品搜索"
                dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
                onSearch={(value) => {
                  console.log('input', value); // eslint-disable-line
                }}
                onPressEnter={(value) => {
                  console.log('enter', value); // eslint-disable-line
                }}
              />
            </div>
          </div>
          <div className={styles.tabHeader} />
          <Spin spinning={commonLoading}>
            <div className={styles.commodityListWrapper}>
              <div>
                {
                  Array.isArray(generateGoods()) && generateGoods().map(item => <CardItem item={item} key={item.Sku} dispatch={dispatch} saleType={type === POS_TAB_TYPE.SALE ? saleType : null} />)
                }
              </div>
            </div>
          </Spin>
        </Content>
      </Layout>
    );
  }
}
