export const transactionStatus = {
    NA: -1,
    ALL: 0,
    ACTIVE: 1,
    DEACTIVE: 2,
    YES: 3,
    NO: 4,
    LOCK: 5,
    UNLOCK: 6,
    RETIRED: 7,
    DRAFT: 8,
    MANUAL: 9,
    SYSTEM: 10,
    RECEIVED: 14,
    GOODS_IN: 15,
    GOODS_RECEIVED: 16,
    PARTIAL: 21,
    APPROVED: 26,
    RECOMMENDRETEST: 29,
    RECOMMENDRECALC: 30,
    RETEST: 31,
    RECALC: 32,
    PASS: 50,
    FAIL: 51,
    WITHDRAWN: 52,
    CORRECTION: 53,
    LOGINTYPE_INTERNAL: 1,
    LOGINTYPE_ADS: 2,
    ACCREDITED: 70,
    NOTACCREDITED: 71,
    PARTIALAPPROVAL: 80,
    AUTOAPPROVAL: 81,
    SECTIONWISEAPPROVAL: 86,
    BLACKLIST: 87,
    PREREGISTER: 17,
    REGISTER: 18,
    QUARANTINE: 37,
    CANCELLED: 34,
    REJECT: 33,
    COMPLETED: 22,
    REVIEWED: 24,
    CERTIFIED: 54,
    SENT: 78,
    NULLIFIED: 79,
    CERTIFICATECORRECTION: 75,
    START: 11,
    STOP: 13,
    AUTO: 49
}

export const operators = {
    CLOSEPARENTHESIS: 18,
    OPENPARENTHESIS: 20
}

export const attachmentType = {
    FTP: 1,
    LINK: 2,
    PRN: 3,
    OTHERS: 4
}

export const parameterType = {
    NUMERIC: 1,
    PREDEFINED: 2,
    CHARACTER: 3,
    ATTACHMENT: 4
}

export const grade = {
    PASS: 1,
    FIO: 4,
    2: 'OOT',
    3: 'OOS',
    4: 'FIO',
    5: 'BELOW',
    6: 'BQL',
    7: 'BDL',
    8: 'BLOQ',
    9: 'BLOD'
}
export const ResultEntry = {
    RESULTSTATUS_PASS: 1,
    RESULTSTATUS_OOS: 3,
    RESULTSTATUS_OOT: 2,
    RESULTSTATUS_FIO: 4,
    RESULTSTATUS_BELOWDISREGARD: 5,
    RESULTSTATUS_BQL: 6,
    RESULTSTATUS_BDL: 7,
    RESULTSTATUS_BLOQ: 8,
    RESULTSTATUS_BLOD: 9
}

export const ApprovalSubType = {
    TESTGROUPAPPROVAL: 1,
    TESTRESULTAPPROVAL: 2,
    BATCHAPPROVAL: 3,
    PRODUCTAPPROVAL: 4,
    PRODUCTMAHAPPROVAL: 5,
}

export const RegistrationType = {
    ROUTINE: 6,
    INSTRUMENT: 4,
    MATERIAL: 5,
    BATCH: 1,
    NON_BATCH: 2,
    PLASMA_POOL: 3
}

export const RegistrationSubType = {
    PATIENT: 14,
    ROUTINE: 13,
    INSTRUMENT: 11,
    MATERIAL: 12,
    EU: 1,
    NON_EU: 2,
    WHO: 3,
    PRE_QUALIFICATION: 4,
    PROTOCOL: 5,
    PLASMA_POOL: 6,
    BULK: 7,
    CONTRACTTESTING: 8,
    CAPTESTING_AND_OTHERS: 9,
    EXTERNAL_POOL: 10

}
export const designProperties = {
    LABEL: 1,
    VALUE: 2,
    LISTITEM: 3,
    SINGLEITEMDATA: 4,
    GRIDITEM: 5,
    GRIDEXPANDABLEITEM: 6,
    LISTMOREITEM: 7,
    LISTMAINFIELD: 8,
    COLOUR: 9
}
export const reportTypeEnum = {
    COA: 1,
    MIS: 2,
    BATCH: 3,
    SAMPLE: 4,
    SCREENWISE: 5
}

export const formCode = {
    MATERIALCATEGORY: 23,
    PRODUCTCATEGORY: 24,
    INSTRUMENTCATEGORY: 27
}

export const chartType = {
    GRID: -2,
    AREACHART: 1,
    BARCHART: 2,
    BUBBLE: 3,
    COLUMNCHART: 5,
    DONUT: 6,
    PIECHART: 8
}
export const designComponents = {
    TEXTBOX: 1,
    TEXTAREA: 2,
    COMBOBOX: 3,
    DATEPICKER: 4,
    NUMBER: 5,
    CHECKBOX: 6,
    PATH: 7
}
export const tableType = {
    ALL: -1,
    MODULES: 1,
    FORMS: 2
}
export const queryTypeFilter = {
    LIMSDASHBOARDQUERY: 1,
    LIMSALERTQUERY: 2,
    LIMSBARCODEQUERY: 3,
    LIMSGENERALQUERY: 4,
    LIMSFILTERQUERY: 5
}

export const LOGINTYPE = {
    INTERNAL: 1,
    ADS: 2
}

export const QUALISFORMS = {
    SAMPLEREGISTRATION: 43
}


export const REPORTTYPE = {
    COAREPORT: 1,
    MISREPORT: 2,
    BATCHREPORT: 3,
    SAMPLEREPORT: 4,
    CONTROLBASED: 5
}

// export const COAREPORTTYPE={
// 	SAMPLEWISE:1,
// 	TESTWISE:2,
// 	CLIENTWISE:3,
// 	SAMPLEWISEPREVIEW:4,
// 	BATCHWISEPREVIEW:6,
// 	BATCHWISE:5,
// 	SAMPLEWISE:7
// } 


export const reportCOAType = {
    SAMPLEWISE: 1,
    TESTWISE: 2,
    CLIENTWISE: 3,
    SAMPLECERTIFICATEPRIVIEW: 4,
    BATCH: 5,
    BATCHPREVIEW: 6,
    SAMPLECERTIFICATE: 7,
    BATCHSTUDY: 8
}

export const FORMULAFIELDTYPE = {
    INTEGER: 1
}

export const ReactComponents = {
    TEXTINPUT: 1,
    TEXTAREA: 2,
    COMBO: 3,
    DATE: 4,
    NUMERIC: 5

}