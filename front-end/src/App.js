import React, { useState } from 'react';
import './App.css';

export function App() {
  return (
    <div className="main">
      <div className="ChatZone">
        <div className="Search">
          <input type="text" placeholder=" Find or start a conversation" />
        </div>
        <hr />
        <br />
        <div className="Chats">
          <div className="CreateField">
            <p>DIRECT MESSAGES</p>
          </div>
          <div className="Chat">
            Chat 1
          </div>
          <div className="Chat">
            Chat 2
          </div>

        </div>
      </div>
    </div>
  )
}
