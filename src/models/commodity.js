import { Badge } from 'antd'
import moment from 'moment'
import { fetchCommodityList } from '../services/api'

function getSelectedListFromCommodity() {

}

export default {
    namespace: 'commodity',

    state: {
        orders: [],
        activeKey: null,
        newTabIndex: 0,
    },

    effects: {
        *addToSelectedList(action, { put, select }) {
            const selectedKey = action.payload
            const { orders, activeKey } = yield select(state => state.commodity)
            const activeTabKey = activeKey
            const currentOrder = orders.filter(item => (item.key === activeKey))[0]
            const selectedList = currentOrder.selectedList
            let avoidDuplicationIndex = currentOrder.avoidDuplicationIndex
            const selectedItem = currentOrder.content.filter(item => (item.Key === selectedKey))[0]
            let newSelectedList
            function addNewToSelectedList(selectedItem, selectedList) {
                const newSelectedItem = { ...selectedItem,
                    Count: 1,
                    CalculateType: 'count',
                }
                return [ ...selectedList, newSelectedItem ]
            }
            const index = selectedList.find(item => item.Key === selectedItem.Key)
            if (!index) {
                newSelectedList = addNewToSelectedList(selectedItem, selectedList)
                yield put({type: 'changeSelectedList', payload: {activeTabKey, newSelectedList}})
            } else {
                let isLocked = false
                newSelectedList  = selectedList.map(item => {
                    if (item.Key === selectedKey) {
                        if (item.CacheDiscount) {
                            avoidDuplicationIndex = avoidDuplicationIndex + 1
                            isLocked = true
                            return { ...item, Key: `avoidDuplication-${avoidDuplicationIndex}-${item.Key}` }
                        }
                        if (item.NewUnitPrice) {
                            avoidDuplicationIndex = avoidDuplicationIndex + 1
                            isLocked = true
                            return { ...item, Key: `avoidDuplication-${avoidDuplicationIndex}-${item.Key}` }
                        }
                        return { ...item, Count: item.Count - 0 + 1, CacheCount: null }
                    } 
                    return item
                })
                if (isLocked) {
                    newSelectedList = addNewToSelectedList(selectedItem, newSelectedList)
                }
                yield put({type: 'changeSelectedList', payload: {activeTabKey, newSelectedList}})
            }
            yield put({type: 'changeActiveSelectedKey', payload: selectedKey})
            yield put({type: 'changeAvoidDuplicationIndex', payload: avoidDuplicationIndex})
        },
        *changeSelectedList(action, { put, select }) {
            const { activeTabKey, newSelectedList } = action.payload
            yield put({type: 'changeSelectedItem', payload: {activeTabKey, newSelectedList}})
            const { orders, activeKey } = yield select(state => state.commodity)
            const currentOrder = orders.filter(item => (item.key === activeTabKey))[0]
            const selectedList = currentOrder.selectedList
            let totalPrice = 0
            selectedList.forEach(item => {
                const unitPrice = (item.NewUnitPrice || item.NewUnitPrice === 0) ? item.NewUnitPrice : item.UnitPrice 
                const count = item.Count
                const discount = item.Discount
                const price = unitPrice * count * (discount || 100)/100
                totalPrice = totalPrice + price
            })
            yield put({type: 'changeTotalPrice', payload: totalPrice})
        },
        *clickAddButton(_, { put, call, select }) {
            const commodity = yield select(state => state.commodity)
            let count = ++commodity.newTabIndex
            yield put({type: 'addTab', payload: count})
            const { activeKey }= yield select(state => state.commodity)
            const { list } = yield call(fetchCommodityList)
            yield put({type: 'saveCommodityList', payload: {list, activeKey}})
        },
        *clickRemoveButton(action, { put, select }) {
            const currentIndex = action.payload
            const commodity = yield select(state => state.commodity)
            const orders = commodity.orders
            let activeKey
            yield put({type: 'removeTab'})
            // case1: panes 数量大于 1 且 activeOrders 不是最后一个
            if (orders.length > 1 && currentIndex !== orders.length - 1) {
                activeKey = orders[currentIndex + 1].key
            }
            // case2: panes 数量大于 1 且 activeOrders 是最后一个
            if (orders.length > 1 && currentIndex === orders.length - 1) {
                activeKey = orders[currentIndex - 1].key
            }
            // case3: panes 数量等于1, 确保始终有一个 TabPane 
            if (orders.length === 1) {
                activeKey = orders[currentIndex].key
            }
            yield put({type: 'changeTab', payload: activeKey})
        },
    },

    reducers: {
        addTab(state, action) {
            const count = action.payload
            const currentActiveKey = state.activeKey
            const timeStamp = moment().format('x')
            const localTime = moment().format('HH:mm')
            const tabsBarElement = (
                <div className="tabsContent">
                    <Badge count={count} overflowCount={1000} />
                    <span>{localTime}</span>
                </div>
            )
            const orders = [...state.orders,
                {
                    title: tabsBarElement,
                    key: `orders-${count}`,
                    selectedList: [],
                    activeKey: null,
                },
            ]
            const activeKey = `orders-${count}`;
            return { ...state, orders, activeKey, newTabIndex: count }
        },
        removeTab(state, action) {
            const activeTabKey = state.activeKey
            const orders = state.orders.filter(item => item.key !== activeTabKey)
            if (orders.length > 0) {
                return { ...state, orders }
            }
            return state
        },
        changeTab(state, action) {
            const activeKey = action.payload
            return { ...state, activeKey }
        },
        saveCommodityList(state, action) {
            const {list, activeKey} = action.payload || []
            const newOrders = state.orders.map(item => {
                if (item.key && item.key === activeKey) {
                    return { ...item, content: list, avoidDuplicationIndex: 0, phase: 'choose' }
                }
                return item
            })
            return { ...state, orders: newOrders }
        },
        toggleSelectedGoods(state, action) {
            const activeSelectedKey = action.payload
            const activeTabKey = state.activeKey
            const newOrders = state.orders.map(item => {
                if (item.key && item.key === activeTabKey) {
                    return { ...item,  activeKey: activeSelectedKey, }
                } return item
            })
            return { ...state, orders: newOrders }
        },
        changeTotalPrice(state, action) {
            const totalPrice = action.payload
            const activeTabKey = state.activeKey
            const newOrders = state.orders.map(item => {
                if (item.key && item.key === activeTabKey) {
                    return { ...item,  totalPrice, }
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
                    return { ...item, CalculateType: calculateType, CacheCount: null, CacheDiscount: null, CacheUnitPrice: null, }
                }
                return item
            })
            const newOrders = state.orders.map(item => {
                if (item.key && item.key === activeTabKey) {
                    return { ...item, selectedList: newSelectedList }
                }
                return item
            })
            return { ...state, orders: newOrders }
        },
        changeSelectedItem(state, action) {
            const { activeTabKey, newSelectedList } = action.payload
            const newOrders = state.orders.map(item => {
                if (item.key && item.key === activeTabKey) {
                    return { ...item, selectedList: newSelectedList }
                }
                return item
            })
            return { ...state, orders: newOrders }
        },
        changeActiveSelectedKey(state, action) {
            const  tempActiveKey = action.payload
            const activeTabKey = state.activeKey
            const newOrders = state.orders.map(item => {
                if (item.key && item.key === activeTabKey) {
                    return { ...item, activeKey: tempActiveKey }
                }
                return item
            })
            return { ...state, orders: newOrders }
        },
        changeAvoidDuplicationIndex(state, action) {
            const avoidDuplicationIndex = action.payload
            const activeTabKey = state.activeKey
            const newOrders = state.orders.map(item => {
                if (item.key && item.key === activeTabKey) {
                    return { ...item, avoidDuplicationIndex }
                }
                return item
            })
            return { ...state, orders: newOrders }
        },
        changePhase(state, action) {
            const { activeTabKey, phase } = action.payload
            const newOrders = state.orders.map(item => {
                if (item.key && item.key === activeTabKey) {
                    return { ...item, phase }
                }
                return item
            })
            return { ...state, orders: newOrders }
        },
    }
}
