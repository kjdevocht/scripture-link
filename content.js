document.addEventListener("contextmenu", function(event){
    var selected = getSelectedElementTags(window);
    if(selected.length == 1){
        var targetElement = event.target || event.srcElement;
        var p = getClosest(targetElement, 'p');
        console.log(p);
        var currentURL = window.location.href;
        var index = findURIAttribute(currentURL);
        if(index === 1){
            if(p){
                var uri = "https://www.lds.org" + p.attributes[index].nodeValue;
            }
            else{
                uri = window.location.href;
            }
            
            var perIndex = uri.lastIndexOf(".");
            var currentVerse = uri.substring((uri.lastIndexOf(".")+1), uri.length);
            var previousVerse = currentVerse-1;

            chrome.runtime.sendMessage({
                from:'scripture link',
                subject: uri + "#" + previousVerse
            });
        }
        else if(index  == 0){
            if(p){
                var uri = "https://www.lds.org" + p.attributes[index].nodeValue;
            }
            else{
                uri = window.location.href;
            }
            var perIndex = uri.lastIndexOf(".");
            var currentParagraph = uri.substring((uri.lastIndexOf(".")+2), uri.length);
            var previousParagraph = currentParagraph-1;
            chrome.runtime.sendMessage({
                from:'scripture link',
                subject: uri + "#p" + previousParagraph
            });
        }
    }
    else{
      var p = selected[1];
      var currentURL = window.location.href;
      var index = findURIAttribute(currentURL);
      if(index === 1){
          var uri = "https://www.lds.org" + p.attributes[index].nodeValue;
          var perIndex = uri.lastIndexOf(".");
          var currentVerse = Number(uri.substring((uri.lastIndexOf(".")+1), uri.length));
          var previousVerse = currentVerse-1;
          var lastVerse = (currentVerse + (selected.length-2));
            
          chrome.runtime.sendMessage({
              from:'scripture link',
              subject: uri + "-" + lastVerse + "#" + previousVerse
          });
      }
      else if(index  == 0){
            var uri = "https://www.lds.org" + p.attributes[index].nodeValue;
            var perIndex = uri.lastIndexOf(".");
            var currentParagraph = Number(uri.substring((uri.lastIndexOf(".")+2), uri.length));
            var previousParagraph = currentParagraph-1;
            var lastParagraph = (currentParagraph + (selected.length-2));
          
            chrome.runtime.sendMessage({
                from:'scripture link',
                subject: uri + "-" + lastParagraph + "#p" + previousParagraph
            });
      }
        
    }
    
});



function getClosest(el, tag) {
  // this is necessary since nodeName is always in upper case
  tag = tag.toUpperCase();
  do {
    if (el.nodeName === tag) {
      // tag name is found! let's return it. :)
      return el;
    }
  } while (el = el.parentNode);

  // not found :(
  return null;
}

function findURIAttribute(uri){
    var scripturesPattern = new RegExp("https://www.lds.org/scriptures/*");
    var generalConferencePattern = new RegExp("https://www.lds.org/general-conference/*");
    if(scripturesPattern.test(uri)){
        return 1;   
    }
    
    if(generalConferencePattern.test(uri)){
        return 0;   
    }
    else{
      return 0;
    }
}

function rangeIntersectsNode(range, node) {
    var nodeRange;
    if (range.intersectsNode) {
        return range.intersectsNode(node);
    } else {
        nodeRange = node.ownerDocument.createRange();
        try {
            nodeRange.selectNode(node);
        } catch (e) {
            nodeRange.selectNodeContents(node);
        }

        return range.compareBoundaryPoints(Range.END_TO_START, nodeRange) == -1 &&
            range.compareBoundaryPoints(Range.START_TO_END, nodeRange) == 1;
    }
}

function getSelectedElementTags(win) {
    var range, sel, elmlist, treeWalker, containerElement;
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
        range = sel.getRangeAt(0);
    }

    if (range) {
        containerElement = range.commonAncestorContainer;
        if (containerElement.nodeType != 1) {
            containerElement = containerElement.parentNode;
        }

        treeWalker = win.document.createTreeWalker(
            containerElement,
            NodeFilter.SHOW_ELEMENT,
            function(node) { return rangeIntersectsNode(range, node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; },
            false
        );

        elmlist = [treeWalker.currentNode];
        while (treeWalker.nextNode()) {
            if(treeWalker.currentNode.tagName == 'P'){
                elmlist.push(treeWalker.currentNode);
            }
        }

        console.log(elmlist);
        return elmlist;
    }
}

//<input type="button" onclick="getSelectedElementTags(window)" value="Get selected elements">