
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "HashTable.h"

bool areSimilarStrings(char *s1, char *s2);

int main(int argc, char *argv[]) {
	if (argc != 3) {
		fprintf(stderr, "usage: %s <string 1> <string 2>\n", argv[0]);
		exit(EXIT_FAILURE);
	}

	bool result = areSimilarStrings(argv[1], argv[2]);
	printf("The strings %s similar\n", result ? "are" : "are not");
	return EXIT_SUCCESS;
}

// !!! DO NOT MODIFY THE CODE ABOVE !!!
////////////////////////////////////////////////////////////////////////

/**
 * Returns true if two strings are similar, and false otherwise. Two strings s1
 * and s2 are similar if, for each character in s1, it is possible to *uniquely*
 * replace it by another character (possibly itself) such that, after all
 * replacements are done to s1, we end up with s2. For example, the strings
 * "adt" and "bst" are similar, but "adt" and "dcc" are not.
 */
bool areSimilarStrings(char *s1, char *s2) {
	int i = 0;
	HashTable h1 = HashTableNew();
	HashTable h2 = HashTableNew();

	while (s1[i] != '\0' && s2[i] != '\0') {
		if ( HashTableContains(h1, s1[i]) || 
		HashTableContains(h2, s2[i])) {
			HashTableFree(h1);
			HashTableFree(h2);
			return false;
		}

		HashTableInsert(h1, s1[i], 1);
		HashTableInsert(h2, s2[i], 1);

		i++;
	}
	if (s1[i] == '\0' ^ s2[i] == '\0') {
		HashTableFree(h1);
		HashTableFree(h2);
		return false;		
	}

	HashTableFree(h1);
	HashTableFree(h2);
	return true;
}

