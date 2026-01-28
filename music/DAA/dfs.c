#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int v; struct Node *next; } Node;
typedef struct { int V; Node **adj; } Graph;
Node* newNode(int v) { Node *n = malloc(sizeof(Node)); n->v=v; n->next=NULL; return n;}
Graph* createGraph(int V){ Graph* g=malloc(sizeof(Graph)); g->V=V; g->adj=malloc(V*sizeof(Node*)); for(int i=0;i<V;i++) g->adj[i]=NULL; return g;}
void addEdge(Graph*g,int u,int v){ Node*n=newNode(v); n->next=g->adj[u]; g->adj[u]=n; n=newNode(u); n->next=g->adj[v]; g->adj[v]=n; }

void dfsUtil(Graph *g, int u, int visited[]) {
    visited[u]=1; printf("%d ", u);
    for (Node *p=g->adj[u]; p; p=p->next)
        if (!visited[p->v]) dfsUtil(g, p->v, visited);
}

void dfs(Graph *g, int s) {
    int *visited = calloc(g->V, sizeof(int));
    dfsUtil(g, s, visited);
    printf("\n");
    free(visited);
}

int main(void) {
    Graph *g = createGraph(6);
    addEdge(g,0,1); addEdge(g,0,2); addEdge(g,1,3);
    addEdge(g,2,3); addEdge(g,3,4); addEdge(g,4,5);
    printf("DFS order: ");
    dfs(g, 0);
    return 0;
}