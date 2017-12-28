import React, { PureComponent } from 'react';
import { Card, Button, Layout, Icon } from 'antd'
import CardItem from '../../components/List/Goods/cardItem'
import { connect } from 'dva'
import styles from './ChooseList.less'
import ChooseCalculator from '../../components/Calculator/Choose/'
import SelectedGoods from '../../components/List/SelectedGoods/'
import HeaderSearch from '../../components/HeaderSearch';
import { GOODS_DISPLAY_TYPE } from '../../constant'
import List from './List'
import CardTable from '../../components/Table/Goods/'
import classNames from 'classnames'
import { Link, Route, Redirect, Switch } from 'dva/router';
import PropTypes from 'prop-types';


const { Header, Sider, Content } = Layout;
let cx = classNames.bind(styles)

@connect(state => ({commodity: state.commodity}))

export default class CommodityList extends PureComponent {
    static childContextTypes = {
        location: PropTypes.object,
        breadcrumbNameMap: PropTypes.object,
    }
    getChildContext() {
        // const { location, navData, getRouteData } = this.props;
        // const routeData = getRouteData('PosLayout');
        // return { location };
    }
    render() {
        console.log(this.props)
        const { commodity, dispatch } = this.props
        const currentOrder = commodity.orders.filter(item => (item.key === commodity.activeKey))[0]
        const { content, display } = currentOrder
        const displayMapping = {
            [GOODS_DISPLAY_TYPE.CARD_LIST]: <List content={content} dispatch={dispatch} />,
            [GOODS_DISPLAY_TYPE.TABLE]: <CardTable content={content} dispatch={dispatch} />
        }
        let displayTable = cx({
            [styles.trigger]: true,
            [styles.activeTrigger]: display === GOODS_DISPLAY_TYPE.TABLE
        })
        let displayCardList = cx({
            [styles.trigger]: true,
            [styles.activeTrigger]: display === GOODS_DISPLAY_TYPE.CARD_LIST
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
                            onClick={() => {dispatch({type: 'commodity/changeDisplay', payload: GOODS_DISPLAY_TYPE.CARD_LIST})}}
                        />
                        <Icon
                            className={displayTable}
                            type="profile"
                            onClick={() => {dispatch({type: 'commodity/changeDisplay', payload: GOODS_DISPLAY_TYPE.TABLE})}}
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
                        {

                                                // <Switch>
                                                //     {
                                                //         getRouteData('PosLayout').map(item =>
                                                //             (
                                                //                 <Route
                                                //                     exact={item.exact}
                                                //                     key={item.path}
                                                //                     path={item.path}
                                                //                     component={item.component}
                                                //                 />
                                                //             )
                                                //         )
                                                //     }
                                                //     <Route component={NotFound} />
                                                // </Switch>
                        }
                        {
                            displayMapping[display]
                        }
                    </div>
                </Content>
            </Layout>
        )
    }
}
