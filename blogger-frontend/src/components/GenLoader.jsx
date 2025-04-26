import { InfinitySpin } from 'react-loader-spinner';

export default function GenLoader({text}) {
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
            <InfinitySpin
                visible={true}
                width="200"
                color="blue"
                ariaLabel="infinity-spin-loading"
            />
            <h5 style={{color:'whitesmoke'}}>{text}</h5>
        </div>
    );
}
