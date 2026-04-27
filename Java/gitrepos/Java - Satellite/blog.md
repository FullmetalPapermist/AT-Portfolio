Post 1
I chose to make Devices and Satellites implement the entity interface - this was to make implementing the Entity info response method cleaner but also avoiding creating a data class. Satellite and Device classes are abstract as they cannot be instantiated by the BlackoutController. I then extended these classes into relay and specialised satellites to separate their functionality and further specialised satellites into teleporting and standard satellites.I made these constructors protected so that the subclasses did not need to have different constructors (as the constructors are the same for all of them). I made getSpeed an abstract method as it will depend on the subclass (each of them implements by returning a static final int). While relay satellite does not store files I still put it under the entity to make the implementation cleaner - it is a satellite which stores 0 files. The setId methods are private since a entities are unable to be renamed according to the spec.
I grouped the devices and satellites together into one package to better organise the blackout package.

Post 2
I changed set position in the satellite class to protected so that Teleporting satellite would be able to teleport. I also added some helper functions to make the code more readable and avoid repeated sections of code within multiple classes and tests (for instance rotating 360 degrees).

Post 3
I added a direction variable to the satellite class which has protected methods to change the direction and access the direction (for the teleporting and relay satellites to implement the simulate method). This applies the single responsiblity principle as the Satellite class handles things general to all satellite. I also forwarded the simulate method to the satellite classes to prevent feature envy (of the blackout controller going too far deep into the satellite classes).

Post 4
I made getEntitiesInRange a protected method as it does not need to be accessed outside of the Entity class - I chose not to make this a common protective mehtod between devices and satellites as this not a method which needs to be called outside of use for subclasses even thought they have similar functions. Similarly with isInRange I made it a protected methode not put into the entity class. I put exceptions for illegal types in the controller testing and testing instanceof in isInRange make sure that these paths are covered in the tests.

Post 5
I tried to use streams as much as possible to avoid deep nested loops as much as possible. I used static methods to make this possible in Teleporting Satellite. I also implemented common code in abstract classes with the subclasses focusing on the specifics of a method e.g. simulate or get communicable entities. As the data became more advanced I tried to limit coupling as much as possible and method forward thought it was quite difficult with Teleporting Satellites.
I removed methods from entity such as setIsUploading since it was not a universal function and would need different calling methods for each subclass.

Post 6
Final reflections
The assignment helped me to understand to not just code and problem solve but do solve in a way that is easily maintainable, testable, readable and able to be extended. This was my first time properly coding having learnt object oriented programing - most of my code before was much more cluttered and was difficult to test. I found this assignment quite challenging as it got further since there were more connections between classes but was a really great learning experince. I definitely found the assignment more on the difficult side and quite time consuming and so the quality of my testing and class making was substantially harder as the assignment progressed. I learnt a lot though particularly on planning solutions with a UML first before coding which was really helpful for the first stage.
