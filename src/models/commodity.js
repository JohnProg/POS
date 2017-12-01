import { Badge } from 'antd'
import moment from 'moment'
import { fetchCommodityList } from '../services/api'

export default {
    namespace: 'commodity',

    state: {
        orders: [],
        activeKey: null,
        newTabIndex: 0,
    },

    effects: {
        *addTab(_, { put, call }) {
            yield put({type: 'add'})
            const { list } = yield call(fetchCommodityList)
            yield put({type: 'save', payload: list})
        },
    },

    reducers: {
        add(state, action) {
            const newTabIndex = ++state.newTabIndex 
            const timeStamp = moment().format('x')
            const localTime = moment().format('HH:mm')
            const count = state.newTabIndex
            const tabsBarElement = (
                <div className="tabsContent">
                    <Badge count={count} overflowCount={1000} />
                    <span>{localTime}</span>
                </div>
            )
            const orders = [...state.orders, { title: tabsBarElement, key: `orders-${newTabIndex}`}]
            const activeKey = `orders-${newTabIndex}`;
            return { ...state, orders, activeKey, newTabIndex }
        },
        minus(state, action) {
            const currentActiveKey = state.activeKey
            const currentOrders = state.orders
            const currentIndex = currentOrders.findIndex(item => item.key === currentActiveKey)
            const orders = currentOrders.filter(item => item.key !== currentActiveKey)
            // case1: panes 数量大于 1 且 activeOrders 不是最后一个
            if (currentOrders.length > 1 && currentIndex !== currentOrders.length - 1) {
                const activeKey = currentOrders[currentIndex + 1].key
                return { ...state, orders, activeKey }
            }
            // case2: panes 数量大于 1 且 activeOrders 是最后一个
            if (currentOrders.length > 1 && currentIndex === currentOrders.length - 1) {
                const activeKey = currentOrders[currentIndex - 1].key
                return { ...state, orders, activeKey }
            }
            // case3: panes 数量等于1, 确保始终有一个 TabPane 
        },
        changeTab(state, action) {
            const activeKey = action.payload
            return { ...state, activeKey }
        },
        save(state, action) {
            const list = action.payload || []
            const newOrders = state.orders.map(item => {
                if (item.key && item.key === state.activeKey) {
                    return { ...item, content: list, }
                }
                return item
            })
            return { ...state, orders: newOrders }
        },
    }
}
