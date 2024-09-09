$(document).ready(function () {
    $('.navbar .right-section .dropdown').click(function () {
        $('.navbar .right-section .dropdown-menu').attr('data-bs-popper', '');
        $('.navbar .right-section .dropdown-menu').attr('aria-expanded', '');
    });

    $('.navbar .right-section .dropdown').hover(function () {
        $('.navbar .right-section .dropdown-menu').fadeIn();
    });

    $('.navbar .right-section .dropdown').mouseleave(function () {
        $('.navbar .right-section .dropdown-menu').fadeOut(150);
    });

    $('.add-to-cart .container-number .minus').click(function () {
        addProductToCart('minus');
    });

    $('.add-to-cart .container-number .plus').click(function () {
        addProductToCart('plus');
    });

    $('.add-to-cart-btn').click(function () {
        addProductToCart('plus');
    });

    $('#suggestions .control-suggestion-slider .next').click(function () {
        disabledScrollButton('#suggestions', 'next');
    });

    $('#suggestions .control-suggestion-slider .prev').click(function () {
        disabledScrollButton('#suggestions', 'prev');
    });

    $('#best-selling .control-suggestion-slider .next').click(function () {
        disabledScrollButton('#best-selling', 'next');
    });

    $('#best-selling .control-suggestion-slider .prev').click(function () {
        disabledScrollButton('#best-selling', 'prev');
    });

    $('.cart-page .container-cart .levels .prev').click(function () {
        checkWhereLevelCart('prev');
    });

    $('.cart-page .container-cart .cart-list .next-level').click(function () {
        checkWhereLevelCart('next');
    });

    pageSize();
    $(window).resize(function () {
        pageSize();
    });
    $('.cart-page .container-cart .time').css('display', 'none');
    $('.cart-page .container-cart .payment').css('display', 'none');

    $('.cart-page .modal .modal-body .add-addres').click(function () {
        $('.cart-page .container-cart .time .addres form').css('display', 'block');
        $('.cart-page .container-cart .time .last-addres ul').css('display', 'none');
    })
});

let whereLevel = 0;
function checkWhereLevelCart(action) {
    if (action == 'prev') {
        if (whereLevel == 1) {
            $('.cart-page .container-cart .time').animate({ right: '-120%' }, 600, function () {
                $('.cart-page .container-cart .cart').css('display', 'block');
                $('.cart-page .container-cart .time').css('display', 'none');
                $('.cart-page .container-cart .cart').animate({ right: '0%' }, 600, function () {
                    $('.cart-page .container-cart .levels .in-select-addres ,.cart-page .container-cart .levels .first-hr,.cart-page .container-cart .levels .in-payment ,.cart-page .container-cart .levels .second-hr').removeClass('active');
                    $('.cart-page .container-cart .levels .in-select-addres,.cart-page .container-cart .levels .prev').addClass('disabled');
                    $('.cart-page .container-cart .cart-list .next-level span').text('انتخاب زمان و نحوه ارسال');
                    whereLevel = 0;
                });
            });
        }
        if (whereLevel == 2) {
            $('.cart-page .container-cart .payment').animate({ right: '-120%' }, 600, function () {
                $('.cart-page .container-cart .time').css('display', 'block');
                $('.cart-page .container-cart .payment').css('display', 'none');
                $('.cart-page .container-cart .time').animate({ right: '0%' }, 600, function () {
                    $('.cart-page .container-cart .levels .in-payment ,.cart-page .container-cart .levels .second-hr').removeClass('active');
                    $('.cart-page .container-cart .cart-list .next-level span').text('انتخاب شیوه پرداخت');
                    whereLevel = 1;
                });
            });
        }
    }
    if (action == 'next') {
        if (whereLevel == 0) {
            $('.cart-page .container-cart .cart').animate({ right: '-120%', display: 'none' }, 600, function () {
                $('.cart-page .container-cart .cart').css('display', 'none');
                $('.cart-page .container-cart .time').css('display', 'block');
                $('.cart-page .container-cart .time').animate({ right: '0%' }, 600);
                $('.cart-page .container-cart .levels .in-select-addres ,.cart-page .container-cart .levels .first-hr').addClass('active');
                $('.cart-page .container-cart .levels .in-select-addres,.cart-page .container-cart .levels .prev').removeClass('disabled');
                $('.cart-page .container-cart .cart-list .next-level span').text('انتخاب شیوه پرداخت');
                whereLevel = 1;
            });
            return;
        } if (whereLevel == 1) {
            $('.cart-page .container-cart .time').animate({ right: '-120%', display: 'none' }, 600, function () {
                $('.cart-page .container-cart .time').css('display', 'none');
                $('.cart-page .container-cart .payment').css('display', 'block');
                $('.cart-page .container-cart .payment').animate({ right: '0%' }, 600);
                $('.cart-page .container-cart .levels .in-payment ,.cart-page .container-cart .levels .second-hr').addClass('active');
                whereLevel = 2;
                console.log(whereLevel);
                $('.cart-page .container-cart .cart-list .next-level span').text('ثبت نهایی سفارش');
            });
            return;
        } if (whereLevel == 2) {
            // whereLevel = 3;
            console.log(whereLevel);
            return;
        }
    }
}

function pageSize() {
    pageHeight = $(window).height();
    $('.product-page .filter').css('height', pageHeight - 85);
}

let numberOfProduct = 0;
let maxNumberOfProduct = 10;
let productPrice = '125.00';

function addProductToCart(action) {
    if (numberOfProduct < maxNumberOfProduct && action == 'plus') {
        numberOfProduct++;
    }
    if (numberOfProduct > 0 && action == 'minus') {
        numberOfProduct--;
    }

    $('.container-number .number-of-product,.navbar .left-section .badge').text(numberOfProduct);

    if (numberOfProduct == 0) {
        $('.navbar .cart-icon .cart-list .empty-text').removeClass('d-none');
        $('.navbar .cart-icon .cart-list .empty-text').addClass('d-block');
        $('.navbar .cart-icon .cart-list .product-contaienr').removeClass('d-block');
        $('.navbar .cart-icon .cart-list .product-contaienr').addClass('d-none');
        $('.navbar .left-section .badge').removeClass('d-inline-block');
        $('.navbar .left-section .badge').addClass('d-none');
    } else {
        $('.navbar .cart-icon .cart-list .empty-text').removeClass('d-block');
        $('.navbar .cart-icon .cart-list .empty-text').addClass('d-none');
        $('.navbar .cart-icon .cart-list .product-contaienr').removeClass('d-none');
        $('.navbar .cart-icon .cart-list .product-contaienr').addClass('d-block');
        $('.navbar .left-section .badge').removeClass('d-none');
    }
}

// function count(first, second) {
//     let originalPrice = first;
//     let newPrice = second;
//     let result = (originalPrice - newPrice) / originalPrice * 100;
//     $('.product-slider .product-item .badge').text(result + '%');
// }


let maxScrollProduct = ($('.product-slider .slider').children().length / 2 - $('.product-slider .slider').width() / 245) * $('.product-slider .product-item').width();
function disabledScrollButton(category, direction) {
    if (direction == 'next') {
        $('' + category + ' .slider').animate({ scrollLeft: '-=' + $('' + category + ' .product-item').width() + 'px' }, 400, function () {
            if ($('' + category + ' .slider').scrollLeft() <= '-' + maxScrollProduct) {
                $('' + category + ' .control-suggestion-slider .next').addClass('disabled');
            }
        });
        $('' + category + ' .control-suggestion-slider .prev').removeClass('disabled');
    } else if (direction == 'prev') {

        $('' + category + ' .slider').animate({ scrollLeft: '+=' + $('' + category + ' .product-item').width() + 'px' }, 400, function () {
            if ($('' + category + ' .slider').scrollLeft() >= '0') {
                $('' + category + ' .control-suggestion-slider .prev').addClass('disabled');
            }
        });
        $('' + category + ' .control-suggestion-slider .next').removeClass('disabled');
    }
}

function searchToggle(obj, evt) {
    var container = $(obj).closest('.search-wrapper');
    if (!container.hasClass('active')) {
        container.addClass('active');
        evt.preventDefault();
    }
    else if (container.hasClass('active') && $(obj).closest('.input-holder').length == 0) {
        container.removeClass('active');
        // clear input
        container.find('.search-input').val('');
    }
}

function clickBottomProduct(id) {
    $('.product-page .product-item .bottom-product-' + id + ' .container-number-of-product').css('display', 'flex');
    $('.product-page .product-item .bottom-product-' + id + ' .container-cart').css('display', 'none');
    $('.product-page .product-item .bottom-product-' + id + ' .container-number-of-product').animate({ width: "40%" });
}

function blurBottomProduct(id) {
    $('.product-page .product-item .bottom-product-' + id + ' .container-number-of-product').animate({ width: "0%" }, function () {
        $('.product-page .product-item .bottom-product-' + id + ' .container-number-of-product').css('display', 'none');
        $('.product-page .product-item .bottom-product-' + id + ' .container-cart').css('display', 'block');
    });
}