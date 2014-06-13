var addButton = function (files, index, testID) {
  var btn = document.createElement("button")
  chrome.storage.sync.get("subscriptions", function (item) {
    if (typeof item.subscriptions === "undefined") {
      item.subscriptions = {};
    }

    if (item.subscriptions[testID] === "undefined" || item.subscriptions[testID] !== testID) {
      var t = document.createTextNode("Subscribe");
      btn.appendChild(t);
    }
    else {
      var t = document.createTextNode("Subscribed");
      btn.appendChild(t);
    }
  });

  btn.onclick = function () {
    chrome.storage.sync.get("subscriptions", function (item) {
      if (typeof item.subscriptions === "undefined") {
        item.subscriptions = {};
      }

      item.subscriptions[testID] = testID;
      chrome.storage.sync.set({subscriptions: item.subscriptions});
      btn.innerHTML = "Subscribed";
    });
  };
  files[index].appendChild(btn);
};

var files = document.querySelectorAll('div.pift-operations');
for (var i = 0; i < files.length; i++) {
  var operationLinks = files[i].getElementsByTagName('a');
  for (var j = 0; j < operationLinks.length; j++) {
    if (operationLinks[j].innerHTML === 'View') {
      var testID = operationLinks[j].getAttribute("href").split("/").pop();
      addButton(files, i, testID);
      break;
    }
  }
}
