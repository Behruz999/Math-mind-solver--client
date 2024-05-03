import './example.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { play } from '../../player/play'
import LogError from '../../errorLogger/bugFixer'
import { URL } from '../../sets'
import axios from 'axios'

interface ExampleProps {
  num1: number | string;
  num2: number | string;
  operation: string;
  userAnswer: number;
}

interface exampleProps {
  num1: number | string
  num2: number | string
  operation: string
  userAnswer: string | number | null
}

interface timeProps {
  min: number | string
  sec: number | string
}

interface finishWorksProps {
  min: number | string
  sec: number | string
  userAnswers: ExampleProps[];
}

export const Example = () => {

  // let [sec, setSec] = useState(0);
  // let [min, setMin] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setSec((prevSec) => {
  //       if (prevSec === 59) {
  //         setMin((prevMin) => prevMin + 1); // Increment minutes when seconds reach 59
  //         return 0; // Reset seconds to 0
  //       } else {
  //         return prevSec + 1; // Increment seconds normally
  //       }
  //     });
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []); // Empty dependency array to run effect only once

  const navigate = useNavigate()
  const [time, setTime] = useState({ min: 0, sec: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [shadowPosition, setShadowPosition] = useState({ x: 0, y: 0 });
  const [topbarPadding, setTopbarPadding] = useState(10); // Initial padding value
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [finishWorks, setFinishWorks] = useState<finishWorksProps>({
    min: 0,
    sec: 0,
    userAnswers: []
  });
  const storedData = localStorage.getItem('ex');
  const examples = storedData ? JSON.parse(storedData) : null;

  const submit = async (finishTime: timeProps) => {
    try {
      finishWorks.min = finishTime.min
      finishWorks.sec = finishTime.sec
      const response = await axios.post(`${URL}/examples/check`, finishWorks)

      localStorage.setItem('summary', JSON.stringify(response?.data))
    } catch (err) {
      LogError(err)
    }
  }

  const handleMouseMove = (e: any) => {
    setShadowPosition({ x: e.nativeEvent.offsetX - 100, y: e.nativeEvent.offsetY - 100 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    const handleScroll = () => {

      // When scrollY is 0, set padding to 10px, otherwise set it to 15px
      setTopbarPadding(window.scrollY < 50 ? 15 : 5);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => {
        const nextSec = prevTime.sec === 59 ? 0 : prevTime.sec + 1;
        const nextMin = prevTime.sec === 59 ? prevTime.min + 1 : prevTime.min;
        return { min: nextMin, sec: nextSec };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const { min, sec } = time;

  // navigating next page after some execution
  const next = async (t: timeProps) => {
    play();
    const isAllResolved = finishWorks.userAnswers.every((item: exampleProps) => item.userAnswer != 0);

    if (finishWorks.userAnswers?.length !== examples?.length || !isAllResolved) {
      alert('All examples should be resolved!');
    } else {
      await submit(t)
      navigate('/summary');
      localStorage?.setItem('ex', JSON?.stringify(finishWorks.userAnswers));
    }
  };

  // Function to handle input change and update the userAnswer property of the example object
  const handleInputChange = (ex: exampleProps, newValue: number) => {
    setFinishWorks(prevFinishWorks => {
      // Clone the previous userAnswers array to avoid mutating state directly
      const updatedUserAnswers = [...prevFinishWorks.userAnswers];
      // Find the index of the example in userAnswers array
      const exampleIndex = updatedUserAnswers.findIndex(item => item.num1 === ex.num1 && item.num2 === ex.num2 && item.operation === ex.operation);
      // If example exists in userAnswers, update its userAnswer field; otherwise, push it to userAnswers array
      if (exampleIndex !== -1) {
        updatedUserAnswers[exampleIndex] = { ...updatedUserAnswers[exampleIndex], userAnswer: newValue };
      } else {
        updatedUserAnswers.push({ ...ex, userAnswer: newValue });
      }
      return { min: time.min, sec: time.sec, userAnswers: updatedUserAnswers };
    });
  };


  // Debounce function to delay execution of handleInputChange
  const debounce = (fn: Function, delay: number) => {
    let timerId: number;
    return function (...args: any[]) {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  // Debounced version of handleInputChange with 500ms delay
  const debouncedHandleInputChange = debounce(handleInputChange, 500);

  return (
    <>
      <div className="example_wrapper">
        <div className="topbar" style={{ padding: `${topbarPadding}px 5px` }}>
          <div className="top_left">
            <h3 className='not_refresh'>Please, don't refresh the page</h3>
          </div>
          <div className="top_right">
            <h3 className='timer'>{`${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`}</h3>
          </div>
        </div>
        <div className="container py-5">
          <div className="example_header">
            <h4 className='example_header_txt'>generated examples</h4>
          </div>

          <div className="row py-4">
            {
              windowWidth < 992 ? (
                <>
                  {
                    examples?.map((ex: exampleProps, i: number) => {
                      return (
                        <form>
                          <div className="col-md-12 exam_kol3" key={i}>
                            <input className='ex_question1' value={ex?.num1} type="text" name="" id="" readOnly />
                            <span className='operat1'>{ex?.operation == 'addition' ? '+'
                              : ex?.operation == 'subtraction' ? '-'
                                : ex?.operation == 'multiplication' ? 'x' : ':'}
                            </span>
                            <input className='ex_question1' value={ex?.num2} type="text" name="" id="" readOnly />
                            <span className='equal1'>=</span>
                            <input className='response1'
                              // Call debouncedHandleInputChange with the current example object and the new value entered by the user
                              onChange={(e) => debouncedHandleInputChange(ex, Number(e.target.value))}
                              type="number" name="" id="" required />
                          </div>
                        </form>
                      )
                    })
                  }
                </>
              ) : (
                <>
                  {
                    examples?.map((ex: exampleProps, i: number) => {
                      return (
                        <>
                          <div className="col-md-6 exam_kol3" key={i}>
                            <input className='ex_question' value={ex?.num1} type="text" name="" id="" readOnly />
                            <span className='operat'>{ex?.operation == 'addition' ? '+'
                              : ex?.operation == 'subtraction' ? '-'
                                : ex?.operation == 'multiplication' ? 'x' : ':'}</span>
                            <input className='ex_question' value={ex?.num2} type="text" name="" id="" readOnly />
                            <span className='equal'>=</span>
                            <input className='response'
                              // Call debouncedHandleInputChange with the current example object and the new value entered by the user
                              onChange={(e) => debouncedHandleInputChange(ex, Number(e.target.value))}
                              type="number" name="" id="" required />
                          </div>
                        </>
                      )
                    })
                  }
                </>
              )
            }
          </div>
          {/* <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
            This is a box styled with Tailwind CSS!
          </div> */}

          <div className="finish_place">
            <button
              className={`start_btn ${isHovered ? 'hovered' : ''}`}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => next(time)}
              style={{ textTransform: 'capitalize' }}
            >
              finish
              {isHovered && (
                <div
                  className="shadow"
                  style={{ left: shadowPosition.x, top: shadowPosition.y }}
                ></div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
