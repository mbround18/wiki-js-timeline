const garth =
  "https://gist.githubusercontent.com/mbround18/14afba09ee3e9d9263141ea0a4d82459/raw/dd6a7de94ef0b5a41615bdc8af0dd463a5e092c7/garth.events.json";

function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

function zoomIn() {
  var Page = document.querySelector("body");
  var zoom = parseInt(Page.style.zoom) + 10 + "%";
  Page.style.zoom = zoom;
  return false;
}

function zoomOut() {
  var Page = document.querySelector("body");
  var zoom = parseInt(Page.style.zoom) - 10 + "%";
  Page.style.zoom = zoom;
  return false;
}

function addEvent({ time, event, title }) {
  waitForElm("#timeline").then((timeline) => {
    const li = document.createElement("li");
    const container = document.createElement("div");
    li.className = "slide-in";
    const block = document.createElement("time");
    block.innerText = `${time} AN ${title ? " : " + title : ""}`;
    const text = document.createTextNode(event);
    container.appendChild(block);
    container.appendChild(text);
    li.appendChild(container);
    timeline.appendChild(li);
  });
}

async function addEvents(data) {
  let sorted = data.sort((a, b) => a.time - b.time);
  for (const event of sorted) {
    addEvent(event);
  }
}

function main() {
  const items = document.querySelectorAll(".timeline-section li");
  function isElementInViewport(el) {
    let rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function slideIn() {
    for (let i = 0; i < items.length; i++) {
      if (isElementInViewport(items[i])) {
        items[i].classList.add("slide-in");
      } else {
        items[i].classList.remove("slide-in");
      }
    }
  }

  window.addEventListener("load", slideIn);
  window.addEventListener("scroll", slideIn);
  window.addEventListener("resize", slideIn);
  zoomOut();
  zoomIn();
}

waitForElm("#timeline")
  .then(async () => {
    const derp = await axios.get(garth);
    let jsonString = derp.data;
    jsonString = jsonString
      .replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) =>
        g ? "" : m
      )
      .trim();
    return JSON.parse(jsonString);
  })
  .then(addEvents)
  .then(main);
