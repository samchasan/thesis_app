
$("#submitButton").submit(function (event) {
  $.post('', $("#Search").serialize(), function (data) {
 	console.log(data) //data is the response from the backend
  });
  event.preventDefault();
});
