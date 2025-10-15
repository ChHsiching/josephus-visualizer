# Josephus Problem Visualizer

An interactive Josephus problem visualization tool built with Vue 3 + Vite, featuring line-by-line code debugging and animated demonstrations.

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

