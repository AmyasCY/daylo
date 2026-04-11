# 预期系统分层
基于 `project_brief.md`，推荐逐步形成以下分层：

- UI 层：页面、表单、列表、schedule 展示
- API 层：处理 HTTP 请求、调用校验与服务
- 校验层：使用 schema 校验输入输出
- 服务层：封装 goals、tasks、time blocks、schedule、re-plan 业务逻辑
- 数据层：MongoDB 连接、实体定义、持久化读写

# 核心领域对象
- Goal：代表中长期目标
- Task：可关联 Goal，包含 deadline、estimatedDuration、priority、status
- TimeBlock：代表用户当天可用时间
- Schedule：当天排程结果，包含安排明细与 reasoning

# 关键业务流
1. 用户创建或维护 Goal
2. 用户创建或维护 Task，并可选关联到 Goal
3. 用户录入当天 TimeBlock
4. 系统按规则计算 Schedule
5. 系统输出 reasoning，说明为什么这样安排
6. 用户给出反馈，系统触发 re-plan

# 初版调度规则
- 先按 deadline urgency 排序
- 再按 priority 排序
- 再参考 goal alignment
- 将任务放入当天时间块，避免冲突

# 目前实际状态
- 上述模式目前还未在代码中实现
- 当前仓库只有最小的 App Router 前端骨架
- 这个文件记录的是目标架构方向，不代表现有实现已完成
