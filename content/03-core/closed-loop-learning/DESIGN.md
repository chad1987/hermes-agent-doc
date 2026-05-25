# Skill自进化运营平台设计方案

**项目代号：SkillForge（技能熔炉）**

---

## 一、整体定位

核心目标：

> **让部门的每一个Skill都能被度量、被优化、被持续进化，形成数据驱动的自进化闭环。**

核心理念：**让数据驱动改进，让结果验证价值。**

现有的Skill优化要么靠专家人工评审（主观、慢），要么靠结构检查（只看格式，不看效果）。这套系统的核心区别是：

> **结构评分 + 效果验证 + 用户反馈 三条线同时跑，Skill的每一次调用都是一次评估机会。**

---

## 二、系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                     SkillForge 运营平台                      │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│  Skill 注册  │  反馈采集    │   评估引擎   │   优化进化      │
│  与市场      │  与度量      │             │                │
├─────────────┴─────────────┴─────────────┴─────────────────┤
│                    生命周期管理层                            │
│         (准入 / 版本 / 归档 / 策展 / 伞形构建)               │
├─────────────────────────────────────────────────────────────┤
│                    夜间梦境系统                              │
│         (趋势分析 / 需求预测 / Gap识别 / 建议生成)            │
└─────────────────────────────────────────────────────────────┘
```

---

## 三、数据来源：四类信号源

### 3.1 调用本身（被动采集）

| 指标 | 说明 |
|------|------|
| use_count | 累计调用次数 |
| view_count | 被查看次数 |
| execution_time | 平均执行耗时 |
| success_rate | 成功率 |
| error_type | 错误类型分布 |
| context | 调用场景（任务类型） |

### 3.2 用户主动反馈

| 指标 | 说明 |
|------|------|
| rating | 1-5星评分 |
| useful/not_useful | 有用/无用标记 |
| comment | 自由文本评论 |
| scenario_tag | 场景标签 |

### 3.3 专家评审（定期）

| 指标 | 说明 |
|------|------|
| structure_score | 结构质量评分 |
| boundary_coverage | 边界覆盖度 |
| instruction_clarity | 指令清晰度 |
| improvement_suggestion | 改进建议 |

### 3.4 业务结果（滞后）

| 指标 | 说明 |
|------|------|
| task_completion | 任务是否完成 |
| time_saved | 节省了多少时间 |
| quality_output | 产出质量 |
| roi | 投入产出比 |

---

## 四、反馈采集机制

### 4.1 轻量评分（每次调用后）

Skill调用结束后，自动弹出：

```
┌─────────────────────────────────────┐
│  skill-name 帮你完成了任务            │
│                                     │
│  👍 有用  👎 一般  🚫 没用             │
│                                     │
│  [可选：简短说明]                    │
└─────────────────────────────────────┘
```

设计原则：
- **1秒内完成**：用户不被打断
- **不强制**：可以跳过，跳过算"沉默记录"
- **场景自动推断**：根据调用上下文打标签

### 4.2 深度反馈（每周邀请）

对于调用量大的Skill，每周向高频用户推送深度问卷：

```
本周你用了 12 次 pr-review-skill，
平均评分 4.3星，以下场景你最有印象？
□ 复杂的跨文件依赖审查
□ 快速回归检查
□ 大型PR的变更概览
哪个场景你最希望改进？
```

### 4.3 专家轮审（每月一次）

每个月末，对TOP 20 Skill进行专家评审：

| 维度 | 评分标准 |
|------|---------|
| 边界覆盖 | 异常情况处理是否完整 |
| 指令具体性 | 参数是否明确、格式是否说清楚 |
| 可执行性 | 步骤是否真的能跑通 |
| 场景匹配度 | 是否覆盖主要使用场景 |

---

## 五、评估引擎：四层评分模型

### 5.1 综合健康分公式

```
综合健康分 = 结构分×0.25 + 效果分×0.35 + 反馈分×0.20 + 影响分×0.20
```

四个维度各有权重，结构分权重最低——"写得好不好"不是最终目的，"用得好不好"才是。

### 5.2 第一层：结构评分（0-100，权重0.25）

静态分析维度，参考Darwin的1-6维度：

| 维度 | 权重 | 评估内容 | 计算方式 |
|------|------|---------|---------|
| Frontmatter质量 | 8 | name规范、description完整、触发词合理 | 静态正则检查 |
| 工作流清晰度 | 20 | 步骤明确、有序号、每步有输入输出 | LLM打分（子Agent） |
| 边界覆盖 | 15 | 异常处理、fallback路径、错误恢复 | 专家规则 + LLM |
| 检查点设计 | 7 | 关键决策有确认机制 | 静态检查 |
| 指令具体性 | 20 | 参数明确、格式说明、可执行 | LLM打分 |
| 资源整合度 | 5 | references路径可达、scripts可用 | 自动化检查 |

**关键机制**：结构评分由**子Agent**评估，不是Skill自己评自己。

```python
def evaluate_structure(skill_path):
    skill_content = read(skill_path / "SKILL.md")
    
    # 规则检查（自动化）
    scores["frontmatter"] = check_frontmatter(skill_content)
    scores["checkpoints"] = check_checkpoints(skill_content)
    scores["resources"] = check_resources(skill_path)
    
    # LLM打分（子Agent，避免自己评自己）
    llm_scores = spawn_subagent(
        goal=f"评估以下SKILL.md的结构质量，给出1-100的评分并说明理由：\n{skill_content}"
    )
    scores["workflow"] = llm_scores["workflow_clarity"]
    scores["specificity"] = llm_scores["instruction_specificity"]
    scores["boundary"] = llm_scores["boundary_coverage"]
    
    return weighted_sum(scores)
```

### 5.3 第二层：效果评分（0-100，权重0.35）

核心差异点。结构评分看"怎么写"，效果评分看"怎么跑"。

#### 测试Prompt设计

每个Skill在入库前，必须设计**2-3个测试Prompt**：

```json
// skill目录/test-prompts.json
[
  {
    "id": 1,
    "scenario": "典型场景",
    "prompt": "用户会说的话",
    "expected": "期望输出的简要描述",
    "weight": 0.5
  },
  {
    "id": 2,
    "scenario": "边界场景",
    "prompt": "容易出错的输入",
    "expected": "期望能正确处理",
    "weight": 0.3
  },
  {
    "id": 3,
    "scenario": "复杂场景",
    "prompt": "多步骤或歧义输入",
    "expected": "期望能识别并询问",
    "weight": 0.2
  }
]
```

#### 双盲测试

效果评分用**双盲测试**：

```
测试集A：带着Skill执行测试prompt → 输出A
测试集B：不带Skill执行同一prompt → 输出B

效果分 = 对比A vs B的差距
- 任务完成度提升了多少
- 产出质量提升了多少
- 执行时间减少了多少
```

```python
def evaluate_effectiveness(skill_path, test_prompts):
    results = []
    
    for prompt in test_prompts:
        # 有Skill的输出
        with_output = spawn_agent(
            goal=prompt["prompt"],
            with_skill=skill_path
        )
        
        # 没有Skill的输出（baseline）
        without_output = spawn_agent(
            goal=prompt["prompt"],
            with_skill=None  # 裸Agent
        )
        
        # 对比评分
        improvement = judge_improvement(
            with_output, 
            without_output,
            prompt["expected"]
        )
        
        results.append({
            "prompt_id": prompt["id"],
            "with_score": improvement["with_score"],
            "without_score": improvement["without_score"],
            "delta": improvement["delta"],
            "weight": prompt["weight"]
        })
    
    return sum(r["delta"] * r["weight"] for r in results)
```

#### 评分规则

| 情况 | 得分 |
|------|------|
| 有Skill显著优于无Skill | 80-100 |
| 有Skill略优于无Skill | 60-79 |
| 有Skill等于无Skill | 40-59 |
| 有Skill不如无Skill | 0-39 |

效果评分如果无法实测（如资源限制），标注`dry_run`状态，用结构评分估算：

```
估算效果分 = 结构分 × 0.8
```

### 5.4 第三层：反馈评分（0-100，权重0.20）

用户实际使用感受，最真实的数据。

```python
def calculate_feedback_score(skill_name):
    feedback = read_market_json(skill_name)["feedback"]
    
    # 有用率（60%权重）
    if feedback["total_ratings"] >= 5:
        useful_rate = feedback["useful_count"] / (
            feedback["useful_count"] + feedback["not_useful_count"]
        )
        useful_score = useful_rate * 60
    else:
        useful_score = None
    
    # 平均星级（40%权重）
    if feedback["total_ratings"] >= 3:
        avg_rating_score = (feedback["avg_rating"] / 5) * 40
    else:
        avg_rating_score = None
    
    # 综合
    scores = [s for s in [useful_score, avg_rating_score] if s is not None]
    if not scores:
        return 50  # 默认值（新Skill暂无数据）
    
    return sum(scores) / len(scores) * 100
```

### 5.5 第四层：影响评分（0-100，权重0.20）

业务层面的实际价值，数据获取成本最高。

```python
def calculate_impact_score(skill_name):
    impact = read_market_json(skill_name)["impact"]
    
    # 任务完成率（40%权重）
    task_score = impact["task_completion_rate"] * 40
    
    # 时间节省（30%权重）- 归一化到0-100
    if impact["avg_time_saved_min"] > 30:
        time_score = 30  # 上限30
    else:
        time_score = impact["avg_time_saved_min"]
    
    # 错误率（30%权重）- 越低越好
    error_score = (1 - impact["error_rate"]) * 30
    
    return task_score + time_score + error_score
```

### 5.6 综合健康分计算

```python
def calculate_health_score(skill_name):
    market = read_market_json(skill_name)
    
    structure = calculate_structure_score(skill_name)
    effectiveness = calculate_effectiveness_score(skill_name)
    feedback = calculate_feedback_score(skill_name)
    impact = calculate_impact_score(skill_name)
    
    total = (
        structure * 0.25 +
        effectiveness * 0.35 +
        feedback * 0.20 +
        impact * 0.20
    )
    
    return round(total, 1)
```

### 5.7 评分优先级（数据降级）

数据充足时优先用实测，数据不足时降级估算：

| 优先级 | 条件 | 计算方式 |
|--------|------|---------|
| P1 | 四层数据全 | 完整加权求和 |
| P2 | 缺影响数据 | 结构×0.30 + 效果×0.40 + 反馈×0.30 |
| P3 | 缺效果+影响 | 结构×0.50 + 反馈×0.50 |
| P4 | 全新Skill | 只跑结构分，反馈和效果等积累后再算 |

---

## 六、优化进化机制：三级驱动

```
┌──────────────────────────────────────────────────┐
│ L3: 战略级（夜间梦境）                              │
│ 频率：每日夜间                                      │
│ 内容：趋势分析、Gap识别、新兴需求预测                 │
│ 输出：《Skill优化建议报告》给部门负责人               │
└──────────────────────────────────────────────────┘
                         ↑
┌──────────────────────────────────────────────────┐
│ L2: 战术级（Darwin棘轮）                            │
│ 频率：每周/每月                                     │
│ 内容：完整评估→改进→验证→保留/回滚                  │
│ 输出：优化后的Skill新版本                           │
└──────────────────────────────────────────────────┘
                         ↑
┌──────────────────────────────────────────────────┐
│ L1: 响应级（快速补丁）                              │
│ 频率：实时                                          │
│ 内容：错误修复、边界条件补充、措辞调整                │
│ 输出：Skill热更新，≤24h生效                        │
└──────────────────────────────────────────────────┘
```

### 6.1 L1：响应级优化（日常维护）

**触发条件**：
- 用户反馈"没用"3次（同一维度）
- Skill调用报错
- Owner主动提交修订

**处理流程**：

```
发现问题 → 问题分类 → 紧急评估 → 更新Skill → 通知Owner
```

问题分类与SLA：

| 类型 | 处理动作 | SLA |
|------|---------|-----|
| 错误类（执行报错） | 立即修复 | 4小时内 |
| 边界类（场景覆盖不足） | 补充条件分支 | 24小时内 |
| 表达类（措辞不清晰） | 润色优化 | 72小时内 |

### 6.2 L2：战术级优化（Darwin棘轮）

核心自进化机制。参考Darwin的5阶段优化循环。

#### 触发条件

| 条件 | 阈值 | 优先级 |
|------|------|--------|
| 综合健康分连续2周低于 | 70分 | P1 |
| 效果评分连续2周低于 | 60分 | P1 |
| 结构评分中任意维度低于 | 50分 | P2 |
| 用户反馈有用率连续2周低于 | 60% | P2 |

#### 优化循环（Phase 0-3）

**Phase 0: 初始化**

```
1. 确定优化范围（全量 / 指定Skill）
2. 创建Git分支：skill-evo/YYYYMMDD-HHMM
3. 读取当前评分，锁定基准线
4. 初始化优化日志 skill-name/evolution.log
```

**Phase 0.5: 测试Prompt确认**

每个Skill优化前，重新确认或生成测试Prompt：

```python
def design_test_prompts(skill_path):
    skill_content = read(skill_path / "SKILL.md")
    skill_summary = llm_summarize(skill_content)
    
    test_prompts = [
        {
            "id": 1,
            "scenario": "典型场景",
            "prompt": generate_prompt(skill_summary, "typical"),
            "expected": generate_expected(skill_summary, "typical"),
            "weight": 0.5
        },
        {
            "id": 2,
            "scenario": "复杂/歧义场景",
            "prompt": generate_prompt(skill_summary, "complex"),
            "expected": generate_expected(skill_summary, "complex"),
            "weight": 0.3
        }
    ]
    
    confirm(test_prompts)  # 展示给用户确认
    return test_prompts
```

**Phase 1: 基线评估**

对目标Skill执行完整四层评分，锁定当前最优分作为基准。

评分卡示例：

```
┌────────────────────────────────────────────────────────┐
│ Skill: github-pr-review  当前健康分: 72               │
├────────────┬─────────┬───────────┬────────────────────┤
│ 维度       │ 得分    │ 权重      │ 贡献               │
├────────────┼─────────┼───────────┼────────────────────┤
│ 结构       │ 75      │ 25%       │ 18.75              │
│ 效果       │ 68      │ 35%       │ 23.80              │
│ 反馈       │ 74      │ 20%       │ 14.80              │
│ 影响       │ 70      │ 20%       │ 14.00              │
├────────────┼─────────┼───────────┼────────────────────┤
│ 综合       │ 72      │ 100%      │ 71.35 ≈ 72         │
├────────────┴─────────┴───────────┴────────────────────┤
│ 最弱维度: 效果评分(68) → 优先优化                      │
│ 次弱维度: 结构评分(75) → 边界覆盖                      │
└────────────────────────────────────────────────────────┘
```

**Phase 2: 优化循环（核心）**

```python
def optimization_loop(skill_path, baseline_score):
    """Darwin棘轮机制"""
    
    round = 0
    max_rounds = 3
    current_best = baseline_score
    
    while round < max_rounds:
        round += 1
        
        # Step 1: 诊断 - 找最弱维度
        weak_dimensions = rank_dimensions(skill_path)[:1]
        
        # Step 2: 生成改进方案
        improvement = generate_improvement_plan(skill_path, weak_dimensions[0])
        
        # Step 3: 执行改进
        apply_improvement(skill_path, improvement)
        git_commit(f"evolve {skill_path.name}: {improvement['summary']}")
        
        # Step 4: 重新评估
        new_score = calculate_health_score(skill_path)
        
        # Step 5: 棘轮决策
        if new_score > current_best:
            current_best = new_score
            log_result(skill_path, round, improvement, new_score, "KEEP")
        else:
            git_revert(skill_path)
            log_result(skill_path, round, improvement, new_score, "REVERT")
            break
        
        # 每轮优化后暂停，等用户确认
        if round < max_rounds:
            pause_for_user_review(skill_path, round, current_best)
    
    return current_best
```

**优化策略优先级**：

| 优先级 | 类型 | 说明 |
|--------|------|------|
| P0 | 效果问题 | 实测发现的bug或不足 |
| P1 | 边界问题 | 场景覆盖不全 |
| P2 | 表达问题 | 指令不清晰 |
| P3 | 可读性问题 | 格式/注释优化 |

**棘轮原则**：
- 分数只能上升
- 每一轮要么改进，要么干净回滚
- 不积累局部退化
- **人在回路**：每轮优化完暂停，用户确认后再继续

**Phase 2.5: 探索性重写（可选）**

当hill-climbing连续2个Skill都在Round 1就break（涨不动）时，可以提议：

```python
def exploratory_rewrite(skill_path):
    """从零重写，而非微调"""
    
    git_stash()  # 保存当前最优版本
    
    new_content = llm_rewrite(skill_path)
    write(skill_path / "SKILL.md", new_content)
    
    new_score = calculate_health_score(skill_path)
    old_score = get_stashed_score()
    
    if new_score > old_score:
        git_commit("exploratory rewrite: improvement achieved")
        return new_score
    else:
        git_stash_pop()
        return old_score
```

**必须征得用户同意后才执行。**

**Phase 3: 汇总报告**

```
## 优化报告: github-pr-review

### 基准线
- 优化前健康分: 72
- 最弱维度: 效果评分(68)

### 优化过程
┌───────┬─────────────────┬────────┬─────────┬──────────┐
│ Round │ 改进行动         │ 新得分 │ 决策    │
├───────┼─────────────────┼────────┼─────────┼──────────┤
│ 1     │ 补充跨文件依赖检测│ 76     │ KEEP ✓  │
│ 2     │ 增加边界条件fallback│ 79   │ KEEP ✓  │
│ 3     │ 优化指令表述     │ 79     │ REVERT ✗│
├───────┼─────────────────┼────────┼─────────┼──────────┤
│ 最终  │                 │ 76     │         │
└───────┴─────────────────┴────────┴─────────┴──────────┘

### 改进摘要
1. [Round1] 补充了跨文件依赖场景，新增test-prompts覆盖
2. [Round2] 增加了文件不存在、网络超时等fallback处理
3. [Round3] 措辞优化效果不明显，回滚

### 最终得分: 76 (+4)
```

### 6.3 L3：战略级优化（夜间梦境）

每日夜间（02:00）执行，系统自动整合所有数据，发现深层规律。

#### 三阶段模型

```python
def dreaming_cycle():
    """夜间梦境三阶段"""
    
    # === Phase 1: Light (暂存) ===
    recent_calls = get_calls(since="7d")
    recent_feedback = get_feedback(since="7d")
    recent_errors = get_errors(since="7d")
    
    signals = categorize_signals(recent_calls, recent_feedback, recent_errors)
    
    # === Phase 2: Deep (打分) ===
    deep_signals = []
    for signal in signals[:10]:  # Top 10信号
        score = calculate_deep_score(signal)
        deep_signals.append({**signal, "deep_score": score})
    
    persistent_candidates = [s for s in deep_signals if s["deep_score"] > 0.7]
    save_to_memory(persistent_candidates, target="MEMORY.md")
    
    # === Phase 3: REM (反思) ===
    themes = identify_themes(persistent_candidates)
    gaps = identify_gaps(persistent_candidates)
    suggestions = generate_strategic_suggestions(themes, gaps)
    
    return {"themes": themes, "gaps": gaps, "suggestions": suggestions}
```

#### Deep Ranking信号

| 信号类型 | 权重 | 说明 |
|---------|------|------|
| Frequency | 0.24 | 短期信号累积次数 |
| Relevance | 0.30 | 平均检索质量 |
| Query Diversity | 0.15 | 触发查询的多样性 |
| Recency | 0.15 | 时间衰减新鲜度 |
| Consolidation | 0.10 | 多日复发强度 |
| Conceptual Richness | 0.06 | 概念标签密度 |

#### L3输出：每日梦境报告

```
## Skill夜间梦境报告 - 2026-05-17

### 趋势发现
1. [强信号] 代码审查Skill被高频调用，但边界场景覆盖不足
   - 证据：调用量+40%，错误率+15%
   
2. [中信号] 多团队搜索"测试用例生成"但无对应Skill
   - Gap: 新兴需求，可考虑新建Skill

### 体系优化建议
1. 建议将 code-review-* 系列Skill合并为伞形结构
2. 建议新建 test-case-generation Skill
3. 建议对 avg-execution-time 排名Top3的Skill进行性能优化

### 长期观察
- pr-workflow Skill调用量连续下降（-23% 本月）
- 可能被新出现的 agentic-dev-flow Skill替代
- 建议Owner团队评估是否归档

---
报告生成时间: 2026-05-17 02:00
数据周期: 2026-05-10 ~ 2026-05-17
```

---

## 七、闭环验证机制

优化是否有效，最终要看结果。每一轮优化后，必须验证：

```python
def verify_improvement(skill_name, before_score, after_score):
    """验证优化是否真的带来了改进"""
    
    # 1. 短期验证（优化后7天内）
    short_term = {
        "use_count_delta": get_delta(skill_name, "use_count", days=7),
        "avg_rating_delta": get_delta(skill_name, "avg_rating", days=7),
        "success_rate_delta": get_delta(skill_name, "success_rate", days=7),
    }
    
    # 2. 长期验证（优化后30天）
    long_term = {
        "health_score_trend": get_trend(skill_name, "health_score", days=30),
        "feedback_score_trend": get_trend(skill_name, "feedback_score", days=30),
        "user_retention": calculate_retention(skill_name, days=30),
    }
    
    # 3. 异常检测
    anomalies = detect_anomalies(skill_name)
    
    return {"short_term": short_term, "long_term": long_term, "anomalies": anomalies}
```

**判定标准**：

| 验证结果 | 判定 | 动作 |
|---------|------|------|
| 各项指标均提升 | ✓ 有效 | 继续保持 |
| 指标持平 | ⚠ 需观察 | 下次优化时重点关注 |
| 指标下降 | ✗ 退化 | 触发自动回滚流程 |
| 异常波动 | 🚨 需检查 | 暂停优化，通知Owner |

---

## 八、异常处理与边界条件

| 场景 | 处理规则 |
|------|---------|
| Skill不在Git仓库 | 用文件备份代替revert：`SKILL.md.bak.YYYYMMDD-HHMM` |
| 优化后分数反而下降 | 自动revert，不保留退化 |
| 新Skill数据不足 | 用规则估算，不因数据缺失而放弃优化 |
| 测试环境无法运行子Agent | 降级为dry_run，标注不确定性 |
| 用户拒绝确认 | 停在当前版本，不强制继续优化 |
| 多Skill同时触发优化 | 按健康分从低到高排队，逐一优化 |
| 优化进入死循环（涨不动） | 触发探索性重写提议，或标记为"瓶颈Skill" |

---

## 九、整体数据流

```
用户调用Skill
    │
    ▼
┌─────────────────┐
│  调用Telemetry  │ ──→ .market.json (use_count, success_rate, etc.)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  用户评分反馈    │ ──→ .market.json (rating, useful/not_useful)
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│           评估引擎（定时）            │
│  结构评分 ←─ 静态分析 + LLM         │
│  效果评分 ←─ 双盲测试（子Agent）     │
│  反馈评分 ←─ 历史数据加权           │
│  影响评分 ←─ 业务数据               │
│            ↓                        │
│         健康分                      │
└────────┬────────────────────────────┘
         │
         ▼
   ┌─────┴─────┐
   │ 健康分阈值  │
   └─────┬─────┘
         │
    ┌────┴────────────────────┐
    ▼                         ▼
健康分 ≥ 阈值              健康分 < 阈值
（正常运营）              （触发优化）
    │                         │
    │                    ┌────┴────┐
    │                    ▼         ▼
    │                L1响应级    L2战术级
    │                (日常)      (棘轮)
    │                         │
    ▼                    人在回路确认
  夜间梦境                   │
    │                         ▼
    ▼                   优化后验证
 Gap分析 ─────────────────────┘
    │
    ▼
 策展系统（伞形构建 / 归档）
    │
    ▼
Skill更新后重新进入循环
```

---

## 十、数据存储结构

```json
// .market.json (部门共享Skill数据)
{
  "skill-name": {
    "registry": {
      "name": "skill-name",
      "owner_team": "效能团队",
      "version": "v1.2.0",
      "registered_at": "2026-03-01",
      "category": "代码审查"
    },
    "telemetry": {
      "use_count": 142,
      "view_count": 389,
      "patch_count": 7,
      "last_used_at": "2026-05-17T20:00:00Z",
      "avg_execution_time_ms": 3200,
      "success_rate": 0.96
    },
    "feedback": {
      "avg_rating": 4.2,
      "total_ratings": 38,
      "rating_distribution": {"5": 18, "4": 12, "3": 5, "2": 2, "1": 1},
      "useful_count": 31,
      "not_useful_count": 7,
      "last_rated_at": "2026-05-17T19:30:00Z"
    },
    "expert_review": {
      "last_review_at": "2026-05-01",
      "structure_score": 82,
      "boundary_coverage": 75,
      "instruction_clarity": 88
    },
    "impact": {
      "task_completion_rate": 0.91,
      "avg_time_saved_min": 12,
      "error_rate": 0.04
    }
  }
}
```

---

## 十一、权重与阈值配置化

所有权重和阈值都应该可配置：

```yaml
# skill-evo-config.yaml

# 健康分计算权重
weights:
  structure: 0.25
  effectiveness: 0.35
  feedback: 0.20
  impact: 0.20

# 触发阈值
triggers:
  health_score_low: 70        # 健康分低于此值触发L2
  effectiveness_low: 60       # 效果分低于此值触发L2
  useful_rate_low: 0.60       # 有用率低于此值触发L2

# L2优化参数
evolution:
  max_rounds: 3               # 最大优化轮数
  min_improvement: 0.5       # 最小改进幅度（严格大于）
  dry_run_threshold: 10      # 调用量低于此值用估算

# L3夜间梦境参数
dreaming:
  light_interval: daily     # Light阶段频率
  deep_interval: weekly      # Deep阶段频率
  signals_top_n: 10          # Top N信号做深度分析
  gap_detection_threshold: 5  # Gap检测的搜索次数阈值
```

---

## 十二、与现有系统的关系

```
SkillForge平台
       │
       ├── 复用 Hermes Curator（技能策展、伞形构建）
       ├── 复用 Hermes Telemetry（.usage.json 格式）
       ├── 复用 Darwin 评估体系（8维度评分、棘轮机制）
       │
       ├── 新增 部门级市场层（.market.json）
       ├── 新增 反馈采集层（用户评分、专家评审）
       ├── 新增 影响追踪层（业务ROI、时间节省）
       ├── 新增 夜间梦境L3（需求预测、Gap识别）
       └── 新增 评估引擎层（四层评分、健康分计算）
```

---

## 十三、关键设计原则

1. **效果验证优先于结构检查** — Skill好不好，看跑出来的效果
2. **棘轮机制** — 只保留改进，不积累退化
3. **人在回路** — 每轮优化后暂停确认，不是全自动黑箱
4. **数据驱动** — 所有决策基于实际数据，而非主观感觉
5. **不删除只归档** — archived技能可恢复
6. **Pinned保护** — 固定技能绕过自动转换
7. **原子写入** — 所有文件系统操作使用临时文件+replace

---

_设计文档 | SkillForge_