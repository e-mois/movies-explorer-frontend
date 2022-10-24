import React from 'react'
import './Preloader.css'

const Preloader = (props) => {
    console.log(`preloader: ${props.preloader}`);
    return (
        <div className={`preloader  ${props.preloader && 'preloader_active'}`} >
            <div className="preloader__container">
                <span className="preloader__round"></span>
            </div>
        </div>
    )
};

export default Preloader
