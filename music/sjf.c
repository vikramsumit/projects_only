/* sjf_nonpreemptive.c
   Non-preemptive SJF with arrival times.
   At each decision point, pick the ready process with smallest burst.
   Compile: gcc -O2 sjf_nonpreemptive.c -o sjf
*/
#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

typedef struct {
    int pid;
    int arrival;
    int burst;
    int remaining;
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
        printf("Process %d: Enter PID Arrival Burst: ", i+1);
        scanf("%d %d %d", &p[i].pid, &p[i].arrival, &p[i].burst);
        p[i].remaining = p[i].burst;
        p[i].done = 0;
    }

    int completed = 0, time = 0;
    double total_wt = 0, total_tat = 0;

    // advance time to earliest arrival if needed
    int earliest = INT_MAX;
    for (int i = 0; i < n; ++i) if (p[i].arrival < earliest) earliest = p[i].arrival;
    if (earliest != INT_MAX) time = earliest;

    while (completed < n) {
        int idx = -1;
        int min_burst = INT_MAX;
        for (int i = 0; i < n; ++i) {
            if (!p[i].done && p[i].arrival <= time) {
                if (p[i].burst < min_burst) {
                    min_burst = p[i].burst;
                    idx = i;
                } else if (p[i].burst == min_burst) {
                    // tie-breaker: earlier arrival or lower pid
                    if (p[i].arrival < p[idx].arrival) idx = i;
                    else if (p[i].arrival == p[idx].arrival && p[i].pid < p[idx].pid) idx = i;
                }
            }
        }

        if (idx == -1) {
            // no process ready — idle to next arrival
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
        p[idx].done = 1;
        time = p[idx].completion;
        completed++;
        total_wt += p[idx].waiting;
        total_tat += p[idx].turnaround;
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
