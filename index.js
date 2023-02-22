require("dotenv").config();
const express = require("express");
const session = require("express-session");
const app = express();
const { PORT, SESSION_SECRET } = process.env;

app.use(express.json());
app.use(
  session({
    cookie: {
      path: "/",
      httpOnly: true,
      secure: false, // PROD would want to be set to true
      maxAge: 1000 * 60 * 60 * 24,
    },
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/register.html", (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title></title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="css/style.css" rel="stylesheet">
      </head>
      <body>
        <h1>Express Session Demo</h1>
        <input id="email" name="email" type="email" />
        <input id="password" name="password" type="password" />
        <input id="firstName" name="firstName" type="text" />
        <input id="lastName" name="lastName" type="text" />
        <button id="register-btn" >Register</button>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.3/axios.min.js" integrity="sha512-wS6VWtjvRcylhyoArkahZUkzZFeKB7ch/MHukprGSh1XIidNvHG1rxPhyFnL73M0FC1YXPIXLRDAoOyRJNni/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script>
          async function register(){
            console.log('running')
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const firstNameInput = document.getElementById('firstName');
            const lastNameInput = document.getElementById('lastName');

            const body = {
              email: emailInput.value,
              password: passwordInput.value,
              firstName: firstNameInput.value,
              lastName: lastNameInput.value,
            }

            const res = await axios.post('/auth/register', body)

            window.location = '/home.html'
          }

          const registerButton = document.getElementById('register-btn')
          registerButton.addEventListener('click', register);
        </script>
      </body>
    </html>
  `;

  res.status(200).send(html);
});

app.get("/login.html", (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title></title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="css/style.css" rel="stylesheet">
      </head>
      <body>
        <h1>Express Session Demo</h1>
        <input id="email" name="email" type="email" />
        <input id="password" name="password" type="password" />
        <button id="login-btn" >Login</button>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.3/axios.min.js" integrity="sha512-wS6VWtjvRcylhyoArkahZUkzZFeKB7ch/MHukprGSh1XIidNvHG1rxPhyFnL73M0FC1YXPIXLRDAoOyRJNni/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script>
          async function login(){
            console.log('running')
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');

            const body = {
              email: emailInput.value,
              password: passwordInput.value,
            }

            await axios.post('/auth/login', body)

            window.location = '/home.html'
          }

          const loginButton = document.getElementById('login-btn')
          loginButton.addEventListener('click', login);
        </script>
      </body>
    </html>
  `;

  res.status(200).send(html);
});

const users = [];
let nextAvailableUserID = users.length + 1;

app.get("/home.html", (req, res) => {
  const userID = req.session.userID
  const user = users.find((u) => u.id === userID)

  console.log({ user })

  if (!user) {
    return res.redirect("/login.html");
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title></title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="css/style.css" rel="stylesheet">
      </head>
      <body>
        <h1>Welcom home ${user.firstName} ${user.lastName}!</h1>
      </body>
    </html>
  `;

  res.status(200).send(html);
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email)

  if(!user){
    return res.redirect('/login.html')
  }

  if(!user.password === password){
    return res.redirect('/login.html')
  }

  req.session.userID = user.id;

  res.status(200).send(user.id.toString());
});

app.post("/auth/register", (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const user = {
    id: nextAvailableUserID,
    email,
    password,
    firstName,
    lastName,
  };

  users.push(user);
  nextAvailableUserID++;

  req.session.userID = user.id;

  res.status(200).send(user.id.toString());
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
