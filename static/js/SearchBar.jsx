function Search(props) {
    return (
        <form
        id="search"
        onSubmit={props.onSubmit}
        className="d-flex"
    >
        <input type="text" className="form-control mr-3" name="q" placeholder="Artist, Song, or Lyrics" />
        <button id="searchButton" type="submit" className="btn btn-primary">
            <i className="fas fa-search"></i>
        </button>
        
    </form>
    )
}