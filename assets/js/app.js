/*GifTastic JS To-Do LIst

Bootcamp Spot Homework Link:
https://umn.bootcampcontent.com/University-of-Minnesota-Boot-Camp/MINSTP201803FSF2-Class-Repository-FSF/blob/master/01-Class-Content/06-ajax/02-Homework/Instructions/homework.md

Overview

In this assignment, you'll use the GIPHY API to make a dynamic web page that populates with gifs of your choice. To finish this task, you must call the GIPHY API and use JavaScript and jQuery to change the HTML of your site.

1.  Create array of strings- each related to topic of interest- save to a var called 'topics' (suggestion = animals);

2. Take topics from the array and create buttons

3. When User clicks a button, page should grab 10 images from Giphy API and place them on the page

4. When user clicks a still giphy image, the gif should animate, if user clicks gif again, it should stop

5. Under every Gif, display rating (pg, etc)

5. Add a FORM that takes user input and adds it to the 'topics' array.  Then make a function call that takes each topicand remakes the buttons on the page.  

6.  Deploy to Github Pages

Bonus Goals-

1.  Mobile Responsiveness
2. Allow users to request additional gifs to be added to the page- each req should add 10 gifs, not ovewrite existing gifs
3. List Addtl Metadata for each gif in a clean/readable format
4. Include a 1 click download button for each Gif- this should work on multiple device types
5. integrate search with addtl api's like OMDB or bands in town.  Be creative
6. Allow users to add gifs to a favorites section
7. Major Challange:  Make the favorites section remain even after page is loaded

Other ideas-
-Brutalist ala Craigslist
-Something that functions similar to Google Fonts
- 

*/
/* 
ID's from HTML

#gif-container-main : Send incoming Gifs here

Search: 
#search-text-input : Input text from user
#gif-website-selection : Option Selector with options: Giphy | Something Else | Don't Care
#quantity-input-selection : Qtty of search results
#rating-selection : Option selector: g | pg | r | any
#search-button : Submit form

#reset-button : Clear Search 

Ajax code:


*/

//Functions
//=================================

function runQuery(urlInput) {

    //Ajax Function
    $.ajax({
        url:urlInput,
        method:"GET"
    }).then(function(gifsRecieved) {

        console.log(gifsRecieved);

        //$("#search-results").text(JSON.stringify(gifsRecieved));

        //Clear out gif container
        var gifContainer = $("#gif-container-main");
        gifContainer.empty();

        var imageLink = gifsRecieved.data[1].images.original;
        var imageLink = imageLink.split(',');
        var cleanedImageLink = "";

        for (var i=0; i<imageLink[i];i++) {
            cleanedImageLink+=imageLink[i].toString();;
            console.log(cleanedImageLink);
        }


        // console.log(gifsRecieved.data[1].images.original);
        // //Create our html elements
        // for (var i = 0; i< gifsRecieved.data.length; i++) {
        //     var newImg = $("<img>");

            

        //     console.log(gifsRecieved.data[i].images.original);

        //     newImg.attr("src",gifsRecieved.data[i].original);
        //     gifContainer.append(newImg);


        // }


    });

};






$(document).ready(function () {

    //1. Retrieve all search values when search button is clicked (and clear out the old?)


    $("#search-button").on("click", function () {
        event.preventDefault();

        /////////////////////////////////
        //Retrieve All Search Input Values
        /////////////////////////////////
        var queryURL = "";
        //Text Input
        var queryTerm = $("#search-text-input").val().trim();

        //Website (Just giphy for now)
        var website = $("#gif-website-selection").val();

        //# of Results
        var quantity = $("#quantity-input-selection").val();

        //Rating 
        var rating = $("#rating-input").val();

        //URL Construction 
        console.log(queryTerm,website,quantity,rating);
        switch (website) {

            //Giphy is selected
            case "a":
                queryURL =  "https://api.giphy.com/v1/gifs/search?q=" + queryTerm + '&api_key=dc6zaTOxFJmzC' + '&rating=' + rating + '&limit='+quantity;

                break;

            case "b":

                break;

            case "c":

                break;
            default:
                break;
        }

        runQuery(queryURL);

    });

});