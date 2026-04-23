// Alexander Tan (z5477240) 12/4/24
// Implementation of the Weighted Digraph ADT
// Uses an adjacency matrix

// Edited from the lab08 lab submission of an weighted undirected graph ADT
// Taken from lab08 submission at:
// https://cgi.cse.unsw.edu.au/~cs2521/24T1/view/main.cgi/tue11-brass/5477240/submission/lab08/1/Graph.c

// Acknowledgements:
//  - Edited from the graph ADT
//      Taken from lab08 submission at:
//      https://cgi.cse.unsw.edu.au/~cs2521/24T1/view/main.cgi/tue11-brass/5477240/submission/lab08/1/Graph.c
// - Pseudocode of Dijkstra's algorithm
//      https://cgi.cse.unsw.edu.au/~cs2521/24T1/lectures/slides/week07tue-dijkstras-algorithm.pdf
//  - Implementation of a hash table ADT
//      https://cgi.cse.unsw.edu.au/~cs2521/24T1/view/main.cgi/tue11-brass/5477240/submission/lab09/1/HashTable.c
//  - Implementation of a priority queue
//      https://cgi.cse.unsw.edu.au/~cs2521/24T1/lab/8/questions
//  - Implementation of a graph ADT
//      Taken from lab08 submission at:
//      https://cgi.cse.unsw.edu.au/~cs2521/24T1/view/main.cgi/tue11-brass/5477240/submission/lab08/1/Graph.c


#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <limits.h>

// Implementation of a hash table ADT
// Taken from lab09 submission at:
// https://cgi.cse.unsw.edu.au/~cs2521/24T1/view/main.cgi/tue11-brass/5477240/submission/lab09/1/HashTable.c
#include "HashTable.h"
#include "Digraph.h"
// Implementation of a priority queue
// Taken from lab08:
// https://cgi.cse.unsw.edu.au/~cs2521/24T1/lab/8/questions
#include "Pq.h"

#define EMPTY_INDEX -1

struct digraph {
    int nV;         // #vertices
    int nE;         // #diedges
    float **diedges; // adjacency matrix storing positive weights
                    // 0 if nodes not adjacent
};

// Checks if a divertex is valid
static bool validDivertex(Digraph d, Divertex v) {
    if (v >= 0 && v < d->nV) {
        return true;
    } else {
        return false;
    }
}

////////////////////////////////////////////////////////////////////////

/**
 * Creates a digraph with `nV` vertices and no diedges
 */
Digraph DigraphNew(int nV) {
    assert(nV > 0);

    Digraph d = malloc(sizeof(*d));
    if (d == NULL) {
        fprintf(stderr, "error: out of memory\n");
        exit(EXIT_FAILURE);
    }

    d->nV = nV;
    d->nE = 0;

    d->diedges = malloc(nV * sizeof(int *));
    if (d->diedges == NULL) {
        fprintf(stderr, "error: out of memory\n");
        exit(EXIT_FAILURE);
    }
    for (int i = 0; i < nV; i++) {
        d->diedges[i] = calloc(nV, sizeof(int));
        if (d->diedges[i] == NULL) {
            fprintf(stderr, "error: out of memory\n");
            exit(EXIT_FAILURE);
        }
    }

    return d;
}

/**
 * Frees all memory allocated to the given digraph
 */
void DigraphFree(Digraph d) {
    for (int i = 0; i < d->nV; i++) {
        free(d->diedges[i]);
    }
    free(d->diedges);
    free(d);
}

////////////////////////////////////////////////////////////////////////

/**
 * Returns the number of vertices in the digraph
 */
int DigraphNumVertices(Digraph d) {
    return d->nV;
}

/**
 * Inserts an diedge into a digraph. Does nothing if there is already an
 * diedge between `e.v` and `e.w`. Returns true if successful, and false
 * if there was already an diedge.
 */
bool DigraphInsertEdge(Digraph d, struct diedge e) {
    assert(validDivertex(d, e.v));
    assert(validDivertex(d, e.w));
    assert(e.v != e.w);
    assert(e.vw_weight > 0.0);
    assert(e.wv_weight > 0.0);

    if (d->diedges[e.v][e.w] == 0.0) {
        d->diedges[e.v][e.w] = e.vw_weight;
        d->diedges[e.w][e.v] = e.wv_weight;
        d->nE++;
        return true;
    } else {
        return false;
    }
}

/**
 * Removes an diedge from a digraph. Returns true if successful, and false
 * if the diedge did not exist.
 */
bool DigraphRemoveEdge(Digraph d, Divertex v, Divertex w) {
    assert(validDivertex(d, v));
    assert(validDivertex(d, w));

    if (d->diedges[v][w] != 0.0) {   // edge e in graph
        d->diedges[v][w] = 0.0;
        d->diedges[w][v] = 0.0;
        d->nE--;
        return true;
    } else {
        return false;
    }
}

/**
 * Returns the weight of the diedge from `v` to `w` if it exists, or
 * 0 otherwise
 */
int DigraphIsAdjacent(Digraph d, Divertex v, Divertex w) {
    assert(validDivertex(d, v));
    assert(validDivertex(d, w));
    
    return d->diedges[v][w];
}

/**
 * Displays information about the digraph
 */
void DigraphShow(Digraph d) {
    printf("Number of vertices: %d\n", d->nV);
    printf("Number of diedges: %d\n", d->nE);
    for (int v = 0; v < d->nV; v++) {
        for (int w = v + 1; w < d->nV; w++) {
            if (d->diedges[v][w] != 0) {
                printf(
                    "Edge %d - %d: %lf %lf\n", 
                    v, 
                    w, 
                    d->diedges[v][w], 
                    d->diedges[w][v]);
            }
        }
    }
}

// Dijkstra's algorithm pseudocode
// Taken from:
// https://cgi.cse.unsw.edu.au/~cs2521/24T1/lectures/slides/week07tue-dijkstras-algorithm.pdf

/**
 * Initialises a set with numbers from 0 to n
*/
static HashTable setInit(int n) {
    HashTable set = HashTableNew();
    for (int i = 0; i < n; i++) {
        HashTableInsert(set, i, 0);
    }
    return set;
}

/**
 * Applies Dijsktra's algorithm to a graph
 * Assumes the predArray has enough space and has been set to -1
 * and the energy array has enough space and has been set to INT_MAX 
*/
void DigraphDijkstra(
    Digraph d, Divertex v, float startEnergy, int *predArray, float *energy) {
    
    HashTable vSet = setInit(d->nV);
    energy[v] = startEnergy;    
    Divertex vMin = v;

    while (HashTableSize(vSet) != 0) {
        // Find the vertex with the shortest path currently
        float energyMin = INFINITY;
        for (int i = 0; i < d->nV; i++) {
            if (energy[i] < energyMin && HashTableContains(vSet, i)) {
                vMin = i;
                energyMin = energy[i];
            }
        }

        // Break if there are no more connected components to v
        if (energyMin == INFINITY) {
            break;
        }

        HashTableDelete(vSet, vMin);
        
        // Create the priority queue for each edge for the vertex
        Pq diedgeQueue = PqNew();
        for (int i = 0; i < d->nV; i++) {
            // if the vertex has not been removed from vSet add edge
            if (HashTableContains(vSet, i) && 
            DigraphIsAdjacent(d, i, vMin)) {
                struct edge e = {vMin, i, d->diedges[vMin][i]};
                PqInsert(diedgeQueue, e);
            }
        }

        while (!PqIsEmpty(diedgeQueue)) {
            struct edge e = PqExtract(diedgeQueue);
            // v is vMin and w is the other vertex
            if (energy[vMin] + e.weight < energy[e.w]) {
                energy[e.w] = energy[vMin] + e.weight;
                predArray[e.w] = vMin;
            }
        }
        PqFree(diedgeQueue);
    }
    
    HashTableFree(vSet);
}

/**
 * Returns true if the new turns is lower than the current turns or if the turns
 * are the same returns true if the current energy is lower than the new energy
*/
bool isLowerTurnsHigherEnergy(
    int currTurn, int newTurn, float currEnergy, float newEnergy) {
    
    if (newTurn < currTurn) {
        return true;
    } else if ((currTurn == newTurn) && (currEnergy < newEnergy)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Gets vMin (connected vertex with the lowest turns and highest remaining 
 * energy)
*/
static int getVMin(float *energyLeft, HashTable vSet, int nV, int *turnArray) {
    
    Divertex vMin = EMPTY_INDEX;
    
    int turns = INT_MAX;
    float currEnergy = INFINITY;
    for (int i = 0; i < nV; i++) {
        if (isLowerTurnsHigherEnergy(
                turns, turnArray[i], currEnergy, energyLeft[i]) &&
            HashTableContains(vSet, i)) {

            vMin = i;
            turns = turnArray[i];
            currEnergy = energyLeft[i];
        }
    }
    return vMin;

}

void addDiedges(HashTable vSet, Digraph d, Divertex vMin, Pq diedgeQueue) {
    for (int i = 0; i < d->nV; i++) {
        // if the vertex has not been removed from vSet add edge
        if (HashTableContains(vSet, i) && 
            DigraphIsAdjacent(d, i, vMin)) {
            
            struct edge e = {vMin, i, d->diedges[vMin][i]};
            PqInsert(diedgeQueue, e);
        }
    }
}

/**
 * Adds turns and adjusts energy after climbing the edge  
*/
static void addTurns(float weight, int *wTurn, float *wEnergy, float maxEnergy) {
    if (weight > *wEnergy) {
        *wTurn += 1;
        *wEnergy = maxEnergy - weight;
    } else {
        *wEnergy -= weight;
    }
}

/**
 * Applies Dijsktra's algorithm to a digraph using turns
 * Assumptions:
 *  - the predArray has enough space and has been set to -1
 *  - the energy left array has enough space and has been set to 0
 *  - the turn array has enough space and has been set to INT_MAX
*/
void DigraphTurnsDijkstra(Digraph d, Divertex v, float startEnergy, 
                            float maxEnergy, int *predArray, int *turnArray,
                            float *energyLeft) {
    
    energyLeft[v] = maxEnergy - startEnergy;
    // Exit if not enough energy to start 
    if (energyLeft[v] < 0) {
        return;
    }

    HashTable vSet = setInit(d->nV);
    turnArray[v] = 1;
    Divertex vMin = EMPTY_INDEX;

    while (HashTableSize(vSet) != 0) {
        // Find the vertex with the shortest path currently
        vMin = getVMin(energyLeft, vSet, d->nV, turnArray);

        // Break if there are no more connected components to v
        if (vMin == EMPTY_INDEX) {
            break;
        }

        HashTableDelete(vSet, vMin);

        Pq diedgeQueue = PqNew();
        addDiedges(vSet, d, vMin, diedgeQueue);

        while (!PqIsEmpty(diedgeQueue)) {
            struct edge e = PqExtract(diedgeQueue);
            // v is vMin and w is the other vertex

            int wTurn = turnArray[vMin] + 1;
            float wEnergy = energyLeft[vMin];

            // adds a turn if the energy cost exceeds current energy
            addTurns(e.weight, &wTurn, &wEnergy, maxEnergy);
            if (isLowerTurnsHigherEnergy(
                    turnArray[e.w], wTurn, energyLeft[e.w], wEnergy)) {

                energyLeft[e.w] = wEnergy;
                predArray[e.w] = vMin;
                turnArray[e.w] = wTurn;
            }
        }
        PqFree(diedgeQueue);
    }
    
    HashTableFree(vSet);
}
