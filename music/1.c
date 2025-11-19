/* priority_nonpreemptive.c
   Non-preemptive priority scheduling with arrival times.
   Lower numeric priority value => higher priority (1 is highest).
   Compile: gcc -O2 priority_nonpreemptive.c -o prio
*/
#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

typedef struct {
    int pid;
    int arrival;
    int burst;
    int priority;
    int start;
    int completion;
    int turnaround;
    int waiting;
    int done;
} Process;

int main() {
    int n;
    printf("Enter number of processes: ");
    if (scanf("%d", &n) != 1) return 0;

    Process *p = malloc(sizeof(Process) * n);
    for (int i = 0; i < n; ++i) {
        printf("Process %d: Enter PID Arrival Burst Priority: ", i+1);
        scanf("%d %d %d %d", &p[i].pid, &p[i].arrival, &p[i].burst, &p[i].priority);
        p[i].done = 0;
    }

    int completed = 0, time = 0;
    double total_wt = 0, total_tat = 0;

    // set start time to earliest arrival
    int earliest = INT_MAX;
    for (int i = 0; i < n; ++i) if (p[i].arrival < earliest) earliest = p[i].arrival;
    if (earliest != INT_MAX) time = earliest;

    while (completed < n) {
        int idx = -1;
        int bestPr = INT_MAX;
        for (int i = 0; i < n; ++i) {
            if (!p[i].done && p[i].arrival <= time) {
                if (p[i].priority < bestPr) {
                    bestPr = p[i].priority;
                    idx = i;
                } else if (p[i].priority == bestPr) {
                    // tie-breaker: earlier arrival or smaller burst or lower pid
                    if (p[i].arrival < p[idx].arrival) idx = i;
                    else if (p[i].arrival == p[idx].arrival && p[i].burst < p[idx].burst) idx = i;
                }
            }
        }

        if (idx == -1) {
            int nextArrival = INT_MAX;
            for (int i = 0; i < n; ++i)
                if (!p[i].done && p[i].arrival > time && p[i].arrival < nextArrival)
                    nextArrival = p[i].arrival;
            time = (nextArrival == INT_MAX) ? time + 1 : nextArrival;
            continue;
        }

        p[idx].start = time;
        p[idx].completion = p[idx].start + p[idx].burst;
        p[idx].turnaround = p[idx].completion - p[idx].arrival;
        p[idx].waiting = p[idx].start - p[idx].arrival;
        time = p[idx].completion;
        p[idx].done = 1;
        completed++;
        total_wt += p[idx].waiting;
        total_tat += p[idx].turnaround;
    }

    printf("\nPID\tArrival\tBurst\tPriority\tStart\tCompletion\tTAT\tWaiting\n");
    for (int i = 0; i < n; ++i)
        printf("%d\t%d\t%d\t%d\t\t%d\t%d\t\t%d\t%d\n",
               p[i].pid, p[i].arrival, p[i].burst, p[i].priority,
               p[i].start, p[i].completion, p[i].turnaround, p[i].waiting);

    printf("\nAverage Turnaround Time = %.2f\n", total_tat / n);
    printf("Average Waiting Time = %.2f\n", total_wt / n);

    free(p);
    return 0;
}
