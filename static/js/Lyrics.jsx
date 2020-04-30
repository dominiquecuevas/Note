function Lyrics(props) {
    return (
        <div id="lyrics" dangerouslySetInnerHTML={props.dangerouslySetInnerHTML}></div>
    )
}