# AI Joke Generator

A Next.js application that generates customized jokes using OpenAI's GPT model. Users can specify the topic, tone, type of joke, and creativity level to get personalized jokes with AI-powered evaluation for humor and appropriateness.

## Features

- 🎯 Topic-based joke generation
- 🎭 Multiple joke tones (funny, sarcastic, dad-joke, clever)
- 📝 Various joke types (one-liner, knock-knock, story, pun)
- 🎨 Adjustable creativity level
- 📊 AI-powered joke evaluation
- 🌙 Dark mode support
- 📱 Responsive design

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- npm (usually comes with Node.js)
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd my-homework-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   - Open `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## Running the Application

1. Start the development server:

```bash
npm run dev
```

2. Open your browser and navigate to:

```
http://localhost:3000
```

## Dependencies

Main dependencies and their versions:

\`\`\`json
{
"dependencies": {
"next": "14.1.0",
"react": "^18.2.0",
"react-dom": "^18.2.0",
"openai": "^4.28.0",
"react-hook-form": "^7.50.0",
"@hookform/resolvers": "^3.3.4",
"zod": "^3.22.4",
"tailwindcss": "^3.4.1",
"typescript": "^5.3.3"
}
}
\`\`\`

## Project Structure

```
my-homework-app/
├── app/
│   ├── api/
│   │   └── generate-joke/
│   │       └── route.ts
│   │
│   ├── components/
│   │   └── JokeGenerator.tsx
│   │
│   ├── page.tsx
│   │
│   └── generate/
│       └── page.tsx
├── public/
├── .env.example
├── .env.local (not in repo)
├── package.json
└── README.md
```

## Environment Variables

Required environment variables:

| Variable       | Description                             |
| -------------- | --------------------------------------- |
| OPENAI_API_KEY | Your OpenAI API key for joke generation |

## Development

The application uses:

- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- React Hook Form with Zod for form validation
- OpenAI API for joke generation and evaluation

## Troubleshooting

1. If you see a port conflict error, the app will automatically try the next available port (usually 3001)

2. If you encounter the `encoding` module error, install it manually:

```bash
npm install encoding
```

3. For any OpenAI API errors, ensure your API key is correctly set in `.env.local`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the GPT API
- Next.js team for the amazing framework
- All contributors and users of this project
