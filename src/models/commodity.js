import moment from 'moment';
import key from 'keymaster';
import { fetchCommodityList, fetchCustomerList, submitCustomer, getCustomer, deleteCustomer, updateCustomer, getMilkPowderGoods, addOrUpdateCacheOrder } from '../services/api';
import { message } from 'antd';
import { POS_TAB_TYPE } from '../constant'

function getCurrentOrder(state) {
  return state.orders.filter(item => item.key === state.activeTabKey)[0];
}

function getCurrentContent(currentOrder, state) {
  const { type } = currentOrder
  switch(type) {
    case POS_TAB_TYPE.MILKPOWDER: {
      return state.milkPowderGoodsList
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
    milkPowderGoodsList: [],
  },

  subscriptions: {
    keyboardWatcher({ dispatch }) {
      key('⌘+up, ctrl+up', () => { dispatch({ type: 'keyBoardOperationChooseCalculator' }); });
      if (key.isPressed('M')) alert('M key is pressed, can ya believe it!?');
    },
  },
  effects: {
    *addOrUpdateCacheOrder(action, { put, call }) {
      console.log(111)
      const { payload } = action
      const response = yield call(addOrUpdateCacheOrder, payload)
      console.log(response)
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
        const payload = response.Result.Data
        yield put({type: 'saveMilkPowderGoodsList', payload})
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
        method: paymentMethod.name,
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
      if (!currentItem) { return; }
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
      let prevItem;
      const newPaymentData = paymentData.map((item, index) => {
        if (index === 0) {
          prevItem = { ...item, demand: totalPrice, giveChange: generateGiveChange(totalPrice, item.cash) };
          return prevItem;
        } else {
          const demand = generateDemand(prevItem.demand, prevItem.cash);
          prevItem = { ...item, demand, giveChange: generateGiveChange(demand, item.cash) };
          return prevItem;
        }
      });
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
      const { orders, activeTabKey } = commodity
      const currentOrder = getCurrentOrder(commodity);
      const currentGoodsList = getCurrentContent(currentOrder, commodity)
      const { selectedList } = currentOrder;
      let { avoidDuplicationIndex } = currentOrder;
      const selectedItem = currentGoodsList.filter(item => (item.Key === selectedKey))[0];
      let newSelectedList;
      function addNewToSelectedList(selectedItem, selectedList) {
        const newSelectedItem = {
          ...selectedItem,
          Count: 1,
          CalculateType: 'count',
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
      selectedList.forEach((item) => {
        const unitPrice = (item.NewUnitPrice || item.NewUnitPrice === 0) ? item.NewUnitPrice : item.RetailPrice
        const count = item.Count;
        const discount = item.Discount;
        const price = unitPrice * count * (discount || 100) / 100;
        goodsPrice += price;
      });
      yield put({ type: 'changeGoodsPrice', payload: goodsPrice });
      yield put({ type: 'sumTotalPrice' });
    },
    *clickAddTabButton(action, { put, call, select }) {
      const tabType = action.payload;
      const commodity = yield select(state => state.commodity);
      const count = commodity.newTabIndex + 1;
      const currentTime = moment().format('HH:mm');
      const createTime = moment().format('YYYY-MM-DD HH:mm')
      yield put({ type: 'addTab', payload: { count, tabType, currentTime, createTime } });
      // const { activeKey }= yield select(state => state.commodity)
      if (tabType === POS_TAB_TYPE.MILKPOWDER) {
        yield put({type: 'getMilkPowderGoods'})
      }

      // const { list } = yield call(fetchCommodityList);
      // const list = [
      //   { Name: '苹果', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 1 },
      //   { Name: '梨子', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 2 },
      //   { Name: '香蕉', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 3 },
      //   { Name: '葡萄', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 4 },
      //   { Name: '橘子', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 5 },
      //   { Name: '橙子', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 6 },
      //   { Name: '山寨', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 7 },
      //   { Name: '樱桃', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 8 },
      //   { Name: '土豆', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 9 },
      //   { Name: '地瓜', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 10 },
      //   { Name: '鲅鱼', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 11 },
      //   { Name: '大虾', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 12 },
      // ];
      // yield put({ type: 'saveCommodityList', payload: list });
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
        Name: '',
        Weight: null,
        WeightedWeight: 300,
        Cost: 0,
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
    *sumExpressCost(action, { put }) {
      const expressData = action.payload;
      let expressCost = 0;
      expressData.forEach((item) => {
        item.Cost && (expressCost += item.Cost);
      });
      yield put({ type: 'changeExpressCost', payload: expressCost });
      yield put({ type: 'sumTotalPrice' });
    },
    *sumTotalPrice(action, { put, select }) {
      const commodity = yield select(state => state.commodity);
      const currentOrder = getCurrentOrder(commodity);
      const { goodsPrice, expressCost } = currentOrder;
      const totalPrice = goodsPrice + expressCost;
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
          // activeKey: null,
          activeSelectedKey: null,
          paymentDataIndex: 0,
          paymentData: [],
          activePaymentDataIndex: null,
          goodsPrice: 0,
          expressDataIndex: 0,
          expressData: [],
          expressCost: 0,
          totalPrice: 0,
          realMoney: 0,
          changeMoney: 0,
          type: tabType,
          currentTime,
          createTime,
          saleType: tabType === POS_TAB_TYPE.SALE ? 'Local' : null,
          customer: null,
          avoidDuplicationIndex: 0,
          phase: 'choose',
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
    changePhase(state, action) {
      const { activeTabKey, phase } = action.payload;
      const newOrders = state.orders.map((item) => {
        if (item.key && item.key === activeTabKey) {
          return { ...item, phase };
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
    saveMilkPowderGoodsList(state, action) {
      const { payload } = action
      const milkPowderGoodsList = payload.map(item => ({ ...item, Key: item.Sku }))
      return { ...state, milkPowderGoodsList, }
    },
  },
};
