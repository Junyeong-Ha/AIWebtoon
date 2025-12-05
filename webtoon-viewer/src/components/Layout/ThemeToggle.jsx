import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle Dark/Light Mode"
        >
            {theme === 'dark' ? '🌞 Light' : '🌙 Dark'}
        </button>
    );
};

export default ThemeToggle;
