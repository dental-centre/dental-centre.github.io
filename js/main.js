function main() {
  document.getElementById("access-code").addEventListener('keydown', () => {
    if (event.keyCode === 13) {
      event.srcElement.blur();
      validate();
    }
  });
  document.getElementById("access-code").addEventListener('blur', validate);
  document.getElementById("access-code").addEventListener('focus', clearStyle);


  function validate() {
    let fileName = event.srcElement.value;

    document.getElementById("access-code").classList.add("validate");
    document.getElementById("access-code").classList.remove("success");
    document.getElementById("access-code").classList.remove("error");

    if (fileName == '') {
      document.getElementById("access-code").classList.remove("validate");
    }
    else {
      var request = new XMLHttpRequest();

      request.open('GET', 'testbed/' + fileName + '/index.html', true);

      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          if (request.status === 404) {
            document.getElementById("access-code").classList.add("error");
            document.getElementById("access-code").classList.remove("success");
          }
          else {
            document.getElementById("access-code").classList.remove("error");
            document.getElementById("access-code").classList.add("success");
            setTimeout(function () {
              window.location.href = 'testbed/' + fileName + '/index.html';
            }, 2000);
          }
        }
      };

      request.send();
    }
  }

  function clearStyle() {
    event.srcElement.select();
    document.getElementById("access-code").classList.remove("success");
    document.getElementById("access-code").classList.remove("error");
  }
}
window.addEventListener('load', main);
