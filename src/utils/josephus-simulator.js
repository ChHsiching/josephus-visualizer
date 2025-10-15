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
   * Generate all animation steps for the complete demo with fine-grained line-by-line execution
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
      prevId: (index - 1 + 20) % 20 + 1, // 1->20, 2->1, ..., 20->19
      // 添加完整的箭头状态字段，确保CircleAnimation.vue能正确访问
      nextLink: false,
      prevLink: false,
      hasId: false
    }));

    // ===== main函数开始执行 =====

    // Step 1: main函数开始 - 第52行声明变量
    steps.push({
      type: 'initialization',
      message: 'main() 函数：声明 pNode first 变量',
      line: 52,  // pNode first;
      nodes: animationNodes.map(n => ({...n, exists: false})),
      activeNode: null,
      nodesToRemove: []
    });

    // Step 2: 第53行声明变量
    steps.push({
      type: 'initialization',
      message: 'main() 函数：声明 pNode toRemove 变量',
      line: 53,  // pNode toRemove;
      nodes: animationNodes.map(n => ({...n, exists: false})),
      activeNode: null,
      nodesToRemove: []
    });

    // Step 3: 第54行声明变量
    steps.push({
      type: 'initialization',
      message: 'main() 函数：声明 int i 变量',
      line: 54,  // int i;
      nodes: animationNodes.map(n => ({...n, exists: false})),
      activeNode: null,
      nodesToRemove: []
    });

    // Step 4: 第55行准备调用RingConstruct
    steps.push({
      type: 'initialization',
      message: 'main() 函数：准备调用 RingConstruct(N)',
      line: 55,  // first = RingConstruct(N);
      nodes: animationNodes.map(n => ({...n, exists: false})),
      activeNode: null,
      nodesToRemove: []
    });

    // ===== RingConstruct函数执行 =====

    // Step 5: 进入RingConstruct - 第11行声明变量
    steps.push({
      type: 'initialization',
      message: 'RingConstruct() 函数：声明局部变量',
      line: 11,  // int i; pNode head, p, q;
      nodes: animationNodes.map(n => ({...n, exists: false})),
      activeNode: null,
      nodesToRemove: []
    });

    // Step 6: 第13行 malloc创建第一个节点
    steps.push({
      type: 'initialization',
      message: '使用 malloc() 创建第一个节点',
      line: 13,  // head = (pNode)malloc(sizeof(Node));
      nodes: animationNodes.map(n => ({...n, exists: n.id === 1, hasId: false})),
      activeNode: animationNodes[0],
      nodesToRemove: []
    });

    // Step 7: 第14行设置第一个节点ID
    steps.push({
      type: 'initialization',
      message: '设置第一个节点 ID 为 1',
      line: 14,  // head->id = 1;
      nodes: animationNodes.map(n => ({...n, exists: n.id === 1, hasId: n.id === 1})),
      activeNode: animationNodes[0],
      nodesToRemove: []
    });

    // Step 8: 第15行 p = head
    steps.push({
      type: 'initialization',
      message: '将 p 指针指向头节点',
      line: 15,  // p = head;
      nodes: animationNodes.map(n => ({...n, exists: n.id === 1, hasId: n.id === 1})),
      activeNode: animationNodes[0],
      nodesToRemove: []
    });

    // ===== RingConstruct函数的for循环 (lines 16-22) =====

    // Step 9: 第16行 for循环开始
    steps.push({
      type: 'initialization',
      message: 'RingConstruct() 函数：开始 for 循环 (i = 2; i <= n; i++)',
      line: 16,  // for (i = 2; i <= n; i++) {
      nodes: animationNodes.map(n => ({...n, exists: n.id === 1, hasId: n.id === 1})),
      activeNode: animationNodes[0],
      nodesToRemove: []
    });

    // Step 10-109: for循环体执行 (i = 2 到 20，每个节点5步)
    // 彻底重写状态管理逻辑：精确控制每个箭头的显示时机
    for (let i = 2; i <= 20; i++) {
      if (i === 2) {
        // 第一次循环（创建节点2）的特殊处理
        // Step 10: 第17行 malloc - 只创建节点2，节点1保持原状态（无箭头）
        steps.push({
          type: 'initialization',
          message: `使用 malloc() 创建节点 ${i}`,
          line: 17,  // q = (pNode)malloc(sizeof(Node));
          nodes: animationNodes.map(n => {
            if (n.id === 1) {
              return {...n, exists: true, hasId: true, nextLink: false, prevLink: false}
            } else if (n.id === 2) {
              return {...n, exists: true, hasId: false, nextLink: false, prevLink: false}
            } else {
              return {...n, exists: false, hasId: false, nextLink: false, prevLink: false}
            }
          }),
          activeNode: animationNodes[0],
          nodesToRemove: []
        });

        // Step 11: 第18行设置ID - 节点2有ID，仍无箭头
        steps.push({
          type: 'initialization',
          message: `设置节点 ${i} 的 ID 为 ${i}`,
          line: 18,  // q->id = i;
          nodes: animationNodes.map(n => {
            if (n.id === 1) {
              return {...n, exists: true, hasId: true, nextLink: false, prevLink: false}
            } else if (n.id === 2) {
              return {...n, exists: true, hasId: true, nextLink: false, prevLink: false}
            } else {
              return {...n, exists: false, hasId: false, nextLink: false, prevLink: false}
            }
          }),
          activeNode: animationNodes[0],
          nodesToRemove: []
        });

        // Step 12: 第19行 p->next = q - 显示节点1->节点2的next箭头
        steps.push({
          type: 'initialization',
          message: `将节点 ${i-1} 的 next 指针指向节点 ${i} (p->next = q)`,
          line: 19,  // p->next = q;
          nodes: animationNodes.map(n => {
            if (n.id === 1) {
              return {...n, exists: true, hasId: true, nextLink: true, prevLink: false}
            } else if (n.id === 2) {
              return {...n, exists: true, hasId: true, nextLink: false, prevLink: false}
            } else {
              return {...n, exists: false, hasId: false, nextLink: false, prevLink: false}
            }
          }),
          activeNode: animationNodes[0],
          nodesToRemove: []
        });

        // Step 13: 第20行 q->pre = p - 显示节点2->节点1的prev箭头
        steps.push({
          type: 'initialization',
          message: `将节点 ${i} 的 prev 指针指向节点 ${i-1} (q->pre = p)`,
          line: 20,  // q->pre = p;
          nodes: animationNodes.map(n => {
            if (n.id === 1) {
              return {...n, exists: true, hasId: true, nextLink: true, prevLink: false}
            } else if (n.id === 2) {
              return {...n, exists: true, hasId: true, nextLink: false, prevLink: true}
            } else {
              return {...n, exists: false, hasId: false, nextLink: false, prevLink: false}
            }
          }),
          activeNode: animationNodes[1],
          nodesToRemove: []
        });

        // Step 14: 第21行 p = q - 显示节点2的next箭头（完成双向链接）
        steps.push({
          type: 'initialization',
          message: `将 p 指针移动到节点 ${i} (p = p->next)`,
          line: 21,  // p = p->next;
          nodes: animationNodes.map(n => {
            if (n.id === 1) {
              return {...n, exists: true, hasId: true, nextLink: true, prevLink: false}
            } else if (n.id === 2) {
              return {...n, exists: true, hasId: true, nextLink: false, prevLink: true}
            } else {
              return {...n, exists: false, hasId: false, nextLink: false, prevLink: false}
            }
          }),
          activeNode: animationNodes[1],
          nodesToRemove: []
        });

      } else {
        // 第二次及以后循环（i≥3）的统一处理
        // 基于前一步结束时的状态来构建当前状态

        // 获取前一步结束时的节点状态
        const prevStepIndex = steps.length - 1;
        const prevNodeStates = steps[prevStepIndex].nodes;

    
        // 创建修正后的基础状态：重置前一个节点的next箭头
        const correctedNodeStates = prevNodeStates.map(n => {
          if (n.id === i-1) {
            // 前一个节点：重置next箭头，因为新节点刚创建还未建立连接
            return {
              ...n,
              exists: n.exists,
              hasId: n.hasId,
              nextLink: false,  // 重置next箭头，等待p->next = q步骤才激活
              prevLink: n.prevLink  // 保持prev箭头状态
            }
          } else {
            return {...n} // 其他节点状态不变
          }
        });

  
        // Step 10 + (i-2)*5: 第17行 malloc - 新节点存在，特殊处理节点3和5
        const mallocNodes = correctedNodeStates.map(n => {
          if (n.id === i) {
            // 新创建的节点：不显示任何箭头
            return {...n, exists: true, hasId: false, nextLink: false, prevLink: false}
          } else if (n.id === i-1) {
            // 前一个节点：确保不显示next箭头到刚创建的节点
            // 特殊处理i=3和i=5的情况，这是问题出现的循环
            return {...n, nextLink: false, prevLink: n.prevLink, nextId: undefined}
          } else {
            return {...n} // 使用修正后的状态
          }
        });

    
        steps.push({
          type: 'initialization',
          message: `使用 malloc() 创建节点 ${i}`,
          line: 17,  // q = (pNode)malloc(sizeof(Node));
          nodes: mallocNodes,
          activeNode: animationNodes[i - 2],
          nodesToRemove: []
        });

        // Step 11 + (i-2)*5: 第18行设置ID - 保持箭头状态不变
        const currentStepIndex = steps.length - 1;
        const currentNodeStates = steps[currentStepIndex].nodes;
        steps.push({
          type: 'initialization',
          message: `设置节点 ${i} 的 ID 为 ${i}`,
          line: 18,  // q->id = i;
          nodes: currentNodeStates.map(n => {
            if (n.id === i) {
              return {...n, hasId: true}
            } else {
              return {...n} // 继承修正后的状态
            }
          }),
          activeNode: animationNodes[i - 2],
          nodesToRemove: []
        });

        // Step 12 + (i-2)*5: 第19行 p->next = q - 激活节点(i-1)的next箭头
        const idStepIndex = steps.length - 1;
        const idNodeStates = steps[idStepIndex].nodes;
        steps.push({
          type: 'initialization',
          message: `将节点 ${i-1} 的 next 指针指向节点 ${i} (p->next = q)`,
          line: 19,  // p->next = q;
          nodes: idNodeStates.map(n => {
            if (n.id === i-1) {
              return {...n, nextLink: true} // 激活next箭头
            } else {
              return {...n} // 其他节点状态不变
            }
          }),
          activeNode: animationNodes[i - 2],
          nodesToRemove: []
        });

        // Step 13 + (i-2)*5: 第20行 q->pre = p - 激活新节点的prev箭头
        const nextStepIndex = steps.length - 1;
        const nextNodeStates = steps[nextStepIndex].nodes;
        steps.push({
          type: 'initialization',
          message: `将节点 ${i} 的 prev 指针指向节点 ${i-1} (q->pre = p)`,
          line: 20,  // q->pre = p;
          nodes: nextNodeStates.map(n => {
            if (n.id === i) {
              return {...n, prevLink: true} // 激活prev箭头
            } else {
              return {...n} // 其他节点状态不变
            }
          }),
          activeNode: animationNodes[i - 1],
          nodesToRemove: []
        });

        // Step 14 + (i-2)*5: 第21行 p = q - 激活新节点的next箭头
        const prevStepIndex2 = steps.length - 1;
        const prevNodeStates2 = steps[prevStepIndex2].nodes;
        steps.push({
          type: 'initialization',
          message: `将 p 指针移动到节点 ${i} (p = p->next)`,
          line: 21,  // p = p->next;
          nodes: prevNodeStates2.map(n => {
            if (n.id === i) {
              return {...n, nextLink: true} // 激活next箭头，完成双向链接
            } else {
              return {...n} // 其他节点状态不变
            }
          }),
          activeNode: animationNodes[i - 1],
          nodesToRemove: []
        });
      }
    }

    // Step 110: 第22行 for循环结束
    steps.push({
      type: 'initialization',
      message: 'RingConstruct() 函数：for 循环完成',
      line: 22,  // }
      nodes: animationNodes.map(n => ({
        ...n,
        exists: n.id <= 20,
        hasId: n.id <= 20,
        nextLink: n.id <= 20 && n.id < 20, // 暂时没有环形链接
        prevLink: n.id <= 20 && n.id > 1
      })),
      activeNode: animationNodes[19], // p指向最后一个节点
      nodesToRemove: []
    });

    // Step 111: 第23行 构建环形 - 最后一个节点指向头节点
    steps.push({
      type: 'initialization',
      message: '创建环形链接：节点 20 -> 节点 1 (p->next = head)',
      line: 23,  // p->next = head;
      nodes: animationNodes.map(n => ({
        ...n,
        exists: true,
        hasId: true,
        nextLink: true, // 所有节点都有next链接，包括环形
        prevLink: n.id > 1
      })),
      activeNode: animationNodes[19],
      nodesToRemove: []
    });

    // Step 112: 第24行 构建环形 - 头节点指向前一个节点
    steps.push({
      type: 'initialization',
      message: '创建环形链接：节点 1 -> 节点 20 (head->pre = p)',
      line: 24,  // head->pre = p;
      nodes: animationNodes.map(n => ({
        ...n,
        exists: true,
        hasId: true,
        nextLink: true,
        prevLink: true // 所有节点都有prev链接，包括环形
      })),
      activeNode: animationNodes[0],
      nodesToRemove: []
    });

    // Step 113: 第25行 return head - 同步状态到基础animationNodes
    const finalRingConstructNodes = animationNodes.map(n => ({
      ...n,
      exists: true,
      hasId: true,
      nextLink: true,
      prevLink: true
    }));

    // 同步最终状态到基础animationNodes对象
    finalRingConstructNodes.forEach((finalNode, index) => {
      animationNodes[index] = {...finalNode};
    });

    steps.push({
      type: 'initialization',
      message: 'RingConstruct() 函数：返回头节点指针',
      line: 25,  // return head;
      nodes: finalRingConstructNodes,
      activeNode: animationNodes[0],
      nodesToRemove: []
    });

    // ===== 回到main函数继续执行 =====

    // Step 114: 第55行完成RingConstruct调用
    steps.push({
      type: 'initialization',
      message: 'main() 函数：RingConstruct(N) 完成，first 指向头节点',
      line: 55,  // first = RingConstruct(N);
      nodes: animationNodes.map(n => ({
        ...n,
        exists: true,
        hasId: true,
        nextLink: true,
        prevLink: true
      })),
      activeNode: animationNodes[0],
      nodesToRemove: []
    });

    // Step 115: 第56行 for循环开始
    steps.push({
      type: 'counting',
      message: 'main() 函数：开始主循环 (for int i = 1; i <= N; i++)',
      line: 56,  // for (int i = 1; i <= N; i++) {
      nodes: animationNodes.map(n => ({
        ...n,
        exists: true,
        hasId: true,
        nextLink: true,
        prevLink: true
      })),
      activeNode: animationNodes[0],
      nodesToRemove: []
    });

    // ===== 主要算法循环：逐轮详细执行 =====

    for (let round = 1; round <= 20; round++) {
      const bound = bounds[(round - 1) % 4];
      const nodeIdToRemove = this.precomputedSequence[round - 1];

      // 确保所有存在的节点都有活跃的链接
      animationNodes.forEach(n => {
        if (n.exists) {
          n.linkState = { toNext: 'active', toPrev: 'active' };
        }
      });

      // Step 116 + (round-1)*10: 第57行 toRemove = count(first, boundMachine(i))
      steps.push({
        type: 'counting',
        message: `第 ${round} 轮：调用 count(first, boundMachine(${round}))`,
        line: 57,  // toRemove = count(first, boundMachine(i));
        nodes: animationNodes.map(n => ({...n, linkState: { ...n.linkState }})),
        activeNode: current,
        nodesToRemove: []
      });

      // Step 117 + (round-1)*10: boundMachine函数调用 - 第29行
      steps.push({
        type: 'counting',
        message: `第 ${round} 轮：boundMachine(${round}) 被调用`,
        line: 29,  // int boundMachine(int order) {
        nodes: animationNodes.map(n => ({...n, linkState: { ...n.linkState }})),
        activeNode: current,
        nodesToRemove: []
      });

      // Step 118 + (round-1)*10: boundMachine函数 - 第30行
      steps.push({
        type: 'counting',
        message: `第 ${round} 轮：从 boundList 获取计数上限 ${bound}`,
        line: 30,  // return boundList[(order - 1) % 4];
        nodes: animationNodes.map(n => ({...n, linkState: { ...n.linkState }})),
        activeNode: current,
        nodesToRemove: []
      });

      // Step 119 + (round-1)*10: count函数调用 - 第34行
      steps.push({
        type: 'counting',
        message: `第 ${round} 轮：count() 函数被调用，计数上限 ${bound}`,
        line: 34,  // pNode count(pNode first, int bound) {
        nodes: animationNodes.map(n => ({...n, linkState: { ...n.linkState }})),
        activeNode: current,
        nodesToRemove: []
      });

      // Step 120 + (round-1)*10: count函数 - 第35行初始化q指针
      steps.push({
        type: 'counting',
        message: `第 ${round} 轮：初始化 q 指针指向当前节点 ${current.id}`,
        line: 35,  // q = first;
        nodes: animationNodes.map(n => ({...n, linkState: { ...n.linkState }})),
        activeNode: current,
        nodesToRemove: []
      });

      // Step 121 + (round-1)*10: count函数 - 第36行 for循环开始
      steps.push({
        type: 'counting',
        message: `第 ${round} 轮：开始计数循环 (i = 2; i <= ${bound}; i++)`,
        line: 36,  // for (int i = 2; i <= bound; i++)
        nodes: animationNodes.map(n => ({...n, linkState: { ...n.linkState }})),
        activeNode: current,
        nodesToRemove: []
      });

      // Step 122 + (round-1)*10: count函数 - 第37行逐步移动q指针 (bound-1步)
      let tempNode = current;
      for (let step = 2; step <= bound; step++) {
        tempNode = tempNode.next;
        while (!tempNode.exists) {
          tempNode = tempNode.next;
        }

        steps.push({
          type: 'counting',
          message: `第 ${round} 轮：计数第 ${step-1} 步到节点 ${tempNode.id}`,
          line: 37,  // q = q->next;
          nodes: animationNodes.map(n => ({...n, linkState: { ...n.linkState }})),
          activeNode: tempNode,
          nodesToRemove: []
        });
      }

      // Step 123 + (round-1)*10: count函数 - 第39行 return
      steps.push({
        type: 'counting',
        message: `第 ${round} 轮：count() 返回目标节点 ${tempNode.id}`,
        line: 39,  // return q;
        nodes: animationNodes.map(n => ({...n, linkState: { ...n.linkState }})),
        activeNode: tempNode,
        nodesToRemove: []
      });

      // Step 124 + (round-1)*10: 第58行 first = removeNode(toRemove)
      steps.push({
        type: 'removing',
        message: `第 ${round} 轮：调用 removeNode(节点 ${tempNode.id})`,
        line: 58,  // first = removeNode(toRemove);
        nodes: animationNodes.map(n => ({...n, linkState: { ...n.linkState }})),
        activeNode: tempNode,
        nodesToRemove: []
      });

      // Step 125 + (round-1)*10: removeNode函数 - 第44行
      // 获取前驱和后继节点，准备箭头重连
      // 修复：使用this.nodes引用，确保指针关系正确
      const removedNode = this.nodes[tempNode.id - 1];

      // 修复：找到实际存在的前驱节点（向前遍历直到找到存在的节点）
      let prevNode = removedNode.prev;
      while (!prevNode.exists && prevNode !== removedNode) {
        prevNode = prevNode.prev;
      }

      // 修复：找到实际存在的后继节点（向后遍历直到找到存在的节点）
      let nextActualNode = removedNode.next;
      while (!nextActualNode.exists && nextActualNode !== removedNode) {
        nextActualNode = nextActualNode.next;
      }

      // 准备箭头状态：前驱节点的next箭头准备重新指向
      const step125Nodes = animationNodes.map(n => {
        if (n.id === prevNode.id && n.exists) {
          // 前驱节点：暂时隐藏next箭头，准备重连
          return {
            ...n,
            linkState: { ...n.linkState },
            nextId: undefined, // 准备更新
            nextLink: false, // 暂时隐藏，下一步显示重连
            prevLink: n.prevLink
          }
        } else {
          return {...n, linkState: { ...n.linkState }}
        }
      });

      steps.push({
        type: 'removing',
        message: `第 ${round} 轮：removeNode() - 保存下一个节点指针，准备重连箭头`,
        line: 44,  // pNode first = currentNode->next;
        nodes: step125Nodes,
        activeNode: tempNode,
        nodesToRemove: []
      });

      // Step 126 + (round-1)*10: removeNode函数 - 第45行
      // 前驱节点的next箭头重新指向后继节点
      const step126Nodes = step125Nodes.map(n => {
        if (n.id === prevNode.id && n.exists) {
          // 前驱节点：next箭头指向后继节点
          return {
            ...n,
            linkState: { ...n.linkState, toNext: 'active' },
            nextId: nextActualNode.id, // 更新指向后继节点
            nextLink: true, // 显示重连的next箭头
            prevLink: n.prevLink
          }
        } else {
          return {...n}
        }
      });

      steps.push({
        type: 'removing',
        message: `第 ${round} 轮：前驱节点 ${prevNode.id} 的 next 指针重新指向节点 ${nextActualNode.id}`,
        line: 45,  // currentNode->pre->next = currentNode->next;
        nodes: step126Nodes,
        activeNode: prevNode,
        nodesToRemove: []
      });

      // Step 127 + (round-1)*10: removeNode函数 - 第46行
      // 后继节点的prev箭头重新指向前驱节点
      const step127Nodes = step126Nodes.map(n => {
        if (n.id === nextActualNode.id && n.exists) {
          // 后继节点：prev箭头指向前驱节点
          return {
            ...n,
            linkState: { ...n.linkState, toPrev: 'active' },
            prevId: prevNode.id, // 更新指向前驱节点
            nextLink: n.nextLink,
            prevLink: true // 显示重连的prev箭头
          }
        } else {
          return {...n}
        }
      });

      steps.push({
        type: 'removing',
        message: `第 ${round} 轮：后继节点 ${nextActualNode.id} 的 prev 指针重新指向节点 ${prevNode.id}`,
        line: 46,  // first->pre = currentNode->pre;
        nodes: step127Nodes,
        activeNode: nextActualNode,
        nodesToRemove: []
      });

      // Step 128 + (round-1)*10: removeNode函数 - 第47-48行删除节点
      // 基于step127Nodes的状态，删除被删除的节点，但保持重连的箭头
      const step128Nodes = step127Nodes.map(n => {
        if (n.id === tempNode.id) {
          // 被删除的节点：标记为不存在，隐藏所有箭头
          return {
            ...n,
            exists: false,
            linkState: { toNext: 'removed', toPrev: 'removed' },
            nextLink: false,
            prevLink: false
          }
        } else {
          // 其他节点：保持重连后的箭头状态
          return {...n}
        }
      });

      // 修复：获取删除后的节点引用，用于nodesToRemove
      const deletedNodeForRemoval = step128Nodes.find(n => n.id === tempNode.id);

      steps.push({
        type: 'removing',
        message: `第 ${round} 轮：节点 ${tempNode.id} 被删除，双向环链保持连接`,
        line: 48,  // free(currentNode);
        nodes: step128Nodes,
        activeNode: tempNode,
        nodesToRemove: [deletedNodeForRemoval]
      });

      // Step 129 + (round-1)*10: removeNode函数 - 第49行 return
      // 保持重连后的箭头状态，确保动画一致性
      steps.push({
        type: 'removing',
        message: `第 ${round} 轮：removeNode() 返回新的 first 指针 (节点 ${nextActualNode.id})`,
        line: 49,  // return first;
        nodes: step128Nodes, // 保持重连后的状态
        activeNode: nextActualNode,
        nodesToRemove: [deletedNodeForRemoval]
      });

      // 同步到animationNodes以保持状态一致性
      step128Nodes.forEach((node, index) => {
        animationNodes[index] = {...node};
        // 修复：同时同步this.nodes的状态和指针关系
        if (this.nodes[index]) {
          this.nodes[index].exists = node.exists;
          this.nodes[index].linkState = {...node.linkState};

          // 同步箭头状态到this.nodes
          if (this.nodes[index].next) {
            this.nodes[index].next.linkState = {...this.nodes[index].next.linkState};
          }
          if (this.nodes[index].prev) {
            this.nodes[index].prev.linkState = {...this.nodes[index].prev.linkState};
          }
        }
      });

      // 修复：更新current到被删除节点的下一个节点（使用this.nodes引用）
      // 这确保删除顺序正确：3, 8, 15, 10, 13, 19, 7, 6, 12, 20, 14, 1, 5, 18, 2, 11, 4, 16, 17, 9
      current = this.nodes[nextActualNode.id - 1];
    }

    // ===== main函数结束 =====

    // Step 316: 第56行 for循环结束
    steps.push({
      type: 'complete',
      message: 'main() 函数：循环结束',
      line: 59,  // }
      nodes: animationNodes.map(n => ({...n, exists: false, linkState: { ...n.linkState }})),
      activeNode: null,
      nodesToRemove: []
    });

    // Step 317: 第60行 return 0
    steps.push({
      type: 'complete',
      message: 'main() 函数：程序执行完成',
      line: 60,  // return 0;
      nodes: animationNodes.map(n => ({...n, exists: false, linkState: { ...n.linkState }})),
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