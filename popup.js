let tabId = null;
const DEFAULT_SPEED = 3.5; // 0.1*1000 = 100 ms

const setButtonDisabled = ($this, value) => $this.prop('disabled', value);

const startSwiping = () => {
  const speedTime = $('#speedTime').val();
  if (!speedTime) {
    $('#speedTime, #speedSlider').val(DEFAULT_SPEED);
  }

  localStorage.isStarted = 'true';
  localStorage.speedTime = speedTime ? speedTime : DEFAULT_SPEED;
  setButtonDisabled($('#startSwiping'), true);
  setButtonDisabled($('#stopSwiping'), false);
  chrome.tabs.sendMessage(tabId, { startSwiping: true, speedTime: parseFloat(localStorage.speedTime) * 1000 });
};

const stopSwiping = () => {
  localStorage.isStarted = 'false';
  setButtonDisabled($('#stopSwiping'), true);
  setButtonDisabled($('#startSwiping'), false);
  chrome.tabs.sendMessage(tabId, { stopSwiping: true });
};

const runApp = (tab) => {
  console.log(tab);
  if (
    tab.url.includes('https://tinder.com') ||
    tab.url.includes('https://www.tinder.com') ||
    tab.url.includes('http://tinder.com') ||
    tab.url.includes('http://www.tinder.com')
  ) {
    tabId = tab.id; // Tab ID
    const speedTime = localStorage.speedTime ? localStorage.speedTime : DEFAULT_SPEED;
    $('#speedTime').val(speedTime);
    $('#speedSlider').val(speedTime * 1000);

    setButtonDisabled($('#stopSwiping'), true);

  } else {
    $('.buttons').hide();
    $('.not-tinder').show();
  }
};

window.addEventListener('DOMContentLoaded', () => {
  $('#title').text(chrome.runtime.getManifest().name);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => tabs.length && runApp(tabs[0]));
});

$(document).on('click', '#openTinder', () => chrome.tabs.create({ url: 'https://tinder.com', active: true }));
$(document).on('click', '#startSwiping', startSwiping);
$(document).on('click', '#stopSwiping', stopSwiping);
$(document).on('keyup', '#speedTime', function () {
  var val = $(this).val();
  if (isNaN(val)) {
    val = val.replace(/[^0-9\.]/g, '');
    if (val.split('.').length > 2) val = val.replace(/\.+$/, '');
  }
  $(this).val(val);
  $('#speedSlider').val(val * 1000);
});
$(document).on('input', '#speedSlider', function () {
  var val = $(this).val();
  $('#speedTime').val(val / 1000);
});
