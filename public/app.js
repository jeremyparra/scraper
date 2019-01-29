
$(document).ready(function () {

  $.getJSON("/movies", function (data) {
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $(".movie-table").append("<li class='media result-item'><img src= '"+data[i].poster+ "' class='mr-3' alt='movie poster'></img><div class='media-body'><h5 class='mt-0 mb-1'>"+data[i].rank+"</h5><h5 class='mt-0 mb-1'>"+data[i].title+"</h5><p class='tomatos-rank'>Rotten Tomatoes Rating: "+data[i].tomatosRank+"</p><p>"+data[i].consensus+"</p><button type='button' class='btn btn-primary btn-sm save'>SAVE</button></div></li>");
    }
    console.log(data);
  });

  //All items below this line are not currently working properly
  // $(document).on("click", ".save", function() {
  //   movieSave();
  // });

  // function movieSave() {
  //   // This function is triggered when the user wants to save an article
  //   // When we rendered the article initially, we attached a javascript object containing the headline id
  //   // to the element using the .data method. Here we retrieve that.
  //   var movieSave = $(".movie-table")
  //     .parents(".result-item")
  //     .data();
  
  //   // Remove card from page
  //   $(".movie-table")
  //     .parents(".result-item")
  //     .remove();
  
  //   movieSave.saved = true;
  //   // Using a patch method to be semantic since this is an update to an existing record in our collection
  //   $.ajax({
  //     method: "PUT",
  //     url: "/api/movies/" + movieSave._id,
  //     data: movieSave
  //   }).then(function(data) {
  //     // If the data was saved successfully
  //     if (data.saved) {
  //       // Run the initPage function again. This will reload the entire list of articles
  //       location.reload()
  //     }
  //   });
  // }

});

