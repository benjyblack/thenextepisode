1. Should be able to swap with any other storage engine (currently using chrome extension storage)
2. Should be able to test easily
3. Should be able to extend easily
4. Shouldn't have race conditions

###Object-Oriented Approach
1. Lots of classes, those classes have methods and state. Even the Container itself is a class

####Advantages
1. Can have synchronous operations on the Container (however these may result in an invalid DB if more than one instance of program is running (shouldn't happen due to single background process))
2. Conceptually more friendly?

####Problems
1. Have to maintain state -- what's the point of operating on anything except the DB itself? The state of your Container instance might not be up to date. May as well operate directly on the DB.

###Functional Approach
1. Container is not a class, it is simply a set of functions to read/update the DB

####Advantages
1. Don't have to worry about Container functions operating on an outdated version of DB since we retrieve a fresh copy for every operation. No cached state.