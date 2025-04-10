# Simli App with ElevenLabs Integration

[![Simli](https://img.shields.io/badge/powered%20by-Simli-blue)](https://www.simli.com)
[![ElevenLabs](https://img.shields.io/badge/voice%20by-ElevenLabs-purple)](https://elevenlabs.io)

A professional starter kit for creating interactive AI avatars using Simli's visual technology and ElevenLabs' voice synthesis in a SvelteKit application.

![Characters Preview](media/image.png)

## 🚀 Getting Started

### Prerequisites
- [Simli API Key](https://www.simli.com/profile)
- [ElevenLabs API Key](https://elevenlabs.io/app/settings/api-keys)
- [ElevenLabs Agent ID](https://elevenlabs.io/app/conversational-ai/)

### Setup

1. **Configure Environment Variables**
   
   Rename `.env_sample` to `.env` and add your API credentials:

   ```
   VITE_SIMLI_API_KEY="YOUR_SIMLI_API_KEY"
   VITE_SIMLI_FACE_ID="YOUR_SIMLI_FACE_ID"
   VITE_ELEVENLABS_API_KEY="YOUR_ELEVENLABS_API_KEY"
   VITE_ELEVENLABS_AGENT_ID="YOUR_ELEVENLABS_AGENT_ID"
   ```

   > 💡 **Need API access?** Join our [Discord community](https://discord.gg/yQx49zNF4d) for assistance.

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Launch Development Server**

   ```bash
   npm run dev
   ```

   Access your app at [http://localhost:5173](http://localhost:5173)

## 🎭 Character Customization

Choose from a variety of pre-designed characters or create your own:

<div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
  <img src="media/image.png" alt="Character 1" width="150">
  <img src="media/image-4.png" alt="Character 2" width="150">
  <img src="media/image-2.png" alt="Character 3" width="150">
  <img src="media/image-3.png" alt="Character 4" width="150">
  <img src="media/image-5.png" alt="Character 5" width="150">
  <img src="media/image-6.png" alt="Character 6" width="150">
</div>

- **Explore characters** in the [Simli Documentation](https://docs.simli.com/introduction)
- **Create custom characters** using the [Simli App](https://app.simli.com/)

## 🌐 Deployment

### Deploy to Vercel

Deploy your avatar interaction with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 🔧 Advanced Configuration

Customize your avatar's appearance and behavior by modifying the `app/page.tsx` file:

```js
// Example configuration
const avatarConfig = {
  faceId: import.meta.env.VITE_SIMLI_FACE_ID,
  initialPrompt: "You are a helpful assistant named Alex",
  // Additional avatar properties...
};
```

## 📚 Resources

- [Simli Documentation](https://docs.simli.com)
- [ElevenLabs Documentation](https://docs.elevenlabs.io)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<p align="center">Built with ❤️ by [Ankit](https://github.com/itsankit1510)</p>