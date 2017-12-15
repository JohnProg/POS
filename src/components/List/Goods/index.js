import React, { PureComponent } from 'react';
import { Card, Button, Layout } from 'antd'
import { connect } from 'dva'
import { Link } from 'dva/router';
import styles from './index.less'
import ChooseCalculator from '../../Calculator/Choose/'
import SelectedGoods from '../../List/SelectedGoods/'


const { Header, Sider, Content } = Layout;

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
        // if (nextProps.content && !this.state.hasReceiveProps) {
        //     const content = nextProps.content
        //     this.setState({content, hasReceiveProps: true})
        // }
    }
    handleClick = (key) => {
        const { content } = this.state
        const newContent = content.map(item => {
            if (item.Key === key) {
                return { ...item, dataClicked: null }
            }
            return item
        })
        this.setState({ content: newContent })
        setTimeout(() => {
            const newContent = this.state.content.map(item => {
                if (item.Key === key) {
                    return { ...item, dataClicked: "true" }
                }
                return item
            })
            this.setState({content: newContent})
        }, 0)
        this.props.dispatch({ type: 'commodity/addToSelectedList', payload: key })
    }
    render() {
        const { content } = this.state
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
                            Array.isArray(content) && content.map(item => commodityItem(item))
                        }
                    </div>
                </Content>
            </Layout>
        )
    }
}
