function AnnotatedSongsPage(props) {
    const [data, setData] = useState([]);
    // TODO: might have to put state on app class
    async function fetchAnnotations() {
        const results = await fetch('/annosongs.json')
            .then(function(resp) {
                return resp.json();
            });
        setData(results);
    }
    useEffect(() => {
        fetchAnnotations();
    }, []);

    let songs = data
    if (songs.length != 0) {
        songs = data.map((song) => {
            return (
            <li><SongLink handleClick={props.handleClick} song_artist={song['song_artist']} song_title={song['song_title']} /></li>
            )
            });
        }
    return (<ul style={props.styling}>{songs}</ul>)
    
}