import { useState, useEffect } from 'react';
import '../styles/ChatLoader.css';

const STATUS_MESSAGES = [
  { code: '001', text: 'Request received' },
  { code: '002', text: 'Engaging language model' },
  { code: '003', text: 'Querying IEEE Xplore index' },
  { code: '004', text: 'Synthesizing response' },
  { code: '005', text: 'Verifying sources' },
];

function ChatLoadingIndicator() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev < STATUS_MESSAGES.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const current = STATUS_MESSAGES[messageIndex];

  return (
    <div className="chat-loader">
      <div className="chat-loader__inner">
        <div className="chat-loader__corner chat-loader__corner--tl" aria-hidden="true"></div>
        <div className="chat-loader__corner chat-loader__corner--tr" aria-hidden="true"></div>
        <div className="chat-loader__corner chat-loader__corner--bl" aria-hidden="true"></div>
        <div className="chat-loader__corner chat-loader__corner--br" aria-hidden="true"></div>

        <div className="chat-loader__head">
          <span className="chat-loader__step">STEP {current.code}/005</span>
          <span className="chat-loader__dot" aria-hidden="true"></span>
        </div>
        <div className="chat-loader__text" key={messageIndex}>{current.text}</div>
        <div className="chat-loader__progress" aria-hidden="true">
          <span style={{ width: `${((messageIndex + 1) / STATUS_MESSAGES.length) * 100}%` }}></span>
        </div>
      </div>
    </div>
  );
}

export default ChatLoadingIndicator;
