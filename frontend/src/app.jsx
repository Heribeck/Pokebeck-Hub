import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react'; 

import { initApp, initBackButton } from './home/home.js';

import Toast from './components/Toast.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import CatalogScreen from './screens/CatalogScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import PoketypeScreen from './screens/poketype/PoketypeScreen.jsx';
import AboutScreen from './screens/AboutScreen.jsx';
import StudyScreen from './screens/poketype/study/StudyScreen.jsx';
import DifficultyTrainingScreen from './screens/poketype/training/DifficultyTrainingScreen.jsx';
import GameTrainingScreen from './screens/poketype/training/GameTrainingScreen.jsx';
import GameChallengeScreen from './screens/poketype/daily-challenge/GameChallengeScreen.jsx';
import GeneratorScreen from './screens/poketype/generator/GeneratorScreen.jsx';
import StreakResetDialog from './components/StreakResetDialog.jsx';
import { playAppMusic } from './shared/audio/index.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);

export default function App() {
    const [screen, setScreen] = useState('splash');
    const [currentDifficulty, setCurrentDifficulty] = useState(null);
    const [expiredStreak, setExpiredStreak] = useState(null);
    const mainSection = screen === 'home'
        ? 'home'
        : screen === 'tools' || screen === 'generator'
            ? 'tools'
            : screen === 'profile'
                ? 'profile'
                : screen === 'about'
                    ? 'about'
                    : 'games';
    const navigationItems = [
        { id: 'home', label: 'Inicio', iconClass: 'fa-solid fa-house', screen: 'home' },
        { id: 'games', label: 'Juegos', iconClass: 'fa-solid fa-gamepad', screen: 'games' },
        { id: 'tools', label: 'Herramientas', iconClass: 'fa-solid fa-wrench', screen: 'tools' },
        { id: 'profile', label: 'Perfil', iconClass: 'fa-solid fa-user', screen: 'profile' },
        { id: 'about', label: 'Información', iconClass: 'fa-solid fa-circle-info', screen: 'about' },
    ];

    const handleNavigation = (screen, difficulty = null) => {
        if (difficulty) setCurrentDifficulty(difficulty);
        setScreen(screen);
        window.scrollTo(0, 0);
    };

    useEffect(() => {   
        initApp(setScreen, setExpiredStreak);
        initBackButton(setScreen);
    }, []);

    useEffect(() => {
        if (screen === 'splash' || screen === 'leagues' || screen === 'gameTraining') return;
        playAppMusic();
    }, [screen]);

    return (
        <div className="AppShell">
            <Toast />
            {expiredStreak && (
                <StreakResetDialog
                    streak={expiredStreak}
                    onClose={() => setExpiredStreak(null)}
                />
            )}
            {screen !== 'splash' && (
                <nav className="AppNavigation" aria-label="Navegación principal">
                    {navigationItems.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            className={`AppNavigationButton ${mainSection === item.id ? 'IsActive' : ''}`}
                            aria-current={mainSection === item.id ? 'page' : undefined}
                            onClick={() => handleNavigation(item.screen)}
                        >
                            <span className="AppNavigationIcon" aria-hidden="true">
                                {item.iconClass ? <i className={item.iconClass} /> : item.icon}
                            </span>
                            <span className="AppNavigationLabel">{item.label}</span>
                        </button>
                    ))}
                </nav>
            )}
            <main className="AppContent">
                { screen === 'home' && <HomeScreen onNavigation={handleNavigation} /> }
                {(screen === 'games' || screen === 'tools') && (
                    <CatalogScreen section={screen} onNavigation={handleNavigation} />
                )}
                { screen === 'profile' && <ProfileScreen /> }
                { screen === 'about' && <AboutScreen onNavigation={handleNavigation} /> }
                { screen === 'poketype' && <PoketypeScreen onNavigation={handleNavigation} /> }
                { screen === 'leagues' && <StudyScreen onNavigation={handleNavigation} /> }
                { screen === 'difficultyTraining' && <DifficultyTrainingScreen onNavigation={handleNavigation} /> }
                { screen === 'gameTraining' && <GameTrainingScreen onNavigation={handleNavigation} currentDifficulty={currentDifficulty} /> }
                { screen === 'gameChallenge' && <GameChallengeScreen onNavigation={handleNavigation} /> }
                { screen === 'generator' && <GeneratorScreen onNavigation={handleNavigation} /> }
            </main>
        </div>
    )
}
