document.addEventListener("DOMContentLoaded", function() {
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) =>
    context.querySelectorAll(selector);
  const html = (nodeList, newHtml) => {
    Array.from(nodeList).forEach(element => {
      element.innerHTML = newHtml;
    });
  };
  const listen = node => event => method =>
    node.addEventListener(event, method);
  const makeNode = node => document.createElement(node);
  const stringIt = obj => JSON.stringify(obj);
  const getLocation = () => {
    navigator.geolocation
      ? navigator.geolocation.getCurrentPosition(showPosition)
      : (display.innerHTML = "Geolocation is not supported by this browser.");
  };
  const tableCreate = items => {
    let format = Object.entries(items);
    items = format.filter(x => x[1]);
    let tbl = document.createElement("table");
    tbl.style.width = "200px";
    tbl.style.border = "1px solid black";

    let tr = tbl.insertRow();
    let trl = tr.insertCell(0);
    let trrl = tr.insertCell(1);
    let lable1 = trl.appendChild(document.createTextNode("category"));
    let lable2 = trrl.appendChild(document.createTextNode("data"));
    for (let i of items) {
      let col1 = trl.appendChild(tbl.insertRow());
      let col2 = trrl.appendChild(tbl.insertRow());
      col1.appendChild(document.createTextNode(i[0]));
      col2.appendChild(
        document.createTextNode(typeof i[1] === "object" ? i[1].pretty : i[1])
      );
      col2.style.width = "100px";
      col1.style.border = "1px solid black";
      col2.style.border = "1px solid black";
    }
    tbl.style.width = "400px";
    document.body.insertAdjacentElement("beforeend", tbl);
  };
  const getLength = number => number.toString().length;
  let frag = document.createDocumentFragment();
  let button = makeNode("button");
  let consent = makeNode("p");
  let display = makeNode("div");
  let dateInput = makeNode("input");
  let show = makeNode("button");
  let submit = makeNode("button");
  show.innerText = "select your own date";
  submit.innerText = "submit";
  submit.style.display = "none";
  dateInput.style.display = "none";
  dateInput.setAttribute("type", "date");
  dateInput.setAttribute("id", "date");
  dateInput.style.margin = "15px";

  button.innerText = "click to get last Sunday's forcast";
  consent.innerText =
    "Your consent is required to obtain forcast information. Please click and allow the location of your browser to be idenfityied.";
  frag.appendChild(consent);
  frag.appendChild(button);
  frag.appendChild(display);
  frag.appendChild(show);
  frag.appendChild(dateInput);
  frag.appendChild(submit);
  const grabDateInput = input => {};
  const toggle = element => {
    dateInput.style.display === "none"
      ? (
          (button.style.display = "none"),
          (dateInput.style.display = "inline"),
          (submit.style.display = "inline")
        )
      : (
          (button.style.display = "inline"),
          (dateInput.style.display = "none"),
          (dateInput.value = null),
          (submit.style.display = "none")
        );
  };

  document.body.appendChild(frag);
  listen(button)("click")(getLocation);
  listen(show)("click")(toggle);
  listen(submit)("click")(getLocation);
  function getLastSunday(d) {
    var t = new Date(d);
    t.setDate(t.getDate() - t.getDay());
    return t;
  }
  let sunday = getLastSunday(new Date());
  let month = 0;
  let day = 0;
  getLength(sunday.getMonth()) < 2
    ? (month = "" + 0 + (sunday.getMonth() + 1))
    : (month = sunday.getMonth() + 1);
  getLength(sunday.getDate()) < 2
    ? (day = "" + 0 + sunday.getDate())
    : (day = sunday.getDate());

  function showPosition(position) {
    let formatedDate;
    let week = true;
    dateInput.value
      ? ((formatedDate = dateInput.value.replace(/-/g, "")), (week = false))
      : (formatedDate = "" + sunday.getFullYear() + month + day);

    let payload = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      lastWeek: formatedDate,
      type: week
    };
    let data = new FormData();
    data.append("json", JSON.stringify(payload));
    fetch("/weather", { method: "post", body: data })
      .then(res => res.json())
      .then(res => {
        week
          ? res.forEach(item => {
              tableCreate(item.history.dailysummary[0]);
            })
          : tableCreate(res.history.dailysummary[0]);
      });
  }
});
