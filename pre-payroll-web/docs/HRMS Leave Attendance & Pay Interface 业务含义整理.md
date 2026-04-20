# HRMS Leave Attendance & Pay Interface 业务含义整理

> 更新时间：2026-04-17\
> 目的：统一整理 HRMS 在 `leave attendance` 与 `pay interface` 两个阶段返回的字段分组、字段含义与数据类型，便于后续做业务映射、检测项设计与数据缺口分析。

## Leave Attendance

> 说明：
>
> - 本节整理形式沿用 [A1、A2 检测项 & HRMS Leave Attendance 业务含义整理](./A1%E3%80%81A2%20%E6%A3%80%E6%B5%8B%E9%A1%B9%20%26%20HRMS%20Leave%20Attendance%20%E4%B8%9A%E5%8A%A1%E5%90%AB%E4%B9%89%E6%95%B4%E7%90%86.md) 中 `HRMS Key Business Meaning` 的结构。
> - `含义` 优先采用 `zh-CN` 的 `labelLang` 翻译。
> - 以下内容用于集中查看字段，不重复展开 A1/A2 检测项评估。

### Holiday

业务含义：节假日相关记录，包含员工、公司、节假日信息以及对应金额，适合用于 holiday 出勤/津贴类明细展示。

Details

| field         | label          | 含义   | dataType |
| ------------- | -------------- | ---- | -------- |
| RecordID      | Record ID      | 记录ID | INT      |
| EmployeeCode  | Employee Code  | 员工编号 | NVARCHAR |
| EmployeeName  | Employee Name  | 员工姓名 | NVARCHAR |
| CompanyCode   | Company Code   | 公司代码 | NVARCHAR |
| CompanyName   | Company Name   | 公司名称 | NVARCHAR |
| HolidayCode   | Holiday Code   | 假期代码 | NVARCHAR |
| HolidayName   | Holiday Name   | 假期名称 | NVARCHAR |
| HolidayDate   | Holiday Date   | 假期日期 | DATETIME |
| HolidayAmount | Holiday Amount | 假日金额 | DECIMAL  |
| AllowanceCode | Allowance Code | 津贴编号 | NVARCHAR |
| AllowanceName | Allowance Name | 津贴名称 | NVARCHAR |

Summary

| field         | label          | 含义   | groupBy | dataType |
| ------------- | -------------- | ---- | ------- | -------- |
| RecordID      | Record ID      | 记录ID | 否       | INT      |
| EmployeeCode  | Employee Code  | 员工编号 | 是       | NVARCHAR |
| EmployeeName  | Employee Name  | 员工姓名 | 是       | NVARCHAR |
| CompanyCode   | Company Code   | 公司代码 | 是       | NVARCHAR |
| CompanyName   | Company Name   | 公司名称 | 是       | NVARCHAR |
| HolidayCode   | Holiday Code   | 假期代码 | 是       | NVARCHAR |
| HolidayName   | Holiday Name   | 假期名称 | 是       | NVARCHAR |
| HolidayAmount | Holiday Amount | 假日金额 | 否       | DECIMAL  |
| AllowanceCode | Allowance Code | 津贴编号 | 是       | NVARCHAR |
| AllowanceName | Allowance Name | 津贴名称 | 是       | NVARCHAR |

### Leave

业务含义：请假明细，包含请假起止日期、金额、审批日期以及关联津贴信息，适合用于 leave 记录与扣薪逻辑展示。

Details

| field         | label          | 含义   | dataType |
| ------------- | -------------- | ---- | -------- |
| RecordID      | Record ID      | 记录ID | NVARCHAR |
| EmployeeCode  | Employee Code  | 员工编号 | NVARCHAR |
| EmployeeName  | Employee Name  | 员工姓名 | NVARCHAR |
| CompanyCode   | Company Code   | 公司代码 | NVARCHAR |
| CompanyName   | Company Name   | 公司名称 | NVARCHAR |
| LeaveCode     | Leave Code     | 休假编号 | NVARCHAR |
| LeaveName     | Leave Name     | 假期类型 | NVARCHAR |
| LeaveStart    | Leave Start    | 休假开始 | DATETIME |
| LeaveDate     | Leave Date     | 休假日期 | DATETIME |
| LeaveAmount   | Leave Amount   | 休假金额 | DECIMAL  |
| ApprovalDate  | Approval Date  | 审批日期 | DATETIME |
| AllowanceCode | Allowance Code | 津贴编号 | NVARCHAR |
| AllowanceName | Allowance Name | 津贴名称 | NVARCHAR |

Summary

| field         | label          | 含义   | groupBy | dataType |
| ------------- | -------------- | ---- | ------- | -------- |
| RecordID      | Record ID      | 记录ID | 否       | INT      |
| EmployeeCode  | Employee Code  | 员工编号 | 是       | NVARCHAR |
| EmployeeName  | Employee Name  | 员工姓名 | 是       | NVARCHAR |
| CompanyCode   | Company Code   | 公司代码 | 是       | NVARCHAR |
| CompanyName   | Company Name   | 公司名称 | 是       | NVARCHAR |
| LeaveCode     | Leave Code     | 休假编号 | 是       | NVARCHAR |
| LeaveName     | Leave Name     | 假期类型 | 是       | NVARCHAR |
| LeaveAmount   | Leave Amount   | 休假金额 | 否       | DECIMAL  |
| ApprovalDate  | Approval Date  | 审批日期 | 否       | DATETIME |
| AllowanceCode | Allowance Code | 津贴编号 | 是       | NVARCHAR |
| AllowanceName | Allowance Name | 津贴名称 | 是       | NVARCHAR |

### Leave Status

业务含义：请假状态汇总，聚焦员工请假状态、数量和关联津贴，适合用于 leave status 的汇总视图。

Details

| field         | label          | 含义   | dataType |
| ------------- | -------------- | ---- | -------- |
| RecordID      | Record ID      | 记录ID | INT      |
| EmployeeCode  | Employee Code  | 员工编号 | NVARCHAR |
| EmployeeName  | Employee Name  | 员工姓名 | NVARCHAR |
| CompanyCode   | Company Code   | 公司代码 | NVARCHAR |
| CompanyName   | Company Name   | 公司名称 | NVARCHAR |
| LeaveCode     | Leave Code     | 休假编号 | NVARCHAR |
| LeaveName     | Leave Name     | 假期类型 | NVARCHAR |
| Quantity      | Quantity       | 数量   | DECIMAL  |
| AllowanceCode | Allowance Code | 津贴编号 | NVARCHAR |
| AllowanceName | Allowance Name | 津贴名称 | NVARCHAR |

### Leave Encash Year End

业务含义：年末休假折现记录，用于年终结转或折现场景的明细展示。

Details

| field         | label          | 含义   | dataType |
| ------------- | -------------- | ---- | -------- |
| RecordID      | Record ID      | 记录ID | INT      |
| EmployeeCode  | Employee Code  | 员工编号 | NVARCHAR |
| EmployeeName  | Employee Name  | 员工姓名 | NVARCHAR |
| CompanyCode   | Company Code   | 公司代码 | NVARCHAR |
| CompanyName   | Company Name   | 公司名称 | NVARCHAR |
| LeaveCode     | Leave Code     | 休假编号 | NVARCHAR |
| LeaveName     | Leave Name     | 假期类型 | NVARCHAR |
| LeaveStart    | Leave Start    | 休假开始 | DATETIME |
| LeaveDate     | Leave Date     | 休假日期 | DATETIME |
| LeaveAmount   | Leave Amount   | 休假金额 | DECIMAL  |
| PeriodYear    | Period Year    | 年限   | NVARCHAR |
| AllowanceCode | Allowance Code | 津贴编号 | NVARCHAR |
| AllowanceName | Allowance Name | 津贴名称 | NVARCHAR |

### Leave Encash Unconsumed

业务含义：未使用休假折现记录，通常用于员工未休完假期的结算/折现场景。

Details

| field         | label          | 含义   | dataType |
| ------------- | -------------- | ---- | -------- |
| RecordID      | Record ID      | 记录ID | INT      |
| EmployeeCode  | Employee Code  | 员工编号 | NVARCHAR |
| EmployeeName  | Employee Name  | 员工姓名 | NVARCHAR |
| CompanyCode   | Company Code   | 公司代码 | NVARCHAR |
| CompanyName   | Company Name   | 公司名称 | NVARCHAR |
| LeaveCode     | Leave Code     | 休假编号 | NVARCHAR |
| LeaveName     | Leave Name     | 假期类型 | NVARCHAR |
| LeaveStart    | Leave Start    | 休假开始 | DATETIME |
| LeaveDate     | Leave Date     | 休假日期 | DATETIME |
| LeaveAmount   | Leave Amount   | 休假金额 | DECIMAL  |
| PeriodYear    | Period Year    | 年限   | NVARCHAR |
| AllowanceCode | Allowance Code | 津贴编号 | NVARCHAR |
| AllowanceName | Allowance Name | 津贴名称 | NVARCHAR |

### Leave Encash Exit

业务含义：离职时的休假折现记录，用于员工离职清算场景。

Details

| field         | label          | 含义   | dataType |
| ------------- | -------------- | ---- | -------- |
| RecordID      | Record ID      | 记录ID | INT      |
| EmployeeCode  | Employee Code  | 员工编号 | NVARCHAR |
| EmployeeName  | Employee Name  | 员工姓名 | NVARCHAR |
| CompanyCode   | Company Code   | 公司代码 | NVARCHAR |
| CompanyName   | Company Name   | 公司名称 | NVARCHAR |
| LeaveCode     | Leave Code     | 休假编号 | NVARCHAR |
| LeaveName     | Leave Name     | 假期类型 | NVARCHAR |
| LeaveStart    | Leave Start    | 休假开始 | DATETIME |
| LeaveDate     | Leave Date     | 休假日期 | DATETIME |
| LeaveAmount   | Leave Amount   | 休假金额 | DECIMAL  |
| PeriodYear    | Period Year    | 年限   | NVARCHAR |
| AllowanceCode | Allowance Code | 津贴编号 | NVARCHAR |
| AllowanceName | Allowance Name | 津贴名称 | NVARCHAR |

### LWE Encash

业务含义：LWE 相关的休假折现记录。这里的 `LWE` 是根据字段结构和上下文做的缩写推断，指向一类与休假折现有关的工资/权益结算数据。

Details

| field         | label          | 含义   | dataType |
| ------------- | -------------- | ---- | -------- |
| RecordID      | Record ID      | 记录ID | INT      |
| EmployeeCode  | Employee Code  | 员工编号 | NVARCHAR |
| EmployeeName  | Employee Name  | 员工姓名 | NVARCHAR |
| CompanyCode   | Company Code   | 公司代码 | NVARCHAR |
| CompanyName   | Company Name   | 公司名称 | NVARCHAR |
| LeaveCode     | Leave Code     | 休假编号 | NVARCHAR |
| LeaveName     | Leave Name     | 假期类型 | NVARCHAR |
| LeaveStart    | Leave Start    | 休假开始 | DATETIME |
| LeaveDate     | Leave Date     | 休假日期 | DATETIME |
| LeaveAmount   | Leave Amount   | 休假金额 | DECIMAL  |
| AllowanceCode | Allowance Code | 津贴编号 | NVARCHAR |
| AllowanceName | Allowance Name | 津贴名称 | NVARCHAR |

### LWE Encash Exit

业务含义：LWE 离职折现记录。属于离职清算场景中的 LWE 相关结算数据，和 `lweeu` 对应，但面向 exit 流程。

Details

| field         | label          | 含义   | dataType |
| ------------- | -------------- | ---- | -------- |
| RecordID      | Record ID      | 记录ID | INT      |
| EmployeeCode  | Employee Code  | 员工编号 | NVARCHAR |
| EmployeeName  | Employee Name  | 员工姓名 | NVARCHAR |
| CompanyCode   | Company Code   | 公司代码 | NVARCHAR |
| CompanyName   | Company Name   | 公司名称 | NVARCHAR |
| LeaveCode     | Leave Code     | 休假编号 | NVARCHAR |
| LeaveName     | Leave Name     | 假期类型 | NVARCHAR |
| LeaveStart    | Leave Start    | 休假开始 | DATETIME |
| LeaveDate     | Leave Date     | 休假日期 | DATETIME |
| LeaveAmount   | Leave Amount   | 休假金额 | DECIMAL  |
| AllowanceCode | Allowance Code | 津贴编号 | NVARCHAR |
| AllowanceName | Allowance Name | 津贴名称 | NVARCHAR |

### Attendance

业务含义：考勤记录及其调整明细，包含原始数量、旧数量、比率和差额，适合用于 attendance / time 相关差异分析。

Details

| field         | label          | 含义   | dataType |
| ------------- | -------------- | ---- | -------- |
| RecordID      | Record ID      | 记录ID | INT      |
| EmployeeCode  | Employee Code  | 员工编号 | NVARCHAR |
| EmployeeName  | Employee Name  | 员工姓名 | NVARCHAR |
| CompanyCode   | Company Code   | 公司代码 | NVARCHAR |
| CompanyName   | Company Name   | 公司名称 | NVARCHAR |
| AllowanceCode | Allowance Code | 津贴编号 | NVARCHAR |
| AllowanceName | Allowance Name | 津贴名称 | NVARCHAR |
| ClockDate     | Clock Date     | 打卡日期 | DATETIME |
| Quantity      | Quantity       | 数量   | DECIMAL  |
| OldQuantity   | Old Quantity   | 旧数量  | DECIMAL  |
| Rate          | Rate           | 比率   | DECIMAL  |
| Delta         | Delta          | 差值   | DECIMAL  |

Summary

| field         | label          | 含义   | groupBy | dataType |
| ------------- | -------------- | ---- | ------- | -------- |
| RecordID      | Record ID      | 记录ID | 否       | INT      |
| EmployeeCode  | Employee Code  | 员工编号 | 是       | NVARCHAR |
| EmployeeName  | Employee Name  | 员工姓名 | 是       | NVARCHAR |
| CompanyCode   | Company Code   | 公司代码 | 是       | NVARCHAR |
| CompanyName   | Company Name   | 公司名称 | 是       | NVARCHAR |
| AllowanceCode | Allowance Code | 津贴编号 | 是       | NVARCHAR |
| AllowanceName | Allowance Name | 津贴名称 | 是       | NVARCHAR |
| ClockDate     | Clock Date     | 打卡日期 | 是       | DATETIME |
| Quantity      | Quantity       | 数量   | 是       | DECIMAL  |
| OldQuantity   | Old Quantity   | 旧数量  | 是       | DECIMAL  |
| Rate          | Rate           | 比率   | 是       | DECIMAL  |
| Delta         | Delta          | 差值   | 是       | DECIMAL  |

### OT Compensation

业务含义：加班补偿记录，包含加班补偿代码、打卡日期、工时、审批日期以及津贴信息，用于 OT compensation 计算和审批展示。

Details

| field              | label                | 含义     | dataType |
| ------------------ | -------------------- | ------ | -------- |
| RecordID           | Record ID            | 记录ID   | NVARCHAR |
| EmployeeCode       | Employee Code        | 员工编号   | NVARCHAR |
| EmployeeName       | Employee Name        | 员工姓名   | NVARCHAR |
| CompanyCode        | Company Code         | 公司代码   | NVARCHAR |
| CompanyName        | Company Name         | 公司名称   | NVARCHAR |
| OTCompensationCode | OT Compensation Code | 加班补偿代码 | NVARCHAR |
| OTCompensationName | OT Compensation Name | 加班补偿名称 | NVARCHAR |
| ClockDate          | Clock Date           | 打卡日期   | DATETIME |
| TimeHours          | Time Hours           | 时间小时   | DECIMAL  |
| ApprovalDate       | Approval Date        | 审批日期   | DATETIME |
| AllowanceCode      | Allowance Code       | 津贴编号   | NVARCHAR |
| AllowanceName      | Allowance Name       | 津贴名称   | NVARCHAR |

Summary

| field              | label                | 含义     | groupBy | dataType |
| ------------------ | -------------------- | ------ | ------- | -------- |
| RecordID           | Record ID            | 记录ID   | 否       | INT      |
| EmployeeCode       | Employee Code        | 员工编号   | 是       | NVARCHAR |
| EmployeeName       | Employee Name        | 员工姓名   | 是       | NVARCHAR |
| CompanyCode        | Company Code         | 公司代码   | 是       | NVARCHAR |
| CompanyName        | Company Name         | 公司名称   | 是       | NVARCHAR |
| OTCompensationCode | OT Compensation Code | 加班补偿代码 | 是       | NVARCHAR |
| OTCompensationName | OT Compensation Name | 加班补偿名称 | 是       | NVARCHAR |
| ClockDate          | Clock Date           | 打卡日期   | 是       | DATETIME |
| TimeHours          | Time Hours           | 时间小时   | 否       | DECIMAL  |
| ApprovalDate       | Approval Date        | 审批日期   | 否       | DATETIME |
| AllowanceCode      | Allowance Code       | 津贴编号   | 是       | NVARCHAR |
| AllowanceName      | Allowance Name       | 津贴名称   | 是       | NVARCHAR |

<br />

***

## Pay Interface

> 说明：
>
> - 本节基于你提供的 `pay interface` 阶段 HRMS 返回 JSON 整理。
> - 按 `tabLabel` 分组展示。
> - `含义` 优先采用 `zh-CN` 的 `labelLang` 翻译；业务含义为基于字段结构做的业务归纳。

### Claim

业务含义：报销明细记录，包含员工、公司、报销项目、报销日期、报销金额、审批日期及关联津贴信息，适合用于 pay interface 阶段的报销入薪明细展示。

Details

| field         | label          | 含义   | dataType |
| ------------- | -------------- | ---- | -------- |
| RecordID      | Record ID      | 记录ID | NVARCHAR |
| EmployeeCode  | Employee Code  | 员工编号 | NVARCHAR |
| EmployeeName  | Employee Name  | 员工姓名 | NVARCHAR |
| CompanyCode   | Company Code   | 公司代码 | NVARCHAR |
| CompanyName   | Company Name   | 公司名称 | NVARCHAR |
| ClaimCode     | Claim Code     | 报销编号 | NVARCHAR |
| ClaimName     | Claim Name     | 报销名称 | NVARCHAR |
| ClaimDate     | Claim Date     | 报销日期 | DATETIME |
| ClaimAmount   | Claim Amount   | 金额   | DECIMAL  |
| ApprovalDate  | Approval Date  | 审批日期 | DATETIME |
| AllowanceCode | Allowance Code | 津贴编号 | NVARCHAR |
| AllowanceName | Allowance Name | 津贴名称 | NVARCHAR |

Summary

| field         | label          | 含义   | groupBy | dataType |
| ------------- | -------------- | ---- | ------- | -------- |
| RecordID      | Record ID      | 记录ID | 否       | INT      |
| EmployeeCode  | Employee Code  | 员工编号 | 是       | NVARCHAR |
| EmployeeName  | Employee Name  | 员工姓名 | 是       | NVARCHAR |
| CompanyCode   | Company Code   | 公司代码 | 是       | NVARCHAR |
| CompanyName   | Company Name   | 公司名称 | 是       | NVARCHAR |
| ClaimCode     | Claim Code     | 报销编号 | 是       | NVARCHAR |
| ClaimName     | Claim Name     | 报销名称 | 是       | NVARCHAR |
| ClaimAmount   | Claim Amount   | 金额   | 否       | DECIMAL  |
| AllowanceCode | Allowance Code | 津贴编号 | 是       | NVARCHAR |
| AllowanceName | Allowance Name | 津贴名称 | 是       | NVARCHAR |

### Claim Status

业务含义：报销状态或报销结果汇总记录，聚焦员工、公司、津贴维度及对应数量，适合用于报销状态类汇总展示或后续入薪数量核对。

Details

| field         | label          | 含义   | dataType |
| ------------- | -------------- | ---- | -------- |
| RecordID      | Record ID      | 记录ID | INT      |
| EmployeeCode  | Employee Code  | 员工编号 | NVARCHAR |
| EmployeeName  | Employee Name  | 员工姓名 | NVARCHAR |
| CompanyCode   | Company Code   | 公司代码 | NVARCHAR |
| CompanyName   | Company Name   | 公司名称 | NVARCHAR |
| AllowanceCode | Allowance Code | 津贴编号 | NVARCHAR |
| AllowanceName | Allowance Name | 津贴名称 | NVARCHAR |
| Quantity      | Quantity       | 数量   | DECIMAL  |

### Loan

业务含义：贷款或法扣相关入薪记录，包含贷款参考号、员工、公司、类型、贷款类型、金额及关联津贴信息，适合用于 payroll interface 阶段的贷款/扣款类数据展示。

Details

| field           | label            | 含义     | dataType |
| --------------- | ---------------- | ------ | -------- |
| RecordID        | Record ID        | 记录ID   | INT      |
| LoanReferenceNo | LoanReferenceNo  | 贷款证明编号 | NVARCHAR |
| EmployeeCode    | Employee Code    | 员工编号   | NVARCHAR |
| EmployeeName    | Employee Name    | 员工姓名   | NVARCHAR |
| CompanyCode     | Company Code     | 公司代码   | NVARCHAR |
| Type            | Type             | 类型     | NVARCHAR |
| AllowanceCode   | Allowance Code   | 津贴编号   | NVARCHAR |
| AllowanceName   | Allowance Name   | 津贴名称   | NVARCHAR |
| LoanType        | Loan Type        | 贷款类型   | NVARCHAR |
| Amount          | Amount           | 数额     | DECIMAL  |
