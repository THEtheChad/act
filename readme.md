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

Every state has a buffer that stores each successive value of the state. This makes act extremely friendly for asynchronous environments where there's no guarantee that a listener will be bound before the state is set.

The default buffer size is 3, but this can be defined globally via `Act.bufferSize` or on a case by case basis in the state definition.

# Methods

## set

```
act.set('user.firstName', 'Chad');
```

## onAll

This method will trigger the listener on all state changes, including those that have been bufferd before the listener was bound.

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

This method will trigger the listener only when the state is initially set. Subsequent state changes will be ignored.

```
act.set('user.firstName', 'Raphael');
act.set('user.firstName', 'Donatello');

act.onInit('user.firstName', function(err, data){
	console.log(data);
});

// Raphael

act.set('user.firstName', 'Leonardo');
act.set('user.firstName', 'Michaelangello');
```