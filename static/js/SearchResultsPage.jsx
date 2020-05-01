function SearchResultsPage(props) {
    return  (
        <div className="row">
            <div className="col-6">
                <ul>{props.results}</ul>
            </div>
        </div>
    )
}