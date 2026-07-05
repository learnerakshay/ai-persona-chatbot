import React from "react";
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatMessage = React.forwardRef(function ChatMessage(
  { role, text, isLoading, avatarSrc },
  ref
) {
  const isUser = role === 'user';

  return (
    <motion.article
      ref={ref}
      className={`message-row ${isUser ? 'message-row-user' : ''}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      layout="position"
    >
      {!isUser && avatarSrc ? (
        <img className="message-avatar" src={avatarSrc} alt="" loading="lazy" />
      ) : null}
      <div className={`message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
        {isLoading ? (
          <div className="typing-indicator" aria-live="polite" aria-label="Thinking">
            <span className="typing-dots" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ ...props }) => (
                <a {...props} target="_blank" rel="noreferrer" />
              ),
            }}
          >
            {text}
          </ReactMarkdown>
        )}
      </div>
    </motion.article>
  );
});

export default ChatMessage;
