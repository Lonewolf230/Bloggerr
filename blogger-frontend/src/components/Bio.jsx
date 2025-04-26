

export default function Bio({aboutText}){

    return(
        <>
            

            <div >
                <h1 style={{
                    "position":"relative",
                    "left":"0"
                }}>About Myself</h1>
                <p>
                    {aboutText}
                </p>
            </div>
        </>
    )
}