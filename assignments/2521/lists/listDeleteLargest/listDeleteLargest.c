
#include "list.h"

int listDeleteLargest(List l) {

	struct node *largest = l->head;
	struct node *largestPre = NULL;
	struct node *prev = NULL;

	for (struct node *curr = l->head; curr != NULL; curr = curr->next) {
		if (largest->value < curr->value) {
			largest = curr;
			largestPre = prev;
		}
		prev = curr;
	}
	
	int highest = largest->value;
	if (largestPre == NULL) {
		l->head = largest->next;
		free(largest);
	} else {
		largestPre->next = largest->next;
		free(largest);
	}

	return highest;
	
}

