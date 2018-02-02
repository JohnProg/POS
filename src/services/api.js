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

// 提交缓存订单

export async function addOrUpdateCacheOrder({ ID, order }) {
  let options = {
    body: `OrderID=${ID || ''}&Data=${order}`,
  }
  console.log('options', options)
  return request(`${DOMAIN}/Order/AddOrUpdateCache`, options)
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
