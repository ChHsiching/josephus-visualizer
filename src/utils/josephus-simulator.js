/**
 * Simple Josephus Ring Demo Simulator
 * Pre-computed animation steps for visualization demo
 */
export class JosephusSimulator {
  constructor() {
    this.nodes = [];
    this.currentStep = 0;
    this.eliminationOrder = [];

    // Pre-computed elimination sequence for N=20 with bounds [3,5,7,13]
    this.precomputedSequence = this.computeEliminationSequence();

    // Generate all animation steps
    this.animationSteps = this.generateAnimationSteps();

    // Initialize nodes
    this.initializeNodes();
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
      y: 0
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

    // Initial state
    steps.push({
      type: 'initialization',
      message: 'Creating circular ring with 20 nodes',
      line: 26,
      nodes: this.nodes.map(n => ({...n})),
      activeNode: null,
      nodesToRemove: []
    });

    // Process each elimination round
    for (let round = 1; round <= 20; round++) {
      const bound = bounds[(round - 1) % 4];
      const nodeIdToRemove = this.precomputedSequence[round - 1];

      // Counting phase
      steps.push({
        type: 'counting',
        message: `Round ${round}: Counting ${bound} steps from node ${current.id}`,
        line: 59,
        nodes: this.nodes.map(n => ({...n})),
        activeNode: this.nodes[nodeIdToRemove - 1],
        nodesToRemove: []
      });

      // Removal phase
      steps.push({
        type: 'removing',
        message: `Removing node ${nodeIdToRemove}`,
        line: 60,
        nodes: this.nodes.map(n => ({...n, exists: n.id !== nodeIdToRemove})),
        activeNode: this.nodes[nodeIdToRemove - 1],
        nodesToRemove: [this.nodes[nodeIdToRemove - 1]]
      });

      // Update current to next existing node
      do {
        current = current.next;
      } while (!current.exists && current !== this.nodes[0]);
    }

    // Complete state
    steps.push({
      type: 'complete',
      message: 'Algorithm complete! All nodes eliminated.',
      line: 62,
      nodes: this.nodes.map(n => ({...n, exists: false})),
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