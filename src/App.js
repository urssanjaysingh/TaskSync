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
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import CreatePostPage from './features/posts/CreatePostPage';
import ViewPost from './features/posts/ViewPost'
import CreateTaskPage from './features/tasks/CreateTaskPage'
import ViewTask from './features/tasks/ViewTask'

function App() {
  useTitle('TaskSync')

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />

        <Route path="register" element={<Register />} />

        <Route path="login" element={<Login />} />

        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            <Route path="dash" element={<DashLayout />}>

              <Route index element={<Welcome />} />

              <Route path="users">
                <Route index element={<UserProfile />} />
              </Route>

              <Route path="profile-completion">
                <Route index element={<ProfileCompletionPage />} />
              </Route>

              <Route path="create-post" element={<CreatePostPage />} />
              <Route path="post/all" element={<ViewPost />} />

              <Route path="create-task" element={<CreateTaskPage />} />
              <Route path="task/all" element={<ViewTask />} />

            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
