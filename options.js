// Saves options to chrome.storage.sync.
function save_options() {
  var enable_desktop_notifications = document.getElementById('enable_desktop_notifications').checked;
  var pbat = document.getElementById('pbat').value;
  var chosen_device = document.getElementById('chosen_device').value;

  var link_to = '';
  var radios = document.getElementsByName('link_to');
  for (var j=0, p=radios.length;j<p;j++) {
    if (radios[j].checked) {
      link_to = radios[j].value;
    }
  }

  chrome.storage.sync.set({
    enable_desktop_notifications: enable_desktop_notifications,
    pbat: pbat,
    chosen_device: chosen_device,
    link_to: link_to
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

// Restores preference values to the state stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    enable_desktop_notifications: '',
    pbat: '',
    chosen_device: '',
    link_to: '',
  }, function(items) {
    // Bring in existing settings for desktop notifications, the Pushbullet
    // access token, and where they prefer the notifications to link to.
    document.getElementById('enable_desktop_notifications').checked = items.enable_desktop_notifications;
    document.getElementById('pbat').value = items.pbat;
    if (items.link_to == 'dorg') {
      document.getElementById('link_to_dorg').checked = true;
    }
    else {
      document.getElementById('link_to_pifr').checked = true;
    }

    if (items.pbat) {
      // If we have an access token, go out and get their list of devices,
      // so they can choose which device they would like to have notified.
      var xhrPB = new XMLHttpRequest();
      xhrPB.open("GET", "https://api.pushbullet.com/v2/devices", false);
      xhrPB.setRequestHeader("Authorization", "Bearer " + items.pbat);
      xhrPB.send(null);
      if (xhrPB.status === 200) {
        var options = '<option value="">- All Devices -</option>';
        var resp = JSON.parse(xhrPB.responseText);
        var i = 0;

        // The response is a list of all their devices. As long as the device
        // is active and pushable, we will display it here.
        for (device of resp.devices) {
          i = i + 1;
          if (device.active && device.pushable) {
            var selected = '';
            if (device.iden == items.chosen_device) selected = ' selected="selected"';
            options = options + '<option value="' + device.iden + '"' + selected + '>&nbsp;' + device.nickname + '<br/>';
          }
        }

        document.getElementById('devices').innerHTML = '<select id="chosen_device" name="chosen_device">' + options + '</select>';
      }
      else {
        document.getElementById('devices').innerHTML = '<p>There was an error retrieving your list of devices.</p>';
      }
    }
  });
}

// When the content is loaded, fire restore_options to set default values.
document.addEventListener('DOMContentLoaded', restore_options);
// Bind the save_options function to the save button click.
document.getElementById('save').addEventListener('click', save_options);
