import React from 'react';
import './FeaturesBlock.css'; // Add your CSS styling for FeaturesBlock here

const Feature = ({ image, text }) => (
    <div className="feature">
        <img src={image} alt="Feature" className="feature__image" />
        <p className="feature__text">{text}</p>
    </div>
);

const FeaturesBlock = ({ features }) => (
    <div className="features-block">
        <div className="features-block__group">
            {features.slice(0, 3).map((feature, index) => (
                <Feature key={index} image={feature.image} text={feature.text} />
            ))}
        </div>
        <div className="features-block__separator" />
        <div className="features-block__group">
            {features.slice(3, 6).map((feature, index) => (
                <Feature key={index} image={feature.image} text={feature.text} />
            ))}
        </div>
    </div>
);

export default FeaturesBlock;
