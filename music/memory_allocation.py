"""
memory_allocation.py
Simulates contiguous memory allocation strategies:
 - First-Fit | - Best-Fit | - Worst-Fit

Inputs:
  - blocks: list of block sizes
  - processes: list of process sizes

Output:
  - Table of which process is allocated to which block
  - Internal fragmentation per allocation
  - Blocks left unallocated
"""

def allocate_first_fit(blocks, processes):
    n = len(blocks)
    allocation = [-1] * len(processes)  # -1 means not allocated
    block_allocated = [False] * n
    for pi, ps in enumerate(processes):
        for bi, bs in enumerate(blocks):
            if not block_allocated[bi] and bs >= ps:
                allocation[pi] = bi
                block_allocated[bi] = True
                break
    return allocation

def allocate_best_fit(blocks, processes):
    n = len(blocks)
    allocation = [-1] * len(processes)
    block_allocated = [False] * n
    for pi, ps in enumerate(processes):
        best_idx = -1
        best_diff = None
        for bi, bs in enumerate(blocks):
            if not block_allocated[bi] and bs >= ps:
                diff = bs - ps
                if best_diff is None or diff < best_diff:
                    best_diff = diff
                    best_idx = bi
        if best_idx != -1:
            allocation[pi] = best_idx
            block_allocated[best_idx] = True
    return allocation

def allocate_worst_fit(blocks, processes):
    n = len(blocks)
    allocation = [-1] * len(processes)
    block_allocated = [False] * n
    for pi, ps in enumerate(processes):
        worst_idx = -1
        worst_size = -1
        for bi, bs in enumerate(blocks):
            if not block_allocated[bi] and bs >= ps and bs > worst_size:
                worst_size = bs
                worst_idx = bi
        if worst_idx != -1:
            allocation[pi] = worst_idx
            block_allocated[worst_idx] = True
    return allocation

def print_allocation(blocks, processes, allocation):
    print("Process | Size | Block # | Block Size | Internal Fragmentation")
    print("-" * 60)
    total_frag = 0
    for i, ps in enumerate(processes):
        bidx = allocation[i]
        if bidx == -1:
            print(f"{i:7} | {ps:4} | {'-':7} | {'-':10} | {'-':21}")
        else:
            frag = blocks[bidx] - ps
            total_frag += frag
            print(f"{i:7} | {ps:4} | {bidx:7} | {blocks[bidx]:10} | {frag:21}")
    print("-" * 60)
    print(f"Total internal fragmentation: {total_frag}")
    # free blocks
    allocated_blocks = set([b for b in allocation if b != -1])
    free_blocks = [i for i in range(len(blocks)) if i not in allocated_blocks]
    if free_blocks:
        print("Unallocated blocks (index:size):", ", ".join(f"{i}:{blocks[i]}" for i in free_blocks))
    else:
        print("No free blocks left.")

def run_example():
    
    # Make changes as per your requirement

    blocks = [100, 500, 200, 300, 600]
    processes = [212, 417, 112, 426]
    print("Blocks:", blocks)
    print("Processes:", processes)
    print("\n--- First-Fit ---")
    alloc_ff = allocate_first_fit(blocks, processes)
    print_allocation(blocks, processes, alloc_ff)
    print("\n--- Best-Fit ---")
    alloc_bf = allocate_best_fit(blocks, processes)
    print_allocation(blocks, processes, alloc_bf)
    print("\n--- Worst-Fit ---")
    alloc_wf = allocate_worst_fit(blocks, processes)
    print_allocation(blocks, processes, alloc_wf)

if __name__ == "__main__":
    run_example()
