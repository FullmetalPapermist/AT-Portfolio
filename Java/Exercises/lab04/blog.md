Part A: Internal intimacy. Enrolment class reaches into grade class. The solution is to create function to check if the grade is a pass in the grade function

Part B:
The student class accesses the grade class through the enrolment class. The code smell that lead to this is the long chaining of methods. The solution is to put boolean methods into the enrolment class. This is also present in the course offering class.

Part C:
The course offering extends course however also has-a course. This violates the LSP. Removing extending the class and the super constructor fixes this smell.

Task 3:
The anonymous class is significantly longer than the one line sort function. Using streams the sorting method is much cleaner and uses significantly less if statements.

Thoughts:
This task taught me a lot about streams - it was a little challenging as I needed to research how to use streams but it made coding a lot cleaner.

Explain why the code is consistent with the preconditions and postconditions.
The logged bank account has the same limitations as the bank account since the input and outputs of the methods is the same. The logged bank account adds to the post conditions that the action will be logged however all of the pre and post conditiion from the bank account carries over.

Explain why balance >= 0 is a class invariant for both classes. I.e., give a small informal proof of why this is always true if your preconditions are met.
The preconditions state that the amount withdrawn will never be more than the balance hence the balance will never go below 0.

Are your class definitions consistent with the Liskov Substitution Principle?
Yes - the logged bank account utilises all methods and variables of the bank account. The bank account replaced the logged bank account it would not lose its functionality.
