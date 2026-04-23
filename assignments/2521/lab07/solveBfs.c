// BFS maze solver

#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#include "cell.h"
#include "matrix.h"
#include "Maze.h"
#include "Queue.h"

bool checkEdge(
    Maze m, 
    bool **visited, 
    struct cell **predecessor, 
    Queue q, 
    struct cell toCheck,
    struct cell v
    ) {
    
    if (toCheck.row < 0 || toCheck.col < 0) {
        return false;
    }

    if (toCheck.row >= MazeHeight(m) || toCheck.col >= MazeWidth(m)) {
        return false;
    }

    if (MazeIsWall(m, toCheck)) {
        return false;
    }

    if (visited[toCheck.row][toCheck.col]) {
        return false;
    }

    if (MazeVisit(m, toCheck)) {
        predecessor[toCheck.row][toCheck.col].row = v.row;
        predecessor[toCheck.row][toCheck.col].col = v.col;
        return true;
    }


    visited[toCheck.row][toCheck.col] = true;
    predecessor[toCheck.row][toCheck.col].row = v.row;
    predecessor[toCheck.row][toCheck.col].col = v.col;
    QueueEnqueue(q, toCheck);
    return false;
}

void markPath(Maze m, struct cell v, struct cell **predecessor) {
    if (v.row == MazeGetStart(m).row && v.col == MazeGetStart(m).col) {
        return;
    } else  {
        MazeMarkPath(m, predecessor[v.row][v.col]);
        markPath(m, predecessor[v.row][v.col], predecessor);
    }
}

bool solve(Maze m) {
    bool **visited = createBoolMatrix(MazeHeight(m), MazeWidth(m));
    struct cell **predecessor = createCellMatrix(MazeHeight(m), MazeWidth(m));

    Queue q = QueueNew();
    QueueEnqueue(q, MazeGetStart(m));
    if (MazeVisit(m, MazeGetStart(m)) == true) {
        MazeMarkPath(m, MazeGetStart(m));
        return true;
    }
    visited[MazeGetStart(m).row][MazeGetStart(m).col] = true;
    struct cell v;
    struct cell end = MazeGetStart(m);

    while(QueueSize(q) != 0) {
        v = QueueDequeue(q);
        struct cell toCheck = {v.row - 1, v.col};
        
        if (checkEdge(m, visited, predecessor, q, toCheck, v)) {
            end = toCheck;
            break;
        }
        
        toCheck.row = toCheck.row + 2;
        if (checkEdge(m, visited, predecessor, q, toCheck, v)) {
            end = toCheck;
            break;
        }

        toCheck.row = toCheck.row - 1;
        toCheck.col = toCheck.col - 1;
        if (checkEdge(m, visited, predecessor, q, toCheck, v)) {
            end = toCheck;
            break;
        }
        
        toCheck.col = toCheck.col + 2;
        if (checkEdge(m, visited, predecessor, q, toCheck, v)) {
            end = toCheck;
            break;
        }
    }

    if (!MazeVisit(m, end)) {
        QueueFree(q);
        freeBoolMatrix(visited);
        freeCellMatrix(predecessor);
        return false;

    } else {
        MazeMarkPath(m, end);
        markPath(m, end, predecessor);
        QueueFree(q);
        freeBoolMatrix(visited);
        freeCellMatrix(predecessor);
        return true;
    }
}

