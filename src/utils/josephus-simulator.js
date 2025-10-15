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
   * Generate all animation steps for the complete demo with fine-grained function-level details
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

    // ===== 初始化阶段：RingConstruct函数细化 =====

    // Step 1: malloc创建第一个节点
    steps.push({
      type: 'initialization',
      message: 'Creating first node with malloc()',
      line: 13,  // head = (pNode)malloc(sizeof(Node));
      nodes: animationNodes.map(n => ({...n, exists: n.id === 1})),
      activeNode: animationNodes[0],
      nodesToRemove: []
    });

    // Step 2: 设置第一个节点ID
    steps.push({
      type: 'initialization',
      message: 'Setting first node ID to 1',
      line: 14,  // head->id = 1;
      nodes: animationNodes.map(n => ({...n, exists: n.id === 1})),
      activeNode: animationNodes[0],
      nodesToRemove: []
    });

    // Step 3-22: for循环创建剩余节点 (i = 2 到 20)
    for (let i = 2; i <= 20; i++) {
      // malloc新节点
      steps.push({
        type: 'initialization',
        message: `Creating node ${i} with malloc()`,
        line: 17,  // q = (pNode)malloc(sizeof(Node));
        nodes: animationNodes.map(n => ({...n, exists: n.id <= i})),
        activeNode: animationNodes[i - 1],
        nodesToRemove: []
      });

      // 设置节点ID
      steps.push({
        type: 'initialization',
        message: `Setting node ${i} ID`,
        line: 18,  // q->id = i;
        nodes: animationNodes.map(n => ({...n, exists: n.id <= i})),
        activeNode: animationNodes[i - 1],
        nodesToRemove: []
      });

      // 建立next指针
      steps.push({
        type: 'initialization',
        message: `Linking node ${i-1} to node ${i} via next pointer`,
        line: 19,  // p->next = q;
        nodes: animationNodes.map(n => ({...n, exists: n.id <= i})),
        activeNode: animationNodes[i - 1],
        nodesToRemove: []
      });

      // 建立prev指针
      steps.push({
        type: 'initialization',
        message: `Linking node ${i} to node ${i-1} via prev pointer`,
        line: 20,  // q->pre = p;
        nodes: animationNodes.map(n => ({...n, exists: n.id <= i})),
        activeNode: animationNodes[i - 1],
        nodesToRemove: []
      });

      // 移动p指针
      steps.push({
        type: 'initialization',
        message: `Moving p pointer to node ${i}`,
        line: 21,  // p = p->next;
        nodes: animationNodes.map(n => ({...n, exists: n.id <= i})),
        activeNode: animationNodes[i - 1],
        nodesToRemove: []
      });
    }

    // Step 23: 构建环形 - 最后一个节点指向头节点
    steps.push({
      type: 'initialization',
      message: 'Creating circular link: node 20 -> node 1',
      line: 23,  // p->next = head;
      nodes: animationNodes.map(n => ({...n, exists: true})),
      activeNode: animationNodes[19],
      nodesToRemove: []
    });

    // Step 24: 构建环形 - 头节点指向前一个节点
    steps.push({
      type: 'initialization',
      message: 'Creating circular link: node 1 -> node 20',
      line: 24,  // head->pre = p;
      nodes: animationNodes.map(n => ({...n, exists: true})),
      activeNode: animationNodes[0],
      nodesToRemove: []
    });

    // ===== 主要算法循环：每轮8个详细步骤 =====

    for (let round = 1; round <= 20; round++) {
      const bound = bounds[(round - 1) % 4];
      const nodeIdToRemove = this.precomputedSequence[round - 1];

      // 确保所有存在的节点都有活跃的链接
      animationNodes.forEach(n => {
        if (n.exists) {
          n.linkState = { toNext: 'active', toPrev: 'active' };
        }
      });

      // Step 1: 调用boundMachine函数 - 数组访问
      steps.push({
        type: 'counting',
        message: `Round ${round}: Getting bound from boundMachine(${round})`,
        line: 30,  // return boundList[(order - 1) % 4];
        nodes: animationNodes.map(n => ({...n, linkState: { ...n.linkState }})),
        activeNode: current,
        nodesToRemove: []
      });

      // Step 2: count函数 - 初始化q指针
      steps.push({
        type: 'counting',
        message: `Counting: Initializing q pointer to current node ${current.id}`,
        line: 35,  // q = first;
        nodes: animationNodes.map(n => ({...n, linkState: { ...n.linkState }})),
        activeNode: current,
        nodesToRemove: []
      });

      // Step 3: count函数 - for循环计数开始
      steps.push({
        type: 'counting',
        message: `Counting: Starting loop to count ${bound} steps`,
        line: 36,  // for (int i = 2; i <= bound; i++)
        nodes: animationNodes.map(n => ({...n, linkState: { ...n.linkState }})),
        activeNode: current,
        nodesToRemove: []
      });

      // Step 4: count函数 - 逐步移动q指针 (bound-1步)
      let tempNode = current;
      for (let step = 2; step <= bound; step++) {
        tempNode = tempNode.next;
        while (!tempNode.exists) {
          tempNode = tempNode.next;
        }

        steps.push({
          type: 'counting',
          message: `Counting: Step ${step-1} to node ${tempNode.id}`,
          line: 37,  // q = q->next;
          nodes: animationNodes.map(n => ({...n, linkState: { ...n.linkState }})),
          activeNode: tempNode,
          nodesToRemove: []
        });
      }

      // Step 5: removeNode函数 - 保存next指针
      const targetNode = tempNode;
      const nextNode = targetNode.next;
      while (!nextNode.exists) {
        nextNode.next;
      }

      steps.push({
        type: 'counting',
        message: `Found target node ${targetNode.id}, preparing to remove`,
        line: 43,  // pNode first = currentNode->next;
        nodes: animationNodes.map(n => ({...n, linkState: { ...n.linkState }})),
        activeNode: targetNode,
        nodesToRemove: []
      });

      // Step 6: removeNode函数 - 更新前驱节点的next指针
      steps.push({
        type: 'removing',
        message: `Removing node ${targetNode.id}: Updating prev node's next pointer`,
        line: 44,  // currentNode->pre->next = currentNode->next;
        nodes: animationNodes.map(n => ({...n, linkState: { ...n.linkState }})),
        activeNode: targetNode,
        nodesToRemove: []
      });

      // Step 7: removeNode函数 - 更新后继节点的prev指针
      steps.push({
        type: 'removing',
        message: `Removing node ${targetNode.id}: Updating next node's prev pointer`,
        line: 45,  // first->pre = currentNode->pre;
        nodes: animationNodes.map(n => ({...n, linkState: { ...n.linkState }})),
        activeNode: targetNode,
        nodesToRemove: []
      });

      // Step 8: 实际删除节点并更新指针
      const removedNode = animationNodes[targetNode.id - 1];
      removedNode.exists = false;
      removedNode.linkState = { toNext: 'removed', toPrev: 'removed' };

      // 获取前驱和后继节点
      const prevNode = removedNode.prev;
      const nextActualNode = removedNode.next;

      // 更新双向指针
      if (prevNode && nextActualNode && prevNode.exists && nextActualNode.exists) {
        prevNode.nextId = nextActualNode.id;
        prevNode.linkState.toNext = 'active';
        nextActualNode.prevId = prevNode.id;
        nextActualNode.linkState.toPrev = 'active';
        prevNode.next = nextActualNode;
        nextActualNode.prev = prevNode;
      }

      steps.push({
        type: 'removing',
        message: `Node ${targetNode.id} removed, updating circular links`,
        line: 46,  // printf("%d ", currentNode->id);
        nodes: animationNodes.map(n => ({...n, linkState: { ...n.linkState }})),
        activeNode: removedNode,
        nodesToRemove: [removedNode]
      });

      // 更新current到下一个存在的节点
      do {
        current = current.next;
      } while (!animationNodes[current.id - 1].exists);
    }

    // Complete state
    steps.push({
      type: 'complete',
      message: 'Algorithm complete! All nodes eliminated.',
      line: 60,  // return 0;
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