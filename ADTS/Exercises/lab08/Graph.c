// Implementation of the Undirected Weighted Graph ADT
// Uses an adjacency matrix

#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#include "Graph.h"
#include "Pq.h"

// DO NOT modify this struct
struct graph {
    int nV;         // #vertices
    int nE;         // #edges
    double **edges; // adjacency matrix storing positive weights
                    // 0 if nodes not adjacent
};

static bool validVertex(Graph g, Vertex v);

////////////////////////////////////////////////////////////////////////

Graph GraphNew(int nV) {
    assert(nV > 0);

    Graph g = malloc(sizeof(*g));
    if (g == NULL) {
        fprintf(stderr, "error: out of memory\n");
        exit(EXIT_FAILURE);
    }

    g->nV = nV;
    g->nE = 0;

    g->edges = malloc(nV * sizeof(double *));
    if (g->edges == NULL) {
        fprintf(stderr, "error: out of memory\n");
        exit(EXIT_FAILURE);
    }
    for (int i = 0; i < nV; i++) {
        g->edges[i] = calloc(nV, sizeof(double));
        if (g->edges[i] == NULL) {
            fprintf(stderr, "error: out of memory\n");
            exit(EXIT_FAILURE);
        }
    }

    return g;
}

void GraphFree(Graph g) {
    for (int i = 0; i < g->nV; i++) {
        free(g->edges[i]);
    }
    free(g->edges);
    free(g);
}

////////////////////////////////////////////////////////////////////////

int GraphNumVertices(Graph g) {
    return g->nV;
}

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

double GraphIsAdjacent(Graph g, Vertex v, Vertex w) {
    assert(validVertex(g, v));
    assert(validVertex(g, w));
    
    return g->edges[v][w];
}

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
// Your task
/**
 * Returns the minimum spanning tree of the given graph (uses Prim's Algorithm)
*/
Graph GraphMst(Graph g) {
    Graph mst = GraphNew(g->nV);
    bool *usedV = calloc(g->nV, sizeof(int));
    Pq unusedEdges = PqNew();
    Pq unusedEdges2 = PqNew(); 

    // Copies the edges into the priority queue

    for (int i = 0; i < g->nV; i++) {
        for (int j = i + 1; j < g->nV; j++) {
            if (g->edges[i][j] != 0) {
                struct edge e;
                e.v = i;
                e.w = j;
                e.weight = g->edges[i][j];
                PqInsert(unusedEdges, e);
            }
        }
    }
    
    struct edge e = PqExtract(unusedEdges);
    int numUsedV = 1;
    usedV[e.v] = true;
    usedV[e.w] = true;
    GraphInsertEdge(mst, e);

    // Returns NULL if all edges are checked and an MST is not formed

    while(numUsedV < g->nV - 1) {
        if (PqIsEmpty(unusedEdges)) {
            PqFree(unusedEdges);
            PqFree(unusedEdges2);
            free(usedV);
            GraphFree(mst);
            return NULL;
        }

        e = PqExtract(unusedEdges);
        if (usedV[e.v] ^ usedV[e.w]) {
            GraphInsertEdge(mst, e);
            usedV[e.v] = true;
            usedV[e.w] = true;
            numUsedV++;
            // Adds edges which previously had no used vertexes
            while(!PqIsEmpty(unusedEdges2)) {
                PqInsert(unusedEdges, PqExtract(unusedEdges2));
            }
        }

        // Add edges to second queue if vertexes are not used
        if (!usedV[e.v] && !usedV[e.w]) {
            PqInsert(unusedEdges2, e);
        }
    }

    PqFree(unusedEdges);
    PqFree(unusedEdges2);
    free(usedV);
    return mst;
}

////////////////////////////////////////////////////////////////////////

static bool validVertex(Graph g, Vertex v) {
    return v >= 0 && v < g->nV;
}

