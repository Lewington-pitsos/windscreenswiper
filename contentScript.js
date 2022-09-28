function swipe() {
  rating = Math.random()
    $.each($('button'), (index, item) => {
      const spanEle = $(item).find('span.Hidden');
      const btnText = spanEle ? spanEle.text().toLocaleLowerCase() : '';
      if (rating > 0.3) {
        if (btnText.indexOf('like') !== -1 && btnText.indexOf('super like') === -1) $(item).click();
      } else {
        if (btnText.indexOf('nope') !== -1) $(item).click(); // damn, what a roast
      }
    });
}

const runApp = (speedTime = 3500) => {
  swipe();
  setInterval(() => {
    swipe();
  }, speedTime * (0.75 + Math.random() * 0.5));
};

const stopApp = () => {
  for (let i = 1; i < 99999; i++) window.clearInterval(i);
};

chrome.runtime.onMessage.addListener((message) => {
  console.log(message);
  if (message.startSwiping) runApp(message.speedTime);
  if (message.stopSwiping) stopApp();
});
