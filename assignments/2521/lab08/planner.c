// Algorithms to design electrical grids

#include <math.h>
#include <stdio.h>
#include <stdlib.h>

#include "Graph.h"
#include "place.h"
#include "Pq.h"

////////////////////////////////////////////////////////////////////////
// Your task

/**
 * Returns the distance between two places as a double
*/
double getDistance(struct place city1, struct place city2) {
    double xDist = city1.x - city2.x;
    xDist *= xDist;
    double yDist = city1.y - city2.y;
    yDist *= yDist;
    return sqrt(xDist + yDist);
}

/**
 * Designs  a minimal cost electrical grid that will deliver electricity
 * from a power plant to all the given cities. Power lines must be built
 * between cities or between a city and a power plant.  Cost is directly
 * proportional to the total length of power lines used.
 * Assumes  that  numCities  is at least 1 (numCities is the size of the
 * cities array).
 * Stores the power lines that need to be built in the given  powerLines
 * array, and returns the number of power lines stored. Assumes that the
 * powerLines array is large enough to store all required power lines.
 */
int planGrid1(struct place cities[], int numCities,
              struct place powerPlant,
              struct powerLine powerLines[]) {

    Graph g = GraphNew(numCities + 1);

    // Adds all possible routes between cities
    for (int i = 0; i < numCities; i++) {
        struct edge e;
        e.v = numCities;
        e.w = i;
        e.weight = getDistance(cities[i], powerPlant);
        GraphInsertEdge(g, e);

        for (int j = i + 1; j < numCities; j++) {
            e.v = i;
            e.w = j;
            e.weight = getDistance(cities[i], cities[j]);
            GraphInsertEdge(g, e);
        }
    }

    // Moves info from the MST to the powerLine array
    Graph mst = GraphMst(g);
    int powerLineNum = 0;
    for (int i = 0; i < numCities; i++) {
        double distance = GraphIsAdjacent(mst, i, numCities);
        if (distance != 0.0) {
            (powerLines[powerLineNum]).p1 = cities[i];
            (powerLines[powerLineNum]).p2 = powerPlant;
            powerLineNum++;
        }
    
        for (int j = i + 1; j < numCities; j++) {    
            double distance = GraphIsAdjacent(mst, i, j);
            if (distance != 0.0) {
                (powerLines[powerLineNum]).p1 = cities[i];
                (powerLines[powerLineNum]).p2 = cities[j];
                powerLineNum++;
            }
        }
    }

    GraphFree(g);
    GraphFree(mst); 
    return powerLineNum;
}

////////////////////////////////////////////////////////////////////////
// Optional task

/**
 * Designs  a minimal cost electrical grid that will deliver electricity
 * to all the given cities.  Power lines must be built between cities or
 * between a city and a power plant.  Cost is directly  proportional  to
 * the  total  length of power lines used.  Assume that each power plant
 * generates enough electricity to supply all cities, so not  all  power
 * plants need to be used.
 * Assumes  that  numCities and numPowerPlants are at least 1 (numCities
 * and numPowerPlants are the sizes of the cities and powerPlants arrays
 * respectively).
 * Stores the power lines that need to be built in the given  powerLines
 * array, and returns the number of power lines stored. Assumes that the
 * powerLines array is large enough to store all required power lines.
 */
int planGrid2(struct place cities[], int numCities,
              struct place powerPlants[], int numPowerPlants,
              struct powerLine powerLines[]) {
    // TODO: Complete this function
    return 0;
}
