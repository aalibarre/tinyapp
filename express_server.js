const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
const { render } = require("ejs");
app.use(cookieParser());

const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};

function generateRandomString() {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let randomString = ''
    for(let i = 0; i < 6; i++) {
        let randomNum = Math.floor(Math.random() * characters.length)
        randomString += characters[randomNum];
    }
    return randomString
}

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const findUserbyEmail = function (email) {
  const userInfo = Object.values(users)
  for(let user of userInfo) {
    if(user.email === email) {
      return user 
    }
  }
  return null;
};

const findUserByPassword = function (password) {
  const userInfo = Object.values(users)
  for(let user of userInfo) {
    if(user.password === password) {
      return user 
    }
  }
  return null;
};

// function to find teh specific user by their email
const usersOwnUrls = function(id) {
    const result = {}
    const keys = Object.keys(urlDatabase)
    for(let shorturl of keys) {
      const url = urlDatabase[shorturl]
      if(url.userID === id) {
        result[shorturl] = url
      }
    }
    return result; 
};


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  // const templateVars = { 
  //   urls: urlDatabase,
  //   userName: req.cookies["username"]
  // };
  const userID = req.cookies["user_id"]
  const user = users[userID] 
  if(!user) {
    return res.status(400).send("Login in here <a href='/login'>try again</a>")
  }
  const urls = usersOwnUrls(userID)
  const templateVars = {
    urls: urls,
    user: user 
  }
  res.render("urls_index", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
    let shortUrl = req.params.shortURL
    const longURL = urlDatabase[shortUrl] 
    // console.log(longURL);
    res.redirect(longURL);
  });


app.get("/urls/new", (req, res) => {
  const userID = req.cookies["user_id"]
  const user = users[userID] 
  if(!user)  {
    return res.redirect("/login");
  }
    res.render("urls_new", {user});
  });

app.get("/urls/:shortURL", (req, res) => {
    // const templateVars = { 
    //   shortURL: req.params.shortURL, 
    //   longURL: urlDatabase[req.params.shortURL],
    //   userName: req.cookies["username"]
    // };
  const userID = req.cookies["user_id"]
  const user = users[userID] 
  if(!userID || !user)  {
    return res.status(400).send("Login in here <a href='/login'>try again</a>")
  }
    res.render("urls_show", templateVars);
  });
  
  app.get("/register", (req, res) => {
    const id = req.cookies["user_id"]
    const user = users[id]
    if(user) {
      return res.redirect("/urls");
    } 
    res.render("urls_register", {user});
  });

  app.get("/login", (req, res) => {
    const id = req.cookies["user_id"]
    const user = users[id]
    if(user) {
      return res.redirect("/urls");
    }
    return res.render("urls_login", {user});
  });

  app.post("/urls", (req, res) => {
    console.log(req.body);// Log the POST request body to the console
    let shorternUrl = generateRandomString()
    // console.log('before',urlDatabase);
    urlDatabase[shorternUrl] = `http://${req.body.longURL}`;
    // console.log('after', urlDatabase);
    res.redirect(`/urls/${shorternUrl}`);         // Respond with 'Ok' (we will replace this)

  });


  app.post('/urls/:shortURL/delete', (req,res) => {
    // Get the shortURL from the params
    const shortURL = req.params.shortURL;
    // Delete it from that specific key from the database
    delete urlDatabase[shortURL]
    res.redirect(`/urls`) 
  });
  
  app.post('/login', (req,res) => {
    // set a cookie named Username 
    res.cookie("username", req.body.userName);
    console.log('req body username',req.body.userName)
    res.redirect(`/urls/`) 
  });
  
  app.post('/logout', (req,res) => {
    // set a cookie named Username 
    //res.clearCookie("username", req.body.userName);
    res.clearCookie("user_id");
    // console.log('req body username',req.body.userName)
    res.redirect(`/urls`) 
  });

  app.post("/register", (req, res) => {
    const user_id = generateRandomString()
    const email = req.body.email
    const password = req.body.password
    if(!email) {
      return res.status(400).send("Please input an email address and <a href='/register'>try again</a>")
    // If the user does not exist or their password is incorrect then they will be directed to the register page. 
    }
    if(!password) {
      return res.status(400).send("Please input a password and <a href='/register'>try again</a>")
    // If the user does not input a password then they will be directed tothe register page. 
    }
    
    if(findUserbyEmail(email))  {
      return res.status(400).send("Email already exists please <a href='/register'>try again</a>")
    }
    
    const userObj = {
      id: user_id,
      email: email,
      password: password
    };

    users[user_id] = userObj;
    res.cookie("user_id", user_id)
    // res.cookie("name", req.body.email);
    // res.cookie("passowrd", req.body.password);
    // console.log("email",  req.body.email);
    // console.log("password",req.body.password)
    res.redirect(`/urls`);         // Respond with 'Ok' (we will replace this)
  });

  app.post("/login", (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const user = findUserbyEmail(email); 
  // finduserByEmail is the helper function to help us authenticate the user
  // here is where the if statement comes 
  if(!user || !user.password === password) {
    return res.status(400).send("Username or password is invalid <a href='/login'>try again</a>")
  // If the user does not exist or their password is incorrect then they will be directed to another page. 
  }
  res.cookie("user_id", user.id);
  res.redirect("/urls");
  });
  
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});