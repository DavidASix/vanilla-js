const navItems = [
    {
        title: "Pong",
        tech: "web-gl",
        url: "pong-webgl"
    }
];

const navList = document.getElementById("nav-list");

navList.innerHTML = navItems.map((item, i) => `
<li>
    <a href="/${item.url}">
        ${item.title}
    </a>
</li>`).join('\n')