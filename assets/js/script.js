// ------------------ TABLE OF CONTENTS --------------

class toc extends Paged.Handler {
    constructor(chunker, polisher, caller) {
      super(chunker, polisher, caller);
    }

    beforeParsed(content){          
      createToc({
        content: content,
        tocElement: '#table-of-contents',
        titleElements: [ '.chapter h1', '.chapter h2' ]
        // subTitleElements : '.summary li'
      });
    }
    
  }
Paged.registerHandlers(toc);

//  ---- MICRO TYPO ----
// using smartquotes
class smartquote extends Paged.Handler {
  constructor(chunker, polisher, caller) {
      super(chunker, polisher, caller);
  }

  beforeParsed(content) {
    smartquotes(content);
    // replace the dash using regex
    var regexCapital = /--/g;
    // look for all element inside the body
    var all = document.querySelectorAll("body *");
    // for each of those elements
    all.forEach(element => {
        // replace ` -- ` with `&mdash;` 
        element.innerHTML = element.innerHTML.replace(regexCapital, '&mdash;');
        // console.log(element.innerHTML);
        element.innerHTML = element.innerHTML.replace(/“/g, "«&#8239");
        element.innerHTML = element.innerHTML.replace(/”/g, "&#8239»");
        element.innerHTML = element.innerHTML.replace("/« /g", "«&#8239");
        element.innerHTML = element.innerHTML.replace("/ »/g", "&#8239»");
    })
  }
}
// register the hook: 
Paged.registerHandlers(smartquote);


// clean quotes 
// fait buggué le script des margins notes 
// script désactivé
// class jolietypo extends Paged.Handler {
//   constructor(chunker, polisher, caller) {
//     super(chunker, polisher, caller);
//   }

//   beforeParsed(content){          
//     // let text = content.innerHTML;
//     const paragraphs = content.querySelectorAll('p');

//     // for each of those p,
//     paragraphs.forEach((p) => {
//       const content = p.textContent;
//       let result = content.replace("« ", "«&#8239");
//       result = result.replace(" »", "&#8239»");
//       result = result.replace("“", "«&#8239");
//       result = result.replace("”", "&#8239»");
//       // console.log(p);
//       p.innerHTML = content;
//     });
//   }  
// }

// Paged.registerHandlers(jolietypo);

//  ---- C O R R E C T    P O S I T I O N    O F    I M A G E S ----

var classElemFullPage = "full-page"; // ← class of full page images


class fullPageStuff extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
    this.fullPageEls = new Set();
    this.usedPagedEls = new Set();
  }

  //find from the css the element you wanna have  full page
  onDeclaration(declaration, dItem, dList, rule) {
    if (declaration.property == "position") {
      if (declaration.value.children.head.data.name.includes("fullpage")) {
        let sel = csstree.generate(rule.ruleNode.prelude);
        sel = sel.replace('[data-id="', "#");
        sel = sel.replace('"]', "");
        this.floatFullPage.push(sel.split(","));
      }
    }
  }

  renderNode(clone, node) {
    // if you find a full page element, move it in the array
    if (node.nodeType == 1 && node.classList.contains(classElemFullPage)) {
    // console.log(node);
    this.fullPageEls.add(node);
      this.usedPagedEls.add(node);

      // remove the element from the flow by hiding it.
      clone.style.display = "none";
    }
  }

  afterPageLayout(pageElement, page, breakToken, chunker) {
    // if there is an element in the fullPageEls Set, (goodbye arrays!)

    for (let img of this.fullPageEls) {
      let fullPage = chunker.addPage();
      fullPage.element
        .querySelector(".pagedjs_page_content")
        .insertAdjacentElement("afterbegin", img);
      fullPage.element.classList.add("addedpage");
      fullPage.element.classList.add("pagedjs_named_page");
      fullPage.element.classList.add("pagedjs_pagedjs-fullpage_page");
      this.fullPageEls.delete(img);
    }
  }
}
Paged.registerHandlers(fullPageStuff);


//----- W R A P     H 2  &  H 3   W I T H     S P A N -----

class wrapHeaders extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }

  beforeParsed(content){          
    let h2El = content.querySelectorAll('h2');
    h2El.forEach(function(element) {
      let h2Content = element.innerHTML;
      element.innerHTML = '<span class="highlight">'+h2Content+'</span>';
    });
    let h3El = content.querySelectorAll('h3');
    h3El.forEach(function(element) {
      let h3Content = element.innerHTML;
      element.innerHTML = '<span class="highlight">'+h3Content+'</span>';
    });
  }   
}
Paged.registerHandlers(wrapHeaders);

// -------------- M A R G I N     N O T E S      S C R I P T -----------------

let classNotes = "margin-note"; // ← Change the CLASS of the notes here
let notesFloat = "left"; // ← Change the POSITION of the notes here

class marginNotes extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }

  beforeParsed(content) {

    let notes = content.querySelectorAll("." + classNotes);

    for (let i = 0; i < notes.length; ++i) {

      // Add call notes
      var spanCall = document.createElement("sup");
      spanCall.classList.add("note-call");
      spanCall.classList.add("note-call_" + classNotes);
      spanCall.dataset.noteCall = classNotes + '-' + i + 1;
      notes[i].parentNode.insertBefore(spanCall, notes[i]);

      // Add marker notes
      var spanMarker = document.createElement("span");
      spanMarker.classList.add("note-marker");
      spanMarker.classList.add("note-marker_" + classNotes);
      spanMarker.dataset.noteMarker = classNotes + '-' + i + 1;
      notes[i].prepend(spanMarker);


      // Hide notes to avoid rendering problems
      notes[i].style.display = "none";
    }



    /* NOTE FLOAT ---------------------------------------------------------------------------------- */

    let positionRight = 'left: calc(var(--pagedjs-pagebox-width) - var(--pagedjs-margin-left) - var(--pagedjs-margin-right) - 1px); width: var(--pagedjs-margin-right);';
    let positionLeft = 'left: calc(var(--pagedjs-margin-left)*-1 + 4px); width: calc(var(--pagedjs-margin-left) - 4px);'

    let notePosition;

    switch (notesFloat) {
      case 'inside':
        notePosition = '.pagedjs_left_page .' + classNotes + '{' + positionRight + '} \
          .pagedjs_right_page .' + classNotes + '{' + positionLeft + '}';
        break;
      case 'left':
        notePosition = '.pagedjs_left_page .' + classNotes + '{' + positionLeft + '} \
          .pagedjs_right_page .' + classNotes + '{' + positionLeft + '}';
        break;
      case 'right':
        notePosition = '.pagedjs_left_page .' + classNotes + '{' + positionRight + '} \
          .pagedjs_right_page .' + classNotes + '{' + positionRight + '}';
        break;
      default:
        notePosition = '.pagedjs_left_page .' + classNotes + '{' + positionLeft + '} \
          .pagedjs_right_page .' + classNotes + '{' + positionRight + '}';
    }


    /* SPECIFIC CSS ---------------------------------------------------------------------------------- */

    addcss('\
      body {\
        counter-reset: callNote_' + toCamelClassNote(classNotes) + ' markerNote_' + toCamelClassNote(classNotes) + ';\
      }\
      \
      .' + classNotes + '{\
          position: absolute;\
          text-align-last: initial;\
          box-sizing: border-box;\
      }\
      \
      .note-call_' + classNotes + ' {\
        counter-increment: callNote_' + toCamelClassNote(classNotes) + ';\
      }\
      \
      .note-call_' + classNotes + '::after {\
        content: counter(callNote_' + toCamelClassNote(classNotes) + ');\
      }\
      \
      .note-marker_' + classNotes + ' {\
          counter-increment: markerNote_' + toCamelClassNote(classNotes) + ';\
      }\
      .note-marker_' + classNotes + '::before {\
        content: counter(markerNote_' + toCamelClassNote(classNotes) + ') "";\
      }\
    ' + notePosition);


  } /* end beforeParsed*/


  afterPageLayout(pageElement, page, breakToken) {
    let notes = pageElement.querySelectorAll("." + classNotes);
    let noteOverflow = false;

    let notesHeightAll = [];

    if (typeof (notes) != 'undefined' && notes != null && notes.length != 0) {

      for (let n = 0; n < notes.length; ++n) {
        // Display notes of the page 
        notes[n].style.display = "inline-block";
        // Add height of the notes to array notesHeightAll 
        let noteHeight = notes[n].offsetHeight;
        notesHeightAll.push(noteHeight);
        // Add margins of the notes to array notesHeightAll 
        if (n >= 1) {
          let margins = biggestMargin(notes[n - 1], notes[n]);
          notesHeightAll.push(margins);
        }
      }


      /* FIT PAGE ------------------------------------------------------------------------------------- */

      // Calculate if all notes fit on the page;
      let reducer = (accumulator, currentValue) => accumulator + currentValue;
      let allHeight = notesHeightAll.reduce(reducer);
      let maxHeight = pageElement.querySelectorAll(".pagedjs_page_content")[0].offsetHeight;

      if (allHeight > maxHeight) {
        // console.log("doesn't fit");

        /* IF DOESN'T FIT ----------------------------------------------------------------------------- */

        // positions all the notes one after the other starting from the top
        notes[0].style.top = parseInt(window.getComputedStyle(notes[0]).marginBottom, 10) * -1 + "px";
        for (let a = 1; a < notes.length; ++a) {
          let notePrev = notes[a - 1];
          let newMargin = biggestMargin(notePrev, notes[a]);
          let newTop = notePrev.offsetTop + notePrev.offsetHeight - marginNoteTop(notes[a]) + newMargin + 5 ;
          notes[a].style.top = newTop + "px";
        }
        // alert
        let pageNumber = pageElement.dataset.pageNumber;
        // alert("Rendering issue \n ☞ A marginal note overflow on page " + pageNumber + " (this is because there is too many on this page and paged.js can't breaks notes between pages for now.)");
        noteOverflow = true;

      } else {
        // console.log("fit");
        /* PUSH DOWN ---------------------------------------------------- */
        for (let i = 0; i < notes.length; ++i) {
          if (i >= 1) {
            let noteTop = notes[i].offsetTop;
            let notePrev = notes[i - 1];
            let newMargin = biggestMargin(notes[i], notePrev);
            let notePrevBottom = notePrev.offsetTop - marginNoteTop(notePrev) + notePrev.offsetHeight + newMargin + 5;
            // Push down the note to bottom if it's over the previous one 
            if (notePrevBottom > noteTop) {
              // console.log("overflow");
              notes[i].style.top = notePrevBottom +  "px";
            }
          }
        }

        /* PUSH UP ---------------------------------------------- */

        // Height of the page content 
        let contentHeight = pageElement.querySelectorAll(".pagedjs_page_content")[0].querySelectorAll("div")[0].offsetHeight;

        // Check if last note overflow 
        let nbrLength = notes.length - 1;
        let lastNote = notes[nbrLength];
        let lastNoteHeight = lastNote.offsetHeight + marginNoteTop(lastNote);
        let noteBottom = lastNote.offsetTop + lastNoteHeight;

        if (noteBottom > contentHeight) {

          // Push up the last note 
          lastNote.style.top = contentHeight - lastNoteHeight - 13 + "px";

          // Push up previous note(s) if if it's over the note
          for (let i = nbrLength; i >= 1; --i) {
            let noteLastTop = notes[i].offsetTop;
            let notePrev = notes[i - 1];
            let notePrevHeight = notePrev.offsetHeight;
            let newMargin = biggestMargin(notePrev, notes[i]);
            let notePrevBottom = notePrev.offsetTop + notePrev.offsetHeight + newMargin + 13;
            if (notePrevBottom > noteLastTop) {
              notePrev.style.top = notes[i].offsetTop - marginNoteTop(notePrev) - notePrevHeight - newMargin - 17 + "px";
            }
          }

        } /* end push up */

      }

    }
  }/* end afterPageLayout*/

}

 Paged.registerHandlers(marginNotes);

// ------ G L O S S A R Y ----------- 
// ne fonctionne pas non plus, même soucis que pour jolie typo
class glossary extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }

  beforeParsed(content){ 
    // let all = content.querySelectorAll("p"); 
    // let wordsToFind = ['vide', 'plan', 'friche'];
    
    // all.forEach((element) => { 
    //   // Iterate over each word to find
    //   for (let i = 0; i < wordsToFind.length; i++) {
    //     let word = wordsToFind[i];
    //     // Create a regular expression with the word as a pattern (case-insensitive)
    //     let regex = new RegExp('\\b' + word + '\\b', 'gi');
    //     // Replace the word with the wrapped version using a span tag
    //     element.innerHTML = element.innerHTML.replace(regex, '<span class="book-index">$&</span>');
    //   }
    // }); 

    // createIndex({
    //   spanClassIndex: 'book-index',
    //   indexElement: '#glossary',  
    //   alphabet: true        
    // });

    // Array of specific words to find in the text
    const glossaryWords = ['vide', 'plan', 'friche'];

    // Get all elements with class "content"
    const contentDivs = content.querySelectorAll('p');

    // Process each "content" div
    contentDivs.forEach(contentDiv => {
      // Get the text content of the current "content" div
      const text = contentDiv.textContent;

      // Split the text into individual words
      const words = text.split(/\s+/);

      // Process each word and update the text content
      const updatedText = words.map(word => {
        // Check if the word is in the glossaryWords array
        if (glossaryWords.includes(word)) {
          // If the word is in the glossaryWords array, wrap it in a span with the "glossary-element" class
          return `<span class="glossary-element" data-book-index="${word}">${word}</span>`;
        } else {
          // Otherwise, return the word as is
          return word;
        }
      }).join(' '); // Concatenate the words back together with spaces in between
      // Update the text content of the current "content" div with the wrapped elements
      contentDiv.innerHTML = updatedText;
    });

    // console.log(content.getElementById("glossary"));

    createIndex({
      spanClassIndex: 'glossary-element',
      indexElement: '#glossary', 
      idToGive : 'glossary-index', 
      alphabet: false,
      randomPos : false,
      content : content       
    });
  }  
}

Paged.registerHandlers(glossary);



/* FUNCTIONS -------------------------------------------------------------------------------------- 
--------------------------------------------------------------------------------------------------- */

// GLOSSARY
function createIndex(config){
    let content = config.content;
    let indexElements = content.querySelectorAll("." + config.spanClassIndex);
    let arrayIndex = [];
    let num = 0;

    for(let i = 0; i < indexElements.length; ++i){
          let indexElement = indexElements[i];

          // create array with all data-book-index
          let indexKey = indexElement.dataset.bookIndex;
          let indexKeyFirst = indexKey.slice(0, 1);
          let newIndexKey; 
          if(indexKeyFirst == "<"){
              if(indexKey.slice(0, 3) == "<i>"){
                  newIndexKey = indexKey.replace("<i>", "") + "-iTemp";         
              }else if(indexKey.slice(0, 4) == "<em>"){
                  newIndexKey = indexKey.replace("<em>", "") + "-emTemp";
              }
          }else{
              newIndexKey = indexKey;
          }
          
          arrayIndex.push(newIndexKey);

          // create id for span whithout
          num++;
          if(indexElement.id == ''){ indexElement.id = config.idToGive + '-' + num; }
    }


    // // filter array to remove dublicate and sort by alphabetical order
    // let newArrayIndex = arrayIndex.filter(onlyUnique).sort(function(a,b) {
    //     a = a.toLowerCase();
    //     b = b.toLowerCase();
    //     if( a == b) return 0;
    //     return a < b ? -1 : 1;
    // });

    // // create <ul> element for the index
    // let indexElementDiv = content.querySelector(config.indexElement);
    // let indexUl = document.createElement("ul");
    // indexUl.id = "list-index-generated-" + config.idToGive;
    // indexElementDiv.appendChild(indexUl); 


    // // create <li> element for the index
    // for(var a = 0; a < newArrayIndex.length; a++){           
    //   // 11 et 42 
    //     // create alaphabet
    //     if(config.alphabet){
    //         z = a - 1;
    //         let firstLetter = newArrayIndex[a].toUpperCase().slice(0, 1);
    //         if(a == 0){
    //             let alphabetLiFirst = document.createElement("li");
    //             alphabetLiFirst.classList.add("list-alphabet-element");
    //             alphabetLiFirst.id = "alphabet-element-" + firstLetter;
    //             alphabetLiFirst.innerHTML = firstLetter;
    //             indexUl.appendChild(alphabetLiFirst);
    //         }
    //         if(z > 0){
    //             let firstLetterPrevious = newArrayIndex[z].toUpperCase().slice(0, 1);
    //             if(firstLetter != firstLetterPrevious){
    //                 let alphabetLi = document.createElement("li");
    //                 alphabetLi.classList.add("list-alphabet-element");
    //                 alphabetLi.id = "alphabet-element-" + firstLetter;
    //                 alphabetLi.innerHTML = firstLetter;
    //                 indexUl.appendChild(alphabetLi); 
    //             }
    //         }
    //     }

    //     // create <li> element for the index
    //     let indexNewLi = document.createElement("li");
    //     indexNewLi.classList.add("list-index-element");
        
    //     if(config.randomPos){
    //       let marginLeft = getRandomNumber(10, 3000/newArrayIndex.length);
    //       let marginTop = getRandomNumber(20, 1000/newArrayIndex.length);

    //       indexNewLi.style.marginTop = marginTop + "px";
    //       indexNewLi.style.marginLeft = marginLeft + "px";
    //     }
        
    //     let dataIndex;
    //     if(newArrayIndex[a].substr(newArrayIndex[a].length - 6) == "-iTemp"){
    //         dataIndex = "<i>" + newArrayIndex[a].replace("-iTemp", "");         
    //     }else if(newArrayIndex[a].substr(newArrayIndex[a].length - 7) == "-emTemp"){
    //         dataIndex = "<em>" + newArrayIndex[a].replace("-emTemp", "");   
    //     }else{
    //         dataIndex = newArrayIndex[a];
    //     }
    
    //     indexNewLi.dataset.listIndex = dataIndex;
    //     indexUl.appendChild(indexNewLi);  
    // }

    let indexLi = content.getElementById('list-index-generated-' + config.idToGive).getElementsByClassName('list-index-element');

    for(var n = 0; n < indexLi.length; n++){
        
        // find data and add HTML of the list
        let dataIndex = indexLi[n].dataset.listIndex;
        let spanIndex = content.querySelectorAll("[data-book-index='" + dataIndex + "']");
        // indexLi[n].innerHTML = '<h2 class="index-value">' + dataIndex + '</h2><div class="index-content"></div><div class="links-pages"></div>';

        // add span for link page
        spanIndex.forEach(function(elem) {
            spanIndexId = elem.id;
            let spanPage = document.createElement("span");
            spanPage.classList.add("link-page");
            spanPage.innerHTML = '<a href="#' + spanIndexId + '"></a>';
            indexLi[n].getElementsByClassName('links-pages')[0].appendChild(spanPage);  
        });
  
    }
}


// function for filter array to remove dublicate
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}



// TOC
// function createToc(config){
//     const content = config.content;
//     const tocElement = config.tocElement;
//     const titleElements = config.titleElements;
//     // const subTitleElements = config.subTitleElements;

//     let tocElementDiv = content.querySelector(tocElement);
//     let tocUl = document.createElement("ul");
//     tocUl.id = "list-toc-generated";
//     tocElementDiv.appendChild(tocUl); 
//     // console.log(tocElementDiv);

//     // add class to all title elements
//     let tocElementNbr = 0;
//     for(var i= 0; i < titleElements.length; i++){
        
//         let titleHierarchy = i + 1;
//         let titleElement = content.querySelectorAll(titleElements[i]);


//         titleElement.forEach(function(element) {
//             // add classes to the element
//             element.classList.add("title-element");
//             element.setAttribute("data-title-level", titleHierarchy);

//             // add id if doesn't exist
//             tocElementNbr++;
//             idElement = element.id;
//             if(idElement == ''){
//                 element.id = 'title-element-' + tocElementNbr;
//             } 
//             let newIdElement = element.id;

//         });

//     }

//     // create toc list
//     let tocElements = content.querySelectorAll(".title-element");  

//     for(var i= 0; i < tocElements.length; i++){
//         let tocElement = tocElements[i];
//         let tocNewLi = document.createElement("li");
//         // let subTitles = tocElement.parentNode.querySelectorAll(subTitleElements);
//         // let subTocNewUl = document.createElement("ul");
        
//         // subTitles.forEach(function(element) {
//         //   let subTocNewLi = document.createElement("li");
//         //   subTocNewLi.innerHTML = element.innerHTML; 
//         //   subTocNewUl.appendChild(subTocNewLi);
//         // });


//         // Add class for the hierarcy of toc
//         tocNewLi.classList.add("toc-element");
//         tocNewLi.classList.add("toc-element-level-" + tocElement.dataset.titleLevel);

//         // Keep class of title elements
//         let classTocElement = tocElement.classList;
//         for(var n= 0; n < classTocElement.length; n++){
//             if(classTocElement[n] != "title-element"){
//                 tocNewLi.classList.add(classTocElement[n]);
//             }   
//         }

//         // Create the element
//         let elId = string_to_slug(tocElement.innerHTML);
//         tocNewLi.innerHTML = '<a href="#' + tocElement.id + '" id="'+elId+'">' + tocElement.innerHTML + '</a>';
//         // tocUl.appendChild(tocNewLi);
//         // tocNewLi.appendChild(subTocNewUl);  
//     }

// }

function createToc(config){
    const content = config.content;
    const tocElement = config.tocElement;
    const titleElements = config.titleElements;

    let tocElementDiv = content.querySelector(tocElement);
    let tocUl = document.createElement("ul");
    tocUl.id = "list-toc-generated";
    tocElementDiv.appendChild(tocUl);

    // add class to all title elements
    let tocElementNbr = 0;
    for(var i= 0; i < titleElements.length; i++){

        let titleHierarchy = i + 1;
        let titleElement = content.querySelectorAll(titleElements[i]);


        titleElement.forEach(function(element) {

            // add classes to the element
            element.classList.add("title-element");
            element.setAttribute("data-title-level", titleHierarchy);

            // add id if doesn't exist
            tocElementNbr++;
            idElement = element.id;
            if(idElement == ''){
                element.id = 'title-element-' + tocElementNbr;
            }
            let newIdElement = element.id;

        });

    }

    // create toc list
    let tocElements = content.querySelectorAll(".title-element");

    for(var i= 0; i < tocElements.length; i++){
        let tocElement = tocElements[i];

        let tocNewLi = document.createElement("li");

        // Add class for the hierarcy of toc
        tocNewLi.classList.add("toc-element");
        tocNewLi.classList.add("toc-element-level-" + tocElement.dataset.titleLevel);

        // Keep class of title elements
        //let classTocElement = tocElement.classList;
        //for(var n= 0; n < classTocElement.length; n++){
        //    if(classTocElement[n] != "title-element"){
        //      tocNewLi.classList.add(classTocElement[n]);
        //    }
       //  }
        let classTocElement = tocElement.classList;
        for(var n= 0; n < classTocElement.length; n++){
           if(classTocElement[n] != "title-element"){
             tocNewLi.classList.add("toc-"+classTocElement[n]);
           }
        }

        // Create the element
        tocNewLi.innerHTML = '<a href="#' + tocElement.id + '">' + tocElement.innerHTML + '</a>';
        tocUl.appendChild(tocNewLi);
    }

}


// MARGINS

function marginNoteTop(elem) {
  let marginTop = parseInt(window.getComputedStyle(elem).marginTop, 10)
  return marginTop;
}

function marginNoteBottom(elem) {
  let marginBottom = parseInt(window.getComputedStyle(elem).marginBottom, 10)
  return marginBottom;
}

function biggestMargin(a, b) {
  let margin;
  let marginBottom = marginNoteBottom(a);
  let marginTop = marginNoteTop(b);
  if (marginBottom > marginTop) {
    margin = marginBottom;
  } else {
    margin = marginTop;
  }
  return margin;
}


// ADD CSS

function addcss(css) {
  var head = document.getElementsByTagName('head')[0];
  var s = document.createElement('style');
  s.setAttribute('type', 'text/css');
  if (s.styleSheet) {   // IE
    s.styleSheet.cssText = css;
  } else {// the world
    s.appendChild(document.createTextNode(css));
  }
  head.appendChild(s);
}


// CAMEL CLASS NOTE

function toCamelClassNote(elem) {
  let splitClass = elem.split("-");
  if (splitClass.length > 1) {
    for (let s = 1; s < splitClass.length; ++s) {
      let strCapilize = splitClass[s].charAt(0).toUpperCase() + splitClass[s].slice(1)
      splitClass[s] = strCapilize;
    }
  }
  let reducer = (accumulator, currentValue) => accumulator + currentValue;
  let classCamel = splitClass.reduce(reducer);
  return classCamel;
}

// RANDOM NUMBER

function getRandomNumber(min, max) { 
	return Math.random() * (max - min) + min;
  
}

// SLUG

function string_to_slug (str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}