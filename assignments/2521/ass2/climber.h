// Alexander Tan (z5477240) 18/4/24
// Interface to boulder climbing algorithms

#ifndef CLIMBER_H
#define CLIMBER_H

#include "Wall.h"

struct path {
    int numRocks;
    struct rock *rocks;
};

/**
 * Finds the shortest path to climb on a certain difficulty and returns the path
*/
struct path findShortestPath(Wall w, int reach, Colour colour);

/**
 * Returns the minimum energy path to climb a wall
*/
struct path findMinEnergyPath(Wall w, int reach, int energyCosts[NUM_COLOURS]);

/**
 * Returns the path to climb a wall in the shortest turns and highest energy
*/
struct path findMinTurnsPath(Wall w, int reach, int energyCosts[NUM_COLOURS],
                             int maxEnergy);

#endif

