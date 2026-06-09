import React from 'react'
import Home from './pages/Home'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './store/userSlice'
import Generate from './pages/Generate'

export const serverUrl = 'http://localhost:8000'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<Home />} />
      <Route path='/generate' element={<Generate />} />
    </Route>
  )
)

function App() {

  const dispatch = useDispatch()
  useEffect(() => {
      const fetchUser = async () => {
        try {
          const result = await axios.get(serverUrl + '/api/v1/user/current-user', { withCredentials: true })
          console.log(result.data)
          dispatch(setUserData(result.data))
        } catch (error) {
          console.log(error)
          dispatch(setUserData(null))
        }
      }
      fetchUser()
    }, [])

  return (
    <RouterProvider router={router}>
    </RouterProvider>
  )
}

export default App
