// Alexander Tan (z5477240) 8/4/24
// Implementation of the Wall ADT

#include <assert.h>
#include <math.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#include "Wall.h"

struct wall {
    int height;
    int width;
    int rockNum;
    int *array;
};

static int compareRocks(const void *ptr1, const void *ptr2);

/**
 * Creates a new blank wall with the given dimensions
 */
Wall WallNew(int height, int width) {
    struct wall *w = malloc(sizeof(struct wall));
    Colour *array = malloc(sizeof(Colour) * height * width); 
    if (w == NULL) { 
		fprintf(stderr, "couldn't allocate Wall\n");
		exit(EXIT_FAILURE);
    }

    for (int row = 0; row < height; row++) {
        for (int col = 0; col < width; col++) {
            array[(row * width) + col] = NONE;
        }
    }

    w->height = height;
    w->width = width;
    w->rockNum = 0;
    w->array = array;

    return w;
}

/**
 * Frees all memory allocated to the wall 
 */
void WallFree(Wall w) {
    free(w->array);
    free(w);
}

/**
 * Returns the height of the wall
 */
int WallHeight(Wall w) {
    return w->height;
}

/**
 * Returns the width of the wall
 */
int WallWidth(Wall w) {
    return w->width;
}

/**
 * Adds a rock to the wall
 * If there is already a rock at the given coordinates, replaces it
 */
void WallAddRock(Wall w, struct rock rock) {
    if ((w->array)[(rock.row * w->width) + rock.col] == NONE) {    
        w->rockNum++;
    }
    (w->array)[(rock.row * w->width) + rock.col] = rock.colour;
}

/**
 * Returns the number of rocks on the wall
 */
int WallNumRocks(Wall w) {
    return w->rockNum;
}

/**
 * Returns the colour of the rock at the given coordinates, or NONE if
 * there is no rock at those coordinates.
 */
Colour WallGetRockColour(Wall w, int row, int col) {
    return w->array[(row * w->width) + col];
}

/**
 * Adds a rock to a rockStruct
*/
static int addRock(
    struct rock *rockStruct, 
    int row, 
    int col, 
    int colour) {
    if (colour == NONE) {
        return 0;
    }
    rockStruct->row = row;
    rockStruct->col = col;
    rockStruct->colour = colour;
    return 1;
}

/**
 * Stores all rocks on the wall in the given `rocks` array and returns
 * the number of rocks stored. Assumes that the array is at least as
 * large as the number of rocks on the wall. 
 */
int WallGetAllRocks(Wall w, struct rock rocks[]) {
    int rockCount = 0;
    for (int row = 0; row < w->height; row++) {
        for (int col = 0; col < w->width; col++) {
            if (w->array[(row * w->width) + col] != NONE) {
                rockCount += addRock(
                    &rocks[rockCount], 
                    row, 
                    col, 
                    w->array[(row * w->width) + col]);
            }
        }
    }
    return rockCount;
}

/**
 * Gets the lowest index to check 
*/
static int minLimit(int pos, int dist) {
    if (pos < dist) {
        return 0;
    }
    else {
        return pos - dist;
    }

}

/**
 * Gets the largest index to check
*/
static int maxLimit(int pos, int dist, int limit) {
    if (limit <= pos + dist) {
        return limit - 1;
    } else {
        return pos + dist;
    }
}

/**
 * Gets the distance between 2 points
*/
static int getDistance(int r1, int c1, int r2, int c2) {
    int rSqr = r1 - r2;
    rSqr *= rSqr;

    int cSqr = c1 - c2;
    cSqr *= cSqr;

    double dist = sqrt(rSqr + cSqr);
    return ceil(dist);
}

/**
 * Stores all rocks that are within a distance of `dist` from the given
 * coordinates in the given `rocks` array and returns the number of rocks
 * stored. Assumes that the array is at least as large as the number of
 * rocks on the wall.
 */
int WallGetRocksInRange(Wall w, int row, int col, int dist,
                        struct rock rocks[]) {
    
    int rockCount = 0;
    for (int r = minLimit(row, dist); r <= maxLimit(row, dist, w->height); r++) {
        for (int c = minLimit(col, dist); c <= maxLimit(col, dist, w->width); c++) {
            
            // Checks for rock whether it is in within the distance
            if (
                getDistance(row, col, r, c) <= dist &&
                w->array[(r * w->width) + c] != NONE) {

                rockCount += addRock(
                    &rocks[rockCount], 
                    r, 
                    c, 
                    w->array[(r * w->width) + c]);
            }
        }
    }
    return rockCount;
}

/**
 * Stores all rocks with the colour `colour` that are within a distance
 * of `dist` from the given coordinates in the given `rocks` array and
 * returns the number of rocks stored. Assumes that the array is at
 * least as large as the number of rocks on the wall.
 */
int WallGetColouredRocksInRange(Wall w, int row, int col, int dist,
                                Colour colour, struct rock rocks[]) {
    int rockCount = 0;
    for (int r = minLimit(row, dist); r <= maxLimit(row, dist, w->height); r++) {
        for (int c = minLimit(col, dist); c <= maxLimit(col, dist, w->width); c++) {
            
            // Checks for rock whether it is in within the distance
            if (
                getDistance(row, col, r, c) <= dist &&
                w->array[(r * w->width) + c] == colour) {

                rockCount += addRock(
                    &rocks[rockCount], 
                    r, 
                    c, 
                    w->array[(r * w->width) + c]);
            }
        }
    }
    return rockCount;

}

////////////////////////////////////////////////////////////////////////

/**
 * Prints the wall out in a nice format
 * NOTE: DO NOT MODIFY THIS FUNCTION! This function will work once
 *       WallGetAllRocks and all the functions above it work.
 */
void WallPrint(Wall w) {
    int height = WallHeight(w);
    int width = WallWidth(w);
    int numRocks = WallNumRocks(w);
    struct rock *rocks = malloc(numRocks * sizeof(struct rock));
    WallGetAllRocks(w, rocks);
    qsort(rocks, numRocks, sizeof(struct rock), compareRocks);

    int i = 0;
    for (int y = height; y >= 0; y--) {
        for (int x = 0; x <= width; x++) {
            if ((y == 0 || y == height) && (x == 0 || x % 5 == 0)) {
                printf("+ ");
            } else if ((x == 0 || x == width) && (y == 0 || y % 5 == 0)) {
                printf("+ ");
            } else if (y == 0 || y == height) {
                printf("- ");
            } else if (x == 0 || x == width) {
                printf("| ");
            } else if (i < numRocks && y == rocks[i].row && x == rocks[i].col) {
                char *color;
                switch (rocks[i].colour) {
                    case GREEN: color = "\x1B[32m"; break;
                    case TEAL:  color = "\x1B[96m"; break;
                    case PINK:  color = "\x1B[95m"; break;
                    case RED:   color = "\x1B[91m"; break;
                    default:    color = "\x1B[0m";  break;
                }
                printf("%so %s", color, RESET);
                i++;
            } else {
                printf("\u00B7 ");
            }
        }
        printf("\n");
    }

    free(rocks);
}

static int compareRocks(const void *ptr1, const void *ptr2) {
    struct rock *r1 = (struct rock *)ptr1;
    struct rock *r2 = (struct rock *)ptr2;
    if (r1->row != r2->row) {
        return r2->row - r1->row;
    } else {
        return r1->col - r2->col;
    }
}

