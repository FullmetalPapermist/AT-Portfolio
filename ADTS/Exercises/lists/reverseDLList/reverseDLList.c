
#include "list.h"

void doReverseDLList(struct node *curr) {
	if (curr == NULL) {
		return;
	} else {
		struct node *temp = curr->next;
		curr->next = curr->prev;
		curr->prev = temp;
		doReverseDLList(curr->next); 
	}
	
}

void reverseDLList(List l) {
	struct node *temp = l->first;
	l->first = l->last;
	l->last = temp;
	doReverseDLList(l->first);
}

