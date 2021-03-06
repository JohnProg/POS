import moment from 'moment';
import key from 'keymaster';
import { fetchCommodityList, fetchCustomerList, submitCustomer, getCustomer, deleteCustomer, updateCustomer, getMilkPowderGoods, addOrUpdateCacheOrder, fetchWaybill, submitOrder, getStoreSaleGoods, getStoreWholeSaleGoods, } from '../services/api';
import { message } from 'antd';
import { POS_TAB_TYPE, POS_PHASE, SALE_TYPE } from '../constant'
import { calculateExpressOrShippingCost } from '../utils/utils';

function getCurrentOrder(state) {
  return state.orders.filter(item => item.key === state.activeTabKey)[0];
}

function getCurrentContent(currentOrder, state) {
  const { type } = currentOrder
  switch(type) {
    case POS_TAB_TYPE.MILKPOWDER: {
      return state.milkPowderGoodsList
    }
    case POS_TAB_TYPE.STORESALE: {
      return state.storeSaleGoodsList
    }
    default: {
      return []
    }
  }
}


export default {
  namespace: 'commodity',

  state: {
    orders: [],
    // operationButton: ['add', 'minus'],
    // activeKey: null,
    activeTabKey: null,
    commonLoading: false,
    newTabIndex: 0,
    customerList: [],
    storeSaleGoodsList: [],
    milkPowderGoodsList: [],
    storeWholesaleGoodsList: [],
    currentOrderGoodsList: [],
    pagination: {
      pagingData: [],
      pageSize: 100,
      total: null,
      current: 1,
    },
  },

  subscriptions: {
    keyboardWatcher({ dispatch }) {
      key('⌘+up, ctrl+up', () => { dispatch({ type: 'keyBoardOperationChooseCalculator' }); });
      if (key.isPressed('M')) alert('M key is pressed, can ya believe it!?');
    },
  },
  effects: {
    *addOrUpdateCacheOrder(action, { put, call }) {
      const { payload } = action
      const response = yield call(addOrUpdateCacheOrder, payload)
      if (response.Status) {
        const payload = response.Result.Data
        yield put({type: 'changeOrderID', payload})
        } else {
          message.error('获取失败')
        }
    },
    *goodsListPagingHandler(action, { put, select }) {
      const totalData = action.payload
      const length = totalData.length
      yield put({type: 'changePaginationTotal', payload: length})
      const commodity = yield select(state => state.commodity);
      const { pagination } = commodity || {}
      const { pageSize } = pagination || {}
      const pageTotalNumber = Math.ceil(length/pageSize)
      const newData = []
      let startNumber = 0
      let endNumber = pageSize
      for (let i=0; i<pageTotalNumber; i++) {
        newData.push(totalData.slice(startNumber, endNumber))
        startNumber += pageSize
        endNumber += pageSize
      }
      yield put({type: 'changePaginationPagingData', payload: newData})
    },
    *getMilkPowderGoods(action, { put, call}) {
      const { payload } = action
      yield put({
        type: 'changeCommonLoading',
        payload: true,
      })
      const response = yield call(getMilkPowderGoods)
      yield put({
        type: 'changeCommonLoading',
        payload: false,
      })
      if (response.Status) {
        const data = response.Result.Data
      const payload = data.map(item => ({ ...item, Key: item.Sku }))
        yield put({type: 'saveMilkPowderGoodsList', payload})
        yield put({type: 'goodsListPagingHandler', payload})
        yield put({type: 'changeCurrentOrderGoodsList', payload})
        } else {
          message.error('获取失败')
        }
    },
    *getStoreSaleGoods(action, { put, call}) {
      const { payload } = action
      yield put({
        type: 'changeCommonLoading',
        payload: true,
      })
      const response = yield call(getStoreSaleGoods)
      yield put({
        type: 'changeCommonLoading',
        payload: false,
      })
      if (response.Status) {
        const data = response.Result.Data
        const payload = data.map(item => ({ ...item, Key: item.Sku, SaleType: SALE_TYPE.LOCAL }))
        yield put({type: 'saveStoreSaleGoodsList', payload})
        yield put({type: 'goodsListPagingHandler', payload})
        yield put({type: 'changeCurrentOrderGoodsList', payload})
        } else {
          message.error('获取失败')
        }
    },
    *getStoreWholeSaleGoods(action, { put, call}) {
      const { payload } = action
      yield put({
        type: 'changeCommonLoading',
        payload: true,
      })
      const response = yield call(getStoreWholeSaleGoods)
      yield put({
        type: 'changeCommonLoading',
        payload: false,
      })
      if (response.Status) {
        const data = response.Result.Data
      const payload = data.map(item => ({ ...item, Key: item.Sku }))
      console.log('payload', payload)
        yield put({type: 'saveStoreWholeSaleGoodsList', payload})
        yield put({type: 'goodsListPagingHandler', payload})
        yield put({type: 'changeCurrentOrderGoodsList', payload})
        } else {
          message.error('获取失败')
        }
    },
    *getCustomer(action, { put, call}) {
      const { payload } = action
      yield put({
        type: 'changeCommonLoading',
        payload: true,
      })
      const response = yield call(getCustomer, payload)
      yield put({
        type: 'changeCommonLoading',
        payload: false,
      })
      if (response.Status) {
        const payload = response.Result.Data
        yield put({type: 'saveCustomerList', payload})
        } else {
          message.error('获取失败')
        }
    },
    *submitCustomer(action, { put, call }) {
      const { payload } = action
      yield put({
        type: 'changeCommonLoading',
        payload: true,
      })
      try {
      const response = yield call(submitCustomer, payload)
      if (response.Status) {
         message.success('提交成功')
        } else {
          message.error('提交失败')
        }
        yield put({type: 'getCustomer'})
      } catch (e) {
      }
      yield put({
        type: 'changeCommonLoading',
        payload: false,
      })
    },
    *deleteCustomer(action, { put, call }) {
      const { payload } = action
      yield put({
        type: 'changeCommonLoading',
        payload: true,
      })
      try {
      const response = yield call(deleteCustomer, payload)
      if (response.Status) {
         message.success('删除成功')
        } else {
          message.error('删除失败')
        }
        yield put({type: 'getCustomer'})
      } catch (e) {
      }
      yield put({
        type: 'changeCommonLoading',
        payload: false,
      })
    },
    *updateCustomer(action, { put, call }) {
      const { payload } = action
      yield put({
        type: 'changeCommonLoading',
        payload: true,
      })
      try {
      const response = yield call(updateCustomer, payload)
      if (response.Status) {
         message.success('更新成功')
        } else {
          message.error('更新失败')
        }
        yield put({type: 'getCustomer'})
      } catch (e) {
      }
      yield put({
        type: 'changeCommonLoading',
        payload: false,
      })
    },
    *fetchWaybill(action, { call, put }) {
      const { dataJson, setFieldsValueCallback } = action.payload
      yield put({
        type: 'changeCommonLoading',
        payload: true,
      })
      try {
      const response = yield call(fetchWaybill, dataJson)
      if (response.Status) {
         message.success('抓取成功')
         setFieldsValueCallback({waybill: response.Result.Data})
        } else {
          message.error('抓取失败')
        }
      } catch (e) {
      }
      yield put({
        type: 'changeCommonLoading',
        payload: false,
      })
    },
    *submitOrder(action, { call, put }) {
      const { payload } = action
      yield put({
        type: 'changeCommonLoading',
        payload: true,
      })
      try {
      const response = yield call(submitOrder, payload)
      if (response.Status) {
         message.success('提交成功')
        } else {
          message.error('提交失败')
        }
      } catch (e) {
      }
      yield put({
        type: 'changeCommonLoading',
        payload: false,
      })
    },
    *storageButtonDOM(action, { put }) {
      const button = action.payload;
    },
    *changePaymentDataAndCheck(action, { put }) {
      const paymentData = action.payload;
      yield put({ type: 'changePaymentData', payload: paymentData });
      yield put({ type: 'checkPaymentData' });
    },
    *clickGoodsItemTrue(action, { put, select }) {
      const commodity = yield select(state => state.commodity);
      const currentOrder = getCurrentOrder(commodity);
      const content = getCurrentContent(currentOrder, commodity)
      const key = action.payload;
      const newContent = content.map((item) => {
        if (item.Key === key) {
          return { ...item, dataClicked: 'true' };
        }
        return item;
      });
      yield put({ type: 'changeCommodityContent', payload: newContent });
    },
    *clickGoodsItem(action, { put, select }) {
      const commodity = yield select(state => state.commodity);
      const currentOrder = getCurrentOrder(commodity);
      const content = getCurrentContent(currentOrder, commodity)
      const key = action.payload;
      const newContent = content.map((item) => {
        if (item.Sku === key) {
          return { ...item, dataClicked: null };
        }
        return item;
      });
      yield put({ type: 'changeCommodityContent', payload: newContent });
      yield put({ type: 'addToSelectedList', payload: key });
    },
    *clickPaymentMethodButton(action, { put, select }) {
      const paymentMethod = action.payload;
      const commodity = yield select(state => state.commodity);
      const currentOrder = getCurrentOrder(commodity);
      const { paymentData, paymentDataIndex } = currentOrder;
      const activePaymentDataIndex = paymentData.length;
      yield put({ type: 'changePaymentDataIndex', payload: paymentDataIndex });
      const newPaymentData = [...paymentData, {
        demand: 0,
        cash: 0,
        giveChange: 0,
        method: paymentMethod.value,
        key: paymentDataIndex,
        cacheCash: null,
      }];
      yield put({ type: 'changePaymentData', payload: newPaymentData });
      yield put({ type: 'changeActivePaymentDataIndex', payload: activePaymentDataIndex });
      yield put({ type: 'checkPaymentData' });
    },
    *clickRemovePaymentDataItemButton(action, { put, select }) {
      const removeIndex = action.payload;
      const commodity = yield select(state => state.commodity);
      const currentOrder = getCurrentOrder(commodity);
      const { paymentData, activePaymentDataIndex } = currentOrder;
      const newPaymentData = paymentData.filter((item, index) => {
        return index !== removeIndex;
      });
      yield put({ type: 'changePaymentData', payload: newPaymentData });
      yield put({ type: 'changeActivePaymentDataIndex', payload: activePaymentDataIndex });
      yield put({ type: 'checkPaymentData' });
    },
    *checkPaymentData(action, { put, select }) {
      const commodity = yield select(state => state.commodity);
      const currentOrder = getCurrentOrder(commodity);
      const { paymentData, activePaymentDataIndex, totalPrice } = currentOrder;
      const currentItem = paymentData.filter((item, index) => index === activePaymentDataIndex)[0];
      function generateDemand(prevDemand, prevCash) {
        if (prevDemand > prevCash) {
          return prevDemand - prevCash;
        } else {
          return 0;
        }
      }
      function generateGiveChange(demand, cash) {
        if (cash > demand) {
          return cash - demand;
        } else {
          return 0;
        }
      }
      let newPaymentData
      let prevItem;
      if (!currentItem) {
        newPaymentData = []
      } else {
        newPaymentData = paymentData.map((item, index) => {
          if (index === 0) {
            prevItem = { ...item, demand: totalPrice, giveChange: generateGiveChange(totalPrice, item.cash) };
            return prevItem;
          } else {
            const demand = generateDemand(prevItem.demand, prevItem.cash);
            prevItem = { ...item, demand, giveChange: generateGiveChange(demand, item.cash) };
            return prevItem;
          }
      });
         }
      yield put({ type: 'changePaymentData', payload: newPaymentData });
      yield put({ type: 'sumChangeMoney', payload: newPaymentData });
      yield put({ type: 'sumRealMoney', payload: paymentData });
    },
    *sumChangeMoney(action, { put }) {
      const paymentData = action.payload;
      let changeMoney = 0;
      paymentData.forEach((item) => {
        changeMoney += item.giveChange;
      });
      yield put({ type: 'changeChangeMoney', payload: changeMoney });
    },
    *sumRealMoney(action, { put }) {
      const paymentData = action.payload;
      let realMoney = 0;
      paymentData.forEach((item) => {
        realMoney += item.cash;
      });
      yield put({ type: 'changeRealMoney', payload: realMoney });
    },
    *addToSelectedList(action, { put, select }) {
      const selectedKey = action.payload;
      const commodity = yield select(state => state.commodity);
      const { orders, activeTabKey, pagination } = commodity
      const { pagingData, current } = pagination || {}
      const currentOrder = getCurrentOrder(commodity);
      // const currentGoodsList = getCurrentContent(currentOrder, commodity)
      const currentGoodsList = pagingData[current - 1]
      const { selectedList } = currentOrder;
      let { avoidDuplicationIndex } = currentOrder;
      const selectedItem = currentGoodsList.filter(item => (item.Key === selectedKey))[0];
      let newSelectedList;
      function addNewToSelectedList(selectedItem, selectedList) {
        const newSelectedItem = {
          ...selectedItem,
          Count: 1,
          CalculateType: 'count',
          RealPrice: selectedItem.RetailPrice,
        };
        return [...selectedList, newSelectedItem];
      }
      const index = selectedList.find(item => item.Key === selectedItem.Key);
      if (!index) {
        newSelectedList = addNewToSelectedList(selectedItem, selectedList);
        yield put({ type: 'changeSelectedList', payload: { activeTabKey, newSelectedList } });
      } else {
        let isLocked = false;
        newSelectedList = selectedList.map((item) => {
          if (item.Key === selectedKey) {
            if (item.CacheDiscount) {
              avoidDuplicationIndex += 1;
              isLocked = true;
              return { ...item, Key: `avoidDuplication-${avoidDuplicationIndex}-${item.Key}` };
            }
            if (item.NewUnitPrice) {
              avoidDuplicationIndex += 1;
              isLocked = true;
              return { ...item, Key: `avoidDuplication-${avoidDuplicationIndex}-${item.Key}` };
            }
            return { ...item, Count: item.Count - 0 + 1, CacheCount: null };
          }
          return item;
        });
        if (isLocked) {
          newSelectedList = addNewToSelectedList(selectedItem, newSelectedList);
        }
        yield put({ type: 'changeSelectedList', payload: { activeTabKey, newSelectedList } });
      }
      yield put({ type: 'changeActiveSelectedKey', payload: selectedKey });
      yield put({ type: 'changeAvoidDuplicationIndex', payload: avoidDuplicationIndex });
    },
    *changeSelectedList(action, { put, select }) {
      const { activeTabKey, newSelectedList } = action.payload;
      yield put({ type: 'changeSelectedItem', payload: { activeTabKey, newSelectedList } });
      const { orders } = yield select(state => state.commodity);
      const currentOrder = orders.filter(item => (item.key === activeTabKey))[0];
      const selectedList = currentOrder.selectedList;
      let goodsPrice = 0;
      let originPrice = 0;
      let totalWeight = 0;
      selectedList.forEach((item) => {
        const unitPrice = (item.NewUnitPrice || item.NewUnitPrice === 0) ? item.NewUnitPrice : item.RetailPrice
        const retailPrice = item.RetailPrice
        const count = item.Count;
        const discount = item.Discount;
        const weight = item.Weight
        const price = unitPrice * count * (discount || 100) / 100;
        goodsPrice += price;
        originPrice += retailPrice * count
        totalWeight += weight * count
      });
      yield put({ type: 'changeGoodsPrice', payload: goodsPrice });
      yield put({ type: 'changeOriginPrice', payload: originPrice })
      yield put({ type: 'changeTotalWeight', payload: totalWeight })
      yield put({ type: 'sumTotalPrice' });
    },
    *clickAddTabButton(action, { put, select }) {
      const tabType = action.payload;
      const commodity = yield select(state => state.commodity);
      const count = commodity.newTabIndex + 1;
      const currentTime = moment().format('HH:mm');
      const createTime = moment().format('YYYY-MM-DD HH:mm')
      yield put({ type: 'addTab', payload: { count, tabType, currentTime, createTime } });
      // const { activeKey }= yield select(state => state.commodity)
      if (tabType === POS_TAB_TYPE.STORESALE) {
        yield put({type: 'getStoreSaleGoods'})
      }
      if (tabType === POS_TAB_TYPE.MILKPOWDER) {
        yield put({type: 'getMilkPowderGoods'})
      }
      if (tabType === POS_TAB_TYPE.WHOLESALE) {
        yield put({type: 'getStoreWholeSaleGoods'})
      }
    },
    *clickTab(action, { put, select }) {
      const activeTabKey = action.payload;
      yield put({type: 'changeActiveTabKey', payload: activeTabKey});
      const commodity = yield select(state => state.commodity);
      const { storeSaleGoodsList, milkPowderGoodsList, wholesaleGoodsList } = commodity
      const currentOrder = getCurrentOrder(commodity);
      const { type } = currentOrder;
      let currentOrderGoodsList = []
      switch(type) {
        case POS_TAB_TYPE.STORESALE: {
          currentOrderGoodsList = storeSaleGoodsList
          break;
        }
        case POS_TAB_TYPE.MILKPOWDER: {
          currentOrderGoodsList = milkPowderGoodsList
          break;
        }
        case POS_TAB_TYPE.WHOLESALE: {
          currentOrderGoodsList = wholeSaleGoodsList
          break;
        }
        default: {
          currentOrderGoodsList = []
        }
      }
      yield put({ type: 'goodsListPagingHandler', payload: currentOrderGoodsList })
      yield put({type: 'changeCurrentOrderGoodsList', payload: currentOrderGoodsList})
    },
    *clickRemoveButton(action, { put, select }) {
      const currentIndex = action.payload;
      const commodity = yield select(state => state.commodity);
      const { orders } = commodity;
      let activeTabKey;
      yield put({ type: 'removeTab' });
      // case1: panes 数量大于 1 且 activeOrders 不是最后一个
      if (orders.length > 1 && currentIndex !== orders.length - 1) {
        activeTabKey = orders[currentIndex + 1].key;
      }
      // case2: panes 数量大于 1 且 activeOrders 是最后一个
      if (orders.length > 1 && currentIndex === orders.length - 1) {
        activeTabKey = orders[currentIndex - 1].key;
      }
      // case3: panes 数量等于1, 确保始终有一个 TabPane
      if (orders.length === 1) {
        activeTabKey = orders[currentIndex].key;
      }
      yield put({ type: 'changeActiveTabKey', payload: activeTabKey });
    },
    *clickChangeSaleTypeButton(action, { put, select }) {
      const saleType = action.payload;
      if (saleType === SALE_TYPE.LOCAL) {
        yield put({type: 'changeExpressDataAndSumCost', payload: []})
        yield put({type: 'changeShippingDataAndSumCost', payload: []})
      }
      if (saleType === SALE_TYPE.EXPRESS) {
        yield put({type: 'changeShippingDataAndSumCost', payload: []})
      }
      if (saleType === SALE_TYPE.SHIPPING) {
        yield put({type: 'changeExpressDataAndSumCost', payload: []})
        yield put({type: 'changeShippingDataAndSumCost', payload: [{ Name: {Name: '', ID: ''}, Weight: 0, WeightedWeight: 0.3, UnitPrice: 0, RealPrice: 0, InvoiceNo: '', ID: 0, }]})
      }
      const { orders, activeTabKey } = yield select(state => state.commodity);
      const currentOrder = orders.filter(item => (item.key === activeTabKey))[0];
      const { selectedList } = currentOrder;
      const newSelectedList = selectedList.map(item => ({ ...item, SaleType: saleType }));
      yield put({ type: 'changeSaleType', payload: saleType });
      yield put({ type: 'changeSelectedList', payload: { activeTabKey, newSelectedList } });
    },
    *clickAddBoxButton(action, { put, select }) {
      const commodity = yield select(state => state.commodity);
      const currentOrder = getCurrentOrder(commodity);
      const { expressData, expressDataIndex } = currentOrder;
      const newMember = {
        ID: `NEW_BOX_ID_${expressDataIndex}`,
        Name: {Name: '', ID: ''},
        Weight: 0,
        WeightedWeight: 0.3,
        UnitPrice: 0,
        RealPrice: 0,
        InvoiceNo: '',
      };
      const newExpressData = [...expressData, newMember];
      yield put({ type: 'changeExpressData', payload: newExpressData });
      yield put({ type: 'changeExpressDataIndex', payload: expressDataIndex });
    },
    *changeExpressDataAndSumCost(action, { put }) {
      const expressData = action.payload;
      yield put({ type: 'changeExpressData', payload: expressData });
      yield put({ type: 'sumExpressCost', payload: expressData });
    },
    *changeShippingDataAndSumCost(action, { put }) {
      const shippingData = action.payload;
      yield put({ type: 'changeShippingData', payload: shippingData });
      yield put({ type: 'sumShippingCost', payload: shippingData });
    },
    *sumExpressCost(action, { put }) {
      const expressData = action.payload;
      let expressCost = 0;
      expressData.forEach((item) => {
        item.UnitPrice && (expressCost += calculateExpressOrShippingCost(item.UnitPrice, item.Weight, item.WeightedWeight));
      });
      yield put({ type: 'changeExpressCost', payload: expressCost });
      yield put({ type: 'sumTotalPrice' });
    },
    *sumShippingCost(action, { put }) {
      const shippingData = action.payload;
      let shippingCost = 0;
      shippingData.forEach((item) => {
        item.UnitPrice && (shippingCost += calculateExpressOrShippingCost(item.UnitPrice, item.Weight, item.WeightedWeight));
      });
      yield put({ type: 'changeShippingCost', payload: shippingCost });
      yield put({ type: 'sumTotalPrice' });
    },
    *sumTotalPrice(action, { put, select }) {
      const commodity = yield select(state => state.commodity);
      const currentOrder = getCurrentOrder(commodity);
      const { goodsPrice, expressCost, shippingCost } = currentOrder;
      const totalPrice = goodsPrice + expressCost + shippingCost;
      yield put({ type: 'changeTotalPrice', payload: totalPrice });
      yield put({ type: 'checkPaymentData' });
    },
  },

  reducers: {
    addTab(state, action) {
      const { count, tabType, currentTime, createTime } = action.payload;
      const goodsOrders = state.orders;
      const orders = [
        ...goodsOrders,
        {
          title: count,
          key: `orders-${count}`,
          selectedList: [],
          activeSelectedKey: null,
          paymentDataIndex: 0,
          paymentData: [],
          activePaymentDataIndex: null,
          originPrice: 0,
          goodsPrice: 0,
          expressDataIndex: 0,
          expressData: [],
          shippingData: [{ Name: {Name: '', ID: ''}, Weight: 0, WeightedWeight: 0.3, UnitPrice: 0, RealPrice: 0, InvoiceNo: '', ID: 0, }],
          expressCost: 0,
          shippingCost: 0,
          totalPrice: 0,
          realMoney: 0,
          changeMoney: 0,
          type: tabType,
          currentTime,
          createTime,
          saleType: tabType === POS_TAB_TYPE.STORESALE ? SALE_TYPE.LOCAL : null,
          customer: {
            memberID: '1',
            memberName: 'orssica',
          },
          shop: {
            departmentID: '1',
            shopName: '澳西卡',
          },
          avoidDuplicationIndex: 0,
          targetPhase: POS_PHASE.LIST,
          lastPhase: POS_PHASE.LIST,
          totalWeight: 0,
        },
      ];
      const activeTabKey = `orders-${count}`;
      return { ...state, orders, activeTabKey, newTabIndex: count };
    },
    removeTab(state, action) {
      const { activeTabKey } = state;
      const orders = state.orders.filter(item => item.key !== activeTabKey);
      if (orders.length > 0) {
        return { ...state, orders };
      }
      return state;
    },
    changeActiveTabKey(state, action) {
      const activeTabKey = action.payload;
      return { ...state, activeTabKey };
    },
    changeCommodityContent(state, action) {
      const { activeTabKey } = state;
      const currentOrder = state.orders.filter(item => (item.key === activeTabKey))[0];
      const { type } = currentOrder
      const content = action.payload || [];
      switch(type) {
        case POS_TAB_TYPE.MILKPOWDER: {
          return { ...state, milkPowderGoodsList: content }
        }
        default: {
          return state
        }
      }
    },
    toggleSelectedGoods(state, action) {
      const activeSelectedKey = action.payload;
      const { activeTabKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key && item.key === activeTabKey) {
          return { ...item, activeSelectedKey };
        } return item;
      });
      return { ...state, orders: newOrders };
    },
    changeGoodsPrice(state, action) {
      const goodsPrice = action.payload;
      const { activeTabKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key && item.key === activeTabKey) {
          return { ...item, goodsPrice };
        } return item;
      });
      return { ...state, orders: newOrders };
    },
    changeOriginPrice(state, action) {
      const originPrice = action.payload;
      const { activeTabKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key && item.key === activeTabKey) {
          return { ...item, originPrice };
        } return item;
      });
      return { ...state, orders: newOrders };
    },
    changeTotalWeight(state, action) {
      const totalWeight = action.payload;
      const { activeTabKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key && item.key === activeTabKey) {
          return { ...item, totalWeight };
        } return item;
      });
      return { ...state, orders: newOrders };
    },
    changeCalculateType(state, action) {
      const calculateType = action.payload;
      const { activeTabKey } = state
      const currentOrder = state.orders.filter(item => (item.key === activeTabKey))[0];
      const selectedList = currentOrder.selectedList;
      const { activeSelectedKey } = currentOrder;
      const newSelectedList = selectedList.map((item) => {
        if (item.Key === activeSelectedKey) {
          return { ...item, CalculateType: calculateType, CacheCount: null, CacheDiscount: null, CacheUnitPrice: null };
        }
        return item;
      });
      const newOrders = state.orders.map((item) => {
        if (item.key && item.key === activeTabKey) {
          return { ...item, selectedList: newSelectedList };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeSelectedItem(state, action) {
      const { activeTabKey, newSelectedList } = action.payload;
      const newOrders = state.orders.map((item) => {
        if (item.key && item.key === activeTabKey) {
          return { ...item, selectedList: newSelectedList };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeActiveSelectedKey(state, action) {
      const activeSelectedKey = action.payload;
      const { activeTabKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key && item.key === activeTabKey) {
          return { ...item, activeSelectedKey };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeAvoidDuplicationIndex(state, action) {
      const avoidDuplicationIndex = action.payload;
      const { activeTabKey } = state
      const newOrders = state.orders.map((item) => {
        if (item.key && item.key === activeTabKey) {
          return { ...item, avoidDuplicationIndex };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changePosPhase(state, action) {
      const { activeTabKey, lastPhase, targetPhase } = action.payload;
      const newOrders = state.orders.map((item) => {
        if (item.key && item.key === activeTabKey) {
          return { ...item, lastPhase, targetPhase };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeSaleType(state, action) {
      const saleType = action.payload;
      const { activeTabKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeTabKey) {
          return { ...item, saleType };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changePaymentData(state, action) {
      const paymentData = action.payload;
      const { activeTabKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeTabKey) {
          return { ...item, paymentData };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changePaymentDataIndex(state, action) {
      let paymentDataIndex = action.payload;
      const { activeTabKey } = state;
      paymentDataIndex += 1;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeTabKey) {
          return { ...item, paymentDataIndex };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeExpressDataIndex(state, action) {
      let expressDataIndex = action.payload;
      const { activeTabKey } = state;
      expressDataIndex += 1;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeTabKey) {
          return { ...item, expressDataIndex };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeExpressData(state, action) {
      const expressData = action.payload;
      const { activeTabKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeTabKey) {
          return { ...item, expressData };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeExpressCost(state, action) {
      const expressCost = action.payload;
      const { activeTabKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeTabKey) {
          return { ...item, expressCost };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeShippingCost(state, action) {
      const shippingCost = action.payload;
      const { activeTabKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeTabKey) {
          return { ...item, shippingCost };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeShippingData(state, action) {
      const shippingData = action.payload;
      const { activeTabKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeTabKey) {
          return { ...item, shippingData };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeTotalPrice(state, action) {
      const totalPrice = action.payload;
      const { activeTabKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeTabKey) {
          return { ...item, totalPrice };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeChangeMoney(state, action) {
      const changeMoney = action.payload;
      const { activeTabKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeTabKey) {
          return { ...item, changeMoney };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeRealMoney(state, action) {
      const realMoney = action.payload;
      const { activeTabKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeTabKey) {
          return { ...item, realMoney };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeActivePaymentDataIndex(state, action) {
      let activePaymentDataIndex = action.payload;
      const { activeTabKey } = state;
      const currentOrder = getCurrentOrder(state);
      const { paymentData } = currentOrder;
      if (paymentData.length === 0) {
        activePaymentDataIndex = null;
      } else if (!paymentData[activePaymentDataIndex]) {
        activePaymentDataIndex = 0;
      }
      const newOrders = state.orders.map((item) => {
        if (item.key === activeTabKey) {
          return { ...item, activePaymentDataIndex };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeCommonLoading(state, action) {
      const commonLoading = action.payload
      return { ...state, commonLoading }
    },
    saveCustomerList(state, action) {
      const customerList = action.payload
      return { ...state, customerList }
    },
    changeCurrentOrderGoodsList(state, action) {
      const currentOrderGoodsList = action.payload
      return { ...state, currentOrderGoodsList, }
    },
    saveMilkPowderGoodsList(state, action) {
      const { payload } = action
      const milkPowderGoodsList = payload.map(item => ({ ...item, Key: item.Sku }))
      return { ...state, milkPowderGoodsList, }
    },
    saveStoreSaleGoodsList(state, action) {
      const { payload } = action
      const storeSaleGoodsList = payload.map(item => ({ ...item, Key: item.Sku }))
      return { ...state, storeSaleGoodsList, }
    },
    saveStoreWholeSaleGoodsList(state, action) {
      const { payload } = action
      const storeWholeSaleGoodsList = payload.map(item => ({ ...item, Key: item.Sku }))
      return { ...state, storeWholeSaleGoodsList, }
    },
    changeOrderID(state, action) {
      const ID = action.payload
      const { activeTabKey } = state
      const newOrders = state.orders.map((item) => {
        if (item.key === activeTabKey) {
          return { ...item, ID };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changePaginationTotal(state, action) {
      const { pagination } = state
      const total = action.payload
      const newPagination = { ...pagination, total }
      return { ...state, pagination: newPagination }
    },
    changePaginationPagingData(state, action) {
      const { pagination } = state
      const pagingData = action.payload
      const newPagination = { ...pagination, pagingData }
      return { ...state, pagination: newPagination }
    },
    changePaginationCurrent(state, action) {
      const { pagination } = state
      const current = action.payload
      const newPagination = { ...pagination, current }
      return { ...state, pagination: newPagination }
    },
  },
};
