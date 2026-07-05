import React from "react";
import { AnimatePresence, motion } from 'framer-motion';

function Header({ activePersona }) {
  return (
    <header className="header">
      <div>
        <h1>AI Persona Chatbot</h1>
        <p>Talk with Hitesh Choudhary or Piyush Garg</p>
      </div>
      <div className="header-persona" aria-live="polite">
        <span>Currently Talking To</span>
        <AnimatePresence mode="wait">
          {activePersona ? (
            <motion.div
              key={activePersona.apiValue}
              className="header-persona-card"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <img src={activePersona.avatar} alt="" />
              <strong>{activePersona.name}</strong>
            </motion.div>
          ) : (
            <motion.div
              key="none"
              className="header-persona-card header-persona-empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <span>Select a persona</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default Header;
