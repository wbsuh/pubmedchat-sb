import React, { Component } from 'react';
import SendbirdChat from '@sendbird/chat';
import { GroupChannelModule,  MessageFilter, MessageCollectionInitPolicy } from '@sendbird/chat/groupChannel';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';

class App extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      channel: null,
      channelType: null,
      userId: '', 
      isConnected: false,
      messageCollection: null,  
    };

    this.sb = SendbirdChat.init({
      appId: '24C7F7B1-B8F1-43FF-96BE-797B57528110',
      modules: [new GroupChannelModule()],
    });
  }

  handleUserIdChange = (event) => {
    this.setState({ userId: event.target.value }, () => console.log('UserId updated:', this.state.userId));
  };

  handleLogin = async (e) => {
    e.preventDefault();
    const { userId } = this.state;
    if (userId.trim()) {
      try {
        await this.sb.connect(userId);
        this.setState({ isConnected: true }, () => console.log('User connected with userId:', this.state.userId));
      } catch (error) {
        console.error('Sendbird Connection Error:', error);
      }
    }
  };

  connectToSenbird = async (userId) => {
    try {
      await this.sb.connect(userId);
    } catch (error) {
      console.error('Sendbird Connection Error:', error);
    }
  };

  createGroupChannel = async () => {
    const params = {
      invitedUserIds: ['pubmed-chat','wonbae'], 
      name: "pubchat",
      coverUrl: "http://example.com/cover.jpg",
      operatorUserIds: ['wonbae'], 
      isDistinct: true,
    };
  
    try {
      const channel = await this.sb.groupChannel.createChannel(params);
      this.channel = channel; 
      this.initializeMessageCollection(channel);
      // console.log("Successfully set this.channel to the newly created group channel.");
    } catch (error) {
      console.error("Error creating group channel:", error);
    }
  };
  sendMessage = async (textMessage, customType = '', data = '') => {
    if (!this.channel) {
      console.error('Channel is not defined.');
      return;
    }

    const params = {
      message: textMessage,
      customType: customType,
      data: data,
    };

    try {
      this.channel.sendUserMessage(params)
        .onSucceeded(({messageId, message, createdAt, sender: {userId, nickname}}) => {
      
          const formattedMessage = {
            messageId,
            message,
            userId,
            createdAt,
            sender: {
              userId,
              nickname
            },
          };
        })
        .onFailed((error, message) => {
          console.error("Failed to send message:", error);
        });
    } catch (error) {
      console.error("Send Message Error:", error);
    }
  };

  renderChannelTypeSelection() {
    return (
      <div>
        <button onClick={() => this.setState({ channelType: 'group' }, this.createGroupChannel)}>Chatbot Channel</button>
      </div>
    );
  }

  initializeMessageCollection = async (channel) => {
    
    const filter = new MessageFilter();
    const limit = 100;
    const startingPoint = Date.now();
    const messageCollection = channel.createMessageCollection({
      filter,
      limit,
      startingPoint,
    });

    const handler = {
      onMessagesAdded: (context, channel, messages) => {
        this.setState(prevState => ({
          messages: [
            ...prevState.messages,
            ...messages.map(message => ({
              ...message,
              isCurrentUser: message.sender.userId === this.state.userId
            }))
          ]
        }));
      },
      onMessagesUpdated: (context, channel, messages) => {
          // PLACEHOLDER: Logic to update messages in state
      },
      onMessagesDeleted: (context, channel, messageIds) => {
          // PLACEHOLDER: Logic to remove messages from state
      },
  
      onChannelUpdated: (context, channel) => {
        this.setState({channel, typingMembers: channel.getTypingUsers()});
      },
      onChannelDeleted: (context, channelUrl) => {
          // PLACEHOLDER: Clear chat view or update state as needed
      },
      onHugeGapDetected: () => {
          // PLACEHOLDER: Handle huge gap detected event
      }
  };

    messageCollection.setMessageCollectionHandler(handler);

    await messageCollection.initialize(MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
    .onCacheResult((err, messages) => {
      if (!err) {
        const modifiedMessages = messages.reverse().map(message => ({
          ...message,
          isCurrentUser: message.sender.userId === this.state.userId,
        }));
        this.setState({ messages: modifiedMessages });
      } else {
        console.error("Error retrieving messages from cache:", err);
      }
    })
    .onApiResult((err, messages) => {
      if (!err) {
        const modifiedMessages = messages.reverse().map(message => ({
          ...message,
          isCurrentUser: message.sender.userId === this.state.userId, 
        }));
        this.setState({ messages: modifiedMessages }); 
      } else {
        console.error("Error retrieving messages from API:", err);
      }
    });
    this.setState({ messageCollection });
  };
  
  // loadPreviousMessages = async () => {
  //   const { messageCollection } = this.state;
  //   if (messageCollection && messageCollection.hasPrevious) {
  //     console.log("Loading previous messages");
  //     const messages = await messageCollection.loadPrevious();
  //     console.log("Previous messages loaded:", messages);
  //     this.setState(prevState => ({
  //       messages: [...messages.reverse(), ...prevState.messages], 
  //     }));
  //   } else {
  //     console.log("No previous messages to load or MessageCollection not initialized");
  //   }
  // };

  render() {
    const { isConnected, channel, channelType, messages, userId, typingMembers } = this.state;
    console.log(typingMembers, 'members');
    return (
      <div className="app">
        <div className="navbar">SendBird SDK Chat with PubMed</div>
      <div className="form-container">
      {!isConnected && (
        <div className="form-card">
          <form onSubmit={this.handleLogin}>
            <input
              type="text"
              placeholder="Enter user ID"
              value={userId}
              onChange={this.handleUserIdChange}
              className="login-input"
            />
            <button type="submit" onClick={this.handleLogin} className="login-button">Login</button>
          </form>
        </div>
        )}
        {isConnected && !channelType && this.renderChannelTypeSelection()}
        {isConnected && channelType && (
          <>
            <MessageList messages={messages} />
            <SendMessageForm channel={channel} sendMessage={this.sendMessage} currentUserId={this.state.userId}/>
            {typingMembers?.length > 0 && typingMembers.map((member) => {
              return <div key={member.nickname} className="typingMessage">{`${member.nickname} is typing...`}</div>;})}
          </>
        )}
      </div>
      </div>
    );
  }
}

export default App;



