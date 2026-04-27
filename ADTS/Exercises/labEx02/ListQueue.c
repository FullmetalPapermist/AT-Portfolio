// Implementation of the Queue ADT using a linked list

#include <assert.h>
#include <stdio.h>
#include <stdlib.h>

#include "Queue.h"

// DO NOT modify these structs
struct node {
	Item item;
	struct node *next;
};

struct queue {
	struct node *head;
	struct node *tail;
	int size;
};

/**
 * Creates a new empty queue
 */
Queue QueueNew(void) {
	Queue q = malloc(sizeof(*q));
	if (q == NULL) {
		fprintf(stderr, "couldn't allocate Queue\n");
		exit(EXIT_FAILURE);
	}

	q->head = NULL;
	q->tail = NULL;
	q->size = 0;
	return q;
}

/**
 * Frees all resources associated with the given queue
 */
void QueueFree(Queue q) {
	struct node *curr = q->head;
	while (curr != NULL) {
		struct node *temp = curr;
		curr = curr->next;
		free(temp);
	}
	free(q);
}

struct node *addNode(struct node *curr, struct node *new) {
	if (curr == NULL) {
		return new;
	} else {
		curr->next = addNode(curr->next, new);
		return curr;
	}
}

/**
 * Adds an item to the end of the queue
 */
void QueueEnqueue(Queue q, Item it) {
	q->size++;
	struct node *new = malloc(sizeof(struct node));
	if (q == NULL) {
		fprintf(stderr, "couldn't allocate node\n");
		exit(EXIT_FAILURE);
	}
	new->item = it;
	new->next = NULL;
	q->tail = new;
	q->head = addNode(q->head, new);
	
}

/**
 * Removes an item from the front of the queue and returns it
 * Assumes that the queue is not empty
 */
Item QueueDequeue(Queue q) {
	assert(q->size > 0);
	q->size--;
	if (q->size == 0) {
		q->tail = NULL;
	}

	struct node *temp = q->head;
	Item val = q->head->item;
	q->head = q->head->next;
	free(temp);
	return val;
}

/**
 * Gets the item at the front of the queue without removing it
 * Assumes that the queue is not empty
 */
Item QueueFront(Queue q) {
	assert(q->size > 0);

	return q->head->item;
}

/**
 * Gets the size of the given queue
 */
int QueueSize(Queue q) {
	return q->size;
}

/**
 * Returns true if the queue is empty, and false otherwise
 */
bool QueueIsEmpty(Queue q) {
	return q->size == 0;
}

/**
 * Prints the items in the queue to the given file with items space-separated
 */
void QueueDump(Queue q, FILE *fp) {
	for (struct node *curr = q->head; curr != NULL; curr = curr->next) {
		fprintf(fp, "%d ", curr->item);
	}
	fprintf(fp, "\n");
}

/**
 * Prints out information for debugging
 */
void QueueDebugPrint(Queue q) {

}

