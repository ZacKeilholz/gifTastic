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

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



function runQuery(urlInput) {

    //Ajax Call Function
    $.ajax({
        url: urlInput,
        method: "GET"
    }).then(function (gifsRecieved) {

        var results = gifsRecieved.data;

        console.log(results);


        //gifContainer.empty();
        $("#example-image").attr("src", results[1].images.fixed_height.url);

        //Get a random color to assign to the search group
        var randomColor = getRandomColor();
        console.log("COLOR: ", randomColor);
        //Create our html elements
        for (var i = 0; i < results.length; i++) {

            //Create Container and Elements- divWrapper controls responsiveness and margins
            var divWrapper = $("<div>");
            divWrapper.addClass("col-lg-3 col-md-4 col-sm-12 pb-2 pt-2 gif-wrapper");
            divWrapper.css("background", randomColor);

            var gifCard = $("<div>").addClass("card");

            //Captions and Text (Add Clickable 'DOWNLOAD' Class Button here)
            var textContainer = $("<div>");
            textContainer.addClass("col-12 container");

            var spanInfo = $("<p>");
            spanInfo.text("Rating: " + results[i].rating)
            spanInfo.addClass("card-text text-center font-weight-bold");

            var buttonDownload = $("<button>");
            buttonDownload.html('<i class="fa fa-plus"></i>')
            buttonDownload.addClass("card-text text-center btn-block mb-2 btn btn-primary download-gif");
            buttonDownload.attr("selected-state", 0);


            textContainer.append(spanInfo, buttonDownload);

            //Image a href wrapper- set to inactive CSS class by default.

            var getGifUrl = $(this).attr("data-animate");

            var aHref = $("<a>");
            aHref.attr("href", results[i].images.fixed_height.url);
            aHref.addClass("inactive-link");

            //Create Image-
            var newImg = $("<img>");

            //Add Url's for Still and Animate Custom Attr's
            newImg.attr("data-still", results[i].images.fixed_height_still.url);
            newImg.attr("data-animate", results[i].images.fixed_height.url);

            //Img Starting state on Page
            var imgStartingState = newImg.attr("data-still");
            newImg.attr("src", imgStartingState);

            //Add Misc / Other classes - gif is the selector class
            newImg.addClass("card-img-top gif");

            aHref.append(newImg);

            gifCard.append(aHref, textContainer);
            divWrapper.append(gifCard);
            $gifContainerTarget.prepend(divWrapper);

        }

    });

};


//Random Word Ajax Call (I pre-created this URL on the Wordnik API website) 

function randomWord(param) {

    //API Query Constructed at: http://developer.wordnik.com/docs.html#!/words/getRandomWord_get_4
    wordnikURL = 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=noun&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=4&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';

    //Ajax Call Function
    $.ajax({
        url: wordnikURL,
        method: "GET"
    }).then(function (response) {
        var newWord = response;
        console.log(newWord);
        param.text(newWord.word);

    });


}


//Jquery Global Targets:

var $gifContainerTarget = $("#gif-container-main");
var $resetButtonTarget = $("#reset-button");
var $searchInputTarget = $("input");
var $gifWebsiteTarget = $("#gif-website-selection");
var $quantitySelectorTarget = $("#quantity-input-selection");
var $ratingSelectorTarget = $("#rating-input");

$("#favorites-container").hide();
$("#search-results").hide();

$(document).ready(function () {


    //1. Retrieve all search values when search button is clicked (and clear out the old?)

    $("#search-button").on("click", function () {
        event.preventDefault();

        $("#search-results").show();
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
        console.log(queryTerm, website, quantity, rating);
        switch (website) {

            //Giphy is selected
            case "a":
                queryURL = "https://api.giphy.com/v1/gifs/search?q=" + queryTerm + '&api_key=dc6zaTOxFJmzC' + '&rating=' + rating + '&limit=' + quantity;

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



    $(".random-button").on("click", function () {
        //Grab word from clicked Random button
        event.preventDefault();
        var randomWord = $(this).text();
        console.log("RandomWord: ", randomWord);

        //Clear out the search bar and replace with selected random word
        $searchInputTarget.val(randomWord);


    });

    //Gif on Click Event- Should Start/Stop the Gif
    $("body").on("click", ".gif", function () {
        event.preventDefault();
        console.log($(this).parent());
        var state = $(this).attr("data-state");

        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }



    }).on("mouseenter", ".random-button", function () {
        var hoveredButton = $(this);
        randomWord(hoveredButton);

    }).on("mouseleave", ".random-button", function () {
        var hoveredButton = $(this);
        var buttonNumber = hoveredButton.attr("data-number");
        console.log(buttonNumber);
        hoveredButton.html('<i class="fa fa-question-circle"></i>');


    }).on("click", "#reset-button", function () {
        //Clear Gif Container, reset search form to default / cleared
        $gifContainerTarget.empty();
        $searchInputTarget.val("");
        $gifWebsiteTarget.val("a");
        $quantitySelectorTarget.val("10");
        $ratingSelectorTarget.val("pg");

        //DOWNLOAD BUTTON PRESSED IN CARD GIF
    }).on("click", ".download-gif", function () {

        //Add dashed outline and download selector to parent div class... Might need to just create a download url array here
        var selectedState = $(this).attr("selected-state");
        if (selectedState == 0) {
            $(this).removeClass("btn-primary").addClass("btn-danger").html('<i class="fa fa-minus"></i>');
            $(this).closest(".gif-wrapper").addClass("dashed-border");
            $(this).attr("selected-state", 1);

            var parentContainer = $(this).closest(".gif-wrapper");
            $("#favorites-content").append(parentContainer);

        } else {
            var parentContainer = $(this).closest(".gif-wrapper");
            parentContainer.fadeOut("fast");
            parentContainer.remove();

        }

        //Favorites Button Clicked- Go to Favorites Page
    }).on("click", "#favorites-page", function () {
        var toggle = $(this).attr("data-toggle");

        if (toggle == 0) {
            //Hide Search Content and Show Favorites
            $("#search-container").slideUp();
            $("#favorites-container").slideDown();

            //Hide Search Engine
            $("#search-wrapper").slideUp();

            //Change Button Contents
            $(this).text("Return to Search!")
            $(this).attr("data-toggle", "1");
        } else {

            $("#favorites-container").slideUp();
            $("#search-container").slideDown();
            $(this).html('<i class="fa fa-star" aria-hidden="true"></i> My Gifs');
            $("#search-wrapper").slideDown();
            $(this).attr("data-toggle", "0");

        }

    });



    // }).on("mouseleave", ".random-button", function () {
    //     var hoveredButton = $(this);
    //     var buttonNumber = hoveredButton.attr("data-number");
    //     console.log(buttonNumber);
    //     hoveredButton.text("Random " + hoveredButton.attr("data-number"));
    // });
    //DOWNLOAD ALL SELECTED GIFS.  
    // }).on("click",".button-download", function () {
    //     //Add HTML5 Download attribute to selected gifs, and wrap the gif images in an a tag, trigger a click event on those images... make sure the gif url is the image that is downloaded- may need to force swap the image link.  
    //     $("a.download-this-gif").attr("download",true);

    //     $("body").trigger("click",".download-this-gif");

    // })

});