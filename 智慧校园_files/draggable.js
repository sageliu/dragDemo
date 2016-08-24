!(function(moduleName, definition) {
  // Whether to expose Draggable as an AMD module or to the global object.
  if (typeof define === 'function' && typeof define.amd === 'object') define(definition);
  else if (typeof module === 'object') module.exports = definition();
  else this[moduleName] = definition();

})('draggable', function definition() {
  var addEventListener = ( function (w) {
                if (w.addEventListener) {
                    return function (element, eventName, handler){
                      element.addEventListener(eventName, handler, false);
                    }
                } else if (w.attachEvent) {
                    return function (element, eventName, handler){
                      element.attachEvent('on' + eventName, handler);
                    } 
                } else {
                  return function (element, eventName, handler){
                    element['on' + eventName] = handler;
                  }
                }
            })(window)
  ,removeEventListener = ( function(w) {
      if (w.removeEventListener) {
        return function (element, eventName, handler){
          element.removeEventListener(eventName, handler, false);
        }
      } else if (w.detachEvent) {
        return function (element, eventName, handler){
          element.detachEvent('on' + eventName,handler);
        }
      } else {
        return function (element, eventName, handler){
          element['on' + eventName] = null;
        }
      }
  })(window)
  , toCamelCase = function (s){
    return s.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
  }
  , getStyle = function (el, styleProp) {
        if (typeof el['currentStyle']==='object'){
            getStyle = function (el, styleProp){
              var s='';
              s = el.currentStyle[toCamelCase(styleProp)];
              return s;
            }
          }
        else if (window.getComputedStyle){
            getStyle = function (el, styleProp){
              var s='';
              s = document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
              return s;
            }
          }
      return getStyle(el, styleProp);
  }
  , currentElement
  , fairlyHighZIndex = '10'
  , finalPosition = ''
  , whichButton = function(event){
    if (event.which == null){
      whichButton = function(event){
        button = (event.button < 2) ? "LEFT" :
          ((event.button == 4) ? "MIDDLE" : "RIGHT");
          return button;
      }
    }else{
      whichButton = function(event){
        button = (event.which < 2) ? "LEFT" :
          ((event.which == 2) ? "MIDDLE" : "RIGHT");
          return button;
      }
    }
    return whichButton(event);
  };

  function draggable(element, handle) {
    handle = handle || element;
    var index = parseInt(getStyle(element,'z-index'));
    fairlyHighZIndex = isNaN(index)? '10' : index ;
    setPositionType(element);
    setDraggableListeners(element);
    addEventListener(handle,'mousedown', function(event) {
      whichButton(event)==='LEFT' && startDragging(event, element);
    });
  }

  function setPositionType(element) {
    var orginPosition = getStyle(element,'position')
    if(orginPosition !=="fixed") {
      element.style.position ='relative';
      finalPosition = "absolute";
    }else{
      finalPosition = "fixed";
    }
    // element.style.position = 'absolute';
  }

  function setDraggableListeners(element) {
    element.draggableListeners = {
      start: [],
      drag: [],
      stop: []
    };
    element.whenDragStarts = addListener(element, 'start');
    element.whenDragging = addListener(element, 'drag');
    element.whenDragStops = addListener(element, 'stop');
  }
function setStyle(el, strCss){
    function endsWith(str, suffix) {
        var l = str.length - suffix.length;
        return l >= 0 && str.indexOf(suffix, l) == l;
    }
    var sty = el.style,
        cssText = sty.cssText;
    if(!endsWith(cssText, ';')){
        cssText += ';';
    }
    sty.cssText = cssText + strCss;
}
// var uclass = {
//     exists: function(elem,className){var p = new RegExp('(^| )'+className+'( |$)');return (elem.className && elem.className.match(p));},
//     add: function(elem,className){if(uclass.exists(elem,className)){return true;}elem.className += ' '+className;},
//     remove: function(elem,className){var c = elem.className;var p = new RegExp('(^| )'+className+'( |$)');c = c.replace(p,' ').replace(/  /g,' ');elem.className = c;}
// };
  function startDragging(event, element) {
    currentElement && sendToBack(currentElement);
    currentElement = bringToFront(element);
    var initialPosition = getInitialPosition(currentElement);
    // if(orginPosition !=="fixed") {
    //   currentElement.style.position ='relative';
    //   position = "absolute";
    // }else{
    //   position = "fixed";
    // }
    
    var css = 'position:'+finalPosition+';margin-left:0;margin-top:0;left:'+inPixels(initialPosition.left)+';top:'+inPixels(initialPosition.top)+';'
    setStyle(currentElement,css);
    currentElement.lastXPosition = event.clientX;
    currentElement.lastYPosition = event.clientY;

    var okToGoOn = triggerEvent('start', { x: initialPosition.left, y: initialPosition.top, mouseEvent: event });
    if (!okToGoOn) return;
    
    addDocumentListeners();
  }

  function addListener(element, type) {
    return function(listener) {
      element.draggableListeners[type].push(listener);
    };
  }

  function triggerEvent(type, args) {
    var result = true;
    var listeners = currentElement.draggableListeners[type];
    for (var i = listeners.length - 1; i >= 0; i--) {
      if (listeners[i](args) === false) result = false;
    };
    return result;
  }

  function sendToBack(element) {
    var decreasedZIndex = fairlyHighZIndex - 1;
    element.style['z-index'] = decreasedZIndex;
    element.style['zIndex'] = decreasedZIndex;
  }

  function bringToFront(element) {
    element.style['z-index'] = fairlyHighZIndex;
    element.style['zIndex'] = fairlyHighZIndex;
    return element;
  }

  function addDocumentListeners() {
    addEventListener(document,'selectstart', cancelDocumentSelection);
    addEventListener(document,'mousemove', repositionElement);
    addEventListener(document,'mouseup', removeDocumentListeners);
  }

  function getInitialPosition(element) {
    console.log(element.offsetLeft,element.offsetTop);
  var rect={};
    if(getStyle(element,'position')=='absolute'){
        rect={top:element.offsetTop
        ,left:element.offsetLeft};
    }else{
       rect = element.getBoundingClientRect();
    }
   return {
      top: rect.top,
      left: rect.left
    };
  }

  function inPixels(value) {
    return value + 'px';
  }

  function cancelDocumentSelection(event) {
    event.preventDefault && event.preventDefault();
    event.stopPropagation && event.stopPropagation();
    event.returnValue = false;
    return false;
  }

  function repositionElement(event) {
    // uclass.add(currentElement, "dragging");
    event.preventDefault && event.preventDefault();
    event.returnValue = false;
    var style = currentElement.style;
    var elementXPosition = parseInt(style.left, 10);
    var elementYPosition = parseInt(style.top, 10);
    var offsetX = event.clientX - currentElement.lastXPosition;
    var offsetY = event.clientY - currentElement.lastYPosition;
    var elementNewXPosition = elementXPosition + offsetX;
    var elementNewYPosition = elementYPosition + offsetY;
    var allowX = allowY = false;
    try{
    var offsetWidth = currentElement.offsetParent.offsetWidth-currentElement.offsetWidth;
    var offsetHeight = currentElement.offsetParent.offsetHeight-currentElement.offsetHeight;
    
    if(elementNewXPosition<offsetWidth){
      if(elementNewXPosition>=0) allowX =true;
    }else{
      if( offsetX<=0) allowX =true;
    }
    
    if(elementNewYPosition<offsetHeight){
      if( elementNewYPosition>=0) allowY = true;
    }else{
      if(offsetY<=0) allowY = true;
    }
    }catch(e){
      allowX = allowY = true;
    }
    if(allowX) style.left = inPixels(elementNewXPosition);
    if(allowY) style.top = inPixels(elementNewYPosition);
    currentElement.lastXPosition = event.clientX;
    currentElement.lastYPosition = event.clientY;

    triggerEvent('drag', { x: elementNewXPosition, y: elementNewYPosition, mouseEvent: event,offsetX:offsetX,offsetY:offsetY });
  }

  function removeDocumentListeners(event) {
    removeEventListener(document,'selectstart',cancelDocumentSelection);
    removeEventListener(document,'mousemove',repositionElement);
    removeEventListener(document,'mouseup',removeDocumentListeners);
    var left = parseInt(currentElement.style.left, 10);
    var top = parseInt(currentElement.style.top, 10);
    triggerEvent('stop', { x: left, y: top, mouseEvent: event });
    // uclass.remove(currentElement, "dragging");
  }

  return draggable;
});
