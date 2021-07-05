# Implementation details

This feature was originally implemented using the events:
- dragStart
- dragEnd

However, dragEnd is/was bugged in Firefox.
See: https://bugzilla.mozilla.org/show_bug.cgi?id=505521#c80

To fix it for Firefox, the following events were used:
- dragStart
- drop

This implementation is less elegant, but it does the job.