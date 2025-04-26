export default function ConfirmBox({text,confirmFunction,cancelFunction}) {
    return (
        <div style={{
            position: 'fixed',  // Overlay position
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection:'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.5)', // Semi-transparent background
            zIndex: 9999, // Ensure it overlays everything
        }}>
            <div style={{display:"flex",backgroundColor:"white",
                flexDirection:"column",padding:"20px",border:"none",
                borderRadius:"8px",justifyContent:"center",alignItems:"center"}}>
                <div style={{textAlign:"center"}}>
                    <h3>Are you sure you want to {text}</h3>    
                </div>            
                <div style={{display:"flex",gap:"20px"}}>
                    <button style={{color:"white",
                                padding:"8px 12px",
                                backgroundColor:"red",
                                fontWeight:"500",
                                border:"none",
                                borderRadius:"6px",
                                cursor:"pointer"}
                                } onClick={confirmFunction}>Yes</button>
                    <button style={{color:"white",
                                padding:"8px 12px",
                                backgroundColor:"green",
                                fontWeight:"500",
                                border:"none",
                                borderRadius:"6px",
                                cursor:"pointer"}}
                                onClick={cancelFunction}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
