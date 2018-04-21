//Bugs/Todo list (in no particular order)
//=================================
/**
 * 1. Get jquery targets a bit more organized- grab overused selectors and simplify them
 * 2. Create a collapsing search bar - need to do more bootstrap research, but could possbly just add jquery to hide the container/create a search icon at a specific page size
 * 3. Firebase - keep track of past searches and display as "trending" 
 * 4. Fancy Fonts
 */


//Initial Setup
//=================================

//Retrieve Stored Favorites Divs from localStorage
if ('favoritesContents' in localStorage) {
    $("#favorites-content").html(localStorage.getItem('favoritesContents'));
};

//Hide Favorites and search results at page start
$("#favorites-container").hide();
$("#search-results").hide();

//JQuery targets - 
//=================================

//Jquery Global Targets:
var $gifContainerTarget = $("#gif-container-main");
var $resetButtonTarget = $("#reset-button");
var $searchInputTarget = $("input");
var $gifWebsiteTarget = $("#gif-website-selection");
var $quantitySelectorTarget = $("#quantity-input-selection");
var $ratingSelectorTarget = $("#rating-input");

//Misc. Functions
//=================================

//Helper function to create a unique background color behind every search
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//Random Word Function / Ajax Call (I pre-created this URL on the Wordnik API website) 
//Grabs a Random word to be used in the 'random word' button
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

//MAIN FUNCTION - Creates Gif Card Output
//=================================

function runQuery(urlInput) {

    //Ajax Call Function
    $.ajax({
        url: urlInput,
        method: "GET"
    }).then(function (gifsRecieved) {

        //Store Result Array as Variable
        var results = gifsRecieved.data;

        //Get a random color to assign to as a unique background color for this specific search
        var randomColor = getRandomColor();

        //Create our html/bootstrap card 
        for (var i = 0; i < results.length; i++) {

            //Create Container and Elements- divWrapper establishes responsiveness and margins
            var divWrapper = $("<div>");
            divWrapper.addClass("col-lg-3 col-md-4 col-sm-12 pb-2 pt-2 gif-wrapper");
            divWrapper.css("background", randomColor);

            //Card to be place inside the div container
            var gifCard = $("<div>").addClass("card rounded-0");

            //Captions and Text (Add Clickable 'DOWNLOAD' Class Button here)
            var textContainer = $("<div>");
            textContainer.addClass("col-12 container");

            //Grab Rating from Ajax Array
            var spanInfo = $("<p>");
            spanInfo.text("rating: " + results[i].rating)
            spanInfo.addClass("card-text text-center font-weight-bold pt-1");

            //Create a download button - this ended up becoming a 'Favorites' button
            var buttonDownload = $("<button>");
            buttonDownload.html('<i class="fa fa-plus"></i>')
            buttonDownload.addClass("card-text text-center btn-block mb-2 btn btn-primary download-gif");
            buttonDownload.attr("selected-state", 0);

            //Add text and button to larger text container
            textContainer.append(spanInfo, buttonDownload);

            //Image Download Code - Ended up not really being used
            var getGifUrl = $(this).attr("data-animate");
            var aHref = $("<a>");
            aHref.attr("href", results[i].images.fixed_height.url);
            aHref.addClass("inactive-link");

            //Create Image For the Card Content
            var newImg = $("<img>");

            //Add Url's for Still and Animate Custom Attr's
            newImg.attr("data-still", results[i].images.fixed_height_still.url);
            newImg.attr("data-animate", results[i].images.fixed_height.url);

            //Esstablish Default Img Starting state on Page
            var imgStartingState = newImg.attr("data-still");
            newImg.attr("src", imgStartingState);

            //Add Misc / Other classes - gif is the selector class
            newImg.addClass("card-img-top gif");

            //Wrapping things up/Appending contents to Containers
            aHref.append(newImg);

            gifCard.append(aHref, textContainer);
            divWrapper.append(gifCard);

            //Appending unique card that has been created to the main content container on the page
            $gifContainerTarget.prepend(divWrapper);

        }
    });
};

function sidebarShrink() {
    var toggleValue = $().attr("data-toggle");
    $("#search-sidebar").slideUp();
    $(".sidebar-sticky").attr("height", "50");

    $("#collapsed-search-button").attr("data-toggle", 1);

}

function sidebarGrow() {
    var toggleValue = $("#collapsed-search-button").attr("data-toggle");
    $(".sidebar-sticky").attr("height", "calc(100vh - 48px)");
    $("#search-sidebar").slideDown();

    $("#collapsed-search-button").attr("data-toggle", 0);


}

//JQuery Events 
//=================================

//Jquery events that happen after document is ready: 
$(document).ready(function () {

    if ($(window).width() < 600) {
        sidebarShrink();
    }
    else {
        sidebarGrow();
    }

    $(window).resize(function () {
        if ($(window).width() < 600) {
            sidebarShrink();
        }
        else {
            sidebarGrow();
        }
    });




    //Retrieve all form values when search button is clicked and populate the content container
    $("#search-button").on("click", function () {
        event.preventDefault();

        console.log("click");
        //Showing the container on click might be deprecated at this point
        $("#search-results").show();


        /////////////////////////////////
        //Retrieve All Search Input Values from Form
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

        //I used a switch case because I would like to add other search engines in the future- they will have different requirements for assembling the query URL.
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

        //Run main Content Function
        runQuery(queryURL);

    });

    //Populate the search input with the contents of the random button 
    $(".random-button").on("click", function () {
        event.preventDefault();

        //Grab word from clicked Random button
        var randomWord = $(this).text();

        //Clear out the search bar and replace with selected random word
        $searchInputTarget.val(randomWord);
    });

    //Chained Dynamic JQuery Events (Used for dynamically created elements)
    //===========================================================================

    //Gif on-Click Event- Starts and Stops the Gif
    $("body").on("click", ".gif", function () {
        event.preventDefault();

        //Find out if gif is currently animated or stopped
        var state = $(this).attr("data-state");

        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }

        //Swaps in a new random word inside the button when mouse enters the button 

    }).on("mouseenter", ".random-button", function () {
        var hoveredButton = $(this);
        randomWord(hoveredButton);

        //Turns random button back into a question mark when  mouse leaves the Random button

    }).on("mouseleave", ".random-button", function () {
        var hoveredButton = $(this);
        var buttonNumber = hoveredButton.attr("data-number");
        hoveredButton.html('<i class="fa fa-question-circle"></i>');

        //Reset button turns all form content back to default and clears main search content. 
        //Does NOT clear Favorites content.
    }).on("click", "#reset-button", function () {
        //Clear Gif Container, reset search form to default / cleared
        $gifContainerTarget.empty();
        $searchInputTarget.val("");
        $gifWebsiteTarget.val("a");
        $quantitySelectorTarget.val("10");
        $ratingSelectorTarget.val("pg");

        //Favorites BUTTON PRESSED IN CARD GIF - Adds Card to Favorites and updates the LocalStorage Div to reflect current gif favorites
        //Spent quite a bit of time trying to get gifs to download- there is very likely some deprecated code in here.
    }).on("click", ".download-gif", function () {

        //Add dashed outline and download selector to parent div class... Might need to just create a download url array here
        var selectedState = $(this).attr("selected-state");
        if (selectedState == 0) {
            $(this).removeClass("btn-primary").addClass("btn-danger").html('<i class="fa fa-minus"></i>');
            $(this).closest(".gif-wrapper").addClass("dashed-border");
            $(this).attr("selected-state", 1);

            var parentContainer = $(this).closest(".gif-wrapper");
            $("#favorites-content").append(parentContainer);

            var favoritesContents = $("#favorites-content").html();
            localStorage.setItem('favoritesContents', favoritesContents);


        } else {
            //Cleans out and removes the parent gif content container
            var parentContainer = $(this).closest(".gif-wrapper");
            parentContainer.fadeOut("fast");
            parentContainer.remove();

            //Update Local Storage
            var favoritesContents = $("#favorites-content").html();
            localStorage.setItem('favoritesContents', favoritesContents);
        }


        //Favorites Button Clicked- Go to Favorites Page and hide search content- do the opposite if the button is clicked again
    }).on("click", "#favorites-page", function () {

        //Tracks status of the Favorites Page button
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

            //Swap back to Search Results page- sort of vice-versaing the previous "if" statement. 
            $("#favorites-container").slideUp();
            $("#search-container").slideDown();
            $(this).html('<i class="fa fa-star" aria-hidden="true"></i> My Gifs');
            $("#search-wrapper").slideDown();
            $(this).attr("data-toggle", "0");
        }
    }).on("click", "#collapsed-search-button", function () {
        var toggleValue = $(this).attr("data-toggle");
        if (toggleValue == 0) {
            sidebarShrink();

        } else {
            sidebarGrow();
        }

    });
});

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