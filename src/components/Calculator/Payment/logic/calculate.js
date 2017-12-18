import isNumber from '../../isNumber'

function countHandler(dispatch, buttonName, paymentData, activePaymentDataIndex, paymentDataItem) {
}

export default function calculate(commodity, dispatch, buttonName) {
    const activeTabKey = commodity.activeKey
    const currentOrder = commodity.orders.filter(item => (item.key === activeTabKey))[0]
    const { paymentData, activePaymentDataIndex } = currentOrder
    // console.log(activePaymentDataIndex)
    if (!paymentData || (Array.isArray(paymentData) && paymentData.length === 0) || (activePaymentDataIndex === null))  { return }
    const paymentDataItem = paymentData.filter((item, index) => (index === activePaymentDataIndex))[0]
    countHandler(dispatch, buttonName, paymentData, activePaymentDataIndex, paymentDataItem )
    // const calculateType = selectedItem.CalculateType
    // if(buttonName === 'count' || buttonName === 'discount' || buttonName === 'unitPrice') {
    //     if (selectedItem.CalculateType === buttonName) { return }
    //     dispatch({ type: 'commodity/changeCalculateType', payload: buttonName })
    //     return
    // }
    // if (buttonName === 'customer') {
    //     console.log('customer')
    //     return
    // }
    // if (buttonName === 'payment') {
    //     paymentHandler(activeTabKey, dispatch)
    // }
    // if (calculateType === 'count') {
    //     countHandler(dispatch, buttonName, activeTabKey, selectedList, selectedItem, activeSelectedKey)
    // }
    // if (calculateType === 'discount') {
    //     discountHandler(dispatch, buttonName, activeTabKey, selectedList, selectedItem, activeSelectedKey)
    // }
    // if (calculateType === 'unitPrice') {
    //     unitPriceHandler(dispatch, buttonName, activeTabKey, selectedList, selectedItem, activeSelectedKey)
    // }
}


