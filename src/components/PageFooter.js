import { useState } from "react"

const PageFooter = ({ openLink }) => {

    const [displayContact, setDisplayContact] = useState('none')

    return (
        <div id="page-footer">
            <a className="repository-link" href='https://github.com/mickeybot-79/recipeExplorer' target="_blank" rel="noreferrer">Front-end repository <img className="link-img" src={openLink} alt="link"/></a>
            <a className="repository-link" href='https://github.com/mickeybot-79/recipes' target="_blank" rel="noreferrer">Back-end repository <img className="link-img" src={openLink} alt="link"/></a>
            <p onMouseOver={() => setDisplayContact('grid')} id="contact-info">Contact info</p>
            <div style={{display: displayContact}} onMouseLeave={() => setDisplayContact('none')} id="contact-container">
                <p className="contact-point">Developed by Michael Pérez</p>
                <p className="contact-point">michaelperezvezoli@hotmail.com</p>
                <p>Github: <a href='https://github.com/mickeybot-79' target="_blank" rel="noreferrer" className="contact-point">https://github.com/mickeybot-79 <img className="link-img" src={openLink} alt="link"/></a></p>
            </div>
        </div>
    )
}

export default PageFooter