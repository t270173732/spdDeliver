/**API路径**/
const api = {
    Login: '/auth/login',
    Logout: '/auth/logout',
    ForgePassword: '/auth/forge-password',
    Register: '/auth/register',
    twoStepCode: '/auth/2step-code',
    SendSms: '/account/sms',
    SendSmsErr: '/account/sms_err',
    // get my info
    UserInfo: '/user/info',
    //用户信息
    sysUserUrl: '/sys/sysUser/read/detail',
    //更新密码
    updatePasswordUrl: '/sys/sysUser/updatePwd',


    //客户
    clientUrl: '/biz/dicClient/page',
    clientListUrl:'/biz/dicClient/read/list',
    clientDetailUrl:'/biz/dicClient/read/detail',
    updateClientUrl:'/biz/dicClient/update',
    insertClientUrl:'/biz/dicClient/add',

    //供应商
    supplierUrl: '/biz/dicSupplier/read/page',
    supplierList: '/biz/dicSupplier/read/list',
    supplierDetailUrl: '/biz/dicSupplier/read/detail',
    delSupplier: '/biz/dicSupplier/delete',
    updateSupplier: '/biz/dicSupplier/update',
    insertSupplier: '/biz/dicSupplier/add',
    setSupplierPropertyUrl: '/biz/plSupplierSet/updateSet',
    getSupplierPropertyUrl: '/biz/plSupplierSet/getDetail',
    supplierTreeListUrl:'/biz/dicSupplier/read/treeList',


    //获取参数
    propertyUrl: '/biz/dicCodebase/getCodeList',
    //供应商商品字典
    supplierDrugUrl: '/biz/plDicDrugExt/read/supplierPage',
    //供应商药品字典-新建/编辑对码关系
    supplierMapShipUrl: '/biz/plDicDrugExt/mapping',
    //药品list
    drugListUrl: '/biz/plDicDrugExt/read/list',
    //相似药品page
    similardDrugUrl: '/biz/plDicDrugExt/read/similarPage',
    //药品详情
    drugDetailUrl: '/biz/plDicDrugExt/read/detail',
    //供应商对码关系
    supplierDrugMapShipUrl: '/biz/plDicDrugExt/supplierMapping',
    //新增/修改供应商对码关系
    updateSupplierMapShipUrl: '/biz/plDicDrugExt/mapping',
    //供应商对码历史
    mapHistoryUrl: '/biz/linkDrugRecord/read/page',
    //对码任务网格
    drugMapUrl: '/biz/plDrugMappingTask/read/page',
    //药交所对码任务详情
    YJSDrugSingleUrl: '/biz/plDrugMappingTask/selectSingleByMap',
    //药交所对码
    mappingYSJ: '/biz/plDrugMappingTask/mappingYSJ',
    //药交所药品字典
    yjsDrugUrl: '/biz/plDicDrugExt/read/page',
    //新增平台药品
    PTDrugInsertUrl: '/biz/plDicDrugExt/add',
    //修改平台药品
    PTDrugUpdateUrl: '/biz/plDicDrugExt/update',
    //供应商对码
    mappingTaskUrl: '/biz/plDrugMappingTask/mappingERP',
    //获取当前角色下供应商
    supplierByRoleUrl: '/biz/dicSupplier/getSupplierByRole',
    //订单响应
    orderResUrl: '/biz/plPurchaseOrder/read/page',
    //订单详情
    orderDetailUrl: '/biz/plPurchaseOrderDetail/read/detail',
    //订单响应提交
    resSubmitUrl: '/biz/plPurchaseOrderDetail/submitResp',
    //订单药品响应历史
    orderDrugHisUrl: '/biz/plResponseOrderDetail/read/page',
    //订单配送响应数据
    stayDeliverUrl: '/biz/plPurchaseOrder/selectRespOrderPage',
    //订单配送待配送详情
    stayDeliverDetailUrl: '/biz/plDeliver/selectDeliverByRespId',
    //响应订单配送出库
    submitDeliverUrl: '/biz/plDeliver/submitDeliver',
    //订单配送分页
    deliverDataUrl: '/biz/plDeliver/read/page',
    //配送订单药品分页
    deliverDrugDataUrl: '/biz/plDeliveryDetail/read/page',
    //用户审核列表
    auditUrl: '/sys/sysRegUser/read/page',
    //拒绝审核接口
    refuseAuditUrl: '/sys/sysRegUser/authUser',
    //审核通过
    passAuditUrl: '/sys/sysRegUser/authUser',
    //用户注册接口
    registerUrl: '/sys/sysRegUser/add',
    //账号重复判断
    accountDplUrl: '/sys/sysRegUser/checkAccount',
    //手机重复判断
    phoneDplUrl: '/sys/sysRegUser/checkAccount',


    // 对码审核
    examineCodePage: '/biz/plMappingDrugErp/read/page',
    examineCodeUpdate: '/biz/plMappingDrugErp/update',
    examineCode: '/biz/plDicDrugExt/selectOneByErp',
    //对码审核
    //用户管理
    userPageUrl: '/sys/sysUser/read/page',
    userDetailUrl: '/sys/sysUser/read/detail',
    updateUserUrl: '/sys/sysUser/updateUser',
    insertUserUrl: '/sys/sysUser/addUser',
    getRoleByUserUrl:'/sys/sysRoleuser/getUserRoles',
    setRoleForUserUrl:'/sys/sysRoleuser/updateRoleUser',
    dataRightUrl:'/sys/sysUserDataright/userDataRight',
    setDataPermissionsUrl:'/sys/sysUserDataright/updateUserDataRight',
    resetPassUrl:'/sys/sysUser/resetPwd',


    //角色维护
    rolePageUrl: '/sys/sysRole/read/page',
    roleListUrl: '/sys/sysRole/read/list',
    roleDetailUrl: '/sys/sysRole/read/detail',
    insertRoleUrl: '/sys/sysRole/addRole',
    roleUpdateUrl: '/sys/sysRole/updateRole',
    getUserByRoleUrl: '/sys/sysRoleuser/getUserByRole',
    removeRoleUserUrl:'/sys/sysRoleuser/deleteRoleUser',

    //角色模块
    roleModuleListUrl:'/sys/sysRolemodule/read/list',
    updateRoleModuleUrl:'/sys/sysRolemodule/update',


}
export default api


//引用 import { getSmsCaptcha, get2step } from '@/api/login'
/**调用
 get2step({ })
 .then(res => {
    this.requiredTwoStepCaptcha = res.result.stepCode
  })
 .catch(() => {
    this.requiredTwoStepCaptcha = false
  })

 getSmsCaptcha({ mobile: values.mobile }).then(res => {
            setTimeout(hide, 2500)
            this.$notification['success']({
              message: '提示',
              description: '验证码获取成功，您的验证码为：' + res.result.captcha,
              duration: 8
            })
          }).catch(err => {
            setTimeout(hide, 1)
            clearInterval(interval)
            state.time = 60
            state.smsSendBtn = false
            this.requestFailed(err)
          })
 **/