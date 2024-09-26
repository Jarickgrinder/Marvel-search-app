
$(document).ready(function(){
    $('.slider_news').slick({
        autoplay: true,
        autoplaySpeed: 4600,
        speed: 1600,

        dots: false,
        arrows: false,
        slidesToShow: 3, 
        infinite: true,
        swipe: false,
        fade: false
    });
});