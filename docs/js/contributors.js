$.fn.contributors = function(username, reponame) {
  var 
    elem = this,
    url = [
      "https://api.github.com/repos/", 
      username, "/", reponame, 
      "/contributors?callback=?" 
    ].join("");

  $.getJSON(url, function(result) {
    for (var idx = 0; idx < result.data.length; ++idx) {
      var contributor = result.data[idx];
      if (contributor.login !== username) {
        $("<span><a/></span>")
          .find("a")
          .attr("href", contributor.html_url)
          .text(contributor.login)
          .end()
          .appendTo(elem);
      }
    }
  });
}
