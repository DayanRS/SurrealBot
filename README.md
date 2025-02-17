# SurrealBot

A Discord bot built with Discord.js that provides moderation, fun commands, and custom command functionality.

## Features

- Moderation commands (ban, warn, punish, etc.)
- Fun commands (8ball, hug, kiss, etc.)
- Custom command system
- Warning and punishment tracking
- MongoDB integration for data persistence

## Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/SurrealBot.git
cd SurrealBot
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

- Copy `.env.example` to `.env`
- Fill in your Discord bot token, client ID, and MongoDB credentials

4. Deploy commands

```bash
node deploy-commands.js
```

5. Start the bot

```bash
node index.js
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Discord Bot Configuration
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_GUILD_ID=your_guild_id_here

# MongoDB Configuration
MONGO_USERNAME=your_mongodb_username
MONGO_PASSWORD=your_mongodb_password
```

## Commands

- `/ban` - Ban a user
- `/warn` - Warn a user
- `/custom` - Create custom commands
- `/whois` - Get user information
- And many more!

## License

MIT License - Feel free to use and modify as needed!
