# 🎵 Instagram Song Translations

A beautiful web application for translating song lyrics from any language to Italian and generating stunning Instagram post images. Perfect for music lovers who want to share their favorite songs with Italian translations.

## ✨ Features

- **AI-Powered Translation**: Uses Google's Gemini AI to translate song lyrics while maintaining poetic flow and emotional tone
- **Beautiful Post Generation**: Creates up to 10 Instagram-ready post images with customizable themes
- **Multiple Color Themes**: Choose from Sunset, Ocean, Forest, Night, and Rose themes
- **Instagram Caption Generation**: AI-generated captions with relevant hashtags for your posts
- **High-Quality Downloads**: Export posts as high-resolution PNG images (1080x1080px)
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- A Google Gemini API key

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd instagram-song-translations
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3001`

## 🎨 How to Use

1. **Enter Song Information**: Add the artist name and song title
2. **Paste Lyrics**: Copy and paste the original song lyrics
3. **Choose Theme**: Select from 5 beautiful color themes
4. **Translate**: Click "Translate & Generate Posts" to create your Instagram slides
5. **Generate Caption**: Use "Generate Post Caption" for AI-created Instagram captions
6. **Download**: Click "Download All Posts" to save your images

## 🛠 Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your `.env` file

## 📁 Project Structure

```
instagram-song-translations/
├── package.json          # Project dependencies and scripts
├── server.js             # Express server with Gemini AI integration
├── .env                  # Environment variables (create from .env.example)
├── .env.example          # Environment variables template
└── public/
    ├── index.html        # Main HTML file
    ├── app.js            # Frontend application logic
    ├── actions.js        # API calls and image generation
    └── style.css         # Beautiful responsive styling
```

## 🎯 Features in Detail

### Translation Quality
- Maintains poetic flow and emotional tone
- Uses contemporary, natural Italian
- Splits content into Instagram-friendly chunks
- Preserves original meaning while adapting to Italian rhythm

### Visual Design
- Modern gradient backgrounds
- Professional typography with Inter font
- Responsive grid layout
- Smooth animations and hover effects
- Mobile-optimized interface

### Export Quality
- 1080x1080px resolution (Instagram square format)
- High-quality PNG images
- Optimized text sizing for social media
- Professional typography and spacing

## 🔧 Customization

### Adding New Themes
Edit `app.js` and add new themes to the `themes` object:
```javascript
const themes = {
  sunset: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
  // Add your custom theme here
  custom: 'linear-gradient(135deg, #your-color1 0%, #your-color2 100%)'
};
```

### Modifying Translation Prompts
Edit the prompts in `server.js` to customize how the AI translates:
- Adjust the translation style
- Change the number of slides generated
- Modify the caption generation approach

## 🚀 Deployment

### Local Development
```bash
npm start
```

### Production Deployment
1. Set up your environment variables on your hosting platform
2. Install dependencies: `npm install`
3. Start the server: `npm start`

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 💡 Tips for Best Results

1. **Quality Lyrics**: Use clean, well-formatted lyrics for best translation results
2. **Theme Selection**: Choose themes that match the song's mood
3. **Artist Info**: Include artist and song title for better context
4. **Manual Review**: Always review and edit translations as needed
5. **Caption Customization**: Feel free to edit the generated captions to match your style

---

Made with ❤️ for music lovers and Italian language enthusiasts
