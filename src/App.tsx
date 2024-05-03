import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { MainRouter } from './routes/router'

function App() {
  return (
    <>
      <BrowserRouter>
        <MainRouter />
      </BrowserRouter>
    </>
  )
}

export default App
