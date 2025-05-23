import {BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import WritePost from './pages/WritePost';
import MainLayout from './pages/MainLayout';
import Error from './components/Error.jsx'
import EditProfile from './pages/EditProfile.jsx';
import Notifications from './pages/Notifications.jsx';
import Stats from './components/Stats.jsx';
import FollowersList from './components/FollowersList.jsx';
import FollowingList from './components/FollowingList.jsx';
import {BlogList} from './components/BlogView.jsx';
import DisplayBlog from './pages/DisplayBlog.jsx';
import { ToastProvider } from './misc/ToastManager.jsx';
import { SnackbarProvider } from './misc/SnackBarManager.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import VerifyAccountPage from './pages/VerifyAccountPage.jsx';
import { useAuth } from './misc/AuthContext.jsx';
import ViewProfile from './pages/ViewProfile.jsx';

function App() {

  const {currentUser}=useAuth()
  const isAuthenticated=currentUser && currentUser.isAuthenticated

  

  return (
    <>
    <SnackbarProvider> 
      <ToastProvider>
        <Router>
          <Routes >
              <Route path='/' element={isAuthenticated? <Navigate to="/home" replace={true}/>:<AuthPage/>} />
              <Route element={<VerifyAccountPage/>} path='/verify'/>
              <Route element={<MainLayout/>} errorElement={<Error/>}>
                <Route 
                  path="/home" 
                  element={
                    <ProtectedRoute>                                            
                      <Home/>
                    </ProtectedRoute>
                  } 
                />
                <Route element={<ProtectedRoute><WritePost/></ProtectedRoute>} path='/writepost'/>
                <Route element={<ProtectedRoute><EditProfile/></ProtectedRoute>} path='/profile'>
                  <Route index element={<Stats/>} />
                  <Route element={<FollowersList/>} path='followers'/>
                  <Route element={<FollowingList/>} path='following'/>
                  <Route element={<BlogList/>} path='posts'/>
                </Route>
                <Route element={<ProtectedRoute><ViewProfile/></ProtectedRoute>} path='/otherProfile/:username'>
                  <Route index element={<Stats/>} />
                  <Route element={<FollowersList/>} path='followers/:username'/>
                  <Route element={<FollowingList/>} path='following/:username'/>
                  <Route element={<BlogList/>} path='posts/:username'/>
                </Route>
                <Route element={<DisplayBlog/>} path='/blog/:blogId' />
                {/* <Route element={<Notifications/>} path='/notifications'/> */}
              </Route>
          </Routes>
        </Router>
      </ToastProvider>
      </SnackbarProvider> 
    </>
  )
}

export default App
