function StaffSuggestions(props) {
    const staffPicks = [{'song_artist': 'Adele', 'song_title': 'Send My Love (To Your New Lover)'},
                        {'song_artist': 'Beyoncé', 'song_title': 'Run the World (Girls)'},
                        {'song_artist': 'Halsey', 'song_title': 'Graveyard'}, 
                        {'song_artist': 'Paramore', 'song_title': 'The Only Exception'}, 
                        {'song_artist': 'Selena', 'song_title': 'Dreaming of You'}, 
                        {'song_artist': 'SHAED', 'song_title': 'Trampoline'}, 
                        {'song_artist': 'Sia', 'song_title': 'Chandelier'}, 
                        {'song_artist': 'Tierra Whack', 'song_title': 'Hungry Hippo'}, 
                        ]
    return (
        <div style={props.styling}>
            <ul>
                <br />
                <b>Staff picks:</b>
                {staffPicks.map((song) => {
                    return (<li><SongLink handleClick={props.handleClick} song_artist={song.song_artist} song_title={song.song_title} /></li>)
                    })
                }

            </ul>
        </div>
    )
}

class LandingPage extends React.Component {
    render() {
        return (<StaffSuggestions styling={this.props.styling} handleClick={this.props.handleClick} />)
    }
}