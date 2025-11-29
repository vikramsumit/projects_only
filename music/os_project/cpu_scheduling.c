/* cpu_scheduling.c
   Simulates CPU scheduling algorithms:
     1) FCFS (First Come First Serve)
     2) SJF (Non-preemptive Shortest Job First)
     3) Priority (Non-preemptive; lower integer = higher priority)
     4) SRTF (Preemptive Shortest Remaining Time First)
     5) Round Robin (preemptive)
   For each algorithm it prints:
     - Gantt chart (sequence of pid:start-end)
     - Table: arrival, burst, completion, turnaround, waiting
     - Average Turnaround and Waiting times
*/

#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include <string.h>

#define MAXP 100
typedef struct {
    int pid;
    int arrival;
    int burst;
    int burst_orig;
    int priority;
    int completion;
    int turnaround;
    int waiting;
    int remaining; // for preemptive
    int started;   // whether it has started (informational)
} Proc;

typedef struct {
    int pid;
    int start;
    int end;
} GanttEntry;

/* Utility: copy array of Procs */
void copy_procs(Proc dest[], Proc src[], int n) {
    for (int i=0;i<n;i++) dest[i] = src[i];
}

/* Print table and averages and Gantt chart */
void print_results(Proc procs[], int n, GanttEntry gantt[], int gcount, const char *title) {
    double avgT = 0.0, avgW = 0.0;
    printf("\n==== %s ====\n", title);
    printf("Gantt Chart:\n");
    for (int i=0;i<gcount;i++) {
        printf("| P%d (%d - %d) ", gantt[i].pid, gantt[i].start, gantt[i].end);
    }
    printf("|\n\n");

    printf("PID\tArrival\tBurst\tPriority\tCompletion\tTurnaround\tWaiting\n");
    printf("--------------------------------------------------------------------------\n");
    for (int i=0;i<n;i++) {
        printf("P%d\t%3d\t%3d\t%3d\t\t%3d\t\t%3d\t\t%3d\n",
               procs[i].pid, procs[i].arrival, procs[i].burst_orig, procs[i].priority,
               procs[i].completion, procs[i].turnaround, procs[i].waiting);
        avgT += procs[i].turnaround;
        avgW += procs[i].waiting;
    }
    avgT /= n; avgW /= n;
    printf("--------------------------------------------------------------------------\n");
    printf("Average Turnaround = %.2f\n", avgT);
    printf("Average Waiting    = %.2f\n", avgW);
}

/* FCFS */
void fcfs(Proc input[], int n) {
    Proc p[MAXP];
    copy_procs(p, input, n);

    // sort by arrival then pid
    for (int i=0;i<n-1;i++)
      for (int j=i+1;j<n;j++)
        if (p[i].arrival > p[j].arrival || (p[i].arrival==p[j].arrival && p[i].pid>p[j].pid)) {
            Proc tmp = p[i]; p[i]=p[j]; p[j]=tmp;
        }

    int time = 0;
    GanttEntry gantt[10000];
    int gcount = 0;
    for (int i=0;i<n;i++) {
        if (time < p[i].arrival) time = p[i].arrival; // CPU idle until arrival
        gantt[gcount++] = (GanttEntry){p[i].pid, time, time + p[i].burst};
        time += p[i].burst;
        p[i].completion = time;
        p[i].turnaround = p[i].completion - p[i].arrival;
        p[i].waiting = p[i].turnaround - p[i].burst;
    }
    // Results must be printed in PID order for readability: map back to original pids
    // Create output array indexed by pid order (smallest pid first) - original input order had pid field
    Proc out[MAXP];
    for (int i=0;i<n;i++) out[i] = p[i];
    // But user might expect table in pid sorted (1..n). Let's sort out by pid ascending.
    for (int i=0;i<n-1;i++)
      for (int j=i+1;j<n;j++)
        if (out[i].pid > out[j].pid) { Proc tmp = out[i]; out[i]=out[j]; out[j]=tmp; }

    print_results(out, n, gantt, gcount, "FCFS");
}

/* Non-preemptive SJF */
void sjf(Proc input[], int n) {
    Proc p[MAXP];
    copy_procs(p, input, n);

    int completed = 0, time = 0;
    int finished[MAXP] = {0};
    GanttEntry gantt[10000]; int gcount = 0;

    while (completed < n) {
        // find process with min burst among arrived and not finished
        int idx = -1;
        int minburst = INT_MAX;
        for (int i=0;i<n;i++) {
            if (!finished[i] && p[i].arrival <= time) {
                if (p[i].burst < minburst || (p[i].burst==minburst && p[i].arrival < p[idx].arrival)) {
                    minburst = p[i].burst;
                    idx = i;
                }
            }
        }
        if (idx == -1) {
            // no process arrived yet, advance time
            int nextArrival = INT_MAX;
            for (int i=0;i<n;i++) if (!finished[i]) nextArrival = (p[i].arrival < nextArrival ? p[i].arrival : nextArrival);
            time = nextArrival;
            continue;
        }
        // schedule idx
        gantt[gcount++] = (GanttEntry){p[idx].pid, time, time + p[idx].burst};
        time += p[idx].burst;
        p[idx].completion = time;
        p[idx].turnaround = p[idx].completion - p[idx].arrival;
        p[idx].waiting = p[idx].turnaround - p[idx].burst;
        finished[idx] = 1;
        completed++;
    }

    // sort output by pid
    Proc out[MAXP]; for (int i=0;i<n;i++) out[i]=p[i];
    for (int i=0;i<n-1;i++) for (int j=i+1;j<n;j++) if (out[i].pid > out[j].pid) { Proc tmp=out[i]; out[i]=out[j]; out[j]=tmp; }
    print_results(out, n, gantt, gcount, "SJF (Non-preemptive)");
}

/* Priority non-preemptive (lower priority value => higher priority) */
void priority_np(Proc input[], int n) {
    Proc p[MAXP];
    copy_procs(p, input, n);
    int completed = 0, time = 0;
    int finished[MAXP] = {0};
    GanttEntry gantt[10000]; int gcount = 0;

    while (completed < n) {
        int idx = -1;
        int bestpri = INT_MAX;
        for (int i=0;i<n;i++) {
            if (!finished[i] && p[i].arrival <= time) {
                if (p[i].priority < bestpri || (p[i].priority == bestpri && p[i].arrival < p[idx].arrival)) {
                    bestpri = p[i].priority;
                    idx = i;
                }
            }
        }
        if (idx == -1) {
            int nextArrival = INT_MAX;
            for (int i=0;i<n;i++) if (!finished[i]) nextArrival = (p[i].arrival < nextArrival ? p[i].arrival : nextArrival);
            time = nextArrival;
            continue;
        }
        gantt[gcount++] = (GanttEntry){p[idx].pid, time, time + p[idx].burst};
        time += p[idx].burst;
        p[idx].completion = time;
        p[idx].turnaround = p[idx].completion - p[idx].arrival;
        p[idx].waiting = p[idx].turnaround - p[idx].burst;
        finished[idx] = 1; completed++;
    }

    Proc out[MAXP]; for (int i=0;i<n;i++) out[i]=p[i];
    for (int i=0;i<n-1;i++) for (int j=i+1;j<n;j++) if (out[i].pid > out[j].pid) { Proc tmp=out[i]; out[i]=out[j]; out[j]=tmp; }
    print_results(out, n, gantt, gcount, "Priority (Non-preemptive)");
}

/* SRTF (preemptive shortest remaining time) */
void srtf(Proc input[], int n) {
    Proc p[MAXP];
    copy_procs(p, input, n);
    for (int i=0;i<n;i++) { p[i].remaining = p[i].burst; p[i].started = 0; p[i].completion = -1; }
    int completed = 0, time = 0;
    GanttEntry gantt[10000]; int gcount = 0;
    int current_pid = -1; int current_start = -1;

    while (completed < n) {
        // find process with min remaining among arrived
        int idx = -1; int minrem = INT_MAX;
        for (int i=0;i<n;i++) {
            if (p[i].arrival <= time && p[i].remaining > 0) {
                if (p[i].remaining < minrem || (p[i].remaining == minrem && p[i].arrival < p[idx].arrival)) {
                    minrem = p[i].remaining;
                    idx = i;
                }
            }
        }
        if (idx == -1) {
            // no arrived process; advance to next arrival
            int nextArrival = INT_MAX;
            for (int i=0;i<n;i++) if (p[i].remaining>0) nextArrival = (p[i].arrival < nextArrival ? p[i].arrival : nextArrival);
            if (nextArrival==INT_MAX) break;
            // close current gantt piece if any
            if (current_pid != -1) { gantt[gcount++] = (GanttEntry){current_pid, current_start, time}; current_pid = -1; }
            time = nextArrival;
            continue;
        }
        // preemption: if switching process, close previous interval
        if (current_pid != p[idx].pid) {
            if (current_pid != -1) {
                gantt[gcount++] = (GanttEntry){current_pid, current_start, time};
            }
            current_pid = p[idx].pid;
            current_start = time;
        }
        // run this process for 1 time unit
        p[idx].remaining--;
        time++;
        if (p[idx].remaining == 0) {
            p[idx].completion = time;
            p[idx].turnaround = p[idx].completion - p[idx].arrival;
            p[idx].waiting = p[idx].turnaround - p[idx].burst;
            completed++;
            // close this interval and reset current process marker
            gantt[gcount++] = (GanttEntry){p[idx].pid, current_start, time};
            current_pid = -1;
        }
    }

    // Prepare output array by pid order
    Proc out[MAXP];
    for (int i=0;i<n;i++) out[i] = p[i];
    for (int i=0;i<n-1;i++) for (int j=i+1;j<n;j++) if (out[i].pid > out[j].pid) { Proc tmp=out[i]; out[i]=out[j]; out[j]=tmp; }
    print_results(out, n, gantt, gcount, "SRTF (Preemptive Shortest Remaining)");
}

/* Round Robin */
void round_robin(Proc input[], int n, int quantum) {
    Proc p[MAXP];
    copy_procs(p, input, n);
    for (int i=0;i<n;i++) { p[i].remaining = p[i].burst; p[i].completion = -1; }

    int time = 0;
    int completed = 0;
    int queue[MAXP*10];
    int qhead = 0, qtail = 0;
    int inqueue[MAXP] = {0};
    GanttEntry gantt[10000]; int gcount = 0;

    // Initially enqueue processes that have arrival == min arrival at time progression
    // We'll advance time to earliest arrival then push arrived processes when they arrive.
    int nextArrivalTime = INT_MAX;
    for (int i=0;i<n;i++) nextArrivalTime = (p[i].arrival < nextArrivalTime ? p[i].arrival : nextArrivalTime);
    time = nextArrivalTime;

    // enqueue all processes that have arrival == time (and those arrived previously)
    for (int i=0;i<n;i++) if (p[i].arrival <= time && !inqueue[i] && p[i].remaining>0) { queue[qtail++] = i; inqueue[i]=1; }

    while (completed < n) {
        if (qhead == qtail) {
            // no ready process; advance time to next arrival
            int nextA = INT_MAX;
            for (int i=0;i<n;i++) if (p[i].remaining>0 && p[i].arrival > time) nextA = (p[i].arrival < nextA ? p[i].arrival : nextA);
            if (nextA==INT_MAX) break;
            time = nextA;
            for (int i=0;i<n;i++) if (p[i].arrival <= time && !inqueue[i] && p[i].remaining>0) { queue[qtail++] = i; inqueue[i]=1; }
            continue;
        }
        int idx = queue[qhead++]; // process index in array
        // start a Gantt entry
        int exec_time = (p[idx].remaining < quantum) ? p[idx].remaining : quantum;
        gantt[gcount++] = (GanttEntry){p[idx].pid, time, time + exec_time};
        p[idx].remaining -= exec_time;
        time += exec_time;
        // During execution, new processes may arrive; enqueue them
        for (int i=0;i<n;i++) if (p[i].arrival <= time && !inqueue[i] && p[i].remaining>0) { queue[qtail++] = i; inqueue[i]=1; }
        if (p[idx].remaining > 0) {
            // re-enqueue current process at tail
            queue[qtail++] = idx;
        } else {
            // finished
            p[idx].completion = time;
            p[idx].turnaround = p[idx].completion - p[idx].arrival;
            p[idx].waiting = p[idx].turnaround - p[idx].burst;
            completed++;
        }
    }

    Proc out[MAXP]; for (int i=0;i<n;i++) out[i]=p[i];
    for (int i=0;i<n-1;i++) for (int j=i+1;j<n;j++) if (out[i].pid > out[j].pid) { Proc tmp=out[i]; out[i]=out[j]; out[j]=tmp; }
    print_results(out, n, gantt, gcount, "Round Robin");
}

/* Input helper and driver */
int main(void) {
    int n;
    printf("CPU Scheduling Simulator (C)\n");
    printf("Enter number of processes: ");
    if (scanf("%d", &n) != 1 || n <= 0 || n > MAXP) { printf("Invalid number\n"); return 0; }

    Proc procs[MAXP];
    for (int i=0;i<n;i++) {
        procs[i].pid = i+1;
    }
    printf("Enter arrival time, burst time and priority for each process (space separated)\n");
    printf("(priority: lower number = higher priority). Example: \"0 5 2\" means arrival=0, burst=5, priority=2\n");
    for (int i=0;i<n;i++) {
        int a,b,pr;
        scanf("%d %d %d", &a, &b, &pr);
        procs[i].arrival = a;
        procs[i].burst = b;
        procs[i].burst_orig = b;
        procs[i].priority = pr;
    }

    int choice;
    printf("\nChoose algorithm:\n1. FCFS\n2. SJF (non-preemptive)\n3. Priority (non-preemptive)\n4. SRTF (preemptive)\n5. Round Robin\n6. Run all\nEnter choice: ");
    scanf("%d", &choice);

    int quantum = 1;
    if (choice == 5) {
        printf("Enter time quantum: ");
        scanf("%d", &quantum);
        if (quantum <= 0) quantum = 1;
    }

    switch(choice) {
        case 1: fcfs(procs, n); break;
        case 2: sjf(procs, n); break;
        case 3: priority_np(procs, n); break;
        case 4: srtf(procs, n); break;
        case 5: round_robin(procs, n, quantum); break;
        case 6:
            fcfs(procs, n);
            sjf(procs, n);
            priority_np(procs, n);
            srtf(procs, n);
            printf("\nRound Robin requires a quantum. Enter quantum for RR: ");
            scanf("%d", &quantum);
            if (quantum <= 0) quantum = 1;
            round_robin(procs, n, quantum);
            break;
        default: printf("Invalid choice\n"); break;
    }

    return 0;
}
