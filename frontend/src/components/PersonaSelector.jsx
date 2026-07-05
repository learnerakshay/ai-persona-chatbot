import React from "react";
import { motion } from 'framer-motion';

const personas = ['Hitesh Choudhary', 'Piyush Garg'];

function PersonaSelector({ selectedPersona, onPersonaChange }) {
  return (
    <motion.label
      className="persona-selector"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
    >
      <span>Choose persona</span>
      <select
        aria-label="Choose persona"
        value={selectedPersona}
        onChange={(event) => onPersonaChange(event.target.value)}
      >
        <option value="">Select a persona</option>
        {personas.map((persona) => (
          <option key={persona} value={persona}>
            {persona}
          </option>
        ))}
      </select>
    </motion.label>
  );
}

export default PersonaSelector;
