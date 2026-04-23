#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    printf("x mod 4 = %d\nx mod 7 = %d\n", atoi(argv[1]) % 4, atoi(argv[1]) % 7);
    return 0;
}