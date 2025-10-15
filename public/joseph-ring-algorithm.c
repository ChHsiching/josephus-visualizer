#include<stdlib.h>
#include<stdio.h>
#define N 20
typedef struct node {    //定义一个双向链表，包含id、后继指针next、前驱指针pre
    int id;
    struct node* next;  
    struct node* pre;   
}Node, * pNode;

pNode RingConstruct(int n) {
    int i;
    pNode head, p, q;
    head = (pNode)malloc(sizeof(Node));  //建立第一个结点
    head->id = 1;        //其 ID 为 1
    p = head;
    for (i = 2; i <= n; i++) { //循环 n-1 次，构建剩余n-1个结点并形成双向链表
        q = (pNode)malloc(sizeof(Node));
        q->id = i;
        p->next = q;
        q->pre = p;
        p = p->next;
    }
    p->next = head;      //构建环形结构，最后一个结点的next指向头结点
    head->pre = p;       //头结点的pre指向最后一个结点
    return head;
}

/*传入报数的次数序号，返回此次报数的上限*/
int boundMachine(int order) {
    int boundList[4] = { 3, 5, 7, 13 };
    return boundList[(order - 1) % 4];
}

pNode count(pNode  first, int bound) {   // 返回当前趟的起始结点，bound 参数由 boundMachine 提供
    pNode q;
    q = first;
    for (int i = 2; i <= bound; i++) {
        q = q->next;
    }
    return q;
}

/*将 currentNode 从环中删除，并返回被删除结点的下一结点*/
pNode removeNode(pNode currentNode) {
    pNode first = currentNode->next; //当前删除结点的后继是下一趟的起始结点
    currentNode->pre->next = currentNode->next;
    first->pre = currentNode->pre;
    printf("%d ", currentNode->id); //输出被删除结点的id
    free(currentNode); //释放被删除结点的内存
    return first;
}

int main() {
    pNode first;  //first 为每趟的起始结点
    pNode toRemove;  //toRemove 为要删除结点，通过 removeNode 函数获得下一趟起始地址
    int i;
    first = RingConstruct(N);
    for (int i = 1; i <= N; i++) {
        toRemove = count(first, boundMachine(i));
        first = removeNode(toRemove);
    }
    return 0;
}
