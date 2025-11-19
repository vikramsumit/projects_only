/* round_robin.c
   Round Robin scheduling with arrival times.
   Compile: gcc -O2 round_robin.c -o rr
*/
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct {
    int pid;
    int arrival;
    int burst;
    int remaining;
    int completion;
    int turnaround;
    int waiting;
    bool inQueue;
    bool done;
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
        p[i].inQueue = false;
        p[i].done = false;
    }

    int quantum;
    printf("Enter time quantum: ");
    scanf("%d", &quantum);
    if (quantum <= 0) quantum = 1;

    // simple queue implemented with dynamic array indices
    int *queue = malloc(sizeof(int) * (n * 10 + 5));
    int front = 0, rear = 0;

    // start time at earliest arrival
    int time = 1e9;
    for (int i = 0; i < n; ++i) if (p[i].arrival < time) time = p[i].arrival;
    if (time == 1e9) time = 0;

    // enqueue all processes that have arrived at start
    for (int i = 0; i < n; ++i) {
        if (p[i].arrival <= time) {
            queue[rear++] = i;
            p[i].inQueue = true;
        }
    }

    int completed = 0;
    double total_wt = 0, total_tat = 0;

    while (completed < n) {
        if (front == rear) {
            // idle until next arrival
            int next = 1e9, idx = -1;
            for (int i = 0; i < n; ++i)
                if (!p[i].done && p[i].arrival > time && p[i].arrival < next) {
                    next = p[i].arrival; idx = i;
                }
            if (idx == -1) break;
            time = next;
            // enqueue all arrived at this time
            for (int i = 0; i < n; ++i)
                if (!p[i].inQueue && !p[i].done && p[i].arrival <= time) {
                    queue[rear++] = i;
                    p[i].inQueue = true;
                }
            continue;
        }

        int i = queue[front++]; // dequeue
        int exec = (p[i].remaining <= quantum) ? p[i].remaining : quantum;
        // if process arrives in future (shouldn't for queued ones) we assume it's ready
        time += exec;
        p[i].remaining -= exec;

        // enqueue any newly arrived processes at this time
        for (int j = 0; j < n; ++j)
            if (!p[j].inQueue && !p[j].done && p[j].arrival <= time) {
                queue[rear++] = j;
                p[j].inQueue = true;
            }

        if (p[i].remaining == 0) {
            p[i].done = true;
            p[i].completion = time;
            p[i].turnaround = p[i].completion - p[i].arrival;
            p[i].waiting = p[i].turnaround - p[i].burst;
            total_wt += p[i].waiting;
            total_tat += p[i].turnaround;
            completed++;
        } else {
            // not finished, requeue
            queue[rear++] = i;
        }
    }

    printf("\nPID\tArrival\tBurst\tCompletion\tTAT\tWaiting\n");
    for (int i = 0; i < n; ++i) {
        // If a process never ran (edge case), mark completion appropriately
        if (!p[i].done) {
            p[i].completion = p[i].arrival; // or leave as -1
            p[i].turnaround = 0;
            p[i].waiting = 0;
        }
        printf("%d\t%d\t%d\t%d\t\t%d\t%d\n",
               p[i].pid, p[i].arrival, p[i].burst, p[i].completion,
               p[i].turnaround, p[i].waiting);
    }

    printf("\nAverage Turnaround Time = %.2f\n", (n>0? total_tat / n : 0));
    printf("Average Waiting Time = %.2f\n", (n>0? total_wt / n : 0));

    free(p);
    free(queue);
    return 0;
}
