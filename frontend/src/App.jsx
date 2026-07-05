import React, { useCallback, useMemo, useState } from "react";
import Header from './components/Header.jsx';
import PersonaSelector from './components/PersonaSelector.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import ChatInput from './components/ChatInput.jsx';
import hiteshAvatar from './assets/hitesh.png';
import piyushAvatar from './assets/piyush.png';

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    text: 'Welcome!\n\nChoose a persona and ask your first question.',
    persona: null,
  },
];

const personaDetails = {
  'Hitesh Choudhary': {
    apiValue: 'hitesh',
    name: 'Hitesh Choudhary',
    avatar: hiteshAvatar,
    welcome: '👋 Haanji!\n\nYahan hum sirf syntax nahi,engineering mindset develop karte hain.\n\nToh bataiye...Aaj kya seekhna hai?',
  },
  'Piyush Garg': {
    apiValue: 'piyush',
    name: 'Piyush Garg',
    avatar: piyushAvatar,
    welcome: "👋 Hey!\n\nI'm Piyush.\n\nLet's build something.",
  },
};

function App() {
  const [selectedPersona, setSelectedPersona] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const activePersona = personaDetails[selectedPersona] || null;

  const avatarByPersona = useMemo(
    () => ({
      hitesh: hiteshAvatar,
      piyush: piyushAvatar,
    }),
    []
  );

  const handlePersonaChange = useCallback((personaName) => {
    setSelectedPersona(personaName);

    const persona = personaDetails[personaName];

    if (!persona) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: persona.welcome,
        persona: persona.apiValue,
      },
    ]);
  }, []);

  const handleSendMessage = useCallback(async (message) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) {
      return false;
    }

    const persona = activePersona?.apiValue;

    if (!persona) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: 'Please choose a persona before sending your message.',
          persona: null,
        },
      ]);
      return false;
    }

    const loadingMessageId = crypto.randomUUID();

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: crypto.randomUUID(),
        role: 'user',
        text: trimmedMessage,
      },
      {
        id: loadingMessageId,
        role: 'assistant',
        text: '',
        isLoading: true,
        persona,
      },
    ]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          persona,
          message: trimmedMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to get a response right now.');
      }

      setMessages((currentMessages) =>
        currentMessages.map((currentMessage) =>
          currentMessage.id === loadingMessageId
            ? {
                ...currentMessage,
                isLoading: false,
                persona,
                text: data.reply || 'No response received.',
              }
            : currentMessage
        )
      );
    } catch (error) {
      const isNetworkError =
        error instanceof TypeError || error.message === 'Failed to fetch';

      setMessages((currentMessages) =>
        currentMessages.map((currentMessage) =>
          currentMessage.id === loadingMessageId
            ? {
                ...currentMessage,
                isLoading: false,
                persona,
                text: isNetworkError
                  ? '⚠ Backend unavailable.\nPlease ensure backend server is running.'
                  : error.message ||
                    'Something went wrong. Please try again in a moment.',
              }
            : currentMessage
        )
      );
    } finally {
      setIsLoading(false);
    }

    return true;
  }, [activePersona, isLoading]);

  return (
    <main className={`app-shell ${isLoading ? 'app-shell-loading' : ''}`}>
      <section className="chat-panel" aria-label="AI Persona Chatbot">
        <Header activePersona={activePersona} />

        <div className="controls-row">
          <PersonaSelector
            selectedPersona={selectedPersona}
            onPersonaChange={handlePersonaChange}
          />
        </div>

        <ChatWindow
          messages={messages}
          avatarByPersona={avatarByPersona}
          activePersona={activePersona}
          scrollKey={selectedPersona}
        />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </section>
      <footer className="app-footer">
        Built with React • Express • OpenAI • Framer Motion
      </footer>
    </main>
  );
}

export default App;
