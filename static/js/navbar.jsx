function NavBar(props) {
    return (
        <nav id="nav" className="navbar sticky-top navbar-light bg-light justify-content-start">
        <div id="note"><a className="navbar-brand" href="/"><span id="logo">♫</span> <b>Note</b>
            <br />
            <span id="slogan">Lyrics Annotator</span>
            </a>
        </div> | 
        <Link className="nav-link" to="/annosongs">Annotated Songs</Link> |
        <Link className="nav-link" to="/user-annos">Account</Link>
    </nav>
    )
}