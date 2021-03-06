import { stringify } from 'qs';
import request from '../utils/request';
import { DOMAIN } from '../constant';

// 客户管理的增删改查

export async function submitCustomer(formValue) {
  let options = {
    body: `Name=${formValue.name}&Address=${formValue.address}&Email=${formValue.email}&Phone=${formValue.phone}&CardNumber=${formValue.CardNumber}&Type=${formValue.type}&Score=${formValue.score}`
  }
  return request(`${DOMAIN}/Member/Add`, options)
}

export async function getCustomer(params) {
  let options = {
    body: `Params=${params}`,
  }
  return request(`${DOMAIN}/Member/GetAll`, options)
}

export async function deleteCustomer(ID) {
  let options = {
    body: `ID=${ID}`,
  }
  return request(`${DOMAIN}/Member/Delete`, options)
}

export async function updateCustomer(formValue) {
  let options = {
    body: `ID=${formValue.ID}&Name=${formValue.name}&Address=${formValue.address}&Email=${formValue.email}&Phone=${formValue.phone}&CardNumber=${formValue.CardNumber}&Type=${formValue.type}&Score=${formValue.score}`
  }
  return request(`${DOMAIN}/Member/UpdateByID`, options)
}

// 获取奶粉商品列表

export async function getMilkPowderGoods(params) {
  return request(`${DOMAIN}/Product/MilkPowderShipping`)
}

// 获取门店销售商品列表

export async function getStoreSaleGoods(params) {
  return request(`${DOMAIN}/Product/StoreSale`)
}

// 获取门店批发商品列表

export async function getStoreWholeSaleGoods(params) {
  return request(`${DOMAIN}/Product/StoreWholeSale`)
}


// 提交缓存订单

export async function addOrUpdateCacheOrder({ ID, order }) {
  let options = {
    body: `OrderID=${ID || ''}&Data=${order}`,
  }
  return request(`${DOMAIN}/Order/AddOrUpdateCache`, options)
}

// 奶粉订单抓取订单号

export async function fetchWaybill(dataJson) {
  let options = {
    body: `Data=${dataJson}`,
  }
  return request(`${DOMAIN}/Order/GetInvoiceNo`, options)
}

// 提交奶粉订单

export async function submitOrder({ orderID, dataJson }) {
  let options = {
    body: `OrderID=${orderID}&Data=${dataJson}`,
  }
  return request(`${DOMAIN}/Order/Commit`, options)
}

// 快递公司管理-添加
export async function addCompany({ Name, Sign, Price }) {
  let options = {
    body: `Name=${Name}&Sign=${Sign}&Price=${Price}`,
  }
  return request(`${DOMAIN}/LogisticsCompany/Add`, options)
}
// 快递公司管理-删除
export async function deleteCompany(ID) {
  let options = {
    body: `ID=${ID}`,
  }
  return request(`${DOMAIN}/LogisticsCompany/Delete`, options)
}
// 快递公司管理-更新
export async function updateCompany({ ID, Name, Sign, Price }) {
  let options = {
    body: `ID=${ID}&Name=${Name}&Sign=${Sign}&Price=${Price}`,
  }
  return request(`${DOMAIN}/LogisticsCompany/Update`, options)
}
// 快递公司管理-查询
export async function getCompany() {
  let options = {}
  return request(`${DOMAIN}/LogisticsCompany/GetAll`, options)
}

export async function fetchCommodityList() {
  return request('api/getCommodity');
}
export async function fetchCustomerList() {
  return request('api/getCustomer');
}
export async function fetchGoodsToOrder() {
  return request('api/getGoodsToOrder');
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeMobileLogin(params) {
  return request('/api/login/mobile', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
