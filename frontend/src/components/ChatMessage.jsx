import React, { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

const ChatMessage = React.forwardRef(function ChatMessage(
  { role, text, isLoading, avatarSrc },
  ref
) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.article
      ref={ref}
      className={`message-row ${isUser ? "message-row-user" : ""}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      layout="position"
    >
      {!isUser && avatarSrc ? (
        <img
          className="message-avatar"
          src={avatarSrc}
          alt=""
          loading="lazy"
        />
      ) : null}

      <div
        className={`message-bubble ${
          isUser ? "user-bubble" : "assistant-bubble"
        }`}
      >
        {isLoading ? (
          <div
            className="typing-indicator"
            aria-live="polite"
            aria-label="Thinking"
          >
            <span className="typing-dots" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        ) : (
          <>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                a: ({ ...props }) => (
                  <a {...props} target="_blank" rel="noreferrer" />
                ),
              }}
            >
              {text}
            </ReactMarkdown>

            {!isUser && (
              <button
                onClick={handleCopy}
                className="copy-button"
                style={{
                  background: "#1f2937",
                  color: "#b8c4e0",
                  border: "1px solid #30384a",
                  borderRadius: "8px",
                  padding: "3px 8px",
                  fontSize: "12px",
                  cursor: "pointer",
                  marginTop: "8px"
                }}
>
  {copied ? "Copied" : "Copy"}
</button>
            )}
          </>
        )}
      </div>
    </motion.article>
  );
});

export default ChatMessage;