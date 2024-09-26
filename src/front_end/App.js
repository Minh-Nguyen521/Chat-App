import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App({ userId }) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://192.168.1.102:8080/ws");

    ws.current.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.current.onmessage = (event) => {
      const newMessage = event.data;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    if (inputValue.trim()) {
      const message = {
        user_id: userId,
        content: inputValue,
      };

      const formattedMessage = `${message.user_id} sent: ${message.content}`;

      ws.current.send(JSON.stringify(message));

      setMessages((prevMessages) => [...prevMessages, formattedMessage]);

      setInputValue("");
    }
  };

  const handleReaction = (react) => {
    const message = {
      user_id: userId,
      content: react,
    };

    const formattedMessage = `${message.user_id} sent: ${message.content}`;

    ws.current.send(JSON.stringify(message));

    setMessages((prevMessages) => [...prevMessages, formattedMessage]);

    setInputValue("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleButtonClick();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative min-h-screen p-4">
      <div className="flex flex-col items-end space-y-2 mb-24">
        {messages.map((message, index) => (
          <div key={index} className="bg-gray-200 p-3 rounded text-lg">
            {message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="fixed bottom-0 right-0 w-full max-w-md p-4 bg-white border-t border-gray-300">
        <div className="relative">
          <div className="flex items-center space-x-4">
            {/* Reaction Button */}
            <div className="relative">
              <button
                className="px-5 py-3 text-xl bg-blue-500 text-white rounded mb-2" // Slightly reduced padding and font size
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleReaction("❤️")}
              >
                ❤️
              </button>
              {isOpen && (
                <div
                  className="absolute border border-gray-300 p-3 rounded shadow-lg top-[-50px] left-1/2 transform -translate-x-1/2 mb-2 z-10 bg-white text-black"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex space-x-3">
                    <button
                      className="text-xl"
                      onClick={() => handleReaction("👍")}
                    >
                      👍
                    </button>
                    <button
                      className="text-xl"
                      onClick={() => handleReaction("😢")}
                    >
                      😢
                    </button>
                    <button
                      className="text-xl"
                      onClick={() => handleReaction("😂")}
                    >
                      😂
                    </button>
                    <button
                      className="text-xl"
                      onClick={() => handleReaction("😮")}
                    >
                      😮
                    </button>
                    <button
                      className="text-xl"
                      onClick={() => handleReaction("😡")}
                    >
                      😡
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Message Input and Send Button */}
            <input
              type="text"
              placeholder="Type here"
              className="flex-grow p-3 text-base border rounded" // Slightly reduced padding and font size
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button
              className="px-5 py-3 text-base bg-blue-500 text-white rounded"
              onClick={handleButtonClick}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
