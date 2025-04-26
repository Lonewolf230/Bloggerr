

export default function Follower({username}){

    return(
        <>
            <div style={{"display":"flex",
                        "justifyContent":"space-evenly",}}>
                <img src={`https://bloggers3bucket.s3.ap-south-1.amazonaws.com/profilePics/${username}.jpg`} alt="" style={{ width: 50, height: 50, borderRadius: '50%' }} />
                <p>{username}</p>
            </div>
            <hr />
        </>
    )
}