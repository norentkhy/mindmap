refactored to react from
https://github.com/jmcker/Peer-to-Peer-Cue-System

# commands

```
  yarn parcel src/prototypes/web-rtc/index.html
```

# further instructions

videocall via webRTC has been implemented (sloppily)
steps:
1. open a window with the sender view and another one with the receiver view
2. set the receiver (or sender) on a different webcam if possible
3. connect the sender with the receiver (via clipboard buttons for ease)
4. press call button on sender to start call, which receiver automatically accepts
5. the cue system still works

# extra video features

Extra video features
- audio muting
- media selection
  - video input
  - audio input
  - audio output
were added out of curiosity and convenience to stop the echo loop.

# Notes
An attempt was made to use mobile on local network
- this did not work, probably becuase mediadevices API is different
- the same was true for usage through firefox

There is a workaround present for reconnecting or something
- this is from the refactoring of the cue system example
- for production work, this should not be blindly copied!