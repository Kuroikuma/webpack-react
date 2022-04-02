import { useState } from 'react'
import './hola.css'
const Home = () => {
  const [visibility, setVisibility] = useState(false)

  const toggleVisibility = () => {
    setVisibility(!visibility)
  }
  return (
    <div className="app">
      <button onClick={toggleVisibility} className="button">
        set visibility
      </button>
      <div
        className={visibility ? `container container-visibility` : 'container'}
      >
        <h1>Hola Mundo</h1>
      </div>
    </div>
  )
}

export default Home
