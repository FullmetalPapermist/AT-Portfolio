```javascript
let data = {
    users: [
		{
			userId = 1234, 
			username = "username",
			password = "Password",
			email = "name@gmail.com", 
			firstName = "firstName", 
			lastName = "lastName", 
			dateCreated = 120323,
			numFailedPasswordsSinceLastLogin = 1,
			numSuccessfulLogins: 3,
		}
	],
	nextUserId: 2,

	quizzes: [
		{
			quizId = 123456,  
			quizTitle = "Example Quiz",  
			quizDescription = "An example quiz for students", 
			questions = [],  //Array of question objects
			ownerId = 123, //ID of the admin which owns the quiz
			usersInLobby = [],  //Array of user objects
			isJoinable = True,  //Check if quiz is joinable
			isRunning = False,  //Check if quiz is running
			timeCreated = 120323, //int or date
			timeLastEdited = 240323, //int or date,
		}
	],
	nextQuizId: 3,

	sessions: [
		{
			token = "a005b8c3-8523-4f05-bf3d-57cb70d1c9a7",
			userId = 1234,
		}
	]
}

```
NOTES:
Array of objects + using .find() with userId/quizId for lookup
Database of existing quizzes: Dict/Hash map of quiz objects