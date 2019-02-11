const router = require("express").Router();
const articleController = require("../controllers/articleController.js"); 
const path = require("path");

router.get("/articles", articleController.getArticles);
router.get("/scrape", articleController.scrapeArticles);
router.get("/getsaved", articleController.getSavedArticles);
router.get("/getnotes/:id", articleController.getNotes);
router.get("/deletenote/:id",articleController.deleteNote)

router.post("/savearticle", articleController.saveArticle);
router.post("/addnote", articleController.createNote);
router.post('/deletearticle', articleController.deleteArticle);

router.get("/assets/images/loader.svg" , (req, res) =>{
    console.log('blablabla')
    res.sendFile(path.join(__dirname.split('/routes')[0], "./public/assets/images/ajax-loader.gif"));
});

module.exports = router;
