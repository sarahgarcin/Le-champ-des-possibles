// window.onload = function(){
//     orthotypo(document.body);
//     spaces(document.body);
//     exposants();
// }


function orthotypo( content ){
    // var nodes = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, null);

    let all = content.querySelectorAll('p, span');

    all.forEach(element => {
        // console.log(element);
        element.innerHTML = orthotypoRegex(element.innerHTML)
    })

    // all french caracteres: [A-Za-zÀ-ÖØ-öø-ÿœŒ

    // var node;
    // while (node = nodes.nextNode()) {
    //     for (var i = 0; i < array.length; i++) {
    //         node.textContent = node.textContent.replace(array[i].reg, array[i].repl);
    //     } 
    // }

}

function orthotypoRegex(elem){
        
    let array = [
        {
            // oe
            reg: /oe/g, 
            repl: 'œ' 
        },
        {
            // XIème = XIe 
            reg: /(X|I|V)ème/g, 
            repl: '$1e' 
        },
        
    ]

    for (var i = 0; i < array.length; i++) {    
        elem = elem.replace(array[i].reg, array[i].repl);
    }
    return elem;

}


function spaces( content ){
    // var nodes = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, null);
    let all = content.querySelectorAll('p, span');
    // all french caracteres: [A-Za-zÀ-ÖØ-öø-ÿœŒ]

    all.forEach(element => {
        // console.log(element);
        element.innerHTML = spacesRegex(element.innerHTML)
    })


}


function spacesRegex(elem){
    let array = [
        {
            // french open quotes 
            reg: /\"([A-Za-zÀ-ÖØ-öø-ÿœŒ])/g, 
            repl: '«$1' 
        },
        {
            // french close quotes 
            reg: /([A-Za-zÀ-ÖØ-öø-ÿœŒ])\"/g, 
            repl: '$1»' 
        },
        {
            // real apostrophe
            reg: /\'/g, 
            repl: '’' 
        },
        {
            // real suspension points
            reg: /\.+\.+\./g, 
            repl: '\u2026'
        },
        {
            // delete all spaces before punctuation !?;:»›”)].,
            reg: /\s+([!?;:»›”)\]\.\,])/g, 
            repl: '$1'
        },
        {
            // add narrow no break space before !?;:»›
            reg: /([!?;:»›])/g, 
            repl: '&#8239;$1'
        },
        {
            // delete all spaces after «‹“[(
            reg: /([«‹“\[(])\s+/g, 
            repl: '$1'
        },
        {
            // add narrow no break space after «‹
            reg: /([«‹])/g, 
            repl: '$1&#8239;'
        },
        {
             // OPTION 1 : no break space after two letter words  (if not follow by an other two letter word)
            //  reg: /\s+([a-zØ-öø-ÿœ]{2})\s+([A-Za-zÀ-ÖØ-öø-ÿœŒ]{3,})/gi, 
            //  repl: ' $1\u00A0$2'

            // OPTION 2: no break space after some two letter words 
            reg: /\s(le|la|un|une|ce|ces|il|on|les|des|du|ils)\s+/g, 
            repl: ' $1\u00A0'
        },
        {
           // if prev OPTION 2: no break space after successive two letter words 
           reg: /\s+([a-zØ-öø-ÿœ]{2})\s+([A-Za-zÀ-ÖØ-öø-ÿœŒ]{2})\s+/g, 
           repl: ' $1 $2\u00A0'
       },
        {
            // no break space after one letter words
            reg: /\s+([a-zà])\s+/gi, 
            repl: ' $1\u00A0'
        },
        {
            // no break space after first word (2-5 letter) of the sentence
            reg: /\.\s([A-ZÀ-Ö])([A-Za-zÀ-ÖØ-öø-ÿœŒ]{1,5})\s+/g, 
            repl: '. $1$2\u00A0'
        },
        {
            // no break space into names
            reg: /([A-ZÀ-ÖØŒ])([A-Za-zÀ-ÖØ-öø-ÿœŒ]+)\s+([A-ZÀ-ÖØŒ])([A-Za-zÀ-ÖØ-öø-ÿœŒ]+)/g, 
            repl: '$1$2\u00A0$3$4'
        },
        {
            // no break space before Caps + .
            reg: /\s([A-ZÀ-ÖØŒ])\./g, 
            repl: '\u00A0$1. '
        },
        {
            // no break space before 'siècles'
            reg: /(X|I|V)(er|e)\s+siècle/g, 
            repl: '$1$2\u00A0siècles'
        },
        // {
        //     // no break space after figures table page chapitre ect. + number
        //     reg: /(figures?|tables?|planches?|chapitres?|pages?|parties?|sections?|volumes?|vol\.)\s+(\d|I|X|V)/g, 
        //     repl: '$1\u00A0$2'
        // },
        // {
        //     // p. and pp. in blibliography
        //     reg: /(\spp?\.)\s?(\d)/g, 
        //     repl: '$1\u00A0$2'
        // }
    ]

    for (var i = 0; i < array.length; i++) {    
        elem = elem.replace(array[i].reg, array[i].repl);
    }
    return elem;

}






function exposants(content){
    // let paragraphs = document.querySelectorAll('p, ul, h1, h2, h3, h4, h5, h6');
    let all = content.querySelectorAll('p, span');
    // console.log(all);

    all.forEach(element => {
        element.innerHTML = exposantsRegex(element.innerHTML)
    })
    // for (var p = 0; p < paragraphs.length; p++) {
    //     paragraphs[p].innerHTML = exposantsRegex(paragraphs[p].innerHTML);
    // }
    
}


function exposantsRegex(elem){

    let array = [
        {
            // numéros
            reg: /\sno\.?\s?(\d+)/g, 
            repl: ' n<sup>o</sup>&nbsp;$1' 
        },
        {
            // siècles + small caps
            reg: /(XXI|XX|XIX|XVIII|XVII|XVI|XV|xxi|xx|xix|xviii|xvii|xvi|xv)(e|er)/g,
            repl: '<span style="text-transform: lowercase; font-variant: small-caps;">$1</span><sup>$2</sup>' 
        },
        {
            // exposant e après chiffres 
            reg: /(\d+)(er|e)/g, 
            repl: '$1<sup>$2</sup>' 
        },
    ]
    for (var i = 0; i < array.length; i++) {    
        elem = elem.replace(array[i].reg, array[i].repl);
    }
    return elem;
    
}


function noHyphens(){
    let paragraphs = document.querySelectorAll('p');

    // Problems here because replace also content in `href`, `data`atttribute, etc.
    // for (var i = 0; i < paragraphs.length; i++) {
    //     let p = paragraphs[i];
    //     p.innerHTML = p.innerHTML.replace(/([A-ZÀ-Ö][a-zØ-öø-ÿœ]{3,})/g, '<span style="hyphens: none">$1</span>');
    // }
    
}