function AccountPage(props) {
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
                    <tr key={anno.anno_id}>
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
        <div className="row">
            <div className="col-6">
                <b>Name:</b> {userName}<br /><br />
                <b>Email:</b> {userEmail}<br /><br />
                <b>Your Annotations:</b>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Song</th>
                                <th>Lyrics Fragment</th>
                                <th>Annotation</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userAnnoList && userAnnoListMapped}
                        </tbody>
                    </table>
            </div>
        </div>
    )
}