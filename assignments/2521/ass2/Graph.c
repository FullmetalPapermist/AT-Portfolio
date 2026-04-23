// Alexander Tan (z5477240) 5/4/24
// Implementation of the Undirected Weighted Graph ADT
// Uses an adjacency matrix

// Taken from lab08 submission at:
// https://cgi.cse.unsw.edu.au/~cs2521/24T1/view/main.cgi/tue11-brass/5477240/submission/lab08/1/Graph.c


// Acknowledgements:
// - Pseudocode of Dijkstra's algorithm
//      https://cgi.cse.unsw.edu.au/~cs2521/24T1/lectures/slides/week07tue-dijkstras-algorithm.pdf
//  - Implementation of a hash table ADT
//      https://cgi.cse.unsw.edu.au/~cs2521/24T1/view/main.cgi/tue11-brass/5477240/submission/lab09/1/HashTable.c
//  - Implementation of a priority queue
//      https://cgi.cse.unsw.edu.au/~cs2521/24T1/lab/8/questions

#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <math.h>

// Implementation of a hash table ADT
// Taken from lab09 submission at:
// https://cgi.cse.unsw.edu.au/~cs2521/24T1/view/main.cgi/tue11-brass/5477240/submission/lab09/1/HashTable.c
#include "HashTable.h"
#include "Graph.h"
// Implementation of a priority queue
// Taken from lab08 starting code at:
// https://cgi.cse.unsw.edu.au/~cs2521/24T1/lab/8/questions
#include "Pq.h"

struct graph {
    int nV;         // #vertices
    int nE;         // #edges
    float **edges; // adjacency matrix storing positive weights
                    // 0 if nodes not adjacent
};

static bool validVertex(Graph g, Vertex v);

////////////////////////////////////////////////////////////////////////

/**
 * Creates a graph with `nV` vertices and no edges
 */
Graph GraphNew(int nV) {
    assert(nV > 0);

    Graph g = malloc(sizeof(*g));
    if (g == NULL) {
        fprintf(stderr, "error: out of memory\n");
        exit(EXIT_FAILURE);
    }

    g->nV = nV;
    g->nE = 0;

    g->edges = malloc(nV * sizeof(float *));
    if (g->edges == NULL) {
        fprintf(stderr, "error: out of memory\n");
        exit(EXIT_FAILURE);
    }
    for (int i = 0; i < nV; i++) {
        g->edges[i] = calloc(nV, sizeof(float));
        if (g->edges[i] == NULL) {
            fprintf(stderr, "error: out of memory\n");
            exit(EXIT_FAILURE);
        }
    }

    return g;
}

/**
 * Frees all memory allocated to the given graph
 */
void GraphFree(Graph g) {
    for (int i = 0; i < g->nV; i++) {
        free(g->edges[i]);
    }
    free(g->edges);
    free(g);
}

////////////////////////////////////////////////////////////////////////

/**
 * Returns the number of vertices in the graph
 */
int GraphNumVertices(Graph g) {
    return g->nV;
}

/**
 * Inserts an edge into a graph. Does nothing if there is already an
 * edge between `e.v` and `e.w`. Returns true if successful, and false
 * if there was already an edge.
 */
bool GraphInsertEdge(Graph g, struct edge e) {
    assert(validVertex(g, e.v));
    assert(validVertex(g, e.w));
    assert(e.v != e.w);
    assert(e.weight > 0.0);

    if (g->edges[e.v][e.w] == 0.0) {
        g->edges[e.v][e.w] = e.weight;
        g->edges[e.w][e.v] = e.weight;
        g->nE++;
        return true;
    } else {
        return false;
    }
}

/**
 * Removes an edge from a graph. Returns true if successful, and false
 * if the edge did not exist.
 */
bool GraphRemoveEdge(Graph g, Vertex v, Vertex w) {
    assert(validVertex(g, v));
    assert(validVertex(g, w));

    if (g->edges[v][w] != 0.0) {   // edge e in graph
        g->edges[v][w] = 0.0;
        g->edges[w][v] = 0.0;
        g->nE--;
        return true;
    } else {
        return false;
    }
}

/**
 * Returns the weight of the edge between `v` and `w` if it exists, or
 * 0.0 otherwise
 */
float GraphIsAdjacent(Graph g, Vertex v, Vertex w) {
    assert(validVertex(g, v));
    assert(validVertex(g, w));
    
    return g->edges[v][w];
}

/**
 * Displays information about the graph
 */
void GraphShow(Graph g) {
    printf("Number of vertices: %d\n", g->nV);
    printf("Number of edges: %d\n", g->nE);
    for (int v = 0; v < g->nV; v++) {
        for (int w = v + 1; w < g->nV; w++) {
            if (g->edges[v][w] != 0.0) {
                printf("Edge %d - %d: %lf\n", v, w, g->edges[v][w]);
            }
        }
    }
}

////////////////////////////////////////////////////////////////////////

/**
 * Checks vertex is valid
*/
static bool validVertex(Graph g, Vertex v) {
    return v >= 0 && v < g->nV;
}

// Dijkstra's algorithm
// Taken from:
// https://cgi.cse.unsw.edu.au/~cs2521/24T1/lectures/slides/week07tue-dijkstras-algorithm.pdf

/**
 * Applies Dijsktra's algorithm to a graph
 * Assumes the predArray has enough space and has been set to -1
 * and the dist array has enough space and has been set to INFINITY 
*/
void GraphDijkstra(Graph g, Vertex v, int *predArray, float *dist) {
    HashTable vSet = HashTableNew();
    for (int i = 0; i < g->nV; i++) {
        HashTableInsert(vSet, i, 0);
    }

    dist[v] = 0.0;    
    Vertex vMin = v;

    while (HashTableSize(vSet) != 0) {
        // Find the vertex with the shortest path currently
        float distMin = INFINITY;
        for (int i = 0; i < g->nV; i++) {
            if (dist[i] < distMin && HashTableContains(vSet, i)) {
                vMin = i;
                distMin = dist[i];
            }
        }

        // Break if there are no more connected components to v
        if (distMin == INFINITY) {
            break;
        }

        HashTableDelete(vSet, vMin);
        
        // Create the priority queue for each edge for the vertex
        Pq edgeQueue = PqNew();
        for (int i = 0; i < g->nV; i++) {
            // if the vertex has not been removed from vSet add edge
            if (HashTableContains(vSet, i) && 
            GraphIsAdjacent(g, i, vMin)) {
                struct edge e = {vMin, i, g->edges[vMin][i]};
                PqInsert(edgeQueue, e);
            }
        }

        while (!PqIsEmpty(edgeQueue)) {
            struct edge e = PqExtract(edgeQueue);
            // v is vMin and w is the other vertex
            if (dist[vMin] + e.weight < dist[e.w]) {
                dist[e.w] = dist[vMin] + e.weight;
                predArray[e.w] = vMin;
            }
        }
        PqFree(edgeQueue);
    }
    
    HashTableFree(vSet);
}
