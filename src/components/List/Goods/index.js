import React, { PureComponent } from 'react';
import { Card, Button, Layout } from 'antd'
import CardItem from './cardItem'
import { connect } from 'dva'
import { Link } from 'dva/router';
import styles from './index.less'
import ChooseCalculator from '../../Calculator/Choose/'
import SelectedGoods from '../../List/SelectedGoods/'


const { Header, Sider, Content } = Layout;

@connect(state => ({commodity: state.commodity}))

export default class CommodityList extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            content: [],
        }
    }
    componentDidMount() {
        const content = this.props.content
        this.setState({ content })

    }
    componentWillReceiveProps(nextProps) {
    }
    render() {
        const { commodity, dispatch } = this.props
        const currentOrder = commodity.orders.filter(item => (item.key === commodity.activeKey))[0]
        const { content } = currentOrder
        const commodityItem = ({ Name, UnitPrice, Image, Key, dataClicked }) => (
            <Card
                key={Key}
                className={styles.commodityItem}
                bodyStyle={{padding: 2}}
                dataclicked={dataClicked}
                onClick={() => this.handleClick(Key)}
            >
                <div>
                    <div className={styles.imgWrapper}>
                        <img src={Image} alt="商品图片" />
                    </div>
                    <div className={styles.commodityName}>{Name}</div>
                    <span className={styles.priceTag}>{UnitPrice}</span>
                </div>
            </Card>
        )
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
                <Content>
                    <div className={styles.commodityListWrapper}>

                        {
                            Array.isArray(content) && content.map(item => <CardItem item={item} key={item.Key} dispatch={dispatch} />)
                        }
                    </div>
                </Content>
            </Layout>
        )
    }
}
