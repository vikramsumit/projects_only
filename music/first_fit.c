/**
 * First Fit Memory Allocation Simulator
 * 
 * This program simulates memory allocation using the First Fit algorithm.
 * In First Fit, the memory allocator searches for the first available block
 * that is large enough to accommodate the process and allocates it there.
 * 
 * Algorithm:
 * 1. For each process in order, scan memory blocks from the beginning
 * 2. Find the first block that is free and has sufficient size
 * 3. Allocate the process to that block
 * 4. If no suitable block is found, the process cannot be allocated
 */

#include <stdio.h>
#include <stdlib.h>

/* Structure to represent a memory block */
typedef struct {
    int block_id;      // Unique identifier for the block
    int size;          // Total size of the block
    int is_allocated;  // 1 if allocated, 0 if free
    int allocated_pid; // Process ID allocated to this block (-1 if free)
} MemoryBlock;

/* Structure to represent a process */
typedef struct {
    int process_id;    // Unique identifier for the process
    int size;          // Memory size required by the process
    int allocated_block; // Block ID where process is allocated (-1 if not allocated)
} Process;

/**
 * allocate_first_fit - Allocates memory to processes using First Fit algorithm
 * 
 * @param blocks    : Array of memory blocks
 * @param nBlocks   : Number of memory blocks
 * @param processes : Array of processes to allocate
 * @param nProcs    : Number of processes
 * 
 * The function iterates through each process and finds the first available
 * block that can accommodate it.
 */
void allocate_first_fit(MemoryBlock blocks[], int nBlocks,
                        Process processes[], int nProcs) {
    int i, j;
    
    printf("\n--- First Fit Allocation Process ---\n");
    printf("Allocating processes in order...\n\n");
    
    for (i = 0; i < nProcs; i++) {
        processes[i].allocated_block = -1;  // Initialize as not allocated
        
        printf("Process %d (Size: %d) - ", processes[i].process_id, processes[i].size);
        
        // Scan blocks from the beginning to find first fit
        for (j = 0; j < nBlocks; j++) {
            if (!blocks[j].is_allocated && blocks[j].size >= processes[i].size) {
                // Found a suitable block - allocate it
                blocks[j].is_allocated = 1;
                blocks[j].allocated_pid = processes[i].process_id;
                processes[i].allocated_block = blocks[j].block_id;
                
                printf("Allocated to Block %d (Size: %d, Free Space: %d)\n",
                       blocks[j].block_id, blocks[j].size, 
                       blocks[j].size - processes[i].size);
                break;
            }
        }
        
        if (processes[i].allocated_block == -1) {
            printf("Cannot be allocated - No suitable block found!\n");
        }
    }
}

/**
 * print_memory_state - Displays the current state of memory blocks
 */
void print_memory_state(MemoryBlock blocks[], int nBlocks) {
    int i;
    int total_free = 0;
    
    printf("\n=== Final Memory State ===\n");
    printf("Block# | Size    | Status    | Allocated To | Internal Fragmentation\n");
    printf("-------------------------------------------------------------------\n");
    
    for (i = 0; i < nBlocks; i++) {
        int internal_frag = 0;
        if (blocks[i].is_allocated && blocks[i].allocated_pid != -1) {
            // Find the process allocated to this block
            // For simplicity, we'll show the allocation
        }
        
        printf("%6d | %7d | ", blocks[i].block_id, blocks[i].size);
        
        if (blocks[i].is_allocated) {
            printf("%-10s | %11d | ", "Allocated", blocks[i].allocated_pid);
        } else {
            printf("%-10s | %11s | ", "Free", "-");
            total_free += blocks[i].size;
        }
        
        printf("\n");
    }
    
    printf("-------------------------------------------------------------------\n");
    printf("Total Free Memory: %d\n", total_free);
}

/**
 * print_allocation_summary - Shows allocation results for each process
 */
void print_allocation_summary(Process processes[], int nProcs) {
    int i;
    int allocated_count = 0;
    
    printf("\n=== Process Allocation Summary ===\n");
    printf("Process | Size    | Status    | Block\n");
    printf("-------------------------------------------\n");
    
    for (i = 0; i < nProcs; i++) {
        printf("%7d | %7d | ", processes[i].process_id, processes[i].size);
        
        if (processes[i].allocated_block != -1) {
            printf("Allocated | %5d\n", processes[i].allocated_block);
            allocated_count++;
        } else {
            printf("Rejected  |    -\n");
        }
    }
    
    printf("-------------------------------------------\n");
    printf("Total Processes: %d | Allocated: %d | Rejected: %d\n",
           nProcs, allocated_count, nProcs - allocated_count);
}

/**
 * print_visual_representation - Creates a visual representation of memory
 */
void print_visual_representation(MemoryBlock blocks[], int nBlocks) {
    int i, j;
    
    printf("\n=== Visual Memory Representation ===\n");
    printf("(Each '█' represents 1 unit of memory)\n\n");
    
    for (i = 0; i < nBlocks; i++) {
        printf("Block %d [%4d]: ", blocks[i].block_id, blocks[i].size);
        
        // Print allocated portion or free portion
        if (blocks[i].is_allocated) {
            // Show allocated (could show actual allocation if we track it)
            for (j = 0; j < blocks[i].size; j++) {
                printf("█");
            }
            printf(" [ALLOCATED to P%d]", blocks[i].allocated_pid);
        } else {
            for (j = 0; j < blocks[i].size; j++) {
                printf("░");
            }
            printf(" [FREE]");
        }
        printf("\n");
    }
    printf("\nLegend: █ = Allocated | ░ = Free\n");
}

int main(void) {
    int nBlocks, nProcs, i;
    
    printf("======================================================\n");
    printf("     FIRST FIT MEMORY ALLOCATION SIMULATOR\n");
    printf("======================================================\n\n");
    
    /* Input number of memory blocks */
    printf("Enter number of memory blocks: ");
    scanf("%d", &nBlocks);
    
    /* Allocate memory for blocks */
    MemoryBlock *blocks = (MemoryBlock *)malloc(nBlocks * sizeof(MemoryBlock));
    
    /* Input block sizes */
    printf("\nEnter sizes of %d memory blocks:\n", nBlocks);
    for (i = 0; i < nBlocks; i++) {
        printf("  Block %d size: ", i + 1);
        scanf("%d", &blocks[i].size);
        blocks[i].block_id = i + 1;
        blocks[i].is_allocated = 0;
        blocks[i].allocated_pid = -1;
    }
    
    /* Input number of processes */
    printf("\nEnter number of processes: ");
    scanf("%d", &nProcs);
    
    /* Allocate memory for processes */
    Process *processes = (Process *)malloc(nProcs * sizeof(Process));
    
    /* Input process sizes */
    printf("\nEnter sizes of %d processes:\n", nProcs);
    for (i = 0; i < nProcs; i++) {
        printf("  Process %d size: ", i + 1);
        scanf("%d", &processes[i].size);
        processes[i].process_id = i + 1;
        processes[i].allocated_block = -1;
    }
    
    /* Display initial state */
    printf("\n======================================================\n");
    printf("                    INITIAL STATE\n");
    printf("======================================================\n");
    printf("\nMemory Blocks:\n");
    for (i = 0; i < nBlocks; i++) {
        printf("  Block %d: Size = %d (Free)\n", blocks[i].block_id, blocks[i].size);
    }
    printf("\nProcesses:\n");
    for (i = 0; i < nProcs; i++) {
        printf("  Process %d: Size = %d\n", processes[i].process_id, processes[i].size);
    }
    
    /* Perform First Fit allocation */
    allocate_first_fit(blocks, nBlocks, processes, nProcs);
    
    /* Display results */
    print_memory_state(blocks, nBlocks);
    print_allocation_summary(processes, nProcs);
    print_visual_representation(blocks, nBlocks);
    
    /* Free allocated memory */
    free(blocks);
    free(processes);
    
    printf("\n======================================================\n");
    printf("               SIMULATION COMPLETE\n");
    printf("======================================================\n");
    
    return 0;
}

