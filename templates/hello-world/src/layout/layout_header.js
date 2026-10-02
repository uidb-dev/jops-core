import { layout } from "jops-core";

export default layout`
<header class="header">
    <div class="header__brand">
        <span class="header__logo">JOPS</span>
        <span class="header__tagline">Hello World</span>
    </div>
    <nav class="header__nav">
        <a class="header__nav-link" href="#home">Home</a>
        <a class="header__nav-link" href="#features">Features</a>
        <a class="header__nav-link" href="#form">Form</a>
        <a class="header__nav-link" href="#data">Data</a>
        <a class="header__nav-link" href="#media">Media</a>
    </nav>
</header>
`;
