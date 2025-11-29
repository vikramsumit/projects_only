#include <stdio.h>
#include <stdlib.h>

void allocate_first_fit(int blocks[], int nBlocks,
                        int processes[], int nProcs,
                        int allocation[]) {
    int i, j;
    int *block_allocated = (int *)calloc(nBlocks, sizeof(int));

    for (i = 0; i < nProcs; i++) {
        allocation[i] = -1;
        for (j = 0; j < nBlocks; j++) {
            if (!block_allocated[j] && blocks[j] >= processes[i]) {
                allocation[i] = j;
                block_allocated[j] = 1;
                break;
            }
        }
    }
    free(block_allocated);
}

void allocate_best_fit(int blocks[], int nBlocks,
                       int processes[], int nProcs,
                       int allocation[]) {
    int i, j;
    int *block_allocated = (int *)calloc(nBlocks, sizeof(int));
    for (i = 0; i < nProcs; i++) {
        int best_idx = -1;
        int best_diff = -1;
        allocation[i] = -1;

        for (j = 0; j < nBlocks; j++) {
            if (!block_allocated[j] && blocks[j] >= processes[i]) {
                int diff = blocks[j] - processes[i];
                if (best_idx == -1 || diff < best_diff) {
                    best_diff = diff;
                    best_idx = j;
                }
            }
        }
        if (best_idx != -1) {
            allocation[i] = best_idx;
            block_allocated[best_idx] = 1;
        }
    }
    free(block_allocated);
}

void allocate_worst_fit(int blocks[], int nBlocks,
                        int processes[], int nProcs,
                        int allocation[]) {
    int i, j;
    int *block_allocated = (int *)calloc(nBlocks, sizeof(int));
    for (i = 0; i < nProcs; i++) {
        int worst_idx = -1;
        int worst_size = -1;
        allocation[i] = -1;

        for (j = 0; j < nBlocks; j++) {
            if (!block_allocated[j] && blocks[j] >= processes[i]) {
                if (blocks[j] > worst_size) {
                    worst_size = blocks[j];
                    worst_idx = j;
                }
            }
        }
        if (worst_idx != -1) {
            allocation[i] = worst_idx;
            block_allocated[worst_idx] = 1;
        }
    }
    free(block_allocated);
}

void print_allocation(const char *title,
                      int blocks[], int nBlocks,
                      int processes[], int nProcs,
                      int allocation[]) {
    int i;
    int total_frag = 0;

    printf("\n=== %s ===\n", title);
    printf("Process | Size | Block# | BlockSize | InternalFrag\n");
    printf("--------------------------------------------------\n");

    for (i = 0; i < nProcs; i++) {
        int psize = processes[i];
        int bidx = allocation[i];

        if (bidx == -1) {
            printf("%7d | %4d |   -   |    -      |     -\n", i, psize);
        } else {
            int frag = blocks[bidx] - psize;
            total_frag += frag;
            printf("%7d | %4d | %5d | %9d | %10d\n",
                   i, psize, bidx, blocks[bidx], frag);
        }
    }
    printf("--------------------------------------------------\n");
    printf("Total internal fragmentation: %d\n", total_frag);
    int *used = (int *)calloc(nBlocks, sizeof(int));
    for (i = 0; i < nProcs; i++) {
        if (allocation[i] != -1)
            used[allocation[i]] = 1;
    }
    printf("Free blocks (index:size): ");
    int any = 0;
    for (i = 0; i < nBlocks; i++) {
        if (!used[i]) {
            printf("%d:%d ", i, blocks[i]);
            any = 1;
        }
    }
    if (!any) printf("none");
    printf("\n");
    free(used);
}

int main(void) {
    int nBlocks, nProcs, i;

    printf("Memory Allocation Simulator (First/Best/Worst Fit)\n");

    printf("Enter number of memory blocks: ");
    scanf("%d", &nBlocks);
    int *blocks = (int *)malloc(nBlocks * sizeof(int));
    printf("Enter sizes of %d blocks:\n", nBlocks);
    for (i = 0; i < nBlocks; i++)
        scanf("%d", &blocks[i]);

    printf("Enter number of processes: ");
    scanf("%d", &nProcs);
    int *processes = (int *)malloc(nProcs * sizeof(int));
    printf("Enter sizes of %d processes:\n", nProcs);
    for (i = 0; i < nProcs; i++)
        scanf("%d", &processes[i]);

    int *alloc_ff = (int *)malloc(nProcs * sizeof(int));
    int *alloc_bf = (int *)malloc(nProcs * sizeof(int));
    int *alloc_wf = (int *)malloc(nProcs * sizeof(int));

    allocate_first_fit(blocks, nBlocks, processes, nProcs, alloc_ff);
    allocate_best_fit(blocks, nBlocks, processes, nProcs, alloc_bf);
    allocate_worst_fit(blocks, nBlocks, processes, nProcs, alloc_wf);

    print_allocation("First-Fit", blocks, nBlocks, processes, nProcs, alloc_ff);
    print_allocation("Best-Fit",  blocks, nBlocks, processes, nProcs, alloc_bf);
    print_allocation("Worst-Fit", blocks, nBlocks, processes, nProcs, alloc_wf);

    free(blocks);
    free(processes);
    free(alloc_ff);
    free(alloc_bf);
    free(alloc_wf);

    return 0;
}

// ================== PAGE REPLACEMENT SIMULATOR ==================

#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

#define CLR_RESET  "\x1b[0m"
#define CLR_GREEN  "\x1b[32m"
#define CLR_RED    "\x1b[31m"
#define CLR_YELLOW "\x1b[33m"

void print_row(int step, int page, int frames[], int frames_count,
               int fault, int replaced_index) {
    int i;
    printf("%4d\t%4d\t", step, page);
    for (i = 0; i < frames_count; i++) {
        if (frames[i] == -1) {
            printf(" . \t");
        } else {
            if (fault && i == replaced_index) {
                printf("%s%2d%s\t", CLR_YELLOW, frames[i], CLR_RESET);
            } else {
                printf("%2d\t", frames[i]);
            }
        }
    }
    if (fault) {
        printf("%sFAULT%s\t", CLR_RED, CLR_RESET);
        if (replaced_index >= 0)
            printf("%d", replaced_index);
        else
            printf("-");
    } else {
        printf("%sHIT%s\t-", CLR_GREEN, CLR_RESET);
    }
    printf("\n");
}

int simulate_fifo(int refs[], int n, int frames_count) {
    int *frames = (int *)malloc(frames_count * sizeof(int));
    int i, j;
    int faults = 0;
    int next_replace = 0;

    for (i = 0; i < frames_count; i++)
        frames[i] = -1;

    printf("\n=== FIFO Page Replacement ===\n");
    printf("Step\tPage\t");
    for (i = 0; i < frames_count; i++)
        printf("F%d\t", i);
    printf("Status\tReplIdx\n");
    printf("-----------------------------------------------\n");

    for (i = 0; i < n; i++) {
        int page = refs[i];
        int hit = 0;
        int fault = 0;
        int replaced_index = -1;

        for (j = 0; j < frames_count; j++) {
            if (frames[j] == page) {
                hit = 1;
                break;
            }
        }

        if (!hit) {
            faults++;
            fault = 1;
            int free_idx = -1;
            for (j = 0; j < frames_count; j++) {
                if (frames[j] == -1) {
                    free_idx = j;
                    break;
                }
            }
            if (free_idx != -1) {
                frames[free_idx] = page;
                replaced_index = free_idx;
            } else {
                frames[next_replace] = page;
                replaced_index = next_replace;
                next_replace = (next_replace + 1) % frames_count;
            }
        }

        print_row(i, page, frames, frames_count, fault, replaced_index);
    }

    printf("\nTotal page faults (FIFO): %d / %d = %.2f%%\n",
           faults, n, 100.0 * faults / n);
    free(frames);
    return faults;
}

int simulate_lru(int refs[], int n, int frames_count) {
    int *frames = (int *)malloc(frames_count * sizeof(int));
    int *last_used = (int *)malloc(frames_count * sizeof(int));
    int i, j;
    int faults = 0;

    for (i = 0; i < frames_count; i++) {
        frames[i] = -1;
        last_used[i] = -1;
    }

    printf("\n=== LRU Page Replacement ===\n");
    printf("Step\tPage\t");
    for (i = 0; i < frames_count; i++)
        printf("F%d\t", i);
    printf("Status\tReplIdx\n");
    printf("-----------------------------------------------\n");

    for (i = 0; i < n; i++) {
        int page = refs[i];
        int hit = 0;
        int fault = 0;
        int replaced_index = -1;

        for (j = 0; j < frames_count; j++) {
            if (frames[j] == page) {
                hit = 1;
                last_used[j] = i;
                break;
            }
        }

        if (!hit) {
            faults++;
            fault = 1;
            int free_idx = -1;
            for (j = 0; j < frames_count; j++) {
                if (frames[j] == -1) {
                    free_idx = j;
                    break;
                }
            }
            if (free_idx != -1) {
                frames[free_idx] = page;
                last_used[free_idx] = i;
                replaced_index = free_idx;
            } else {
                int lru_index = 0;
                int lru_time = last_used[0];
                for (j = 1; j < frames_count; j++) {
                    if (last_used[j] < lru_time) {
                        lru_time = last_used[j];
                        lru_index = j;
                    }
                }
                frames[lru_index] = page;
                last_used[lru_index] = i;
                replaced_index = lru_index;
            }
        }

        print_row(i, page, frames, frames_count, fault, replaced_index);
    }

    printf("\nTotal page faults (LRU): %d / %d = %.2f%%\n",
           faults, n, 100.0 * faults / n);
    free(frames);
    free(last_used);
    return faults;
}

int simulate_optimal(int refs[], int n, int frames_count) {
    int *frames = (int *)malloc(frames_count * sizeof(int));
    int i, j;
    int faults = 0;

    for (i = 0; i < frames_count; i++)
        frames[i] = -1;

    printf("\n=== Optimal Page Replacement ===\n");
    printf("Step\tPage\t");
    for (i = 0; i < frames_count; i++)
        printf("F%d\t", i);
    printf("Status\tReplIdx\n");
    printf("-----------------------------------------------\n");

    for (i = 0; i < n; i++) {
        int page = refs[i];
        int hit = 0;
        int fault = 0;
        int replaced_index = -1;

        for (j = 0; j < frames_count; j++) {
            if (frames[j] == page) {
                hit = 1;
                break;
            }
        }

        if (!hit) {
            faults++;
            fault = 1;
            int free_idx = -1;
            for (j = 0; j < frames_count; j++) {
                if (frames[j] == -1) {
                    free_idx = j;
                    break;
                }
            }
            if (free_idx != -1) {
                frames[free_idx] = page;
                replaced_index = free_idx;
            } else {
                int victim_index = -1;
                int farthest = -1;
                int k;
                for (j = 0; j < frames_count; j++) {
                    int current_page = frames[j];
                    int next_use = INT_MAX;
                    for (k = i + 1; k < n; k++) {
                        if (refs[k] == current_page) {
                            next_use = k;
                            break;
                        }
                    }
                    if (next_use > farthest) {
                        farthest = next_use;
                        victim_index = j;
                    }
                }
                frames[victim_index] = page;
                replaced_index = victim_index;
            }
        }

        print_row(i, page, frames, frames_count, fault, replaced_index);
    }

    printf("\nTotal page faults (Optimal): %d / %d = %.2f%%\n",
           faults, n, 100.0 * faults / n);
    free(frames);
    return faults;
}

int main(void) {
    int n, frames_count, i, choice;

    printf("Page Replacement Simulator (C)\n");
    printf("Enter number of page references: ");
    scanf("%d", &n);

    int *refs = (int *)malloc(n * sizeof(int));
    printf("Enter the page reference string (space separated):\n");
    for (i = 0; i < n; i++)
        scanf("%d", &refs[i]);

    printf("Enter number of frames: ");
    scanf("%d", &frames_count);

    printf("\nChoose algorithm:\n");
    printf("1. FIFO\n2. LRU\n3. Optimal\n4. Run all\n");
    printf("Enter choice: ");
    scanf("%d", &choice);

    switch (choice) {
        case 1:
            simulate_fifo(refs, n, frames_count);
            break;
        case 2:
            simulate_lru(refs, n, frames_count);
            break;
        case 3:
            simulate_optimal(refs, n, frames_count);
            break;
        case 4:
            simulate_fifo(refs, n, frames_count);
            simulate_lru(refs, n, frames_count);
            simulate_optimal(refs, n, frames_count);
            break;
        default:
            printf("Invalid choice.\n");
    }

    free(refs);
    return 0;
}