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