# Chat

A simple chat written on Scala + Play + VueJS with real time conversation visualization.

## Build

* build the UI: `cd ui && npm install && npm run build`
* run the application: `sbt run`

## Client-server communication

Real-time communication between server and client is implemented by sending and receiving JSON objects through WebSocket.
An example of JSON message:
```json
{ 
  "_type": "UpstreamNewMessage",
  "messageId": "123",
  "receiverId": "receiver1",
  "message": "some text"
}
```

### Client -> Server

* `UpstreamNewMessage` - chat member sends a new message
* `UpstreamMessageRead` - message recipient confirms that message was read
* `UpstreamStartedTyping` - chat member starts typing to another member
* `UpstreamStoppedTyping` - chat member stops typing to another member

### Server -> Client

* `DownstreamNewMessage` - chat member receives a new message
* `DownstreamNewMessageTrace` - chat member receives a notification about a new message (for visualization)
* `DownstreamMessageRead` - chat member receives a confirmation that message was read
* `DownstreamStartedTyping` - chat member receives a notification one member starts typing to another one
* `DownstreamStoppedTyping` - chat member receives a notification one member stops typing to another one
* `DownstreamMemberJoined` - chat member receives a notification that another member joins the chat
* `DownstreamMemberIsAway` - chat member receives a notification that another member is away (i.e. closed the browser)
* `DownstreamMemberLeft` - chat member receives a notification that another member leaves the chat (i.e. pressed 'Leave' button)
