const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect("mongodb://0.0.0.0:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

const articlesSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articlesSchema);

/////////// Request Targeting all Articles//////////////

app
  .route("/articles")
  .get((req, res) => {
    Article.find({})
      .then((foundArticles) => {
        res.send(foundArticles);
      })
      .catch((err) => {
        console.log(err);
      });
  })

  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle
      .save()
      .then(() => {
        res.send("Successfully Saved article!");
      })
      .catch((err) => {
        res.send(err);
      });
  })

  .delete((req, res) => {
    Article.deleteMany({})
      .then(() => {
        res.send("Successfully deleted all articles!");
      })
      .catch((err) => {
        res.send(err);
      });
  });

/////////// Request Targeting A Specific Articles//////////////

app.route("/articles/:articleTitle")
    .get((req, res) => {
        const articleTitle = req.params.articleTitle
        Article.findOne({
            title: articleTitle
        }).then((foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle)
            } else {
                res.send("No articles matching that title was found!")
            }
            
        }).catch((err) => {
            res.send(err)
        })
    })

    .put((req, res) => {
        Article.updateOne({
            title: req.params.articleTitle
        }, {
            title: req.body.title, 
            content: req.body.content
        }).then(() => {
            res.send("Successfully updated article.")
        }).catch((err) =>{
            res.send(err)
        })
    })

    .patch((req, res) => {
        Article.updateOne({
           title: req.params.articleTitle 
        }, {
            $set: {
                content: req.body.content
            }
        }).then(() => {
            res.send("successfully updated documents!")
        }).catch((err) => {
            res.send(err)
        })
    })

    .delete((req, res) => {
      Article.deleteOne({
        title: req.params.articleTitle
      }).then(() => {
        res.send("Successfully Deleted article.")
      }).catch((err) => {
        res.send(err)
      })
    });

app.listen(3000, (req, res) => {
  console.log("Server is running on port 3000.");
});
