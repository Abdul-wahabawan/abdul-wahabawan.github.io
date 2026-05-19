const headerHTML = `
    <header class="header fixed">
        <div class="container-fluid">
            <div class="header__content">
                <button class="header__btn" type="button" aria-label="header__nav">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM3 18C3 17.4477 3.44772 17 4 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z" />
                    </svg>
                </button>
                <div class="header__logo--wrap">
                    <a href="/" class="header__logo" title="Geometry Dash Lite">
                        <img src="/cache/data/image/siteslist/logo.png" width="" height="50" title="Geometry Dash Lite" alt="Geometry Dash Lite">
                    </a>
                </div>
                <nav class="nav-right">
                    <ul class="header__nav">
                        <li><a href="/hot-games.html" title="Hot Games">Hot Games</a></li>
                        <li><a href="/new-games.html" title="New Games">New Games</a></li>
                        <li><a href="/games/color-games.html" title="Color Games">Color Games</a></li>
                        <li><a href="/games/hypercasual-games.html" title="Hypercasual Games">Hypercasual Games</a></li>
                        <li><a href="/games/running-games.html" title="Running Games">Running Games</a></li>
                        <li><a href="/games/racing-games.html" title="Racing Games">Racing Games</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
    <style>
        .header__nav {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            gap: 15px;
            font-family: Arial, sans-serif;
        }

        .header__nav li {
            position: relative;
            padding: 10px;
        }

        .dropdown-content {
            display: none;
            position: absolute;
            background-color: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            min-width: 180px;
            border-radius: 8px;
            overflow: hidden;
            z-index: 1000;
        }

        .dropdown-content li {
            display: block;
            transition: background-color ease-in-out;
        }

        .dropdown-content li a {
            text-decoration: none;
            color: #333;
            font-size: 16px;
            display: block;
        }

        .dropdown-content li:hover {
            padding: 0.5rem;
            color: #f2f7ff;
            background-color: #4f6ea8;
            border-radius: 5px;
        }

        .dropdown-content li:hover a {
            color: #fff;
        }

        .dropdown:hover .dropdown-content {
            display: block;
        }

        .dropbtn {
            font-weight: bold;
            text-decoration: none;
            padding: 10px;
            color: white;
            border-radius: 5px;
            transition: background 0.3s;
        }
    </style>
`;

document.body.insertAdjacentHTML('afterbegin', headerHTML);

