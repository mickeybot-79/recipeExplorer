const LoadingIcon = ({imgSrc}) => {

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'grid',
            placeContent: 'center',
            position: 'fixed',
            top: '0px',
            left: '0px',
            background: 'linear-gradient(90deg, rgba(169, 142, 212, 0.37), rgba(89, 119, 202, 0.616))'
        }}>
            <img
                src={imgSrc}
                alt='icon'
                style={{
                    width: '200px',
                    filter: 'sepia(40%)'
                }}
            />                                                                                
        </div>
    )
}

export default LoadingIcon