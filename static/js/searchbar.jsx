function Search(props) {
    return (
        <form
        id="search"
        onSubmit={props.onSubmit}
        className="d-flex"
    >
        <input type="text" className="form-control mr-3" name="q" placeholder="Artist, Song, or Lyrics" />
        {/* <Link to="/search-results"> */}
            <input type="submit" className="btn btn-primary" value="Search" />
        {/* </Link> */}
    </form>
    )
}