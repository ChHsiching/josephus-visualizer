# Josephus Problem Visualizer

An interactive Josephus problem visualization tool built with Vue 3 + Vite, featuring line-by-line code debugging and animated demonstrations.

## 💡 项目价值

**解决新手学习约瑟夫问题时 "只懂代码不懂逻辑" 的痛点**

很多同学在学习约瑟夫问题时，能看懂代码的每一行，但脑海里想不出实际运行的画面。这个项目通过 **"左侧代码 + 右侧 debug 式动画"** 的方式，让你：
- 👀 **眼看代码**：左边高亮显示当前执行到哪一行
- 🎬 **脑补画面**：右边同步演示链表节点的移动和删除
- 🔗 **建立联系**：代码和动画实时关联，理解抽象逻辑变得轻松

不需要安装任何软件，打开网页就能用！

## 📸 演示截图

### 图 1：页面整体效果
![页面整体效果](https://via.placeholder.com/800x450.png?text=Screenshot+1:+Code+Editor+%2B+Animation+%2B+Control+Panel)
*左侧显示 C 语言代码，右侧展示约瑟夫环动画，底部是播放控制面板*

### 图 2：动画执行中
![动画执行中](https://via.placeholder.com/800x450.png?text=Screenshot+2:+Highlighted+Code+Line+%2B+Node+Elimination)
*代码行高亮指示当前执行位置，右侧圆环显示节点被删除的动态过程*

> **提示**：将来可替换为真实截图，展示项目的实际运行效果

## ✨ Features

- **🎯 Interactive Visualization**: SVG-based circular linked list visualization with bidirectional pointer display
- **📝 Line-by-Line Debugging**: GDB-style C code execution demonstration with real-time line highlighting
- **⏯️ Complete Playback Controls**: Support for play, pause, step execution, and speed adjustment
- **🔄 Real-time Animation**: Shows the complete process of list construction, counting, and node elimination
- **🎨 Responsive Design**: Gruvbox dark theme with support for different screen sizes
- **📊 Detailed Status Display**: Shows current round, eliminated nodes, execution steps, and more

## 🚀 Quick Start

### Live Demo

The project is deployed on GitHub Pages and can be accessed directly:
[https://chhsiching.github.io/josephus-visualizer/](https://chhsiching.github.io/josephus-visualizer/)

### Local Development

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

## 📖 Algorithm Description

### The Josephus Problem

The Josephus problem describes: n people stand in a circle, starting from a specified person and counting clockwise. The person who counts to k is eliminated, and the next person restarts counting from 1. This process continues until all people are eliminated, determining the elimination order.

### Implementation Details

This project implements the Josephus problem using a **doubly circular linked list**:

- **Node Structure**: Each person is represented as a node with `id`, `next`, and `pre` pointers
- **List Construction**: `RingConstruct` function creates a doubly circular linked list with N nodes
- **Counting Pattern**: Uses repeating pattern [3, 5, 7, 13] as elimination bounds for each round
- **Counting Function**: `count` function starts from a node and counts to find the node to be eliminated
- **Node Removal**: `removeNode` function removes the current node and reconnects the list

### Visualization System

- **Dual-Ring Arrow System**: Outer ring shows next pointers (clockwise), inner ring shows prev pointers (counter-clockwise)
- **Animation Phases**: Initialization phase, counting phase, removal phase, completion phase
- **State Synchronization**: Precise synchronization between code line numbers and animation states

## 🎮 Usage Instructions

### Basic Operations

1. **Play/Pause**: Click the play button to start automatic execution, click pause to stop
2. **Step Execution**: Use forward/backward buttons to view algorithm execution step by step
3. **Speed Control**: Supports 1x, 2x, 4x playback speeds
4. **Code Navigation**: Click line numbers in the left code panel to jump to corresponding steps
5. **Reset**: Click the reset button to restart the demonstration

### Interface Description

- **Left Panel**: Displays C code with current execution line highlighted
- **Right Panel**: Circular visualization showing node states and pointer relationships
- **Bottom Control Bar**: Playback controls, progress display, speed adjustment, etc.
- **Center Information**: Shows current execution phase and round number

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: SCSS + Gruvbox dark theme
- **Syntax Highlighting**: Shiki
- **Visualization**: SVG
- **Deployment**: GitHub Pages + GitHub Actions

## 📁 Project Structure

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

## ⚙️ Configuration

- **Node Count**: Fixed at 20 nodes
- **Counting Pattern**: Repeating pattern [3, 5, 7, 13]
- **Animation Speed**: Supports 1x, 2x, 4x speed adjustment
- **Theme Configuration**: Gruvbox dark theme

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## ❓ 常见问题（FAQ）

### Q1: 动画卡住不动了怎么办？
**A:** 刷新页面即可。如果问题持续出现，可能是代码步骤太快，尝试降低播放速度（点击速度按钮切换到 1x）。

### Q2: 能不能修改人数或计数规则？
**A:** 当前版本固定为 20 个人，计数规则是 [3, 5, 7, 13] 循环。未来可能会支持自定义配置。

### Q3: 为什么有些代码行点击后没反应？
**A:** 部分代码行（如注释行、函数声明）不对应实际执行步骤，所以点击后不会跳转。只有实际执行的代码行才能跳转。

### Q4: 可以在手机上使用吗？
**A:** 可以，但推荐在电脑上使用以获得更好的体验。手机屏幕较小，左右分栏显示会比较拥挤。

### Q5: 想学习项目源码，从哪里开始？
**A:** 建议按以下顺序阅读：
1. `src/utils/josephus-simulator.js` - 算法模拟器核心逻辑
2. `src/App.vue` - 主应用组件，理解整体结构
3. `src/components/CircleAnimation.vue` - 动画渲染逻辑
4. `src/components/CodeDisplay.vue` - 代码高亮显示

## 🤝 Contributing

Issues and Pull Requests are welcome to improve the project!

### Development Guidelines

- Git commit messages follow gitmoji convention
- Code style follows Vue 3 official recommendations
- Please ensure code passes all checks before submitting

### Commit Message Format

```
:gitmoji: [type](scope): message
```

Examples:
```
✨ feat(visualization): add new animation feature
🐛 fix(arrows): resolve arrow connection issues
📝 chore(docs): update README documentation
```

