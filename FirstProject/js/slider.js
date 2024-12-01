$(document).ready(function(){
    // открываем окно по нажатию кнопки
    $('.popup-btn').on('click', function (event) {
        event.preventDefault();
        $('.popup').fadeIn();
    });
    // закрываем окно по нажатию х
    $('.popup-close').on('click', function (event) {    
        event.preventDefault();
        $('.popup').fadeOut();
    })

    // слайдер с отзывами
    $('.feedback-slider').slick({
            prevArrow: '<button type="button" class="feedback-slider-btn feedback-prev-btn"><img src="img/feedback/prevArrow.svg" alt="" /></button>',
            nextArrow: '<button type="button" class="feedback-slider-btn feedback-next-btn"><img src="img/feedback/nextArrow.svg" alt="" /></button>'
    });

    // работа слайдера c преимуществами
    $('.features-slider').slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
            breakpoint: 992,
            settings: {
                prevArrow: '<button class="prev arrow"></button>',
                nextArrow: '<button class="next arrow"></button>',
                slidesToShow: 2,
                slidesToScroll: 2,
            }
            },
            {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                prevArrow: '<button class="prev arrow"></button>',
                nextArrow: '<button class="next arrow"></button>',
            }
            }
        ]
    });
});