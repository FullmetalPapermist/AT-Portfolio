// DFS maze solver

#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#include "cell.h"
#include "matrix.h"
#include "Maze.h"
#include "Stack.h"

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
    Stack s, 
    struct cell toCheck,
    struct cell v,
    struct cell *end);

void dfs(Maze m, 
    bool **visited, 
    struct cell **predecessor, 
    Stack s,
    struct cell *end);


bool checkEdge(
    Maze m, 
    bool **visited, 
    struct cell **predecessor, 
    Stack s, 
    struct cell toCheck,
    struct cell v,
    struct cell *end) {
    
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

    predecessor[toCheck.row][toCheck.col].row = v.row;
    predecessor[toCheck.row][toCheck.col].col = v.col;
    StackPush(s, toCheck);
    dfs(m, visited, predecessor, s, end);
    return false;
}

void dfs(Maze m, 
    bool **visited, 
    struct cell **predecessor, 
    Stack s,
    struct cell *end) {
    
    if (StackSize(s) == 0) {
        return;
    }

    struct cell v = StackPop(s);

    if (visited[v.row][v.col] == true) {
        dfs(m, visited, predecessor, s, end);
    }

    visited[v.row][v.col] = true;

    struct cell toCheck = {v.row - 1, v.col};

    if (checkEdge(m, visited, predecessor, s, toCheck, v, end)) {
        *end = toCheck;
        return;
    }
    
    toCheck.row = toCheck.row + 2;
    if (checkEdge(m, visited, predecessor, s, toCheck, v, end)) {
        *end = toCheck;
        return;
    }

    toCheck.row = toCheck.row - 1;
    toCheck.col = toCheck.col - 1;
    if (checkEdge(m, visited, predecessor, s, toCheck, v, end)) {
        *end = toCheck;
        return;
    }
    
    toCheck.col = toCheck.col + 2;
    if (checkEdge(m, visited, predecessor, s, toCheck, v, end)) {
        *end = toCheck;
        return;
    }
    
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
    
    Stack s = StackNew();
    StackPush(s, MazeGetStart(m));
    if (MazeVisit(m, MazeGetStart(m)) == true) {
        MazeMarkPath(m, MazeGetStart(m));
        return true;
    }

    struct cell end = MazeGetStart(m);

    
    dfs(m, visited, predecessor, s, &end);


    // while(StackSize(s) != 0) {
    //     v = StackPop(s);

    //     if (visited[v.row][v.col] == true) {
    //         continue;
    //     }

    //     visited[v.row][v.col] = true;

    //     struct cell toCheck = {v.row - 1, v.col};
        
    //     if (checkEdge(m, visited, predecessor, s, toCheck, v)) {
    //         end = toCheck;
    //         break;
    //     }
        
    //     toCheck.row = toCheck.row + 2;
    //     if (checkEdge(m, visited, predecessor, s, toCheck, v)) {
    //         end = toCheck;
    //         break;
    //     }

    //     toCheck.row = toCheck.row - 1;
    //     toCheck.col = toCheck.col - 1;
    //     if (checkEdge(m, visited, predecessor, s, toCheck, v)) {
    //         end = toCheck;
    //         break;
    //     }
        
    //     toCheck.col = toCheck.col + 2;
    //     if (checkEdge(m, visited, predecessor, s, toCheck, v)) {
    //         end = toCheck;
    //         break;
    //     }
    // }

    if (!MazeVisit(m, end)) {
        StackFree(s);
        freeBoolMatrix(visited);
        freeCellMatrix(predecessor);
        return false;

    } else {
        MazeMarkPath(m, end);
        markPath(m, end, predecessor);
        StackFree(s);
        freeBoolMatrix(visited);
        freeCellMatrix(predecessor);
        return true;
    }

}

