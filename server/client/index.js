(function() {
  window.submit = submit;

  function submit(form) {
    if(form.comment.value.trim()) {
      post(form.comment.value);
    }
  }

  function render(response) {
    var data = JSON.parse(response.target.response);

    data.comments.map(function(comment) {
      append(comment);
    });

    function append(object) {
      var br = document.createElement('br');

      var comment = document.createElement('span');
      comment.setAttribute('class', 'message');
      comment.innerHTML = object.comment;

      var date = document.createElement('span');
      date.setAttribute('class', 'date');
      date.innerHTML = object.date;

      var author = document.createElement('span');
      author.setAttribute('class', 'email');
      author.innerHTML = 'Email: ' + object.email;

      var container = document.createElement('div');

      container.setAttribute('class', 'comment');
      container.append(comment);
      container.append(author);
      container.append(date);
      container.append(br);

      document.getElementById('comments').append(container);
    }
  }

  function post(comment) {
    var payload = {
      comment: comment,
      date: new Date(),
      email: email()
    };

    var http = new XMLHttpRequest();
        http.open("POST", 'http://127.0.0.1:3000/api/comment');
        http.setRequestHeader('Content-type','application/json; charset=utf-8');
        http.onreadystatechange = function(response) {
        	if(http.readyState == 4 && http.status == 200) {
            render(response);
        	}
        }
        http.send(JSON.stringify(payload));
  }

  function get() {
    var http = new XMLHttpRequest();
        http.open("GET", 'http://127.0.0.1:3000/api/comment');
        http.onreadystatechange = function(response) {
          if(http.readyState == 4 && http.status == 200) {
            render(response);
          }
        }
        http.send();
  }

  function email() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < 5; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text + '@heracl.io';
  }

  get();
})();
