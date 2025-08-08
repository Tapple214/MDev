# AI Integration for Bubbles App

This document explains how to set up and use the AI-powered features in the Bubbles app.

## Features Added

### 1. AI-Powered Event Description Generator

- **Location**: CreateBubble page
- **Function**: Automatically generates engaging event descriptions based on event details
- **How to use**: Click the lightning bolt (⚡) button next to the description field

## Setup Instructions

### 1. Get API Keys

You'll need API keys from one or more of these services:

#### OpenAI (Recommended)

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and get your API key
3. Add to your environment variables: `OPENAI_API_KEY=your-key-here`

#### Google Gemini (Alternative)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to your environment variables: `GEMINI_API_KEY=your-key-here`

#### Azure OpenAI (Alternative)

1. Set up Azure OpenAI service
2. Get your API key and endpoint
3. Add to your environment variables:
   - `AZURE_OPENAI_API_KEY=your-key-here`
   - `AZURE_OPENAI_ENDPOINT=your-endpoint-here`

### 2. Environment Configuration

Create a `.env` file in your project root with your API keys:

```env
# AI API Configuration
OPENAI_API_KEY=your-openai-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here
AZURE_OPENAI_API_KEY=your-azure-openai-key-here
AZURE_OPENAI_ENDPOINT=your-azure-endpoint-here
```

### 3. Install Dependencies

Make sure you have the required dependencies:

```bash
npm install react-native-dotenv
```

### 4. Configure Metro (if needed)

If you encounter issues with environment variables, you may need to configure Metro to handle them.

## How It Works

### AI Description Generator

1. **User Input**: When creating a bubble, users fill in:

   - Event name
   - Selected tags
   - Location
   - Date and time
   - Guest list

2. **AI Processing**: The AI analyzes this data and generates:

   - Engaging event descriptions
   - Context-aware content based on tags
   - Personalized messaging

3. **User Control**: Users can:
   - Generate new descriptions
   - Use the AI-generated description
   - Edit the description manually
   - Regenerate if not satisfied

### AI System

The app uses OpenAI as the primary AI provider:

1. **Primary**: OpenAI GPT-3.5-turbo for description generation
2. **Fallback**: Built-in template generation if OpenAI is unavailable

## Code Structure

### Components

- `components/ai-description-generator.js` - Main AI generator modal
- `utils/ai-service.js` - AI API integration functions

### Integration Points

- `pages/CreateBubble.js` - AI button added to description field

## Customization

### Adding New AI Providers

1. Add your provider configuration to `ai-service.js`
2. Create a new function following the existing pattern
3. Add it to the fallback chain in `generateEventDescription`

### Customizing Prompts

Edit the system prompts in `ai-service.js` to match your app's tone and style.

### Adding New AI Features

The modular structure makes it easy to add new AI features:

- Event theme suggestions
- Personalized invitations
- Guest compatibility analysis
- Venue recommendations

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure your API keys are correctly set in environment variables
2. **Network Errors**: Check your internet connection and API service status
3. **Rate Limiting**: Some APIs have rate limits; the fallback system handles this
4. **Environment Variables**: Make sure your `.env` file is properly configured

### Debug Mode

Enable debug logging by adding to your environment:

```env
DEBUG_AI=true
```

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Consider implementing API key rotation
- Monitor API usage to control costs

## Future Enhancements

Potential AI features to add:

- Smart guest list suggestions
- Optimal event timing recommendations
- Venue compatibility analysis
- Personalized event themes
- Automated follow-up messages
- Event success prediction

## Support

For issues with the AI integration:

1. Check the console for error messages
2. Verify API keys are correctly configured
3. Test with the fallback system
4. Review the AI service documentation
