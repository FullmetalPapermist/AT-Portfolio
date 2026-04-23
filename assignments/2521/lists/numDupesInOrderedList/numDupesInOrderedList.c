
#include "list.h"

int doNumDupesInOrderedList(struct node *curr) {
	if (curr == NULL) {
		return 0;
	} else if (curr->next == NULL) {
		return 0;
	} else if (curr->next->value == curr->value) {
		return 1 + doNumDupesInOrderedList(curr->next);
	} else {
		return doNumDupesInOrderedList(curr->next);
	}
}

int numDupesInOrderedList(List l) {
	return doNumDupesInOrderedList(l->head);
}

