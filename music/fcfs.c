/* fcfs.c
   First-Come First-Serve scheduling with arrival times.
   Compile: gcc -O2 fcfs.c -o fcfs
*/
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int pid;
    int arrival;
    int burst;
    int start;
    int completion;
    int turnaround;
    int waiting;
} Process;

int cmp_arrival(const void *a, const void *b) {
    const Process *p = a;
    const Process *q = b;
    if (p->arrival != q->arrival) return p->arrival - q->arrival;
    return p->pid - q->pid;
}

int main() {
    int n;
    printf("Enter number of processes: ");
    if (scanf("%d", &n) != 1) return 0;

    Process *p = malloc(sizeof(Process) * n);
    for (int i = 0; i < n; ++i) {
        printf("Process %d: Enter PID Arrival Burst: ", i+1);
        scanf("%d %d %d", &p[i].pid, &p[i].arrival, &p[i].burst);
    }

    qsort(p, n, sizeof(Process), cmp_arrival);

    int time = 0;
    double total_wt = 0, total_tat = 0;
    for (int i = 0; i < n; ++i) {
        if (time < p[i].arrival) time = p[i].arrival; // CPU idle until arrival
        p[i].start = time;
        p[i].completion = p[i].start + p[i].burst;
        p[i].turnaround = p[i].completion - p[i].arrival;
        p[i].waiting = p[i].start - p[i].arrival;
        time = p[i].completion;

        total_wt += p[i].waiting;
        total_tat += p[i].turnaround;
    }

    printf("\nPID\tArrival\tBurst\tStart\tCompletion\tTAT\tWaiting\n");
    for (int i = 0; i < n; ++i)
        printf("%d\t%d\t%d\t%d\t%d\t\t%d\t%d\n",
               p[i].pid, p[i].arrival, p[i].burst, p[i].start,
               p[i].completion, p[i].turnaround, p[i].waiting);

    printf("\nAverage Turnaround Time = %.2f\n", total_tat / n);
    printf("Average Waiting Time = %.2f\n", total_wt / n);

    free(p);
    return 0;
}
