
#include "list.h"

struct node *doListReverse(struct node *curr, struct node *prev) {
	if (curr == NULL) {
		return NULL;
	}
	
	struct node *forward = doListReverse(curr->next, curr);
	curr->next = prev;
	if (forward == NULL) {
		return curr;

	} else {
		return forward;
	}
	
	
}

void listReverse(List l) {
	l->head = doListReverse(l->head, NULL);
	
}

