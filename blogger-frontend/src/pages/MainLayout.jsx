import { Outlet } from 'react-router-dom';
import './Home.css';
import Searchbar from '../components/Searchbar.jsx';
import { NavLink } from 'react-router-dom';
import { RiAccountCircleFill } from "react-icons/ri";
import { IoIosNotifications } from "react-icons/io";
import { MdEditSquare } from "react-icons/md";

export default function MainLayout() {

    const isActive={
        "marginBottom":"10px",
        "textDecoration":"underline"
    }

    return (
        <>
            <nav id="navbar-home">
                <div className="navbar-left">
                    <NavLink to="/home" className='isNotActive' style={{ "textDecoration": "none", "paddingRight": "10px" }}>
                       <strong><p>Blogger</p></strong> 
                    </NavLink>
                    <Searchbar />
                </div>
                <div className="navbar-right">
                    {/* <NavLink to="/notifications" style={{ "textDecoration": "none" }} className={({isActive})=>(isActive?"isActive":"isNotActive")}>
                        <IoIosNotifications size={30} />
                    </NavLink> */}
                    <NavLink to="/writepost"  style={{ "textDecoration": "none" }} className={({isActive})=>(isActive?"isActive":"isNotActive")}>
                        <MdEditSquare size={30} />
                    </NavLink>
                    <NavLink to="/profile" style={{ "textDecoration": "none" }} className={({isActive})=>(isActive?"isActive":"isNotActive")}>
                        <RiAccountCircleFill size={30} />
                    </NavLink>
                </div>
            </nav>
            <main>
                <Outlet />
            </main>
        </>
    );
}
