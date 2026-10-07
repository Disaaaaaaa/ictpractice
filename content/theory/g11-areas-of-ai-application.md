---
summary: The benefits and risks of artificial intelligence for society, the purpose of virtual and augmented reality, and how AI, machine learning and deep learning are related.
---
# Artificial intelligence in society
@lo 11.4.3.1

:::definition Artificial intelligence (AI)
The ability of a computer system to perform tasks that normally require **human intelligence**, such as recognising speech and images, making decisions, translating languages and learning from experience.
:::

:::compare Advantages and disadvantages of AI
| Advantages | Disadvantages |
|---|---|
| Works 24/7 without tiredness; fast and consistent | Can replace human jobs → unemployment in some sectors |
| Reduces human error in repetitive or precise tasks | Expensive to develop, train and maintain |
| Can work in dangerous places (space, mines, bomb disposal) | Decisions may be **biased** if the training data is biased |
| Analyses huge amounts of data and finds patterns (medicine, finance) | Lack of transparency — hard to explain *why* a decision was made |
| Personalises services (recommendations, learning apps) | Privacy risks — needs large amounts of personal data |
| Assists people with disabilities (voice assistants, text-to-speech) | Can be misused: deepfakes, surveillance, cyber-attacks |
| | Over-reliance; who is responsible when AI makes a mistake? |
:::

:::example Areas of AI application
- **Medicine:** analysing scans to detect cancer, predicting disease risk.
- **Transport:** self-driving cars, route optimisation.
- **Finance:** fraud detection, credit scoring.
- **Education:** adaptive learning platforms, automatic marking.
- **Industry:** robots on production lines, predictive maintenance.
- **Everyday life:** voice assistants, spam filters, face unlock, recommendations.
:::

:::tip
"Identify" questions need short points; "explain" or "discuss" questions need a reason or consequence: "AI can replace cashiers, **which could** increase unemployment among low-skilled workers."
:::

# Virtual reality and augmented reality
@lo 11.4.3.2

:::definition Virtual reality (VR)
A **completely computer-generated 3D environment** that the user feels immersed in, usually through a headset that blocks out the real world, with motion tracking and controllers.
:::

:::definition Augmented reality (AR)
**Digital information is overlaid on the real world**, viewed through a phone camera, tablet or smart glasses. The user still sees their real surroundings.
:::

:::compare VR vs AR
| | Virtual reality | Augmented reality |
|---|---|---|
| Environment | Fully virtual; real world hidden | Real world with digital objects added |
| Equipment | Headset, sensors, controllers | Smartphone, tablet, AR glasses |
| Immersion | Full | Partial |
| Examples | Flight simulators, VR games, virtual tours, surgery training | Pokémon GO, IKEA Place furniture preview, navigation arrows, Google Translate camera |
:::

## Purposes of VR and AR

- **Education and training:** pilots, surgeons and soldiers practise safely; virtual field trips and 3D models in lessons.
- **Medicine:** surgery rehearsal, treating phobias, rehabilitation exercises.
- **Engineering and architecture:** walking through a building before it is built; AR repair instructions over a real machine.
- **Retail:** trying clothes or furniture virtually before buying.
- **Entertainment and tourism:** games, virtual museums, interactive guides.

:::warning
Risks: motion sickness and eye strain, high equipment cost, isolation from the real world, and distraction (e.g. using AR while walking or driving).
:::

# AI, machine learning and deep learning
@lo 11.4.3.3

:::mermaid AI contains machine learning, which contains deep learning
flowchart LR
  subgraph AI[Artificial intelligence]
    subgraph ML[Machine learning]
      DL[Deep learning]
    end
  end
:::

:::cards
### Artificial intelligence
The **broad field**: any technique that makes a machine behave intelligently, including rule-based expert systems written by humans.
### Machine learning (ML)
A **subset of AI** in which the system **learns from data** and improves with experience, instead of following rules programmed by hand. *Example: a spam filter learning from emails marked as spam.*
### Deep learning (DL)
A **subset of ML** that uses **artificial neural networks with many layers** to learn complex patterns from very large data sets (images, sound, text). *Example: face recognition, speech recognition, ChatGPT-style language models.*
:::

:::compare
| | AI | Machine learning | Deep learning |
|---|---|---|---|
| Scope | Widest | Part of AI | Part of ML |
| How it works | Rules or learning | Learns patterns from data | Multi-layer neural networks |
| Data needed | Can work with none (rules) | Moderate amounts, often labelled features | Very large data sets |
| Human input | Rules may be hand-written | Humans choose features | Finds features automatically |
| Hardware | Any | Normal computers | Powerful GPUs |
:::

:::tip
A neat one-line answer: "All deep learning is machine learning, and all machine learning is AI — but not all AI learns from data."
:::
