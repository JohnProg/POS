import React, { PureComponent } from 'react';
import { Card, Button } from 'antd'
import { connect } from 'dva'
import styles from './index.less'

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
            <div className={styles.commodityListWrapper}>
                {
                    Array.isArray(content) && content.map(item => commodityItem(item))
                }
            </div>
        )
    }
}
