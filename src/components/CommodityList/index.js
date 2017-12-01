import React, { PureComponent } from 'react';
import { Card, Button } from 'antd'
import styles from './index.less'

export default class CommodityList extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            content: [],
        }
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        if (nextProps.content) {
            const content = nextProps.content
            this.setState({content})
        }
    }
    handleClick = (key) => {
        const { content } = this.state
        const newContent = content.map(item => {
            if (item.Key === key) {
                return { ...item, dataClicked: "true" }
            }
            return item
        })
        // this.setState({content: newContent}, () => {
        //
        // })
    }
    render() {
        console.log(this.state.content)
        const { content } = this.state
        const commodityItem = ({Name, Price, Image, Key, dataClicked}) => (
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
                <span className={styles.priceTag}>{Price}</span>
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
