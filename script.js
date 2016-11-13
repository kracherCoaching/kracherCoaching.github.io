//global variables:
var backFwd = true;
var refresh = false;
var bodySizeOld = 0;
var viewportHeightOld = 0;

function onResize() {
  var bodyEl = document.getElementsByTagName('body')[0];
  if ((window.getComputedStyle(bodyEl).width != bodySizeOld)
  || (Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  != viewportHeightOld)) {
    onLoad(false);
  }
}

//this function is called on fresh load and refresh:
function onLoad(animation) {
  var bodyEl = document.getElementsByTagName('body')[0];
  bodySizeOld = window.getComputedStyle(bodyEl).width;
  viewportHeightOld = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  var hash = window.location.hash.substring(1);
  if (hash.length > 0 && hash != "none"){
    refresh = true;
    var sectionEl = document.getElementById(hash);
    sectionEl.style.height = "1px";
    chooseSection(hash, animation);
  } else {
    var homeEl = document.getElementById('home');
    homeEl.style.height = "1px";
    chooseSection('home');
    //scroll to top:
    $('html, body').animate({ scrollTop: 0 }, 0);
  }
}

//this function is called in case of a changeHash-event:
function changeHash(sectionId){
  //if fwd or backwd was pressed the refresh-function has to be called:
  if (backFwd) {
    onLoad(true);
  }
  backFwd = true;
}

//this function opens a closed section or closes an open section
// and changes the hash-tag accordingly:
// (changing the hash-tag is going to fire an event which calls the changeHash-function)
function chooseSection(sectionId, animation){
  //get section-element (partent) to given id:
  var sectionEl = document.getElementById(sectionId);

  //save scroll position:
  var scrollOld = $(document).scrollTop();
  var sectionHeightOld = parseInt(sectionEl.style.height);

  var mainEl = document.getElementById('main');
  var allSectionEls = mainEl.getElementsByTagName('section');

  //hide all sections:
  for (index = 0; index < allSectionEls.length - 1; index++){

    //get header height of each section:
    var h2El = allSectionEls[index].getElementsByTagName('h2')[0];
    var h2Height = elHeightInclMarginPx(h2El);

    //section-height := header-height
    allSectionEls[index].style.height = h2Height + "px";
  }

  //get header-height and article-height of chosen section:
  var h2El = sectionEl.getElementsByTagName('h2')[0];
  var articleEl = sectionEl.getElementsByTagName('article')[0];
  var h2Height = elHeightInclMarginPx(h2El);
  var articleHeight = elHeightInclMarginPx(articleEl);

  //set backFwd to false to tell that the hash has been changed by
  // chooseSection() and not by the browser:
  // (in case of a refresh the changeHash-event is not called)
  if (!refresh) {
    backFwd = false;
  }

  //if a closed section is chosen, open it,
  // otherwhise let all sections be closed:
  if (sectionHeightOld <= h2Height) {
    //change hash tag:
    window.location.hash = sectionId;
    //show the desired section:
    if (animation) {
      $(sectionEl).animate({ height: h2Height + articleHeight + "px" }, 300);
    } else {
      sectionEl.style.height = h2Height + articleHeight + "px";
    }
  } else {
    window.location.hash = "none";
  }
  refresh = false;
  //scroll to top:
  $('html, body').animate({ scrollTop: 0 }, 0);
}

//this function returns the height + margin of a given element;
function elHeightInclMarginPx(el){
  var elHeight = window.getComputedStyle(el).height;
  elHeight = parseInt(elHeight);
  var elMarginTop = window.getComputedStyle(el).marginTop;
  elMarginTop = parseInt(elMarginTop);
  var elMarginBottom = window.getComputedStyle(el).marginBottom;
  elMarginBottom = parseInt(elMarginBottom);

  //return elHeight+elMargin as int in px:
  return elHeight+elMarginTop+elMarginBottom;
}
