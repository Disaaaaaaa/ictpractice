---
summary: What artificial intelligence is, how AI, machine learning and deep learning differ, where AI is used, its advantages and disadvantages for society, and the purpose of virtual and augmented reality.
---
# What artificial intelligence is
@lo 11.4.3.3

:::definition Artificial intelligence (AI)
The ability of a computer system to perform tasks that normally need **human intelligence** — such as **recognising images and speech, understanding language, making decisions, solving problems and learning from experience**.
:::

:::cards
### Narrow (weak) AI
Designed for **one specific task**, and often better than humans at it: a chess program, face unlock on a phone, a spam filter, a voice assistant, a self-driving car's vision system. **All AI in use today is narrow AI.**
### General (strong) AI
A hypothetical system with **human-level intelligence across all tasks** — it could learn anything a person can. It **does not exist yet**.
:::

:::callout info Rule-based AI vs learning AI
Early AI followed **rules written by programmers** (e.g. expert systems: *IF temperature > 38 AND cough THEN flu*). Modern AI mostly **learns the rules itself from data** — this is **machine learning**.
:::

# AI, machine learning and deep learning
@lo 11.4.3.3

:::ascii AI contains machine learning, which contains deep learning
+------------------------------------------------------------+
|  ARTIFICIAL INTELLIGENCE  - any technique that makes        |
|  computers behave intelligently (rules, search, learning)   |
|    +----------------------------------------------------+   |
|    |  MACHINE LEARNING - systems that learn patterns    |   |
|    |  from data instead of being explicitly programmed  |   |
|    |    +------------------------------------------+    |   |
|    |    |  DEEP LEARNING - machine learning using  |    |   |
|    |    |  neural networks with many hidden layers |    |   |
|    |    +------------------------------------------+    |   |
|    +----------------------------------------------------+   |
+------------------------------------------------------------+
:::

:::definition Machine learning (ML)
A branch of AI in which a computer **learns from data** (examples) to find **patterns** and make **predictions or decisions**, and **improves with experience**, **without being explicitly programmed** with the rules.
:::

:::definition Deep learning (DL)
A branch of machine learning that uses **artificial neural networks with many hidden layers** ("deep" networks) to learn **complex features automatically** from very large amounts of **unstructured data** such as images, sound and text.
:::

:::compare Three ways a machine can learn
| Type | How it learns | Example |
|---|---|---|
| **Supervised learning** | From **labelled** examples (input + correct answer) | Thousands of e-mails labelled *spam / not spam* → the model learns to classify new e-mails |
| **Unsupervised learning** | Finds **groups or patterns** in **unlabelled** data | A shop groups its customers by buying habits |
| **Reinforcement learning** | Learns by **trial and error**, receiving **rewards** or penalties | A program learns to play a game or a robot learns to walk |
:::

:::mermaid A neural network: input layer, hidden layers, output layer
flowchart LR
  I1((Pixel 1)) --> H1((H))
  I1 --> H2((H))
  I2((Pixel 2)) --> H1
  I2 --> H2
  I3((Pixel 3)) --> H1
  I3 --> H2
  H1 --> J1((H))
  H2 --> J1
  H1 --> J2((H))
  H2 --> J2
  J1 --> O1((Cat))
  J2 --> O1
  J1 --> O2((Dog))
  J2 --> O2
:::

:::steps How a neural network learns (training)
- Each connection between neurons has a **weight** (how important it is).
- Training data (e.g. labelled photos) is passed through the network, which makes a **prediction**.
- The prediction is compared with the correct answer; the **error** is calculated.
- The weights are **adjusted** to reduce the error (back-propagation).
- This is repeated thousands of times until the network is accurate. With **many hidden layers**, it is **deep learning**.
:::

:::callout success Try it: TensorFlow Playground
On **playground.tensorflow.org** you can build a small neural network in the browser, add hidden layers and neurons, and watch it learn to separate coloured dots. More hidden layers = a "deeper" network that can learn more complex patterns.
:::

:::compare AI vs machine learning vs deep learning
| | Artificial intelligence | Machine learning | Deep learning |
|---|---|---|---|
| What it is | The **broad field**: machines that act intelligently | A **subset of AI**: learning from data | A **subset of ML**: learning with deep neural networks |
| How rules are obtained | Can be **programmed rules** or learnt | **Learnt from data** | Learnt from data; **features found automatically** |
| Human input | Experts may write all the rules | Humans often choose the **features** to use (feature engineering) | Little feature engineering — the network finds features itself |
| Amount of data | Can work with little data (rule-based) | Medium amounts | **Very large** amounts |
| Computing power | Low to medium | Medium | **Very high** (GPUs) |
| Explainability | Rule-based systems are easy to explain | Fairly easy | Hard — a **"black box"** |
| Examples | Chess program, expert system, route planner | Spam filter, price prediction, film recommendations | Face recognition, voice assistants, self-driving cars, ChatGPT-style language models |
:::

:::tip Remember
**Every** deep-learning system is machine learning, and **every** machine-learning system is AI — but **not** the other way round. An expert system with hand-written rules is AI but **not** machine learning.
:::

# Areas where AI is applied
@lo 11.4.3.1

:::compare AI in different areas
| Area | Examples of AI |
|---|---|
| **Medicine** | Diagnosing diseases from X-rays and MRI scans; predicting patient risk; drug discovery; robot-assisted surgery |
| **Transport** | Self-driving cars; traffic-light control; route planning and traffic prediction; autopilot |
| **Education** | Adaptive learning platforms that adjust tasks to each student; automatic marking; AI tutors and chatbots |
| **Finance** | Fraud detection on bank cards; credit scoring; algorithmic trading; chatbots in banking apps |
| **Industry** | Robots on production lines; predicting machine failures (predictive maintenance); quality control with cameras |
| **Retail / entertainment** | Product and film recommendations; personalised advertising; game characters that react to the player |
| **Security** | Face recognition at airports; spotting unusual network activity; spam and malware filters |
| **Everyday life** | Voice assistants; machine translation; photo enhancement; smart home devices |
| **Agriculture / environment** | Drones that detect crop disease; weather and climate prediction |
:::

# Advantages and disadvantages of AI for society
@lo 11.4.3.1

:::cards
### Advantages
- **Works 24/7** without tiredness, and **faster** than humans on many tasks.
- **Fewer human errors** — consistent decisions (e.g. detecting tumours on scans that a tired doctor might miss).
- Can do **dangerous, dirty or repetitive** jobs (bomb disposal, mining, space exploration, assembly lines).
- **Analyses huge amounts of data** to find patterns humans cannot see (fraud, disease outbreaks, climate).
- **Personalised services** — learning at your own pace, recommendations, health advice.
- Helps people with **disabilities** (speech-to-text, image description for blind users).
- Creates **new jobs** (AI engineers, data scientists) and economic growth.
### Disadvantages
- **Job losses** — routine jobs (drivers, cashiers, call-centre staff, factory workers) can be automated.
- **Bias and unfairness** — an AI trained on biased data makes biased decisions (e.g. in hiring or loans).
- **Privacy** — AI needs large amounts of **personal data**; mass surveillance with face recognition.
- **Lack of transparency** — deep learning is a "black box"; it is hard to explain decisions.
- **Accountability** — who is responsible if a self-driving car causes an accident?
- **Misuse** — deepfakes, fake news, cyber-attacks, autonomous weapons.
- **High cost** to develop, and large **energy** use for training.
- **Over-reliance** — people may lose skills or trust AI even when it is wrong; AI has no common sense or empathy.
:::

:::example Advantage + explanation (exam style)
**Q: Identify one advantage and one disadvantage of using AI in hospitals. [2]**
Advantage: AI can analyse scans **quickly and accurately**, so diseases are diagnosed **earlier** (1).
Disadvantage: if the AI makes a wrong diagnosis it is **unclear who is responsible** / patients' **personal data** must be shared to train it (1).
:::

# The purpose of virtual and augmented reality
@lo 11.4.3.2

:::definition Virtual reality (VR)
A **computer-generated 3D environment** that **completely replaces** the user's view of the real world. The user wears a **headset** that tracks head movements and often uses **hand controllers**, so they feel **present (immersed)** in the virtual world and can interact with it. Example: Meta Quest, PlayStation VR.
:::

:::definition Augmented reality (AR)
Technology that **adds computer-generated information** (images, text, 3D objects, sound) **on top of the user's view of the real world**, in real time, using a phone/tablet camera or AR glasses. The real world is still seen. Examples: Pokémon GO, Google Lens translation, IKEA Place furniture app, Snapchat filters.
:::

:::compare Purposes of VR and AR
| Purpose | Virtual reality | Augmented reality |
|---|---|---|
| **Education and training** | Pilots in flight simulators; surgeons practise operations; virtual school trips to space or history | Pointing a tablet at a textbook shows a 3D heart beating; labelled star maps |
| **Medicine** | Therapy for phobias; pain distraction; rehabilitation exercises | Showing veins or organs over the patient's body during surgery |
| **Industry / engineering** | Walking through a building or car design before it is built | Repair instructions shown over a real machine |
| **Shopping / design** | Virtual showrooms | Seeing how furniture or clothes look in your room / on you |
| **Entertainment** | Immersive games, virtual concerts | Location-based games, filters |
| **Navigation / tourism** | Virtual tours of museums and cities | Arrows on the street view; information about a building you look at |
:::

:::compare VR vs AR
| | Virtual reality | Augmented reality |
|---|---|---|
| Real world | **Replaced** completely | **Still visible**, with digital objects added |
| Equipment | Headset (and controllers) | Phone, tablet or AR glasses |
| Immersion | Full | Partial |
| Movement | Limited; risk of bumping into things | User can move around normally |
:::

:::callout info More in Grade 12
VR and AR are studied in more detail in the Grade 12 topic **Virtual and augmented reality**.
:::

# Exam practice and summary
@lo 11.4.3.1 11.4.3.2 11.4.3.3

:::example Exam-style answers
**Q: Identify two differences between machine learning and deep learning. [2]**
Deep learning uses **neural networks with many layers**, whereas machine learning can use simpler models (1). Deep learning needs **much more data and computing power** than other machine-learning methods / finds the **features automatically**, whereas in ML humans often choose the features (1).

**Q: State the difference between artificial intelligence and machine learning. [1]**
AI is the **broad field** of making machines behave intelligently; ML is a **subset of AI** in which the machine **learns from data** instead of following programmed rules.

**Q: Identify two disadvantages of using AI in society. [2]**
**Job losses** as routine work is automated (1); **biased decisions** if the AI is trained on biased data (1).

**Q: Explain the purpose of augmented reality in education. [2]**
AR **adds digital 3D models and information to the real view** (1), so students can see and interact with things that are hard to imagine, e.g. a 3D model of the solar system on their desk (1).
:::

:::warning Common mistakes
- Treating AI, ML and DL as three **separate** things — they are **nested**: DL ⊂ ML ⊂ AI.
- Saying machine learning "is programmed with all the rules" — it **learns the rules from data**.
- Writing "AI will take all jobs" without explaining — say **which** jobs and **why** (routine, repetitive tasks).
- Mixing up VR (**replaces** the real world) and AR (**adds to** the real world).
- Giving a disadvantage that is really the opposite of an advantage already given.
:::

:::steps Check yourself
- Define AI, machine learning and deep learning.
- Draw the nested diagram of AI, ML and DL.
- Name three types of machine learning with an example of each.
- Give three areas where AI is used and an example in each.
- Give three advantages and three disadvantages of AI for society.
- What is the difference between VR and AR? Give a purpose of each.
:::
