function NavBar(props) {
    return (
        <nav id="nav" className="navbar sticky-top navbar-light bg-light justify-content-start">
        <div id="note"><a className="navbar-brand" href="/"><span id="logo">♫</span> <b>Note</b>
            <br />
            <span id="slogan">Lyrics Annotator</span>
            </a>
        </div> | 
        <a className="nav-link" onClick={props.handleAnnoSongs} href="/annosongs">Annotated Songs</a> |
        <a className="nav-link" onClick={props.handleUserAnnos} href="/user-annos">Account</a>
    </nav>
    )
}

function Search(props) {
    return (
        <form
        id="search"
        onSubmit={props.onSubmit}
        className="d-flex"
    >
        <input type="text" className="form-control mr-3" name="q" placeholder="Artist, Song, or Lyrics" />
        <input type="submit" className="btn btn-primary" value="Search" />
    </form>
    )
}

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

function Lyrics(props) {
    return (
        <div id="lyrics" dangerouslySetInnerHTML={props.dangerouslySetInnerHTML}></div>
    )
}

function AnnotatedSongs(props) {
    let songs = props.data
    if (songs.length != 0) {
        songs = props.data.map((song) => {
            return (
            <li><SongLink handleClick={props.handleClick} song_artist={song['song_artist']} song_title={song['song_title']} /></li>
            )
            });
        }
    return (<ul style={props.styling}>{songs}</ul>)
    
}

function UserAnnotations(props) {
    let userName = "";
    let userEmail = "";
    let userAnnoList = "";
    let userAnnoListMapped = "";
    if (Object.keys(props.userData).length != 0) {
        userName = props.userData.user_name;
        userEmail = props.userData.user_email;
        userAnnoList = props.userData.anno_list;
        if (userAnnoList.length != 0) {
            userAnnoListMapped = userAnnoList.map((anno) => {
                return (
                    <tr>
                        <td><SongLink handleClick={props.handleClick} song_artist={anno.song_artist} song_title={anno.song_title} /></td>
                        <td>{anno.song_fragment}</td>
                        <td>{anno.annotation}</td>
                        <td><a href="" data-anno_id={anno.anno_id} onClick={props.handleDeleteAnnotation}>delete annotation</a></td>
                    </tr>
                )
            }
            )
        }
    }
    return (
        <div style={props.styling}>
        <b>Name:</b> {userName}<br /><br />
        <b>Email:</b> {userEmail}<br /><br />
        <b>Your Annotations:</b>
            <table className="table table-striped table-bordered">
                <tr><th>Song</th><th>Lyrics Fragment</th><th>Annotation</th><th>Delete</th></tr>
                {userAnnoList && userAnnoListMapped}
            </table>
        </div>
    )
}

function LoadingGif(props) {
    return (
        <div className="loading-gif" style={props.styling}>
            <div>
                <img id="catGif" src="/static/img/nyancat.gif" />
            </div>
            <span>Loading...</span>
        </div>
    )
}

function Annotations(props) {
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

function SongLink(props) {
    return (
        <a onClick={props.handleClick} href="#" data-song_artist={props.song_artist} data-song_title={props.song_title}>{props.song_artist} - {props.song_title}</a>
    )
}

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            title: "",
            artist: "",
            lyrics: "",
            video: "",
            songDataLoaded: false,
            fragment: "",
            annotation: "",
            showLoadingGif: false,
            songSuggestions: true,
            hits: "",
            searchHits: false,
            annoSongs: [],
            annoSongsLoaded: false,
            userDataLoaded: false,
            userData: {},
            annotationsList: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleAnnoSongs = this.handleAnnoSongs.bind(this);
        this.handleUserAnnos = this.handleUserAnnos.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDeleteAnnotation = this.handleDeleteAnnotation.bind(this);

    }

    handleSubmit(evt) {
        evt.preventDefault();
        const q = $(evt.target).serialize();
        this.setState({
                        showLoadingGif: true
                     });

        $.get(`/api/search/hits?${q}`, (res) => {
            let songs = [];
            for (const song of res.songs) {
                // songs.push(<li><a onClick={this.handleClick} href="#">{song['song_artist']} - {song['song_title']}</a></li>)
                songs.push(<li><SongLink handleClick={this.handleClick} song_artist={song['song_artist']} song_title={song['song_title']} /></li>)
            };
            this.setState({
                            hits: songs,
                            showLoadingGif: false,
                            songSuggestions: false,
                            searchHits : true,
                            songDataLoaded: false,
                            annoSongsLoaded: false,
                            userDataLoaded: false,
                            video: ""
                            });
        });
    }

    handleAnnoSongs(evt) {
        evt.preventDefault();

        $.get('/annosongs.json', (res) => {
            this.setState({
                            annoSongs: res,
                            annoSongsLoaded: true,
                            songSuggestions: false,
                            searchHits : false,
                            songDataLoaded: false,
                            userDataLoaded: false,
                            video: ""
                            });
        });
    }

    handleUserAnnos(evt) {
        evt.preventDefault();

        $.get('/user-annos.json', (res) => {
            this.setState({
                            userData: res,
                            userDataLoaded: true,
                            songSuggestions: false,
                            searchHits : false,
                            songDataLoaded: false,
                            annoSongsLoaded: false,
                            video: "",
                            });

        });
    }

    handleClick(evt) {
        evt.preventDefault();
        const song_artist = $(evt.target).data('song_artist');
        const song_title = $(evt.target).data('song_title');
        this.setState({showLoadingGif: true});

        $.get(`/api/search?song_artist=${song_artist}&song_title=${song_title}`, (res) => {
            if (res.song_annos.length) {
                let annotationsList = res.song_annos;
                console.log('handleClick > res.song_annos', res.song_annos);
                this.setState({ annotationsList: annotationsList });
            } else {
                this.setState({annotationsList: []})
            };

            this.setState({
                title: res.song_title, 
                artist: res.song_artist,
                lyrics: res.lyrics,
                video: res.video_url,
                songDataLoaded: true,
                showLoadingGif: false,
                songSuggestions: false,
                searchHits: false ,
                annoSongsLoaded: false,
                userDataLoaded: false
            });
        });
    }

    handleSelection(evt) {
        evt.preventDefault();
        this.setState({
            fragment: $.selection()
        });

    }

    handleChange(evt) {
        this.setState({annotation: evt.target.value});
    }

    async handleFormSubmit(evt) {
        evt.preventDefault();

        $('#modal').modal('hide');
        this.setState({showLoadingGif: true});

        const formData = new FormData(document.getElementById('save'));

        await fetch('/save', {method: 'POST', body: formData})
            .then(console.log('saved!'));

        await fetch(`/api/search?song_artist=${this.state.artist}&song_title=${this.state.title}`)
            .then(res => res.json())
            .then(res => {
                this.setState({annotationsList: res.song_annos});
            })
            .then(console.log('set new annotationsList state!:', this.state.annotationsList))
            ;
        $("textarea").val("");

        this.setState({showLoadingGif: false});


    }

    async handleDeleteAnnotation(evt) {
        // TODO: make it a modal for confirmation
        evt.preventDefault();

        const anno_id = $(evt.target).data('anno_id');
        console.log('data-anno_id', anno_id);

        await fetch(`/user-annos-delete/${anno_id}`, 
            {method: 'DELETE'});

        this.handleUserAnnos(evt);

        await fetch('/annosongs.json')
            .then(res => res.json())
            .then(res => {
                this.setState({annoSongs: res})
            })
    }

    render() {
        let displayData = { display: 'none' };
        if (this.state.songDataLoaded) {
            displayData = null;
        };
        let displayAnnos = { display: 'none' };
        if (this.state.annotationsList.length) {
            displayAnnos = null;
        } else {
            displayAnnos = { display: 'none' };
        };
        let displaySuggestions = null;
        if (!this.state.songSuggestions) {
            displaySuggestions = { display: 'none' };
        };
        let displayHits = {display: 'none'};
        if (this.state.searchHits) {
            displayHits = null;
        };
        let displayAnnoSongs = {display: 'none'};
        if (this.state.annoSongsLoaded) {
            displayAnnoSongs = null;
        };
        let displayUserAnnos = {display: 'none'};
        if (this.state.userDataLoaded) {
            displayUserAnnos = null;
        };

        return (
            <div>
                <NavBar handleAnnoSongs={this.handleAnnoSongs} handleUserAnnos={this.handleUserAnnos} />
                <br />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <Search onSubmit={this.handleSubmit}/>
                            <LoadingGif styling={(this.state.showLoadingGif ? {visibility: 'visible'} : {visibility: 'hidden'})} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6">
                            <ul style={displayHits}>{this.state.hits}</ul>
                            <AnnotatedSongs styling={displayAnnoSongs} data={this.state.annoSongs} handleClick={this.handleClick} />
                            <UserAnnotations styling={displayUserAnnos} userData={this.state.userData} handleClick={this.handleClick} handleDeleteAnnotation={this.handleDeleteAnnotation} />
                            <StaffSuggestions styling={displaySuggestions} handleClick={this.handleClick} />
                        </div>
                    </div>

                    <div className="row" id="song-data" style={displayData}>

                        <div className="table container-t col-5">
                            <div className="table-row header">
                                <h2>{this.state.title}</h2>
                                <h3>{this.state.artist}</h3>
                                <p>
                                    <button onClick={this.handleSelection} id="get-fragment" className="btn btn-primary" data-toggle="modal" data-target="#modal">Highlight lyrics to annotate and click me!</button>
                                </p>
                            </div>

                            <div className="table-row body">
                                <div className="body-content-wrapper">
                                    <div className="body-content">
                                        <Lyrics dangerouslySetInnerHTML={{__html: this.state.lyrics}} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col">

                            <iframe src={`https://www.youtube.com/embed/${this.state.video}?autoplay=0`} type="text/html" frameBorder="0" width="640" height="360"></iframe>
                            <form onSubmit={this.handleFormSubmit} id="save">
                                <div className="form-group modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Input Annotation</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <label for="fragment">Fragment</label>
                                                <div className="form-control" id="fragment">
                                                    {this.state.fragment}
                                                </div>
                                                <label for="annotation">Annotation</label>
                                                <textarea className="form-control" name="annotation" onChange={this.handleChange}></textarea><br />

                                                <input type="hidden" name="fragment" value={this.state.fragment} />
                                                <input type="hidden" name="song_title" value={this.state.title} />
                                                <input type="hidden" name="song_artist" value={this.state.artist} />
                                                <input type="hidden" name="lyrics" value={this.state.lyrics} />
                                                <input type="hidden" name="video_url" value={this.state.video} />
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                <input type="submit" className="btn btn-primary" value="Save" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <Annotations styling={displayAnnos} annotationsList={this.state.annotationsList} />
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.querySelector('#root'));

