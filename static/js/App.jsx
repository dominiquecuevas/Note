const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            title: "",
            artist: "",
            lyrics: "",
            video: "",
            fragment: "",
            annotation: "",
            showLoadingGif: false,
            hits: "",
            searchHits: false,
            annoSongs: [],
            userData: {},
            annotationsList: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDeleteAnnotation = this.handleDeleteAnnotation.bind(this);

    }

    async fetchAnnotations() {
        fetch('/api/annotated-songs')
            .then((res) => res.json())
            .then((data) => {
                this.setState({annoSongs: data})
            });
    }

    async fetchUserData() {
        fetch('/api/account')
            .then(res => res.json())
            .then(data => {
                this.setState({userData: data})
            });
    }

    componentDidMount() {
        this.fetchAnnotations();
        this.fetchUserData();
    }

    async handleSubmit(evt) {
        evt.preventDefault();
        const q = $(evt.target).serialize();
        this.setState({
                        showLoadingGif: true,
                        searchHits: false,
                     });

        await fetch(`/api/search?${q}`)
            .then(res => res.json())
            .then((data) => {
            let songs = [];
            for (const song of data.songs) {
                songs.push(<li key={song['song_title']}><SongLink handleClick={this.handleClick} song_artist={song['song_artist']} song_title={song['song_title']} /></li>)
            };
            this.setState({
                            hits: songs,
                            showLoadingGif: false,
                            searchHits : true,
                            video: ""
                            });
            });
    }

    async handleClick(evt) {
        const song_artist = $(evt.target).data('song_artist');
        const song_title = $(evt.target).data('song_title');
        this.setState({showLoadingGif: true});

        await fetch(`/api/song-data?song_artist=${song_artist}&song_title=${song_title}`)
        .then(res => res.json())
        .then((data) => {
            if (data.song_annos.length) {
                let annotationsList = data.song_annos;
                this.setState({ annotationsList: annotationsList });
            } else {
                this.setState({annotationsList: []})
            };

            this.setState({
                title: data.song_title, 
                artist: data.song_artist,
                lyrics: data.lyrics,
                video: data.video_url,
                showLoadingGif: false,
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

        await fetch(`/api/song-data?song_artist=${this.state.artist}&song_title=${this.state.title}`)
            .then(res => res.json())
            .then(res => {
                this.setState({annotationsList: res.song_annos});
            })
            .then(console.log('set new annotationsList state!:', this.state.annotationsList))
            ;
        this.setState({fragment: "", annotation: ""});

        this.setState({showLoadingGif: false});
        await this.fetchAnnotations();
        await this.fetchUserData();


    }

    async handleDeleteAnnotation(evt) {
        // TODO: make it a modal for confirmation
        evt.preventDefault();

        const anno_id = $(evt.target).data('anno_id');

        await fetch(`/delete-annotation/${anno_id}`, 
            {method: 'DELETE'});

        await this.fetchUserData();
        await this.fetchAnnotations();
    }
    render() {
        return (
            <Router>
                <NavBar />
                <br />
                <div className="container-fluid">
                    
                    <div className="row">
                        <div className="col">
                            <Search onSubmit={this.handleSubmit}/>
                            <LoadingGif styling={(this.state.showLoadingGif ? {visibility: 'visible'} : {visibility: 'hidden'})} />
                        </div>
                    </div>
                    {this.state.searchHits && <Redirect to="/search" />}
                    <Switch>
                        <Route exact path="/">
                            <LandingPage handleClick={this.handleClick} />
                        </Route>
                        <Route exact path="/search">
                            <SearchResultsPage results={this.state.hits} />
                        </Route>
                        
                        <Route exact path="/annotated-songs">
                            <AnnotatedSongsPage data={this.state.annoSongs} 
                                            handleClick={this.handleClick} />
                        </Route>
                        <Route exact path="/account">
                            <AccountPage userData={this.state.userData} 
                                            handleClick={this.handleClick} 
                                            handleDeleteAnnotation={this.handleDeleteAnnotation} />
                        </Route>

                        <Route path="/song-data/:artist/:title" render={(props) => <SongData artist={this.state.artist} 
                                                                                    title={this.state.title}
                                                                                    lyrics={this.state.lyrics}
                                                                                    video={this.state.video}
                                                                                    fragment={this.state.fragment}
                                                                                    annotation={this.state.annotation}
                                                                                    annotationsList={this.state.annotationsList}
                                                                                    handleSelection={this.handleSelection}
                                                                                    handleChange={this.handleChange}
                                                                                    handleFormSubmit={this.handleFormSubmit}
                                                                                    {...props}/>} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

ReactDOM.render(<App />, document.querySelector('#root'));

