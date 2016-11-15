// http://netology-hj-ajax.herokuapp.com/homework/login_json

window.onload = function() {

  var userInfo = document.querySelector('.user-info'),
      formSubmit = document.forms.signIn,
      signOutBtn = document.querySelector('.signOut');


  formSubmit.addEventListener('submit', sendData);
  signOutBtn.addEventListener('click', function() {
    userInfo.style.display = 'none';
    formSubmit.style.display = 'block';
  });

  function sendData(e) {

    e.preventDefault();

    var target = e.target,
        action = target.action,
        enctype = target.enctype,
        email = target.querySelector('[name="email"]').value,
        password = target.querySelector('[name="password"]').value,
        buttonSend = target.querySelector('[type="submit"]'),
        preloader = document.querySelector('.preloader'),
        errorWrapper = document.querySelector('.error');

    var xhr = new XMLHttpRequest();
    xhr.open('POST', action, true);
    xhr.setRequestHeader('Content-Type', enctype);

    var body = 'email=' + encodeURIComponent(email) +
               '&password=' + encodeURIComponent(password);

    xhr.addEventListener('loadstart', function() {
      preloader.style.display = 'block';
      buttonSend.disabled = true;
      errorWrapper.innerHTML = '';
    })

    xhr.addEventListener('loadend', function() {
      var data = {};
      preloader.style.display = 'none';
      buttonSend.disabled = false;


      if( xhr.status === 200 ) {

        if( xhr.responseXML ) {
          dataXML = xhr.responseXML;
          data.userpic = dataXML.querySelector('userpic').textContent;
          data.name = dataXML.querySelector('name').textContent;
          data.lastname = dataXML.querySelector('lastname').textContent;
          data.country = dataXML.querySelector('country').textContent;
          data.hobbies = [];
          var hobbiesElements = dataXML.querySelectorAll('hobby');

          for( var i = 0, size = hobbiesElements.length; size > i; i++ ) {
            data.hobbies.push(hobbiesElements[i].textContent);
          }

        } else {
          data = JSON.parse(xhr.responseText);
        }

        console.log(data);


        var name = data.name + ' ' + data.lastname;

        userInfo.querySelector('.user-image').src = data.userpic;
        userInfo.querySelector('.user-name').innerHTML = name;
        userInfo.querySelector('.user-counrty').innerHTML = data.country;
        userInfo.querySelector('.user-hobbies').innerHTML = data.hobbies.join(', ');


        target.style.display = 'none';
        userInfo.style.display = 'block';

      } else {
        var errorText = '';

        if( xhr.responseXML ) {
          errorText = xhr.responseXML.querySelector('message').textContent
        } else {
          errorText = data.error.message;
        }
        errorWrapper.innerHTML = errorText;
      }

    })

    xhr.send(body);

  }

}