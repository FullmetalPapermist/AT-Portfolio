// Alexander Tan (z5477240) 8/4/24
// Implementation of boulder climbing algorithms
// Acknowledgements:
//  - Implementation of a graph ADT
//      Taken from lab08 submission at:
//      https://cgi.cse.unsw.edu.au/~cs2521/24T1/view/main.cgi/tue11-brass/5477240/submission/lab08/1/Graph.c

#include <assert.h>
#include <limits.h>
#include <math.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#include "climber.h"

#include "Wall.h"

// Implementation of a graph ADT
// Taken from lab08 submission at:
// https://cgi.cse.unsw.edu.au/~cs2521/24T1/view/main.cgi/tue11-brass/5477240/submission/lab08/1/Graph.c
#include "Graph.h"
#include "Digraph.h"

#define MIN_ROW 1
#define MIN_COL 1
#define EMPTY_INDEX -1
#define EMPTY_ENERGY -1.0

struct turnPath{
    int *rockPath;
    int pathLength;
    int turns;
    float energyLeft;
};

/**
 * Returns twice the largest dimension 
*/
static int maxRange(int height, int width) {
    if (height > width) {
        return 2 * height;
    } else {
        return 2 * width;
    }
}

// Implementation of a distance function 
// Taken from my lab08 task 2:
// https://cgi.cse.unsw.edu.au/~cs2521/24T1/view/main.cgi/tue11-brass/5477240/submission/lab08/1/planner.c

/**
 * Returns the distance between two places as a float
*/
static float getDistance(struct rock rock1, struct rock rock2) {
    float rowDist = rock1.row - rock2.row;
    rowDist *= rowDist;
    float colDist = rock1.col - rock2.col;
    colDist *= colDist;
    return sqrt(rowDist + colDist);
}

/**
 * Gets all possible starting rocks and puts them into the starts array (assumes
 * that there is at least 1 rock)
*/
static int getStarts( 
    int rockNum,
    struct rock *rocks,
    int reach) {
    
    if (rockNum == 1) {
        return 1;
    }

    int startCount = 0;
    while (startCount != rockNum && rocks[startCount].row <= reach) {
        startCount++;
    }

    return startCount;
}

/**
 * Gets all top rocks and puts them into the ends array (assumes there is
 * at least 1 rock)
*/
static int getEnds(
    int rockNum,
    struct rock *rocks,
    int *ends,
    int reach,
    int height) {

    if (rockNum == 1) {
        ends[0] = 0;
        return 1;
    }

    // Starts from the last rock
    int rockCount = rockNum - 1;
    int endCount = 0;
    while (endCount != rockNum && rocks[rockCount].row + reach >= height) {
        ends[endCount] = rockCount;
        rockCount--;
        endCount++;
    }
    return endCount;
};

/**
 * Adds all possible paths between rocks to the graph
*/
static void addColouredPaths(Graph g, int rockNum, struct rock *rocks, int reach) {
    for (int v = 0; v < rockNum; v++) {
        for (int w = v + 1; w < rockNum; w++) {
            struct edge newEdge;
            newEdge.v = v;
            newEdge.w = w;
            newEdge.weight = 1;
            if (getDistance(rocks[v], rocks[w]) <= reach) {
                GraphInsertEdge(g, newEdge);
            }
        }
    }    
}

/**
 * returns an initialised predecessor array
*/
static int *setupPredArray(int rockNum) {
    int *predArray = malloc(sizeof(int) * rockNum);
    for (int i = 0; i < rockNum; i++) {
        predArray[i] = EMPTY_INDEX;
    }
    return predArray;
}

/**
 * returns an initialised float array
*/
static float *setupFloatArray(int rockNum) {
    float *floatArray = malloc(sizeof(float) * rockNum);
    for (int i = 0; i < rockNum; i++) {
        floatArray[i] = INFINITY;
    }
    return floatArray;

}

/**
 * Returns the end with the shortest path - if there are no ends it will return 
 * end[0]
*/
static int getShortestEnd(int *ends, int endCount, float *floatArray) {
    int end = ends[0];

    for (int i = 0; i < endCount; i++) {
        if (floatArray[ends[i]] < floatArray[end]) {
            end = ends[i];
        }
    }
    return end;
}

/**
 * Helper function for getPathFromPred 
 * Returns the path length to the end and fills out the rock index array in 
 * order
*/
static int doGetPathFromPred(
    int *predArray,
    int start, 
    int end, 
    int *rockIndexes) {

    if (end == start) {
        rockIndexes[0]= start;
        return 1;
    } else {
        int pathLength = doGetPathFromPred(
            predArray, start, predArray[end], rockIndexes);
        rockIndexes[pathLength] = end;
        return pathLength + 1;
    }
}

/**
 * Returns an array of rocks which is the path from an array of indexes
*/
static struct rock *getPathFromIndex(
    struct rock *rocks, int *rockIndexes, int rockNum, int pathLength) {

    struct rock *rockPath = malloc(pathLength * sizeof(struct rock));
    for (int i = 0; i < pathLength; i++) {
        rockPath[i].row = rocks[rockIndexes[i]].row;
        rockPath[i].col = rocks[rockIndexes[i]].col;
        rockPath[i].colour = rocks[rockIndexes[i]].colour; 
    }
    return rockPath;
}

/**
 * gets the path with the shortest path or NULL if there is no path and puts it
 * into p->rocks
*/
static void getPathFromPred(
    int *predArray, 
    int rockNum, 
    int start,
    int end, 
    struct rock *rocks,
    struct path *p) {
    int *rockIndexes = malloc(sizeof(int) * rockNum);

    p->numRocks = doGetPathFromPred(predArray, start, end, rockIndexes);
    p->rocks = getPathFromIndex(rocks, rockIndexes, rockNum, p->numRocks);
    free(rockIndexes);
}

/**
 * Puts the shortest path into p
 * if there is no path p will have a NULL field for p->rocks 
*/
static void getShortestDijkstraPath(
    Graph g, 
    int startCount,
    int *ends,
    int endCount, 
    int rockNum,
    struct rock *rocks,
    struct path *p) {

    float currDist = INFINITY;

    // Repeat for each starting rock
    for (int start = 0; start < startCount; start++) {
                
        int *predArray = setupPredArray(rockNum);
        float *dist = setupFloatArray(rockNum);

        GraphDijkstra(g, start, predArray, dist);
    
        int end = getShortestEnd(ends, endCount, dist);


        // If shorter path found add path to p
        if (dist[end] < currDist) {
            free(p->rocks);
            getPathFromPred(predArray, rockNum, start, end, rocks, p);
            currDist = dist[end];
        }
        
        free(predArray);
        free(dist);
    }
}

/**
 * Finds the shortest path to climb on a certain difficulty and returns the path
*/
struct path findShortestPath(Wall w, int reach, Colour colour) {
    struct path p = {0, NULL};
    struct rock *rocks = malloc(WallNumRocks(w) * sizeof(struct rock));
    
    // Gets all rocks on the wall for the chosen colour
    int rockNum = WallGetColouredRocksInRange(
        w, 1, 1, maxRange(WallHeight(w), WallWidth(w)), colour, rocks);

    if (rockNum == 0) {
        free(rocks);
        return p;
    }

    int startCount = getStarts(rockNum, rocks, reach);

    int *ends = malloc(rockNum * sizeof(int));
    int endCount = getEnds(rockNum, rocks, ends, reach, WallHeight(w));
        
    if (startCount == 0 || endCount == 0) {
        free(rocks);
        free(ends);
        return p;
    }

    Graph g = GraphNew(rockNum);
    addColouredPaths(g, rockNum, rocks, reach);
    
    getShortestDijkstraPath(
        g, startCount, ends, endCount, rockNum, rocks, &p);

    free(rocks);
    free(ends);
    GraphFree(g);
    return p;
}

/**
 * Adds energy paths to the digraph
*/
static void addEnergyPaths(
    Digraph d, 
    int rockNum, 
    struct rock *rocks, 
    int reach, 
    int energyCosts[NUM_COLOURS]) {
    
    for (int v = 0; v < rockNum; v++) {
        for (int w = v + 1; w < rockNum; w++) {
            struct diedge newEdge;
            newEdge.v = v;
            newEdge.w = w;
            // Energy is calculated as the energy to the rock going
            newEdge.vw_weight = energyCosts[rocks[w].colour];
            newEdge.wv_weight = energyCosts[rocks[v].colour];;
            if (getDistance(rocks[v], rocks[w]) <= reach) {
                DigraphInsertEdge(d, newEdge);
            }
        }
    }   

}

/**
 * Gets the minimum energy path using Dijkstra's algorithm
*/
static void getMinEnergyDijkstraPath( 
    Digraph d, 
    int startCount,
    int *ends,
    int endCount, 
    int rockNum,
    struct rock *rocks,
    struct path *p,
    int *energyCosts) {
    
    float currEnergy = INFINITY;
    
    for (int start = 0; start < startCount; start++) {
        int *predArray = setupPredArray(rockNum);
        float *energy = setupFloatArray(rockNum);

        DigraphDijkstra(
            d, start, energyCosts[rocks[start].colour], predArray, energy);

        int end = getShortestEnd(ends, endCount, energy);

        // if path has a lower energy cost add path to p
        if (energy[end] < currEnergy) {
            free(p->rocks);
            getPathFromPred(predArray, rockNum, start, end, rocks, p);
            currEnergy = energy[end];
        }
        
        free(predArray);
        free(energy);
    }

}

/**
 * Returns the minimum energy path
*/
struct path findMinEnergyPath(Wall w, int reach, int energyCosts[NUM_COLOURS]) {
    struct path p = {0, NULL};
    struct rock *rocks = malloc(WallNumRocks(w) * sizeof(struct rock));
    int rockNum = WallGetAllRocks(w, rocks);
    if (rockNum == 0) {
        free(rocks);
        return p;
    }

    int startCount = getStarts(rockNum, rocks, reach);

    int *ends = malloc(rockNum * sizeof(int));
    int endCount = getEnds(rockNum, rocks, ends, reach, WallHeight(w));
        
    if (startCount == 0 || endCount == 0) {
        free(rocks);
        free(ends);
        return p;
    }

    Digraph d = DigraphNew(rockNum);
    addEnergyPaths(d, rockNum, rocks, reach, energyCosts);
    getMinEnergyDijkstraPath(
        d, startCount, ends, endCount, rockNum, rocks, &p, energyCosts);

    free(rocks);
    free(ends);
    DigraphFree(d);
    return p;
}

/**
 * returns an initialised predecessor array
*/
static int *setupTurnArray(int rockNum) {
    int *turnArray = malloc(sizeof(int) * rockNum);
    for (int i = 0; i < rockNum; i++) {
        turnArray[i] = INT_MAX;
    }
    return turnArray;
}

/**
 * Returns an initialised predecessor array
*/
static float *setupEnergyLeft(int rockNum) {
    float *energyLeft = malloc(sizeof(float) * rockNum);
    for (int i = 0; i < rockNum; i++) {
        energyLeft[i] = EMPTY_ENERGY;
    }
    return energyLeft;
} 

/**
 * Returns the end with the minimum turns and highest energy 
 * NOTE - end is the index of the rocks array not of the ends array
*/
static int getMinTurnEnd(
    int *turnArray, 
    float *energyLeft,
    int *ends,
    int endCount,
    int turns,
    float currEnergy) {
    int end = EMPTY_INDEX;
    for (int i = 0; i < endCount; i++) {
        if (isLowerTurnsHigherEnergy(
                    turns, 
                    turnArray[ends[i]], 
                    currEnergy, 
                    energyLeft[ends[i]])) {
            end = ends[i];
            turns = turnArray[ends[i]];
            currEnergy = energyLeft[ends[i]];
        } 
    }
    return end;
}

/**
 * Recursively finds the shortest path adding rest turns
*/
static int doGetTurnPath(
    int start,
    int next,
    int end,
    int *predArray,
    int *turnArray,
    float *energyLeft,
    int *rockIndexes) {

    if (next == start) {
        rockIndexes[0] = start;
        return 1;
    } else {
        int pathLength = doGetTurnPath(start, predArray[next], end, predArray, 
                                        turnArray, energyLeft, rockIndexes);

        // Checks if a rest turn is required
        if (turnArray[next] - turnArray[predArray[next]] > 1) {
            rockIndexes[pathLength] = predArray[next];
            pathLength++;
        }
        rockIndexes[pathLength] = next;
        return pathLength + 1;
    }
}

/**
 * Gets path from predArray and energy left array
*/
static void getTurnPathFromPred(
    int start,
    int end,
    int *predArray,
    int *turnArray,
    float *energyLeft,
    struct path *p,
    int rockNum,
    struct rock *rocks) {
    
    free(p->rocks);
    // Double rockNum since a climber can rest and climb to a rock
    int *rockIndexes = malloc(2 * rockNum * sizeof(int));

    p->numRocks = doGetTurnPath(
        start, end, end, predArray, turnArray, energyLeft, rockIndexes);

    p->rocks = getPathFromIndex(rocks, rockIndexes, rockNum, p->numRocks);
    free(rockIndexes);
}

/**
 * Gets the minimum turns path using Dijkstra's algorithm
*/
static void getMinTurnsDijkstraPath( 
    Digraph d, 
    int startCount,
    int *ends,
    int endCount, 
    int rockNum,
    struct rock *rocks,
    struct path *p,
    int *energyCosts, 
    int maxEnergy) {
    
    int currTurns = INT_MAX;
    float currEnergy = EMPTY_ENERGY;
    
    for (int start = 0; start < startCount; start++) {
        int *predArray = setupPredArray(rockNum);
        int *turnArray = setupTurnArray(rockNum);
        float *energyLeft = setupEnergyLeft(rockNum); 
        float maxFloatEnergy = 0.0 + maxEnergy;

        DigraphTurnsDijkstra(
            d, 
            start,
            energyCosts[rocks[start].colour],
            maxFloatEnergy, 
            predArray, 
            turnArray, 
            energyLeft);

        int end = getMinTurnEnd(
            turnArray, energyLeft, ends, endCount, currTurns, currEnergy);

        if (end != EMPTY_INDEX) {
            currTurns = turnArray[end];
            currEnergy = energyLeft[end];
            getTurnPathFromPred(
                start, end, predArray, turnArray, energyLeft, p, rockNum, rocks);
        }
        
        free(energyLeft);
        free(predArray);
        free(turnArray);
    }

}

/**
 * Returns the path to climb a wall in the shortest turns and highest energy
*/
struct path findMinTurnsPath(Wall w, int reach, int energyCosts[NUM_COLOURS],
                             int maxEnergy) {

    struct path p = {0, NULL};
    struct rock *rocks = malloc(WallNumRocks(w) * sizeof(struct rock));
    int rockNum = WallGetAllRocks(w, rocks);
    if (rockNum == 0) {
        free(rocks);
        return p;
    }

    int startCount = getStarts(rockNum, rocks, reach);

    int *ends = malloc(rockNum * sizeof(int));
    int endCount = getEnds(rockNum, rocks, ends, reach, WallHeight(w));
        
    if (startCount == 0 || endCount == 0) {
        free(rocks);
        free(ends);
        return p;
    }

    Digraph d = DigraphNew(rockNum);
    addEnergyPaths(d, rockNum, rocks, reach, energyCosts);
    getMinTurnsDijkstraPath(
        d, 
        startCount, 
        ends, 
        endCount, 
        rockNum, 
        rocks, 
        &p, 
        energyCosts, 
        maxEnergy);    

    free(rocks);
    free(ends);
    DigraphFree(d);
    return p;
}

