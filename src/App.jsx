// App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiVolume2, FiSun, FiMoon, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const [word, setWord] = useState('keyboard');
  const [result, setResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedFont, setSelectedFont] = useState('sans-serif');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWordData();
  }, []);

  const fetchWordData = async () => {
    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      setResult(response.data[0]);
    } catch (err) {
      setResult(null);
    }
    setIsLoading(false);
  };

  const playSound = () => {
    const audio = new Audio(result?.phonetics[0]?.audio);
    audio.play();
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`} style={{ fontFamily: selectedFont }}>
      <motion.header 
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="logo">lexo's project</h1>
        <div className="controls">
          <motion.div whileHover={{ scale: 1.05 }} className="theme-toggle">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span className="slider round">
                {darkMode ? <FiMoon /> : <FiSun />}
              </span>
            </label>
          </motion.div>
          
          <motion.div className="dropdown-container" whileHover={{ scale: 1.05 }}>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="font-selector"
            >
              <option value="sans-serif">Sans Serif</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
            </select>
          </motion.div>
        </div>
      </motion.header>

      <motion.div 
        className="search-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchWordData()}
            placeholder="Search for words..."
          />
          <motion.button 
            onClick={fetchWordData}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div
            className={`result-card ${selectedFont}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <div className="word-header">
              <div>
                <h2>{result.word}</h2>
                <p className="phonetic">{result.phonetics[0]?.text}</p>
              </div>
              <motion.button 
                onClick={playSound}
                className="sound-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiVolume2 />
              </motion.button>
            </div>
            
            {result.meanings.map((meaning, index) => (
              <motion.div 
                key={index}
                className="meaning-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="part-of-speech">{meaning.partOfSpeech}</div>
                <ul>
                  {meaning.definitions.map((def, defIndex) => (
                    <motion.li 
                      key={defIndex}
                      className="definition-item"
                      whileHover={{ x: 5 }}
                    >
                      <p>{def.definition}</p>
                      {def.example && (
                        <div className="example">
                          <em>"{def.example}"</em>
                        </div>
                      )}
                      {def.synonyms?.length > 0 && (
                        <div className="synonyms">
                          <strong>Synonyms:</strong> {def.synonyms.join(', ')}
                        </div>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
