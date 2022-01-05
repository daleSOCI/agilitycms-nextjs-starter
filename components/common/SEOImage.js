import React from 'react';

const SEOImage = ({ img, sizes, className }) => {

    const srcSet = sizes.map(size => `${img?.url}?format=auto&w=${size} ${size}w, `);
    return (
        <>
            {img && (
                <img src={img.url} srcSet={srcSet} alt={img.label} className={className} />
            )}
        </>
    );
};

export default SEOImage;