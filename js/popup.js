myID = document.getElementById("popup");

var myScrollFunc = function() {
  var y = window.scrollY;
  if (y > 3000 && y < 5000) {
    myID.className = "bottomMenu show"
  } else {
    myID.className = "bottomMenu hide"
  }
};

window.addEventListener("scroll", myScrollFunc);