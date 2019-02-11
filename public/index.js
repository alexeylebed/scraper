let getArticles = document.getElementById('scrapeNew');
let articlesSaved = document.getElementById('navbar_saved');
let allArticles = document.getElementById('navbar_articles');
let modal = document.getElementById('myModal');
let addButton = document.getElementById('modalContent__button_addNote');
let saveButton = document.getElementById('modalContent__button_saveNote');



function loadScrapedArticles(){
    let requestURL = window.location.origin + "/scrape";
    loaderRender();

    fetch(requestURL , {
        method: "GET",
        headers: {  
            "content-type" : "application/json",
         }
    })
    .then(result =>{
        return result.text()
    })
    .then(text =>{
        getArticlesJSON(text);
    })
    .catch((error) =>{
        console.log(error);
    });
};


function getArticlesJSON(){
    let requestURL = window.location.origin + "/articles";

    fetch(requestURL, {
        method: "GET",
        headers: {  
            "content-type" : "application/json",
         }          
    })
    .then(result =>{
        return result.text()
    })
    .then(text =>{
        text = JSON.parse(text);
        render(text);
        ifSavedLeft();
    })
    .catch(err =>{
        console.log(err);
    })
};

function loaderRender(){
    let loader = document.getElementById('loader');
    let cardsBlock = document.getElementById('articles');
    let buttonBlock = document.getElementById('scrapeNewWrapper');
    getArticles.style.display = 'none';
    cardsBlock.style.display = 'none';
    loader.style.display = 'block';
    buttonBlock.style.display = 'flex';
};

function render(text){

    let cardsBlock = document.getElementById('articles');
    cardsBlock.style.display = 'flex';
    cardsBlock.innerHTML = '';
    let buttonBlock = document.getElementById('scrapeNewWrapper');
    buttonBlock.style.display = 'none'; 
    let savedCardsBlock = document.getElementById('savedArticles');
    savedCardsBlock.innerHTML = '';

    text.forEach(element => {
        let card = document.createElement('div');
        if(!element.saved){
            cardsBlock.append(card);
        } else{
            savedCardsBlock.append(card);
        }
        
        let cardTitle = document.createElement('div');
        cardTitle.setAttribute('class' , 'articleCard__title');
        cardTitle.innerHTML = element.title;
        card.append(cardTitle);

        let articleLinkWrapper = document.createElement('div');
        articleLinkWrapper.setAttribute('class' , 'articleCard__linkWrapper');
        card.append(articleLinkWrapper);

        let articleLink = document.createElement('a');
        articleLink.setAttribute('class' , 'articleCard__link');
        articleLink.setAttribute('href' , "https://meduza.io" + element.link);
        articleLink.innerHTML = 'link';
        articleLinkWrapper.append(articleLink);

        if(!element.saved){
            card.setAttribute('class' , 'articleCard')

            let saveButton = document.createElement('div');
            saveButton.setAttribute('class' , 'articleCard__saveButton');
            saveButton.setAttribute('id' , element._id);
            saveButton.innerHTML = 'save';
            articleLinkWrapper.append(saveButton);
        } else {
            card.setAttribute('class' , 'articleCard articleCard_saved')
            let deleteButton = document.createElement('div');
            deleteButton.setAttribute('class' , 'articleCard__deleteButton');
            deleteButton.setAttribute('id' , element._id);
            deleteButton.innerHTML = 'delete';
            articleLinkWrapper.append(deleteButton);

            let addNote = document.createElement('div');
            addNote.setAttribute('class' , 'articleCard__addNote');
            addNote.setAttribute('id' , element._id);
            addNote.innerHTML = 'note';
            articleLinkWrapper.append(addNote);
        };
    });
};

function ifSaved(e){
    if(e.target.className == 'articleCard__saveButton'){
        let json = {type: 'saved'};
        json.id = e.target.id;
        json = JSON.stringify(json);
        const requestURL = window.location.origin + "/savearticle";

        fetch(requestURL, {
            method: "POST",
            body: json,
            headers: {  
                "content-type" : "application/json",
             }          
        })
        .then(result =>{
            return result.text()
        })
        .then(text =>{
            getArticlesJSON();
        })
        .catch(err =>{
            console.log(err);
        })
    };
};

function ifDeleted(e){
    if(e.target.className == 'articleCard__deleteButton'){
        let json = {type: 'deleted'};
        json.id = e.target.id;
        json = JSON.stringify(json);
        console.log(json)

        const requestURL = window.location.origin + "/deletearticle";

        fetch(requestURL, {
            method: "POST",
            body: json,
            headers: {  
                "content-type" : "application/json",
             }          
        })
        .then(result =>{
            return result.text()
        })
        .then(text =>{
            getArticlesJSON();
            console.log(text);
        })
        .catch(err =>{
            console.log(err);
        })
    };
};

function ifSavedLeft(){
    let cardsSaved = document.getElementsByClassName('articleCard_saved');
    if(cardsSaved.length < 1){
        let savedCardsBlock = document.getElementById('savedArticles');
        savedCardsBlock.innerHTML = " <div id = 'youHaveNoArticles' class = 'emptyBox'>Oops! You have no saved articles</div>";
    };
};

function ifOpenModal(e){
    if(e.target.className == 'articleCard__addNote'){
        modal.style.display = "block";
        let idBlock = document.getElementById('modalContent__noteId');
        idBlock.innerHTML = "Article ID: " + event.target.id;
        idBlock.setAttribute('articleId' , event.target.id);
        clearNotes();
        getNotes(event.target.id);
    };
};

function clearNotes(){
    let parent = document.getElementById('modalContent__notes_browse');
    parent.innerHTML = "<div id = 'modalContent__defaultNote'>You have no notes :(</div>"
};


function getNotes(id){
    let notes;
    URL = document.location.origin + "/getnotes/" + id;
    fetch(URL , {
        headers: {
            "content-type" : "application/json"
        }
    })
    .then((response) => {return response.text()}).then(text => {
        renderNotes(JSON.parse(text));
    })
    .catch(err => consoile.log(err));
};

function renderNotes(obj){
    console.log(obj);
    checkIfNotes(obj)
    let parent = document.getElementById('modalContent__notes_browse');

    if(obj.length > 0){
        console.log('render!')
        obj.forEach(item =>{
            let note = document.createElement('div');
            note.setAttribute('class', 'modalContent__note');
            note.setAttribute('articleId', item.articleId);
            note.id = item._id;

            let noteText = document.createElement('div');
            noteText.setAttribute('class', 'modalContent__noteText');
            noteText.innerHTML = item.text;

            let deleteNote = document.createElement('div')
            deleteNote.setAttribute('class', 'deleteNote');
            deleteNote.innerHTML = "&times";
            deleteNote.id = item._id;
            deleteNote.setAttribute('articleId', item.articleId);

            note.append(noteText);
            parent.append(note);
            note.append(deleteNote);
        })
    }
};

function clearTextArea(){
    let textArea = document.getElementById('modalContent__addNote');
    textArea.value = '';
}

function checkIfNotes(obj){
    let parent = document.getElementById('modalContent__notes_browse');
    if(obj.length < 1){
        parent.innerHTML = "<div id = 'modalContent__defaultNote'> You have no notes :(</div>"
    } else {
        parent.innerHTML = '';
    };
};

function ifCloseModal(e){
    if(e.target.className == 'closeModal'){
        modal.style.display = "none";
    }
};

getArticles.addEventListener('click' , () =>{
    loadScrapedArticles();
});

document.addEventListener('click' , (e) =>{
    ifSaved(e);
    ifDeleted(e);
    ifOpenModal(e);
    ifCloseModal(e);
    deleteNote(e);
});

articlesSaved.addEventListener('click' , (e) => {
    let navbarElements =  document.getElementsByClassName('navbar__element');
    [...navbarElements].forEach(item =>{
        item.setAttribute('class', 'navbar__element');
    });
    articlesSaved.setAttribute('class', 'navbar__element navbar__element_active')

    let scraped = document.getElementById('scrapedArticles');
    let saved = document.getElementById('savedArticles');
    scraped.style.display = "none";
    saved.style.display = "flex";
});

allArticles.addEventListener('click' , (e) => {
    let navbarElements =  document.getElementsByClassName('navbar__element');
    [...navbarElements].forEach(item =>{
        item.setAttribute('class', 'navbar__element');
    });
    allArticles.setAttribute('class', 'navbar__element navbar__element_active')

    let scraped = document.getElementById('scrapedArticles');
    let saved = document.getElementById('savedArticles');
    scraped.style.display = "block";
    saved.style.display = "none";

});

addButton.addEventListener('click' , () =>{
    clearTextArea();
    changeModalView();
});

function changeModalView(){
    let browseBlock = document.getElementById('modalContent_browse');
    let editBlock = document.getElementById('modalContent_edit');

    if(browseBlock.style.display != 'none'){
        browseBlock.style.display = 'none';
        editBlock.style.display = 'block';
    } else {
        browseBlock.style.display = 'block';
        editBlock.style.display = 'none';
    };
};

saveButton.addEventListener('click', () =>{
    saveNote();
});

function saveNote(){
    let modalId = document.getElementById('modalContent__noteId');
    let textArea =  document.getElementById('modalContent__addNote');
    let URL = window.location.origin + "/addnote";
    
    let requestBody = {
        articleId : modalId.getAttribute('articleid'),
        text: textArea.value
    }
    requestBody = JSON.stringify(requestBody);
    fetch(URL, {
        method: "POST",
        body: requestBody,
        headers: {
            "content-type" : "application/json"
        }
    })
    .then((response => {return response.text()}))
    .then(text => {
       // console.log(text);
        changeModalView();
        clearTextArea();
        clearNotes();
        getNotes(modalId.getAttribute('articleid'));
    })
    .catch(err => console.log(err));
};

function deleteNote(e){
 if(e.target.className == 'deleteNote'){
    let URL = window.location.origin + "/deletenote/" + event.target.id;
    console.log(URL)
    fetch(URL, {
        headers: {
            "content-type" : "application/json"
        }       
    })
    .then( response =>{
        return response.text()
    })
    .then(text =>{
        console.log(text)
        clearNotes();
        getNotes(e.target.getAttribute('articleid'));
    })
    .catch(err =>{
        console.log(err)
    });
 };
};






   
  

