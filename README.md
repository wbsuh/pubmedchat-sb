# pubmedchat-sb
Chat and Search PubMed Articles with "PUBY" (Sendbird JS SDK)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Latest version of [Node.js and npm](https://nodejs.org/).
- **For Mac users:** You can optionally use Homebrew to install Node.js and npm by running `brew install node`.
- Basic understanding of terminal commands and JavaScript.
- [Git](https://git-scm.com/) installed on your machine to clone the repository.

## How to install and run the code

To run the chat application locally, follow these steps:
1. **Clone the repository:**

    ```sh
    git clone https://github.com/wbsuh/pubmedchat-sb.git

2. **Navigate to the project directory:**

    ```sh
    cd pubmedchat-sb

3. **Install dependencies:**

    ```sh
    npm install

4. **Start the application:**

    ```sh
    npm start

By Default, App runs on http://localhost:3000 

5. **Login to the chat**
Enter a user ID in the login input field and click the "Login" button to connect to Sendbird Server and start chatting with PubMed Bot "PUBY".

**IMPORTANT**: Available demo credentials are ***wonbae***. No passwords required. These users have existing chat converations to display past messages with PUBY.  

**NOTE**: Group Channels are invite only and new users in v1 currently do NOT have the ability to invite users. Logging with a new user id will create one automatically.   

## Goals of the Application

The primary goals for the chat application are to provide:

- **Real-time Interaction**: Instant updates for messages and typing indicators to reflect live conversation dynamics.
- **User-Centric Experience**: Support for user logins and personalized message displays.
- **Group Chat Functionality**: Enabling users and bots to create channels and engage in group chats.
- **PubMed Chatbot Integration**: Seamlessly integrate a PubMed chatbot as a user within the Sendbird platform, enabling users to interact with PubMed via Function Calls without the need for complex backend development (eg. Python).

## Key Design Decisions

### Integration with Sendbird Chat SDK (JS)

- Chosen for its full suite of messaging features, ease of use and integration with react application.
- Provides essential services such as real-time messaging (eg.Channel Creation, TypingIndicator, Messages), user management.

### User Interface with React

- Utilizes React's component-based architecture for a modular and maintainable UI.
- Ensures scalability and a clean separation of concerns.

### PubMed Chatbot as a User

- Integrates a PubMed chatbot directly within the Sendbird platform, treating it as a bot to facilitate direct interaction with PubMed data via API.
- Eliminates the need for separate backend services for the chatbot, simplifying the architecture and reducing development overhead. 
- Created using Sendbird's new AI Chatbot feature [Link](https://sendbird.com/docs/ai-chatbot/guide/v1/sendbird-dashboard/sendbird-dashboard-overview)

## Core v1 functionalities 

- Basic Login feature with Sendbird User ID (No password)
- Create or Join Group Channel (if one does not exist)
- Talk with PubMed Bot (PUBY) hosted in Sendbird and Powered by GPT-3.5 
- Retrieve message list for existing Group Channel (distinguishing sender messages)
- Typing indicator for User/Bot 

## How to use PUBY 
- Query {topics} or {authors} and PUBY will provide list of unique PMID 
- Use PMIDs to query for Abstract Summaries
- Use PMIDs to fetch defails about an article (eg. authors)
- Ask for list of Clinical Trials based on a query/topic
- Use National Clinical Trial (NCT) number to query Clinical Trial Details
- DISCLAIMER: ***Large Language Models can Hallucinate***

  ![Video description](https://github.com/wbsuh/pubmedchat-sb/blob/main/demo.mp4)



## To-Do
- [ ] Secure login and authentication with Sendbird (backend services like Supabase for user management)
- [ ] Query Group Channel list and display list
- [ ] List Users and Invite to Group Channel
- [ ] Search user messages
- [ ] Delivered Indicator 
- [ ] Autoscroll Messages 
- [ ] Message Formatting for chatbot responses 
- [ ] UI enhancement (Login page, Avatar)
- [ ] PubMed bot Enhancement with non-PubMed sources (web, external DB & APIs)

