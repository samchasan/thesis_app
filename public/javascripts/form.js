
$("#Search").submit(function (event) {
  $.post('/route', $("#formId").serialize(), function (data) {
 	console.log(data) //data is the response from the backend
  });
  event.preventDefault();
});
