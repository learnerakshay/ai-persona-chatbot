import React, { useEffect, useRef } from "react";
import { AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage.jsx';

function ChatWindow({ messages, avatarByPersona, activePersona, scrollKey }) {
  const latestMessageRef = useRef(null);

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages, scrollKey]);

  return (
    <section className="chat-window" aria-label="Chat messages">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            ref={index === messages.length - 1 ? latestMessageRef : null}
            role={message.role}
            text={message.text}
            isLoading={message.isLoading}
            avatarSrc={
              message.role === 'assistant'
                ? avatarByPersona[message.persona] || activePersona?.avatar
                : null
            }
          />
        ))}
      </AnimatePresence>
    </section>
  );
}

export default ChatWindow;
