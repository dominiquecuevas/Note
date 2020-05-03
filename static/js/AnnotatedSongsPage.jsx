function AnnotatedSongsPage(props) {
    let songs = props.data;
    if (songs.length != 0) {
        songs = props.data.map((song) => {
            return (
                <div className="row">
                    <div className="col-6">
                        <li key={song['song_id']}>
                            <SongLink handleClick={props.handleClick} 
                                song_artist={song['song_artist']} 
                                song_title={song['song_title']} />
                        </li>
                    </div>
                </div>
            )
            });
        }
    return (
        <div className="row">
            <div className="col-6">
                <ul>{songs}</ul>
            </div>
        </div>
    )
    
}