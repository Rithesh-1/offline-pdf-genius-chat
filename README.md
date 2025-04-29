
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/a99be13b-2f2e-4a9c-9b89-32032132cd9e

## How to Load and Run Models Locally

This application supports loading and running AI models locally. Follow these steps to get started:

### Supported Models

The application supports various model formats:
- `.bin` - Model binary files
- `.gguf` - GGUF format (newer, optimized format used by LLaMA, Mistral models)
- `.ggml` - GGML format (used by many quantized models)
- `.pt`/`.pth` - PyTorch model files
- `.onnx` - ONNX Runtime models

### Loading a Local Model

1. **Using the Model Selector**:
   - Navigate to the Settings tab in the application
   - Under "Model Settings", you'll see an option to upload a model file
   - Click "Choose Model File" to select your local model

2. **Using Custom Path**:
   - Select "Custom model..." from the model dropdown
   - Enter the path to your model file on your local machine
   - Click "Set" to apply the path

3. **Model Requirements**:
   - Ensure your model is compatible with browser-based inference
   - Larger models (>1GB) may take significant time to load
   - WebGPU-compatible models will use GPU acceleration if available

### System Resource Usage

The application includes a resource monitor showing:
- Memory usage during model loading and inference
- CPU utilization
- GPU usage and VRAM (if WebGPU is available in your browser)

### Tips for Optimal Performance

- Use quantized models (GGUF/GGML) for better performance
- Adjust the context size based on your device capabilities
- For large models, ensure sufficient RAM is available
- Close other resource-intensive applications while running inference

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a99be13b-2f2e-4a9c-9b89-32032132cd9e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a99be13b-2f2e-4a9c-9b89-32032132cd9e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
