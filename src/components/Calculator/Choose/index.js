import React, { PureComponent } from 'react';
import { Button } from 'antd'
import styles from './index.less'

export default class ChooseCalculator extends PureComponent {
    render() {
        return (
            <div className={styles.calcWrapper}>
                <div className={styles.actionPad}>
                    <Button>客户</Button>
                    <Button>付款</Button>
                </div>
                <div className={styles.numPad}>
                    <Button ghost>1</Button>
                    <Button ghost>2</Button>
                    <Button ghost>3</Button>
                    <Button ghost datatype="string">数量</Button>
                    <Button ghost>4</Button>
                    <Button ghost>5</Button>
                    <Button ghost>6</Button>
                    <Button ghost datatype="string">折扣</Button>
                    <Button ghost>7</Button>
                    <Button ghost>8</Button>
                    <Button ghost>9</Button>
                    <Button ghost datatype="string">价格</Button>
                    <Button ghost>c</Button>
                    <Button ghost>0</Button>
                    <Button ghost>.</Button>
                    <Button ghost>d</Button>
                </div>
            </div>
        )
    }
}
