import api from './index'
import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
  return axios({
    url: '/sys/login',
    method: 'post',
    data: parameter
  })
}
export function getFuncList(parameter) {
    return axios({
        url: '/sys/sysRolemodule/roleMdlList',
        method: 'put',
        data: parameter
    })
}

export function getSmsCaptcha(parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo() {
  return axios({
    url: '/user/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout() {
  return axios({
    url: '/sys/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step(parameter) {
  return axios({
    url: api.twoStepCode,
    method: 'post',
    data: parameter
  })
}

/**
 * 获取账户信息
 * @param parameter {*}
 */
export function sysUser(parameter) {
    return axios({
        url: api.sysUserUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 更新密码
 * @param parameter {*}
 */
export function updatePassword(parameter) {
    return axios({
        url: api.updatePasswordUrl,
        method: 'post',
        data: parameter
    })
}

/**
 * 用户注册
 * @param parameter {*}
 */
export function registerUser(parameter) {
    return axios({
        url: api.registerUrl,
        method: 'post',
        data: parameter
    })
}

/**
 * 判断手机号重复
 * @param parameter {*}
 */
export function phoneDpl(parameter) {
    return axios({
        url: api.phoneDplUrl,
        method: 'put',
        data: parameter
    })
}

/**
 * 判断用户账号重复
 * @param parameter {*}
 */
export function accountDpl(parameter) {
    return axios({
        url: api.accountDplUrl,
        method: 'put',
        data: parameter
    })
}


/**
 * 客户维护
 * @param parameter {*}
 */
export function getClientData(parameter) {
    return axios({
        url: api.clientUrl,
        method: 'put',
        data: parameter
    })
}
export function getClientList(parameter) {
    return axios({
        url: api.clientListUrl,
        method: 'put',
        data: parameter
    })
}
export function getClientDetail(parameter) {
    return axios({
        url: api.clientDetailUrl,
        method: 'put',
        data: parameter
    })
}
export function updateClient(parameter) {
    return axios({
        url: api.updateClientUrl,
        method: 'post',
        data: parameter
    })
}
export function insertClient(parameter) {
    return axios({
        url: api.insertClientUrl,
        method: 'post',
        data: parameter
    })
}

/**
 * 供应商树形网格
 * @param parameter {*}
 */
export function getSupplierData(parameter) {
    return axios({
        url: api.supplierUrl,
        method: 'put',
        data: parameter
    })
}
export function getSupplierList(parameter) {
    return axios({
        url: api.supplierList,
        method: 'put',
        data: parameter
    })
}
export function getSupplierDetail(parameter) {
    return axios({
        url: api.supplierDetailUrl,
        method: 'put',
        data: parameter
    })
}
export function delSupplier(parameter) {
    return axios({
        url: api.delSupplier,
        method: 'post',
        data: parameter
    })
}
export function updateSupplier(parameter) {
    return axios({
        url: api.updateSupplier,
        method: 'post',
        data: parameter
    })
}
export function insertSupplier(parameter) {
    return axios({
        url: api.insertSupplier,
        method: 'post',
        data: parameter
    })
}
export function setSupplierProperty(parameter) {
    return axios({
        url: api.setSupplierPropertyUrl,
        method: 'post',
        data: parameter
    })
}
export function getSupplierProperty(parameter) {
    return axios({
        url: api.getSupplierPropertyUrl,
        method: 'put',
        data: parameter
    })
}

/**
 * 角色管理
 * @param parameter {*}
 */
export function getRolePage(parameter) {
    return axios({
        url: api.rolePageUrl,
        method: 'put',
        data: parameter
    })
}
export function getRoleList(parameter) {
    return axios({
        url: api.roleListUrl,
        method: 'put',
        data: parameter
    })
}
export function roleUpdate(parameter) {
    return axios({
        url: api.roleUpdateUrl,
        method: 'post',
        data: parameter
    })
}
export function getUserByRole(parameter) {
    return axios({
        url: api.getUserByRoleUrl,
        method: 'put',
        data: parameter
    })
}
export function getRoleDetail(parameter) {
    return axios({
        url: api.roleDetailUrl,
        method: 'put',
        data: parameter
    })
}
export function insertRole(parameter) {
    return axios({
        url: api.insertRoleUrl,
        method: 'post',
        data: parameter
    })
}
export function removeRoleUser(parameter) {
    return axios({
        url: api.removeRoleUserUrl,
        method: 'delete',
        data: parameter
    })
}

/**
 * 角色模块
 * @param parameter {*}
 */
export function getRoleModuleList(parameter) {
    return axios({
        url: api.roleModuleListUrl,
        method: 'put',
        data: parameter
    })
}
export function updateRoleModule(parameter) {
    return axios({
        url: api.updateRoleModuleUrl,
        method: 'post',
        data: parameter
    })
}

/**
 * 用户管理
 * @param parameter {*}
 */
export function getOrgList(parameter) {
    return axios({
        url: api.supplierTreeListUrl,
        method: 'put',
        data: parameter
    })
}
export function getUserPage(parameter) {
    return axios({
        url: api.userPageUrl,
        method: 'put',
        data: parameter
    })
}
export function getUserDetail(parameter) {
    return axios({
        url: api.userDetailUrl,
        method: 'put',
        data: parameter
    })
}
export function getRoleByUser(parameter) {
    return axios({
        url: api.getRoleByUserUrl,
        method: 'put',
        data: parameter
    })
}
export function insertUser(parameter) {
    return axios({
        url: api.insertUserUrl,
        method: 'post',
        data: parameter
    })
}
export function updateUser(parameter) {
    return axios({
        url: api.updateUserUrl,
        method: 'post',
        data: parameter
    })
}
export function setRoleForUser(parameter) {
    return axios({
        url: api.setRoleForUserUrl,
        method: 'post',
        data: parameter
    })
}
export function getDataRight(parameter) {
    return axios({
        url: api.dataRightUrl,
        method: 'put',
        data: parameter
    })
}
export function setDataPermissions(parameter) {
    return axios({
        url: api.setDataPermissionsUrl,
        method: 'post',
        data: parameter
    })
}
export function resetPassword(parameter) {
    return axios({
        url: api.resetPassUrl,
        method: 'post',
        data: parameter
    })
}



/**
 * 获取参数
 * @param parameter {*}
 */
export function getProperty(parameter) {
    return axios({
        url: api.propertyUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 供应商药品字典网格
 * @param parameter {*}
 */
export function supplierDrugData(parameter) {
    return axios({
        url: api.supplierDrugUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 供应商对码关系
 * @param parameter {*}
 */
export function supplierDrugMapShip(parameter) {
    return axios({
        url: api.supplierDrugMapShipUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 新增/修改供应商对码关系
 * @param parameter {*}
 */
export function updateSupplierMapShip(parameter) {
    return axios({
        url: api.updateSupplierMapShipUrl,
        method: 'post',
        data: parameter
    })
}
/**
 * 供应商对码历史
 * @param parameter {*}
 */
export function mapHistory(parameter) {
    return axios({
        url: api.mapHistoryUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 平台对码任务
 * @param parameter {*}
 */
export function yjsDrugMap(parameter) {
    return axios({
        url: api.drugMapUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 客户List
 * @param parameter {*}
 */
export function clientListData(parameter) {
    return axios({
        url: api.clientListUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 平台药品分页
 * @param parameter {*}
 */
export function getYJSDrugData(parameter) {
    return axios({
        url: api.yjsDrugUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 药品List
 * @param parameter {*}
 */
export function getDrugListData(parameter) {
    return axios({
        url: api.drugListUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 新增平台药品
 * @param parameter {*}
 */
export function insertPTDrug(parameter) {
    return axios({
        url: api.PTDrugInsertUrl,
        method: 'post',
        data: parameter
    })
}
/**
 * 修改平台药品
 * @param parameter {*}
 */
export function updatePTDrug(parameter) {
    return axios({
        url: api.PTDrugUpdateUrl,
        method: 'post',
        data: parameter
    })
}
/**
 * 通过客户过滤药品List
 * @param parameter {*}
 */
export function getDrugListByClient(parameter) {
    return axios({
        url: api.drugListUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 相似药品
 * @param parameter {*}
 */
export function similardDrugData(parameter) {
    return axios({
        url: api.similardDrugUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 药品详情
 * @param parameter {*}
 */
export function getDrugDetail(parameter) {
    return axios({
        url: api.drugDetailUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 平台对码任务详情
 * @param parameter {*}
 */
export function YJSDrugSingleData(parameter) {
    return axios({
        url: api.YJSDrugSingleUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 平台对码
 * @param parameter {*}
 */
export function mappingYSJ(parameter) {
    return axios({
        url: api.mappingYSJ,
        method: 'post',
        data: parameter
    })
}
/**
 * 供应商配送对码任务网格
 * @param parameter {*}
 */
export function mappingDeliver(parameter) {
    return axios({
        url: api.drugMapUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 供应商药品字典-新建/编辑对码关系
 * @param parameter {*}
 */
export function supplierMapShip(parameter) {
    return axios({
        url: api.supplierMapShipUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 供应商对码
 * @param parameter {*}
 */
export function supplierMap(parameter) {
    return axios({
        url: api.mappingTaskUrl,
        method: 'post',
        data: parameter
    })
}
/**
 * 获取当前角色下供应商
 * @param parameter {*}
 */
export function supplierByRole(parameter) {
    return axios({
        url: api.supplierByRoleUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 订单响应分页
 * @param parameter {*}
 */
export function orderRes(parameter) {
    return axios({
        url: api.orderResUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 订单详情
 * @param parameter {*}
 */
export function orderDetail(parameter) {
    return axios({
        url: api.orderDetailUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 订单响应提交
 * @param parameter {*}
 */
export function orderResSubmit(parameter) {
    return axios({
        url: api.resSubmitUrl,
        method: 'post',
        data: parameter
    })
}
/**
 * 订单药品响应历史
 * @param parameter {*}
 */
export function orderDrugHis(parameter) {
    return axios({
        url: api.orderDrugHisUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 订单配送响应网格
 * @param parameter {*}
 */
export function orderStayDeliver(parameter) {
    return axios({
        url: api.stayDeliverUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 订单配送查询待配送详情
 * @param parameter {*}
 */
export function stayDeliverDetail(parameter) {
    return axios({
        url: api.stayDeliverDetailUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 响应订单配送出库
 * @param parameter {*}
 */
export function submitDeliver(parameter) {
    return axios({
        url: api.submitDeliverUrl,
        method: 'post',
        data: parameter
    })
}
/**
 * 订单配送分页
 * @param parameter {*}
 */
export function deliverData(parameter) {
    return axios({
        url: api.deliverDataUrl,
        method: 'put',
        data: parameter
    })
}
/**
 * 配送订单药品分页
 * @param parameter {*}
 */
export function deliverDrugData(parameter) {
    return axios({
        url: api.deliverDrugDataUrl,
        method: 'put',
        data: parameter
    })
}

/**
 * 用户审核列表
 * @param parameter {*}
 */
export function getAuditData(parameter) {
  return axios({
    url: api.auditUrl,
    method: 'put',
    data: parameter
  })
}

/**
 * 拒绝用户审核
 * @param parameter {*}
 */
export function refuseAudit(parameter) {
  return axios({
    url: api.refuseAuditUrl,
    method: 'post',
    data: parameter
  })
}

/**
 * 用户审核通过
 * @param parameter {*}
 */
export function passAudit(parameter) {
  return axios({
    url: api.passAuditUrl,
    method: 'post',
    data: parameter
  })
}
/**
 * 客户维护部分
 * @param parameter {*}
 */
/**
 * 对码审核
 * @param parameter {*}
 */
export function examineCodePage(parameter) {
    return axios({
        url: api.examineCodePage,
        method: 'put',
        data: parameter
    })
}
export function examineCodeUpdate(parameter) {
    return axios({
        url: api.examineCodeUpdate,
        method: 'post',
        data: parameter
    })
}
export function examineCode(parameter) {
    return axios({
        url: api.examineCode,
        method: 'put',
        data: parameter
    })
}

