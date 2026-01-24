const express = require("express");
const helmet = require("helmet");
//const xss = require("xss-clean");
const validator = require('validator');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(helmet());       // Security headers

// This middleware can be used to sanitize input in HTML contexts not used for api calls
//app.use(xss());          // Sanitize input

app.use

// ------------------------------------------------------------------------------------------------
// Escape ONLY when rendering HTML

// function escapeHTML(str) {
//   return str
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#039;");
// }

// ------------------------------------------------------------------------------------------------

// validation and escaping using validator library
function escapeHTML(str) {
  return validator.escape(str);
}

app.get("/", (req, res) => {
  res.send(`
    <h2>XSS Demo (Secure)</h2>
    <form method="POST">
      <input name="comment" placeholder="Enter comment" />
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post("/", (req, res) => {
  const safeComment = escapeHTML(req.body.comment);

  res.send(`
    <h2>User Comment:</h2>
    <p>${safeComment}</p>
    <a href="/">Back</a>
  `);
});

app.listen(3000, () => {
    console.log("Secure server running on port 3000");
});


// ------------------------------------------------------------------------------------------------
// Final Rule (remember this)

// Never sanitize input for APIs.
// Always escape output for HTML.
