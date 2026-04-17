# Leave & Attendance 按 Item 驱动的 AI 确认设计

日期：2026-04-16
状态：brainstorming 已确认，可进入 implementation planning
范围：`Get Leave & Attendance Data` 弹窗 / 工作台

## 背景

当前 `Leave & Attendance` 的确认流程，本质上是一个按 item 驱动的流程：用户先选择会影响算薪的 HRMS item，生成数据后逐项查看，再完成确认。

本设计保持这一模型不变。AI 不替代 item 导航，也不成为主工作流入口。AI 的职责是挂载在每个 item 内部，帮助用户快速识别数据问题、理解命中原因，并在确认整个 item 之前，对记录逐条判断是 `Ignore` 还是 `Confirm impact`。

本设计同时对齐以下文档中的两层定义：

- A1/A2 检测项定义
- HRMS item 与字段映射

参考文档：

- [A1、A2 检测项 & HRMS Leave Attendance 业务含义整理](../../pre-payroll/A1%E3%80%81A2%20%E6%A3%80%E6%B5%8B%E9%A1%B9%20%26%20HRMS%20Leave%20Attendance%20%E4%B8%9A%E5%8A%A1%E5%90%AB%E4%B9%89%E6%95%B4%E7%90%86.md)

## 目标

- 保持流程以 item 为主，而不是以检测项为主。
- 让用户能在一个连续流程里，把本次勾选的所有 item 依次确认完成。
- 让 AI 在每个 item 内真正有用，帮助用户一眼看到问题。
- 允许用户在 `Details` 中做记录级判断，同时不破坏 item 级一次性确认模型。
- 支持 HRMS 数据变更后的重新检测，且不丢失之前的人工决策。
- 让 remark 能方便地沉淀 AI 摘要与异常记录。

## 非目标

- 不把顶层任务模型从 item 确认改成检测项选择。
- 不让 AI 阻断用户确认。
- 不改成逐条记录最终确认，而是保持 item 级最终确认。
- 不在本设计中解决当前 HRMS 的字段缺口。字段后续可补，但 UI 和映射关系先稳定下来。

## 核心原则

- 以 item 为主：用户仍然是按 `Holiday`、`Attendance`、`Leave Status`、`OT Compensation` 等 item 工作。
- AI 仅做提示：AI 负责解释、归纳、提示优先级，但不替用户做决定。
- 数据是证据层：异常必须直接反映在表格里，包括整行高亮。
- 决策只发生在 `Details`。
- `Details` 中每一行都可以被标记为 `Ignore` 或 `Confirm impact`，包括当前被视为正常的行。
- 用户最终是对整个 item 一次性确认。
- `Re-detect` 会刷新检测结果，但不会覆盖已有人工决策。

## 前置步骤：Item 选择与参数设置

在进入 item-driven 主工作台之前，增加一个前置步骤页：`Select Leave & Attendance Items`。

该步骤的目的不是改变主流程，而是把“本次要 review 哪些 item”和“这些 item 进入主页面前需要哪些参数”先准备好，避免用户在主页面中一边选择 item、一边补字段，导致流程顺序混乱。

### 目标

- 让用户先完成本次需要处理的 item 选择。
- 让需要额外字段的 item 在进入主页面前完成参数设置。
- 让 `Confirm and Continue` 的可点击条件清晰透明。
- 保持主工作台聚焦在 review 与确认，而不是前置配置。

### 页面结构

前置步骤页建议采用单页双栏结构，而不是 modal 或多步 wizard：

- 顶部任务上下文区
  - 页面标题：`Select Leave & Attendance Items`
  - 简短说明：本次选择的 item 会决定主工作台中生成哪些 review 区块
  - 上下文信息：`Payrun`、`Assignee`、`Due Date`、`Remind Date`
- 左侧 `Select items`
  - 展示本次可选的 item 列表
  - 支持 `Select all available` 与 `Clear all`
  - 每个 item 展示名称、是否需要 setup、当前状态、已完成时的参数摘要
- 右侧 `Set up selected item`
  - 一次只配置一个当前选中的 item
  - 若 item 不需要字段，则显示 `No setup required`
  - 若 item 需要字段，则只展示该 item 的必填与可选参数
- 底部固定 `Summary Bar`
  - 展示已选 item 数、仍需 setup 的 item 数、已 ready 的 item 数
  - 承载主操作按钮：`Confirm and Continue`

### Item 状态模型

前置步骤中的 item 建议只保留 4 个状态：

- `Not selected`
- `Selected`
- `Needs setup`
- `Ready`

状态定义如下：

- `Not selected`
  - 用户未将该 item 纳入本次 review
- `Selected`
  - 用户已选择该 item，但该 item 不需要额外 setup
- `Needs setup`
  - 用户已选择该 item，但仍缺少进入主页面所需的字段
- `Ready`
  - 用户已选择该 item，且必填字段已完成

实现上可以简化为：

- 不需要字段的 item：选中后直接进入 `Ready`
- 需要字段的 item：选中后先进入 `Needs setup`，配置完成后进入 `Ready`

### Item 列表设计

左侧 item 列表建议使用 checkbox 或 row select，而不是 toggle。

原因：

- toggle 更像开关，不像“本次要纳入处理范围的 item 选择”
- checkbox / selectable row 更符合批量勾选与状态浏览的语义

每个 item row 建议包含：

- 选择控件
- Item 名称
- 一行短说明
- 是否需要 setup
- 当前状态 tag
- 参数摘要（仅在已配置完成时展示）

示例摘要：

- `Holiday · 2026-07-16 to 2026-07-30 · Count total days: Calendar`
- `Attendance · No setup required`

### 参数设置区设计

右侧 `Set up selected item` 只负责当前 item，不同时展开多个 item 的表单。

规则：

- 未选择任何 item 时，显示空状态说明
- 选择了不需要字段的 item 时，显示 `No setup required`
- 选择了需要字段的 item 时，展示该 item 对应的字段表单
- 表单优先展示必填字段，再展示可选字段
- 字段分组应保持简单，不超过一层分组

不建议把所有 item 的字段都直接展开在左侧列表中，否则会重新回到当前页面“长列表 + 局部表单”的问题。

### Confirm and Continue 规则

`Confirm and Continue` 只有在以下条件都满足时才可点击：

- 至少选中 1 个 item
- 所有已选 item 都达到 `Ready`

禁用时必须给出明确原因，而不是仅做灰态处理。

建议提示文案：

- `Select at least one item to continue`
- `Complete required setup for Holiday before continuing`
- `2 selected items still need setup`

当全部满足时，底部 bar 可显示：

- `All selected items are ready`

### 页面与主工作台的衔接

点击 `Confirm and Continue` 后，系统基于已选 item 与已填写参数生成主工作台内容。

生成规则：

- 只为已选 item 生成对应的 review 区块
- 每个 item 使用前置步骤页中已确认的参数作为初始查询或展示条件
- 主工作台默认不再承担“选择 item”的职责，而是专注于 review、AI 辅助与最终确认

### 回改机制

进入主工作台后，仍应允许用户回到前置步骤页修改选择结果。

建议提供入口：

- `Selected items: N`
- `Edit selection`

回改规则：

- 已选 item 与已填写参数应被保留，不应让用户重新输入
- 若用户新增 item，则新 item 按前置规则补齐 setup 后再进入工作台
- 若用户取消某个 item，则主工作台中对应 item 区块不再显示
- 若用户修改某个 item 的关键参数，则该 item 的工作区数据需要按新参数重新生成

## 信息架构

### 顶层结构

`Get Leave & Attendance Data` 弹窗建议分为两个连续阶段：

- Step 0：`Select Leave & Attendance Items`
- Step 1：item-driven review workspace

其中 Step 1 保持现有主工作台框架：

- Header：任务上下文、assignee、due date、remind date
- 左侧内容区：选中的 item 列表与 item 内容
- 右侧全局区：Remark
- Footer：close、export、complete

优化重点分为两层：

- Step 0：解决 item 选择与参数设置的顺序和可见性
- Step 1：优化单个 item 展开后的工作区内部体验

### 单个 Item 的工作区布局

每个 item 内部采用双栏结构：

- 左侧主工作区
  - `Item Header`
  - `Summary`
  - `Details`
- 右侧辅助区
  - `AI Overview`

该结构来源于 brainstorming 中确认的 “方案 B refined”：AI 保持在右侧持续可见，表格与决策操作仍然留在左侧。

## 单个 Item 的结构定义

### 1. Item Header

`Item Header` 建议包含：

- Item 名称
- 最近一次检测时间
- Item 状态：`Not reviewed`、`In progress`、`Confirmed`
- `Re-detect`
- 可选的 fullscreen / table expand 操作

它的作用是给用户明确当前 item 的处理进度，但不和记录级状态混在一起。

### 2. Summary

`Summary` 是只读聚合视图。

目的：

- 帮助用户快速看清问题集中在哪
- 根据 item 类型，提供员工级、假别级、日期段级或 allowance 级聚合视图
- 在进入记录级 review 前，先建立全局认知

规则：

- `Summary` 中不允许执行 `Ignore` 或 `Confirm impact`
- `Summary` 不记录最终决策
- 可以支持点击某一行后筛选或跳转 `Details`，但点击本身不构成决策

### 3. Details

`Details` 是唯一的决策面。

目的：

- 展示记录级证据
- 让用户查看真正会不会影响 payroll 的具体记录
- 承接记录级决策，并最终汇总到 item review 状态

`Details` 顶部包含以下 tab：

- `All`
- `Ignored`
- `Confirmed Impact`

后续如有需要，可补充：

- `Unreviewed`

第一版建议先只保留前三个 tab，避免信息层级过多。

### 4. AI Overview

`AI Overview` 是当前 item 的常驻侧边面板。

目的：

- 让用户不需要先逐行读表，就能理解当前 item 的问题分布
- 解释为什么某些记录会被标记
- 在不改变用户工作流为“检测项驱动”的前提下，保留与 A1/A2 的明确映射

内容分两层组织：

第一层：按问题类型聚合

例如：

- 待审批影响薪资
- OT 超阈值
- 打卡与请假重叠
- 资格异常
- 异常请假模式

第二层：映射到 A1/A2 检测项

例如：

- `A2 待审批休假影响薪资`
- `A1 加班超阈值（周/月）`
- `A1 打卡与请假重叠`

每个检测项块建议只展示 4 类信息：

- `Why flagged`
- `What it may impact`
- `Confidence`
- `Recommended review focus`

AI 输出必须简洁、可扫读，不能变成长篇报告。

### 5. Remark

`Remark` 是挂在当前 item 上的备注区。

用户可以：

- 自由输入文字
- 一键把当前 AI 摘要加入 remark
- 一键把某条 details 记录加入 remark
- 一键把当前筛选结果摘要加入 remark

Remark 内容建议采用“半结构化”形式，而不是纯散文，这样更利于导出、审计与回传 SD。

建议结构：

- 员工
- 日期 / 期间
- 问题类型
- 用户决策
- 补充说明

## 记录级交互模型

### 行级展示

`Details` 中的每一行建议包含：

- Item 自身的业务字段
- 问题严重度或记录状态
- 简短原因说明
- 行内操作

视觉规则：

- 异常行整行高亮
- 正常行不高亮
- 无论异常行还是正常行，都保留行内操作

### 允许的行内操作

每条 `Details` 记录支持：

- `Ignore`
- `Confirm impact`
- `Add to remark`

定义如下：

- `Ignore`
  - 用户判断这条记录不影响发薪
  - 记录进入 `Ignored`
- `Confirm impact`
  - 用户判断这条记录会影响发薪
  - 记录进入 `Confirmed Impact`
- `Add to remark`
  - 把关键字段、异常原因和当前决策写入 item remark 草稿

这些操作应该出现在行内，而不是表格底部批量按钮。默认流程下也不建议加额外弹窗确认。

### 行状态

每条记录至少支持以下状态：

- `Unreviewed`
- `Ignored`
- `Confirmed Impact`

可选的技术标记：

- `Re-detected`

`Re-detected` 不是用户决策状态，而是用于标识重新检测后新出现的记录。

## Item 状态模型

每个 item 建议只有 3 个主状态：

- `Not reviewed`
- `In progress`
- `Confirmed`

建议在 item 名称附近显示这些计数：

- Unreviewed 数
- Ignored 数
- Confirmed Impact 数

状态含义：

- `Not reviewed`：用户还未真正开始 review，或仍有明显未处理记录
- `In progress`：用户已经开始做记录级判断，但还没确认整个 item
- `Confirmed`：用户已完成 review，并确认该 item

## Re-detect 行为

`Re-detect` 是 item 级操作。

适用场景包括但不限于：

- HRMS 里原本未审批的 OT 已完成审批
- 请假审批状态已更新
- Attendance 或 Leave 数据被上游修正

### 行为规则

- Re-detect 会刷新当前 item 的检测结果集
- 已有行决策必须保留
- 已 `Ignored` 的记录，如果重检后仍存在，则继续保持 `Ignored`
- 已 `Confirmed Impact` 的记录，如果重检后仍存在，则继续保持 `Confirmed Impact`
- 新命中的记录进入 `Unreviewed`
- 已不再命中或已不存在的记录，从当前 `All` 中消失
- 这些变化仍应在 item 的 history / audit 中保留痕迹

这样可以避免用户去 HRMS 修完数据后，之前的人工 review 被重新检测覆盖掉。

## Item 确认规则

用户最终是确认整个 item。

规则建议：

- AI 可以提示，但不能阻断 item 确认
- 即使存在 `Ignored` 或 `Confirmed Impact`，仍允许确认 item
- 如果还有 `Unreviewed` 记录，系统应给出 warning，但不 hard block

例如：

- `There are still 3 unreviewed records in Details`

这样既保留用户控制权，又能让 review 风险透明可见。

## 检测项到 Item 的映射

为了避免同一问题在多个 item 中重复出现，每个检测项应只指定一个“主展示 item”。若某个检测项还需要其他 item 的证据，应在 `AI Overview` 中通过 `Evidence from ...` 标示，而不是在多个 item 内重复生成同一问题。

### Holiday

主检测项：

- `A1 法定节假日/休息日打卡`

证据 item：

- `Attendance`

AI 重点输出：

- 异常出勤日期
- 节假日 / 休息日类型
- 对应打卡证据
- 是否缺审批或缺说明

### Attendance

主检测项：

- `A1 漏打卡`
- `A1 连续通宵班/不合理排班模式`
- `A1 打卡与请假重叠`

证据 item：

- `Leave`

AI 重点输出：

- 缺失 `clock-in` / `clock-out`
- 异常班次连续天数
- 重叠日期 / 时段
- 需优先复核的员工

### OT Compensation

主检测项：

- `A1 加班超阈值（周/月）`
- `A1 未审批加班影响发薪`
- `A1 提报加班与系统加班不一致`

AI 重点输出：

- 本期 OT 小时
- 超阈值幅度
- 未审批 OT
- 提报值 vs 系统值差异
- 预计薪资影响

### Leave

主检测项：

- `A2 异常请假模式`
- `A2 Joiner/Leaver 按比例请假异常`

辅助作用：

- 为 `A1 打卡与请假重叠` 提供请假证据

AI 重点输出：

- 模式命中情况
- 观察窗口
- 服务天数
- 应得 vs 系统结果
- 需复核的日期段

### Leave Status

主检测项：

- `A2 待审批休假影响薪资`
- `A2 请假负余额未自动扣薪`

证据 item：

- `Leave`

AI 重点输出：

- 待审批请假天数
- 影响薪资的假别
- 负余额员工
- auto-deduct 状态
- 预计扣薪风险

### Leave Encash Year End

主检测项：

- `A2 假期折现资格异常`

场景标签：

- `Year End`

AI 重点输出：

- 应得折现资格
- 实际折现结果
- period year
- 差额
- 是否命中政策上限或资格条件

### Leave Encash Unconsumed

主检测项：

- `A2 假期折现资格异常`

场景标签：

- `Unconsumed`

AI 重点输出：

- 未休余额
- 折现金额
- 资格基线
- 是否超出可折现范围

### Leave Encash Exit

主检测项：

- `A2 假期折现资格异常`

场景标签：

- `Exit`

AI 重点输出：

- 离职折现资格
- 应结算 vs 已结算
- 差额
- 是否需要人工修正

### LWE Encash

主检测项：

- `A2 假期折现资格异常`

场景标签：

- `LWE`

AI 重点输出：

- LWE 相关折现结果
- 资格判断
- 差额来源
- 异常员工清单

### LWE Encash Exit

主检测项：

- `A2 假期折现资格异常`

场景标签：

- `LWE Exit`

AI 重点输出：

- 离职场景下 LWE 折现是否正确
- 应得 / 实得差异
- 需补充确认的政策口径

## 表格设计规则

### Summary Table

`Summary` 表建议：

- 使用该 item 在 HRMS business meaning 中定义的 summary 字段
- 支持扫描、排序、筛选
- 突出问题聚集位置
- 不承担 `Ignore` 或 `Confirm impact` 的执行职责

### Details Table

`Details` 表建议：

- 使用该 item 在 HRMS business meaning 中定义的 details 字段
- 额外补充 UI 层字段：
  - severity / issue state
  - issue reason
  - row actions
- 支持 `All`、`Ignored`、`Confirmed Impact` 切换
- 保持异常行高亮能力

## AI 内容规则

Item 内 AI 输出建议遵循以下规则：

- 以当前 item 为作用域，不做跨整个弹窗的全局大报告
- 先按问题类型聚合，再展示映射到的检测项
- 尽量引用当前可见数据，而不是只讲抽象政策
- 如果上游字段不足，要明确给出 confidence，而不是隐藏不确定性
- 不要把数据缺口伪装成高确定性结论

推荐结构：

1. Executive issue summary
2. Problem-type cards
3. Detection mapping blocks
4. Review focus suggestions

## Remark 规则

Remark 支持的插入来源：

- AI 摘要
- 单条 details 记录
- 当前筛选结果摘要

当 remark 来自行记录时，建议自动带上用户决策上下文。例如：

- `Zhang San, 2026-06-03, Annual Leave pending approval, decision: Confirmed Impact`

在自动插入后，用户仍然可以自由编辑 remark 文本。

## 实现备注

- 当前 UI 已经具备 item tab 与 summary/details 表格模式，因此本设计更适合在现有结构上扩展，而不是彻底推翻重做。
- 有些检测项当前仍受限于 HRMS 字段缺失，但本设计仍然先为它们绑定主 item，这样后续字段补齐时 UI 结构不需要再改。
- `Ignore` 与 `Confirm impact` 必须是 `Details` 中的行级操作，而不是底部批量按钮。
- 如果后续确实需要批量动作，可以补充，但不能替代行级 review。

## 建议的实现顺序

1. 重组单个 item 工作区为 `Summary + Details + AI Overview + Remark`
2. 把 review 动作移动到 `Details` 行级操作
3. 增加行状态模型与 `All / Ignored / Confirmed Impact` tab
4. 增加 `Re-detect` 且保留已有决策
5. 增加 item 级 AI Overview 组件
6. 增加从 AI 与记录写入 remark 的能力
7. 接入 item-to-detection 配置，让 AI 内容与 issue reason 配置化驱动

## 确认结论摘要

本设计在 brainstorming 中已经确认了以下关键决策：

- 整体流程保持 item-driven，不改成 detection-driven
- AI 只出现在 item 内容层，不放在 item 列表层做主引导
- AI 先按问题类型聚合，再映射到 A1/A2 检测项
- 用户最终是一次性确认整个 item
- AI 只做提示，数据表本身承担异常标识
- 记录级判断使用 `Ignore` 或 `Confirm impact`
- 这些判断只发生在 `Details`
- 正常行同样允许 `Ignore / Confirm impact`
- Re-detect 不覆盖已有人工决策
- Remark 支持一键带入 AI 摘要和记录级问题
