# Picture-to-Palatable (PtP) 📸➡🍲

## AI-Powered Home Cooking Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Hackathon Project](https://img.shields.io/badge/Project-Hackathon-blueviolet)](https://github.com/yourusername/picture-to-palatable)

Picture-to-Palatable is a multi-modal AI application that transforms the way you approach home cooking. By accepting inputs in various formats (text, speech, images, and videos), it provides personalized recipe recommendations tailored to your specific dietary needs, available ingredients, kitchen tools, and meal plans.

**Developed during a 2-week hackathon to bring AI innovation into your kitchen.**

Hackaton: [The Ultimate, Multi-modal, AI Acceleration Event LPB 25](https://www.kxsb.org/lpb25)

PtP DEMO: TBC

Partners:
<div align="center">
  <p style="width: 80%; margin: 0 auto;">
    <img src="https://github.com/ptbdnr/ptp/blob/main/assets/images/vultr.svg" alt="Vultr" height="100" valign="middle" />
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="https://github.com/ptbdnr/ptp/blob/main/assets/images/mistral.svg" alt="Mistral" height="100" valign="middle" />
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="https://github.com/ptbdnr/ptp/blob/main/assets/images/pinecone.svg" alt="Pinecone" height="100" valign="middle" />
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="https://github.com/ptbdnr/ptp/blob/main/assets/images/lumalabs.svg" alt="LumaLab" height="40" valign="middle" />
  </p>
</div>

## 🌟 Features

- **Multi-Modal Input Processing**:
  - 📝 Text descriptions (e.g., "I want something spicy with chicken")
  - 🎤 Voice commands ("What can I make with eggs and spinach?")
  - 📸 Food image analysis ("What can I cook with these ingredients?")
  - 🎬 Video processing of your pantry or refrigerator

- **Smart Recipe Generation**:
  - 🍽️ Personalized recipe recommendations
  - 📊 Nutrition analysis and dietary requirement matching
  - 🛒 Ingredient substitution suggestions
  - 🥘 Multi-modal recipe output (text, images, voice guidance)

- **Kitchen Management**:
  - ✅ Inventory tracking of available ingredients
  - 🔍 Kitchen tools assessment
  - 📅 Weekly meal planning integration
  - 🥦 Dietary requirements compliance checking

## 🛠️ Architecture

Picture-to-Palatable leverages a modular architecture:
<div align="center">
  <p style="width: 80%; margin: 0 auto;">
    <img src="https://github.com/ptbdnr/ptp/blob/main/assets/hld_v1.0.1.png" alt="High Level Design" max-height="1000" valign="middle" />
  </p>
</div>

1. **Input Processing Module**:
   - Text processing
   - Speech-to-text conversion (perhaps native support on device?)
   - Image recognition
   - Video frame analysis (perhaps via video to image, then image recognition?)

2. **AI Decision Engine**:
   - Dietary requirements analyzer
   - Kitchen inventory management
   - Cooking tools assessment
   - Recipe matching (if available)

4. **Recipe Generation System**:
   - Personalized recipe creation
   - Step-by-step instruction compilation
   - Visual guidance generation
   - Voice instruction synthesis

5. **User Interface**:
   - Web-based dashboard
   - Mobile-responsive design
   - Voice interaction capabilities
   - Real-time feedback system


<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/openapi/openapi-original-wordmark.svg" width="150"/>

[OpenAPI](https://swagger.io/specification/) specification is available [here](https://github.com/ptbdnr/ptp/blob/main/assets/openapi_v1.0.0.yaml).
To review, use an editor like [SwaggerEditor](https://editor.swagger.io/).


## 📋 Hackathon Schedule

### Week 1: Foundation & Core Features

| Day | Focus | Tasks |
|-----|-------|-------|
| 1-2 | Setup & Planning | - Project setup and repository creation<br>- Architecture design<br>- API evaluations and selections |
| 3-4 | Input Processing | - Text/speech processing implementation<br>- Basic image recognition for ingredients<br>- Input validation mechanisms |
| 5-6 | AI Core Logic | - Recipe matching algorithm development<br>- Dietary requirements analyzer<br>- Basic inventory tracking |
| 7 | Integration | - Connect input processing with AI logic<br>- Begin basic UI implementation<br>- Testing initial pipeline |

### Week 2: Enhancement & Polish

| Day | Focus | Tasks |
|-----|-------|-------|
| 8-9 | Advanced Features | - Implement video processing<br>- Enhance recipe generation<br>- Add kitchen tools assessment |
| 10-11 | UI Refinement | - Complete responsive web interface<br>- Add visual guidance components<br>- Implement voice feedback |
| 12-13 | Testing & Optimization | - End-to-end testing<br>- Performance optimization<br>- Fix identified bugs |
| 14 | Documentation & Demo | - Complete documentation<br>- Prepare demonstration<br>- Record demo video |

## 🤔 Key Questions Answered

Picture-to-Palatable helps you answer critical cooking questions:

1. **"What should I cook tonight?"**
   - Based on preferences, available ingredients, and meal history

2. **"Do I have the necessary ingredients?"**
   - Inventory analysis with substitution suggestions

3. **"Do I have the required tools?"**
   - Kitchen equipment assessment for recipe feasibility

4. **"Does this match my dietary requirements?"**
   - Nutrition analysis and dietary compliance checking

5. **"Does this fit my weekly meal plan?"**
   - Integration with meal planning and dietary goals

## 💡 Future Enhancements

- Community recipe sharing
- Grocery shopping list generation and online ordering
- Smart kitchen appliance integration
- Cooking technique tutorials based on recipe requirements
- Leftover ingredient optimization suggestions

## 📄 License

This project is licensed under the MIT License - see the see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to [KXSB LPB25](https://www.kxsb.org/lpb25) for the opportunity
- Special thanks to our mentors and advisors from
  * [Vultr](https://www.vultr.com/)
  * [AMD](https://www.amd.com/)
  * [Pinecone](https://www.pinecone.io/)
  * [Huggingface](https://huggingface.co/)
  * [Mistral AI](https://mistral.ai/)
  * [Luma Labs](https://lumalabs.ai/)
  * [Twelve Labs](https://www.twelvelabs.io/)
- All open-source libraries and APIs that made this project possible

---

**Made with ❤️ by Team Picture-to-Palatable**

Members (in alphabetical order):
* ptbdnr [GitHub](https://github.com/ptbdnr)
