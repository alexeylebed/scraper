var db = require("../models");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = {
    getArticles: function (req, res) {
        db.Article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    },
    getSavedArticles: function (req, res) {
        console.log('getSaved')
        db.Article.find({"saved": true})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    },
    saveArticle: function (req, res){
        db.Article.updateOne({ "_id": req.body.id},{$set: {"saved":true}})
            // ..and populate all of the notes associated with it
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    },
    deleteArticle: function (req, res){
        db.Article.remove({ "_id": req.body.id})
            // ..and populate all of the notes associated with it
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    },
    createNote: function (req, res){
        console.log(req.body);
         db.Note.create(req.body)
             .then(function (dbArticle) {
                 res.json(dbArticle);
             })
             .catch(function (err) {
                 res.json(err);
             });
    },
    getNotes: function (req, res){
        console.log(req.params.id);
         db.Note.find({"articleId" : req.params.id})
             .then(function (dbNote) {
                 res.json(dbNote);
             })
             .catch(function (err) {
                 res.json(err);
             });
    },
    deleteNote: function (req, res){
        console.log(req.params.id);
         db.Note.remove({"_id" : req.params.id})
             .then(function (dbNote) {
                 res.json(dbNote);
             })
             .catch(function (err) {
                 res.json(err);
             });
    },
    scrapeArticles: function (req, res){
        console.log('load request is started')
        db.Article.remove()
        .then(
        db.Note.remove()
        .then(
            axios.get("https://meduza.io/en").then(function (response) {

                var $ = cheerio.load(response.data);
                console.log('data is gotten')
    
                $("a.Link-isInBlockTitle").each(function (i, element) {
                    var result = {};
                    result.title = $(this).find("span").text();
                    result.link = $(this).attr("href");
                    result.saved = false;

                    db.Article.create(result)
                    .then(function (dbArticle) {
                        //console.log(dbArticle);
                        res.send("Scrape Complete");
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                });
            })
        ))
        .catch(err =>{
            console.log(err);
        });
    }
};
