import isNumber from '../../isNumber'

function countHandler(dispatch, buttonName, activeTabKey, selectedList, selectedItem, activeSelectedKey) {
    const oldCacheCount = selectedItem.CacheCount
    let newSelectedList
    let CacheCount
    if (isNumber(buttonName)) {
        if (oldCacheCount) {
            CacheCount = oldCacheCount.toString() + buttonName
            newSelectedList = selectedList.map(item => {
                if (item.Key === activeSelectedKey) {
                    return { ...item, CacheCount, Count: CacheCount - 0 }
                }
                return item
            })
        } else {
            CacheCount = buttonName
            newSelectedList = selectedList.map(item => {
                if (item.Key === activeSelectedKey) {
                    return { ...item, CacheCount, Count: CacheCount - 0 }
                }
                return item
            })
        }
        dispatch({type: 'commodity/changeSelectedItemCount', payload: { activeTabKey, newSelectedList }})
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
        dispatch({type: 'commodity/changeSelectedItemCount', payload: { activeTabKey, newSelectedList, activeSelectedKey }})
        if (tempActiveKey !== undefined) {
            dispatch({type: 'commodity/changeActiveSelectedKey', payload: { activeTabKey, tempActiveKey }})
        }
    }
    if (buttonName === '.') {
        if (!oldCacheCount) {
            CacheCount = '0.'
            newSelectedList = selectedList.map(item => {
                if (item.Key === activeSelectedKey) {
                    return { ...item, CacheCount, Count: 0, }
                }
                return item
            })
        } else {
            if (oldCacheCount.indexOf('.') !== -1) { return } 
            else {
                CacheCount = oldCacheCount.toString() + buttonName
                newSelectedList = selectedList.map(item => {
                    if (item.Key === activeSelectedKey) {
                        return { ...item, CacheCount, Count: CacheCount - 0, }
                    }
                    return item
                })
            }
        }
        dispatch({type: 'commodity/changeSelectedItemCount', payload: { activeTabKey, newSelectedList }})
    }
    if (buttonName === 'del') {
        if (!oldCacheCount) {
            return
        } else {
            const length = oldCacheCount.length
            const newCacheCount = oldCacheCount.slice(0, length - 1)
            newSelectedList = selectedList.map(item => {
                if (item.Key === activeSelectedKey) {
                    return { ...item, CacheCount: newCacheCount, Count: newCacheCount - 0, }
                }
                return item
            })
        }
        dispatch({type: 'commodity/changeSelectedItemCount', payload: { activeTabKey, newSelectedList }})
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
        dispatch({type: 'commodity/changeSelectedItemCount', payload: { activeTabKey, newSelectedList }})
    }
    if (buttonName === 'clear') {
        newSelectedList = selectedList.map(item => {
            if (item.Key === activeSelectedKey) {
                return { ...item, CacheDiscount: null, Discount: null }
            }
            return item
        })
        dispatch({type: 'commodity/changeSelectedItemCount', payload: { activeTabKey, newSelectedList }})
    }
    if (buttonName === 'del') {
        if (!oldCacheDiscount) {
            return
        } else {
            const length = oldCacheDiscount.length
            let newCacheDiscount
            if (length === 1) { newCacheDiscount = null }
            newCacheDiscount = oldCacheDiscount.slice(0, length - 1)
            newSelectedList = selectedList.map(item => {
                if (item.Key === activeSelectedKey) {
                    return { ...item, CacheDiscount: newCacheDiscount, Discount: newCacheDiscount - 0, }
                }
                return item
            })
        }
        dispatch({type: 'commodity/changeSelectedItemCount', payload: { activeTabKey, newSelectedList }})
    }
    return
}

export default function calculate(commodity, dispatch, buttonName) {
    const activeTabKey = commodity.activeKey
    const currentOrder = commodity.orders.filter(item => (item.key === activeTabKey))[0]
    const { selectedList } = currentOrder
    const activeSelectedKey = currentOrder.activeKey
    if (!selectedList || selectedList.length === 0) { return }
    if(buttonName === 'count' || buttonName === 'discount' || buttonName === 'unitPrice') {
        dispatch({ type: 'commodity/changeCalculateType', payload: buttonName })
        return 
    }
    const selectedItem = currentOrder.selectedList.filter(item => (item.Key === activeSelectedKey))[0]
    const calculateType = selectedItem.CalculateType
    if (calculateType === 'count') {
        countHandler(dispatch, buttonName, activeTabKey, selectedList, selectedItem, activeSelectedKey)
    }
    if (calculateType === 'discount') {
        discountHandler(dispatch, buttonName, activeTabKey, selectedList, selectedItem, activeSelectedKey)
    }
}

