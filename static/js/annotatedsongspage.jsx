function AnnotatedSongsPage(props) {
    let songs = props.data;
    console.log('songs:', songs);
    if (songs.length != 0) {
        songs = props.data.map((song) => {
            return (
            <li><SongLink handleClick={props.handleClick} song_artist={song['song_artist']} song_title={song['song_title']} /></li>
            )
            });
        }
    return (<ul>{songs}</ul>)
    
}