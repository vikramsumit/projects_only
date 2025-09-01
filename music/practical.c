#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    pid_t pid;

    printf("Parent process started. PID = %d\n", getpid());

    pid = fork();

    if (pid < 0) {
        perror("fork failed");
        exit(1);
    } 
    else if (pid == 0) {
        printf("Child process created. PID = %d, Parent PID = %d\n", getpid(), getppid());

        printf("Child executing 'ls -l' using exec...\n");
        execl("/bin/ls", "ls", "-l", NULL);

        perror("exec failed");
        exit(1);
    } 
    else {
        printf("Parent waiting for child (PID = %d)...\n", pid);

        int status;
        wait(&status);

        if (WIFEXITED(status)) {
            printf("Child exited normally with status = %d\n", WEXITSTATUS(status));
        } else {
            printf("Child terminated abnormally.\n");
        }

        printf("Parent process ends.\n");
    }

    return 0;
}


// #include <stdio.h>
// #include <stdlib.h>
// #include <unistd.h>
// #include <sys/wait.h>

// int main() {
//     pid_t pid;

//     printf("👉 Parent process started. PID = %d\n", getpid());

//     pid = fork();
//     if (pid < 0) {
//         perror("❌ fork failed");
//         exit(1);
//     } 
//     else if (pid == 0) {
//         printf("🧒 Child created! My PID = %d, My Parent PID = %d\n", getpid(), getppid());

//         printf("🧒 Child running 'ls -l'...\n");
//         execl("/bin/ls", "ls", "-l", NULL);

//         perror("❌ exec failed");
//         exit(1);
//     } 
//     else {
//         printf("👨 Parent waiting for child (PID = %d)...\n", pid);

//         int status;
//         wait(&status);
//         if (WIFEXITED(status)) {
//             printf("👨 Child finished with exit code = %d\n", WEXITSTATUS(status));
//         } else {
//             printf("👨 Child ended abnormally.\n");
//         }

//         printf("👨 Parent process ends.\n");
//     }

//     return 0;
// }
