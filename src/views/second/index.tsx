import './second.css'
import { CiSettings } from "react-icons/ci";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import useSound from 'use-sound'
import press_button_mp3 from '/press_button1.wav'
import { ChangeEvent } from 'react';
import LogError from '../../errorLogger/bugFixer';
import axios from 'axios';
import { URL } from '../../sets'

interface customProps {
    limitNumber: string | number,
    countExample: string | number,
    operation: string,
}

export const Second = () => {
    const [play] = useSound(press_button_mp3)
    const navigate = useNavigate()
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [shadowPosition, setShadowPosition] = useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = useState(false)
    const [custom, setCustom] = useState<customProps>({
        limitNumber: '',
        countExample: '',
        operation: 'addition',
    })

    const submit = async (e: any) => {
        e.preventDefault()
        if (custom.limitNumber == '') {
            alert('Assign limit number')
        } else if (custom.countExample == '') {
            alert('Assign count of examples')
        } else {
            custom.limitNumber = Number(custom.limitNumber)
            custom.countExample = Number(custom.countExample)
            try {
                play()
                const resp = await axios?.post(`${URL}/examples/generate`, custom)
                localStorage?.setItem('ex', JSON.stringify(resp?.data))
                navigate('/example')
            } catch (err) {
                LogError(err)
            }
        }
    }

    // input changes handle
    const changeHandler = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        setCustom({ ...custom, [e.target.name]: e.target.value });
    };

    const handleCustomInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id } = e.target;
        changeHandler(e);

        if (id === "any1") {
            document.querySelectorAll('input[type="radio"]').forEach((radio) => {
                const inputRadio = radio as HTMLInputElement;
                if (["100", "500", "1000"].includes(inputRadio.id)) {
                    inputRadio.checked = false;
                }
            });
        } else if (id === "any2") {
            document.querySelectorAll('input[type="radio"]').forEach((radio) => {
                const inputRadio = radio as HTMLInputElement;
                if (["ten", "fifty", "hundred"].includes(inputRadio.id)) {
                    inputRadio.checked = false;
                }
            });
        }
    };

    const handleRadioClick = (e: any) => {
        changeHandler(e);

        const clickedRadioId = e.target.id;
        if (["100", "500", "1000"].includes(clickedRadioId)) {
            const specifiedInput = document.getElementById("any1") as HTMLInputElement;;
            if (specifiedInput) {
                specifiedInput.value = "";
            }
        } else if (["ten", "fifty", "hundred"].includes(clickedRadioId)) {
            const specifiedInput = document.getElementById("any2") as HTMLInputElement;;
            if (specifiedInput) {
                specifiedInput.value = "";
            }
        }
    };
    // button animation styles
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
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <div className="second_wrapper">
                <div className="container py-5">
                    <div className="second_header">
                        <h1 className='second_header_txt'>customize examples settings</h1>
                        <p className='settings_icon_place'><CiSettings size={25} className='settings_icon' /></p>
                    </div>

                    {
                        windowWidth < 992 ? (
                            <>
                                <div className="limit_number">
                                    <h5 className='part_headers'>limit number</h5>
                                    <div className="limit_body">
                                        <div className="radios">
                                            <input className='inp_radio' value='100'
                                                onClick={e => handleRadioClick(e)} type='radio' name="limitNumber" id="100" />
                                            <label className='labels' htmlFor="">0-100</label>
                                        </div>
                                        <div className="radios">
                                            <input className='inp_radio' value='500'
                                                onClick={e => handleRadioClick(e)} type='radio' name="limitNumber" id="500" />
                                            <label className='labels' htmlFor="">0-500</label>
                                        </div>
                                        <div className="radios">
                                            <input className='inp_radio' value='1000'
                                                onClick={e => handleRadioClick(e)} type='radio' name="limitNumber" id="1000" />
                                            <label className='labels' htmlFor="">0-1000</label>
                                        </div>
                                        <p className='or'>or</p>
                                        <input placeholder='custom limit' className='inp_radio'
                                            onChange={e => handleCustomInputChange(e)} type="number"
                                            name="limitNumber" id="any1" />
                                    </div>
                                </div>

                                <div className="limit_number" style={{ margin: '50px 0' }}>
                                    <h5 className='part_headers'>count examples</h5>
                                    <div className="limit_body">
                                        <div className="radios">
                                            <input className='inp_radio' value='10'
                                                onClick={e => handleRadioClick(e)} type='radio' name="countExample" id="ten" />
                                            <label className='labels' htmlFor="">10</label>
                                        </div>
                                        <div className="radios">
                                            <input className='inp_radio' value='50'
                                                onClick={e => handleRadioClick(e)} type='radio' name="countExample" id="fifty" />
                                            <label className='labels' htmlFor="">50</label>
                                        </div>
                                        <div className="radios">
                                            <input className='inp_radio' value='100'
                                                onClick={e => handleRadioClick(e)} type='radio' name="countExample" id="hundred" />
                                            <label className='labels' htmlFor="">100</label>
                                        </div>
                                        <p className='or'>or</p>
                                        <input placeholder='custom count' className='inp_radio'
                                            onChange={e => handleCustomInputChange(e)} type="number"
                                            name="countExample" id="any2" />
                                    </div>

                                    <div className="operations">
                                        <h5 className='oper_label'>Operation</h5>
                                        <select className='selection' name="operation" id="operation" onChange={e => changeHandler(e)} value={custom.operation}>
                                            <option value="addition">Addition ( + )</option>
                                            <option value="subtraction">Subtraction ( - )</option>
                                            <option value="multiplication">Multiplication ( x )</option>
                                            <option value="division">Division ( : )</option>
                                        </select>
                                    </div>

                                    <div className="generate_place">
                                        <button
                                            className={`start_btn ${isHovered ? 'hovered' : ''}`}
                                            onMouseMove={handleMouseMove}
                                            onMouseEnter={handleMouseEnter}
                                            onMouseLeave={handleMouseLeave}
                                            onClick={submit}
                                        >
                                            generate
                                            {isHovered && (
                                                <div
                                                    className="shadow"
                                                    style={{ left: shadowPosition.x, top: shadowPosition.y }}
                                                ></div>
                                            )}
                                        </button>
                                    </div>
                                </div>

                            </>
                        ) : (
                            <>
                                <div className="row second_row">
                                    <div className="col-md-6 kol6">
                                        <div className="limit_number">
                                            <h5 className='part_headers'>limit number</h5>
                                            <div className="limit_body">
                                                <div className="radios">
                                                    <input className='inp_radio' type='radio'
                                                        onClick={e => handleRadioClick(e)} value='100'
                                                        name="limitNumber" id="100" />
                                                    <label className='labels' htmlFor="">0-100</label>
                                                </div>
                                                <div className="radios">
                                                    <input className='inp_radio' type='radio'
                                                        onClick={e => handleRadioClick(e)} value='500'
                                                        name="limitNumber" id="500" />
                                                    <label className='labels' htmlFor="">0-500</label>
                                                </div>
                                                <div className="radios">
                                                    <input className='inp_radio' type='radio'
                                                        onClick={e => handleRadioClick(e)} value='1000'
                                                        name="limitNumber" id="1000" />
                                                    <label className='labels' htmlFor="">0-1000</label>
                                                </div>
                                                <span className='or'>or</span>
                                                <input placeholder='custom limit' className='inp_radio'
                                                    onChange={e => handleCustomInputChange(e)}
                                                    type="number" name="limitNumber" id="any1" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 kol6">
                                        <div className="limit_number">
                                            <h5 className='part_headers'>count examples</h5>
                                            <div className="limit_body">
                                                <div className="radios">
                                                    <input className='inp_radio'
                                                        onClick={e => handleRadioClick(e)} value='10'
                                                        type='radio' name="countExample" id="ten" />
                                                    <label className='labels' htmlFor="">10</label>
                                                </div>
                                                <div className="radios">
                                                    <input className='inp_radio'
                                                        onClick={e => handleRadioClick(e)} value='50'
                                                        type='radio' name="countExample" id="fifty" />
                                                    <label className='labels' htmlFor="">50</label>
                                                </div>
                                                <div className="radios">
                                                    <input className='inp_radio'
                                                        onClick={e => handleRadioClick(e)} value='100'
                                                        type='radio' name="countExample" id="hundred" />
                                                    <label className='labels' htmlFor="">100</label>
                                                </div>
                                                <span className='or'>or</span>
                                                <input placeholder='custom count' className='inp_radio'
                                                    onChange={e => handleCustomInputChange(e)}
                                                    type="number" name="countExample" id="any2" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="operations" style={{ padding: '50px 30px' }}>
                                    <h5 className='oper_label'>Operation</h5>
                                    <select className='selection' name="operation" id="operation" onChange={e => changeHandler(e)}>
                                        <option value="addition">Addition ( + )</option>
                                        <option value="subtraction">Subtraction ( - )</option>
                                        <option value="multiplication">Multiplication ( x )</option>
                                        <option value="division">Division ( : )</option>
                                    </select>
                                </div>

                                <div className="generate_place">
                                    <button
                                        className={`start_btn ${isHovered ? 'hovered' : ''}`}
                                        onMouseMove={handleMouseMove}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        onClick={submit}
                                    >
                                        generate
                                        {isHovered && (
                                            <div
                                                className="shadow"
                                                style={{ left: shadowPosition.x, top: shadowPosition.y }}
                                            ></div>
                                        )}
                                    </button>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </>
    )
}
