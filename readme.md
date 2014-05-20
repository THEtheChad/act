# ACT

## What is Act?

Act is an event driven state tracking framework perfect for asynchrounous environments (like Javascript).

Act provides a robust interface for tracking the current state of an application, a model, or any other form of data/event driven entities and gives you the ability to act on it (hence the name, whoa!).

In the context of act, data and states are the same thing. Data is merely a complex representation of the current state. Therefore, you will see data and state used interchangably throughout this document…

with one exception, as outlined below.

## States (of a state)

As confusing as it may be, each state in Act can be in one of 3 states itself:

- state has been set
- state has yet to be set
- state is transitioning

Most applications of Act will not require this knowledge, but it's important to understand it up front so you won't get confused later.

## Buffer

Every state has a buffer that stores each successive value of the state. This makes act extremely friendly for asynchronous environments where there's no guarantee that an action will be bound before the state is set.

The default buffer size is 3, but this can be defined globally via `Act.bufferSize` or on a case by case basis in the state definition.

# Methods

## get
---

The `get` method is used to retrieve the current value of a state.

** IMPORTANT **  
The action is ONLY performed once the state or states have been set.

#### Single State

This form of the method retrieves the value for a single state.

###### Params

Identifier | Type
---------- | --------
State Name | String
Action     | Function

```
act.get('firstName', function(err, data){
	var firstName = data.firstName;
});
```
#### Multiple States

This form of the method retrieves all of the values from a list of states (given in the form of an array).

** IMPORTANT **  
The action will ONLY be performed once all of the states have been set.

##### Params

Identifier  | Type
----------- | --------
State Names | Array
Action      | Function

```
act.get([
	'firstName',
	'lastName'
], function(err, data){
	var firstName = data.firstName;
	var lastName = data.lastName;
});
```

## set
---
The `set` method is used to assign a value to the current state. This is the simplest method in the ACT API.

##### Params

Identifier  | Type
----------- | --------
State Name  | String
Value       | Any

```
act.set('firstName', 'Chad');
```

## on
---
The `on` method is used to perform an action anytime a state or states is set. The action will be passed a copy of the current value of the state or states being watched.

** IMPORTANT **  
The `on` method will only perform the action when the state or states in question are altered. It does not care if the states have been previously set.

##### Params

Identifier  | Type
----------- | --------
State Name  | String
Action      | Function

```
act.set('firstName', 'Chad');

act.on('firstName', function(err, data){
	var firstName = data.firstName;
});

// ** IMPORTANT **
// The action has not been performed yet

act.set('firstName', 'Henry');
// NOW the action is performed
```

## onAll
---

The `onAll` method will perform the given action for all state changes, including those that have been buffered before the action was assigned.

##### Params

Identifier  | Type
----------- | --------
State Name  | String
Action      | Function

```
act.set('user.firstName', 'Raphael');
act.set('user.firstName', 'Donatello');

act.onAll('user.firstName', function(err, data){
	console.log(data);
});

// Raphael
// Donatello

act.set('user.firstName', 'Leonardo');

// Leonardo

act.set('user.firstName', 'Michaelangello');

// Michaelangello
```

## onInit
---

The `onInit` method will perform the given action once the state has been set. Subsequent state changes will be ignored.

** IMPORTANT **  
The `onInit` method will ONLY pass the inititial value that was assigned when the state was set.

##### Params

Identifier  | Type
----------- | --------
State Name  | String
Action      | Function

```
act.set('user.firstName', 'Raphael');
act.set('user.firstName', 'Donatello');
act.set('user.firstName', 'Leonardo');

act.onInit('user.firstName', function(err, data){
	console.log(data);
});

// Raphael

act.set('user.firstName', 'Michaelangello');
```