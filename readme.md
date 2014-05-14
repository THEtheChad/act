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

## Event Types

There are 5 types of events that can occur in Act. A listener can be bound to each of these events.

- create
- update
- destroy
- change (create & update & destroy)
- transition | changing

## History

Record of all states/data. For example, if a 





# Stateless Trigger

A stateless event trigger. Only listeners bound before the trigger will react to the event. Data can be passed from the trigger to the event.

```
var data = 'data';
function listener(){
	console.log('listener', data);
}

act.on('event', listener);
act.trigger('event', data);

act.on('event', listener); // does not fire

```

# Stateless Trigger (once)

```
var data = 'data';
function listener(){
	console.log('listener', data);
}

act.one('event', listener);
act.trigger('event', data);
act.trigger('event', data); // does not fire event again

```

# 