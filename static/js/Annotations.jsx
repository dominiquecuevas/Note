function Annotations(props) {
    console.log('in Annotations');
    let annotationsList = props.annotationsList;
    if (annotationsList.length) {
        annotationsList = annotationsList.map((anno) => {
            return (
            <tr><td>{anno.song_fragment}</td><td>{anno.annotation}</td><td>{anno['user.name']}</td></tr>
            )
        })
    }
    return (
        <table id="q_annotations" style={props.styling} className="table table-striped table-bordered">
            <tr><th>Lyrics Fragment</th><th>Annotation</th><th>Annotation by</th></tr>
            {annotationsList}
        </table>
    )
}