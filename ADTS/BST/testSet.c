// COMP2521 - Assignment 1

#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "Set.h"
#include "SetStructs.h"

void testSetFree(void);

void testSetInsert(void);
void testSetDelete(void);
void testSetSize(void);
void testSetContains(void);
void testSetPrint(void);
void checkFileContents(FILE *file, char *str);

void testSetUnion(void);
void testSetIntersection(void);
void testSetEquals(void);
void testSetSubset(void);

void testBalance1(void);
void testBalance2(void);
void testBalance3(void);
bool isHeightBalanced(struct node *t);
bool doIsHeightBalanced(struct node *t, int *height);

void testSetAtIndex(void);
void testSetIndexOf(void);

void testSetCursor1(void);
void testSetCursor2(void);

int main(int argc, char *argv[]) {
	testSetFree();
	testSetInsert();
	testSetDelete();
	testSetSize();
	testSetContains();
	testSetPrint();

	testSetUnion();
	testSetIntersection();
	testSetEquals();
	testSetSubset();

	testBalance1();
	testBalance2();
	testBalance3();

	testSetAtIndex();
	testSetIndexOf();

	// testSetCursor1();
	// testSetCursor2();
	printf("All tests passed\n");
}

void testSetFree(void) {
	Set s = SetNew();
	SetFree(s);
}

void testSetInsert(void) {
	// NOTE: SetInsert can't be tested on its own unless we directly
	//       access the internal representation of the ADT

	Set s = SetNew();
	SetInsert(s, 4);
	assert(s->tree->item == 4);
	SetInsert(s, 5);
	assert(s->tree->right->item == 5);
	SetInsert(s, 3);
	assert(s->tree->left->item == 3);
	SetInsert(s, 2);
	assert(s->tree->left->left->item == 2);
	
	// SetInsert(s, INT_MIN);
	SetFree(s);

}

void testSetDelete(void) {
	// NOTE: SetDelete can't be tested without SetInsert

	Set s = SetNew();
	SetDelete(s, 1);

	SetInsert(s, 5);
	SetDelete(s, 5);
	assert(SetSize(s) == 0);

	SetInsert(s, 5);
	SetInsert(s, 2);
	SetDelete(s, 2);

	SetInsert(s, 8);
	SetDelete(s, 8);
	assert(SetSize(s) == 1);
	

	SetInsert(s, 2);
	SetInsert(s, 6);
	SetInsert(s, 7);
	SetInsert(s, 4);
	SetInsert(s, 1);
	SetInsert(s, 3);
	SetDelete(s, 3);
	assert(SetSize(s) == 6);

	SetFree(s);
}

void testSetSize(void) {
	Set s = SetNew();
	assert(SetSize(s) == 0);
	SetInsert(s, 5);
	assert(SetSize(s) == 1);
	SetInsert(s, 2);
	SetInsert(s, 8);
	SetInsert(s, 4);
	assert(SetSize(s) == 4);
	SetInsert(s, 7);
	SetInsert(s, 2);
	assert(SetSize(s) == 5);

	SetFree(s);
}

void testSetContains(void) {
	Set s = SetNew();
	assert(!SetContains(s, 3));
	SetInsert(s, 5);
	SetInsert(s, 2);
	SetInsert(s, 8);
	SetInsert(s, 4);
	assert(SetContains(s, 2));
	assert(SetContains(s, 4));
	assert(SetContains(s, 5));
	assert(SetContains(s, 8));
	assert(!SetContains(s, 3));

	SetFree(s);
}

void testSetPrint(void) {

	Set s = SetNew();
	// SetInsert(s, 5);
	// SetInsert(s, 2);
	// SetInsert(s, 8);
	// SetInsert(s, 4);
	// SetInsert(s, 3);
	// SetPrint(s, stdout);


	FILE *out = tmpfile();
	SetPrint(s, out);
	checkFileContents(out, "{}");
	fclose(out);

	SetInsert(s, 5);
	out = tmpfile();
	SetPrint(s, out);
	checkFileContents(out, "{5}");
	fclose(out);

	SetInsert(s, 2);
	
	out = tmpfile();
	SetPrint(s, out);
	checkFileContents(out, "{2, 5}");
	fclose(out);

	SetInsert(s, 8);
	SetInsert(s, 4);

	// SetPrint(s, stdout);
	// printf("\n");

	out = tmpfile();
	SetPrint(s, out);
	checkFileContents(out, "{2, 4, 5, 8}");
	fclose(out);

	SetFree(s);
}

/**
 * This function checks if the contents of a file matches the expected
 * contents. If the contents do not match, the program will exit with an
 * assertion error.
 */
void checkFileContents(FILE *file, char *expectedContents) {
	fflush(file);
	fseek(file, 0, SEEK_SET);
	char *line = NULL;
	size_t n = 0;
	getline(&line, &n, file);
	assert(strcmp(line, expectedContents) == 0);
	free(line);
}

////////////////////////////////////////////////////////////////////////

void testSetUnion(void) {
	Set a = SetNew();
	Set b = SetNew();
	Set c = SetUnion(a, b);
	assert(SetSize(c) == 0);

	SetFree(c);

	SetInsert(a, 5);
	SetInsert(a, 2);
	SetInsert(a, 8);
	SetInsert(a, 4);

	SetInsert(b, 3);
	SetInsert(b, 8);
	SetInsert(b, 7);
	SetInsert(b, 5);

	c = SetUnion(a, b);
	assert(SetContains(c, 2));
	assert(SetContains(c, 3));
	assert(SetContains(c, 4));
	assert(SetContains(c, 5));
	assert(SetContains(c, 7));
	assert(SetContains(c, 8));
	assert(SetSize(c) == 6);

	SetFree(a);
	SetFree(b);
	SetFree(c);
}

void testSetIntersection(void) {
	Set a = SetNew();
	Set b = SetNew();
	Set c = SetIntersection(a, b);
	assert(SetSize(c) == 0);

	free(c);

	SetInsert(a, 5);
	SetInsert(a, 2);
	SetInsert(a, 8);
	SetInsert(a, 4);

	SetInsert(b, 3);
	SetInsert(b, 8);
	SetInsert(b, 7);
	SetInsert(b, 5);

	c = SetIntersection(a, b);
	assert(SetContains(c, 5));
	assert(SetContains(c, 8));
	assert(!SetContains(c, 2));
	assert(!SetContains(c, 3));
	assert(!SetContains(c, 4));
	assert(!SetContains(c, 7));
	assert(SetSize(c) == 2);

	SetFree(a);
	SetFree(b);
	SetFree(c);
}

void testSetEquals(void) {
	Set a = SetNew();
	Set b = SetNew();
	Set c = SetNew();
	assert(SetEquals(a, b));
	assert(SetEquals(b, c));
	assert(SetEquals(a, c));

	SetInsert(a, 4);
	SetInsert(a, 2);
	SetInsert(a, 7);
	SetInsert(a, 1);

	SetInsert(b, 2);
	SetInsert(b, 4);
	SetInsert(b, 1);
	SetInsert(b, 7);

	SetInsert(c, 4);
	SetInsert(c, 2);
	SetInsert(c, 7);
	SetInsert(c, 3);

	assert(SetEquals(a, b));
	assert(!SetEquals(a, c));

	SetFree(a);
	SetFree(b);
	SetFree(c);
}

void testSetSubset(void) {
	Set a = SetNew();
	Set b = SetNew();
	Set c = SetNew();
	Set d = SetNew();
	assert(SetEquals(a, b));
	assert(SetEquals(b, c));
	assert(SetEquals(a, c));

	SetInsert(a, 5);
	SetInsert(a, 3);
	SetInsert(a, 6);

	SetInsert(b, 3);
	SetInsert(b, 9);
	SetInsert(b, 5);
	SetInsert(b, 6);

	SetInsert(c, 4);
	SetInsert(c, 6);
	SetInsert(c, 3);
	SetInsert(c, 7);

	SetInsert(d, 5);
	SetInsert(d, 6);
	SetInsert(d, 3);

	assert(SetSubset(a, b));
	assert(!SetSubset(a, c));
	assert(SetSubset(a, d));

	SetFree(a);
	SetFree(b);
	SetFree(c);
	SetFree(d);
}

////////////////////////////////////////////////////////////////////////

void testBalance1(void) {
	Set RR = SetNew();
	SetInsert(RR, 1);
	SetInsert(RR, 2);
	SetInsert(RR, 3);
	assert(isHeightBalanced(RR->tree));
	SetFree(RR);

	Set RL = SetNew();
	SetInsert(RL, 1);
	SetInsert(RL, 3);
	SetInsert(RL, 2);
	assert(isHeightBalanced(RL->tree));
	SetFree(RL);

	Set LR = SetNew();
	SetInsert(LR, 3);
	SetInsert(LR, 1);
	SetInsert(LR, 2);
	assert(isHeightBalanced(LR->tree));
	SetFree(LR);
	
	Set LL = SetNew();
	SetInsert(LL, 3);
	SetInsert(LL, 2);
	SetInsert(LL, 1);
	assert(isHeightBalanced(LL->tree));
	SetFree(LL);

	Set s = SetNew();
	
	SetInsert(s, 8);
	SetInsert(s, 5);
	SetInsert(s, 2);

	// The tree should have been rebalanced after inserting 2
	// NOTE: Normally, a user should not have access to the concrete
	//       representation of an ADT, but since we have #included
	//       SetStructs.h, we have access for testing purposes.
	assert(isHeightBalanced(s->tree));

	SetFree(s);
}

void testBalance2(void) {
	// RR rebalancing
	Set s = SetNew();
	SetInsert(s, 5);
	SetInsert(s, 1);
	SetInsert(s, 6);
	SetInsert(s, 7);
	SetDelete(s, 1);
	assert(isHeightBalanced(s->tree));
	SetFree(s);

	// LR rebalance
	s = SetNew();
	SetInsert(s, 5);
	SetInsert(s, 3);
	SetInsert(s, 7);
	SetInsert(s, 4);
	SetDelete(s, 7);
	assert(isHeightBalanced(s->tree));
	SetFree(s);

	// RL rebalance
	s = SetNew();
	SetInsert(s, 5);
	SetInsert(s, 3);
	SetInsert(s, 7);
	SetInsert(s, 6);
	SetDelete(s, 3);
	assert(isHeightBalanced(s->tree));
	SetFree(s);

	// LL rebalance

	s = SetNew();
	SetInsert(s, 4);
	SetInsert(s, 2);
	SetInsert(s, 7);
	SetInsert(s, 1);
	SetDelete(s, 7);

	// The tree should have been rebalanced after deleting 7
	assert(isHeightBalanced(s->tree));

	SetFree(s);
}

void testBalance3(void) {
	// Big LL tree
	Set s = SetNew();
	SetInsert(s, 10);
	SetInsert(s, 15);
	SetInsert(s, 5);
	SetInsert(s, 3);
	SetInsert(s, 7);
	SetInsert(s, 13);
	SetInsert(s, 17);
	SetInsert(s, 6);
	SetInsert(s, 2);
	SetInsert(s, 4);
	SetInsert(s, 1);
	assert(isHeightBalanced(s->tree));
	assert(s->tree->item == 5);
	SetFree(s);

	// Big LR tree
	s = SetNew();
	SetInsert(s, 10);
	SetInsert(s, 15);
	SetInsert(s, 5);
	SetInsert(s, 3);
	SetInsert(s, 7);
	SetInsert(s, 13);
	SetInsert(s, 17);
	SetInsert(s, 2);
	SetInsert(s, 6);
	SetInsert(s, 9);
	SetInsert(s, 8);
	assert(isHeightBalanced(s->tree));
	assert(s->tree->item == 7);
	SetFree(s);

	// Big RL tree
	s = SetNew();
	SetInsert(s, 10);
	SetInsert(s, 15);
	SetInsert(s, 5);
	SetInsert(s, 3);
	SetInsert(s, 7);
	SetInsert(s, 13);
	SetInsert(s, 17);
	SetInsert(s, 16);
	SetInsert(s, 12);
	SetInsert(s, 14);
	SetInsert(s, 11);
	assert(isHeightBalanced(s->tree));
	assert(s->tree->item == 13);
	SetFree(s);
	
	// Big RR tree
	s = SetNew();
	SetInsert(s, 10);
	SetInsert(s, 15);
	SetInsert(s, 5);
	SetInsert(s, 3);
	SetInsert(s, 7);
	SetInsert(s, 13);
	SetInsert(s, 17);
	SetInsert(s, 12);
	SetInsert(s, 16);
	SetInsert(s, 18);
	SetInsert(s, 19);
	assert(isHeightBalanced(s->tree));
	assert(s->tree->item == 15);
	SetFree(s);
}

/**
 * Checks if the given tree is height-balanced
 */
bool isHeightBalanced(struct node *t) {
	int height = -1;
	return doIsHeightBalanced(t, &height);
}

bool doIsHeightBalanced(struct node *t, int *height) {
	if (t == NULL) {
		*height = -1;
		return true;
	}

	int lHeight = -1;
	int rHeight = -1;
	if (doIsHeightBalanced(t->left, &lHeight)
			&& doIsHeightBalanced(t->right, &rHeight)
			&& abs(lHeight - rHeight) <= 1) {
		*height = (lHeight > rHeight ? lHeight : rHeight) + 1;
		return true;
	} else {
		return false;
	}
}

////////////////////////////////////////////////////////////////////////

void testSetAtIndex(void) {
	Set s = SetNew();

	SetInsert(s, 5);
	SetInsert(s, 2);
	SetInsert(s, 8);
	SetInsert(s, 4);
	assert(SetAtIndex(s, -1) == UNDEFINED);

	assert(SetAtIndex(s, 0) == 2);
	assert(SetAtIndex(s, 1) == 4);
	assert(SetAtIndex(s, 2) == 5);
	assert(SetAtIndex(s, 3) == 8);

	SetInsert(s, 3);

	assert(SetAtIndex(s, 0) == 2);
	assert(SetAtIndex(s, 1) == 3);
	assert(SetAtIndex(s, 2) == 4);
	assert(SetAtIndex(s, 3) == 5);
	assert(SetAtIndex(s, 4) == 8);

	SetFree(s);

	s = SetNew();
	
	SetInsert(s, 1);
	SetInsert(s, 2);
	SetInsert(s, 3);
	assert(SetAtIndex(s, 0) == 1);
	assert(SetAtIndex(s, 1) == 2);
	assert(SetAtIndex(s, 2) == 3);
	
	SetFree(s);
	
	s = SetNew();
	
	SetInsert(s, 1);
	SetInsert(s, 3);
	SetInsert(s, 2);
	assert(SetAtIndex(s, 0) == 1);
	assert(SetAtIndex(s, 1) == 2);
	assert(SetAtIndex(s, 2) == 3);
	
	SetFree(s);
	
	s = SetNew();
	
	SetInsert(s, 3);
	SetInsert(s, 2);
	SetInsert(s, 1);
	assert(SetAtIndex(s, 0) == 1);
	assert(SetAtIndex(s, 1) == 2);
	assert(SetAtIndex(s, 2) == 3);
	
	SetFree(s);
	
	s = SetNew();
	
	SetInsert(s, 3);
	SetInsert(s, 1);
	SetInsert(s, 2);
	assert(SetAtIndex(s, 0) == 1);
	assert(SetAtIndex(s, 1) == 2);
	assert(SetAtIndex(s, 2) == 3);
	
	SetFree(s);
}

void testSetIndexOf(void) {
	Set s = SetNew();

	SetInsert(s, 5);
	SetInsert(s, 2);
	SetInsert(s, 8);
	SetInsert(s, 4);
	
	assert(SetIndexOf(s, 1) == -1);
	assert(SetIndexOf(s, 2) == 0);
	assert(SetIndexOf(s, 4) == 1);
	assert(SetIndexOf(s, 5) == 2);
	assert(SetIndexOf(s, 8) == 3);

	SetInsert(s, 3);

	assert(SetIndexOf(s, 2) == 0);
	assert(SetIndexOf(s, 3) == 1);
	assert(SetIndexOf(s, 4) == 2);
	assert(SetIndexOf(s, 5) == 3);
	assert(SetIndexOf(s, 8) == 4);

	SetFree(s);
}

////////////////////////////////////////////////////////////////////////

void testSetCursor1(void) {
	Set s = SetNew();

	SetInsert(s, 5);
	SetInsert(s, 2);
	SetInsert(s, 8);
	SetInsert(s, 4);

	SetCursor cur = SetCursorNew(s);
	// start  2  4  5  8  end
	//   ^
	assert(SetCursorGet(cur) == UNDEFINED);

	assert(SetCursorNext(cur));
	// start  2  4  5  8  end
	//        ^
	assert(SetCursorGet(cur) == 2);

	assert(SetCursorNext(cur));
	// start  2  4  5  8  end
	//           ^
	assert(SetCursorGet(cur) == 4);

	assert(SetCursorNext(cur));
	// start  2  4  5  8  end
	//              ^
	assert(SetCursorGet(cur) == 5);

	assert(SetCursorNext(cur));
	// start  2  4  5  8  end
	//                 ^
	assert(SetCursorGet(cur) == 8);

	assert(!SetCursorNext(cur));
	// start  2  4  5  8  end
	//                     ^
	assert(SetCursorGet(cur) == UNDEFINED);

	assert(SetCursorPrev(cur));
	// start  2  4  5  8  end
	//                 ^
	assert(SetCursorGet(cur) == 8);

	assert(SetCursorPrev(cur));
	// start  2  4  5  8  end
	//              ^
	assert(SetCursorGet(cur) == 5);

	assert(SetCursorPrev(cur));
	// start  2  4  5  8  end
	//           ^
	assert(SetCursorGet(cur) == 4);

	assert(SetCursorPrev(cur));
	// start  2  4  5  8  end
	//        ^
	assert(SetCursorGet(cur) == 2);

	assert(!SetCursorPrev(cur));
	// start  2  4  5  8  end
	//   ^
	assert(SetCursorGet(cur) == UNDEFINED);

	SetCursorFree(cur);
	SetFree(s);
}

void testSetCursor2(void) {
	Set s = SetNew();

	SetInsert(s, 5);
	SetInsert(s, 2);
	SetInsert(s, 8);
	SetInsert(s, 4);

	SetCursor cur = SetCursorNew(s);
	// start  2  4  5  8  end
	//   ^
	assert(SetCursorGet(cur) == UNDEFINED);

	assert(SetCursorNext(cur));
	// start  2  4  5  8  end
	//        ^
	assert(SetCursorGet(cur) == 2);

	SetInsert(s, 3);
	// start  2  3  4  5  8  end
	//        ^

	assert(SetCursorNext(cur));
	// start  2  3  4  5  8  end
	//           ^
	assert(SetCursorGet(cur) == 3);

	SetDelete(s, 4);
	// start  2  3  5  8  end
	//           ^

	assert(SetCursorNext(cur));
	// start  2  3  5  8  end
	//              ^
	assert(SetCursorGet(cur) == 5);

	SetCursorFree(cur);
	SetFree(s);
}

