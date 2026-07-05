import React, { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';

function ChatInput({ onSendMessage, isLoading }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const wasLoadingRef = useRef(false);
  const trimmedMessage = message.trim();

  useEffect(() => {
    if (wasLoadingRef.current && !isLoading) {
      textareaRef.current?.focus();
    }

    wasLoadingRef.current = isLoading;
  }, [isLoading]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!trimmedMessage || isLoading) {
      return;
    }

    const wasSent = await onSendMessage(trimmedMessage);

    if (wasSent) {
      setMessage('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <form className="chat-input" aria-label="Chat input" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        placeholder="Ask anything..."
        rows="3"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Message"
      />
      <motion.button
        type="submit"
        disabled={isLoading || !trimmedMessage}
        whileHover={!isLoading && trimmedMessage ? { scale: 1.03 } : undefined}
        whileTap={!isLoading && trimmedMessage ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.16, ease: 'easeOut' }}
      >
        Send
      </motion.button>
    </form>
  );
}

export default ChatInput;
