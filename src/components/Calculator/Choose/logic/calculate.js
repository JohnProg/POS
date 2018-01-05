import isNumber from '../../isNumber'
import { routerRedux } from 'dva/router';

function generateNewSelectedList(activeSelectedKey, selectedList, cache, number, type) {
    return selectedList.map(item => {
        if (item.Key === activeSelectedKey) {
            switch (type) {
                case 'count': 
                    return { ...item, CacheCount: cache, Count: number }
                case 'discount':
                    return { ...item, CacheDiscount: cache, Discount: number }
                case 'unitPrice':
                    return { ...item, CacheUnitPrice: cache, NewUnitPrice: number }
                default:
                    return item
            }
        }
        return item
    })
}

function numberHandler(oldCache, buttonName, activeTabKey, selectedList, activeSelectedKey, type, dispatch ) {
    let cache
    if (oldCache) {
        cache = oldCache.toString() + buttonName
    } else {
        cache = buttonName
    }
    const number = cache - 0
    const newSelectedList = generateNewSelectedList(activeSelectedKey, selectedList, cache, number, type)
    dispatch({type: 'commodity/changeSelectedList', payload: { activeTabKey, newSelectedList }})
}

function clearHandler(oldCache, activeTabKey, selectedList, activeSelectedKey, type, dispatch) {
    if (!oldCache) { return }
    const cache = null
    let number = 0
    if (type === 'unitPrice') { number = null }
    const newSelectedList = generateNewSelectedList(activeSelectedKey, selectedList, cache, number, type )
    dispatch({type: 'commodity/changeSelectedList', payload: { activeTabKey, newSelectedList }})
}

function dotHandler(oldCache, buttonName, activeTabKey, selectedList, activeSelectedKey, type, dispatch) {
    let cache
    let number
    if (!oldCache) {
        cache = '0.'
        number = 0
    } else {
        if (oldCache.indexOf('.') !== -1) { return }
        cache = oldCache.toString() + buttonName
        number = cache - 0
    }
    const newSelectedList = generateNewSelectedList(activeSelectedKey, selectedList, cache, number, type)
    dispatch({type: 'commodity/changeSelectedList', payload: { activeTabKey, newSelectedList }})
}

function delHandler(oldCache, buttonName, activeTabKey, selectedList, activeSelectedKey, type, dispatch) {
    let cache
    let number
        if (!oldCache) {
            return
        } else {
            const length = oldCache.length
            cache = oldCache.slice(0, length - 1)
            number = cache - 0
        }
    const newSelectedList = generateNewSelectedList(activeSelectedKey, selectedList, cache, number, type)
        dispatch({type: 'commodity/changeSelectedList', payload: { activeTabKey, newSelectedList }})
}

function countHandler(dispatch, buttonName, activeTabKey, selectedList, selectedItem, activeSelectedKey) {
    const oldCacheCount = selectedItem.CacheCount
    let newSelectedList
    let CacheCount
    if (isNumber(buttonName)) {
        numberHandler(oldCacheCount, buttonName, activeTabKey, selectedList, activeSelectedKey, 'count', dispatch)
    }
    if (buttonName === 'clear') {
        let filterIndex
        let tempActiveKey
        if (selectedItem.Count !== 0) {
            newSelectedList = selectedList.map(item => {
                if (item.Key === activeSelectedKey) {
                    return { ...item, CacheCount: null, Count: 0 }
                }
                return item
            })
        } else {
            newSelectedList = selectedList.filter((item, index) =>{
                if (item.Key === selectedItem.Key) {
                    filterIndex = index
                }
                return (item.Key !== selectedItem.Key)
            }).map((item, index) => {
                if (filterIndex === 0) {
                    if (index === 0) {
                        tempActiveKey = item.Key
                    }
                    return item
                } else {
                    if (index === filterIndex - 1) {
                        tempActiveKey = item.Key
                    }
                    return item
                } 
            }) 

        }
        dispatch({type: 'commodity/changeSelectedList', payload: { activeTabKey, newSelectedList, activeSelectedKey }})
        if (tempActiveKey !== undefined) {
            dispatch({type: 'commodity/changeActiveSelectedKey', payload: tempActiveKey })
        }
    }
    if (buttonName === '.') {
        return 
        dotHandler(oldCacheCount, buttonName, activeTabKey, selectedList, activeSelectedKey, 'count', dispatch)
    }
    if (buttonName === 'del') {
        delHandler(oldCacheCount, buttonName, activeTabKey, selectedList, activeSelectedKey, 'count', dispatch)
    }
    return
}
function discountHandler(dispatch, buttonName, activeTabKey, selectedList, selectedItem, activeSelectedKey) {
    const oldCacheDiscount = selectedItem.CacheDiscount
    let newSelectedList
    let CacheDiscount
    if (isNumber(buttonName)) {
        if (oldCacheDiscount) {
            CacheDiscount = oldCacheDiscount.toString() + buttonName
        } else {
            CacheDiscount = buttonName
        }
        let Discount = CacheDiscount - 0
        if (Discount > 100) {
            Discount = 100
            CacheDiscount = '100'
        }
        newSelectedList = selectedList.map(item => {
            if (item.Key === activeSelectedKey) {
                return { ...item, CacheDiscount, Discount }
            }
            return item
        })
        dispatch({type: 'commodity/changeSelectedList', payload: { activeTabKey, newSelectedList }})
    }
    if (buttonName === 'clear') {
        clearHandler(oldCacheDiscount, activeTabKey, selectedList, activeSelectedKey, 'discount', dispatch)
    }
    if (buttonName === 'del') {
        delHandler(oldCacheDiscount, buttonName, activeTabKey, selectedList, activeSelectedKey, 'discount', dispatch)
    }
    return
}

function unitPriceHandler(dispatch, buttonName, activeTabKey, selectedList, selectedItem, activeSelectedKey) {
    const oldCacheUnitPrice = selectedItem.CacheUnitPrice
    if (isNumber(buttonName)) {
        numberHandler(oldCacheUnitPrice, buttonName, activeTabKey, selectedList, activeSelectedKey, 'unitPrice', dispatch)
    }
    if (buttonName === 'clear') {
        clearHandler(oldCacheUnitPrice, activeTabKey, selectedList, activeSelectedKey, 'unitPrice', dispatch)
    }
    if (buttonName === '.') {
        dotHandler(oldCacheUnitPrice, buttonName, activeTabKey, selectedList, activeSelectedKey, 'unitPrice', dispatch)
    }
    if (buttonName === 'del') {
        delHandler(oldCacheUnitPrice, buttonName, activeTabKey, selectedList, activeSelectedKey, 'unitPrice', dispatch)
    }
    return
}

export default function calculate(commodity, dispatch, buttonName) {
    const activeTabKey = commodity.activeKey
    const currentOrder = commodity.orders.filter(item => (item.key === activeTabKey))[0]
    const { selectedList } = currentOrder
    if (buttonName === 'customer') { 
        dispatch(routerRedux.push('/pos/customer'));
        return
    }
    if (!selectedList || (Array.isArray(selectedList) && selectedList.length === 0))  { return }
    const activeSelectedKey = currentOrder.activeKey
    const selectedItem = currentOrder.selectedList.filter(item => (item.Key === activeSelectedKey))[0]
    const calculateType = selectedItem.CalculateType
    if(buttonName === 'count' || buttonName === 'discount' || buttonName === 'unitPrice') {
        if (selectedItem.CalculateType === buttonName) { return }
        dispatch({ type: 'commodity/changeCalculateType', payload: buttonName })
        return 
    }
    if (buttonName === 'warehouse') {
        console.log('warehouse')
        return
    }
    if (buttonName === 'allocateAndTransfer') {
        console.log('allocateAndTransfer')
        return
    }
    if (buttonName === 'payment') {
        dispatch(routerRedux.push('/pos/payment'));
        return
    }
    if (calculateType === 'count') {
        countHandler(dispatch, buttonName, activeTabKey, selectedList, selectedItem, activeSelectedKey)
    }
    if (calculateType === 'discount') {
        discountHandler(dispatch, buttonName, activeTabKey, selectedList, selectedItem, activeSelectedKey)
    }
    if (calculateType === 'unitPrice') {
        unitPriceHandler(dispatch, buttonName, activeTabKey, selectedList, selectedItem, activeSelectedKey)
    }
}


