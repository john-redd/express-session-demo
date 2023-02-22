### Steps
1. `npm i express express-session dotenv`
2. Create basic express server

```js
require("dotenv").config();
const express = require("express");
const app = express();
const { PORT } = process.env;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

```
3. Initialize session

```js
const { PORT, SESSION_SECRET } = process.env;

// ...
// Initialize session middleware that is responsible for upserting a session based on the cookie
// in the request and attaching it to request.session
app.use(
  session({
    cookie: {
      path: "/",
      httpOnly: true,
      secure: false, // PROD would want to be set to true
      maxAge: 1000 * 60 * 60 * 24, // Time that the session/cookie will be valid for
    },
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
// ...
```
4. In endpoints, access and manipulate the session by adding and removing keys to the reqeust.session key of the request object.
