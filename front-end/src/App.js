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
          <div id="CreateField">
            <p>DIRECT MESSAGES</p>
            {/* <input id='createChat' type="submit" value="+" /> */}
            <i class="fas fa-cloud"></i>
          </div>
          <div className="Chat">
          </div>
        </div>
      </div>
    </div>
  )
}
