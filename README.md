# 约瑟夫问题可视化工具 / Josephus Problem Visualizer

[English](#english) | [中文](#chinese)

---

## <a id="chinese"></a>中文

基于 Vue 3 + Vite 构建的交互式约瑟夫问题可视化工具，支持逐行代码调试和动画演示。

An interactive Josephus problem visualization tool built with Vue 3 + Vite, featuring line-by-line code debugging and animated demonstrations.

### 💡 项目价值 / Project Value

**解决新手学习约瑟夫问题时 "只懂代码不懂逻辑" 的痛点**

Solving the pain point of beginners learning the Josephus problem: "understanding code but not logic"

很多同学在学习约瑟夫问题时，能看懂代码的每一行，但脑海里想不出实际运行的画面。这个项目通过 **"左侧代码 + 右侧 debug 式动画"** 的方式，让你：

Many students can understand each line of code when learning the Josephus problem, but cannot visualize the actual execution. This project uses a **"left code + right debug-style animation"** approach to help you:

- 👀 **眼看代码 / Watch Code**: 左边高亮显示当前执行到哪一行 / Left side highlights the current execution line
- 🎬 **脑补画面 / Visualize Process**: 右边同步演示链表节点的移动和删除 / Right side synchronously demonstrates node movement and deletion
- 🔗 **建立联系 / Make Connections**: 代码和动画实时关联，理解抽象逻辑变得轻松 / Real-time connection between code and animation makes abstract logic easy to understand

不需要安装任何软件，打开网页就能用！

No installation required - just open the web page and start using it!

### 📸 演示截图 / Demo Screenshots

**在线演示 / Live Demo:** [https://chhsiching.github.io/josephus-visualizer/](https://chhsiching.github.io/josephus-visualizer/)

本项目已部署到 GitHub Pages，点击上方链接即可查看实际运行效果。界面包含：

This project is deployed on GitHub Pages. Click the link above to see it in action. The interface includes:

- **左侧代码面板 / Left Code Panel**: 显示 C 语言代码，高亮当前执行行 / Displays C code with current execution line highlighted
- **右侧动画面板 / Right Animation Panel**: 展示约瑟夫环动画，节点移动和删除 / Shows Josephus ring animation with node movement and elimination
- **底部控制面板 / Bottom Control Panel**: 播放、暂停、步进、速度调节 / Play, pause, step, and speed controls

### ✨ 功能特性 / Features

- **🎯 交互式可视化 / Interactive Visualization**: 基于 SVG 的双向循环链表可视化 / SVG-based circular linked list visualization with bidirectional pointers
- **📝 逐行调试 / Line-by-Line Debugging**: GDB 风格的 C 代码执行演示，实时高亮 / GDB-style C code execution with real-time highlighting
- **⏯️ 完整播放控制 / Complete Playback Controls**: 支持播放、暂停、步进和速度调节 / Play, pause, step execution, and speed adjustment
- **🔄 实时动画 / Real-time Animation**: 展示链表构建、计数、节点删除的完整过程 / Shows list construction, counting, and node elimination
- **🎨 响应式设计 / Responsive Design**: Gruvbox 暗色主题，支持不同屏幕尺寸 / Gruvbox dark theme with screen size support
- **📊 详细状态显示 / Detailed Status Display**: 显示当前回合、已删除节点、执行步骤等 / Shows current round, eliminated nodes, execution steps

### 🚀 快速开始 / Quick Start

#### 在线演示 / Live Demo

项目已部署在 GitHub Pages，可直接访问：

The project is deployed on GitHub Pages and can be accessed directly:

[https://chhsiching.github.io/josephus-visualizer/](https://chhsiching.github.io/josephus-visualizer/)

#### 本地开发 / Local Development

```bash
# Clone the project
git clone https://github.com/chhsiching/josephus-visualizer.git
cd josephus-visualizer

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 📖 算法说明 / Algorithm Description

#### 约瑟夫问题 / The Josephus Problem

约瑟夫问题描述：n 个人站成一圈，从指定的人开始顺时针报数，数到 k 的人被淘汰，下一个人重新从 1 开始报数。如此循环，直到所有人被淘汰，确定淘汰顺序。

The Josephus problem describes: n people stand in a circle, starting from a specified person and counting clockwise. The person who counts to k is eliminated, and the next person restarts counting from 1. This continues until all are eliminated, determining the elimination order.

#### 实现细节 / Implementation Details

本项目使用**双向循环链表**实现约瑟夫问题：

This project implements the Josephus problem using a **doubly circular linked list**:

- **节点结构 / Node Structure**: 每个人表示为一个节点，包含 `id`、`next` 和 `pre` 指针 / Each person as a node with `id`, `next`, and `pre` pointers
- **链表构建 / List Construction**: `RingConstruct` 函数创建 N 个节点的双向循环链表 / Creates a doubly circular linked list with N nodes
- **计数模式 / Counting Pattern**: 使用重复模式 [3, 5, 7, 13] 作为每轮淘汰界限 / Uses repeating pattern [3, 5, 7, 13] as elimination bounds
- **计数函数 / Counting Function**: `count` 函数从节点开始计数，找到要淘汰的节点 / Starts from a node and counts to find the elimination target
- **节点移除 / Node Removal**: `removeNode` 函数移除当前节点并重新连接链表 / Removes current node and reconnects the list

#### 可视化系统 / Visualization System

- **双环箭头系统 / Dual-Ring Arrow System**: 外环显示 next 指针（顺时针），内环显示 prev 指针（逆时针） / Outer ring shows next pointers (clockwise), inner ring shows prev pointers (counter-clockwise)
- **动画阶段 / Animation Phases**: 初始化阶段、计数阶段、移除阶段、完成阶段 / Initialization, counting, removal, and completion phases
- **状态同步 / State Synchronization**: 代码行号与动画状态精确同步 / Precise synchronization between code line numbers and animation states

### 🎮 使用说明 / Usage Instructions

#### 基本操作 / Basic Operations

1. **播放/暂停 / Play/Pause**: 点击播放按钮开始自动执行，点击暂停停止 / Click play to start, pause to stop
2. **步进执行 / Step Execution**: 使用前进/后退按钮逐步查看算法执行 / Use forward/backward buttons to step through
3. **速度控制 / Speed Control**: 支持 1x、2x、4x 播放速度 / Supports 1x, 2x, 4x playback speeds
4. **代码导航 / Code Navigation**: 点击左侧代码面板的行号跳转到对应步骤 / Click line numbers to jump to steps
5. **重置 / Reset**: 点击重置按钮重新开始演示 / Click reset to restart

#### 界面说明 / Interface Description

- **左侧面板 / Left Panel**: 显示 C 代码，高亮当前执行行 / Displays C code with current execution line highlighted
- **右侧面板 / Right Panel**: 圆形可视化，显示节点状态和指针关系 / Circular visualization showing node states and pointer relationships
- **底部控制栏 / Bottom Control Bar**: 播放控制、进度显示、速度调节等 / Playback controls, progress display, speed adjustment
- **中心信息 / Center Information**: 显示当前执行阶段和回合数 / Shows current execution phase and round number

### 🛠️ 技术栈 / Tech Stack

- **前端框架 / Frontend Framework**: Vue 3 (Composition API)
- **构建工具 / Build Tool**: Vite
- **样式 / Styling**: SCSS + Gruvbox dark theme
- **语法高亮 / Syntax Highlighting**: Shiki
- **可视化 / Visualization**: SVG
- **部署 / Deployment**: GitHub Pages + GitHub Actions

### 📁 项目结构 / Project Structure

```
josephus-visualizer/
├── src/
│   ├── components/          # Vue components
│   │   ├── App.vue         # Main application component
│   │   ├── CodeDisplay.vue # Code display component
│   │   ├── CircleAnimation.vue # Animation component
│   │   ├── ControlPanel.vue    # Control panel component
│   │   ├── CircleNode.vue     # Node component
│   │   └── CircleLink.vue     # Link component
│   ├── utils/               # Utility functions
│   │   └── josephus-simulator.js # Algorithm simulator
│   └── styles/              # Style files
│       └── gruvbox-dark.scss    # Theme styles
├── public/
│   └── joseph-ring-algorithm.c # C algorithm source code
├── .github/workflows/       # GitHub Actions configuration
│   └── deploy.yml         # Auto-deployment configuration
└── README.md
```

### ⚙️ 配置 / Configuration

- **节点数量 / Node Count**: 固定 20 个节点 / Fixed at 20 nodes
- **计数模式 / Counting Pattern**: 重复模式 [3, 5, 7, 13] / Repeating pattern [3, 5, 7, 13]
- **动画速度 / Animation Speed**: 支持 1x、2x、4x 速度调节 / Supports 1x, 2x, 4x speed adjustment
- **主题配置 / Theme Configuration**: Gruvbox 暗色主题 / Gruvbox dark theme

### 📄 许可证 / License

本项目采用 [MIT 许可证](LICENSE)。

This project is licensed under the [MIT License](LICENSE).

### ❓ 常见问题 / FAQ

#### Q1: 动画卡住不动了怎么办？ / Animation stuck?
**A:** 刷新页面即可。如果问题持续，尝试降低播放速度（切换到 1x）。

**A:** Refresh the page. If the issue persists, try reducing the playback speed (switch to 1x).

#### Q2: 能不能修改人数或计数规则？ / Can I change the number or counting rules?
**A:** 当前版本固定为 20 个人，计数规则是 [3, 5, 7, 13] 循环。未来可能支持自定义配置。

**A:** Current version is fixed at 20 people with [3, 5, 7, 13] counting pattern. Custom configuration may be supported in the future.

#### Q3: 为什么有些代码行点击后没反应？ / Why don't some code lines respond to clicks?
**A:** 部分代码行（如注释行、函数声明）不对应实际执行步骤，只有实际执行的代码行才能跳转。

**A:** Some code lines (comments, function declarations) don't correspond to execution steps. Only actual execution lines are clickable.

#### Q4: 可以在手机上使用吗？ / Can I use it on mobile?
**A:** 可以，但推荐在电脑上使用以获得更好的体验。手机屏幕较小，左右分栏显示会比较拥挤。

**A:** Yes, but desktop is recommended for better experience. Mobile screens may feel cramped with the split-panel layout.

#### Q5: 想学习项目源码，从哪里开始？ / Where to start learning the source code?
**A:** 建议按以下顺序阅读 / Recommended reading order:
1. `src/utils/josephus-simulator.js` - 算法模拟器核心逻辑 / Algorithm simulator core logic
2. `src/App.vue` - 主应用组件，理解整体结构 / Main application component to understand overall structure
3. `src/components/CircleAnimation.vue` - 动画渲染逻辑 / Animation rendering logic
4. `src/components/CodeDisplay.vue` - 代码高亮显示 / Code highlighting display

### 🤝 贡献 / Contributing

欢迎提交 Issue 和 Pull Request 来改进项目！

Issues and Pull Requests are welcome to improve the project!

#### 开发指南 / Development Guidelines

- Git 提交信息遵循 gitmoji 约定 / Git commit messages follow gitmoji convention
- 代码风格遵循 Vue 3 官方推荐 / Code style follows Vue 3 official recommendations
- 提交前请确保代码通过所有检查 / Please ensure code passes all checks before submitting

#### 提交信息格式 / Commit Message Format

```
:gitmoji: [type](scope): message
```

**示例 / Examples:**

```
✨ feat(visualization): add new animation feature
🐛 fix(arrows): resolve arrow connection issues
📝 chore(docs): update README documentation
```

---

## <a id="english"></a>English

An interactive Josephus problem visualization tool built with Vue 3 + Vite, featuring line-by-line code debugging and animated demonstrations.

### 💡 Project Value

**Solving the pain point of beginners learning the Josephus problem: "understanding code but not logic"**

Many students can understand each line of code when learning the Josephus problem, but cannot visualize the actual execution in their minds. This project uses a **"left code + right debug-style animation"** approach to help you:

- 👀 **Watch Code**: Left side highlights the current execution line
- 🎬 **Visualize Process**: Right side synchronously demonstrates linked list node movement and deletion
- 🔗 **Make Connections**: Real-time connection between code and animation makes understanding abstract logic easy

No installation required - just open the web page and start using it!

### 📸 Demo Screenshots

**Live Demo:** [https://chhsiching.github.io/josephus-visualizer/](https://chhsiching.github.io/josephus-visualizer/)

This project is deployed on GitHub Pages. Click the link above to see it in action. The interface includes:

- **Left Code Panel**: Displays C code with current execution line highlighted
- **Right Animation Panel**: Shows Josephus ring animation with node movement and elimination
- **Bottom Control Panel**: Play, pause, step, and speed controls

### ✨ Features

- **🎯 Interactive Visualization**: SVG-based circular linked list visualization with bidirectional pointers
- **📝 Line-by-Line Debugging**: GDB-style C code execution with real-time highlighting
- **⏯️ Complete Playback Controls**: Play, pause, step execution, and speed adjustment
- **🔄 Real-time Animation**: Shows list construction, counting, and node elimination
- **🎨 Responsive Design**: Gruvbox dark theme with screen size support
- **📊 Detailed Status Display**: Shows current round, eliminated nodes, execution steps

### 🚀 Quick Start

#### Live Demo

The project is deployed on GitHub Pages and can be accessed directly:

[https://chhsiching.github.io/josephus-visualizer/](https://chhsiching.github.io/josephus-visualizer/)

#### Local Development

```bash
# Clone the project
git clone https://github.com/chhsiching/josephus-visualizer.git
cd josephus-visualizer

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 📖 Algorithm Description

#### The Josephus Problem

The Josephus problem describes: n people stand in a circle, starting from a specified person and counting clockwise. The person who counts to k is eliminated, and the next person restarts counting from 1. This process continues until all people are eliminated, determining the elimination order.

#### Implementation Details

This project implements the Josephus problem using a **doubly circular linked list**:

- **Node Structure**: Each person is represented as a node with `id`, `next`, and `pre` pointers
- **List Construction**: `RingConstruct` function creates a doubly circular linked list with N nodes
- **Counting Pattern**: Uses repeating pattern [3, 5, 7, 13] as elimination bounds for each round
- **Counting Function**: `count` function starts from a node and counts to find the node to be eliminated
- **Node Removal**: `removeNode` function removes the current node and reconnects the list

#### Visualization System

- **Dual-Ring Arrow System**: Outer ring shows next pointers (clockwise), inner ring shows prev pointers (counter-clockwise)
- **Animation Phases**: Initialization phase, counting phase, removal phase, completion phase
- **State Synchronization**: Precise synchronization between code line numbers and animation states

### 🎮 Usage Instructions

#### Basic Operations

1. **Play/Pause**: Click the play button to start automatic execution, click pause to stop
2. **Step Execution**: Use forward/backward buttons to view algorithm execution step by step
3. **Speed Control**: Supports 1x, 2x, 4x playback speeds
4. **Code Navigation**: Click line numbers in the left code panel to jump to corresponding steps
5. **Reset**: Click the reset button to restart the demonstration

#### Interface Description

- **Left Panel**: Displays C code with current execution line highlighted
- **Right Panel**: Circular visualization showing node states and pointer relationships
- **Bottom Control Bar**: Playback controls, progress display, speed adjustment, etc.
- **Center Information**: Shows current execution phase and round number

### 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: SCSS + Gruvbox dark theme
- **Syntax Highlighting**: Shiki
- **Visualization**: SVG
- **Deployment**: GitHub Pages + GitHub Actions

### 📁 Project Structure

```
josephus-visualizer/
├── src/
│   ├── components/          # Vue components
│   │   ├── App.vue         # Main application component
│   │   ├── CodeDisplay.vue # Code display component
│   │   ├── CircleAnimation.vue # Animation component
│   │   ├── ControlPanel.vue    # Control panel component
│   │   ├── CircleNode.vue     # Node component
│   │   └── CircleLink.vue     # Link component
│   ├── utils/               # Utility functions
│   │   └── josephus-simulator.js # Algorithm simulator
│   └── styles/              # Style files
│       └── gruvbox-dark.scss    # Theme styles
├── public/
│   └── joseph-ring-algorithm.c # C algorithm source code
├── .github/workflows/       # GitHub Actions configuration
│   └── deploy.yml         # Auto-deployment configuration
└── README.md
```

### ⚙️ Configuration

- **Node Count**: Fixed at 20 nodes
- **Counting Pattern**: Repeating pattern [3, 5, 7, 13]
- **Animation Speed**: Supports 1x, 2x, 4x speed adjustment
- **Theme Configuration**: Gruvbox dark theme

### 📄 License

This project is licensed under the [MIT License](LICENSE).

### ❓ FAQ

#### Q1: Animation stuck?
**A:** Refresh the page. If the issue persists, try reducing the playback speed (switch to 1x).

#### Q2: Can I change the number or counting rules?
**A:** Current version is fixed at 20 people with [3, 5, 7, 13] counting pattern. Custom configuration may be supported in the future.

#### Q3: Why don't some code lines respond to clicks?
**A:** Some code lines (comments, function declarations) don't correspond to actual execution steps. Only actual execution lines are clickable.

#### Q4: Can I use it on mobile?
**A:** Yes, but desktop is recommended for better experience. Mobile screens may feel cramped with the split-panel layout.

#### Q5: Where to start learning the source code?
**A:** Recommended reading order:
1. `src/utils/josephus-simulator.js` - Algorithm simulator core logic
2. `src/App.vue` - Main application component to understand overall structure
3. `src/components/CircleAnimation.vue` - Animation rendering logic
4. `src/components/CodeDisplay.vue` - Code highlighting display

### 🤝 Contributing

Issues and Pull Requests are welcome to improve the project!

#### Development Guidelines

- Git commit messages follow gitmoji convention
- Code style follows Vue 3 official recommendations
- Please ensure code passes all checks before submitting

#### Commit Message Format

```
:gitmoji: [type](scope): message
```

**Examples:**

```
✨ feat(visualization): add new animation feature
🐛 fix(arrows): resolve arrow connection issues
📝 chore(docs): update README documentation
```