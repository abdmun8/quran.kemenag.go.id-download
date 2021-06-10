// paste this code on console https://quran.kemenag.go.id/
// created by abdmun8
var source = null;
var body = document.querySelector("body");
body.innerHTML = "<h1>Downloading..</h1>";
var saveData = (function () {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  return function (data, fileName) {
    var json = JSON.stringify(data),
      blob = new Blob([json], { type: "octet/stream" }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
})();

function waiting(doSomething = () => {}, delay = 5000) {
  setTimeout(() => {
    return doSomething();
  }, delay);
}

$.get("https://quran.kemenag.go.id/api/v1/surat/0/114", (res) => {
  source = res.data;

  const getData = async (master) => {
    for (let index = 0; index < master.length; index++) {
      const element = master[index];
      const request = (item) =>
        new Promise((resolve, reject) => {
          waiting(() => {
            console.log(`downloading surat ${item.id}!`);
            $.get(
              `https://quran.kemenag.go.id/api/v1/ayatweb/${item.id}/0/0/${item.count_ayat}`,
              (res) => {
                resolve(res.data);
                $(body).append(`<p>surat ${item.id} success</p>`);
              }
            ).fail(() => {
              reject({});
              console.log(`get surat ${item.id} failed!`);
            });
          });
        });

      try {
        const ayat = await request(element);
        source[index].ayat = ayat;
      } catch (error) {
        const ayat = await request(element);
        source[index].ayat = ayat;
      }
    }
    saveData(source, "quran.json");
  };

  getData(source);
});

