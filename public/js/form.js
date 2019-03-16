
$("#submitSearch").submit(function (event) {
  $.post('', $("#Search").serialize(), function (data) {
 	console.log(data) //data is the response from the backend
  });
  event.preventDefault();
});


$("#deleteList").submit(function (event) {
  $.post('', $("#delete").serialize(), function (data) {
 	console.log(data) //data is the response from the backend
  });
  event.preventDefault();
});

$(window).on('beforeunload', function(){
  console.log(`someone is leaving`)
})
