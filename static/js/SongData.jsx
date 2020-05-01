function SongData(props) {
    return (
        <div className="row" id="song-data">

            <div className="table container-t col-5">
                <div className="table-row header">
                    <h2>{props.title}</h2>
                    <h3>{props.artist}</h3>
                    <p>
                        <button onClick={props.handleSelection} id="get-fragment" className="btn btn-primary" data-toggle="modal" data-target="#modal">Highlight lyrics to annotate and click me!</button>
                    </p>
                </div>

                <div className="table-row body">
                    <div className="body-content-wrapper">
                        <div className="body-content">
                            <Lyrics dangerouslySetInnerHTML={{__html: props.lyrics}} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col">

                <iframe src={`https://www.youtube.com/embed/${props.video}?autoplay=0`} type="text/html" frameBorder="0" width="640" height="360"></iframe>
                <form onSubmit={props.handleFormSubmit} id="save">
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
                                        {props.fragment}
                                    </div>
                                    <label for="annotation">Annotation</label>
                                    <textarea className="form-control" name="annotation" value={props.annotation} onChange={props.handleChange} /><br />

                                    <input type="hidden" name="fragment" value={props.fragment} />
                                    <input type="hidden" name="song_title" value={props.title} />
                                    <input type="hidden" name="song_artist" value={props.artist} />
                                    <input type="hidden" name="lyrics" value={props.lyrics} />
                                    <input type="hidden" name="video_url" value={props.video} />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <input type="submit" className="btn btn-primary" value="Save" />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <Annotations annotationsList={props.annotationsList} />
            </div>
        </div>
    )
}