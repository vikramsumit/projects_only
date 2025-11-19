#include <bits/stdc++.h>
using namespace std;
struct P
{
    int pid, arrival, burst, rem, comp, tat, wt;
    bool done, inQ;
};
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cout << "Enter number of processes: ";
    if (!(cin >> n))
        return 0;
    vector<P> v(n);
    for (int i = 0; i < n; ++i)
    {
        cout << "Process " << i + 1 << ": Enter PID Arrival Burst: ";
        cin >> v[i].pid >> v[i].arrival >> v[i].burst;
        v[i].rem = v[i].burst;
        v[i].done = v[i].inQ = false;
    }
    int q;
    cout << "Enter time quantum: ";
    cin >> q;
    q = max(1, q);
    queue<int> Q;
    int time = INT_MAX;
    for (auto &x : v)
        time = min(time, x.arrival);
    if (time == INT_MAX)
        time = 0;
    for (int i = 0; i < n; ++i)
        if (v[i].arrival <= time)
        {
            Q.push(i);
            v[i].inQ = true;
        }
    int completed = 0;
    double totWT = 0, totTAT = 0;
    while (completed < n)
    {
        if (Q.empty())
        {
            int nxt = INT_MAX, idx = -1;
            for (int i = 0; i < n; ++i)
                if (!v[i].done && v[i].arrival > time && v[i].arrival < nxt)
                    nxt = v[i].arrival, idx = i;
            if (idx == -1)
                break;
            time = nxt;
            for (int i = 0; i < n; ++i)
                if (!v[i].inQ && !v[i].done && v[i].arrival <= time)
                    Q.push(i), v[i].inQ = true;
            continue;
        }
        int i = Q.front();
        Q.pop();
        int exec = min(v[i].rem, q);
        time += exec;
        v[i].rem -= exec;
        for (int j = 0; j < n; ++j)
            if (!v[j].inQ && !v[j].done && v[j].arrival <= time)
            {
                Q.push(j);
                v[j].inQ = true;
            }
        if (v[i].rem == 0)
        {
            v[i].done = true;
            v[i].comp = time;
            v[i].tat = v[i].comp - v[i].arrival;
            v[i].wt = v[i].tat - v[i].burst;
            totWT += v[i].wt;
            totTAT += v[i].tat;
            ++completed;
        }
        else
            Q.push(i);
    }
    cout << "\nPID\tArrival\tBurst\tCompletion\tTAT\tWaiting\n";
    for (auto &p : v)
    {
        if (!p.done)
        {
            p.comp = p.arrival;
            p.tat = p.wt = 0;
        }
        cout << p.pid << '\t' << p.arrival << '\t' << p.burst << '\t' << p.comp << '\t' << p.tat << '\t' << p.wt << "\n";
    }
    cout << "\nAverage Turnaround Time = " << (n ? totTAT / n : 0) << "\nAverage Waiting Time = " << (n ? totWT / n : 0) << "\n";
    return 0;
}
