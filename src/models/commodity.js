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
        *clickAddButton(_, { put, call }) {
            yield put({type: 'addTab'})
            const { list } = yield call(fetchCommodityList)
            yield put({type: 'saveCommodityList', payload: list})
        },
    },

    reducers: {
        addTab(state, action) {
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
            const orders = [...state.orders,
                {
                    title: tabsBarElement,
                    key: `orders-${newTabIndex}`,
                    selectedList: [],
                    activeKey: null,
                },
            ]
            const activeKey = `orders-${newTabIndex}`;
            return { ...state, orders, activeKey, newTabIndex }
        },
        removeTab(state, action) {
            const activeTabKey = state.activeKey
            const currentOrders = state.orders
            const currentIndex = currentOrders.findIndex(item => item.key === activeTabKey)
            const orders = currentOrders.filter(item => item.key !== activeTabKey)
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
        saveCommodityList(state, action) {
            const list = action.payload || []
            const newOrders = state.orders.map(item => {
                if (item.key && item.key === state.activeKey) {
                    return { ...item, content: list, }
                }
                return item
            })
            return { ...state, orders: newOrders }
        },
        addToSelectedGoods(state, action) {
            const goodsKey = action.payload
            const activeTabKey = state.activeKey
            const currentOrder = state.orders.filter(item => (item.key === activeTabKey))[0]
            const selectedList = currentOrder.selectedList
            const selectedItem = currentOrder.content.filter(item => (item.Key === goodsKey))[0]
            let newSelectedList
            if (!selectedList.find(item => item.Key === selectedItem.Key)) {
                const newSelectedItem = { ...selectedItem,
                    Count: 1,
                    CalculateType: 'count',
                }
                newSelectedList = [ ...selectedList, newSelectedItem ]
            } else {
                newSelectedList  = selectedList.map(item => {
                    if (item.Key === goodsKey) {
                        return { ...item, Count: item.Count - 0 + 1, CacheCount: null }
                    } return item
                })
            }
            const newOrders = state.orders.map(item => {
                if (item.key && item.key === state.activeKey) {
                    return { ...item, selectedList: newSelectedList, activeKey: goodsKey, }
                } return item
            })
            return { ...state, orders: newOrders }
        },
        toggleSelectedGoods(state, action) {
            const activeGoodsKey = action.payload
            const activeTabKey = state.activeKey
            const newOrders = state.orders.map(item => {
                if (item.key && item.key === activeTabKey) {
                    return { ...item,  activeKey: activeGoodsKey, }
                } return item
            })
            return { ...state, orders: newOrders }
        },
        changeCalculateType(state, action) {
            const calculateType = action.payload
            const activeTabKey = state.activeKey
            const currentOrder = state.orders.filter(item => (item.key === activeTabKey))[0]
            const selectedList = currentOrder.selectedList
            const activeSelectedKey = currentOrder.activeKey
            const newSelectedList = selectedList.map(item => {
                if (item.Key === activeSelectedKey) {
                    return { ...item, CalculateType: calculateType, CacheCount: null, }
                }
                return item
            })
            const newOrders = state.orders.map(item => {
                if (item.key && item.key === activeTabKey) {
                    return { ...item, selectedList: newSelectedList }
                }
            })
            return { ...state, orders: newOrders }
        },
        changeSelectedItemCount(state, action) {
            const { activeTabKey, newSelectedList } = action.payload
            const newOrders = state.orders.map(item => {
                if (item.key && item.key === activeTabKey) {
                    return { ...item, selectedList: newSelectedList }
                }
            })
            return { ...state, orders: newOrders }
        },
        changeActiveSelectedKey(state, action) {
            const  { activeTabKey, tempActiveKey } = action.payload
            const newOrders = state.orders.map(item => {
                if (item.key && item.key === activeTabKey) {
                    return { ...item, activeKey: tempActiveKey }
                }
            })
            return { ...state, orders: newOrders }
        }
    }
}
