import useTitle from './hooks/useTitle'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import NotFoundPage from './components/NotFoundPage'
import Public from './components/Public'
import Register from './components/Register'
import Login from './features/auth/Login'
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import ProfileCompletionPage from './features/users/ProfileCompletionPage'
import UserProfile from './features/users/UserProfile'
import PostList from './features/posts/PostList'
import PostPage from './features/posts/PostPage'
import CreatePostForm from './features/posts/CreatePostForm'
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import UserPostList from './features/users/UserPostList'
import UserPostPage from './features/users/UserPostPage'

function App() {
  useTitle('FlexiBlog')

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />

        <Route path="register" element={<Register />} />

        <Route path="login" element={<Login />} />

        <Route path="posts" element={<PostList />} />
        <Route path="/posts/:postId" element={<PostPage />} />

        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            <Route path="dash" element={<DashLayout />}>

              <Route index element={<Welcome />} />

              <Route path="post/user/:userId">
                <Route index element={<UserPostList />} />
              </Route>

              <Route path="post/user/:userId/:postId">
                <Route index element={<UserPostPage />} />
              </Route>

              <Route path="users">
                <Route index element={<UserProfile />} />
              </Route>

              <Route path="profile-completion">
                <Route index element={<ProfileCompletionPage />} />
              </Route>

              <Route path="post/create">
                <Route index element={<CreatePostForm />} />
              </Route>

            </Route>{/* End Dash */}
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
