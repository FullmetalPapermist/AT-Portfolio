
#include "list.h"

bool doListIsDescending(struct node *curr, int prevValue) {
	if (curr == NULL) {
		return true;
	} else if (prevValue >= curr->value) {
		return doListIsDescending(curr->next, curr->value);
	} else {
		return false; 
	}
}

bool doListIsAscending(struct node *curr, int prevValue) {
	if (curr == NULL) {
		return true;
	} else if (prevValue <= curr->value) {
		return doListIsAscending(curr->next, curr->value);
	} else {
		return false; 
	}
}

bool listIsOrdered(List l) {
	if (l->head == NULL) {
		return true;
	}

	if (doListIsAscending(l->head, l->head->value)) {
		return true;
	}

	if (doListIsDescending(l->head, l->head->value)) {
		return true;
	}
	return false;
}

