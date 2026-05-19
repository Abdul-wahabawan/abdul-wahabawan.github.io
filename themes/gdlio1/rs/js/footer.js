window.onload = function () {
    // Insert Footer into the page
    let footerHTML = `
        <footer class="footer">
            <div class="container">
                <div class="footer-top">
                    <a href="https://geometry-dash-lite.io" class="logo-link">
                        <img src="https://geometry-dash-lite.io/cache/data/image/siteslist/logo.png" 
                            alt="Geometry Dash Lite Logo" class="footer-logo">
                    </a>
                </div>
                <div class="footer-links">
                    <a href="/about-us">About Us</a>
                    <a href="/copyright-infringement-notice-procedure">Copyright</a>
                    <a href="/contact-us">Contact Us</a>
                    <a href="/term-of-use">Terms of Use</a>
                    <a href="/privacy-policy">Privacy Policy</a>
                </div>
                <div class="social-icons">
                    <a href="#" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" title="Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="#" title="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="#" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                </div>
                <p class="footer-text">Â© 2025 Geometry Dash Lite. All Rights Reserved.</p>
            </div>
        </footer>
        <style>
            .footer {
                background: #181818;
                color: #fff;
                text-align: center;
                padding: 30px 0;
                font-family: Arial, sans-serif;
            }
            .footer-top {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 15px;
            }
            .logo-link {
                display: inline-block;
                transition: transform 0.3s ease, opacity 0.3s ease;
            }
            .footer-logo {
                height: auto;
            }
            .logo-link:hover {
                transform: scale(1.1);
                opacity: 0.8;
            }
            .footer-links {
                margin: 15px 0;
            }
            .footer-links a {
                color: #bbb;
                margin: 0 12px;
                text-decoration: none;
                font-size: 16px;
                transition: color 0.3s ease;
            }
            .footer-links a:hover {
                color: #f39c12;
            }
            .social-icons {
                margin: 15px 0;
            }
            .social-icons a {
                color: #bbb;
                margin: 0 8px;
                font-size: 20px;
                transition: color 0.3s ease;
            }
            .social-icons a:hover {
                color: #f39c12;
            }
            .footer-text {
                font-size: 14px;
                margin-top: 10px;
                color: #777;
            }
        </style>
    `;

    document.body.insertAdjacentHTML("beforeend", footerHTML);

    // Scroll-to-top button functionality
    $(window).scroll(function () {
        if ($(this).scrollTop()) {
            $('#back-to-top').fadeIn();
            $('.menu').css({ "background": "#2757a5" });
        } else {
            $('#back-to-top').fadeOut();
            $('.menu').css({ "background": "rgba(39,87,165,.4)" });
        }
    });

    $("#back-to-top").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 100);
    });

    $("#txt-search").on('click', function () {
        $(".overlay").show();
        $(".list-cate-ajax").hide();
        $("#chevron").css({ 'transform': "rotate(0)" });
        $(this).data('status', 'off');
    });

    $("#txt-search").on('input', function (e) {
        let url = "/query.ajax";
        let q = $(this).val();
        if (q.length == 0) {
            $("#list-suggest").html('');
            return;
        }
        $.ajax({
            type: "POST",
            url: url,
            data: { q: q },
            success: function (data) {
                let parser_data = JSON.parse(data);
                $("#list-suggest").html(parser_data);
            }
        });
    });

    $(".overlay").on('click', function () {
        $(this).hide();
        $("#list-suggest").html('');
    });

    $("#show-menu").on('click', function (e) {
        $(".mobile-menu").css({ left: 0 });
        $(".overlay-full").show();
        e.stopPropagation();
    });

    $(".close-mobile").on('click', function () {
        $(".mobile-menu").css({ left: "-300px" });
        $(".overlay-full").hide();
    });

    $(".overlay-full").on('click', function () {
        $(".mobile-menu").css({ left: "-300px" });
        $(this).hide();
    });

};

// Full-Screen Toggle
$("#expand").on('click', function () {
    $("#iframehtml5").addClass("force_full_screen");
    $("#_exit_full_screen").removeClass('hidden');
    $(".header-game").removeClass("header_game_enable_half_full_screen");
    $("#iframehtml5").removeClass("force_half_full_screen");
    requestFullScreen(document.body);
});

$("#_exit_full_screen").on('click', cancelFullScreen);

function requestFullScreen(element) {
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    if (requestMethod) {
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") {
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function cancelFullScreen() {
    $(".header-game").removeClass("force_full_screen header_game_enable_half_full_screen");
    $("#iframehtml5").removeClass("force_half_full_screen");
    var requestMethod = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.exitFullScreenBtn;
    if (requestMethod) {
        requestMethod.call(document);
    } else if (typeof window.ActiveXObject !== "undefined") {
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

if (document.addEventListener) {
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
}

function exitHandler() {
    if (document.webkitIsFullScreen === false
        || document.mozFullScreen === false
        || document.msFullscreenElement === false) {
        cancelFullScreen();
    }
}

