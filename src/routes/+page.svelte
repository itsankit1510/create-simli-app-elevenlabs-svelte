<script lang="ts">
  import { SimliClient } from "simli-client";
  import { onDestroy } from "svelte";
  import { createConversationService } from "../simli-elevenlabs/elevenlabs-svelte";
  // DOM elements
  let videoElement: HTMLVideoElement;
  let audioElement: HTMLAudioElement;
  let statusText = "Click Start to begin";
  let isActive = false;

  const SIMLI_API_KEY = import.meta.env.VITE_SIMLI_API_KEY;
  const SIMLI_FACE_ID = import.meta.env.VITE_SIMLI_FACE_ID;
  const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const ELEVENLABS_AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID;
  console.log(SIMLI_FACE_ID);
  const simliClient = new SimliClient();

  const startElevenLabsConversation = async () => {
    // If agent is not publis then we must get signed URL from ElevenLabs
    const requestHeaders = new Headers();
    requestHeaders.set("xi-api-key", ELEVENLABS_API_KEY);
    const ai = ELEVENLABS_AGENT_ID;
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${ai}`,
      {
        method: "GET",
        headers: requestHeaders,
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const signed_url: string = data.signed_url;

    conversation.setVolume({ volume: 0 });

    conversation.startSession({
      agentId: ai,
      signedUrl: signed_url,
    });
  };

  const initializeSimliClient = () => {
    const SimliConfig = {
      apiKey: SIMLI_API_KEY,
      faceID: SIMLI_FACE_ID,
      handleSilence: true,
      videoRef: videoElement,
      audioRef: audioElement,
    };

    simliClient.Initialize(SimliConfig as any);
    console.log("Simli Client initialized");
  };

  let avatarState = $state({
    isAvatarVisible: false,
    isLoading: true,
    error: null,
  });

  const conversation = createConversationService({
    onConnect: () => {
      console.log("ElevenLabs conversation connected");
      avatarState.isAvatarVisible = true;
      avatarState.isLoading = false;
      // sendAudioDataToSimli();
    },

    onDisconnect: () => {
      console.log("ElevenLabs conversation disconnected");
      avatarState.isAvatarVisible = false;
      simliClient?.ClearBuffer();
      simliClient?.close();
    },

    onMessage: (message) => {
      console.log("ElevenLabs conversation message:", message);
    },

    onModeChange(data) {
      console.log("ElevenLabs conversation mode change:", data);
      if (data.mode === "interrupted") {
        simliClient?.ClearBuffer();
      }
    },

    onError: (error) => {
      console.error("ElevenLabs conversation error:", error);
      avatarState.error = `Conversation error: ${error}`;
    },

    onAudioData: (audioData) => {
      console.log("ElevenLabs conversation audio data:", audioData);
      simliClient.sendAudioData(audioData);
    },
  });

  const startInteraction = async () => {
    initializeSimliClient();

    simliClient?.on("connected", () => {
      console.log("SimliClient connected");
      const audioData = new Uint8Array(6000).fill(0);
      simliClient?.sendAudioData(audioData);
      console.log("Sent initial audio data");

      startElevenLabsConversation();
    });

    simliClient?.on("disconnected", () => {
      console.log("SimliClient disconnected");
    });

    await navigator.mediaDevices.getUserMedia({ audio: true });

    await simliClient?.start();
  };
</script>

<div class="container">
  <h1>Simli Integration</h1>

  <div class="status">
    <p>{statusText}</p>
  </div>

  <div class="video-container">
    <!-- This displays the Simli face and also outputs the audio -->
    <audio bind:this={audioElement} autoPlay></audio>
    <video bind:this={videoElement} autoplay playsinline></video>
  </div>

  <button onclick={startInteraction}>
    {isActive ? "Stop" : "Start"}
  </button>
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: sans-serif;
    text-align: center;
  }

  .video-container {
    width: 100%;
    max-width: 640px;
    margin: 20px auto;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  video {
    width: 100%;
    display: block;
    background: #f5f5f5;
  }

  .status {
    background: #f0f0f0;
    padding: 10px;
    border-radius: 4px;
    margin: 10px 0;
  }

  button {
    background: #4285f4;
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
  }

  button:hover {
    background: #3367d6;
  }
</style>
