//===================================== ~fullscreen.php <script> ===========================================
$("#expand").on('click', function () {
    $("#iframehtml5").addClass("force_full_screen"); // css
    $("#_exit_full_screen").removeClass('hidden'); // display: hidden;

    //function: requestFullScreen(document.body);
    // $(".header").removeClass("fixed");

    requestFullScreen(document.body);
});

$("#_exit_full_screen").on('click', cancelFullScreen);

function requestFullScreen(element) {
    //theater mode
    $(".header-game").removeClass("header_game_enable_half_full_screen");
    $("#iframehtml5").removeClass("force_half_full_screen");

    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    if (requestMethod) { // Native full screen. 
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function cancelFullScreen() {
    //add fixed header
    // $(".header").addClass('fixed');
    // .fixed {
    //     position: fixed;
    //     top: 0;
    //     left: 0;
    //     z-index: 4;
    // }

    $("#_exit_full_screen").addClass('hidden');
    $("#iframehtml5").removeClass("force_full_screen");

    //theater mode
    $(".header-game").removeClass("force_full_screen header_game_enable_half_full_screen");
    $("#iframehtml5").removeClass("force_half_full_screen");

    var requestMethod = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.exitFullScreenBtn;
    if (requestMethod) { // cancel full screen.
        requestMethod.call(document);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

// check exit
if (document.addEventListener) {
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
}
function exitHandler() {
    if (document.webkitIsFullScreen === false ||
        document.mozFullScreen === false ||
        document.msFullscreenElement === false) {
        cancelFullScreen();
    }
}

//============================== theater Mode  =========================================
function theaterMode() {
    //function: requestFullScreen(document.body);
    // if($(".header").hasClass("fixed")) {
    //     $(".header").removeClass("fixed");
    // } else {
    //     $(".header").addClass("fixed");
    // }

    //  CSS: body::-webkit-scrollbar {display: none;} set  class 'scroll'
    // if($("body").hasClass("scroll")) {
    //     $("body").removeClass("scroll");
    // } else {
    //     $("body").addClass("scroll");
    // }

    // if($("#back-to-top").hasClass("hidden-scroll")) {
    //     $("#back-to-top").removeClass("hidden-scroll");
    // } 
    // else {
    //     $("#back-to-top").addClass("hidden-scroll");
    // }

    let iframe = document.querySelector("#iframehtml5");
    if (iframe.classList.contains("force_half_full_screen")) {

        iframe.classList.remove("force_half_full_screen")
        document.querySelector(".header-game").classList.remove("header_game_enable_half_full_screen")
        return;
    }
    let above = 0;
    let left = 0;
    let below = $(".header-game").outerHeight();
    let right = 0;
    // let width = window.innerWidth;
    // let height = window.innerHeight;
    if (!document.querySelector("#style-append")) {
        let styleElement = document.createElement("style");
        styleElement.type = "text/css";
        styleElement.setAttribute('id', "style-append");
        let cssCode = `
    .force_half_full_screen{
    position: fixed!important;
    top: 0!important;
    left: 0!important;
    z-index: 887!important;
    top:${above}px!important;
    left:${left}px!important;
    width:calc(100% - ${left}px)!important;
    height:calc(100% - ${above + below}px)!important;
    background-color:#000;
    }
    .header_game_enable_half_full_screen{
        position:fixed;
        left:${left}px!important;
        bottom:0!important;
        right:0!important;
        z-index:887!important;
        width:calc(100% - ${left}px)!important;
        padding-left:10px;
        padding-right:10px;
        border-radius:0!important;
    }
    @media (max-width: 1364px){
        .force_half_full_screen{
            left:0!important;
            width:100%!important;
        }
        .header_game_enable_half_full_screen{
            width:100%!important;
            left:0!important;
        }
    }`
        styleElement.innerHTML = cssCode;
        document.querySelector('head').appendChild(styleElement);
    }
    iframe.classList.add("force_half_full_screen")
    document.querySelector(".header-game").classList.add("header_game_enable_half_full_screen")
}


/*============================== dark mode ==============================*/
//click light-off => save light-off vs (localStorage);
$(".light-on").on('click', function () {
    $("body").addClass("lightmode");
    $(this).hide();
    $(".light-off").attr('style', "display:flex!important");
    setLocalStorage("theme_mode", "lightmode");
})

$(".light-off").on('click', function () {
    $("body").removeClass("lightmode")
    $(this).attr('style', "display:none!important");
    $(".light-on").show();
    setLocalStorage("theme_mode", "darkmode");
})

/*============================== Header ==============================*/
if (document.querySelector('.header')) {
    $('.header__btn').on('click', function () {
        // $('.header').toggleClass("fixed");
        $('.nav-right').slideToggle("fast");
    })
}

// ============================ search ================================= 

$('#game-search').on('input', function (e) {
    let keywords = $(this).val();
    var rex_rule = /[ \-\.?:\\\/\_\'\*]+/g;
    var value1 = keywords.replace(rex_rule, " ").trim().toLowerCase();
    value1 = value1.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    //t.h1: 
    if (value1) {
        $('.search-more').removeClass('hidden-search', { duration: 1000 });
        $('.search-more').addClass('border-top2');
        $('.search-term').addClass('border-bottom');
        // searchGame(value1);

        let arr_games = [];
        searchGameNew(value1, arr_games)
    } else {
        // console.log("else");
        $('.search-more').addClass('hidden-search', { duration: 1000 });
        $('.search-term').removeClass('border-bottom', { duration: 1000 });
    }
    e.stopPropagation();
});

//th3 
$('#game-search').on('keydown', function (event) {
    var key = event.keyCode || event.charCode;
    // console.log(key)
    if (key == 8 || key == 46) {
        $('.search-more').addClass('hidden-search', { duration: 1000 });
        $('.search-term').removeClass('border-bottom', { duration: 1000 });
    }
})

// th4
$(document).click(function () {
    $('.search-more').addClass('hidden-search', { duration: 1000 });
    $('.search-term').removeClass('border-bottom', { duration: 1000 });
});

// th5:
$("#game-search").click(function (e) {
    let keywords = $(this).val();
    if (keywords) {
        $('.search-more').removeClass('hidden-search', { duration: 1000 });
        $('.search-more').addClass('border-top2');
        $('.search-term').addClass('border-bottom');
    }
    e.stopPropagation();
});

// th6: 
$("#search-ajax").click(function (e) {
    e.stopPropagation();
});
$(".btn-search").click(function (e) {
    e.stopPropagation();
});


function searchGameNew(value, arr_games) {
    var allTagA = $(".search-more").children();
    for (var i = 0; i < allTagA.length; i++) {
        allTagA[i].remove();
    }

    for (let i = 0; i < search_data.length; i++) {
        let name = search_data[i].name;
        let aTag = search_data[i].aTag;
        if (name.includes(value)) {
            arr_games.push(aTag);
        }
    }

    if (arr_games.length <= 0) {
        $('.search-more').append('<div class="search-end">Not found!</div>');
    } else {
        for (let a of arr_games) {
            $('.search-more').append(a);
        }
    }
}

// ***
let search_data = [];
document.addEventListener("DOMContentLoaded", function (event) {

    function hashCode(input) {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            hash = ((hash << 5) - hash) + input.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    function getLabelByContext(card, index) {
        if (card.dataset.label) {
            return card.dataset.label.toLowerCase();
        }

        const section = card.closest('section');
        const sectionText = section ? section.textContent.toLowerCase() : '';

        if (sectionText.includes('new games')) return 'new';
        return index % 4 === 0 ? 'new' : 'hot';
    }

    function ensureGameMeta() {
        const cards = document.querySelectorAll('.card-masonry .item, .player-reco-row .item');
        cards.forEach((card, index) => {
            if (!card.querySelector('.game-badge')) {
                const label = getLabelByContext(card, index);
                const badge = document.createElement('span');
                badge.className = `game-badge game-badge--${label === 'new' ? 'new' : 'hot'}`;
                badge.textContent = label === 'new' ? 'new' : 'hot';
                card.appendChild(badge);
            }

            if (!card.querySelector('.game-rating')) {
                const title = (card.getAttribute('title') || card.textContent || '').trim().toLowerCase();
                const custom = parseFloat(card.dataset.rating);
                const hashed = 40 + (hashCode(title || String(index)) % 11);
                const rating = Number.isFinite(custom) ? custom : (hashed / 10);
                const baseRatedUsers = 3200 + (hashCode(`${title}-users`) % 3801); // 3,200 .. 7,000

                const ratingEl = document.createElement('span');
                ratingEl.className = 'game-rating';
                ratingEl.innerHTML = `<span class="game-rating__star">★</span><span class="game-rating__value">${rating.toFixed(1)}</span><span class="game-rating__count">(${baseRatedUsers.toLocaleString('en-US')}+)</span>`;
                card.appendChild(ratingEl);
            }
        });
    }

    function initGameContentShowMore() {
        const wrappers = document.querySelectorAll('.game__content2');

        wrappers.forEach((wrapper) => {
            const content = wrapper.querySelector('.game__content');
            if (!content || wrapper.dataset.showMoreReady === '1') {
                return;
            }

            wrapper.dataset.showMoreReady = '1';

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'game__content2-show-more';
            button.setAttribute('aria-expanded', 'false');
            button.innerHTML = 'Show more <span class="game__content2-show-more__icon">&#9662;</span>';

            const holder = document.createElement('div');
            holder.className = 'game__content2-show-more-wrap';
            holder.appendChild(button);
            wrapper.appendChild(holder);

            let collapsedHeight = 0;
            let isExpanded = false;

            const updateButton = () => {
                if (isExpanded) {
                    button.innerHTML = 'Show less <span class="game__content2-show-more__icon">&#9652;</span>';
                    button.setAttribute('aria-expanded', 'true');
                } else {
                    button.innerHTML = 'Show more <span class="game__content2-show-more__icon">&#9662;</span>';
                    button.setAttribute('aria-expanded', 'false');
                }
            };

            const applyCollapsedState = () => {
                const fullHeight = content.scrollHeight;
                collapsedHeight = Math.floor(fullHeight * 0.25);

                if (fullHeight <= 0 || collapsedHeight < 200 || fullHeight - collapsedHeight < 120) {
                    wrapper.classList.remove('game__content2--collapsed');
                    content.style.maxHeight = '';
                    holder.style.display = 'none';
                    return;
                }

                holder.style.display = '';
                if (isExpanded) {
                    wrapper.classList.remove('game__content2--collapsed');
                    content.style.maxHeight = fullHeight + 'px';
                } else {
                    wrapper.classList.add('game__content2--collapsed');
                    content.style.maxHeight = collapsedHeight + 'px';
                }
                updateButton();
            };

            applyCollapsedState();
            window.addEventListener('load', applyCollapsedState, { once: true });
            window.addEventListener('resize', applyCollapsedState);

            button.addEventListener('click', function () {
                isExpanded = !isExpanded;
                if (isExpanded) {
                    wrapper.classList.remove('game__content2--collapsed');
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    wrapper.classList.add('game__content2--collapsed');
                    content.style.maxHeight = collapsedHeight + 'px';
                }
                updateButton();
            });
        });
    }

    function initSidebarToggle() {
        const sidebar = document.querySelector('.site-sidebar');
        const toggle = document.getElementById('site-sidebar-toggle');
        if (!sidebar || !toggle) {
            return;
        }

        toggle.addEventListener('click', function () {
            const isExpanded = sidebar.classList.toggle('site-sidebar--expanded');
            toggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        });
    }

    function initVoteCountsByKeywordVolume() {
        const upCountEl = document.getElementById('up-count');
        const downCountEl = document.getElementById('down-count');
        if (!upCountEl || !downCountEl) {
            return;
        }

        const h1 = document.querySelector('h1');
        const pageTitle = (document.title || '').toLowerCase();
        const heading = (h1 ? h1.textContent : '').toLowerCase();
        const slug = (window.location.pathname || '').toLowerCase();
        const text = `${pageTitle} ${heading} ${slug}`;

        const keywordWeights = {
            run: 22,
            runner: 18,
            dash: 28,
            race: 24,
            racing: 20,
            car: 16,
            bike: 13,
            subway: 26,
            slope: 30,
            tunnel: 25,
            geometry: 35,
            jump: 14,
            rush: 17,
            io: 10,
            "3d": 8,
            color: 11,
            stickman: 12,
            fall: 15,
            speed: 14,
            retro: 9
        };

        let volumeScore = 40;
        Object.keys(keywordWeights).forEach((keyword) => {
            if (text.includes(keyword)) {
                volumeScore += keywordWeights[keyword];
            }
        });

        if (slug.includes('/games/')) volumeScore += 12; // category pages are usually broader traffic
        if (slug.includes('/new-games')) volumeScore += 14;
        if (slug.includes('/hot-games')) volumeScore += 18;

        // Keep score in a realistic range.
        volumeScore = Math.max(35, Math.min(170, volumeScore));

        // Deterministic per-page variance so counts differ page by page.
        const hash = hashCode(text || 'game');
        const variance = (hash % 12000) - 6000;

        // Higher keyword volume => higher up-vote count.
        let upVotes = Math.round(volumeScore * 5200 + variance);
        upVotes = Math.max(12000, Math.min(990000, upVotes));

        // Down-votes stay lower but not too tiny and not too huge.
        const downRatio = 0.09 + ((hash % 9) / 100); // 9%..17%
        let downVotes = Math.round(upVotes * downRatio);
        downVotes = Math.max(2200, Math.min(Math.round(upVotes * 0.28), downVotes));

        function compactNumber(value) {
            if (value >= 1000000) {
                const m = (value / 1000000).toFixed(1).replace(/\.0$/, '');
                return `${m}m`;
            }
            if (value >= 1000) {
                const k = (value / 1000).toFixed(1).replace(/\.0$/, '');
                return `${k}k`;
            }
            return String(value);
        }

        upCountEl.textContent = compactNumber(upVotes);
        downCountEl.textContent = compactNumber(downVotes);
    }

    function initTopStarRating() {
        const heading = (document.querySelector('h1')?.textContent || '').trim().toLowerCase();
        const title = (document.title || '').trim().toLowerCase();
        const slug = (window.location.pathname || '').toLowerCase();
        const seed = `${title} ${heading} ${slug}`;
        const h = hashCode(seed || 'game');

        const storageKey = `page_rating_${h}`;
        const baseAverage = Math.max(3, Math.min(5, Number((3 + ((h % 21) / 10)).toFixed(1))));
        const baseCount = 1200 + (h % 8601); // 1,200 .. 9,800
        let store = { total: Number((baseAverage * baseCount).toFixed(1)), count: baseCount, userRating: 0 };

        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && Number.isFinite(parsed.total) && Number.isFinite(parsed.count)) {
                    store = {
                        total: parsed.total,
                        count: Math.max(1, parsed.count),
                        userRating: Number(parsed.userRating) || 0
                    };
                }
            }
        } catch (e) {
            // Ignore storage issues and keep defaults.
        }

        let ratingEl = document.querySelector('.game-top-rating');
        if (!ratingEl) {
            ratingEl = document.createElement('div');
            ratingEl.className = 'game-top-rating';
        }

        // Preferred placement: inside the main game content box so users see it immediately.
        const wrapper = document.querySelector('.game__content2');
        const gameContent = wrapper ? wrapper.querySelector('.game__content') : null;
        if (wrapper && gameContent) {
            // Always keep rating block in the content box position.
            if (gameContent.previousElementSibling !== ratingEl) {
                gameContent.insertAdjacentElement('beforebegin', ratingEl);
            }
        } else if (wrapper && !ratingEl.parentElement) {
            wrapper.insertAdjacentElement('afterbegin', ratingEl);
        }

        // Fallback: keep compatibility with old breadcrumb layout pages.
        const breadcrumbs = wrapper ? wrapper.querySelector('.breadcrumbs') : null;
        if (wrapper && breadcrumbs && !ratingEl.parentElement) {
            const meta = wrapper.querySelector('.game-top-meta') || document.createElement('div');
            if (!meta.classList.contains('game-top-meta')) {
                meta.className = 'game-top-meta';
            }
            if (!meta.parentElement) {
                breadcrumbs.parentNode.insertBefore(meta, breadcrumbs);
            }
            if (!meta.contains(breadcrumbs)) {
                meta.appendChild(breadcrumbs);
            }
            meta.appendChild(ratingEl);
        } else if (!ratingEl.parentElement) {
            // Fallback for category/list pages without breadcrumbs: place near first H1 title.
            const pageTitle = document.querySelector('h1');
            if (pageTitle) {
                ratingEl.classList.add('game-top-rating--headline');
                pageTitle.insertAdjacentElement('afterend', ratingEl);
            }
        }

        ratingEl.innerHTML = `
            <div class="game-top-rating__stars"></div>
            <div class="game-top-rating__meta">
                <span class="game-top-rating__value"></span>
                <span class="game-top-rating__dot">•</span>
                <span class="game-top-rating__count"></span>
            </div>
        `;

        const starsWrap = ratingEl.querySelector('.game-top-rating__stars');
        const valueEl = ratingEl.querySelector('.game-top-rating__value');
        const countEl = ratingEl.querySelector('.game-top-rating__count');
        if (!starsWrap || !valueEl || !countEl) return;

        function saveStore() {
            try {
                localStorage.setItem(storageKey, JSON.stringify(store));
            } catch (e) {
                // Ignore storage issues silently.
            }
        }

        function getAverage() {
            return Math.max(3, Math.min(5, Number((store.total / store.count).toFixed(1))));
        }

        function renderStars(displayRating) {
            starsWrap.innerHTML = '';
            for (let i = 1; i <= 5; i++) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'game-top-rating__star-btn';
                btn.textContent = '★';
                btn.setAttribute('aria-label', `Rate ${i} star${i > 1 ? 's' : ''}`);
                btn.dataset.value = String(i);
                if (displayRating >= i) {
                    btn.classList.add('is-full');
                } else if (displayRating >= i - 0.5) {
                    btn.classList.add('is-half');
                } else {
                    btn.classList.add('is-empty');
                }
                starsWrap.appendChild(btn);
            }
        }

        function renderMeta(previewRating) {
            const avg = getAverage();
            const visibleRating = Number.isFinite(previewRating) ? previewRating : avg;
            renderStars(visibleRating);
            valueEl.textContent = visibleRating.toFixed(1);
            countEl.textContent = `${store.count.toLocaleString('en-US')}+ users rated`;
            ratingEl.setAttribute('aria-label', `Rating ${avg.toFixed(1)} out of 5 from ${store.count.toLocaleString('en-US')} users`);
        }

        starsWrap.addEventListener('mouseover', function (event) {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            const starValue = Number(target.dataset.value || 0);
            if (!Number.isFinite(starValue) || starValue < 1 || starValue > 5) return;
            renderMeta(starValue);
        });

        starsWrap.addEventListener('mouseleave', function () {
            renderMeta();
        });

        starsWrap.addEventListener('click', function (event) {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            const starValue = Number(target.dataset.value || 0);
            if (!Number.isFinite(starValue) || starValue < 1 || starValue > 5) return;

            // Professional behavior: one rating per user per page, editable.
            if (store.userRating > 0) {
                store.total += (starValue - store.userRating);
            } else {
                store.total += starValue;
                store.count += 1;
            }
            store.userRating = starValue;
            saveStore();
            renderMeta();
        });

        renderMeta();
    }

    function get_search_data() {
        const uniqueNames = new Set();
        for (let a of $("div.card-masonry .item")) {
            let name = (a.title || '').trim().toLowerCase();
            if (!name) {
                continue;
            }

            if (!uniqueNames.has(name)) {
                uniqueNames.add(name);

                let img = a.querySelector("img");
                if (!img) {
                    continue;
                }
                img = img.getAttribute("src");
                if (!img) {
                    continue;
                }

                let aTag = a.href;
                aTag = '<a class="games-show-item" href="' + aTag + '" title="' + name + '">';
                aTag += '<img class="games-show-img" src="' + img + '" width="45" height="45" alt="' + name + '" title="' + name + '">';
                aTag += '<span class="games-show-title">' + name + '</span>' + '</a>';

                search_data.push({ name: name, aTag: aTag });
            }
        }
        return search_data;
    }

    // Run critical UI features first, then enhancement features.
    initVoteCountsByKeywordVolume();
    initTopStarRating();
    initGameContentShowMore();
    initSidebarToggle();

    try {
        get_search_data();
        ensureGameMeta();
    } catch (err) {
        // Keep page usable even when a malformed card appears.
        console.warn('Non-blocking init warning:', err);
    }
    // console.log(search_data.length)
});


// ============================ form select category ================================= 
$(document).on('change', '.category-input', function (e) {
    e.preventDefault();

    console.log('vao day')

    window.location = $(this).find('option:selected').val();
});

// ========================================= total-like ============================
$(".total-like").one("click", function () {
    $(".emojis-img").css({
        fill: "#1abc9c",
    })
    $(".total-like").css({
        cursor: "unset",
    })

    $(".total-like .count").css({
        color: "#1abc9c",
    })
})

// ================================= back-to-top ============================
$(document).ready(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });
    $("#back-to-top").click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 300);
    });
})


let resizeTimer;
$(window).resize(function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        let displayValue = $('.header__btn').css('display');
        if (displayValue === 'none') {
            $('.nav-right').css('display', 'flex');
        } else {
            $('.nav-right').css('display', 'none');
        }
    }, 100); // Adjust the delay as needed (e.g., 100ms)
});


// .header {transition: transform .3s;}  ==> .is-hide {transform: translate3d(0, -76px, 0);}
function hideHeaderAfterScrollDown() {
    var e,
        t = document.documentElement,
        a = document.querySelector("header"),
        s = "is-hide",
        o = window.scrollY || t.scrollTop,
        n = 0,
        i = 0;
    window.addEventListener("scroll", function l() {
        var r, c;
        (e = window.scrollY || t.scrollTop) > o ? (n = "down") : e < o && (n = "up"),
            n !== i &&
            ((r = n),
                (c = e),
                "down" === r && c > 104 ? (a.classList.add(s), (i = r)) : "up" === r && (a.classList.remove(s), (i = r))),
            (o = e);
    });
}
hideHeaderAfterScrollDown()