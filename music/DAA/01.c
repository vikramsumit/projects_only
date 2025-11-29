/* file: errors_demo.c
   Compile with: gcc -std=c99 errors_demo.c -o errors_demo
   Uncomment lines to observe various errors.
*/
#include <stdio.h>
#include <stdlib.h>

int missing_function(); // forward declaration (linker error if not defined)

int main(void) {
    printf("1) Syntax/compile-time error example (commented):\n");
    // int x = ; // <-- syntax error: uncomment to see

    printf("2) Type error example (compile-time warnings/errors):\n");
    // int a = "hello"; // <- type mismatch (uncomment to see)

    printf("3) Linker error example (commented):\n");
    // missing_function(); // <- will cause linker error if missing_function not defined

    printf("4) Runtime error example (divide by zero) - commented by default:\n");
    int x = 10, y = 0;
    // printf("Divide: %d\n", x / y); // <- runtime crash (SIGFPE) if uncommented

    printf("5) Null pointer deref (runtime) - commented by default:\n");
    int *p = NULL;
    // printf("%d\n", *p);

    printf("6) Logical error example:\n");
    int n = 5;
    // Suppose we want factorial but implement incorrectly:
    int fact = 1;
    for (int i = 1; i < n; ++i) { // <-- should be i <= n
        fact *= i;
    }
    printf("Incorrect factorial of %d computed as %d (logical error)\n", n, fact);

    printf("7) Correct factorial for comparison:\n");
    fact = 1;
    for (int i = 1; i <= n; ++i) fact *= i;
    printf("Correct factorial of %d is %d\n", n, fact);

    return 0;
}

/* To see linker error, remove/comment the prototype and uncomment call to missing_function() without providing definition.
   To see runtime crashes, uncomment the divide-by-zero or null dereference lines.
*/
