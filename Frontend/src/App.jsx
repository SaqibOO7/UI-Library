import React, { useState } from 'react'
import Home from './pages/Home'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setAllComponents, setAllUsers, setUserData } from './store/userSlice'
import Generate from './pages/Generate'
import AdminDashboard from './pages/AdminDashboard'
import AllComponents from './pages/AllComponents'
import MyComponents from './pages/MyComponents'
import Pricing from './pages/Pricing'
import SubmitForApproval from './pages/SubmitForApproval'
import MySubmissions from './pages/MySubmissions'
import AdminReview from './pages/AdminReview'

export const serverUrl = 'http://localhost:8000'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<Home />} />
      <Route path='/generate' element={<Generate />} />
      <Route path='/admin' element={<AdminDashboard />} />
      <Route path='/components' element={<AllComponents />} />
      <Route path='/my-components' element={<MyComponents />} />
      <Route path='/pricing' element={<Pricing />} />

      <Route path='/submit-for-approval' element={<SubmitForApproval />} />
      <Route path='/my-submissions' element={<MySubmissions />} />
      <Route path='/admin-review' element={<AdminReview />} />
    </Route>
  )
)

function App() {

  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)

  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(serverUrl + '/api/v1/user/current-user', { withCredentials: true })
        console.log(result.data)
        dispatch(setUserData(result.data))
        setAuthChecked(true)

      } catch (error) {
        console.log(error)
        dispatch(setUserData(null))
        setAuthChecked(true)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (!userData) return;
    const fetchAllUsers = async () => {
      try {
        const usersRes = await axios.get(serverUrl + "/api/v1/user/all-users", { withCredentials: true })
        dispatch(setAllUsers(usersRes.data))
        console.log(usersRes.data)

      } catch (error) {
        console.log(error)
        dispatch(setAllUsers(null))
      }
    }

    const fetchAllComponents = async () => {
      try {
        const componentsRes = await axios.get(serverUrl + "/api/v1/component/all-components", { withCredentials: true })
        dispatch(setAllComponents(componentsRes.data))
        console.log(componentsRes.data)
      } catch (error) {
        console.log(error)
        dispatch(setAllComponents(null))

      }
    }

    fetchAllComponents()
    fetchAllUsers()
  }, [userData, dispatch])

  return (
    <>
      {
        !authChecked && <div className='fixed top-0 left-0 w-full h-1 bg-[#35ebff] animate-pulse z-50'>

        </div>
      }
      <RouterProvider router={router}>
      </RouterProvider>
    </>
  )
}

export default App
