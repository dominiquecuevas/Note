class App extends React.Component {
    constructor() {
        super();
        this.state = {
            title: "",
            artist: "",
            lyrics: "",
            video: "",
            songDataLoaded: false,
            fragment: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
    }

    handleSubmit(evt) {
        evt.preventDefault();
        const q = $(evt.target).serialize();

        $.get(`/api/search?${q}`, (res) => {
            this.setState({
                title: res.song_title, 
                artist: res.song_artist,
                lyrics: res.lyrics,
                video: `https://www.youtube.com/embed/${res.video_url}?autoplay=0`,
                songDataLoaded: true
            });
        });
    }

    handleSelection(evt) {
        evt.preventDefault();
        this.setState({
            fragment: $.selection()
        });

    }

    render() {
        let displayData = { display: 'none' };
        if (this.state.songDataLoaded) {
            displayData = null;
        }

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="q" placeholder="Artist, Song" />
                    <input type="submit" value="Search" />
                </form>

                <div className="song-data" style={displayData}>
                    <iframe src={this.state.video} type="text/html" frameBorder="0" width="640" height="360"></iframe>
                    <h2>{this.state.title}</h2>
                    <h3>{this.state.artist}</h3>
                    <p dangerouslySetInnerHTML={{__html: this.state.lyrics}}></p>
                    <p>
                    <button onClick={this.handleSelection} id="get-fragment">Copy song fragment</button>
                    </p>
                    <form action="/save" method="POST">
                        Fragment
                        <div id="fragment">
                            {this.state.fragment}
                        </div>
                        Annotation <textarea name="annotation"></textarea><br />

                        <input type="hidden" name="fragment" value={this.state.fragment} />
                        <input type="hidden" name="song_title" value={this.state.title} />
                        <input type="hidden" name="song_artist" value={this.state.artist} />
                        <input type="hidden" name="lyrics" value={this.state.lyrics} />
                        <input type="hidden" name="video_url" value={this.state.video} />
                        <input type="submit" value="Save" />
                    </form>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.querySelector('#root'));