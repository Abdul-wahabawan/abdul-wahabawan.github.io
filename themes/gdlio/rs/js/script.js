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
        const mobile = window.matchMedia('(max-width: 1200px)').matches;
        const navRight = document.querySelector('.nav-right');
        if (!navRight) return;
        if (mobile) {
            navRight.classList.toggle('is-open');
            return;
        }
        $('.nav-right').slideToggle("fast");
    })

    document.addEventListener('click', function (event) {
        const mobile = window.matchMedia('(max-width: 1200px)').matches;
        if (!mobile) return;
        const navRight = document.querySelector('.nav-right');
        const menuBtn = document.querySelector('.header__btn');
        if (!navRight || !menuBtn) return;
        if (!navRight.classList.contains('is-open')) return;
        if (navRight.contains(event.target) || menuBtn.contains(event.target)) return;
        navRight.classList.remove('is-open');
    });
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

    function normalizePath(pathValue) {
        if (!pathValue) return '/';
        let path = String(pathValue).trim();
        if (!path) return '/';
        if (!path.startsWith('/')) {
            path = `/${path}`;
        }
        path = path.toLowerCase().split('?')[0].split('#')[0];
        path = path.replace(/\/index\.html$/, '/');
        path = path.replace(/\/+$/, '');
        return path || '/';
    }

    function getCurrentPageSlug() {
        return normalizePath(window.location.pathname || '/');
    }

    function resetLegacyRatingStorage() {
        const resetFlag = 'rating_system_v3_reset_done';
        try {
            if (localStorage.getItem(resetFlag) === '1') return;
            const prefixes = ['page_rating_', 'homepage_user_rating_', 'rating_v2_', 'rating_v3_'];
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (!key) continue;
                if (prefixes.some((prefix) => key.startsWith(prefix))) {
                    localStorage.removeItem(key);
                }
            }
            localStorage.setItem(resetFlag, '1');
        } catch (e) {
            // Ignore storage errors silently.
        }
    }

    function getCardSlug(card) {
        const href = (card && card.getAttribute('href')) || '';
        if (!href) return '';
        try {
            const url = new URL(href, window.location.origin);
            return normalizePath(url.pathname || '');
        } catch (e) {
            return normalizePath(href);
        }
    }

    function syncCardRatingsForSlug(slug, ratingValue) {
        if (!slug || !Number.isFinite(ratingValue)) return;
        const normalized = normalizePath(slug);
        const cards = document.querySelectorAll('.item[href]');
        cards.forEach((card) => {
            const cardSlug = getCardSlug(card);
            if (cardSlug !== normalized) return;
            const valueEl = card.querySelector('.game-rating__value');
            if (valueEl) {
                valueEl.textContent = ratingValue.toFixed(1);
            }
        });
    }

    function getFirstCardRatingForSlug(slug) {
        if (!slug) return NaN;
        const normalized = normalizePath(slug);
        const cards = document.querySelectorAll('.item[href]');
        for (const card of cards) {
            if (getCardSlug(card) !== normalized) continue;
            const valueEl = card.querySelector('.game-rating__value');
            const value = valueEl ? Number(valueEl.textContent) : NaN;
            if (Number.isFinite(value)) return value;
        }
        return NaN;
    }

    function getLabelByContext(card, index) {
        if (card.dataset.label) {
            return card.dataset.label.toLowerCase();
        }

        const readNearbyHeading = (startNode) => {
            let node = startNode;
            let guard = 0;
            while (node && guard < 8) {
                let sibling = node.previousElementSibling;
                let siblingGuard = 0;
                while (sibling && siblingGuard < 8) {
                    const text = (sibling.textContent || '').toLowerCase();
                    if (text.includes('new games')) return 'new';
                    if (text.includes('hot games')) return 'hot';
                    sibling = sibling.previousElementSibling;
                    siblingGuard += 1;
                }
                node = node.parentElement;
                guard += 1;
            }
            return '';
        };

        const masonry = card.closest('.card-masonry');
        const nearbyHeading = masonry ? readNearbyHeading(masonry) : '';
        if (nearbyHeading) return nearbyHeading;

        const section = card.closest('section');
        const sectionText = section ? section.textContent.toLowerCase() : '';
        if (sectionText.includes('hot games')) return 'hot';
        if (sectionText.includes('new games')) return 'new';

        const pagePath = (window.location.pathname || '').toLowerCase();
        if (pagePath.includes('/hot-games')) return 'hot';
        if (pagePath.includes('/new-games')) return 'new';
        return index % 4 === 0 ? 'new' : 'hot';
    }

    function ensureGameMeta() {
        const cards = document.querySelectorAll('.card-masonry .item, .player-reco-row .item');
        cards.forEach((card, index) => {
            const label = getLabelByContext(card, index);
            const badgeClass = `game-badge game-badge--${label === 'new' ? 'new' : 'hot'}`;
            const badgeText = label === 'new' ? 'new' : 'hot';
            const existingBadge = card.querySelector('.game-badge');

            if (!existingBadge) {
                const badge = document.createElement('span');
                badge.className = badgeClass;
                badge.textContent = badgeText;
                card.appendChild(badge);
            } else {
                // Keep badges in sync with page context (hot-games/new-games).
                existingBadge.className = badgeClass;
                existingBadge.textContent = badgeText;
            }

            if (!card.querySelector('.game-rating')) {
                const title = (card.getAttribute('title') || card.textContent || '').trim().toLowerCase();
                const custom = parseFloat(card.dataset.rating);
                const hashed = 40 + (hashCode(title || String(index)) % 11);
                const rating = Number.isFinite(custom) ? custom : (hashed / 10);
                const ratingEl = document.createElement('span');
                ratingEl.className = 'game-rating';
                ratingEl.innerHTML = `<span class="game-rating__star">★</span><span class="game-rating__value">${rating.toFixed(1)}</span>`;
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
        const slug = getCurrentPageSlug();
        const seed = `${title} ${heading} ${slug}`;
        const hash = hashCode(seed || 'game');

        const storageKey = `rating_v3_user_${slug}`;
        const cardBaseRating = getFirstCardRatingForSlug(slug);
        const baseAverage = Number(
            (Number.isFinite(cardBaseRating) ? cardBaseRating : (40 + (hashCode(heading || title || slug || 'game') % 11)) / 10).toFixed(1)
        );
        const baseCount = 1200 + (hash % 8601); // 1,200 .. 9,800

        let userRating = 0;
        try {
            const savedValue = Number(localStorage.getItem(storageKey) || 0);
            if (Number.isFinite(savedValue) && savedValue >= 1 && savedValue <= 5) {
                userRating = savedValue;
            }
        } catch (e) {
            // Ignore storage issues silently.
        }

        let ratingEl = document.querySelector('.game-top-rating');
        if (!ratingEl) {
            ratingEl = document.createElement('div');
            ratingEl.className = 'game-top-rating';
        }

        const wrapper = document.querySelector('.game__content2');
        const breadcrumbs = wrapper ? wrapper.querySelector('.breadcrumbs') : null;
        if (wrapper && breadcrumbs) {
            const meta = wrapper.querySelector('.game-top-meta') || document.createElement('div');
            meta.className = 'game-top-meta';
            if (!meta.parentElement) {
                breadcrumbs.parentNode.insertBefore(meta, breadcrumbs);
            }
            if (!meta.contains(breadcrumbs)) {
                meta.appendChild(breadcrumbs);
            }
            if (!meta.contains(ratingEl)) {
                meta.appendChild(ratingEl);
            }
        } else if (wrapper && !ratingEl.parentElement) {
            wrapper.insertAdjacentElement('afterbegin', ratingEl);
        } else if (!ratingEl.parentElement) {
            const pageTitle = document.querySelector('h1');
            if (pageTitle) {
                ratingEl.classList.add('game-top-rating--headline');
                pageTitle.insertAdjacentElement('afterend', ratingEl);
            }
        }

        ratingEl.innerHTML = `
            <div class="game-top-rating__stars"></div>
            <div class="game-top-rating__meta">
                <span class="game-top-rating__value">${baseAverage.toFixed(1)}</span>
                <span class="game-top-rating__dot">•</span>
                <span class="game-top-rating__count">${baseCount.toLocaleString('en-US')}+ users rated</span>
            </div>
        `;

        const starsWrap = ratingEl.querySelector('.game-top-rating__stars');
        if (!starsWrap) return;

        function getStarValueFromEvent(event) {
            const target = event.target;
            if (target instanceof HTMLElement) {
                const direct = Number(target.dataset.value || 0);
                if (Number.isFinite(direct) && direct >= 1 && direct <= 5) return direct;
            }
            const rect = starsWrap.getBoundingClientRect();
            if (!rect.width) return 0;
            return Math.max(1, Math.min(5, Math.ceil(((event.clientX || 0) - rect.left) / rect.width * 5)));
        }

        function renderStars(visibleRating) {
            starsWrap.innerHTML = '';
            for (let i = 1; i <= 5; i++) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `game-top-rating__star-btn ${visibleRating >= i ? 'is-full' : 'is-empty'}`;
                btn.textContent = '★';
                btn.dataset.value = String(i);
                btn.setAttribute('aria-label', `Rate ${i} star${i > 1 ? 's' : ''}`);
                starsWrap.appendChild(btn);
            }
        }

        function saveUserRating(value) {
            userRating = value;
            try {
                localStorage.setItem(storageKey, String(value));
            } catch (e) {
                // Ignore storage issues silently.
            }
            renderStars(userRating);
        }

        function applyFromEvent(event) {
            event.preventDefault();
            event.stopPropagation();
            const value = getStarValueFromEvent(event);
            if (!Number.isFinite(value) || value < 1 || value > 5) return;
            saveUserRating(value);
        }

        starsWrap.addEventListener('pointermove', function (event) {
            const value = getStarValueFromEvent(event);
            if (value >= 1 && value <= 5) renderStars(value);
        });
        starsWrap.addEventListener('pointerleave', function () {
            renderStars(userRating);
        });
        starsWrap.addEventListener('pointerdown', applyFromEvent, true);
        starsWrap.addEventListener('click', applyFromEvent, true);

        renderStars(userRating);
        ratingEl.setAttribute('aria-label', `Rating ${baseAverage.toFixed(1)} out of 5 from ${baseCount.toLocaleString('en-US')} users`);
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

    // Keep page layout fully static from HTML on initial load.
    // Do not auto-inject or auto-rewrite rating/footer blocks here.
    ensureGameMeta();
    initGameContentShowMore();
    initSidebarToggle();
    initVoteCountsByKeywordVolume();
    resetLegacyRatingStorage();
    initTopStarRating();

    try {
        get_search_data();
        // keep cards exactly as authored in HTML
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
        const navRight = document.querySelector('.nav-right');
        if (displayValue === 'none') {
            $('.nav-right').css('display', 'flex');
            if (navRight) navRight.classList.remove('is-open');
        } else {
            $('.nav-right').css('display', 'none');
            if (navRight) navRight.classList.remove('is-open');
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

// ============================ player footer actions ============================
function initPlayerFooterActions() {
    const footer = document.getElementById('player-footer') || document.querySelector('.player-footer');
    if (!footer) return;

    const slug = (window.location.pathname || '/').toLowerCase();
    const storageKey = `player_footer_v3_${slug}`;
    const favoritesKey = 'favorite_games_v1';
    const likeBtn = footer.querySelector('[data-action="like"]');
    const dislikeBtn = footer.querySelector('[data-action="dislike"]');
    const favoriteBtn = footer.querySelector('[data-action="favorite"]');
    const shareBtn = footer.querySelector('[data-action="share"]');
    const reportBtn = footer.querySelector('[data-action="report"]');
    const controlsBtn = footer.querySelector('[data-action="controls"]');
    const fullscreenBtn = footer.querySelector('[data-action="fullscreen"]');
    const shareBox = document.getElementById('footer-share-box');
    const likeCountEl = footer.querySelector('[data-count-type="like"]');
    const dislikeCountEl = footer.querySelector('[data-count-type="dislike"]');
    const reportOverlay = document.getElementById('report-drawer-overlay');
    const reportDrawer = document.getElementById('report-drawer');
    const reportCloseBtn = document.getElementById('report-drawer-close');
    const reportSendBtn = document.getElementById('report-drawer-send');
    const reportIssueSelect = document.getElementById('report-drawer-issue');
    const reportEmailInput = document.getElementById('report-drawer-email');
    const reportTextInput = document.getElementById('report-drawer-message');
    const controlsPopup = document.getElementById('player-controls-popup');
    const controlsCloseBtn = document.getElementById('player-controls-close');
    const gameIframe = document.getElementById('iframehtml5');

    let reportToastTimer = null;
    const ensureReportToast = () => {
        let toast = document.getElementById('report-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'report-toast';
            toast.className = 'report-toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            document.body.appendChild(toast);
        }
        return toast;
    };

    const showReportToast = (message, type) => {
        const toast = ensureReportToast();
        toast.textContent = message;
        toast.classList.remove('is-success', 'is-error', 'is-open');
        toast.classList.add(type === 'error' ? 'is-error' : 'is-success');
        // Force reflow so repeated messages animate consistently.
        void toast.offsetWidth;
        toast.classList.add('is-open');
        if (reportToastTimer) clearTimeout(reportToastTimer);
        reportToastTimer = window.setTimeout(() => {
            toast.classList.remove('is-open');
        }, 3200);
    };
    const headerFavoriteToggle = document.getElementById('header-favorite-toggle');
    const headerFavoritePanel = document.getElementById('header-favorite-panel');
    const headerFavoriteList = document.getElementById('header-favorite-list');
    const headerFavoriteEmpty = document.getElementById('header-favorite-empty');
    const headerFavoriteCount = document.getElementById('header-favorite-count');

    // Buttons do not support alt text; mirror aria-label to title for visible hover tooltip.
    footer.querySelectorAll('.player-footer-btn').forEach((btn) => {
        const label = btn.getAttribute('aria-label');
        if (label && !btn.getAttribute('title')) {
            btn.setAttribute('title', label);
        }
    });

    const parseCount = (el) => {
        if (!el) return 0;
        const raw = String(el.textContent || '0').trim().toLowerCase();
        if (!raw) return 0;
        if (raw.endsWith('k')) return Math.round(parseFloat(raw) * 1000);
        if (raw.endsWith('m')) return Math.round(parseFloat(raw) * 1000000);
        const value = parseInt(raw.replace(/[^\d]/g, ''), 10);
        return Number.isFinite(value) ? value : 0;
    };

    const compactNumber = (value) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1).replace(/\.0$/, '')}m`;
        }
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
        }
        return String(value);
    };

    const baseLike = parseCount(likeCountEl);
    const baseDislike = parseCount(dislikeCountEl);
    let state = { vote: '', favorite: false };
    let favoriteGames = [];

    try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                state.vote = parsed.vote === 'like' || parsed.vote === 'dislike' ? parsed.vote : '';
                state.favorite = !!parsed.favorite;
            }
        }
    } catch (e) {
        // Ignore storage issues.
    }

    const saveState = () => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(state));
        } catch (e) {
            // Ignore storage issues.
        }
    };

    const loadFavoriteGames = () => {
        try {
            const saved = localStorage.getItem(favoritesKey);
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    };

    const saveFavoriteGames = () => {
        try {
            localStorage.setItem(favoritesKey, JSON.stringify(favoriteGames));
        } catch (e) {
            // Ignore storage issues.
        }
    };

    const currentTitle = (footer.querySelector('.player-footer__left h2')?.textContent || document.title || 'Game').trim();
    const currentImage = (footer.querySelector('.player-footer__left img')?.getAttribute('src') || '').trim();
    const currentEntry = {
        slug,
        url: window.location.pathname || '/',
        title: currentTitle,
        image: currentImage
    };

    const hasCurrentFavorite = () => favoriteGames.some((item) => item && item.slug === slug);

    const setCurrentFavorite = (enabled) => {
        const exists = hasCurrentFavorite();
        if (enabled && !exists) {
            favoriteGames.unshift(currentEntry);
        }
        if (!enabled && exists) {
            favoriteGames = favoriteGames.filter((item) => item && item.slug !== slug);
        }
        saveFavoriteGames();
    };

    const escapeHtml = (value) => String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const renderHeaderFavorites = () => {
        if (headerFavoriteCount) {
            headerFavoriteCount.textContent = String(favoriteGames.length);
        }
        if (headerFavoriteList) {
            headerFavoriteList.innerHTML = favoriteGames
                .map((item) => `
                    <div class="header-favorite-item" data-favorite-slug="${escapeHtml(item.slug || '')}">
                        <a class="header-favorite-item__link" href="${escapeHtml(item.url || '#')}" title="${escapeHtml(item.title || 'Game')}">
                            <img class="header-favorite-item__img" src="${escapeHtml(item.image || '/cache/data/image/siteslist/logo.png')}" alt="${escapeHtml(item.title || 'Game')}">
                            <span class="header-favorite-item__title">${escapeHtml(item.title || 'Game')}</span>
                        </a>
                        <button type="button" class="header-favorite-item__remove" data-action="remove-favorite" data-favorite-slug="${escapeHtml(item.slug || '')}" aria-label="Remove from favorites" title="Remove">×</button>
                    </div>
                `)
                .join('');
        }
        if (headerFavoriteEmpty) {
            headerFavoriteEmpty.style.display = favoriteGames.length ? 'none' : '';
        }
        if (headerFavoriteToggle) {
            headerFavoriteToggle.classList.toggle('is-active', hasCurrentFavorite());
        }
    };

    const render = () => {
        if (likeBtn) likeBtn.classList.toggle('is-active', state.vote === 'like');
        if (dislikeBtn) dislikeBtn.classList.toggle('is-active', state.vote === 'dislike');
        if (favoriteBtn) {
            favoriteBtn.classList.toggle('is-active', state.favorite);
            favoriteBtn.setAttribute('aria-pressed', state.favorite ? 'true' : 'false');
        }
        const likeValue = baseLike + (state.vote === 'like' ? 1 : 0);
        const dislikeValue = baseDislike + (state.vote === 'dislike' ? 1 : 0);
        if (likeCountEl) {
            likeCountEl.textContent = compactNumber(likeValue);
            likeCountEl.setAttribute('title', String(likeValue));
            if (likeBtn) likeBtn.setAttribute('title', String(likeValue));
        }
        if (dislikeCountEl) {
            dislikeCountEl.textContent = compactNumber(dislikeValue);
            dislikeCountEl.setAttribute('title', String(dislikeValue));
            if (dislikeBtn) dislikeBtn.setAttribute('title', String(dislikeValue));
        }
        renderHeaderFavorites();
    };

    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            state.vote = state.vote === 'like' ? '' : 'like';
            saveState();
            render();
        });
    }

    if (dislikeBtn) {
        dislikeBtn.addEventListener('click', () => {
            state.vote = state.vote === 'dislike' ? '' : 'dislike';
            saveState();
            render();
        });
    }

    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => {
            state.favorite = !state.favorite;
            setCurrentFavorite(state.favorite);
            saveState();
            render();
        });
    }

    if (headerFavoriteToggle && headerFavoritePanel) {
        headerFavoriteToggle.addEventListener('click', (event) => {
            event.preventDefault();
            const opened = !headerFavoritePanel.classList.contains('is-open');
            headerFavoritePanel.classList.toggle('is-open', opened);
            headerFavoriteToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });

        document.addEventListener('click', (event) => {
            if (!headerFavoritePanel.classList.contains('is-open')) return;
            if (headerFavoritePanel.contains(event.target) || headerFavoriteToggle.contains(event.target)) return;
            headerFavoritePanel.classList.remove('is-open');
            headerFavoriteToggle.setAttribute('aria-expanded', 'false');
        });

        if (headerFavoriteList) {
            headerFavoriteList.addEventListener('click', (event) => {
                const removeBtn = event.target.closest('[data-action="remove-favorite"]');
                if (!removeBtn) return;
                event.preventDefault();
                event.stopPropagation();
                const slugToRemove = removeBtn.getAttribute('data-favorite-slug') || '';
                if (!slugToRemove) return;
                favoriteGames = favoriteGames.filter((item) => item && item.slug !== slugToRemove);
                if (slugToRemove === slug) {
                    state.favorite = false;
                    saveState();
                }
                saveFavoriteGames();
                render();
            });
        }
    }

    if (shareBtn && shareBox) {
        shareBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const expanded = shareBox.classList.toggle('hide-share') ? 'false' : 'true';
            shareBtn.setAttribute('aria-expanded', expanded);
        });

        shareBox.addEventListener('click', (event) => {
            const button = event.target.closest('[data-network]');
            if (!button) return;
            const network = button.getAttribute('data-network');
            const pageUrl = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title || 'Geometry Dash Lite');

            if (network === 'copy') {
                navigator.clipboard?.writeText(window.location.href).catch(() => {});
                shareBox.classList.add('hide-share');
                shareBtn.setAttribute('aria-expanded', 'false');
                return;
            }

            let targetUrl = '';
            if (network === 'facebook') targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
            if (network === 'twitter') targetUrl = `https://twitter.com/intent/tweet?text=${title}&url=${pageUrl}`;
            if (network === 'reddit') targetUrl = `https://www.reddit.com/submit?title=${title}&url=${pageUrl}`;
            if (targetUrl) window.open(targetUrl, '_blank', 'noopener,noreferrer,width=560,height=600');
        });

        document.addEventListener('click', (event) => {
            if (shareBox.classList.contains('hide-share')) return;
            if (shareBox.contains(event.target) || shareBtn.contains(event.target)) return;
            shareBox.classList.add('hide-share');
            shareBtn.setAttribute('aria-expanded', 'false');
        });
    }

    if (reportBtn) {
        reportBtn.addEventListener('click', () => {
            if (reportOverlay) reportOverlay.classList.add('is-open');
            if (reportDrawer) reportDrawer.classList.add('is-open');
        });
    }

    const closeReportDrawer = () => {
        if (reportOverlay) reportOverlay.classList.remove('is-open');
        if (reportDrawer) reportDrawer.classList.remove('is-open');
    };

    if (reportOverlay) {
        reportOverlay.addEventListener('click', closeReportDrawer);
    }
    if (reportCloseBtn) {
        reportCloseBtn.addEventListener('click', closeReportDrawer);
    }

    if (reportSendBtn) {
        reportSendBtn.addEventListener('click', () => {
            const issue = (reportIssueSelect?.value || '').trim();
            const email = (reportEmailInput?.value || '').trim();
            const message = (reportTextInput?.value || '').trim();
            if (!issue) {
                showReportToast('Please choose an issue type before sending.', 'error');
                return;
            }
            if (!message) {
                showReportToast('Please add a short description of the issue.', 'error');
                return;
            }
            const subject = encodeURIComponent(`Bug report - ${document.title || 'Game'}`);
            const body = encodeURIComponent(
                `Page: ${window.location.href}\nIssue: ${issue || 'Not selected'}\nEmail: ${email || 'Not provided'}\n\nDetails:\n${message || 'No details'}`
            );
            window.location.href = `mailto:support@geometry-dash-lite.io?subject=${subject}&body=${body}`;
            closeReportDrawer();
            showReportToast('Thanks! Your report draft is ready in your email app.', 'success');
        });
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            const expandBtn = document.getElementById('expand');
            const frame = document.getElementById('iframehtml5');
            if (expandBtn && expandBtn !== fullscreenBtn) {
                expandBtn.click();
                return;
            }
            if (frame && frame.requestFullscreen) {
                frame.requestFullscreen().catch(() => {});
            }
        });
    }

    const closeControlsPopup = () => {
        if (controlsPopup) {
            controlsPopup.classList.add('hide-share');
            controlsPopup.classList.remove('is-open');
            controlsPopup.setAttribute('aria-hidden', 'true');
        }
        if (controlsBtn) {
            controlsBtn.setAttribute('aria-expanded', 'false');
        }
    };

    if (controlsBtn && controlsPopup) {
        const iframeWrap = gameIframe ? gameIframe.parentElement : null;
        if (iframeWrap) iframeWrap.classList.add('player-iframe-wrap');

        controlsBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const willOpen = controlsPopup.classList.contains('hide-share');
            controlsPopup.classList.toggle('hide-share', !willOpen);
            controlsPopup.classList.toggle('is-open', willOpen);
            controlsPopup.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
            controlsBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });

        if (controlsCloseBtn) {
            controlsCloseBtn.addEventListener('click', (event) => {
                event.preventDefault();
                closeControlsPopup();
            });
        }

        document.addEventListener('click', (event) => {
            if (controlsPopup.classList.contains('hide-share')) return;
            if (controlsPopup.contains(event.target) || controlsBtn.contains(event.target)) return;
            closeControlsPopup();
        });
    }

    favoriteGames = loadFavoriteGames();
    state.favorite = hasCurrentFavorite();
    render();
}

window.scrollRecoRow = function scrollRecoRow() {
    const row = document.getElementById('player-reco-row');
    if (!row) return;
    const card = row.querySelector('.item');
    const step = card ? card.getBoundingClientRect().width + 12 : 220;
    const maxScrollLeft = Math.max(0, row.scrollWidth - row.clientWidth);
    const nextLeft = row.scrollLeft + step;
    const edgeBuffer = Math.max(8, Math.round(step * 0.2));

    // Infinite next: after last card, continue again from first card.
    if (nextLeft >= (maxScrollLeft - edgeBuffer)) {
        row.scrollTo({ left: 0, behavior: 'smooth' });
        return;
    }

    row.scrollTo({ left: nextLeft, behavior: 'smooth' });
};

document.addEventListener('DOMContentLoaded', initPlayerFooterActions);

function initSidebarComments() {
    const widgets = document.querySelectorAll('[data-comments-widget]');
    if (!widgets.length) return;

    const escapeHtml = (value) => String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    widgets.forEach((widget, idx) => {
        const slug = widget.getAttribute('data-comments-slug') || (window.location.pathname || '/').toLowerCase();
        const key = `comments_v1_${slug}`;
        const listEl = widget.querySelector('[data-comments-list]');
        const nameInput = widget.querySelector('[data-comments-name]');
        const textInput = widget.querySelector('[data-comments-text]');
        const submitBtn = widget.querySelector('[data-comments-submit]');
        if (!listEl || !nameInput || !textInput || !submitBtn) return;

        let store = [];
        try {
            const saved = localStorage.getItem(key);
            const parsed = saved ? JSON.parse(saved) : [];
            store = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            store = [];
        }

        const saveStore = () => {
            try {
                localStorage.setItem(key, JSON.stringify(store));
            } catch (e) {
                // Ignore storage issues.
            }
        };

        const normalizeNode = (node) => ({
            name: String(node?.name || 'Guest'),
            text: String(node?.text || ''),
            likes: Number(node?.likes || 0),
            dislikes: Number(node?.dislikes || 0),
            userVote: node?.userVote === 'like' || node?.userVote === 'dislike' ? node.userVote : '',
            replies: Array.isArray(node?.replies) ? node.replies.map(normalizeNode) : []
        });

        store = Array.isArray(store) ? store.map(normalizeNode) : [];

        const getNodeByPath = (pathValue) => {
            const parts = String(pathValue || '').split('.').map((n) => Number(n));
            if (!parts.length || parts.some((n) => !Number.isFinite(n) || n < 0)) return null;
            let current = store[parts[0]];
            if (!current) return null;
            for (let i = 1; i < parts.length; i++) {
                if (!Array.isArray(current.replies)) return null;
                current = current.replies[parts[i]];
                if (!current) return null;
            }
            return current;
        };

        const renderNode = (node, pathValue, depth = 0) => `
            <div class="sidebar-comment ${depth > 0 ? 'sidebar-comment--reply' : ''}" data-comment-path="${pathValue}">
                <div class="sidebar-comment__name">${escapeHtml(node.name || 'Guest')}</div>
                <div class="sidebar-comment__text">${escapeHtml(node.text || '')}</div>
                <div class="sidebar-comment__actions">
                    <button class="sidebar-comment__btn ${node.userVote === 'like' ? 'is-active' : ''}" type="button" data-comment-like="${pathValue}">
                        <svg class="sidebar-comment__btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"></path>
                            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                        <span>${Number(node.likes || 0)}</span>
                    </button>
                    <button class="sidebar-comment__btn ${node.userVote === 'dislike' ? 'is-active' : ''}" type="button" data-comment-dislike="${pathValue}">
                        <svg class="sidebar-comment__btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.28a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3z"></path>
                            <path d="M17 10h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
                        </svg>
                        <span>${Number(node.dislikes || 0)}</span>
                    </button>
                    <button class="sidebar-comment__btn" type="button" data-comment-reply-toggle="${pathValue}">Reply</button>
                </div>
                <div class="sidebar-comment__reply-form hide-share" data-comment-reply-form="${pathValue}">
                    <input class="sidebar-comments__field" type="text" placeholder="Your name" data-reply-name="${pathValue}">
                    <textarea class="sidebar-comments__field sidebar-comments__textarea" placeholder="Write a reply..." data-reply-text="${pathValue}"></textarea>
                    <button class="sidebar-comments__submit" type="button" data-reply-submit="${pathValue}">Post Reply</button>
                </div>
                ${Array.isArray(node.replies) && node.replies.length ? `
                    <div class="sidebar-comment__reply-wrap">
                        ${node.replies.map((reply, idx) => renderNode(reply, `${pathValue}.${idx}`, depth + 1)).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        const render = () => {
            listEl.innerHTML = store.map((item, i) => renderNode(item, String(i), 0)).join('');
        };

        submitBtn.addEventListener('click', () => {
            const name = (nameInput.value || '').trim();
            const text = (textInput.value || '').trim();
            if (!name || !text) return;
            store.unshift({
                name,
                text,
                likes: 0,
                dislikes: 0,
                userVote: '',
                replies: []
            });
            nameInput.value = '';
            textInput.value = '';
            saveStore();
            render();
        });

        listEl.addEventListener('click', (event) => {
            const likeBtn = event.target.closest('[data-comment-like]');
            if (likeBtn) {
                const pathValue = likeBtn.getAttribute('data-comment-like');
                const node = getNodeByPath(pathValue);
                if (node) {
                    const currentVote = node.userVote || '';
                    if (currentVote === 'like') {
                        node.likes = Math.max(0, Number(node.likes || 0) - 1);
                        node.userVote = '';
                    } else if (currentVote === 'dislike') {
                        node.dislikes = Math.max(0, Number(node.dislikes || 0) - 1);
                        node.likes = Number(node.likes || 0) + 1;
                        node.userVote = 'like';
                    } else {
                        node.likes = Number(node.likes || 0) + 1;
                        node.userVote = 'like';
                    }
                    saveStore();
                    render();
                }
                return;
            }

            const dislikeBtn = event.target.closest('[data-comment-dislike]');
            if (dislikeBtn) {
                const pathValue = dislikeBtn.getAttribute('data-comment-dislike');
                const node = getNodeByPath(pathValue);
                if (node) {
                    const currentVote = node.userVote || '';
                    if (currentVote === 'dislike') {
                        node.dislikes = Math.max(0, Number(node.dislikes || 0) - 1);
                        node.userVote = '';
                    } else if (currentVote === 'like') {
                        node.likes = Math.max(0, Number(node.likes || 0) - 1);
                        node.dislikes = Number(node.dislikes || 0) + 1;
                        node.userVote = 'dislike';
                    } else {
                        node.dislikes = Number(node.dislikes || 0) + 1;
                        node.userVote = 'dislike';
                    }
                    saveStore();
                    render();
                }
                return;
            }

            const toggleReplyBtn = event.target.closest('[data-comment-reply-toggle]');
            if (toggleReplyBtn) {
                const pathValue = toggleReplyBtn.getAttribute('data-comment-reply-toggle');
                const form = listEl.querySelector(`[data-comment-reply-form="${pathValue}"]`);
                if (form) form.classList.toggle('hide-share');
                return;
            }

            const submitReplyBtn = event.target.closest('[data-reply-submit]');
            if (submitReplyBtn) {
                const pathValue = submitReplyBtn.getAttribute('data-reply-submit');
                const node = getNodeByPath(pathValue);
                const nameEl = listEl.querySelector(`[data-reply-name="${pathValue}"]`);
                const textEl = listEl.querySelector(`[data-reply-text="${pathValue}"]`);
                const name = (nameEl?.value || '').trim();
                const text = (textEl?.value || '').trim();
                if (!node || !name || !text) return;
                if (!Array.isArray(node.replies)) node.replies = [];
                node.replies.push({
                    name,
                    text,
                    likes: 0,
                    dislikes: 0,
                    userVote: '',
                    replies: []
                });
                saveStore();
                render();
            }
        });

        render();
    });
}

document.addEventListener('DOMContentLoaded', initSidebarComments);