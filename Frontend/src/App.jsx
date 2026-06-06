import React from 'react'
import Home from './pages/Home'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<Home />} />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router}>
    </RouterProvider>
  )
}

export default App
