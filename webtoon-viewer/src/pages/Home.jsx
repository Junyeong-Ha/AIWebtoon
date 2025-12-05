import React from 'react';
import { Link } from 'react-router-dom';
import { webtoons } from '../data/mockData';

const Home = () => {
    return (
        <div className="home-container">
            <h1>AI Webtoon Viewer</h1>
            <div className="webtoon-list">
                {webtoons.map((webtoon) => (
                    <div key={webtoon.id} className="webtoon-card">
                        <Link to={`/viewer/${webtoon.id}`}>
                            <div className="thumbnail-placeholder">
                                <img src={webtoon.thumbnail} alt={webtoon.title} />
                            </div>
                            <div className="webtoon-info">
                                <h3>{webtoon.title}</h3>
                                <p>{webtoon.description}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
