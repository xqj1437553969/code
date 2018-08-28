(function (doc, win) {
  var docEl = win.document.documentElement;
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  var refreshRem = function () {
        var clientWidth = win.innerWidth|| doc.documentElement.clientWidth|| doc.body.clientWidth;
	    if (!clientWidth) return;
	    var fz;
	    var width = clientWidth;
	    fz = 100 * width / 375;
	    docEl.style.fontSize = fz + 'px';
  };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, refreshRem, false);
  doc.addEventListener('DOMContentLoaded', refreshRem, false);
  refreshRem();

})(document, window);