import { useState } from "react";
import "./EditProfileForm.css";
import { s3Client } from "../../s3config";
import { Upload } from "@aws-sdk/lib-storage";
import { userAPI } from "../api/userAPI";

export default function EditProfileForm({ showForm, setShowForm, username,onUpdateSuccess }) {
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [aboutText, setAboutText] = useState("");
    const [updating, setUpdating] = useState(false);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePicFile(file); 
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result); 
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadToS3 = async (file, username) => {
        const key = `profilePics/${username}.jpg`;

        try {
            const upload = new Upload({
                client: s3Client,
                params: {
                    Bucket: import.meta.env.VITE_BUCKET,
                    Key: key,
                    Body: file,
                    ContentType: file.type
                }
            });

            await upload.done();
            return `https://${import.meta.env.VITE_BUCKET}.s3.${import.meta.env.VITE_REGION}.amazonaws.com/${key}`;
        } catch (err) {
            console.error("Error uploading to S3:", err);
            throw err;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setUpdating(true);

        try {
            let profilePicUrl = null;

            if (profilePicFile) {
                profilePicUrl = await uploadToS3(profilePicFile, username);
            }
            const body={
                profilePic:profilePicUrl,
                about:aboutText
            }

            const data = await userAPI.editProfile(body);
            console.log("API Response:", data);
            if (data.success || data.message==="Profile updated successfully") {
                alert("Profile updated successfully!");
                setShowForm(false);
                if(onUpdateSuccess){
                    onUpdateSuccess();
                }
            } else {
                alert(`Success: ${data.message}`);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred while updating your profile.");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
        }}>
            <div className="edit-profile-form">
                <form onSubmit={handleSubmit}>
                    <div className="profile-pic-container">
                        <div style={{display:"flex",
                                    justifyContent:"space-between",
                                    width:"100%",
                                    alignItems:"center",
                                    position:"relative"
                        }}>
                            <label htmlFor="profilePic">Profile Picture</label>
                            <label htmlFor="" style={{backgroundColor:"red",
                                                    cursor:"pointer",
                                                    position:"absolute",
                                                    right:0,
                                                    padding:"2px 8px",
                                                    borderRadius:"5px",
                                                    color:"white"}}
                                                    onClick={()=>setShowForm(false)}>x</label>
                        </div>
                        <input
                            type="file"
                            id="profilePic"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {profilePic && <img src={profilePic} alt="Profile Preview" className="profile-preview" />}
                    </div>

                    <div className="about-section">
                        <label htmlFor="about">About Yourself</label>
                        <textarea
                            id="about"
                            placeholder="Type here..."
                            rows="5"
                            value={aboutText}
                            onChange={(e) => setAboutText(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="save-button" disabled={updating}>
                        {updating ? "Updating..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
