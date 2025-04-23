# Picture-to-Palatable (PtP) 📸➡🍲

`design name: Plato`

## AI-Powered Home Cooking Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Hackathon Project](https://img.shields.io/badge/Project-Hackathon-blueviolet)](https://github.com/yourusername/picture-to-palatable)

Picture-to-Palatable is a multi-modal AI application that transforms the way you approach home cooking. By accepting inputs in various formats (text, speech, images, and videos), it provides personalized recipe recommendations tailored to your specific dietary needs, available ingredients, kitchen tools, and meal plans.

**Developed during a 2-week hackathon to bring AI innovation into your kitchen.**

Hackaton: [The Ultimate, Multi-modal, AI Acceleration Event LPB 25](https://www.kxsb.org/lpb25)

Delivered:
- Product video: https://youtu.be/B5o5uPj2KiY
- Product access (may break): [link](https://ptp-gamma.vercel.app)


Partners:
<div align="center">
  <p style="width: 80%; margin: 0 auto;">
    <img src="https://github.com/ptbdnr/ptp/blob/main/assets/images/vultr.svg" alt="Vultr" height="100" valign="middle" />
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="https://github.com/ptbdnr/ptp/blob/main/assets/images/AMD.svg" alt="AMD" width="100" valign="middle" />
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="https://github.com/ptbdnr/ptp/blob/main/assets/images/hf.svg" alt="HuggingFace" height="50" valign="middle" />
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="https://github.com/ptbdnr/ptp/blob/main/assets/images/mistral.svg" alt="Mistral" height="100" valign="middle" />
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="https://github.com/ptbdnr/ptp/blob/main/assets/images/lumalabs.svg" alt="Luma" height="40" valign="middle" />
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="https://github.com/ptbdnr/ptp/blob/main/assets/images/pinecone.svg" alt="Pinecone" height="100" valign="middle" />
    &nbsp;&nbsp;&nbsp;&nbsp;
  </p>
</div>

## 🌟 Features

- **Multi-Modal Input Processing**:
  - 📝 Text descriptions (e.g., "I got 200g feta, one cucumber, and 200g tomatoes.")
  - 🎤 Voice commands ("Just bought some salad and 3 peppers")
  - 📸 Food image analysis (e.g. fridge content)


- **Smart Recipe Generation**:
  - 🍽️ Personalized recipe recommendations
  - 📊 Nutrition analysis and dietary requirement matching
  - 🛒 Ingredient substitution suggestions
  - 🥘 Multi-modal recipe output (text, images, video)

- **Kitchen Management**:
  - ✅ Inventory tracking of available ingredients
  - 🥦 Dietary requirements compliance checking

## 🛠️ Architecture

Picture-to-Palatable leverages a modular architecture:
<div align="center">
  <p style="width: 80%; margin: 0 auto;">
    <img src="https://github.com/ptbdnr/ptp/blob/main/design/architecture/hld_v1.0.1.png" alt="High Level Design" max-height="1000" valign="middle" />
  </p>
</div>

1. **Input Processing Module**:
   - Text processing
   - Speech-to-text conversion
   - Image recognition

2. **AI Decision Engine**:
   - Dietary requirements analyzer
   - Kitchen inventory management
   - Recipe matching (if available)

4. **Recipe Generation System**:
   - Personalized recipe creation
   - Step-by-step instruction compilation
   - Visual guidance generation

5. **User Interface**:
   - Web-based dashboard
   - Mobile-responsive design
   - Voice interaction capabilities
   - Real-time feedback system


<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/openapi/openapi-original-wordmark.svg" width="150"/>

[OpenAPI](https://swagger.io/specification/) specification is [available](https://github.com/ptbdnr/ptp/blob/main/assets/openapi_v1.0.0.yaml), load it to [SwaggerEditor](https://editor.swagger.io/).


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

3. **"Does this match my dietary requirements?"**
   - Nutrition analysis and dietary compliance checking


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
* BZcreativ [GitHub](https://github.com/BZcreativ)
* hirenumradia [GitHub](https://github.com/hirenumradia)
* Peter [GitHub: ptbdnr](https://github.com/ptbdnr)
* [Stefania Liashuk](mailto:stefanialiashuk@gmail.com)
* [Zain Rehman](https://www.linkedin.com/in/zainrehman?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app)
