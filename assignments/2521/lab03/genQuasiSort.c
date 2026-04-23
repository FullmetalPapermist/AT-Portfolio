#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    if (argc != 2) {
        return 0;
    }
    int MAX_INT = atoi(argv[1]);
    printf("%d\n", MAX_INT - 1);
    for (int i = 1; i < MAX_INT - 1; i++ ) {
        printf("%d\n", i);
    }
    printf("0\n");
    return 0;
}