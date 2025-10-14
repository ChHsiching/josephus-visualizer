/**
 * Node structure for circular doubly-linked list
 */
class Node {
  constructor(id) {
    this.id = id;
    this.next = null;
    this.prev = null;
    this.exists = true; // For animation purposes
  }
}

/**
 * Josephus Ring Simulator
 * Implements the Josephus problem algorithm with step-by-step execution
 */
export class JosephusSimulator {
  constructor(n = 20) {
    this.n = n;
    this.head = null;
    this.current = null;
    this.stepHistory = [];
    this.currentStep = 0;
    this.eliminationOrder = [];

    // Animation state
    this.animationState = {
      phase: 'initialization', // initialization, counting, removing, complete
      currentLine: 1,
      activeNode: null,
      nodesToRemove: [],
      message: ''
    };

    this.initializeRing();
  }

  /**
   * Create circular doubly-linked list with n nodes
   */
  initializeRing() {
    // Line 10-26 in original C code: RingConstruct function
    this.head = new Node(1);
    let p = this.head;

    for (let i = 2; i <= this.n; i++) {
      const q = new Node(i);
      p.next = q;
      q.prev = p;
      p = p.next;
    }

    // Create circular structure
    p.next = this.head;
    this.head.prev = p;
    this.current = this.head;

    this.recordStep('RingConstruct', 10, 'Ring construction completed');
  }

  /**
   * Get counting bound for each round (line 28-32)
   */
  boundMachine(order) {
    const boundList = [3, 5, 7, 13];
    return boundList[(order - 1) % 4];
  }

  /**
   * Count from starting node by bound steps (line 34-41)
   */
  count(startNode, bound) {
    let q = startNode;
    for (let i = 2; i <= bound; i++) {
      q = q.next;
    }
    return q;
  }

  /**
   * Remove node from circle and return next starting node (line 44-51)
   */
  removeNode(nodeToRemove) {
    if (!nodeToRemove || !nodeToRemove.exists) return null;

    const nextStart = nodeToRemove.next;

    // Update links
    nodeToRemove.prev.next = nodeToRemove.next;
    nextStart.prev = nodeToRemove.prev;

    // Mark as removed for animation
    nodeToRemove.exists = false;
    this.eliminationOrder.push(nodeToRemove.id);

    return nextStart;
  }

  /**
   * Execute one complete round of elimination
   */
  executeRound(roundNumber) {
    if (this.eliminationOrder.length >= this.n) {
      return false; // All nodes eliminated
    }

    // Line 58-60 in original C code: main loop
    const bound = this.boundMachine(roundNumber);
    this.recordStep('boundMachine', 28, `Round ${roundNumber}: Counting bound is ${bound}`);

    // Line 59: Count to find node to remove
    const nodeToRemove = this.count(this.current, bound);
    this.recordStep('count', 34, `Counting ${bound} steps from node ${this.current.id}`);

    // Line 60: Remove the node
    this.current = this.removeNode(nodeToRemove);
    this.recordStep('removeNode', 44, `Removing node ${nodeToRemove.id}`);

    return true;
  }

  /**
   * Record a step for animation and debugging
   */
  recordStep(functionName, lineNumber, message) {
    this.stepHistory.push({
      step: this.stepHistory.length + 1,
      function: functionName,
      line: lineNumber,
      message: message,
      currentNodes: this.getCurrentNodes(),
      eliminatedNodes: [...this.eliminationOrder],
      currentStart: this.current ? this.current.id : null
    });
  }

  /**
   * Get current state of all nodes
   */
  getCurrentNodes() {
    const nodes = [];
    let current = this.head;

    do {
      nodes.push({
        id: current.id,
        exists: current.exists,
        isCurrent: current === this.current
      });
      current = current.next;
    } while (current !== this.head);

    return nodes;
  }

  /**
   * Get step information for specific line
   */
  getStepForLine(lineNumber) {
    return this.stepHistory.find(step => step.line === lineNumber);
  }

  /**
   * Execute algorithm up to specific line
   */
  executeToLine(targetLine) {
    this.reset();

    if (targetLine <= 26) {
      // Still in RingConstruct function
      this.animationState.phase = 'initialization';
      this.animationState.currentLine = targetLine;
      return this.getAnimationState();
    }

    // Execute initialization
    this.animationState.phase = 'initialization';
    this.animationState.currentLine = 26;
    this.animationState.message = 'Ring construction completed';

    // Main execution
    if (targetLine >= 53) { // main function
      let round = 1;

      while (this.eliminationOrder.length < this.n && round <= this.n) {
        if (targetLine >= 58) { // for loop line
          const bound = this.boundMachine(round);
          this.animationState.message = `Round ${round}: Counting ${bound} steps`;
          this.animationState.currentLine = 58;

          if (targetLine >= 59) { // count function
            const nodeToRemove = this.count(this.current, bound);
            this.animationState.activeNode = nodeToRemove;
            this.animationState.phase = 'counting';
            this.animationState.currentLine = 59;
            this.animationState.message = `Counting to node ${nodeToRemove.id}`;

            if (targetLine >= 60) { // removeNode function
              this.animationState.nodesToRemove = [nodeToRemove];
              this.animationState.phase = 'removing';
              this.animationState.currentLine = 60;
              this.animationState.message = `Removing node ${nodeToRemove.id}`;

              // Actually perform the removal
              this.current = this.removeNode(nodeToRemove);
              this.animationState.activeNode = this.current;
              round++;
            }
          }

          if (this.animationState.currentLine < targetLine) {
            continue; // Continue to next round
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }

    return this.getAnimationState();
  }

  /**
   * Get current animation state
   */
  getAnimationState() {
    return {
      ...this.animationState,
      nodes: this.getCurrentNodes(),
      eliminatedNodes: [...this.eliminationOrder],
      totalSteps: this.stepHistory.length
    };
  }

  /**
   * Reset simulator to initial state
   */
  reset() {
    this.current = this.head;
    this.stepHistory = [];
    this.currentStep = 0;
    this.eliminationOrder = [];

    // Reset all nodes to exist
    let current = this.head;
    do {
      current.exists = true;
      current = current.next;
    } while (current !== this.head);

    this.animationState = {
      phase: 'initialization',
      currentLine: 1,
      activeNode: null,
      nodesToRemove: [],
      message: 'Starting algorithm...'
    };
  }

  /**
   * Execute complete algorithm
   */
  executeComplete() {
    this.reset();

    for (let i = 1; i <= this.n; i++) {
      this.executeRound(i);
    }

    this.animationState.phase = 'complete';
    this.animationState.message = 'Algorithm complete!';

    return this.getAnimationState();
  }

  /**
   * Get step-by-step execution data
   */
  getStepExecutionData() {
    const steps = [];

    // Initial state
    steps.push({
      line: 10,
      phase: 'initialization',
      message: 'Creating first node with id = 1',
      nodes: this.getCurrentNodes()
    });

    // Ring construction steps
    for (let i = 2; i <= this.n; i++) {
      steps.push({
        line: 17,
        phase: 'initialization',
        message: `Creating node with id = ${i}`,
        nodes: this.getCurrentNodes()
      });
    }

    // Making it circular
    steps.push({
      line: 23,
      phase: 'initialization',
      message: 'Connecting last node to first node (creating circle)',
      nodes: this.getCurrentNodes()
    });

    // Main execution steps
    for (let round = 1; round <= this.n; round++) {
      const bound = this.boundMachine(round);

      steps.push({
        line: 58,
        phase: 'counting',
        message: `Round ${round}: Counting bound is ${bound}`,
        nodes: this.getCurrentNodes()
      });

      const nodeToRemove = this.count(this.current, bound);

      steps.push({
        line: 59,
        phase: 'counting',
        message: `Counting ${bound} steps from node ${this.current.id} to node ${nodeToRemove.id}`,
        nodes: this.getCurrentNodes(),
        activeNode: nodeToRemove.id
      });

      steps.push({
        line: 60,
        phase: 'removing',
        message: `Removing node ${nodeToRemove.id}`,
        nodes: this.getCurrentNodes(),
        removedNode: nodeToRemove.id
      });

      this.current = this.removeNode(nodeToRemove);
    }

    return steps;
  }
}