const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

function generateRandomString() {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let randomString = ''
    for(let i = 0; i < 6; i++) {
        let randomNum = Math.floor(Math.random() * characters.length)
        randomString += characters[randomNum];
    }
    return randomString
}


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    userName: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
    console.log(req.body);// Log the POST request body to the console
    let shorternUrl = generateRandomString()
    // console.log('before',urlDatabase);
    urlDatabase[shorternUrl] = `http://${req.body.longURL}`;
    // console.log('after', urlDatabase);
    res.redirect(`/urls/${shorternUrl}`);         // Respond with 'Ok' (we will replace this)

  });

app.get("/u/:shortURL", (req, res) => {
    let shortUrl = req.params.shortURL
    const longURL = urlDatabase[shortUrl] 
    // console.log(longURL);
    res.redirect(longURL);
  });


app.get("/urls/new", (req, res) => {
    const templateVars = { 
    urls: urlDatabase,
    userName: req.cookies["username"]
  };
    res.render("urls_new", templateVars);
  });

app.get("/urls/:shortURL", (req, res) => {
    const templateVars = { 
      shortURL: req.params.shortURL, 
      longURL: urlDatabase[req.params.shortURL],
      userName: req.cookies["username"]
    };
    res.render("urls_show", templateVars);
  });

  app.post('/urls/:shortURL/delete', (req,res) => {
    // Get the shortURL from the params
    const shortURL = req.params.shortURL;
    // Delete it from that specific key from the database
    delete urlDatabase[shortURL]
    res.redirect(`/urls`) 
  });

  app.get("/register", (req, res) => {
    const templateVars = { 
    urls: urlDatabase,
    userName: req.cookies["username"]
  };
    res.render("urls_register", templateVars);
  });
  
  app.post('/login', (req,res) => {
    // set a cookie named Username 
    res.cookie("username", req.body.userName);
    console.log('req body username',req.body.userName)
    res.redirect(`/urls/`) 
  });
  
  app.post('/logout', (req,res) => {
    // set a cookie named Username 
    res.clearCookie("username", req.body.userName);
    console.log('req body username',req.body.userName)
    res.redirect(`/urls/`) 
  });

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});