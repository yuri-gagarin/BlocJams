
//create animatePoints function which will animate the
//selling points at the bottom of the page.

var animatePoints = function () {
    
    var revealPoint = function () {
        $(this).css({
            opacity: 1,
            transform: "scaleX(1) translateY(0)"
        });
    };
    
    $.each($(".point"), revealPoint);
};

 $(window).load(function (){    
     //animate selling-points if window height > 950
     if ($(window).height() > 950) {
         animatePoints();
     }
    
     //set how much to scroll down so user doesn't miss the animation
     var scrollDistance = $(".selling-points").offset().top - $(window).height() + 200;
     

     $(window).scroll(function(event) {
        //trigger animatePoints() if user scrolls down enough
        if ($(window).scrollTop() >= scrollDistance) {
            animatePoints();
            }
     });
 });
 
 
 