
#include <stdio.h>
#include <stdlib.h>

struct node {
	int value;
	struct node *next;
};

struct node *insertOrdered(struct node *list, int value);

struct node *readList(int size);
struct node *newNode(int value);
void printList(struct node *list);
void freeList(struct node *list);

int main(void) {
	printf("Enter list size: ");
	int size = 0;
	if (scanf("%d", &size) != 1) {
		fprintf(stderr, "error: failed to read list size\n");
		exit(EXIT_FAILURE);
	} else if (size < 0) {
		fprintf(stderr, "error: invalid list size\n");
		exit(EXIT_FAILURE);
	}

	if (size > 0) {
		printf("Enter list values (must be in ascending order): ");
	}

	struct node *list = readList(size);

	printf("List: ");
	printList(list);

	printf("Enter value to insert: ");
	int value = 0;
	if (scanf("%d", &value) != 1) {
		fprintf(stderr, "error: failed to read value\n");
		exit(EXIT_FAILURE);
	}

	list = insertOrdered(list, value);
	printf("List after inserting %d: ", value);
	printList(list);

	freeList(list);
	return EXIT_SUCCESS;
}

// !!! DO NOT MODIFY THE CODE ABOVE !!!
////////////////////////////////////////////////////////////////////////
// Your task

struct node *insertOrdered(struct node *list, int value) {
	struct node *newNode = malloc(sizeof(struct node));
	
	newNode->value = value;
	newNode->next = NULL;
	
	if (list == NULL) {
		return newNode;
	}

	int isInserted = 0;

	struct node *curr = list; 
	
	if (value < curr->value) {
		newNode->next = list;
		return newNode;
	}

	while (curr->next != NULL) {
		if (!(isInserted) && (value <= curr->next->value)) {
			newNode->next = curr->next;
			curr->next = newNode;

			isInserted = 1;
		} else {
			curr = curr->next;
		}
	}
	if (!isInserted) {
		curr->next = newNode;
	}
	return list;
}

////////////////////////////////////////////////////////////////////////
// !!! DO NOT MODIFY THE CODE BELOW !!!

struct node *readList(int size) {
	struct node *list = NULL;
	struct node *curr = NULL;
	for (int i = 0; i < size; i++) {
		int value = 0;
		if (scanf("%d", &value) != 1) {
			fprintf(stderr, "error: failed to read list value\n");
			exit(EXIT_FAILURE);
		} else if (curr != NULL && value < curr->value) {
			fprintf(stderr, "error: list is not in ascending order\n");
			exit(EXIT_FAILURE);
		}

		struct node *new = newNode(value);
		if (list == NULL) {
			list = new;
		} else {
			curr->next = new;
		}
		curr = new;
	}
	return list;
}

struct node *newNode(int value) {
	struct node *new = malloc(sizeof(struct node));
	if (new == NULL) {
		fprintf(stderr, "error: out of memory\n");
		exit(EXIT_FAILURE);
	}

	new->value = value;
	new->next = NULL;
	return new;
}

void printList(struct node *list) {
	printf("[");
	for (struct node *curr = list; curr != NULL; curr = curr->next) {
		printf("%d", curr->value);
		if (curr->next != NULL) {
			printf(", ");
		}
	}
	printf("]\n");
}

void freeList(struct node *list) {
	struct node *curr = list;
	while (curr != NULL) {
		struct node *temp = curr;
		curr = curr->next;
		free(temp);
	}
}

