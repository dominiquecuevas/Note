function SongLink(props) {
    return (
        <Link onClick={props.handleClick} to={`/song-data/${props.song_artist}/${props.song_title}`} data-song_artist={props.song_artist} data-song_title={props.song_title}>{props.song_artist} - {props.song_title}</Link>
    )
}
