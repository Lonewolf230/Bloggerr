export default function Follower({ username }) {
    return (
        <>
            <img 
                src={`https://bloggers3bucket.s3.ap-south-1.amazonaws.com/profilePics/${username}.jpg`} 
                alt={`${username}'s profile`}
                className="follower-avatar"
                onError={(e) => {
                    // Fallback to a default avatar if image fails to load
                    e.target.src = `https://ui-avatars.com/api/?name=${username}&background=0077cc&color=fff&size=60&bold=true`;
                }}
            />
            <p className="follower-username">{username}</p>
        </>
    );
}