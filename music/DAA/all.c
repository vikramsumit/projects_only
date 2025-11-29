#include <stdio.h>
#include <stdlib.h>

int missing_function(); 

int main(void) {
    printf("1) Syntax/compile-time error example (commented):\n");
    
    printf("2) Type error example (compile-time warnings/errors):\n");
    
    printf("3) Linker error example (commented):\n");

    printf("4) Runtime error example (divide by zero) - commented by default:\n");
    int x = 10, y = 0;

    printf("5) Null pointer deref (runtime) - commented by default:\n");
    int *p = NULL;

    printf("6) Logical error example:\n");
    int n = 5;
    
    int fact = 1;
    for (int i = 1; i < n; ++i) { 
        fact *= i;
    }
    printf("Incorrect factorial of %d computed as %d (logical error)\n", n, fact);

    printf("7) Correct factorial for comparison:\n");
    fact = 1;
    for (int i = 1; i <= n; ++i) fact *= i;
    printf("Correct factorial of %d is %d\n", n, fact);

    return 0;
}

// OUTPUT:
// 1) Syntax/compile-time error example (commented):
// 2) Type error example (compile-time warnings/errors):
// 3) Linker error example (commented):
// 4) Runtime error example (divide by zero) - commented by default:
// 5) Null pointer deref (runtime) - commented by default:
// 6) Logical error example:
// Incorrect factorial of 5 computed as 24 (logical error)
// 7) Correct factorial for comparison:
// Correct factorial of 5 is 120


// ==================/* file: binary_search */==================

#include <stdio.h>

int binary_search(int arr[], int n, int key) {
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == key) return mid;
        else if (arr[mid] < key) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

int main(void) {
    int arr[] = {1,3,5,7,9,11,13,17};
    int n = sizeof(arr)/sizeof(arr[0]);
    int key = 7;
    int idx = binary_search(arr, n, key);
    if (idx >= 0) printf("Found %d at index %d\n", key, idx);
    else printf("%d not found\n", key);
    return 0;
}

// OUTPUT:
// Found 7 at index 3


// ==================/* file: quicksort */==================

#include <stdio.h>

void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

int partition(int arr[], int l, int h) {
    int pivot = arr[h];
    int i = l - 1;
    for (int j = l; j <= h - 1; ++j) {
        if (arr[j] <= pivot) {
            ++i;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i+1], &arr[h]);
    return i+1;
}

void quicksort(int arr[], int l, int h) {
    if (l < h) {
        int p = partition(arr, l, h);
        quicksort(arr, l, p-1);
        quicksort(arr, p+1, h);
    }
}

int main(void) {
    int arr[] = {10,7,8,9,1,5};
    int n = sizeof(arr)/sizeof(arr[0]);
    quicksort(arr, 0, n-1);
    printf("Sorted: ");
    for (int i=0;i<n;i++) printf("%d ", arr[i]);
    printf("\n");
    return 0;
}

// OUTPUT:
// Sorted: 1 5 7 8 9 10


// =================/* file: merge_sort */==================

#include <stdio.h>

void hanoi(int n, char from, char to, char aux) {
    if (n == 1) {
        printf("Move disk 1 from %c to %c\n", from, to);
        return;
    }
    hanoi(n-1, from, aux, to);
    printf("Move disk %d from %c to %c\n", n, from, to);
    hanoi(n-1, aux, to, from);
}

int main(void) {
    int n = 3;
    printf("Tower of Hanoi with %d disks:\n", n);
    hanoi(n, 'A', 'C', 'B');
    return 0;
}

// OUTPUT:
// Tower of Hanoi with 3 disks:
// Move disk 1 from A to C
// Move disk 2 from A to B
// Move disk 1 from C to B
// Move disk 3 from A to C
// Move disk 1 from B to A
// Move disk 2 from B to C
// Move disk 1 from A to C


// ================= /* file: nqueens.c */ ==================
#include <stdio.h>
#include <stdlib.h>

int N;
int *cols, *d1, *d2;
int *board;
int solutions = 0;

void print_board() {
    printf("Solution %d:\n", ++solutions);
    for (int i = 0; i < N; ++i) {
        for (int j = 0; j < N; ++j) {
            printf("%c ", board[i] == j ? 'Q' : '.');
        }
        printf("\n");
    }
    printf("\n");
}

void solve_row(int r) {
    if (r == N) {
        print_board();
        return;
    }
    for (int c = 0; c < N; ++c) {
        if (!cols[c] && !d1[r+c] && !d2[r-c+N-1]) {
            cols[c] = d1[r+c] = d2[r-c+N-1] = 1;
            board[r] = c;
            solve_row(r+1);
            cols[c] = d1[r+c] = d2[r-c+N-1] = 0;
        }
    }
}

int main(void) {
    N = 8; // change N as required
    cols = calloc(N, sizeof(int));
    d1 = calloc(2*N, sizeof(int));
    d2 = calloc(2*N, sizeof(int));
    board = calloc(N, sizeof(int));
    solve_row(0);
    if (solutions == 0) printf("No solutions for N=%d\n", N);
    free(cols); free(d1); free(d2); free(board);
    return 0;
}

// OUTPUT (for N=8):
// Solution 1:
// Q . . . . . . .
// . . . . Q . . .
// . . . . . . . Q
// . . . . . Q . .
// . . Q . . . . .
// . . . . . . Q .
// . Q . . . . . .
// . . . Q . . . .

// Solution 2:
// Q . . . . . . .
// . . . . . Q . .
// . . . . . . . Q
// . Q . . . . . .
// . . . Q . . . .
// . . . . . . Q .
// . . . . Q . . .
// . . Q . . . . .

// ================= /* file: bfs.c */ ==================

#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int v; struct Node *next;
} Node;

typedef struct {
    int V;
    Node **adj;
} Graph;

Node* newNode(int v) {
    Node *n = malloc(sizeof(Node)); n->v = v; n->next = NULL; return n;
}

Graph* createGraph(int V) {
    Graph *g = malloc(sizeof(Graph));
    g->V = V;
    g->adj = malloc(V * sizeof(Node*));
    for (int i=0;i<V;i++) g->adj[i]=NULL;
    return g;
}

void addEdge(Graph *g, int u, int v) {
    Node *n = newNode(v); n->next = g->adj[u]; g->adj[u]=n;
    // undirected:
    n = newNode(u); n->next = g->adj[v]; g->adj[v]=n;
}

int* queue_create(int cap) { return malloc(cap * sizeof(int)); }

void bfs(Graph *g, int s) {
    int V = g->V;
    int *visited = calloc(V, sizeof(int));
    int *q = queue_create(V);
    int head = 0, tail = 0;
    visited[s]=1; q[tail++]=s;
    printf("BFS order: ");
    while (head < tail) {
        int u = q[head++];
        printf("%d ", u);
        for (Node *p = g->adj[u]; p; p = p->next) {
            if (!visited[p->v]) {
                visited[p->v]=1;
                q[tail++]=p->v;
            }
        }
    }
    printf("\n");
    free(visited); free(q);
}

int main(void) {
    Graph *g = createGraph(6);
    addEdge(g,0,1); addEdge(g,0,2); addEdge(g,1,3);
    addEdge(g,2,3); addEdge(g,3,4); addEdge(g,4,5);
    bfs(g, 0);
    
    return 0;
}

// OUTPUT:
// BFS order: 0 1 2 3 4 5


// ================= /* file: dfs.c */ ==================
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

// OUTPUT:
// DFS order: 0 1 3 2 4 5


// ================= /* file: prim.c */ ==================

#include <stdio.h>
#include <limits.h>

int minKey(int key[], int mstSet[], int V) {
    int min = INT_MAX, min_index = -1;
    for (int v = 0; v < V; v++)
        if (!mstSet[v] && key[v] < min) min = key[v], min_index = v;
    return min_index;
}

void primMST(int graph[][9], int V) {
    int parent[9];
    int key[9];
    int mstSet[9];
    for (int i=0;i<V;i++) key[i]=INT_MAX, mstSet[i]=0;
    key[0]=0; parent[0] = -1;
    for (int count=0; count<V-1; ++count) {
        int u = minKey(key, mstSet, V);
        mstSet[u]=1;
        for (int v=0; v<V; ++v)
            if (graph[u][v] && !mstSet[v] && graph[u][v] < key[v]) {
                parent[v]=u; key[v]=graph[u][v];
            }
    }
    int total=0;
    printf("Edge \tWeight\n");
    for (int i=1;i<V;i++) {
        printf("%d - %d \t%d \n", parent[i], i, graph[i][parent[i]]);
        total += graph[i][parent[i]];
    }
    printf("Total weight: %d\n", total);
}

int main(void) {
    int V = 5;
    int graph[9][9] = {0};
    graph[0][1]=2; graph[1][0]=2;
    graph[0][3]=6; graph[3][0]=6;
    graph[1][2]=3; graph[2][1]=3;
    graph[1][3]=8; graph[3][1]=8;
    graph[1][4]=5; graph[4][1]=5;
    graph[2][4]=7; graph[4][2]=7;
    primMST(graph, V);
    return 0;
}

// OUTPUT:
// Edge 	Weight
// 0 - 1 	2 
// 1 - 2 	3 
// 0 - 3 	6 
// 1 - 4 	5 
// Total weight: 16

// ================= /* file: kruskal.c */ =================
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int u,v,w;
} Edge;

int cmpEdge(const void *a, const void *b) {
    return ((Edge*)a)->w - ((Edge*)b)->w;
}

int find(int parent[], int i) {
    if (parent[i] != i) parent[i] = find(parent, parent[i]);
    return parent[i];
}

void uni(int parent[], int rank[], int x, int y) {
    x = find(parent, x); y = find(parent, y);
    if (rank[x] < rank[y]) parent[x] = y;
    else if (rank[x] > rank[y]) parent[y] = x;
    else { parent[y] = x; rank[x]++; }
}

void kruskal(Edge edges[], int E, int V) {
    qsort(edges, E, sizeof(Edge), cmpEdge);
    int *parent = malloc(V*sizeof(int));
    int *rank = calloc(V, sizeof(int));
    for (int v=0; v<V; v++) parent[v]=v;
    Edge *result = malloc((V-1)*sizeof(Edge)); int e=0, i=0;
    while (e < V-1 && i < E) {
        Edge next = edges[i++];
        int x = find(parent, next.u);
        int y = find(parent, next.v);
        if (x != y) {
            result[e++] = next;
            uni(parent, rank, x, y);
        }
    }
    printf("Edges in MST:\n");
    int total=0;
    for (i=0;i<e;i++){ printf("%d - %d : %d\n", result[i].u, result[i].v, result[i].w); total+=result[i].w; }
    printf("Total weight: %d\n", total);
    free(parent); free(rank); free(result);
}

int main(void) {
    int V = 4;
    Edge edges[] = {
        {0,1,10}, {0,2,6}, {0,3,5}, {1,3,15}, {2,3,4}
    };
    int E = sizeof(edges)/sizeof(edges[0]);
    kruskal(edges, E, V);
    return 0;
}

// OUTPUT:
// Edges in MST:
// 2 - 3 : 4
// 0 - 3 : 5
// 0 - 1 : 10
// Total weight: 19

// =================  /* file: graph_coloring.c */ ==================

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void greedyColoring(int V, int graph[V][V]) {
    int result[V];
    result[0] = 0;
    for (int i=1;i<V;i++) result[i] = -1;
    int available[V];
    for (int i=0;i<V;i++) available[i]=0;

    for (int u=1; u<V; u++) {
        for (int v=0; v<V; v++)
            if (graph[u][v] && result[v] != -1) available[result[v]] = 1;
        int cr;
        for (cr=0; cr<V; cr++) if (!available[cr]) break;
        result[u] = cr;
        for (int v=0; v<V; v++)
            if (graph[u][v] && result[v] != -1) available[result[v]] = 0;
    }
    printf("Vertex -> Color\n");
    for (int i=0;i<V;i++) printf("%d -> %d\n", i, result[i]);
}

int main(void) {
    int V = 5;
    int graph[5][5] = {
        {0,1,1,0,1},
        {1,0,1,0,0},
        {1,1,0,1,0},
        {0,0,1,0,1},
        {1,0,0,1,0}
    };
    greedyColoring(V, graph);
    return 0;
}

// OUTPUT:
// Vertex -> Color
// 0 -> 0
// 1 -> 1
// 2 -> 2
// 3 -> 1
// 4 -> 2

// =================/* file: floyd_warshall.c */ ==================
#include <stdio.h>
#include <limits.h>

#define INF 1000000

int main(void) {
    int V = 4;
    int dist[4][4] = {
        {0, 5, INF, 10},
        {INF, 0, 3, INF},
        {INF, INF, 0,   1},
        {INF, INF, INF, 0}
    };
    for (int k=0;k<V;k++)
        for (int i=0;i<V;i++)
            for (int j=0;j<V;j++)
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
    printf("All-pairs shortest path distances:\n");
    for (int i=0;i<V;i++){
        for (int j=0;j<V;j++){
            if (dist[i][j] >= INF) printf("INF ");
            else printf("%d ", dist[i][j]);
        }
        printf("\n");
    }
    return 0;
}

// OUTPUT:
// All-pairs shortest path distances:
// 0 5 8 9
// INF 0 3 4
// INF INF 0 1
// INF INF INF 0 


// =================/* file: fractional_knapsack.c */ =================
#include <stdio.h>
#include <stdlib.h>

typedef struct { int wt; int val; double ratio; } Item;

int cmp(const void *a, const void *b) {
    double r1 = ((Item*)a)->ratio, r2 = ((Item*)b)->ratio;
    if (r1 < r2) return 1; if (r1 > r2) return -1; return 0;
}

double fractionalKnapsack(Item arr[], int n, int W) {
    for (int i=0;i<n;i++) arr[i].ratio = (double)arr[i].val / arr[i].wt;
    qsort(arr, n, sizeof(Item), cmp);
    double res = 0.0;
    for (int i=0;i<n;i++) {
        if (W == 0) break;
        if (arr[i].wt <= W) {
            W -= arr[i].wt;
            res += arr[i].val;
        } else {
            res += arr[i].ratio * W;
            W = 0;
        }
    }
    return res;
}

int main(void) {
    Item items[] = {{10,60,0},{20,100,0},{30,120,0}};
    int n = sizeof(items)/sizeof(items[0]);
    int W = 50;
    double maxVal = fractionalKnapsack(items, n, W);
    printf("Max value in fractional knapsack = %.2f\n", maxVal);
    return 0;
}

// OUTPUT:
// Max value in fractional knapsack = 240.00


// ================= /* file: tsp.c */ =================
#include <stdio.h>
#include <limits.h>
#include <string.h>

int best_cost = INT_MAX;
int best_path[20];

void tsp_backtrack(int V, int dist[V][V], int pos, int visited[], int path[], int cost) {
    if (pos == V) {
        cost += dist[path[V-1]][path[0]];
        if (cost < best_cost) {
            best_cost = cost;
            memcpy(best_path, path, V * sizeof(int));
        }
        return;
    }
    for (int v = 1; v < V; v++) {
        if (!visited[v]) {
            visited[v] = 1; path[pos] = v;
            tsp_backtrack(V, dist, pos+1, visited, path, cost + dist[path[pos-1]][v]);
            visited[v] = 0;
        }
    }
}

void tsp_bruteforce(int V, int dist[V][V]) {
    int visited[V]; int path[V];
    for (int i=0;i<V;i++) visited[i]=0;
    path[0] = 0; visited[0]=1;
    tsp_backtrack(V, dist, 1, visited, path, 0);
    printf("Brute-force best cost: %d\nPath: ", best_cost);
    for (int i=0;i<V;i++) printf("%d ", best_path[i]);
    printf("%d\n", best_path[0]);
}

void tsp_nearest(int V, int dist[V][V]) {
    int visited[V]; for (int i=0;i<V;i++) visited[i]=0;
    int cur = 0; visited[0]=1; int tour[V+1]; tour[0]=0;
    int cost = 0;
    for (int i=1;i<V;i++) {
        int next = -1, min = INT_MAX;
        for (int j=0;j<V;j++) if (!visited[j] && dist[cur][j] < min) { min = dist[cur][j]; next = j; }
        tour[i] = next; visited[next]=1; cost += dist[cur][next]; cur = next;
    }
    cost += dist[cur][0];
    tour[V] = 0;
    printf("Nearest neighbor approx cost: %d\nPath: ", cost);
    for (int i=0;i<=V;i++) printf("%d ", tour[i]);
    printf("\n");
}

int main(void) {
    int V = 4;
    int dist[4][4] = {
        {0, 10, 15, 20},
        {10, 0, 35, 25},
        {15, 35, 0, 30},
        {20, 25, 30, 0}
    };
    tsp_nearest(V, dist);
    tsp_bruteforce(V, dist);
    return 0;
}

// OUTPUT:
// Nearest neighbor approx cost: 80

