export default function ConfirmBox({ text, confirmFunction, cancelFunction }) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.4)', // dark overlay
            zIndex: 9999,
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                padding: "25px 30px",
                borderRadius: "16px",
                background: "white",
                boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                maxWidth: "400px",
                width: "90%",
                textAlign: "center"
            }}>
                <h3 style={{
                    marginBottom: "20px",
                    color: "#1a1a1a",
                    fontWeight: "700"
                }}>
                    Are you sure you want to {text}?
                </h3>

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                    marginTop: "10px"
                }}>
                    <button
                        onClick={confirmFunction}
                        style={{
                            flex: 1,
                            padding: "10px 16px",
                            border: "none",
                            borderRadius: "12px",
                            cursor: "pointer",
                            background: "linear-gradient(135deg, #0077cc 0%, #005fa3 100%)",
                            color: "white",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            boxShadow: "0 4px 12px rgba(0, 119, 204, 0.3)",
                            transition: "all 0.3s ease"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)"}
                        onMouseOut={(e) => e.currentTarget.style.background = "linear-gradient(135deg, #0077cc 0%, #005fa3 100%)"}
                    >
                        Confirm
                    </button>

                    <button
                        onClick={cancelFunction}
                        style={{
                            flex: 1,
                            padding: "10px 16px",
                            border: "none",
                            borderRadius: "12px",
                            cursor: "pointer",
                            background: "#e2e8f0",
                            color: "#1a1a1a",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            transition: "all 0.3s ease"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "#cbd5e1"}
                        onMouseOut={(e) => e.currentTarget.style.background = "#e2e8f0"}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
