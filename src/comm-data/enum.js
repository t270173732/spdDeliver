const Enum={
    yesNo: [
        {id: '0', text: '否'},
        {id: '1', text: '是'}
    ],
    status:[
        {id: '0', text: '停用'},
        {id: '1', text: '启用'}
    ],
    mapStatus:[
        {id: '0', text: '未对码'},
        {id: '1', text: '已对码'}
    ],
    orderStatus:[
        {id: '1', text: '下单'},
        {id: '2', text: '响应'},
        {id: '3', text: '部分响应'}
    ],
    orderType:[
        {id: '1', text: '采购'},
        {id: '2', text: '移库'}
    ],
    clientClass:[
        {id:'1',text:'综合医院、中医医院、中西医结合医院、民族医医院、专科医院、康复医院'},
        {id:'2',text:'妇幼保健院'},
        {id:'3',text:'社区卫生服务中心、社区卫生服务站'},
        {id:'4',text:'中心卫生院、乡（镇）卫生院、街道卫生院'},
        {id:'5',text:'疗养院'},
        {id:'6',text:'综合门诊部、专科门诊部、中医门诊部、中西医结合门诊部、民族医门诊部'},
        {id:'7',text:'诊所、中医诊所、民族医诊所、卫生所、医务室、卫生保健所、卫生站'},
        {id:'8',text:'村卫生室（所）'},
        {id:'9',text:'急救中心、急救站'},
        {id:'10',text:'临床检验中心'},
        {id:'11',text:'专科疾病防治院、专科疾病防治所、专科疾病防治站'},
        {id:'12',text:'护理院、护理站'},
        {id:'13',text:'其他诊疗机构'},
    ],
    clientLevel:[
        {id:'1',text:'三级甲等'},
        {id:'2',text:'三级乙等'},
        {id:'3',text:'二级甲等'},
        {id:'4',text:'二级乙等'},
        {id:'5',text:'二级丙等'},
        {id:'6',text:'一级'},
    ],
    drugSource:[
        {id: 1, text: 'SPD提交'},
        {id: 2, text: '采购订单'},
        {id: 3, text: '订单配送'},
    ],
    srcType:[
        {id: 0, text: 'PC'},
        {id: 1, text: '微信'},
        {id: 2, text: 'APP'},
    ],
    paramDataType:[
        {id:1,text:'TEXT文本'},
        {id:2,text:'NUM数值'},
        {id:3,text:'INT整型'},
        {id:4,text:'Date日期'},
        {id:5,text:'DateTime日期时间'},
        {id:6,text:'ComboBox选项'},
        {id:7,text:'Boolean布尔值'},
    ],
    certificateStatus:[
        {id:0,text:'新建'},
        {id:1,text:'审核中'},
        {id:2,text:'审核通过'},
        {id:'-1',text:'审核不通过'},
    ],
    agreementStatus:[
        {id:1,text:'新建'},
        {id:2,text:'审核中'},
        {id:3,text:'延期审核中'},
        {id:4,text:'审核通过'},
        {id:5,text:'审核不通过'},
    ],
    changeType:[
        {id:1,text:'退出'},
        {id:2,text:'变更代理合同'},
        {id:3,text:'变更代理结算'},
    ],
    applyType:[
        {id:1,text:'新增审核'},
        {id:2,text:'变更审核'},
        {id:3,text:'延期审核'},
    ],
    examineType:[
        {id:1,text:'新增审核'},
        {id:2,text:'变更审核'}
    ],
    ypType:[
        {id:1,text:'国家基药'},
        {id:2,text:'重庆基药'},
        {id:3,text:'地方基药'},
        {id:0,text:'其他药物'},
    ],
    applyStatus:[
        {id:1,text:'待审核'},
        {id:2,text:'审核通过'},
        {id:3,text:'审核未通过'},
    ],
    applyStatusB:[
        {id:0,text:'待审核'},
        {id:2,text:'审核中'},
        {id:3,text:'审核通过'},
        {id:4,text:'审核不通过'},
    ],
    applyStatusC:[
        {id:0,text:'待审核'},
        {id:6,text:'审核中'},
        {id:7,text:'审核通过'},
        {id:8,text:'审核不通过'},
    ],
    //国家医保类型
    insurClass:[
        {id:0,text:'甲类'},
        {id:1,text:'乙类'},
    ],
    //新药分类
    isNewClass:[
        {id:1,text:'一类'},
        {id:2,text:'二类'},
        {id:3,text:'三类'},
        {id:4,text:'四类'},
        {id:5,text:'五类'},
    ],
    //中药保护分类
    isProtClass:[
        {id:1,text:'一类保护品种'},
        {id:2,text:'二类保护品种'},
    ],
    applyTypeB:[
        {id:1,text:'申报申请'},
        {id:2,text:'退市申请'},
        {id:3,text:'变更申请'}
    ],
    srcTypeB:[
        {id:0,text:'创建'},
        {id:1,text:'申报'},
    ],
    //发票状态：0-开票待收 1-已收 2-已支付 3-修改中 -1 买方拒收
    saleInvStatus:[
        {id:0,text:'待收票'},
        {id:1,text:'已收票'},
        {id:2,text:'已支付'},
        {id:3,text:'修改中'},
        {id:-1,text:'拒收'},
    ]
};
export default Enum;