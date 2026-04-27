// Alexander Tan (z5477240) 17/04/24
// Interface to the Weighted Digraph ADT
// - Vertices are identified by integers between 0 and nV - 1,
//   where nV is the number of vertices in the graph
// - Weights are doubles and must be positive
// - Self-loops are not allowed
// - Edges cannot be one directional (must be two way)

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

#ifndef DIGRAPH_H
#define DIGRAPH_H

#include <stdbool.h>

typedef struct digraph *Digraph;

typedef int Divertex;

// diedges are pairs of vertices (end-points)
struct diedge {
    Divertex v;
    Divertex w;
    float vw_weight;
    float wv_weight;
};

/**
 * Creates a digraph with `nV` vertices and no diedges
 */
Digraph DigraphNew(int nV);

/**
 * Frees all memory allocated to the given digraph
 */
void DigraphFree(Digraph d);

/**
 * Returns the number of vertices in the digraph
 */
int DigraphNumVertices(Digraph d);

/**
 * Inserts an diedge into a digraph. Does nothing if there is already an
 * diedge between `e.v` and `e.w`. Returns true if successful, and false
 * if there was already an diedge.
 */
bool DigraphInsertEdge(Digraph d, struct diedge e);

/**
 * Removes an diedge from a digraph. Returns true if successful, and false
 * if the diedge did not exist.
 */
bool DigraphRemoveEdge(Digraph d, Divertex v, Divertex w);

/**
 * Returns the weight of the diedge from `v` to `w` if it exists, or
 * 0 otherwise
 */
int DigraphIsAdjacent(Digraph d, Divertex v, Divertex w);

/**
 * Displays information about the digraph
 */
void DigraphShow(Digraph d);

/**
 * Applies Dijsktra's algorithm to a digraph
 * Assumes the predArray has enough space and has been set to -1
 * and the dist array has enough space and has been set to INFINITY 
*/
void DigraphDijkstra(
    Digraph d, Divertex v, float startEnergy, int *predArray, float *energy);

/**
 * Returns true if the new turns is lower than the current turns or if the turns
 * are the same returns true if the current energy is lower than the new energy
*/
bool isLowerTurnsHigherEnergy(
    int currTurn, int newTurn, float currEnergy, float newEnergy);

/**
 * Applies Dijsktra's algorithm to a digraph using turns
 * Assumptions:
 *  - the predArray has enough space and has been set to -1
 *  - the turn array has enough space and has been set to INT_MAX
 *  - the energyLeft array has enough space and has been set to infinity
*/
void DigraphTurnsDijkstra(
    Digraph d, 
    Divertex v,
    float startEnergy, 
    float maxEnergy,
    int *predArray, 
    int *turnArray, 
    float *energyLeft);
#endif
