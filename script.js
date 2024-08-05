const navItems = [
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
];

const navList = document.getElementById("nav-list");

navList.innerHTML = navItems.map((item, i) => `
<li>
    <a href="/${item.url}">
        ${item.title}
    </a>
</li>`).join('\n')