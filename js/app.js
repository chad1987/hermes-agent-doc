// Hermes Agent Learning Guide - Main Application
(function() {
    'use strict';

    // Initialize Mermaid
    try {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            themeVariables: {
                primaryColor: '#21262d',
                primaryTextColor: '#e6edf3',
                primaryBorderColor: '#30363d',
                lineColor: '#8b949e',
                secondaryColor: '#161b22',
                tertiaryColor: '#0d1117'
            }
        });
    } catch (e) {
        console.error('Mermaid init error:', e);
    }

    // Content store - embedded content for offline access
    const contentStore = {
        '01-overview/01-what-is-hermes': {
            title: '什么是 Hermes Agent',
            path: ['项目概述', '什么是 Hermes Agent'],
            content: `<h1>什么是 Hermes Agent</h1>
<div class="info-box"><strong>Hermes Agent</strong> 是由 <a href="https://nousresearch.com">Nous Research</a> 开发的自改进 AI Agent。它能够从经验中创建技能、在使用中改进技能，并可运行在任何地方——CLI、Telegram、Discord、Slack、WhatsApp、Signal、Matrix、邮件等。</div>
<h2>核心定位</h2>
<p>Hermes Agent 是唯一一个内置学习循环的 Agent：</p>
<ul>
<li><strong>从经验中创建技能</strong> — 复杂任务完成后自动生成可复用的技能</li>
<li><strong>在使用中持续改进</strong> — 技能会在每次使用中优化</li>
<li><strong>记忆系统</strong> — 跨会话持久化知识，支持 FTS5 全文搜索</li>
<li><strong>用户建模</strong> — 通过 Honcho 方言实现跨会话用户理解</li>
</ul>
<h2>运行平台</h2>
<table>
<tr><th>类型</th><th>平台</th></tr>
<tr><td>终端</td><td>本地、Docker、SSH、Modal、Daytona、Vercel Sandbox</td></tr>
<tr><td>消息</td><td>Telegram、Discord、Slack、WhatsApp、Signal、Matrix、Email 等 22+ 平台</td></tr>
<tr><td>IDE</td><td>VS Code、Zed、JetBrains (ACP 协议)</td></tr>
</table>
<h2>支持的模型</h2>
<p>使用任何你想要的模型，无需代码更改：</p>
<ul>
<li>Nous Portal、OpenRouter (200+ 模型)</li>
<li>NVIDIA NIM (Nemotron)、Xiaomi MiMo、z.ai/GLM</li>
<li>Kimi/Moonshot、MiniMax、Hugging Face</li>
<li>OpenAI、Anthropic Claude、Google Gemini</li>
<li>或任何 OpenAI-compatible 端点</li>
</ul>
<h2>技术栈</h2>
<pre><code class="language-text">核心语言: Python 3.11+
UI 框架: Rich + prompt_toolkit
数据库: SQLite (FTS5)
协议: ACP (Agent Client Protocol)
打包: uv (快 Python 包管理)</code></pre>
<h2>版本信息</h2>
<p>当前版本: <strong>v0.14.0</strong> (2026.5.16)</p>
<ul>
<li>808 commits</li>
<li>633 merged PRs</li>
<li>1393 files changed</li>
<li>165,061 insertions</li>
</ul>`
        },
        '01-overview/02-core-features': {
            title: '核心特性',
            path: ['项目概述', '核心特性'],
            content: `<h1>核心特性</h1>
<p>Hermes Agent 是唯一一个内置学习循环的 AI Agent，区别于传统 Agent 的关键在于它能从经验中学习并持续改进。</p>
<h2>真实终端界面 (TUI)</h2>
<p>完整的终端用户界面，提供专业级交互体验：</p>
<ul>
<li><strong>多行编辑</strong> — Shift+Enter 换行，跨行输入复杂命令</li>
<li><strong>Slash 命令补全</strong> — 输入 <code>/</code> 自动弹出命令菜单</li>
<li><strong>对话历史</strong> — 上下箭头切换历史记录，FTS5 搜索</li>
<li><strong>中断重定向</strong> — Ctrl+C 优雅中断，不丢失上下文</li>
<li><strong>流式工具输出</strong> — 实时显示工具执行进度</li>
</ul>
<h3>代码示例：TUI 启动流程</h3>
<pre><code class="language-python"># hermes_cli/main.py 核心流程
from hermes_cli.cli import HermesCLI

async def main():
    cli = HermesCLI()
    await cli.run()

# 或使用 run_agent.py 直接编程调用
from run_agent import AIAgent

agent = AIAgent(
    model="gpt-4o",
    provider="openai",
    max_iterations=90
)
result = await agent.run("帮我分析这个代码库的结构")
print(result)</code></pre>
<h2>多平台运行</h2>
<p>一个进程同时连接 22+ 消息平台，无需分别部署：</p>
<table>
<tr><th>平台</th><th>状态</th><th>特色功能</th></tr>
<tr><td>Telegram</td><td>✅ 稳定</td><td>流式编辑、安全重定向</td></tr>
<tr><td>Discord</td><td>✅ 稳定</td><td>角色白名单、线程支持</td></tr>
<tr><td>Slack</td><td>✅ 稳定</td><td>OAuth 安装</td></tr>
<tr><td>WhatsApp</td><td>✅ 稳定</td><td>陌生人拒绝</td></tr>
<tr><td>Signal</td><td>✅ 稳定</td><td>E2E 加密</td></tr>
<tr><td>Matrix</td><td>✅ 稳定</td><td>去中心化</td></tr>
<tr><td>飞书</td><td>✅ 稳定</td><td>机器人 API</td></tr>
</table>
<h3>架构图</h3>
<pre class="mermaid">graph TB
    GW[GatewayRunner]
    GW --> TG[Telegram]
    GW --> DC[Discord]
    GW --> SL[Slack]
    GW --> WA[WhatsApp]
    GW --> MX[Matrix]
    TG & DC & SL & WA & MX --> AGENT[AIAgent]</pre>
<h2>闭环学习系统</h2>
<p>这是 Hermes Agent 区别于其他 Agent 的核心特性：</p>
<h3>核心组件</h3>
<table>
<tr><th>组件</th><th>文件</th><th>作用</th></tr>
<tr><td>MemoryManager</td><td>memory_manager.py</td><td>协调内置存储 + 外部 provider</td></tr>
<tr><td>SkillManage</td><td>skills/skill_manage.py</td><td>技能自动创建/改进</td></tr>
<tr><td>Curator</td><td>curator.py</td><td>技能策展生命周期</td></tr>
<tr><td>Dreaming</td><td>dreaming.py</td><td>夜间记忆整合</td></tr>
</table>
<h3>学习流程</h3>
<pre class="mermaid">graph LR
    A[用户任务] --> B{AIAgent}
    B --> C[工具调用]
    C --> D[成功完成]
    D --> E{复杂任务?}
    E -->|5+调用| F[自动创建Skill]
    E -->|用户纠正| G[技能改进]
    F --> H[.usage.json]
    G --> H
    H --> I[Curator策展]
    I --> J[合并/归档]
    J --> F</code></pre>
<h3>技能自动创建触发条件</h3>
<pre><code class="language-python"># skill_manage.py 触发逻辑
TRIGGERS = [
    "complex_task",      # 5+ 次 tool 调用
    "error_recovery",    # 克服错误
    "user_correction",   # 用户纠正有效
    "nontrivial_workflow", # 非平凡工作流
    "explicit_request"  # 用户要求记住
]</code></pre>
<h2>调度自动化</h2>
<p>内置 cron 调度器，自然语言配置：</p>
<pre><code class="language-bash"># 设置每日报告
/hermes cron add "每天早上9点发送项目状态报告" --platform telegram

# 设置每周审计
/hermes cron add "每周一分析上周的日志并生成报告" --platform email

# 查看定时任务
/hermes cron list</code></pre>
<h3>Cron 配置结构</h3>
<pre><code class="language-yaml"># ~/.hermes/crontabs/default.yaml
cron_jobs:
  - name: "daily-report"
    schedule: "0 9 * * *"  # 每天9点
    prompt: "分析昨天的工作生成报告"
    platform: telegram
    enabled: true
  - name: "weekly-audit"
    schedule: "0 10 * * 1"  # 每周一10点
    prompt: "分析上周日志，生成审计报告"
    platform: email
    enabled: true</code></pre>
<h2>委托与并行</h2>
<p>生成孤立子 Agent 处理并行工作流：</p>
<pre><code class="language-python"># delegate_task 工具使用
result = await agent.run("""
并行完成以下任务：
1. 分析 src/ 目录的代码结构
2. 检查 tests/ 目录的测试覆盖率
3. 生成项目文档
""")

# 子 Agent 独立运行，共享工具集
# 通过 RPC 调用主 Agent 的工具</code></pre>
<h3>委托架构</h3>
<pre class="mermaid">graph TB
    MAIN[主AIAgent]
    MAIN -->|fork| SUB1[子Agent-1]
    MAIN -->|fork| SUB2[子Agent-2]
    MAIN -->|fork| SUB3[子Agent-3]
    SUB1 -->|RPC| MAIN
    SUB2 -->|RPC| MAIN
    SUB3 -->|RPC| MAIN
    SUB1 & SUB2 & SUB3 --> DB[(SQLite)]</pre>
<h2>任意环境运行</h2>
<table>
<tr><th>环境</th><th>配置</th><th>适用场景</th></tr>
<tr><td>本地</td><td>默认</td><td>开发调试</td></tr>
<tr><td>Docker</td><td>docker_extra_args</td><td>生产部署</td></tr>
<tr><td>SSH</td><td>host/port/user</td><td>远程服务器</td></tr>
<tr><td>Modal</td><td>modal_config</td><td>Serverless</td></tr>
<tr><td>Daytona</td><td>daytona_config</td><td>云IDE</td></tr>
</table>
<h2>研究就绪</h2>
<p>批量轨迹生成用于训练下一代 tool-calling 模型：</p>
<pre><code class="language-python"># 轨迹生成配置
from run_agent import AIAgent

agent = AIAgent(
    model="gpt-4o",
    trajectory_mode=True,  # 启用轨迹记录
    trajectory_output="./trajectories/"
)

# 批量处理任务
tasks = ["任务1", "任务2", "任务3..."]
for task in tasks:
    result = await agent.run(task)
    agent.save_trajectory(f"{task_id}.json")</code></pre>
<h2>与 OpenClaw 的差异</h2>
<div class="info-box">Hermes Agent 是 OpenClaw 的精神继承者，但完全重写。主要区别：</div>
<table>
<tr><th>特性</th><th>OpenClaw</th><th>Hermes Agent</th></tr>
<tr><td>学习系统</td><td>❌ 无</td><td>✅ 闭环学习</td></tr>
<tr><td>记忆系统</td><td>基础</td><td>FTS5 + Provider</td></tr>
<tr><td>技能创建</td><td>❌ 无</td><td>✅ 自动创建</td></tr>
<tr><td>策展系统</td><td>❌ 无</td><td>✅ Curator</td></tr>
<tr><td>多平台</td><td>有限</td><td>22+ 平台</td></tr>
</table>
<div class="info-box">迁移指南: <code>hermes claw migrate</code></div>`
        },
        '01-overview/03-quick-start': {
            title: '快速入门',
            path: ['项目概述', '快速入门'],
            content: `<h1>快速入门</h1>
<h2>安装</h2>
<h3>Linux / macOS / WSL2 / Termux</h3>
<pre><code class="language-bash">curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash</code></pre>
<h3>Windows (PowerShell)</h3>
<pre><code class="language-powershell">irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1 | iex</code></pre>
<h2>首次配置</h2>
<pre><code class="language-bash">hermes              # 启动交互式 CLI
hermes model        # 选择 LLM provider 和模型
hermes setup        # 运行完整设置向导</code></pre>
<h2>核心命令</h2>
<table>
<tr><th>命令</th><th>说明</th></tr>
<tr><td><code>hermes</code></td><td>启动交互式 CLI 对话</td></tr>
<tr><td><code>hermes gateway</code></td><td>启动消息网关 (Telegram、Discord 等)</td></tr>
<tr><td><code>hermes tools</code></td><td>配置启用的工具</td></tr>
<tr><td><code>hermes config set</code></td><td>设置配置值</td></tr>
<tr><td><code>hermes skills</code></td><td>浏览和管理技能</td></tr>
<tr><td><code>hermes doctor</code></td><td>诊断问题</td></tr>
</table>
<h2>环境要求</h2>
<ul>
<li><strong>Python</strong>: 3.11+</li>
<li><strong>Node.js</strong>: 20+ (可选，用于浏览器工具和 WhatsApp)</li>
<li><strong>uv</strong>: 快速 Python 包管理器</li>
</ul>`
        },
        '02-architecture/01-entry-points': {
            title: '入口点',
            path: ['架构全景', '入口点'],
            content: `<h1>入口点</h1>
<p>Hermes Agent 有四个主要入口点，每个服务于不同的使用场景：</p>
<table>
<tr><th>入口点</th><th>文件</th><th>用途</th></tr>
<tr><td><code>hermes</code></td><td><code>hermes_cli/main.py</code></td><td>交互式终端 UI</td></tr>
<tr><td><code>hermes-agent</code></td><td><code>run_agent.py</code></td><td>核心 AIAgent 类 (~12k LOC)</td></tr>
<tr><td><code>hermes gateway</code></td><td><code>gateway/run.py</code></td><td>消息网关 (22+ 平台)</td></tr>
<tr><td><code>hermes-acp</code></td><td><code>acp_adapter/entry.py</code></td><td>IDE 集成 (VS Code/Zed)</td></tr>
</table>
<h2>架构图</h2>
<pre class="mermaid">graph TB
    subgraph "Entry"
        CLI[hermes CLI<br/>hermes_cli/main.py]
        GATEWAY[hermes gateway<br/>gateway/run.py]
        ACP[hermes-acp<br/>acp_adapter/entry.py]
    end
    subgraph "Core"
        AGENT[AIAgent<br/>run_agent.py]
        CONV_LOOP[conversation_loop.py]
        TOOL_EXEC[tool_executor.py]
    end
    subgraph "Tools"
        MODEL_TOOLS[model_tools.py]
        REGISTRY[tools/registry.py]
        TOOLS[tools/*.py<br/>90+ tools]
    end
    CLI --> AGENT
    GATEWAY --> AGENT
    ACP --> AGENT
    AGENT --> CONV_LOOP
    CONV_LOOP --> TOOL_EXEC
    TOOL_EXEC --> MODEL_TOOLS
    MODEL_TOOLS --> REGISTRY
    REGISTRY --> TOOLS</pre>
<h2>run_agent.py — 核心 Agent</h2>
<p><code>AIAgent</code> 类是核心，约 60 个初始化参数：</p>
<ul>
<li>凭证 (api_key, base_url, provider)</li>
<li>路由配置 (model, api_mode)</li>
<li>会话上下文 (session_id, platform)</li>
<li>预算控制 (max_iterations, iteration_budget)</li>
</ul>
<h2>gateway/run.py — 消息网关</h2>
<p><code>GatewayRunner</code> 管理所有平台适配器的生命周期。</p>`
        },
        '02-architecture/02-core-loop': {
            title: '核心循环',
            path: ['架构全景', '核心循环'],
            content: `<h1>核心循环</h1>
<p>Hermes Agent 的核心是一个<strong>同步循环</strong>，迭代执行 tool calls 直到模型返回文本。</p>
<h2>循环逻辑</h2>
<pre><code class="language-python">while (api_call_count < self.max_iterations and self.iteration_budget.remaining > 0) \\
        or self._budget_grace_call:
    if self._interrupt_requested:
        break

    response = client.chat.completions.create(
        model=model,
        messages=messages,
        tools=tool_schemas
    )

    if response.tool_calls:
        for tool_call in response.tool_calls:
            result = handle_function_call(tool_call.name, tool_call.args, task_id)
            messages.append(tool_result_message(result))
        api_call_count += 1
    else:
        return response.content</code></pre>
<h2>消息格式</h2>
<p>使用 OpenAI 格式，推理内容存储在 <code>assistant_msg['reasoning']</code>。</p>
<h2>中断机制</h2>
<div class="info-box">循环支持<strong>中断请求</strong> (<code>_interrupt_requested</code>)，用户可以随时停止当前工作。</div>
<h2>预算控制</h2>
<ul>
<li><code>max_iterations</code>: 最大 tool-call 迭代次数</li>
<li><code>iteration_budget.remaining</code>: 剩余预算</li>
</ul>`
        },
        '02-architecture/03-dependency-chain': {
            title: '依赖链',
            path: ['架构全景', '依赖链'],
            content: `<h1>依赖链</h1>
<p>理解 Hermes Agent 的文件依赖链对于理解整个系统至关重要。</p>
<h2>核心依赖图</h2>
<pre class="mermaid">graph LR
    REGISTRY[tools/registry.py<br/>无依赖 - 基础层]
    TOOLS[tools/*.py<br/>工具实现]
    MODEL[model_tools.py<br/>工具编排]
    AGENT[run_agent.py<br/>核心Agent]

    REGISTRY --> TOOLS
    TOOLS --> MODEL
    MODEL --> AGENT</pre>
<h2>各层职责</h2>
<table>
<tr><th>层</th><th>文件</th><th>职责</th></tr>
<tr><td>基础层</td><td><code>tools/registry.py</code></td><td>工具注册中心，无依赖</td></tr>
<tr><td>工具层</td><td><code>tools/*.py</code></td><td>90+ 个工具实现，自注册</td></tr>
<tr><td>编排层</td><td><code>model_tools.py</code></td><td>工具发现、分发、schema 生成</td></tr>
<tr><td>应用层</td><td><code>run_agent.py</code></td><td>核心 AIAgent 类</td></tr>
</table>
<h2>自注册机制</h2>
<div class="info-box">每个 <code>tools/*.py</code> 文件在模块加载时调用 <code>registry.register()</code>，无需中央注册表维护。</div>`
        },
        '03-core/tool-system/01-overview': {
            title: 'Tool 系统概述',
            path: ['核心子系统', 'Tool 系统', '概述'],
            content: `<h1>Tool 系统概述</h1>
<p>Hermes Agent 的 Tool 系统是<strong>自注册</strong>的——每个工具文件在 import 时自动注册。</p>
<h2>架构图</h2>
<pre class="mermaid">graph TB
    REGISTRY[ToolRegistry<br/>tools/registry.py]

    subgraph "tools/ 目录 (90+ tools)"
        T1[terminal_tool.py]
        T2[delegate_tool.py]
        T3[web_tools.py]
        T4[browser_tool.py]
        T5[file_tools.py]
        T6[mcp_tool.py]
        T7[skills_tool.py]
    end

    T1 & T2 & T3 & T4 & T5 & T6 & T7 --> REGISTRY</pre>
<h2>核心组件</h2>
<ul>
<li><strong>ToolRegistry</strong> — 单例注册中心</li>
<li><strong>ToolEntry</strong> — 工具元数据</li>
<li><strong>discover_builtin_tools()</strong> — AST 扫描自动发现</li>
</ul>
<h2>工具分类</h2>
<table>
<tr><th>类别</th><th>工具</th></tr>
<tr><td>终端</td><td>terminal, process</td></tr>
<tr><td>Web</td><td>web_search, web_extract</td></tr>
<tr><td>浏览器</td><td>browser_navigate, browser_click...</td></tr>
<tr><td>文件</td><td>read_file, write_file, patch</td></tr>
<tr><td>委托</td><td>delegate_task</td></tr>
<tr><td>图像</td><td>vision_analyze, image_generate</td></tr>
</table>
<h2>工具返回格式</h2>
<p>所有工具处理程序<strong>必须返回 JSON 字符串</strong>：</p>
<pre><code class="language-python">def my_tool(param: str) -> str:
    return json.dumps({"success": True, "data": "..."})</code></pre>`
        },
        '03-core/provider/01-overview': {
            title: 'Provider 适配器',
            path: ['核心子系统', 'Provider 适配器', '概述'],
            content: `<h1>Provider 适配器</h1>
<p>Hermes Agent 通过统一的 <code>AIAgent</code> 接口支持多种 LLM Provider，底层通过适配器模式实现。</p>
<h2>支持的 Provider</h2>
<table>
<tr><th>Provider</th><th>适配器文件</th><th>说明</th></tr>
<tr><td>OpenAI</td><td>内置</td><td>默认支持</td></tr>
<tr><td>Anthropic</td><td><code>agent/anthropic_adapter.py</code></td><td>Claude 系列</td></tr>
<tr><td>AWS Bedrock</td><td><code>agent/bedrock_adapter.py</code></td><td>Claude on AWS</td></tr>
<tr><td>Google Gemini</td><td><code>agent/gemini_native_adapter.py</code></td><td>Gemini 原生</td></tr>
<tr><td>OpenRouter</td><td><code>agent/openrouter_client.py</code></td><td>聚合 200+ 模型</td></tr>
</table>
<h2>架构图</h2>
<pre class="mermaid">graph TB
    AIAgent[AIAgent<br/>run_agent.py]
    CLIENT[auxiliary_client.py]

    subgraph "Adapters"
        ANTH[anthropic_adapter]
        BED[bedrock_adapter]
        GEM[gemini_native_adapter]
    end

    AIAgent --> CLIENT
    CLIENT --> ANTH
    CLIENT --> BED
    CLIENT --> GEM</pre>
<h2>适配器职责</h2>
<ul>
<li>API 请求构造</li>
<li>响应标准化</li>
<li>错误处理和重试</li>
</ul>`
        },
        '03-core/cli/01-overview': {
            title: 'CLI 命令系统',
            path: ['核心子系统', 'CLI 命令系统', '概述'],
            content: `<h1>CLI 命令系统</h1>
<p>Hermes Agent 的 CLI 命令通过 <code>COMMAND_REGISTRY</code> 集中管理，支持别名、平台特定映射。</p>
<h2>命令分类</h2>
<table>
<tr><th>分类</th><th>命令示例</th></tr>
<tr><td>Session</td><td>new, clear, retry, undo, compress, stop, background</td></tr>
<tr><td>Configuration</td><td>config, model, personality, skin, voice, reasoning</td></tr>
<tr><td>Tools & Skills</td><td>tools, skills, cron, kanban, plugins</td></tr>
<tr><td>Info</td><td>help, usage, insights, platforms, update, debug</td></tr>
<tr><td>Exit</td><td>quit</td></tr>
</table>
<h2>添加新命令</h2>
<h3>1. 注册命令</h3>
<p>在 <code>hermes_cli/commands.py</code> 添加 <code>CommandDef</code>：</p>
<pre><code class="language-python">CommandDef("mycommand", "Do something", "Session",
           aliases=("mc",), args_hint="<prompt>")</code></pre>
<h3>2. 添加处理器</h3>
<p>在 <code>hermes_cli/cli.py</code> 的 <code>process_command()</code> 方法：</p>
<pre><code class="language-python">elif canonical == "mycommand":
    self._handle_mycommand(cmd_original)</code></pre>
<div class="info-box">添加别名只需修改 <code>aliases</code> 元组，分发、帮助文本、平台菜单都会自动更新。</div>`
        },
        '03-core/gateway/01-overview': {
            title: 'Gateway 消息网关',
            path: ['核心子系统', 'Gateway 消息网关', '概述'],
            content: `<h1>Gateway 消息网关</h1>
<p>Gateway 是 Hermes Agent 的消息路由层，支持 22+ 个消息平台。</p>
<h2>支持的平台</h2>
<table>
<tr><th>平台</th><th>文件</th><th>说明</th></tr>
<tr><td>Telegram</td><td><code>platforms/telegram.py</code></td><td>Bot API</td></tr>
<tr><td>Discord</td><td><code>platforms/discord.py</code></td><td>Bot API</td></tr>
<tr><td>Slack</td><td><code>platforms/slack.py</code></td><td>Bot API</td></tr>
<tr><td>WhatsApp</td><td><code>platforms/whatsapp.py</code></td><td>Business API</td></tr>
<tr><td>Signal</td><td><code>platforms/signal.py</code></td><td>Signal CLI</td></tr>
<tr><td>Matrix</td><td><code>platforms/matrix.py</code></td><td>E2E 加密</td></tr>
<tr><td>Feishu</td><td><code>platforms/feishu.py</code></td><td>飞书</td></tr>
<tr><td>DingTalk</td><td><code>platforms/dingtalk.py</code></td><td>钉钉</td></tr>
</table>
<h2>架构图</h2>
<pre class="mermaid">graph TB
    GW[GatewayRunner<br/>gateway/run.py]
    CONFIG[gateway/config.py]
    SESSION[gateway/session.py]
    DELIVERY[gateway/delivery.py]

    subgraph "platforms/"
        TG[telegram.py]
        DC[discord.py]
        SL[slack.py]
    end

    GW --> CONFIG
    GW --> SESSION
    GW --> TG
    GW --> DC
    GW --> SL</pre>
<h2>核心组件</h2>
<ul>
<li><strong>GatewayRunner</strong> — 管理平台适配器生命周期</li>
<li><strong>SessionStore</strong> — 会话上下文管理</li>
<li><strong>DeliveryRouter</strong> — Cron job 输出投递</li>
</ul>
<p>参考 <code>gateway/platforms/ADDING_A_PLATFORM.md</code> 添加新平台。</p>`
        },
        '03-core/skills/01-overview': {
            title: 'Skills 系统',
            path: ['核心子系统', 'Skills 系统', '概述'],
            content: `<h1>Skills 系统</h1>
<p>Skills 是 Hermes Agent 的技能扩展机制，通过自然语言指令调用现有工具组合。</p>
<h2>三层架构</h2>
<table>
<tr><th>层级</th><th>位置</th><th>说明</th><th>数量</th></tr>
<tr><td>内置 Skills</td><td><code>skills/</code></td><td>默认启用，广泛适用</td><td>27 分类</td></tr>
<tr><td>可选 Skills</td><td><code>optional-skills/</code></td><td>官方维护，默认不启用</td><td>80+</td></tr>
<tr><td>Hub Skills</td><td>Skills Hub</td><td>社区贡献，需安装</td><td>持续增长</td></tr>
</table>
<h2>skills/ 内置分类</h2>
<p>apple, autonomous-ai-agents, creative, data-science, devops, diagramming, dogfood, domain, email, gaming, gifs, github, index-cache, inference-sh, mcp, media, mlops, note-taking, productivity, red-teaming, research, smart-home, social-media, software-development, yuanbao</p>
<h2>SKILL.md 格式</h2>
<pre><code class="language-yaml">---
name: my-skill
description: Brief description (≤60 characters)
version: 1.0.0
author: Your Name
platforms: [macos, linux]
metadata:
  hermes:
    tags: [Category, Subcategory]
---

# Skill Instructions

Your skill instructions here...</code></pre>
<h2>安装命令</h2>
<pre><code class="language-bash">hermes skills install official/&lt;category&gt;/&lt;skill&gt;
hermes skills install &lt;user&gt;/&lt;skill&gt;  # Hub</code></pre>`
        },
        '03-core/memory/01-overview': {
            title: 'Memory 记忆系统',
            path: ['核心子系统', 'Memory 记忆系统', '概述'],
            content: `<h1>Memory 记忆系统</h1>
<p>Hermes Agent 提供跨会话持久记忆，支持多种后端 provider。</p>
<h2>架构图</h2>
<pre class="mermaid">graph TB
    MEM[memory_tool.py]
    MM[memory_manager.py]
    MP[MemoryProvider ABC]

    subgraph "Providers (插件)"
        HONCHO[honcho]
        MEM0[mem0]
        SUPER[supermemory]
    end

    MEM --> MM
    MM --> MP
    MP --> HONCHO
    MP --> MEM0
    MP --> SUPER</pre>
<h2>MemoryProvider ABC</h2>
<pre><code class="language-python">class MemoryProvider(ABC):
    def sync_turn(self, user_id, role, content, **kwargs) -> None
    def prefetch(self, user_id, query, **kwargs) -> list[dict]
    def shutdown(self) -> None
    def post_setup(self, hermes_home, config) -> None  # 可选</code></pre>
<h2>内置 Provider</h2>
<table>
<tr><th>Provider</th><th>类型</th><th>特点</th></tr>
<tr><td>honcho</td><td>本地</td><td>轻量，基于文件</td></tr>
<tr><td>mem0</td><td>云</td><td>AI 增强记忆</td></tr>
<tr><td>supermemory</td><td>云</td><td>链接一切</td></tr>
</table>
<h2>政策</h2>
<div class="warning-box"><code>plugins/memory/</code> 目录是<strong>封闭的</strong>。新 provider 必须作为独立插件仓库发布。</div>`
        },
        '04-extend/add-tool/01-overview': {
            title: '添加 Tool',
            path: ['扩展机制', '添加 Tool', '概述'],
            content: `<h1>添加 Tool</h1>
<p>为 Hermes Agent 添加新的 Tool 需要两个文件。</p>
<div class="warning-box">用户自定义工具请使用<strong>插件方式</strong>：<code>~/.hermes/plugins/&lt;name&gt;/plugin.yaml</code></div>
<h2>步骤 1：创建工具文件</h2>
<p>创建 <code>tools/your_tool.py</code>：</p>
<pre><code class="language-python">import json, os
from tools.registry import registry

def check_requirements() -> bool:
    return bool(os.getenv("EXAMPLE_API_KEY"))

def your_tool(param: str, task_id: str = None) -> str:
    return json.dumps({"success": True, "data": "..."})

registry.register(
    name="your_tool",
    toolset="your_toolset",
    schema={
        "name": "your_tool",
        "description": "What this tool does",
        "parameters": {"type": "object", "properties": {"param": {"type": "string"}}, "required": ["param"]}
    },
    handler=lambda args, **kw: your_tool(param=args.get("param", ""), task_id=kw.get("task_id")),
    check_fn=check_requirements,
    requires_env=["EXAMPLE_API_KEY"],
)</code></pre>
<h2>步骤 2：添加到 Toolset</h2>
<p>在 <code>toolsets.py</code> 中添加：</p>
<pre><code class="language-python">TOOLSETS = {
    "your_toolset": ["your_tool"],
    "hermes-cli": _HERMES_CORE_TOOLS + ["your_tool"],
}</code></pre>
<h2>注意事项</h2>
<ul>
<li>所有 handler <strong>必须返回 JSON 字符串</strong></li>
<li>使用 <code>get_hermes_home()</code> 获取路径</li>
<li><code>check_fn</code> 结果缓存 30 秒</li>
</ul>`
        },
        '04-extend/add-skill/01-overview': {
            title: '添加 Skill',
            path: ['扩展机制', '添加 Skill', '概述'],
            content: `<h1>添加 Skill</h1>
<p>Skill 是自然语言指令 + 工具调用的组合，适合包装外部 CLI 或 API。</p>
<h2>决策：Skill 还是 Tool？</h2>
<table>
<tr><th>做成 Skill</th><th>做成 Tool</th></tr>
<tr><td>用指令 + 现有工具实现</td><td>需要端到端 API key 管理</td></tr>
<tr><td>包装外部 CLI</td><td>需要精确执行的二进制/流数据处理</td></tr>
<tr><td>不需要自定义 Python 逻辑</td><td>需要实时事件处理</td></tr>
</table>
<h2>Skill 目录结构</h2>
<pre><code class="language-text">skills/my-skill/
├── SKILL.md           # 必须：技能定义
├── README.md          # 可选：详细文档
├── scripts/           # 可选：辅助脚本
└── requirements.txt   # 可选：依赖</code></pre>
<h2>SKILL.md frontmatter</h2>
<pre><code class="language-yaml">---
name: my-skill
description: 简短描述（≤60字符）
version: 1.0.0
author: Your Name
license: MIT
platforms: [macos, linux, windows]
metadata:
  hermes:
    tags: [Category, Subcategory]
---

# Skill Instructions

Your skill instructions in Markdown...</code></pre>
<h2>Skill 存放位置</h2>
<ul>
<li><strong>广泛适用</strong> → <code>skills/</code>（内置）</li>
<li><strong>官方但专业</strong> → <code>optional-skills/</code>（默认不启用）</li>
<li><strong>社区</strong> → Skills Hub</li>
</ul>`
        },
        '04-extend/add-platform/01-overview': {
            title: '添加 Platform',
            path: ['扩展机制', '添加 Platform', '概述'],
            content: `<h1>添加 Platform</h1>
<p>Hermes Agent 通过平台适配器支持 22+ 个消息平台。</p>
<h2>参考文档</h2>
<p>详细指南：<code>gateway/platforms/ADDING_A_PLATFORM.md</code></p>
<h2>BasePlatform 必需方法</h2>
<pre><code class="language-python">class BasePlatform(ABC):
    @abstractmethod
    async def start(self) -> None: pass

    @abstractmethod
    async def stop(self) -> None: pass

    @abstractmethod
    async def send_message(self, target: str, message: str, **kwargs) -> None: pass

    @abstractmethod
    async def get_file(self, file_id: str) -> bytes: pass

    @property
    @abstractmethod
    def platform_name(self) -> str: pass</code></pre>
<h2>注册新平台</h2>
<p>在 <code>gateway/platform_registry.py</code> 注册：</p>
<pre><code class="language-python">from gateway.platforms.your_platform import YourPlatform

PLATFORM_REGISTRY = {
    "your_platform": YourPlatform,
}</code></pre>
<h2>配置格式</h2>
<pre><code class="language-yaml">gateway:
  platforms:
    your_platform:
      enabled: true
      api_key: &#36;{YOUR_PLATFORM_API_KEY}</code></pre>
<h2>现有平台参考</h2>
<table>
<tr><th>复杂度</th><th>平台</th><th>说明</th></tr>
<tr><td>简单</td><td>webhook</td><td>HTTP 回调</td></tr>
<tr><td>中等</td><td>slack</td><td>需要 OAuth</td></tr>
<tr><td>复杂</td><td>telegram</td><td>完整 Bot API</td></tr>
</table>`
        },
        '05-reference/01-commands': {
            title: '命令索引',
            path: ['参考文档', '命令索引'],
            content: `<h1>命令索引</h1>
<p>Hermes Agent 所有可用的 slash commands 完整列表。</p>
<h2>Session 类命令</h2>
<table>
<tr><th>命令</th><th>别名</th><th>说明</th></tr>
<tr><td>/new</td><td>/reset</td><td>开始新对话</td></tr>
<tr><td>/clear</td><td></td><td>清除当前对话</td></tr>
<tr><td>/history</td><td>/hist</td><td>查看历史</td></tr>
<tr><td>/retry</td><td></td><td>重试上一次</td></tr>
<tr><td>/undo</td><td></td><td>撤销上一次</td></tr>
<tr><td>/compress</td><td></td><td>压缩上下文</td></tr>
<tr><td>/stop</td><td></td><td>停止当前工作</td></tr>
<tr><td>/background</td><td>/bg</td><td>后台运行</td></tr>
<tr><td>/resume</td><td></td><td>恢复对话</td></tr>
<tr><td>/sessions</td><td></td><td>会话列表</td></tr>
</table>
<h2>Configuration 类命令</h2>
<table>
<tr><th>命令</th><th>说明</th></tr>
<tr><td>/config</td><td>配置管理</td></tr>
<tr><td>/model</td><td>选择模型</td></tr>
<tr><td>/personality</td><td>设置人格</td></tr>
<tr><td>/skin</td><td>切换主题</td></tr>
<tr><td>/voice</td><td>语音模式</td></tr>
<tr><td>/reasoning</td><td>推理设置</td></tr>
</table>
<h2>Tools & Skills 类命令</h2>
<table>
<tr><th>命令</th><th>说明</th></tr>
<tr><td>/tools</td><td>工具配置</td></tr>
<tr><td>/skills</td><td>技能浏览</td></tr>
<tr><td>/cron</td><td>定时任务</td></tr>
<tr><td>/kanban</td><td>看板</td></tr>
<tr><td>/plugins</td><td>插件管理</td></tr>
</table>
<h2>Info 类命令</h2>
<table>
<tr><th>命令</th><th>说明</th></tr>
<tr><td>/help</td><td>帮助</td></tr>
<tr><td>/usage</td><td>使用统计</td></tr>
<tr><td>/insights</td><td>洞察报告</td></tr>
<tr><td>/platforms</td><td>平台状态</td></tr>
<tr><td>/debug</td><td>调试信息</td></tr>
</table>`
        },
        '05-reference/02-tools': {
            title: '工具索引',
            path: ['参考文档', '工具索引'],
            content: `<h1>工具索引</h1>
<p>Hermes Agent 所有内置工具的完整列表及参数。</p>
<h2>Web 工具</h2>
<table>
<tr><th>工具</th><th>参数</th><th>说明</th></tr>
<tr><td>web_search</td><td>query, recency_days</td><td>网络搜索</td></tr>
<tr><td>web_extract</td><td>url, query</td><td>提取网页内容</td></tr>
<tr><td>web_crawl</td><td>url, query</td><td>爬取网页</td></tr>
</table>
<h2>文件工具</h2>
<table>
<tr><th>工具</th><th>参数</th><th>说明</th></tr>
<tr><td>read_file</td><td>path, offset, limit</td><td>读取文件</td></tr>
<tr><td>write_file</td><td>path, content</td><td>写入文件</td></tr>
<tr><td>patch</td><td>path, patch</td><td>打补丁</td></tr>
<tr><td>search_files</td><td>pattern, path</td><td>搜索文件</td></tr>
</table>
<h2>终端工具</h2>
<table>
<tr><th>工具</th><th>参数</th><th>说明</th></tr>
<tr><td>terminal</td><td>command, cwd, timeout</td><td>执行命令</td></tr>
<tr><td>process</td><td>command</td><td>后台进程</td></tr>
</table>
<h2>浏览器工具</h2>
<table>
<tr><th>工具</th><th>参数</th><th>说明</th></tr>
<tr><td>browser_navigate</td><td>url</td><td>导航到 URL</td></tr>
<tr><td>browser_snapshot</td><td></td><td>页面快照</td></tr>
<tr><td>browser_click</td><td>selector</td><td>点击元素</td></tr>
<tr><td>browser_vision</td><td></td><td>视觉分析</td></tr>
</table>
<h2>其他主要工具</h2>
<table>
<tr><th>工具</th><th>说明</th></tr>
<tr><td>delegate_task</td><td>委托子 Agent</td></tr>
<tr><td>vision_analyze</td><td>图像分析</td></tr>
<tr><td>image_generate</td><td>图像生成</td></tr>
<tr><td>memory</td><td>记忆操作</td></tr>
<tr><td>session_search</td><td>会话搜索</td></tr>
<tr><td>todo</td><td>待办事项</td></tr>
<tr><td>cronjob</td><td>定时任务</td></tr>
<tr><td>skills_list</td><td>列出技能</td></tr>
<tr><td>send_message</td><td>发送消息</td></tr>
</table>`
        },
        '05-reference/03-config': {
            title: '配置参考',
            path: ['参考文档', '配置参考'],
            content: `<h1>配置参考</h1>
<p>Hermes Agent 配置文件位于 <code>~/.hermes/config.yaml</code>，密钥位于 <code>~/.hermes/.env</code>。</p>
<h2>配置加载路径</h2>
<table>
<tr><th>加载函数</th><th>使用方</th><th>文件</th></tr>
<tr><td>load_cli_config()</td><td>CLI 模式</td><td>cli.py</td></tr>
<tr><td>load_config()</td><td>大多数子命令</td><td>hermes_cli/config.py</td></tr>
<tr><td>直接 YAML 加载</td><td>Gateway 运行时</td><td>gateway/run.py</td></tr>
</table>
<h2>配置结构</h2>
<pre><code class="language-yaml"># 模型配置
model:
  provider: openai
  model: gpt-4o
  api_key: &#36;{OPENAI_API_KEY}

# Agent 配置
agent:
  max_iterations: 90
  quiet_mode: false

# 终端配置
terminal:
  cwd: ~/hermes-projects
  backend: local

# 记忆配置
memory:
  provider: honcho

# 网关配置
gateway:
  enabled: true
  platforms:
    telegram:
      enabled: true
      bot_token: &#36;{TELEGRAM_BOT_TOKEN}</code></pre>
<h2>.env 格式</h2>
<pre><code class="language-text"># API Keys only
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
TELEGRAM_BOT_TOKEN=123456:ABC-...

# 不要在 .env 中放置超时、阈值、特性标志等配置</code></pre>
<h2>添加新配置的步骤</h2>
<h3>config.yaml 选项</h3>
<ol>
<li>添加到 <code>DEFAULT_CONFIG</code>（<code>hermes_cli/config.py</code>）</li>
<li>如果需要迁移则增加 <code>_config_version</code></li>
</ol>
<h3>环境变量</h3>
<ol>
<li>添加到 <code>OPTIONAL_ENV_VARS</code>（<code>hermes_cli/config.py</code>）</li>
</ol>
<div class="warning-box">使用 <code>get_hermes_home()</code> / <code>display_hermes_home()</code> 获取所有持久化路径。不要使用 <code>Path.home() / ".hermes"</code>。</div>`
        },
        '03-core/memory/02-deep-dive': {
            title: 'Memory 深入理解',
            path: ['核心子系统', 'Memory 记忆系统', '深入理解'],
            content: `<h1>Memory 记忆系统深入理解</h1>
<p>Hermes Agent 的记忆系统是闭环学习的核心组成部分，支持跨会话持久化和多种后端 Provider。</p>
<h2>整体架构</h2>
<pre class="mermaid">graph TB
    subgraph "MemoryStore (内置)"
        MEM[memory_tool.py<br/>MEMORY.md / USER.md]
        SYS[系统提示快照<br/>session 期间不变]
    end
    subgraph "MemoryManager"
        MM[memory_manager.py<br/>协调内置 + 外部 provider]
        SANI[上下文净化<br/>StreamingContextScrubber]
    end
    subgraph "MemoryProvider ABC"
        ABC[接口层<br/>initialize / prefetch / sync_turn]
    end
    subgraph "外部 Providers"
        HON[honcho]
        MEM0[mem0]
        SUPER[supermemory]
        HINT[hindsight]
    end
    MEM --> MM
    SYS --> MM
    MM --> ABC
    ABC --> HON
    ABC --> MEM0
    ABC --> SUPER
    ABC --> HINT</pre>
<h2>MemoryProvider ABC 接口</h2>
<pre><code class="language-python">class MemoryProvider(ABC):
    # 生命周期
    def is_available(self) -> bool
    def initialize(self, session_id, **kwargs)
    def shutdown(self) -> None
    # 记忆操作
    def system_prompt_block() -> str
    def prefetch(query, session_id) -> str
    def queue_prefetch(query, session_id)
    def sync_turn(user, assistant, session_id)
    # 工具
    def get_tool_schemas() -> list[dict]
    def handle_tool_call(tool_name, args)</code></pre>
<h2>内置 MemoryStore 设计</h2>
<h3>双重状态机制</h3>
<pre><code class="language-python">class MemoryStore:
    # 冻结快照 - session 期间不变，确保前缀缓存命中
    self._system_prompt_snapshot: Dict[str, str] = {"memory": "", "user": ""}
    # 实时状态 - 通过 tool 调用变更，即时持久化
    self.memory_entries: List[str] = []
    self.user_entries: List[str] = []</code></pre>
<h3>安全扫描机制</h3>
<pre><code class="language-python">_MEMORY_THREAT_PATTERNS = [
    (r'ignore\\s+(previous|all|above|prior)\\s+instructions', "prompt_injection"),
    (r'you\\s+are\\s+now\\s+', "role_hijack"),
    (r'curl\\s+[^\\n]*\\$\\{?\\w*(KEY|TOKEN|SECRET', "exfil_curl"),
]</code></pre>
<h2>FTS5 全文搜索</h2>
<h3>双 FTS5 表设计</h3>
<pre><code class="language-sql">-- 标准 unicode61 tokenizer for 拉丁语言
CREATE VIRTUAL TABLE messages_fts USING fts5(content);
-- Trigram tokenizer for CJK 子串搜索
CREATE VIRTUAL TABLE messages_fts_trigram USING fts5(content, tokenize='trigram');</code></pre>
<h2>Provider 对比</h2>
<table>
<tr><th>Provider</th><th>特点</th><th>工具</th></tr>
<tr><td>honcho</td><td>用户建模、Dialectic 多层推理、成本感知 Cadence</td><td>honcho_profile, honcho_search, honcho_reasoning</td></tr>
<tr><td>mem0</td><td>熔断器模式、异步预取</td><td>mem0_profile, mem0_search, mem0_conclude</td></tr>
<tr><td>supermemory</td><td>多容器支持、对话会话级摄入</td><td>supermemory_store, supermemory_search</td></tr>
<tr><td>hindsight</td><td>单写线程、共享事件循环、Flush-on-Switch</td><td>hindsight_retain, hindsight_recall</td></tr>
</table>
<h2>创新设计模式</h2>
<table>
<tr><th>模式</th><th>应用位置</th><th>描述</th></tr>
<tr><td>单一外部 provider 限制</td><td>MemoryManager.add_provider</td><td>防止 schema 膨胀和后端冲突</td></tr>
<tr><td>冻结快照</td><td>MemoryStore._system_prompt_snapshot</td><td>mid-session 写入不影响 prompt 稳定性</td></tr>
<tr><td>流式 Scrubber</td><td>StreamingContextScrubber</td><td>处理 chunk 边界上的标签泄漏</td></tr>
<tr><td>熔断器</td><td>Mem0, Honcho</td><td>连续失败后暂停 API 调用</td></tr>
</table>`
        },
        '03-core/closed-loop-learning/01-overview': {
            title: '闭环学习系统',
            path: ['核心子系统', '闭环学习系统', '深入理解'],
            content: `<h1>闭环学习系统</h1>
<p>Hermes Agent 的闭环学习系统是区别于其他 Agent 的核心特性。通过技能自动创建、技能自改进、记忆整合和 Curator 策展，形成完整的学习反馈闭环。</p>
<h2>整体架构</h2>
<pre class="mermaid">graph TB
    USER[用户任务] --> AGENT[AIAgent]
    AGENT --> SKILL[技能调用]
    SKILL --> USAGE[.usage.json telemetry]
    USAGE --> CUR[curator.py]
    CUR --> UMBRELLA[伞形构建]
    UMBRELLA -.->|合并优化| SKILL
    AGENT --> MEM[MemoryManager]
    MEM --> HON[Honcho 用户建模]
    HON -.->|用户理解| AGENT</pre>
<h2>技能自动创建</h2>
<h3>触发条件</h3>
<p>Agent 可以通过 <code>skill_manage(action='create')</code> 自动创建技能，触发条件：</p>
<ul>
<li>复杂任务成功（5+ 次 tool 调用）</li>
<li>克服了错误</li>
<li>用户纠正的方法有效</li>
<li>发现了非平凡工作流</li>
<li>用户要求记住一个程序</li>
</ul>
<h3>创建流程</h3>
<pre><code class="language-python">def skill_manage(action, skill_name, content, ...):
    if action == 'create':
        # 1. 验证名称、类别、内容
        # 2. frontmatter 必须包含 name + description
        # 3. SKILL.md ≤ 100,000 字符
        # 4. 检查名称冲突
        # 5. 原子写入（临时文件 + os.replace）
        # 6. 安全扫描（可选）</code></pre>
<h2>Curator 技能策展系统</h2>
<h3>生命周期状态机</h3>
<pre class="mermaid">graph LR
    A[active] -->|stale_after_days (30天)| B[stale]
    B -->|archive_after_days (90天)| C[archived]
    A -->|pinned| A
    C -.->|restore| A</pre>
<h3>自动转换（纯函数，无 LLM）</h3>
<pre><code class="language-python">def apply_automatic_transitions(skills, config):
    """基于最后活动时间戳自动标记"""
    for skill in skills:
        if skill.is_pinned: continue
        latest = latest_activity_at(skill)
        if age > archive_after_days: skill.state = 'archived'
        elif age > stale_after_days: skill.state = 'stale'</code></pre>
<h3>LLM 审查 Pass（伞形构建）</h3>
<pre><code class="language-python">def run_curator_review():
    """后台 fork AIAgent 执行策展"""
    review_agent = AIAgent(max_iterations=9999, skip_memory=True)
    # 1. 识别技能前缀聚类（如 pr-*, hermes-config-*）
    # 2. 对 2+ 成员聚类进行合并
    # 3. 三种策略：MERGE INTO EXISTING / CREATE NEW / DEMOTE TO REFERENCES</code></pre>
<h2>技能使用 telemetry</h2>
<h3>跟踪指标（~/.hermes/skills/.usage.json）</h3>
<pre><code class="language-json">{
  "skill-name": {
    "use_count": 42,
    "last_used_at": "2026-05-10T18:30:00Z",
    "view_count": 156,
    "patch_count": 3
  }
}</code></pre>
<h2>Dreaming 夜间整合</h2>
<p>通过 cron job 执行的夜间梦境系统，自动整合记忆：</p>
<table>
<tr><th>阶段</th><th>目的</th><th>持久化</th></tr>
<tr><td>Light</td><td>排序和暂存近期素材</td><td>否</td></tr>
<tr><td>Deep</td><td>打分并提升持久候选者</td><td>是 (MEMORY.md)</td></tr>
<tr><td>REM</td><td>反思主题和重复想法</td><td>否</td></tr>
</table>
<h2>关键设计原则</h2>
<ol>
<li><strong>不删除只归档</strong> — <code>.archive/</code> 目录中的技能可恢复</li>
<li><strong>Pinned 保护</strong> — 固定技能绕过所有自动转换</li>
<li><strong>仅 agent 创建的技能</strong> — bundled/hub-installed 技能不参与策展</li>
<li><strong>后台审查隔离</strong> — LLM pass 使用独立 fork，不影响主会话</li>
</ol>
<h2>CLI 命令</h2>
<pre><code class="language-bash">hermes curator status   # 显示策展状态
hermes curator run      # 触发策展运行
hermes curator pin       # 固定技能
hermes curator restore  # 恢复归档技能</code></pre>`
        },
        '06-releases/01-all-releases': {
            title: 'Release 版本',
            path: ['Release 版本', '全部版本'],
            content: `<h1>Release 版本历史</h1>
<p>Hermes Agent 的正式发布版本记录，涵盖从 v0.10.0 到最新的 v0.14.0。</p>
<h2>版本概览</h2>
<table>
<tr><th>版本</th><th>代号</th><th>发布日期</th><th>主要亮点</th></tr>
<tr><td>v0.14.0</td><td>2026.5.16</td><td>2026-05-16</td><td>Native Windows、19s冷启动优化、180x browser_console、LSP语义诊断</td></tr>
<tr><td>v0.13.0</td><td>The Tenacity Release</td><td>2026-04-13</td><td>多Agent Kanban、/goal 命令、8项安全修复</td></tr>
<tr><td>v0.12.0</td><td>2026.4.30</td><td>2026-04-03</td><td>ProviderProfile ABC、Skills Hub</td></tr>
<tr><td>v0.11.0</td><td>2026.4.23</td><td>2026-03-28</td><td>飞书平台、Weixin优化</td></tr>
<tr><td>v0.10.0</td><td>2026.4.16</td><td>2026-03-17</td><td>核心架构稳定</td></tr>
</table>
<h2>v0.14.0 (2026.5.16) — 当前版本</h2>
<h3>核心改进</h3>
<ul>
<li><strong>Native Windows 支持</strong> (早期Beta) — CLI/Gateway/TUI/Tools 全链路原生Windows路径</li>
<li><strong>冷启动优化</strong> — Skills缓存 + 懒加载飞书 + 启动时不发Nous HTTP请求，减少19秒</li>
<li><strong>工具配置加速</strong> — hermes tools 全平台从14秒降至&lt;1.5秒</li>
<li><strong>browser_console 180x加速</strong> — 通过supervisor持久化CDP WebSocket</li>
</ul>
<h3>新功能</h3>
<ul>
<li><strong>Per-turn文件变异验证器</strong> — 每次工具调用后验证文件变更</li>
<li><strong>GLM模型工具调用强制</strong> — 针对GLM模型的特殊处理</li>
<li><strong>OAuth代理</strong> — 本地OpenAI兼容代理，Codex/Aider/Cline可连接Claude Pro/ChatGPT Pro</li>
<li><strong>LINE Messaging API</strong> — 新平台插件</li>
<li><strong>x_search工具</strong> — 支持OAuth或API-key认证</li>
</ul>
<h3>安全性</h3>
<ul>
<li>重定向默认开启</li>
<li>Discord角色白名单基于guild作用域</li>
<li>WhatsApp默认拒绝陌生人</li>
<li>auth.json和MCP OAuth的TOCTOU窗口关闭</li>
<li>浏览器强制云元数据SSRF防护</li>
<li>cron prompt注入扫描</li>
<li>hermes debug share上传时重定向</li>
</ul>
<h3>性能数据</h3>
<table>
<tr><th>指标</th><th>优化前</th><th>优化后</th><th>提升</th></tr>
<tr><td>hermes cold start</td><td>~25s</td><td>~6s</td><td>19s减少</td></tr>
<tr><td>hermes tools (All)</td><td>14s</td><td>&lt;1.5s</td><td>9x+</td></tr>
<tr><td>browser_console</td><td>慢</td><td>快180x</td><td>180x</td></tr>
</table>
<h2>v0.13.0 (2026.4.13) — The Tenacity Release</h2>
<h3>多Agent Kanban</h3>
<p>Spin up一个持久化看板，让多个Hermes workers拾取任务、交接、完成：</p>
<ul>
<li>心跳检测 + 回收 + 僵尸检测</li>
<li>任务不完整退出时自动阻塞</li>
<li>per-task重试 + 幻觉恢复</li>
</ul>
<h3>/goal 命令</h3>
<p>锁定Agent目标，跨turn保持任务专注：</p>
<pre><code class="language-bash">/goal 完成代码审查并生成报告
# Agent会记住目标并在多轮对话中持续推进</code></pre>
<h3>安全修复 (8项P0)</h3>
<ul>
<li>重定向默认开启</li>
<li>Discord角色白名单guild作用域 (CVSS 8.1 跨guild DM绕过修复)</li>
<li>WhatsApp默认拒绝陌生人</li>
<li>auth.json和MCP OAuth的TOCTOU窗口关闭</li>
<li>浏览器强制云元数据SSRF底线</li>
<li>cron prompt注入扫描</li>
<li>hermes debug share上传时重定向</li>
</ul>
<h3>Skills媒体路由</h3>
<pre><code class="language-markdown">
[[as_document]]
skill: my-skill
format: pdf
</code></pre>
<h3>ProviderProfile ABC</h3>
<p>推理provider成为可插拔表面：</p>
<pre><code class="language-python"># 新插件结构
plugins/
  model-providers/
    my-provider/
      plugin.yaml
      provider.py  # 实现 ProviderProfile ABC</code></pre>
<h2>v0.12.0 (2026.4.30)</h2>
<ul>
<li>ProviderProfile ABC + plugins/model-providers/</li>
<li>list_picker_providers — 凭证过滤选择器</li>
<li>skill_commands缓存 — 平台范围变化时重新扫描</li>
<li>AGENTS.md — curator/cron/delegation/toolsets</li>
</ul>
<h2>v0.11.0 (2026.4.23)</h2>
<ul>
<li>飞书平台稳定</li>
<li>/sethome在Matrix和Email跨重启持久化</li>
<li>微信消息去重 (内容指纹)</li>
<li>QQBot优化</li>
</ul>
<h2>v0.10.0 (2026.4.16)</h2>
<p>核心架构稳定，基础框架完成。</p>
<h2>版本迁移</h2>
<pre><code class="language-bash"># 从旧版本升级
hermes update

# 从OpenClaw迁移
hermes claw migrate

# 查看当前版本
hermes --version</code></pre>
<h2>贡献者统计</h2>
<table>
<tr><th>指标</th><th>v0.14.0</th></tr>
<tr><td>Commits</td><td>808+</td></tr>
<tr><td>PRs Merged</td><td>633+</td></tr>
<tr><td>Files Changed</td><td>1393</td></tr>
<tr><td>Insertions</td><td>165,061</td></tr>
</table>
<div class="info-box">完整发布说明请查看 <a href="https://github.com/NousResearch/hermes-agent/releases" target="_blank">GitHub Releases</a></div>`
        }
    };

    let currentPage = '01-overview/01-what-is-hermes';
    let isDarkMode = true;

    const contentBody = document.getElementById('contentBody');
    const breadcrumb = document.getElementById('breadcrumb');
    const searchInput = document.getElementById('searchInput');

    function init() {
        console.log('Init called, currentPage:', currentPage);
        console.log('contentStore keys:', Object.keys(contentStore));
        setupNavigation();
        console.log('Navigation set up, loading page:', currentPage);
        loadPage(currentPage);
        setupSearch();
        setupThemeToggle();
    }

    function setupNavigation() {
        document.querySelectorAll('.nav-header[data-toggle="section"]').forEach(header => {
            header.addEventListener('click', () => {
                const children = header.nextElementSibling;
                header.classList.toggle('open');
                children.classList.toggle('open');
            });
        });

        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                if (page) {
                    loadPage(page);
                    updateActiveNav(item);
                }
            });
        });

        document.querySelector('.nav-header').click();
    }

    function loadPage(pageId) {
        currentPage = pageId;
        const page = contentStore[pageId];

        if (page) {
            contentBody.innerHTML = page.content;
            updateBreadcrumb(page.path);
            renderMermaid();
            Prism.highlightAll();
        } else {
            contentBody.innerHTML = '<div class="loading">页面正在开发中...</div>';
        }

        window.scrollTo(0, 0);
    }

    function updateBreadcrumb(path) {
        breadcrumb.innerHTML = path.map((item, index) => {
            if (index < path.length - 1) {
                return `<a href="#">${item}</a><span> / </span>`;
            }
            return `<span>${item}</span>`;
        }).join('');
    }

    function updateActiveNav(activeItem) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }

    function renderMermaid() {
        const mermaidElements = document.querySelectorAll('.mermaid');
        mermaidElements.forEach(async (element, index) => {
            if (!element.textContent.trim()) return;
            try {
                const id = `mermaid-${Date.now()}-${index}`;
                const { svg } = await mermaid.render(id, element.textContent);
                element.innerHTML = svg;
            } catch (error) {
                console.error('Mermaid render error:', error);
            }
        });
    }

    function setupSearch() {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 2) {
                contentBody.innerHTML = contentStore[currentPage].content;
                renderMermaid();
                Prism.highlightAll();
                return;
            }

            const results = Object.entries(contentStore)
                .filter(([key, page]) => {
                    const titleMatch = page.title.toLowerCase().includes(query);
                    const contentMatch = page.content.toLowerCase().includes(query);
                    return titleMatch || contentMatch;
                })
                .slice(0, 10);

            displaySearchResults(results);
        });
    }

    function displaySearchResults(results) {
        if (results.length === 0) {
            contentBody.innerHTML = '<div class="search-results"><p>未找到匹配结果</p></div>';
            return;
        }

        contentBody.innerHTML = '<div class="search-results"><h2>搜索结果</h2>' +
            results.map(([key, page]) => `
                <div class="search-result-item" data-page="${key}">
                    <h4>${page.title}</h4>
                    <p>${page.path.join(' > ')}</p>
                </div>
            `).join('') +
        '</div>';

        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                loadPage(item.dataset.page);
                document.querySelectorAll('.nav-item').forEach(navItem => {
                    navItem.classList.toggle('active', navItem.dataset.page === item.dataset.page);
                });
                searchInput.value = '';
            });
        });
    }

    function setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            themeToggle.textContent = isDarkMode ? '🌙' : '☀️';
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();