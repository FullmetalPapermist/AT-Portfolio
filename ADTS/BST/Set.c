// Implementation of the Set ADT
// COMP2521 - Assignment 1

#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#include "Set.h"
#include "SetStructs.h"

////////////////////////////////////////////////////////////////////////
// BST operations

/**
 * Creates a new BST node
 * Taken frrom https://cgi.cse.unsw.edu.au/~cs2521/24T1/lab/4/questions
 */
static struct node *bstNew(int item) {
	struct node *n = malloc(sizeof(struct node)); 
	n->item = item;
	n->left = NULL;
	n->right = NULL;
	n->height = 0;
	n->leftChildren = 0;
	n->rightChildren = 0;
	return n;
}

/**
 * Frees a bst
 */
static void bstFree(struct node *tree) {
	if (tree == NULL) {
		return;
	} else {
		bstFree(tree->left);
		bstFree(tree->right);
		free(tree);
	}
}

/**
 * Returns max node from a BST tree
 */
static struct node *bstMax(struct node *t) {
	if (t == NULL) {
		return t;
	} else if (t->right == NULL) {
		return t;
	} else {
		return bstMax(t->right);
	}
}

/**
 * Returns min node from a BST tree
 */
static struct node *bstMin(struct node *t) {
	if (t == NULL) {
		return t;
	} else if (t->left == NULL) {
		return t;
	} else {
		return bstMin(t->left);
	}
}

/**
 * Joins two BST trees given max(t1) < min(t2)
 * Returns new head
 * Taken from:
 * https://cgi.cse.unsw.edu.au/~cs2521/24T1/lectures/slides/week03thu-bsts.pdf
 */
static struct node *bstJoin(struct node *t1, struct node *t2) {
	if (t1 == NULL) {
		return t2;	
	} else if (t2 == NULL) {
		return t1;
	} else if (bstMin(t2) > bstMax(t1)) {
		fprintf(stderr, "invalid trees to join\n");
		exit(EXIT_FAILURE);
	} else {
		struct node *curr = t2;
		struct node *parent = NULL;
		while (curr->left != NULL) {
			parent = curr;
			curr = curr->left;
		}
		if (parent != NULL) {
			parent->left = curr->right;
			curr->right = t2;
		}
		curr->left = t1;
		return curr;
	}
}

/**
 * Deletes n and returns new tree
 * Taken from:
 * https://cgi.cse.unsw.edu.au/~cs2521/24T1/lectures/slides/week04tue-avl-trees.pdf
 */
static struct node *bstDelete(struct node *n) {
	if (n->left == NULL && n->right == NULL) {
		free(n);
		return NULL;
	} else if (n->left == NULL) {
		struct node *temp = n->right;
		free(n);
		return temp;
	} else if (n->right == NULL) {
		struct node *temp = n->left;
		free(n);
		return temp;
	} else {
		struct node *temp = bstJoin(n->left, n->right);
		free(n);
		return temp;
	}
}

/**
 * Returns the greater of two integers
 */
static int max(int a, int b) {
	if (a > b) {
		return a;
	} else {
		return b;
	}
}

/**
 * Sets the height for the node
 */
static void bstSetHeight(struct node *t) {
	if (t == NULL) {
		return;
	} else if (t->left == NULL && t->right == NULL) {
		t->height = 0;
		return;
	} else if (t->right == NULL) {
		t->height = t->left->height + 1;
	} else if (t->left == NULL) {
		t->height = t->right->height + 1;
	} else {
		t->height = 1 + max(t->left->height, t->right->height);
	}

}

/**
 * Sets right and left children for the node
 */
static void bstSetChildren(struct node *t) {
	t->leftChildren = 0;
	t->rightChildren = 0;
	if (t->left != NULL) {
		t->leftChildren = t->left->leftChildren + t->left->rightChildren + 1;
	}
	if (t->right != NULL) {
		t->rightChildren = t->right->leftChildren + t->right->rightChildren + 1;
	}
}

/**
 * Rotates tree t left i.e. t->right becomes the root  
 * Taken from:
 * https://cgi.cse.unsw.edu.au/~cs2521/24T1/lectures/slides/week04tue-balancing-bsts.pdf
 */
static struct node *bstRotateLeft(struct node *t) {
	if (t == NULL || t->right == NULL) {
		return t;
	}

	struct node *root = t->right;
	t->right = root->left;
	root->left = t;
	bstSetHeight(root->left);
	bstSetChildren(root->left);
	bstSetHeight(root);
	bstSetChildren(root);
	return root;
}

/**
 * Rotates tree t left i.e. t->right becomes the root
 * Taken from:
 * https://cgi.cse.unsw.edu.au/~cs2521/24T1/lectures/slides/week04tue-balancing-bsts.pdf
 */
static struct node *bstRotateRight(struct node *t) {
	if (t == NULL || t->left == NULL) {
		return t;
	}

	struct node *root = t->left;
	t->left = root->right;
	root->right = t;
	bstSetHeight(root->right);
	bstSetChildren(root->right);
	bstSetHeight(root);
	bstSetChildren(root);
	return root;
}

/**
 * Returns the balance of the node t
 * Taken from:
 * https://cgi.cse.unsw.edu.au/~cs2521/24T1/lectures/slides/week04tue-avl-trees.pdf
 */
static int bstBalance(struct node *t) {
	if (t == NULL) {
		return 0;
	}
	int leftHeight = 0;
	int rightHeight = 0;
	if (t->left != NULL) {
		leftHeight = 1 + t->left->height;
	}
	
	if (t->right != NULL) {
		rightHeight = 1 + t->right->height;
	}
	return leftHeight - rightHeight;
}

/**
 * Balancing the tree according to the avl
 * Taken from:
 * https://cgi.cse.unsw.edu.au/~cs2521/24T1/lectures/slides/week04tue-avl-trees.pdf
 */
static struct node *avlRebalance(struct node *t) {
	bstSetHeight(t);
	int balance = bstBalance(t);
	
	if (balance > 1) {
		if (bstBalance(t->left) < 0) {
			t->left = bstRotateLeft(t->left);
		}
		t = bstRotateRight(t);
	} else if (balance < -1) {
		if (bstBalance(t->right) > 0 ) {
			t->right = bstRotateRight(t->right);
		}
		t = bstRotateLeft(t);
	}
	return t;
}

// Basic Set Operations

/**
 * Creates a new empty set
 */
Set SetNew(void) {
	struct set *s = malloc(sizeof(struct set));
	if (s == NULL) {
		fprintf(stderr, "couldn't allocate Set\n");
		exit(EXIT_FAILURE);
	}
	s->size = 0;
	s->tree = NULL;
	return s;
}

/**
 * Frees all memory allocated to the set
 */
void SetFree(Set s) {
	bstFree(s->tree);
	free(s);
}

/**
 * Helper function for SetInsert 
 */
static struct node *doSetInsert(struct node *t, int item, Set s) {
	if (t == NULL) {
		struct node *leaf = bstNew(item);
		return leaf;
	} else if (item == t->item) {
		s->size--;
		return t;
	}
	 else if (item > t->item) {
		t->rightChildren++;
		t->right = doSetInsert(t->right, item, s);
	} else {
		t->leftChildren++;
		t->left = doSetInsert(t->left, item, s);
	}
	return avlRebalance(t);
}

/**
 * Inserts an item into the set
 */
void SetInsert(Set s, int item) {
	if (item == INT_MIN) {
		fprintf(stderr, "Cannot insert UNDEFINED\n");
		exit(EXIT_FAILURE);
	}
	s->size++;

	if (s->tree == NULL) {		
		s->tree = bstNew(item);
	} else {
		s->tree = doSetInsert(s->tree, item, s);
	}
}

/**
 * Helper function for SetDelete (avl delete)
 */
static struct node *doSetDelete(Set s, int item, struct node *t) {
	if (t == NULL) {
		return t;
	}

	if (t->item == item) {
		s->size--;
		return bstDelete(t);
	} else if (item > t->item) {
		t->rightChildren--;
		t->right = doSetDelete(s, item, t->right);
	} else {
		t->leftChildren--;
		t->left = doSetDelete(s, item, t->left);
	}
	
	return avlRebalance(t);
}

/**
 * Deletes an item from the set
 */
void SetDelete(Set s, int item) {
	s->tree = doSetDelete(s, item, s->tree);
}

/**
 * Returns the number of elements in the set
 */
int SetSize(Set s) {
	return s->size;
}

/**
 * Helper function for SetContains
 */
static struct node *doSetContains(struct node *t, int item) {
	if (t == NULL) {
		return NULL;
	} else if (item == t->item) {
		return t;
	} else if (item > t->item) {
		return doSetContains(t->right, item);
	} else {
		return doSetContains(t->left, item);
	}
}

/**
 * Returns true if the set contains the given item, and false otherwise
 */
bool SetContains(Set s, int item) {
	if (doSetContains(s->tree, item) == NULL) {
		return false;
	} else {
		return true;
	}
}

/**
 * Helper function for SetPrint
 */
static void doSetPrint(struct node *t, FILE *out, int max) {
	if (t == NULL) {
		return;
	}
	doSetPrint(t->left, out, max);
	if (t->item == max) {
		fprintf(out, "%d", t->item);
	} else {
		fprintf(out, "%d, ", t->item);
	}
	doSetPrint(t->right, out, max);
}

/**
 * Prints the elements in the set to the given file in ascending order
 * between curly braces, with items separated by a comma and space
 */
void SetPrint(Set s, FILE *out) {
	fprintf(out, "{");
	if (s->tree != NULL) {
		doSetPrint(s->tree, out, bstMax(s->tree)->item);
	}
	fprintf(out, "}");
}

////////////////////////////////////////////////////////////////////////
// Common Set Operations

static void doSetUnion(struct set *s, struct node *t) {
	if (t == NULL) {
		return;
	}
	SetInsert(s, t->item);
	doSetUnion(s, t->left);
	doSetUnion(s, t->right);
}

/**
 * Returns a new set representing the union of the two sets
 */
Set SetUnion(Set s1, Set s2) {
	Set s = SetNew();
	doSetUnion(s, s1->tree);
	doSetUnion(s, s2->tree);
	return s;
}

/**
 * Helper function for SetIntersection
 * Works better when a is a smaller tree! (searches b)
 */
static void doSetIntersection(struct set *set, struct node *n, struct set *s) {
	if (n == NULL) {
		return;
	}

	if (SetContains(s, n->item)) {
		SetInsert(set, n->item);
	}

	doSetIntersection(set, n->left, s);
	doSetIntersection(set, n->right, s);
}

/**
 * Returns a new set representing the intersection of the two sets
 */
Set SetIntersection(Set s1, Set s2) {
	Set s = SetNew();
	if (s1->size > s2->size) {
		doSetIntersection(s, s2->tree, s1);
	} else {
		doSetIntersection(s, s1->tree, s2);
	}
	return s;
}

/**
 * Helper function for SetEquals
 */
static bool doSetEquals(struct node *n, struct set *s) {
	if (n == NULL) {
		return true;
	}

	if (!SetContains(s, n->item)) {
		return false;
	}

	return doSetEquals(n->left, s) && doSetEquals(n->right, s);
}

/**
 * Returns true if the two sets are equal, and false otherwise
 */
bool SetEquals(Set s1, Set s2) {
	if (s1->size != s2->size) {
		return false;
	}
 
	return doSetEquals(s1->tree, s2);
}

/**
 * Helper function for SetSubset
 */
static bool doSetSubset(struct node *n, struct set *s) {
	if (n == NULL) {
		return true;
	}

	if (!SetContains(s, n->item)) {
		return false;
	}

	return doSetSubset(n->left, s) && doSetSubset(n->right, s);
}

/**
 * Returns true if set s1 is a subset of set s2, and false otherwise
 */
bool SetSubset(Set s1, Set s2) {
	if (s1->size > s2->size) {
		return false;
	}

	return doSetSubset(s1->tree, s2);
}

////////////////////////////////////////////////////////////////////////
// Index Operations

/**
 * Helper function for SetAtIndex
 */
static int doSetAtIndex(struct node *n, int index) {
	if (index == n->leftChildren) {
		return n->item;
	} else if (index < n->leftChildren) {
		return doSetAtIndex(n->left, index);
	} else {
		return doSetAtIndex(n->right, index - n->leftChildren - 1);
	}
}

/**
 * Returns the element at the given index, or UNDEFINED if the given
 * index is outside the range [0, n - 1] where n is the size of the set
 */
int SetAtIndex(Set s, int index) {
	if (index < 0 || index >= s->size) {
		return UNDEFINED;
	}
	
	return doSetAtIndex(s->tree, index);
}

/**
 * Helper function for SetIndexOf
 */
static int doSetIndexOf(struct node *n, int elem) {
	if (n == NULL) {
		return -1;
	}
	
	if (n->item == elem) {
		return n->leftChildren;
	} else if (n->item > elem) {
		return doSetIndexOf(n->left, elem);	
	} else {
		int result = doSetIndexOf(n->right, elem);
		if (result != -1) {
			result += n->leftChildren + 1;
		}
		return result;
	}
}

/**
 * Returns the index of the given element in the set if it exists, and
 * -1 otherwise
 */
int SetIndexOf(Set s, int elem) {
	return doSetIndexOf(s->tree, elem);
}

////////////////////////////////////////////////////////////////////////
// Cursor Operations

/**
 * Creates a new cursor positioned at the *start* of the set
 * (see the spec for details)
 */
SetCursor SetCursorNew(Set s) {
	// TODO
	return NULL;
}

/**
 * Frees all memory allocated to the given cursor
 */
void SetCursorFree(SetCursor cur) {
	// TODO
}

/**
 * Returns the element at the cursor's position, or UNDEFINED if the
 * cursor is positioned at the *start* or *end* of the set
 */
int SetCursorGet(SetCursor cur) {
	// TODO
	return UNDEFINED;
}

/**
 * Moves the cursor to the next greatest element, or to the end of the
 * set if there is no next greatest element. Does not move the cursor if
 * it is already at the end. Returns false if the cursor is at the end
 * after this operation, and true otherwise.
 */
bool SetCursorNext(SetCursor cur) {
	// TODO
	return false;
}

/**
 * Moves the cursor to the next smallest element, or to the start of the
 * set if there is no next smallest element. Does not move the cursor if
 * it is already at the start. Returns false if the cursor is at the
 * start after this operation, and true otherwise.
 */
bool SetCursorPrev(SetCursor cur) {
	// TODO
	return false;
}

////////////////////////////////////////////////////////////////////////

