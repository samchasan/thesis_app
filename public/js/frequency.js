
$(window).on('load', () => {

  const path = window.location.pathname

  const url = `${path}/singleWasteJSON`

  let dayToHighlight = ''


  function isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        console.log('obj', obj)
      return false;
    }
    return true;
  }

  axios.get(url)
    .then(function (res) {
      console.log('axios got url', res);
      const freq = res.data.waste.frequency
      if (!isEmpty(freq)) {

        dayToHighlight = freq.moment

        const boxesToHighlight = document.getElementById(dayToHighlight)
        $(boxesToHighlight).addClass('is-selected')
        console.log('boxesToHighlight', boxesToHighlight)

      }
    })


})
