# 🏋️ Gym Simulator — Virtual Test Marketing Platform

AI-powered virtual test marketing simulator for Taisho Pharmaceutical's protein product development. Built with Next.js and Claude AI.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)

## ✨ Features

- 🤖 **AI-Powered Reactions**: Each persona generates unique, contextual responses using Claude AI
- 👥 **8 Default Personas**: Diverse user profiles including gym enthusiasts, wellness-focused individuals, beginners, and more
- 🎨 **Custom Persona Creation**: Build and edit unlimited custom personas with unique traits
- 📊 **Real-Time Analytics**: Track interest rates, sentiment distribution, and persona engagement
- 🎮 **Interactive Simulation**: Watch personas move around a virtual gym environment and react to your product
- 💬 **Dynamic Messaging**: Test multiple product concepts and messaging strategies

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gym-simulator.git
   cd gym-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   ANTHROPIC_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

1. **Enter a Product Concept**: Type your protein product messaging in the input field (e.g., "Pharma-Grade Protein, Backed by Science")

2. **Start Simulation**: Click "🚀 Start Simulation" to see all personas react

3. **Individual Reactions**: Click on any persona in the gym to get their individual reaction

4. **Analyze Results**: View real-time analytics showing interest rates and sentiment distribution

5. **Create Custom Personas**: Go to the "Personas" tab to add, edit, or delete personas

## 📝 Default Personas

| Persona | Age | Type | Key Traits |
|---------|-----|------|------------|
| Hardcore Gym Bro・Takeshi | 28 | hardcore | Obsessed with protein content, cost performance |
| Yoga-Loving OL・Mika | 32 | wellness | Health & beauty focused, Instagram aesthetics |
| Diet Beginner・Yuta | 35 | diet | Complete newbie, values simplicity |
| Fitness Influencer・Aya | 25 | fitness | SNS content creator, brand image conscious |
| Health-Conscious Senior・Hiroshi | 62 | senior | Trusts pharmaceutical brands, safety first |
| Student Athlete・Sota | 17 | student | Budget-conscious, influenced by peers |
| New Mom・Satomi | 30 | mama | Ingredient safety, quick preparation |
| Aspiring Bodybuilder・Ken | 21 | muscle | Checks labels carefully, loves BCAA/HMB |

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Animations
- **AI**: Anthropic Claude 3 Haiku
- **Fonts**: Noto Sans JP (Google Fonts)

## 📂 Project Structure

```
gym-simulator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate-reaction/
│   │   │       └── route.ts          # Claude AI API endpoint
│   │   ├── globals.css               # Global styles & animations
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Main page
│   └── components/
│       └── GymSimulator.tsx          # Main simulator component
├── .env.local                        # Environment variables (create this)
├── .gitignore
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🔑 API Configuration

This project uses the Anthropic Claude API. To get your API key:

1. Visit [https://console.anthropic.com/](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to "API Keys"
4. Create a new key
5. Add it to your `.env.local` file

**Model Used**: `claude-3-haiku-20240307` (fast, cost-effective)

## 🎨 Customization

### Creating Custom Personas

1. Click "👥 Personas" tab
2. Click "＋ Add New Persona"
3. Fill in:
   - **Name**: Display name (e.g., "Yoga Enthusiast・Sara")
   - **Age**: 10-80
   - **Type Tag**: Category for analytics (e.g., "yoga", "wellness")
   - **Traits**: Detailed description of values, behaviors, concerns (this drives AI reactions!)
   - **Icon & Color**: Visual customization

### Modifying Reaction Logic

Edit `/src/app/api/generate-reaction/route.ts` to customize the AI prompt:

```typescript
const prompt = `Your custom prompt here...`;
```

## 📊 Analytics

The simulator tracks:
- **Total Reactions**: Count of all generated responses
- **Interest Rate**: Percentage of positive/interested reactions
- **Persona Types**: Number of unique persona categories engaged
- **Sentiment Distribution**: Breakdown by reaction type (Interested, Curious, Undecided, etc.)

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add `ANTHROPIC_API_KEY` environment variable
4. Deploy

### Other Platforms

Compatible with any Next.js hosting platform. Just ensure:
- Node.js 18+ runtime
- Environment variables are configured
- Build command: `npm run build`
- Start command: `npm start`

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for your own test marketing needs!

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Anthropic Claude](https://www.anthropic.com/)
- Designed for Taisho Pharmaceutical product development

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Note**: This is a simulation tool. Actual consumer research should include real user testing and market validation.
