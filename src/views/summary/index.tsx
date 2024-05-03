import './summary.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useSound from 'use-sound'
import press_button_mp3 from '/press_button1.wav'

interface summariesProps {
  examplesCount: number
  min: number
  sec: number
  totalCorrect: number
  percentCorrect: string
  summaries: object[]
}

interface summaryProps {
  answer: number | string
  isCorrect: boolean | string
  num1: number | string
  num2: number | string
  operation: string
  userAnswer: number | string
}

export const Summary = () => {

  const [play] = useSound(press_button_mp3);
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);
  const [shadowPosition, setShadowPosition] = useState({ x: 0, y: 0 });
  const [topbarPadding, setTopbarPadding] = useState(10); // Initial padding value
  const [scrollY, setScrollY] = useState(0); // State to track scroll position
  const [isReview, setIsReview] = useState<boolean>(false);
  const summaries: summariesProps = JSON.parse(localStorage.getItem('summary'))

  const handleMouseMove = (e: any) => {
    setShadowPosition({ x: e.nativeEvent.offsetX - 100, y: e.nativeEvent.offsetY - 100 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseMove1 = (e: any) => {
    setShadowPosition({ x: e.nativeEvent.offsetX - 100, y: e.nativeEvent.offsetY - 100 });
  };

  const handleMouseEnter1 = () => {
    setIsHovered1(true);
  };

  const handleMouseLeave1 = () => {
    setIsHovered1(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Update scrollY state with the current scroll position
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // No dependencies, runs only once

  useEffect(() => {
    // When scrollY is less than 50, set padding to 15px, otherwise set it to 5px
    setTopbarPadding(scrollY < 50 ? 15 : 5);
  }, [scrollY]); // Re-run when scrollY changes

  const next = (path: boolean) => {
    play()
    !path && setIsReview(!isReview)
    if (path) {
      navigate('/second')
      localStorage.removeItem('ex')
      localStorage.removeItem('summary')
    }
  }

  return (
    <>
      <div className="summary_wrapper">
        {
          scrollY >= 400 &&
          <div className="topbar" style={{ padding: `${topbarPadding}px 5px` }}>
            <div className="top_left">
              <h3 className='summ_correct_count'>{summaries?.examplesCount}/{summaries?.totalCorrect}</h3>
            </div>
            <div className="top_right">
              <h3 className='summ_correct_percent'>{summaries.percentCorrect}</h3>
            </div>
            <div className="top_right">
              <h3 className='summ_correct_percent'>{`${summaries.min} min ${summaries.sec} sec`}</h3>
            </div>
          </div>
        }

        <div className="container py-5">
          <div className="summary_top">
            <div className="row pb-5">
              <div className="col-md-12 sum_kol12">
                <img className='summary_img' src={
                  summaries?.percentCorrect == '0.00%' ?
                  "/rag-doll-with-red-pencil-checklist-fotor-bg-remover-20240430201451.png" :
                  "/rag-doll-with-checklist-green-pencil-fotor-bg-remover-20240430201428.png"
                } alt="0" />

                <div className="summary_middle_place">
                  <h3 className='sum_total'>Total: {summaries?.examplesCount}/{summaries?.totalCorrect}</h3>
                  <h3 className='sum_common'>Common: {summaries?.percentCorrect}</h3>
                </div>

                <div className="sum_finish_place">
                  <button
                    className={`start_btn ${isHovered ? 'hovered' : ''}`}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => next(false)}
                    style={{ textTransform: 'capitalize' }}
                  >
                    review
                    {isHovered && (
                      <div
                        className="shadow"
                        style={{ left: shadowPosition.x, top: shadowPosition.y }}
                      ></div>
                    )}
                  </button>
                  <button
                    className={`start_btn ${isHovered ? 'hovered' : ''}`}
                    onMouseMove={handleMouseMove1}
                    onMouseEnter={handleMouseEnter1}
                    onMouseLeave={handleMouseLeave1}
                    onClick={() => next(true)}
                    style={{ textTransform: 'capitalize', marginLeft: '30px' }}
                  >
                    restrart
                    {isHovered1 && (
                      <div
                        className="shadow"
                        style={{ left: shadowPosition.x, top: shadowPosition.y }}
                      ></div>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {
            isReview &&
            <div className="row">
              {
                summaries?.summaries?.map((s: summaryProps, i: number) => {
                  return (
                    <>
                      <div className="col-md-4 sum_kol3" key={i}>
                        <div className="sum_question_place">
                          <h4 className='sum_question'>{s?.num1} {s?.operation == 'addition' ? '+'
                            : s?.operation == 'subtraction' ? '-'
                              : s?.operation == 'multiplication' ? 'x' : ':'} {s?.num2} = </h4>
                          ?
                        </div>
                        <div className="xyz">
                          <h5 className='sum_your_answer'>your answer: </h5>
                          <h5 className='sum_correct_answer'>{s?.userAnswer}</h5>
                        </div>
                        {
                          s?.isCorrect == false &&
                          <div className="xyz1">
                            <h5 className='sum_ball_label'>answer: </h5>
                            <h5 className='sum_ball'>{s?.answer}</h5>
                          </div>
                        }
                        <div className="xyz2">
                          <h5 className='sum_ball_label'>ball: </h5>
                          <h5 className='sum_ball'>{s?.isCorrect ? 1 : 0}</h5>
                        </div>
                      </div>
                    </>
                  )
                })
              }
            </div>
          }

        </div>
      </div>
    </>
  )
}
