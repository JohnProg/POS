import moment from 'moment';
import { fetchCommodityList, fetchCustomerList } from '../services/api';

function getCurrentOrder(state) {
  return state.orders.filter(item => item.key === state.activeKey)[0];
}


export default {
  namespace: 'commodity',

  state: {
    orders: [],
    operationButton: ['add', 'minus'],
    activeKey: null,
    newTabIndex: 0,
  },

  effects: {
    *searchCustomer(_, { call }) {
      const { list } = yield call(fetchCustomerList);
    },
    *changePaymentDataAndCheck(action, { put }) {
      const paymentData = action.payload;
      yield put({ type: 'changePaymentData', payload: paymentData });
      yield put({ type: 'checkPaymentData' });
    },
    *clickGoodsItemTrue(action, { put, select }) {
      const commodity = yield select(state => state.commodity);
      const currentOrder = getCurrentOrder(commodity);
      const { content } = currentOrder;
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
      const { content } = currentOrder;
      const key = action.payload;
      const newContent = content.map((item) => {
        if (item.Key === key) {
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
        console.log(item, index)
        if (index === 0) {
          prevItem = { ...item, demand: totalPrice, giveChange: generateGiveChange(totalPrice, item.cash) };
          return prevItem;
        } else {
          let demand = generateDemand(prevItem.demand, prevItem.cash)
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
      const { orders, activeKey } = yield select(state => state.commodity);
      const activeTabKey = activeKey;
      const currentOrder = orders.filter(item => (item.key === activeKey))[0];
      const selectedList = currentOrder.selectedList;
      let avoidDuplicationIndex = currentOrder.avoidDuplicationIndex;
      const selectedItem = currentOrder.content.filter(item => (item.Key === selectedKey))[0];
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
      const { orders, activeKey } = yield select(state => state.commodity);
      const currentOrder = orders.filter(item => (item.key === activeTabKey))[0];
      const { saleType } = currentOrder;
      const selectedList = currentOrder.selectedList;
      let goodsPrice = 0;
      selectedList.forEach((item) => {
        const unitPrice = (item.NewUnitPrice || item.NewUnitPrice === 0) ? item.NewUnitPrice : item.UnitPrice.A[saleType];
        const count = item.Count;
        const discount = item.Discount;
        const price = unitPrice * count * (discount || 100) / 100;
        goodsPrice += price;
      });
      yield put({ type: 'changeGoodsPrice', payload: goodsPrice });
      yield put({ type: 'sumTotalPrice' });
    },
    *clickAddButton(action, { put, call, select }) {
      const tabType = action.payload;
      const commodity = yield select(state => state.commodity);
      const count = ++commodity.newTabIndex;
      const currentTime = moment().format('HH:mm');
      yield put({ type: 'addTab', payload: { count, tabType, currentTime } });
      yield put({ type: 'initOperationButton' });
      // const { activeKey }= yield select(state => state.commodity)

      // const { list } = yield call(fetchCommodityList);
      const list = [
        { Name: '苹果', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 1 },
        { Name: '梨子', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 2 },
        { Name: '香蕉', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 3 },
        { Name: '葡萄', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 4 },
        { Name: '橘子', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 5 },
        { Name: '橙子', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 6 },
        { Name: '山寨', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 7 },
        { Name: '樱桃', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 8 },
        { Name: '土豆', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 9 },
        { Name: '地瓜', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 10 },
        { Name: '鲅鱼', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 11 },
        { Name: '大虾', UnitPrice: { A: { Local: 300, Express: 288 } }, Image: 'http://dummyimage.com/100x100', Key: 12 },
      ];
      yield put({ type: 'saveCommodityList', payload: list });
    },
    *clickRemoveButton(action, { put, select }) {
      const currentIndex = action.payload;
      const commodity = yield select(state => state.commodity);
      const orders = commodity.orders;
      let activeKey;
      yield put({ type: 'removeTab' });
      // case1: panes 数量大于 1 且 activeOrders 不是最后一个
      if (orders.length > 3 && currentIndex !== orders.length - 3) {
        activeKey = orders[currentIndex + 1].key;
      }
      // case2: panes 数量大于 1 且 activeOrders 是最后一个
      if (orders.length > 3 && currentIndex === orders.length - 3) {
        activeKey = orders[currentIndex - 1].key;
      }
      // case3: panes 数量等于1, 确保始终有一个 TabPane
      if (orders.length === 3) {
        activeKey = orders[currentIndex].key;
      }
      yield put({ type: 'changeActiveTabKey', payload: activeKey });
    },
    *clickChangeSaleTypeButton(action, { put, select }) {
      const saleType = action.payload;
      const { orders, activeKey } = yield select(state => state.commodity);
      const activeTabKey = activeKey;
      const currentOrder = orders.filter(item => (item.key === activeKey))[0];
      const { selectedList } = currentOrder;
      yield put({ type: 'changeSaleType', payload: saleType });
      yield put({ type: 'changeSelectedList', payload: { activeTabKey, newSelectedList: selectedList } });
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
    initOperationButton(state, action) {
      const operationButton = state.operationButton.map((item) => {
        if (item === 'add') { return { title: '+', key: '+' }; }
        if (item === 'minus') { return { title: '-', key: '-' }; }
        return item;
      });
      const orders = [...state.orders, ...operationButton];
      return { ...state, orders };
    },
    addTab(state, action) {
      const { count, tabType, currentTime } = action.payload;
      const currentActiveKey = state.activeKey;
      const goodsOrders = state.orders.filter(item => typeof item.title !== 'string');
      const orders = [
        ...goodsOrders,
        {
          title: count,
          key: `orders-${count}`,
          selectedList: [],
          activeKey: null,
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
          saleType: 'Local',
        },
      ];
      const activeKey = `orders-${count}`;
      return { ...state, orders, activeKey, newTabIndex: count };
    },
    removeTab(state, action) {
      const activeTabKey = state.activeKey;
      const orders = state.orders.filter(item => item.key !== activeTabKey);
      if (orders.length > 2) {
        return { ...state, orders };
      }
      return state;
    },
    changeActiveTabKey(state, action) {
      const activeKey = action.payload;
      return { ...state, activeKey };
    },
    saveCommodityList(state, action) {
      const activeTabKey = state.activeKey;
      const list = action.payload || [];
      const newOrders = state.orders.map((item) => {
        if (item.key && item.key === activeTabKey) {
          return { ...item, content: list, avoidDuplicationIndex: 0, phase: 'choose' };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeCommodityContent(state, action) {
      const activeTabKey = state.activeKey;
      const content = action.payload || [];
      const newOrders = state.orders.map((item) => {
        if (item.key && item.key === activeTabKey) {
          return { ...item, content };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    toggleSelectedGoods(state, action) {
      const activeSelectedKey = action.payload;
      const activeTabKey = state.activeKey;
      const newOrders = state.orders.map((item) => {
        if (item.key && item.key === activeTabKey) {
          return { ...item, activeKey: activeSelectedKey };
        } return item;
      });
      return { ...state, orders: newOrders };
    },
    changeGoodsPrice(state, action) {
      const goodsPrice = action.payload;
      const activeTabKey = state.activeKey;
      const newOrders = state.orders.map((item) => {
        if (item.key && item.key === activeTabKey) {
          return { ...item, goodsPrice };
        } return item;
      });
      return { ...state, orders: newOrders };
    },
    changeCalculateType(state, action) {
      const calculateType = action.payload;
      const activeTabKey = state.activeKey;
      const currentOrder = state.orders.filter(item => (item.key === activeTabKey))[0];
      const selectedList = currentOrder.selectedList;
      const activeSelectedKey = currentOrder.activeKey;
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
      const tempActiveKey = action.payload;
      const activeTabKey = state.activeKey;
      const newOrders = state.orders.map((item) => {
        if (item.key && item.key === activeTabKey) {
          return { ...item, activeKey: tempActiveKey };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeAvoidDuplicationIndex(state, action) {
      const avoidDuplicationIndex = action.payload;
      const activeTabKey = state.activeKey;
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
      const { activeKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeKey) {
          return { ...item, saleType };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changePaymentData(state, action) {
      const paymentData = action.payload;
      const { activeKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeKey) {
          return { ...item, paymentData };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changePaymentDataIndex(state, action) {
      let paymentDataIndex = action.payload;
      const { activeKey } = state;
      paymentDataIndex += 1;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeKey) {
          return { ...item, paymentDataIndex };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeExpressDataIndex(state, action) {
      let expressDataIndex = action.payload;
      const { activeKey } = state;
      expressDataIndex += 1;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeKey) {
          return { ...item, expressDataIndex };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeExpressData(state, action) {
      const expressData = action.payload;
      const { activeKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeKey) {
          return { ...item, expressData };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeExpressCost(state, action) {
      const expressCost = action.payload;
      const { activeKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeKey) {
          return { ...item, expressCost };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeTotalPrice(state, action) {
      const totalPrice = action.payload;
      const { activeKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeKey) {
          return { ...item, totalPrice };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeChangeMoney(state, action) {
      const changeMoney = action.payload;
      const { activeKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeKey) {
          return { ...item, changeMoney };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeRealMoney(state, action) {
      const realMoney = action.payload;
      const { activeKey } = state;
      const newOrders = state.orders.map((item) => {
        if (item.key === activeKey) {
          return { ...item, realMoney };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
    changeActivePaymentDataIndex(state, action) {
      let activePaymentDataIndex = action.payload;
      const { activeKey } = state;
      const currentOrder = getCurrentOrder(state);
      const { paymentData } = currentOrder;
      if (paymentData.length === 0) {
        activePaymentDataIndex = null;
      } else if (!paymentData[activePaymentDataIndex]) {
        activePaymentDataIndex = 0;
      }
      const newOrders = state.orders.map((item) => {
        if (item.key === activeKey) {
          return { ...item, activePaymentDataIndex };
        }
        return item;
      });
      return { ...state, orders: newOrders };
    },
  },
};
