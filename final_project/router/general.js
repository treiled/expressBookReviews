const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users[username] = password;
  return res.status(201).json({ message: "User registered successfully" });
});
public_users.get('/', async (req, res) => {
    try {
      const response = await axios.get('https://timlat98-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/booksdb.js');
      res.send(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching books' });
    }
});
public_users.get('/booksdb.js', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get('https://timlat98-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/booksdb.js');
        const book = response.data[isbn]; 
        
        if (book) {
            res.send(JSON.stringify(book, null, 4));
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching book details" });
    }
});

public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();
        const response = await axios.get('https://timlat98-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/booksdb.js');
        const booksArray = Object.values(response.data);
        const authorBooks = booksArray.filter(book => book.author.toLowerCase() === author);

        if (authorBooks.length > 0) {
            res.send(JSON.stringify(authorBooks, null, 4));
        } else {
            res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching books" });
    }
});

public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();
        const response = await axios.get('https://timlat98-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/booksdb.js');
        const booksArray = Object.values(response.data);
        const titleBooks = booksArray.filter(book => book.title.toLowerCase() === title);

        if (titleBooks.length > 0) {
            res.send(JSON.stringify(titleBooks, null, 4));
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching books" });
    }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).send(JSON.stringify({ message: "Book or reviews not found" }, null, 4));
  }
});

module.exports.general = public_users;