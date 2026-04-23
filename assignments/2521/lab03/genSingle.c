#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    if (argc != 2) {
        return 0;
    }
    int MAX_INT = atoi(argv[1]);
    for (int i = 0; i < MAX_INT; i++ ) {
        printf("42\n");
    }
    return 0;
}