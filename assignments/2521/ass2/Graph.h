// Alexander Tan (z5477240) 17/04/24
// Interface to the Undirected Weighted Graph ADT
// - Vertices are identified by integers between 0 and nV - 1,
//   where nV is the number of vertices in the graph
// - Weights are doubles and must be positive
// - Self-loops are not allowed

// Acknowledgements:
// - Pseudocode of Dijkstra's algorithm
//      https://cgi.cse.unsw.edu.au/~cs2521/24T1/lectures/slides/week07tue-dijkstras-algorithm.pdf
//  - Implementation of a hash table ADT
//      https://cgi.cse.unsw.edu.au/~cs2521/24T1/view/main.cgi/tue11-brass/5477240/submission/lab09/1/HashTable.c
//  - Implementation of a priority queue
//      https://cgi.cse.unsw.edu.au/~cs2521/24T1/lab/8/questions

#ifndef GRAPH_H
#define GRAPH_H

#include <stdbool.h>

typedef struct graph *Graph;

typedef int Vertex;

// edges are pairs of vertices (end-points)
struct edge {
    Vertex v;
    Vertex w;
    float weight;
};

/**
 * Creates a graph with `nV` vertices and no edges
 */
Graph GraphNew(int nV);

/**
 * Frees all memory allocated to the given graph
 */
void GraphFree(Graph g);

/**
 * Returns the number of vertices in the graph
 */
int GraphNumVertices(Graph g);

/**
 * Inserts an edge into a graph. Does nothing if there is already an
 * edge between `e.v` and `e.w`. Returns true if successful, and false
 * if there was already an edge.
 */
bool GraphInsertEdge(Graph g, struct edge e);

/**
 * Removes an edge from a graph. Returns true if successful, and false
 * if the edge did not exist.
 */
bool GraphRemoveEdge(Graph g, Vertex v, Vertex w);

/**
 * Returns the weight of the edge between `v` and `w` if it exists, or
 * 0.0 otherwise
 */
float GraphIsAdjacent(Graph g, Vertex v, Vertex w);

/**
 * Displays information about the graph
 */
void GraphShow(Graph g);

/**
 * Applies Dijsktra's algorithm to a graph
 * Assumes the predArray has enough space and has been set to -1
 * and the dist array has enough space and has been set to INFINITY 
*/
void GraphDijkstra(Graph g, Vertex v, int *predArray, float *dist);
#endif
