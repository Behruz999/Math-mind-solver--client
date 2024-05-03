import './home.css'
import { useState } from 'react'
import { FaArrowRightLong } from "react-icons/fa6"
import { useNavigate } from 'react-router-dom'
import { play } from '../../player/play'

export const Home = () => {
  const [animationFinished, setAnimationFinished] = useState(false);
  const navigate = useNavigate()

  const handleAnimationEnd = () => {
    // Callback function to be called when the animation ends
    setAnimationFinished(true);
  };

  const next = () => {
    play()
    navigate('/second')
  }

  return (
    <>
      <div className="home_wrapper">
        <div className={`animated-title ${animationFinished ? 'revealed' : ''}`} onAnimationEnd={handleAnimationEnd}>
          <div className="text-top">
            <div>
              <span>Practice</span>
              <span>Math skills</span>
            </div>
          </div>
          <div className="text-bottom">
            <div>
              <span>with</span>
              <span>MMS</span>
            </div>
          </div>
        </div>
        <button onClick={next} className={`animated-button-advanced ${animationFinished ? 'revealed' : ''}`}>
          Let's Get Started <FaArrowRightLong className={`${animationFinished && 'home_arrow_icon'} `} />
        </button>
      </div>
    </>
  )
}
