import React, { PureComponent } from 'react';
import { Card, Button, Layout, Icon } from 'antd'
import CardItem from './CardItem'
import ChooseCalculator from '../../../components/Calculator/Choose/'
import SelectedGoods from '../../../components/List/SelectedGoods/'
import HeaderSearch from '../../../components/HeaderSearch';
import styles from './index.less'
import classNames from 'classnames'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';

const { Header, Sider, Content } = Layout;
let cx = classNames.bind(styles)

@connect(state => ({commodity: state.commodity}))

export default class GoodsList extends PureComponent {
    render() {
        const { commodity, dispatch } = this.props
        const view = this.props.location && this.props.location.pathname.replace('/pos/', '')
        const currentOrder = commodity.orders.filter(item => (item.key === commodity.activeKey))[0]
        const { content, display } = currentOrder
        let displayTable = cx({
            [styles.trigger]: true,
            [styles.activeTrigger]: view === 'table'
        })
        let displayCardList = cx({
            [styles.trigger]: true,
            [styles.activeTrigger]: view === 'list'
        })
        return (
            <Layout>
                <Sider
                    width={440}
                    className={styles.sider}
                >
                    <Content
                        className={styles.leftContent}
                    >
                        <SelectedGoods />
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
                            onClick={() => {dispatch(routerRedux.push('/pos/list'))}}
                        />
                        <Icon
                            className={displayTable}
                            type="profile"
                            onClick={() => {dispatch(routerRedux.push('/pos/table'))}}
                        />
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
                    <div className={styles.tabHeader}></div>
                    <div className={styles.commodityListWrapper}>
            <div>
                {
                    Array.isArray(content) && content.map(item => <CardItem item={item} key={item.Key} dispatch={dispatch} />)
                }
            </div>
                    </div>
                </Content>
            </Layout>
        )
    }
}
