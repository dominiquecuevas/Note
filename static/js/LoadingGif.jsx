function LoadingGif(props) {
    return (
        <div className="loading-gif" style={props.styling}>
            <div>
                <img id="catGif" src="/static/img/nyancat.gif" />
            </div>
            <span>Loading...</span>
        </div>
    )
}