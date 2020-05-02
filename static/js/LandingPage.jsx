function StaffSuggestions(props) {
    const staffPicks = [{'key': 0, 'song_artist': 'Adele', 'song_title': 'Send My Love (To Your New Lover)'},
                        {'key': 1, 'song_artist': 'Beyoncé', 'song_title': 'Run the World (Girls)'},
                        {'key': 2, 'song_artist': 'Halsey', 'song_title': 'Graveyard'}, 
                        {'key': 3, 'song_artist': 'Paramore', 'song_title': 'The Only Exception'}, 
                        {'key': 4, 'song_artist': 'Selena', 'song_title': 'Dreaming of You'}, 
                        {'key': 5, 'song_artist': 'SHAED', 'song_title': 'Trampoline'}, 
                        {'key': 6, 'song_artist': 'Sia', 'song_title': 'Chandelier'}, 
                        {'key': 7, 'song_artist': 'Tierra Whack', 'song_title': 'Hungry Hippo'}, 
                        ]
    return (
        <div>
            <ul>
                <br />
                <b>Staff picks:</b>
                {staffPicks.map((song) => {
                    return (<li key={song.key}><SongLink handleClick={props.handleClick} song_artist={song.song_artist} song_title={song.song_title} /></li>)
                    })
                }

            </ul>
        </div>
    )
}

class LandingPage extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col-6">
                    <StaffSuggestions styling={this.props.styling} handleClick={this.props.handleClick} />
                </div>
            </div>)
    }
}