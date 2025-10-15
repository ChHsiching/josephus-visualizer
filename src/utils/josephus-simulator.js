/**
 * Simple Josephus Ring Demo Simulator
 * Pre-computed animation steps for visualization demo
 */
export class JosephusSimulator {
  constructor() {
    this.currentStep = 0;
    this.eliminationOrder = [];

    // Initialize nodes first - this is critical!
    this.initializeNodes();

    // Pre-computed elimination sequence for N=20 with bounds [3,5,7,13]
    this.precomputedSequence = this.computeEliminationSequence();

    // Generate all animation steps (now nodes are initialized)
    this.animationSteps = this.generateAnimationSteps();
  }

  /**
   * Pre-compute the complete elimination sequence
   */
  computeEliminationSequence() {
    const bounds = [3, 5, 7, 13];
    const nodes = Array.from({length: 20}, (_, i) => ({ id: i + 1, exists: true }));
    const eliminationOrder = [];

    // Set up circular links
    for (let i = 0; i < 20; i++) {
      nodes[i].next = nodes[(i + 1) % 20];
      nodes[i].prev = nodes[(i - 1 + 20) % 20];
    }

    let current = nodes[0];

    // Simulate the complete algorithm
    for (let round = 1; round <= 20; round++) {
      const bound = bounds[(round - 1) % 4];

      // Count bound steps
      let target = current;
      for (let i = 1; i < bound; i++) {
        target = target.next;
        if (!target.exists) {
          // Skip removed nodes
          do {
            target = target.next;
          } while (!target.exists && target !== current);
        }
      }

      // Remove target node
      target.exists = false;
      eliminationOrder.push(target.id);
      current = target.next;

      // Skip removed nodes
      while (!current.exists && eliminationOrder.length < 20) {
        current = current.next;
      }
    }

    return eliminationOrder;
  }

  /**
   * Initialize nodes for display
   */
  initializeNodes() {
    this.nodes = Array.from({length: 20}, (_, i) => ({
      id: i + 1,
      exists: true,
      x: 0,
      y: 0,
      // 添加链接状态跟踪
      linkState: {
        toNext: 'active',    // 指向下一个节点的链接状态: 'active' | 'fading' | 'removed'
        toPrev: 'active'     // 指向上一个节点的链接状态: 'active' | 'fading' | 'removed'
      }
    }));

    // Set up circular links
    for (let i = 0; i < 20; i++) {
      this.nodes[i].next = this.nodes[(i + 1) % 20];
      this.nodes[i].prev = this.nodes[(i - 1 + 20) % 20];
    }
  }

  /**
   * Generate all animation steps for the complete demo
   */
  generateAnimationSteps() {
    const steps = [];
    const bounds = [3, 5, 7, 13];
    let current = this.nodes[0];

    // Create a working copy of nodes for animation
    let animationNodes = this.nodes.map((n, index) => ({
      ...n,
      linkState: { ...n.linkState },
      // 使用简单的ID计算：环状结构
      nextId: (index + 1) % 20 + 1, // 1->2, 2->3, ..., 19->20, 20->1
      prevId: (index - 1 + 20) % 20 + 1 // 1->20, 2->1, ..., 20->19
    }));

    // Initial state
    steps.push({
      type: 'initialization',
      message: 'Creating circular ring with 20 nodes',
      line: 55,  // Corresponds to "first = RingConstruct(N);"
      nodes: animationNodes.map(n => ({...n})),
      activeNode: null,
      nodesToRemove: []
    });

    // Process each elimination round
    for (let round = 1; round <= 20; round++) {
      const bound = bounds[(round - 1) % 4];
      const nodeIdToRemove = this.precomputedSequence[round - 1];

      // Counting phase - ensure all existing nodes have active links
      animationNodes.forEach(n => {
        if (n.exists) {
          n.linkState = {
            toNext: 'active',
            toPrev: 'active'
          };
        } else {
          // Ensure removed nodes maintain their removed state
          n.linkState = {
            toNext: 'removed',
            toPrev: 'removed'
          };
        }
      });

      steps.push({
        type: 'counting',
        message: `Round ${round}: Counting ${bound} steps from node ${current.id}`,
        line: 57,  // Corresponds to "toRemove = count(first, boundMachine(i));"
        nodes: animationNodes.map(n => ({
          ...n,
          linkState: { ...n.linkState },
          // 保持引用关系
          next: n.next,
          prev: n.prev,
          // 包含ID信息
          nextId: n.nextId,
          prevId: n.prevId
        })),
        activeNode: animationNodes[nodeIdToRemove - 1],
        nodesToRemove: []
      });

      // Removal phase - mark node as removed and update bidirectional pointers
      const removedNode = animationNodes[nodeIdToRemove - 1];
      removedNode.exists = false;
      removedNode.linkState = {
        toNext: 'removed',
        toPrev: 'removed'
      };

      // 获取被删除节点的前驱和后继
      const prevNode = removedNode.prev;
      const nextNode = removedNode.next;

      // 正确的双向指针更新逻辑 - 使用ID更新
      if (prevNode && nextNode && prevNode.exists && nextNode.exists) {
        // 模拟C代码中的removeNode逻辑：更新双向指针ID
        // 1. prevNode.nextId = nextNode.id (前驱节点的next指向后继节点)
        prevNode.nextId = nextNode.id;
        prevNode.linkState.toNext = 'active'; // 确保next箭头保持活跃

        // 2. nextNode.prevId = prevNode.id (后继节点的prev指向前驱节点)
        nextNode.prevId = prevNode.id;
        nextNode.linkState.toPrev = 'active'; // 确保prev箭头保持活跃

        // 也更新引用关系以保持兼容性
        prevNode.next = nextNode;
        nextNode.prev = prevNode;

        // Successful bidirectional reconnection between existing nodes
      }

      // 创建步骤快照，保留指针更新后的状态
      // 使用深拷贝确保每个步骤独立
      const stepSnapshot = animationNodes.map(n => ({
        ...n,
        linkState: { ...n.linkState },
        // 保留更新后的引用关系
        next: n.next,
        prev: n.prev,
        // 包含更新后的ID信息
        nextId: n.nextId,
        prevId: n.prevId
      }));

      steps.push({
        type: 'removing',
        message: `Removing node ${nodeIdToRemove} and updating bidirectional pointers`,
        line: 58,  // Corresponds to "first = removeNode(toRemove);"
        nodes: stepSnapshot,
        activeNode: removedNode,
        nodesToRemove: [removedNode]
      });

      // Update current to next existing node
      do {
        current = current.next;
      } while (!animationNodes[current.id - 1].exists && current !== this.nodes[0]);
    }

    // Complete state
    steps.push({
      type: 'complete',
      message: 'Algorithm complete! All nodes eliminated.',
      line: 60,  // Corresponds to "return 0;"
      nodes: animationNodes.map(n => ({...n, exists: false})),
      activeNode: null,
      nodesToRemove: []
    });

    return steps;
  }

  /**
   * Get current animation state
   */
  getAnimationState() {
    if (this.currentStep >= this.animationSteps.length) {
      return this.animationSteps[this.animationSteps.length - 1];
    }

    return this.animationSteps[this.currentStep];
  }

  /**
   * Get total number of steps
   */
  getTotalSteps() {
    return this.animationSteps.length;
  }

  /**
   * Execute to specific step
   */
  executeToStep(step) {
    this.currentStep = Math.max(0, Math.min(step, this.animationSteps.length - 1));
    return this.getAnimationState();
  }

  /**
   * Move to next step
   */
  nextStep() {
    if (this.currentStep < this.animationSteps.length - 1) {
      this.currentStep++;
      return true;
    }
    return false;
  }

  /**
   * Move to previous step
   */
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      return true;
    }
    return false;
  }

  /**
   * Reset to beginning
   */
  reset() {
    this.currentStep = 0;
    this.initializeNodes();
  }
}