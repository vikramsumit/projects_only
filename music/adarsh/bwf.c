#include <stdio.h>

int main()
{
    int b, p, i, j;

    printf("Enter number of blocks: ");
    scanf("%d", &b);
    int block[b];

    printf("Enter block sizes:\n");
    for (i = 0; i < b; i++)
        scanf("%d", &block[i]);

    printf("Enter number of processes: ");
    scanf("%d", &p);

    int process[p], allocBF[p], allocWF[p];

    printf("Enter process sizes:\n");
    for (i = 0; i < p; i++)
    {
        scanf("%d", &process[i]);
        allocBF[i] = allocWF[i] = -1;
    }

    int bf[b], wf[b];
    for (i = 0; i < b; i++)
        bf[i] = wf[i] = block[i];

    /* BEST FIT */
    for (i = 0; i < p; i++)
    {
        int best = -1;
        for (j = 0; j < b; j++)
        {
            if (bf[j] >= process[i] &&
               (best == -1 || bf[j] < bf[best]))
            {
                best = j;
            }
        }
        if (best != -1)
        {
            bf[best] -= process[i];
            allocBF[i] = best;
        }
    }

    /* WORST FIT */
    for (i = 0; i < p; i++)
    {
        int worst = -1;
        for (j = 0; j < b; j++)
        {
            if (wf[j] >= process[i] &&
               (worst == -1 || wf[j] > wf[worst]))
            {
                worst = j;
            }
        }
        if (worst != -1)
        {
            wf[worst] -= process[i];
            allocWF[i] = worst;
        }
    }

    printf("\nProcess  BestFit  WorstFit\n");
    for (i = 0; i < p; i++)
    {
        printf("%d\t   %d\t    %d\n",
               i + 1,
               allocBF[i] == -1 ? 0 : allocBF[i] + 1,
               allocWF[i] == -1 ? 0 : allocWF[i] + 1);
    }

    return 0;
}
