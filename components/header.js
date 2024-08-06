const navItems = [
  {
      title: "Home",
      tech: "HTML5 Canvas",
      url: ""
  },
  {
      title: "Pong",
      tech: "HTML5 Canvas",
      url: "pong-canvas"
  },
  {
      title: "WebGL Playground",
      tech: "WebGL",
      url: "webgl-playground"
  },
  {
      title: "WebGL Point Cloud",
      tech: "WebGL",
      url: "point-cloud"
  },
];

const navList = document.getElementById("nav-list");



class Header extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
        <style>
          header.nav {
            margin: 0px;
            position: sticky;
            top: 0;
            background-color: rgba(30,30,30,0.3);
            backdrop-filter: blur(5px);
            height: 40px;
            width: 100vw;
          }
          nav.nav {
            margin: 0px;
            //background-color: red;
            height: 100%;
            width: 100%;
          }
          ul.nav {
            margin: 0px;
            height: 100%;
            width: 100%;
            border-bottom: 1px var(--light) solid;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            list-style: none;
          }
          a.nav {
            color: var(--light);
            text-decoration: none;
            font-weight: 700;
            transition: color 200ms;
          }
          a.nav:hover {
            color: var(--primary);
          }
        </style>
        <header class="nav">
          <nav class="nav">
            <ul class="nav">
                ${navItems.map((item, i) => `
                <li class="nav">
                  <a href="/${item.url}" class="nav">
                      ${item.title}
                  </a>
                </li>`).join('\n')}
            </ul>
          </nav>
        </header>
      `;
    }
  }
  
  customElements.define('header-component', Header);
  