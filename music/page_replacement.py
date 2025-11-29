#!/usr/bin/env python3
"""
page_replacement.py
Simulates and visualizes page replacement algorithms: FIFO, LRU, Optimal.

Usage:
  - Run the script and follow prompts.
  - Or modify the example usage at bottom.

Outputs a step-by-step memory table and a colored console visualization:
  - Green = Hit
  - Red = Page fault (inserted)
  - Yellow = The frame that was replaced

Note: ANSI color codes are used for terminal visualization.
"""

from collections import deque
import copy
import math

# ANSI color codes for terminal highlighting (works on most UNIX terminals)
CLR_RESET = "\033[0m"
CLR_GREEN = "\033[92m"
CLR_RED = "\033[91m"
CLR_YELLOW = "\033[93m"
CLR_BOLD = "\033[1m"

def simulate_fifo(refs, frames_count):
    frames = [-1] * frames_count
    q = deque()
    timeline = []  # list of dicts: {'page':p, 'frames':[], 'fault':bool, 'replaced_index':int or None}
    for i, p in enumerate(refs):
        if p in frames:
            timeline.append({'page': p, 'frames': frames.copy(), 'fault': False, 'replaced_index': None})
            continue
        # page fault:
        if -1 in frames:
            idx = frames.index(-1)
            frames[idx] = p
            q.append(idx)
            timeline.append({'page': p, 'frames': frames.copy(), 'fault': True, 'replaced_index': idx})
        else:
            # replace FIFO
            idx = q.popleft()
            frames[idx] = p
            q.append(idx)
            timeline.append({'page': p, 'frames': frames.copy(), 'fault': True, 'replaced_index': idx})
    faults = sum(1 for t in timeline if t['fault'])
    return timeline, faults

def simulate_lru(refs, frames_count):
    frames = [-1] * frames_count
    last_used = dict()  # page -> last index used
    timeline = []
    for i, p in enumerate(refs):
        if p in frames:
            last_used[p] = i
            timeline.append({'page': p, 'frames': frames.copy(), 'fault': False, 'replaced_index': None})
            continue
        # fault
        if -1 in frames:
            idx = frames.index(-1)
            frames[idx] = p
            last_used[p] = i
            timeline.append({'page': p, 'frames': frames.copy(), 'fault': True, 'replaced_index': idx})
        else:
            # evict least recently used page
            # find page in frames with smallest last_used value
            lrupage = None
            lru_time = math.inf
            for page in frames:
                t = last_used.get(page, -1)
                if t < lru_time:
                    lru_time = t
                    lrupage = page
            idx = frames.index(lrupage)
            # replace
            del last_used[lrupage]
            frames[idx] = p
            last_used[p] = i
            timeline.append({'page': p, 'frames': frames.copy(), 'fault': True, 'replaced_index': idx})
    faults = sum(1 for t in timeline if t['fault'])
    return timeline, faults

def simulate_optimal(refs, frames_count):
    frames = [-1] * frames_count
    timeline = []
    n = len(refs)
    for i, p in enumerate(refs):
        if p in frames:
            timeline.append({'page': p, 'frames': frames.copy(), 'fault': False, 'replaced_index': None})
            continue
        if -1 in frames:
            idx = frames.index(-1)
            frames[idx] = p
            timeline.append({'page': p, 'frames': frames.copy(), 'fault': True, 'replaced_index': idx})
        else:
            # lookahead to find which page won't be used for the longest time
            future_indices = {}
            for page in frames:
                found = None
                for j in range(i+1, n):
                    if refs[j] == page:
                        found = j
                        break
                future_indices[page] = found if found is not None else math.inf
            # choose page with max future index
            victim = max(future_indices, key=lambda pg: future_indices[pg])
            idx = frames.index(victim)
            frames[idx] = p
            timeline.append({'page': p, 'frames': frames.copy(), 'fault': True, 'replaced_index': idx})
    faults = sum(1 for t in timeline if t['fault'])
    return timeline, faults

def print_timeline(timeline, frames_count, refs):
    # Header
    print("\nTimeline (columns = steps):")
    header = "Step | Page | " + " | ".join(f"F{i}" for i in range(frames_count)) + " | Fault | Replaced"
    print(header)
    print("-" * len(header))
    for step, entry in enumerate(timeline):
        p = entry['page']
        frames = entry['frames']
        fault = entry['fault']
        ridx = entry['replaced_index']
        frames_str = []
        for fi, val in enumerate(frames):
            cell = str(val) if val != -1 else "."
            if fault and ridx == fi:
                # replaced frame
                cell = f"{CLR_YELLOW}{cell}{CLR_RESET}"
            frames_str.append(cell)
        fault_str = f"{CLR_RED}FAULT{CLR_RESET}" if fault else f"{CLR_GREEN}HIT{CLR_RESET}"
        replaced = str(ridx) if ridx is not None else "-"
        print(f"{step:>4} | {p:>4} | " + " | ".join(f"{c:>3}" for c in frames_str) + f" | {fault_str:>5} | {replaced:>7}")

def run_interactive():
    print("Page Replacement Visualizer (FIFO, LRU, Optimal)\n")
    s = input("Enter page reference string (space or comma separated, e.g. 7 0 1 2 0 3 0 4):\n> ").replace(',', ' ')
    refs = [int(x) for x in s.split() if x.strip() != ""]
    frames_count = int(input("Enter number of frames (e.g. 3):\n> ").strip())

    print("\nSimulating FIFO ...")
    t_fifo, f_fifo = simulate_fifo(refs, frames_count)
    print_timeline(t_fifo, frames_count, refs)
    print(f"\nTotal page faults (FIFO): {f_fifo} / {len(refs)} ({f_fifo/len(refs):.2%})")

    print("\nSimulating LRU ...")
    t_lru, f_lru = simulate_lru(refs, frames_count)
    print_timeline(t_lru, frames_count, refs)
    print(f"\nTotal page faults (LRU): {f_lru} / {len(refs)} ({f_lru/len(refs):.2%})")

    print("\nSimulating Optimal ...")
    t_opt, f_opt = simulate_optimal(refs, frames_count)
    print_timeline(t_opt, frames_count, refs)
    print(f"\nTotal page faults (Optimal): {f_opt} / {len(refs)} ({f_opt/len(refs):.2%})")

if __name__ == "__main__":
    # Example quick test (uncomment to run with the example without interactive input)
    # refs = [7,0,1,2,0,3,0,4,2,3,0,3,2]
    # frames_count = 3
    # t_fifo, f_fifo = simulate_fifo(refs, frames_count)
    # print_timeline(t_fifo, frames_count, refs)
    # print("Faults FIFO:", f_fifo)
    # To use interactive mode:
    run_interactive()
