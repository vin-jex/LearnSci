import "dotenv/config";
import { PrismaClient, QuestionType, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedAdmin = await bcrypt.hash("admin1234", 12);
  const hashedLearner = await bcrypt.hash("learner1234", 12);

  await prisma.user.upsert({
    where: { email: "admin@cal.edu" },
    update: { role: Role.ADMIN },
    create: {
      name: "Admin User",
      email: "admin@cal.edu",
      password: hashedAdmin,
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "learner@cal.edu" },
    update: {},
    create: {
      name: "Ada Okonkwo",
      email: "learner@cal.edu",
      password: hashedLearner,
      role: Role.LEARNER,
      emailVerified: true,
    },
  });

  await seedTopic({
    id: "topic-photosynthesis",
    title: "Photosynthesis",
    titleIgbo: "Ọrụ Anyanwụ (Photosynthesis)",
    description:
      "Learn how plants make their own food using sunlight, water, and carbon dioxide.",
    descriptionIgbo:
      "Mụta otu osisi si emepụta nri ha site n'ìhè anyanwụ, mmiri, na ikuku carbon dioxide.",
    duration: "20 mins",
    order: 1,
    lessonId: "lesson-photo-1",
    lessonContent: LESSON_PHOTOSYNTHESIS,
    igboContent: LESSON_PHOTOSYNTHESIS_IGBO,
    keyTerms: KT_PHOTOSYNTHESIS,
    questions: Q_PHOTOSYNTHESIS,
  });

  await seedTopic({
    id: "topic-cell-structure",
    title: "Cell Structure",
    titleIgbo: "Nhazi Mkpụrụ Ndụ (Cell Structure)",
    description:
      "Explore the building blocks of life and understand the role of each organelle.",
    descriptionIgbo:
      "Nyochaa ihe ndị mejupụtara ndụ ma ghọta ọrụ akụkụ ọ bụla n'ime mkpụrụ ndụ.",
    duration: "25 mins",
    order: 2,
    lessonId: "lesson-cell-1",
    lessonContent: LESSON_CELL_STRUCTURE,
    igboContent: LESSON_CELL_STRUCTURE_IGBO,
    keyTerms: KT_CELL_STRUCTURE,
    questions: Q_CELL_STRUCTURE,
  });

  await seedTopic({
    id: "topic-digestion",
    title: "Human Digestive System",
    titleIgbo: "Usoro Ịgbaze Nri (Human Digestive System)",
    description:
      "Trace the journey of food through the human body and understand how nutrients are absorbed.",
    descriptionIgbo:
      "Chọpụta otu nri si agafe n'ahụ mmadụ na otu ahụ si amịkọrọ ihe ndị na-edozi ahụ.",
    duration: "30 mins",
    order: 3,
    lessonId: "lesson-digestion-1",
    lessonContent: LESSON_DIGESTION,
    igboContent: LESSON_DIGESTION_IGBO,
    keyTerms: KT_DIGESTION,
    questions: Q_DIGESTION,
  });

  await seedTopic({
    id: "topic-ecosystems",
    title: "Ecosystems and Food Chains",
    titleIgbo: "Usoro Obibi na Nri (Ecosystems and Food Chains)",
    description:
      "Understand how living things interact with each other and their environment.",
    descriptionIgbo:
      "Ghọta otu ihe ndị dị ndụ si emekọrịta ihe n'etiti onwe ha na gburugburu ha.",
    duration: "25 mins",
    order: 4,
    lessonId: "lesson-eco-1",
    lessonContent: LESSON_ECOSYSTEMS,
    igboContent: LESSON_ECOSYSTEMS_IGBO,
    keyTerms: KT_ECOSYSTEMS,
    questions: Q_ECOSYSTEMS,
  });

  await seedTopic({
    id: "topic-reproduction",
    title: "Human Reproductive System",
    titleIgbo: "Usoro Ịmụ Nwa (Human Reproductive System)",
    description:
      "Learn about the organs and processes involved in human reproduction and development.",
    descriptionIgbo:
      "Mụta banyere akụkụ na usoro dị iche iche na-enyere mmadụ aka ịmụ nwa na itolite.",
    duration: "30 mins",
    order: 5,
    lessonId: "lesson-repro-1",
    lessonContent: LESSON_REPRODUCTION,
    igboContent: LESSON_REPRODUCTION_IGBO,
    keyTerms: KT_REPRODUCTION,
    questions: Q_REPRODUCTION,
  });

  await seedTopic({
    id: "topic-states-matter",
    title: "States of Matter",
    titleIgbo: "Ụdị Ihe Dị Iche Iche (States of Matter)",
    description:
      "Discover the properties of solids, liquids, and gases and how matter changes between states.",
    descriptionIgbo:
      "Chọpụta njirimara nke ihe siri ike, mmiri, na ikuku, na otu ihe si agbanwe site n'otu ụdị gaa na nke ọzọ.",
    duration: "20 mins",
    order: 6,
    lessonId: "lesson-matter-1",
    lessonContent: LESSON_STATES_OF_MATTER,
    igboContent: LESSON_STATES_OF_MATTER_IGBO,
    keyTerms: KT_STATES_OF_MATTER,
    questions: Q_STATES_OF_MATTER,
  });

  await seedTopic({
    id: "topic-electricity",
    title: "Electricity and Circuits",
    titleIgbo: "Ọkụ Eletrik na Uzọ Ya (Electricity and Circuits)",
    description:
      "Understand electric current, voltage, resistance, and how to build simple circuits.",
    descriptionIgbo:
      "Ghọta otu ọkụ eletrik si agba, ike ya, na otu esi emepụta usoro ọkụ dị mfe.",
    duration: "30 mins",
    order: 7,
    lessonId: "lesson-elec-1",
    lessonContent: LESSON_ELECTRICITY,
    igboContent: LESSON_ELECTRICITY_IGBO,
    keyTerms: KT_ELECTRICITY,
    questions: Q_ELECTRICITY,
  });

  await seedTopic({
    id: "topic-genetics",
    title: "Genetics and Heredity",
    titleIgbo: "Ihe Nketa na Mkpụrụ Ndụ (Genetics and Heredity)",
    description:
      "Explore how traits are inherited from parents to offspring through genes and chromosomes.",
    descriptionIgbo:
      "Nyochaa otu àgwà si esi n'aka nne na nna agafere n'aka ụmụ site na mkpụrụ ndụ ihe nketa na chromosomes.",
    duration: "35 mins",
    order: 8,
    lessonId: "lesson-gen-1",
    lessonContent: LESSON_GENETICS,
    igboContent: LESSON_GENETICS_IGBO,
    keyTerms: KT_GENETICS,
    questions: Q_GENETICS,
  });

  console.log("✅ Seed complete");
  console.log("   Admin:   admin@cal.edu   / admin1234");
  console.log("   Learner: learner@cal.edu / learner1234");
  console.log("   8 topics seeded with lessons, key terms, and questions.");
}

async function seedTopic(opts: {
  id: string;
  title: string;
  titleIgbo: string;
  description: string;
  descriptionIgbo: string;
  duration: string;
  order: number;
  lessonId: string;
  lessonContent: string;
  igboContent: string;
  keyTerms: {
    id: string;
    englishTerm: string;
    igboTerm: string;
    igboExplanation: string | null;
  }[];
  questions: {
    id: string;
    type: QuestionType;
    questionText: string;
    questionTextIgbo: string;
    options: string[] | null;
    optionsIgbo: string[] | null;
    correctAnswer: string;
    feedbackRules: object;
    difficulty?: number;
  }[];
}) {
  const topic = await prisma.topic.upsert({
    where: { id: opts.id },
    update: {
      title: opts.title,
      titleIgbo: opts.titleIgbo,
      description: opts.description,
      descriptionIgbo: opts.descriptionIgbo,
      duration: opts.duration,
      order: opts.order,
      published: true,
    },
    create: {
      id: opts.id,
      title: opts.title,
      titleIgbo: opts.titleIgbo,
      description: opts.description,
      descriptionIgbo: opts.descriptionIgbo,
      duration: opts.duration,
      order: opts.order,
      published: true,
    },
  });

  await prisma.lesson.upsert({
    where: { id: opts.lessonId },
    update: {
      content: opts.lessonContent,
      igboContent: opts.igboContent,
    },
    create: {
      id: opts.lessonId,
      topicId: topic.id,
      order: 1,
      content: opts.lessonContent,
      igboContent: opts.igboContent,
    },
  });

  for (const t of opts.keyTerms) {
    await prisma.keyTerm.upsert({
      where: { id: t.id },
      update: {
        englishTerm: t.englishTerm,
        igboTerm: t.igboTerm,
        igboExplanation: t.igboExplanation,
      },
      create: {
        id: t.id,
        topicId: topic.id,
        englishTerm: t.englishTerm,
        igboTerm: t.igboTerm,
        igboExplanation: t.igboExplanation,
      },
    });
  }

  for (const q of opts.questions) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {
        type: q.type,
        questionText: q.questionText,
        questionTextIgbo: q.questionTextIgbo,
        options: q.options ?? [],
        optionsIgbo: q.optionsIgbo ?? [],
        correctAnswer: q.correctAnswer,
        feedbackRules: q.feedbackRules,
        difficulty: q.difficulty ?? 0.5,
      },
      create: {
        id: q.id,
        topicId: topic.id,
        type: q.type,
        questionText: q.questionText,
        questionTextIgbo: q.questionTextIgbo,
        options: q.options ?? [],
        optionsIgbo: q.optionsIgbo ?? [],
        correctAnswer: q.correctAnswer,
        feedbackRules: q.feedbackRules,
        difficulty: q.difficulty ?? 0.5,
      },
    });
  }
}

// ═══════════════════════════════════════════════════════════════════
// LESSON CONTENT (ENGLISH & IGBO VERSIONS)
// ═══════════════════════════════════════════════════════════════════

const LESSON_PHOTOSYNTHESIS = `## What is Photosynthesis?

Photosynthesis is the process by which **green plants**, algae, and some bacteria use sunlight to convert carbon dioxide and water into glucose and oxygen. It is one of the most important biological processes on Earth - it forms the foundation of almost every food chain and produces the oxygen we breathe.

### The Photosynthesis Equation

> 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

### Where Does It Happen?

Photosynthesis takes place in the **chloroplast** - a specialised organelle found only in plant cells. Inside the chloroplast is the green pigment **chlorophyll**, which absorbs red and blue light to power the reaction.

### The Two Stages

1. **Light-dependent reactions** - occur in the thylakoid membranes. Light energy splits water molecules, releasing oxygen and producing energy carriers (ATP and NADPH).
2. **Light-independent reactions (Calvin Cycle)** - occur in the stroma. Carbon dioxide is fixed using the energy from stage one to build glucose.

### Inputs and Outputs

| Input | Source |
|---|---|
| Carbon dioxide (CO₂) | Air - enters through stomata |
| Water (H₂O) | Soil - absorbed through roots |
| Light energy | Sunlight |

| Output | Fate |
|---|---|
| Glucose (C₆H₁₂O₆) | Used for energy or stored as starch |
| Oxygen (O₂) | Released into the air |

### Factors Affecting the Rate of Photosynthesis

- **Light intensity** - more light increases the rate up to a saturation point
- **Carbon dioxide concentration** - higher CO₂ increases the rate
- **Temperature** - enzymes work best around 25–35°C; too hot denatures them
- **Water availability** - shortage causes stomata to close, limiting CO₂ intake`;

const LESSON_PHOTOSYNTHESIS_IGBO = `## Gịnị bụ Ọrụ Anyanwụ (Photosynthesis)?

Photosynthesis bụ usoro **osisi ndụ**, algae, na ụfọdụ bacteria na-eji ìhè anyanwụ agbanwe ikuku carbon dioxide na mmiri ka ọ ghọọ shuga (glucose) na ikuku ndụ (oxygen). Ọ bụ otu n'ime usoro kachasị mkpa n'ụwa - ọ bụ ntọala nke ihe fọrọ nke nta ka ọ bụrụ usoro nri niile ma na-emepụta oxygen anyị na-ekuru.

### Akara Ngosi Ọrụ Anyanwụ (Equation)

> 6CO₂ + 6H₂O + ike ọkụ anyanwụ → C₆H₁₂O₆ + 6O₂

### Ebe Ọ Na-eme?

Photosynthesis na-eme n'ime **chloroplast** - akụkụ pụrụ iche a na-ahụ naanị na mkpụrụ ndụ osisi. N'ime chloroplast, e nwere agba ndụ a na-akpọ **chlorophyll**, nke na-amịkọrọ ìhè uhie na anụnụ iji nye ike maka usoro a.

### Usoro Abụọ ahụ

1. **Mmeghachi omume dabere na ìhè (Light-dependent)** - na-eme na thylakoid membranes. Ike anyanwụ na-agbaji mmiri, na-ewepụta oxygen ma na-emepụta ihe na-ebu ike (ATP na NADPH).
2. **Mmeghachi omume na-adabereghị na ìhè (Calvin Cycle)** - na-eme na stroma. A na-eji ike sitere n'usoro nke mbụ emepụta glucose site na carbon dioxide.

### Ihe Na-abata na Ihe Na-apụta

| Ihe Na-abata (Input) | Ebe O si bịa |
|---|---|
| Carbon dioxide (CO₂) | Ikuku - na-esi na stomata abata |
| Mmiri (H₂O) | Ala - mgbọrọgwụ na-amịkọrọ ya |
| Ike ọkụ | Anyanwụ |

| Ihe Na-apụta (Output) | Ihe Ọ na-aghọ |
|---|---|
| Glucose (C₆H₁₂O₆) | A na-eji ya eme ihe maka ike ma ọ bụ chekwaa ya dị ka starch |
| Oxygen (O₂) | A na-ahapụ ya n'ikuku |

### Ihe Ndị Na-emetụta Ọsọ nke Photosynthesis

- **Ike ìhè (Light intensity)** - ìhè ka ukwuu na-eme ka ọ gbaa ọsọ ruo n'ókè ụfọdụ
- **Ntinye uche nke carbon dioxide** - carbon dioxide ka ukwuu na-eme ka ọ gbaa ọsọ
- **Okpomọkụ** - enzymes na-arụ ọrụ kacha mma n'agbata 25–35°C; okpomọkụ karịrị akarị na-emebi ha
- **Inweta mmiri** - ụkọ mmiri na-eme ka stomata mechie, na-egbochi mbata carbon dioxide`;

const LESSON_CELL_STRUCTURE = `## What is a Cell?

A **cell** is the basic structural and functional unit of all living organisms. Every living thing is made of cells. Some organisms consist of just one cell (unicellular), while humans are made of trillions (multicellular).

### Cell Theory

1. All living organisms are made of one or more cells
2. The cell is the basic unit of life
3. All cells arise from pre-existing cells

### Key Organelles

**Nucleus** - the control centre. Contains DNA in chromosomes. Surrounded by a nuclear membrane with pores.

**Cell Membrane** - a selectively permeable phospholipid bilayer. Controls what enters and exits the cell.

**Cytoplasm** - gel-like fluid that fills the cell. Most chemical reactions occur here.

**Mitochondria** - site of aerobic respiration. Produces ATP energy. Has a folded inner membrane (cristae) to increase surface area.

**Ribosomes** - site of protein synthesis. Found on rough endoplasmic reticulum or free in cytoplasm.

**Golgi Apparatus** - packages and dispatches proteins to their destinations.

**Vacuole** - storage organelle. Large and central in plant cells; small in animal cells.

**Cell Wall** - plant cells only. Made of cellulose. Gives rigidity and shape.

**Chloroplasts** - plant cells only. Site of photosynthesis. Contains chlorophyll.

### Comparing Plant and Animal Cells

| Feature | Animal Cell | Plant Cell |
|---|---|---|
| Cell wall | ✗ | ✓ (cellulose) |
| Chloroplasts | ✗ | ✓ |
| Large vacuole | ✗ | ✓ |
| Cell membrane | ✓ | ✓ |
| Nucleus | ✓ | ✓ |
| Mitochondria | ✓ | ✓ |

### Specialised Cells

- **Red blood cells** - no nucleus, biconcave shape, carry haemoglobin for oxygen
- **Nerve cells** - long axons for transmitting electrical signals
- **Root hair cells** - large surface area for absorbing water and minerals`;

const LESSON_CELL_STRUCTURE_IGBO = `## Gịnị bụ Mkpụrụ Ndụ (Cell)?

**Mkpụrụ ndụ** bụ ntọala nhazi na ọrụ nke ihe niile dị ndụ. Ihe ọ bụla dị ndụ bụ mkpụrụ ndụ mejupụtara ya. Ụfọdụ ihe dị ndụ nwere naanị otu mkpụrụ ndụ (unicellular), ebe ụmụ mmadụ nwere ọtụtụ ijeri (multicellular).

### Ozizi Mkpụrụ Ndụ (Cell Theory)

1. Ihe niile dị ndụ nwere otu mkpụrụ ndụ ma ọ bụ karịa
2. Mkpụrụ ndụ bụ ntọala nke ndụ
3. Mkpụrụ ndụ ọhụrụ na-esi n'ime mkpụrụ ndụ dịbu adị pụta

### Akụkụ Ndị Dị Mkpa (Organelles)

**Nucleus** - isi njikwa. Ọ nwere DNA n'ime chromosomes. Akpụkpọ nwere oghere na-agba ya gburugburu.

**Mgbidi Mkpụrụ Ndụ (Cell Membrane)** - akwa oyi akwa na-ahọrọ ihe na-abata. Ọ na-achịkwa ihe na-abata na ihe na-apụ apụ na mkpụrụ ndụ.

**Cytoplasm** - mmiri na-agba agba na-ejupụta mkpụrụ ndụ. Ọtụtụ mmeghachi omume kemịkal na-eme ebe a.

**Mitochondria** - ebe a na-emepụta ike site na ikuku oxygen. Ọ na-ewepụta ike ATP. Ọ nwere akpụkpọ dị n'ime gbakọrọ agbakọ iji mụbaa ohere ọrụ.

**Ribosomes** - ebe a na-emepụta protein. A na-ahụ ha na rough endoplasmic reticulum ma ọ bụ na ha nọ n'efu na cytoplasm.

**Golgi Apparatus** - ọ na-ejikọta ma na-eziga protein ebe ha kwesịrị ịga.

**Vacuole** - akụkụ nchekwa. Ọ na-ebu ibu ma dị n'etiti na mkpụrụ ndụ osisi; ọ dị obere na mkpụrụ ndụ anụmanụ.

**Mgbidi Cell (Cell Wall)** - naanị na mkpụrụ ndụ osisi. Ejiri cellulose mee ya. Ọ na-eme ka mkpụrụ ndụ sie ike ma nwee ọdịdị.

**Chloroplasts** - naanị na mkpụrụ ndụ osisi. Ebe photosynthesis na-eme. Ọ nwere chlorophyll.

### Ntụle Mkpụrụ Ndụ Osisi na Anụmanụ

| Njirimara | Mkpụrụ Ndụ Anụmanụ | Mkpụrụ Ndụ Osisi |
|---|---|---|
| Cell wall | ✗ | ✓ (cellulose) |
| Chloroplasts | ✗ | ✓ |
| Large vacuole | ✗ | ✓ |
| Cell membrane | ✓ | ✓ |
| Nucleus | ✓ | ✓ |
| Mitochondria | ✓ | ✓ |

### Mkpụrụ Ndụ Pụrụ Iche

- **Mkpụrụ ndụ ọbara uhie** - enweghị nucleus, nwee ọdịdị biconcave, na-ebu haemoglobin maka oxygen
- **Mkpụrụ ndụ akwara (Nerve cells)** - nwere axons ogologo maka iziga ozi eletrik
- **Root hair cells** - nwere ohere mbara maka ịmịkọrọ mmiri na mineral`;

const LESSON_DIGESTION = `## The Human Digestive System

The digestive system breaks down food into small molecules that can be absorbed into the blood. This involves **mechanical digestion** (physical breakdown) and **chemical digestion** (enzyme action).

### The Digestive Pathway

**Mouth** - Teeth provide mechanical digestion. Salivary amylase begins starch digestion.

**Oesophagus** - Muscular tube. Food is pushed down by **peristalsis** (wave-like muscle contractions).

**Stomach** - Churns food mechanically. Gastric glands secrete hydrochloric acid (pH 2) and pepsin (a protease that digests proteins).

**Small Intestine** - Main site of digestion AND absorption. The liver produces bile (stored in the gallbladder) which emulsifies fats. The pancreas produces amylase, lipase, and protease. Villi and microvilli create a huge surface area for absorption.

**Large Intestine** - Absorbs water from undigested food. Remaining waste forms faeces.

**Rectum and Anus** - Stores and expels faeces.

### Enzymes Summary

| Enzyme | Substrate | Product | Location |
|---|---|---|---|
| Amylase | Starch | Maltose | Mouth, small intestine |
| Pepsin (protease) | Proteins | Peptides | Stomach |
| Lipase | Fats | Fatty acids + glycerol | Small intestine |

### Absorption in the Small Intestine

The ileum is adapted for absorption by:
- **Villi** - finger-like projections that increase surface area
- **Microvilli** - tiny projections on villus cells (brush border)
- **Rich blood supply** - maintains concentration gradient
- **Thin walls** - short diffusion distance`;

const LESSON_DIGESTION_IGBO = `## Usoro Ịgbaze Nri (Human Digestive System)

Usoro ịgbaze nri na-agbaji nri ka ọ bụrụ irighiri ihe nwere ike ịbanye n'ime ọbara. Nke a na-agụnye **ịgbaze nri n'ụzọ anụ ahụ** (mechanical digestion) na **ịgbaze nri n'ụzọ kemịkal** (enzyme action).

### Ụzọ Nri Na-agbaso

**Ọnụ** - Eze na-apịa nri. Amylase nke mmiri ọnụ na-amalite ịgbaze starch.

**Oesophagus** - Eriri akwara. A na-eji **peristalsis** (akwara na-agbakọ dịka ebili mmiri) akwaba nri na ya.

**Afọ (Stomach)** - Ọ na-agwakọta nri n'ụzọ anụ ahụ. Gastric glands na-ewepụta hydrochloric acid (pH 2) na pepsin (enzyme na-agbaze protein).

**Eriri afọ Nta (Small Intestine)** - Isi ebe nri na-agbaze MA na-abanye n'ọbara. Imeju na-emepụta bile (nke a na-echekwa na gallbladder) nke na-eme ka abụba gbazee. Pancreas na-emepụta amylase, lipase, na protease. Villi na microvilli na-emepụta ohere buru ibu maka nri ịbanye n'ọbara.

**Eriri afọ Ukwu (Large Intestine)** - Ọ na-amịkọrọ mmiri site na nri na-agbazereghị. Ihe fọdụrụ na-aghọ nsị.

**Rectum na Anus** - Ọ na-echekwa ma na-ewepụta nsị.

### Nchịkọta Enzymes

| Enzyme | Ihe ọ na-arụrụ ọrụ (Substrate) | Ihe ọ na-emepụta (Product) | Ebe ọ nọ |
|---|---|---|---|
| Amylase | Starch | Maltose | Ọnụ, eriri afọ nta |
| Pepsin (protease) | Proteins | Peptides | Afọ |
| Lipase | Abụba (Fats) | Fatty acids + glycerol | Eriri afọ nta |

### Amịkọrọ Nri na Eriri afọ Nta

A haziri ileum maka amịkọrọ nri site na:
- **Villi** - ihe ndị dị ka mkpịsị aka na-amụba ohere mbara
- **Microvilli** - obere ihe na-apụta n'elu mkpụrụ ndụ villus
- **Ọtụtụ ọbara** - na-enyere nri aka ịbanye n'ọbara ngwa ngwa
- **Mgbidi dị mkpa** - na-eme ka ụzọ nri ga-esi abanye n'ọbara dị nso`;

const LESSON_ECOSYSTEMS = `## Ecosystems and Food Chains

An **ecosystem** is a community of living organisms interacting with each other and their environment.

### Key Terms

- **Habitat** - the specific place where an organism lives
- **Population** - all individuals of one species in an area
- **Community** - all populations of different species in an area
- **Ecosystem** - community plus its non-living (abiotic) environment

### Food Chains

> Grass → Grasshopper → Frog → Snake → Eagle

- **Producer** - makes food through photosynthesis (plants, algae)
- **Primary consumer** - eats producers (herbivores)
- **Secondary consumer** - eats primary consumers
- **Apex predator** - at the top, not hunted by others
- **Decomposer** - breaks down dead organisms (bacteria, fungi)

### Energy Transfer

Only about **10% of energy** passes from one trophic level to the next. The rest is lost as heat, used in respiration, or in waste. This is why food chains rarely exceed 4–5 levels.

### Nutrient Cycles

**Carbon Cycle**
- Photosynthesis removes CO₂ from the atmosphere
- Respiration, combustion, and decomposition return CO₂

**Nitrogen Cycle**
- Nitrogen-fixing bacteria convert N₂ to nitrates in soil
- Plants absorb nitrates through roots
- Decomposers return nitrogen from dead organisms to soil
- Denitrifying bacteria convert nitrates back to N₂

### Human Impact on Ecosystems

- **Deforestation** - destroys habitats, reduces biodiversity
- **Pollution** - air, water, and soil pollution harm organisms
- **Overfishing** - disrupts marine food webs
- **Invasive species** - outcompete native species`;

const LESSON_ECOSYSTEMS_IGBO = `## Usoro Obibi na Nri (Ecosystems and Food Chains)

**Ecosystem** bụ obodo nke ihe ndị dị ndụ na-emekọrịta ihe n'etiti onwe ha na gburugburu ha.

### Okwu Ndị Dị Mkpa

- **Ebe Obibi (Habitat)** - ebe pụrụ iche otu ihe dị ndụ na-ebi
- **Ndị bi ebe ahụ (Population)** - ndị otu ụdị ihe dị ndụ bi n'otu ebe
- **Obodo (Community)** - ụdị ihe dị ndụ dị iche iche bi n'otu ebe
- **Ecosystem** - obodo na gburugburu ya na-adịghị ndụ (abiotic)

### Usoro Nri (Food Chains)

> Ahịhịa → Ukpala → Nkata → Agwọ → Ugo

- **Onye Emepụta (Producer)** - na-emepụta nri site na photosynthesis (osisi, algae)
- **Onye na-eri nri mbụ (Primary consumer)** - na-eri osisi (anụ na-eri ahịhịa)
- **Onye na-eri nri abụọ (Secondary consumer)** - na-eri ndị na-eri osisi
- **Dike anụ (Apex predator)** - onye nọ n'elu, nke anụ ọzọ na-adịghị eri
- **Onye na-emebi ihe (Decomposer)** - na-agbaji ihe nwụrụ anwụ (bacteria, fungi)

### Ntụfe Ike

Naanị ihe dị ka **10% nke ike** na-esi n'otu ọkwa nri agafe na nke ọzọ. Ihe fọdụrụ na-efu dị ka ọkụ, ma ọ bụ jiri ya mee ihe n'iku ume, ma ọ bụ n'ihe mkpofu. Nke a bụ ya mere usoro nri anaghị adịkarị agafe ọkwa 4–5.

### Okirikiri Nri (Nutrient Cycles)

**Okirikiri Carbon**
- Photosynthesis na-ewepụ CO₂ n'ikuku
- Iku ume, ọkụ, na imebi ihe na-eweghachi CO₂ n'ikuku

**Okirikiri Nitrogen**
- Bacteria pụrụ iche na-agbanwe N₂ ka ọ bụrụ nitrates n'ala
- Osisi na-amị nitrates site na mgbọrọgwụ
- Ndị na-emebi ihe na-eweghachi nitrogen site na ihe nwụrụ anwụ n'ala
- Bacteria ndị ọzọ na-agbanwe nitrates laghachi na N₂

### Mmetụta Mmadụ na Ecosystems

- **Ibi osisi (Deforestation)** - na-emebi ebe obibi, na-ebelata ụdị ihe dị ndụ
- **Mmetọ (Pollution)** - mmetọ ikuku, mmiri, na ala na-emere ihe dị ndụ ihe ọjọọ
- **Igbu azụ karịrị akarị** - na-emebi usoro nri n'ime mmiri
- **Invasive species** - anụ ma ọ bụ osisi ndị bịara abịa na-achụpụ ndị nwe ebe ahụ`;

const LESSON_REPRODUCTION = `## The Human Reproductive System

Human reproduction is **sexual** - it requires the fusion of male and female gametes (sperm and egg).

### Male Reproductive System

**Testes** - produce sperm (spermatogenesis) and testosterone. Located in the scrotum.

**Epididymis** - where sperm mature and are stored.

**Vas Deferens** - tube carrying sperm from epididymis to urethra.

**Seminal Vesicles and Prostate Gland** - produce fluids forming semen.

**Penis** - delivers semen into the female reproductive tract.

### Female Reproductive System

**Ovaries** - produce eggs and the hormones oestrogen and progesterone.

**Fallopian Tubes** - carry eggs from ovaries to uterus. Fertilisation usually occurs here.

**Uterus (Womb)** - where the embryo implants and develops.

**Vagina** - receives the penis; birth canal.

### The Menstrual Cycle (28 days)

- **Day 1–5**: Menstruation - uterus lining sheds
- **Day 6–13**: Follicular phase - egg develops; oestrogen rebuilds lining
- **Day 14**: Ovulation - egg released (triggered by LH surge)
- **Day 15–28**: Luteal phase - progesterone maintains lining; if no fertilisation, levels fall and cycle restarts

### Fertilisation and Development

1. Sperm travel to the fallopian tube
2. One sperm fertilises the egg → **zygote**
3. Zygote divides → **embryo**
4. Embryo implants in uterus wall
5. **Placenta** forms - exchanges nutrients, oxygen, and waste between mother and foetus
6. Gestation: approximately 40 weeks

### Key Hormones

| Hormone | Source | Function |
|---|---|---|
| FSH | Pituitary | Stimulates egg development |
| LH | Pituitary | Triggers ovulation |
| Oestrogen | Ovaries | Rebuilds uterus lining |
| Progesterone | Corpus luteum | Maintains uterus lining |
| Testosterone | Testes | Sperm production |`;

const LESSON_REPRODUCTION_IGBO = `## Usoro Ịmụ Nwa (Human Reproductive System)

Ịmụ nwa n'etiti mmadụ bụ **sexual** - ọ na-achọ njikọ nke mkpụrụ ndụ nwoke (sperm) na nke nwaanyị (egg).

### Usoro Ịmụ Nwa nke Nwoke

**Akwụ (Testes)** - na-emepụta mkpụrụ ndụ nwoke (sperm) na testosterone. Ọ dị n'ime scrotum.

**Epididymis** - ebe mkpụrụ ndụ nwoke na-aka ma na-echekwa ha.

**Vas Deferens** - eriri na-ebu mkpụrụ ndụ nwoke site na epididymis gaa na urethra.

**Seminal Vesicles na Prostate Gland** - na-emepụta mmiri na-emezi semen.

**Otu (Penis)** - na-ebuga semen n'ime ahụ nwaanyị.

### Usoro Ịmụ Nwa nke Nwaanyị

**Ovaries** - na-emepụta akwa na hormones oestrogen na progesterone.

**Fallopian Tubes** - na-ebu akwa site na ovaries gaa n'ụlọ nwa. Njikọ (fertilisation) na-emekarị ebe a.

**Ụlọ nwa (Uterus)** - ebe nwa na-anọ etolite.

**Vagina** - ebe penis na-abata; ụzọ nwa na-esi apụta.

### Okirikiri Ahụ Nwaanyị (The Menstrual Cycle - ụbọchị 28)

- **Ụbọchị 1–5**: Ịhụ nsọ (Menstruation) - ime ụlọ nwa na-adapụ
- **Ụbọchị 6–13**: Follicular phase - akwa na-etolite; oestrogen na-ewughachi ime ụlọ nwa
- **Ụbọchị 14**: Mwepụta akwa (Ovulation) - a tọhapụrụ akwa (nke LH na-ebute)
- **Ụbọchị 15–28**: Luteal phase - progesterone na-echekwa ime ụlọ nwa; ọ bụrụ na njikọ emeghị, cycle na-amalite ọzọ

### Njikọ na Otu Nwa si Etolite

1. Mkpụrụ ndụ nwoke na-aga na fallopian tube
2. Otu mkpụrụ ndụ nwoke na akwa na-ezukọ → **zygote**
3. Zygote na-ekewa → **embryo**
4. Embryo na-arapara n'ime mgbidi ụlọ nwa
5. **Placenta** na-etolite - ọ na-atụgharị nri, oxygen, na ihe mkpofu n'etiti nne na nwa
6. Ime: ihe dị ka izu iri anọ (40 weeks)

### Hormones Ndị Dị Mkpa

| Hormone | Ebe O si bịa | Ọrụ ya |
|---|---|---|
| FSH | Pituitary | Na-akpali uto akwa |
| LH | Pituitary | Na-ebute mwepụta akwa |
| Oestrogen | Ovaries | Na-ewughachi ime ụlọ nwa |
| Progesterone | Corpus luteum | Na-echekwa ime ụlọ nwa |
| Testosterone | Testes | Mmepụta mkpụrụ ndụ nwoke |`;

const LESSON_STATES_OF_MATTER = `## States of Matter

Matter exists in three main states: **solid**, **liquid**, and **gas**. All are made of tiny particles in constant motion.

### Properties of Each State

| Property | Solid | Liquid | Gas |
|---|---|---|---|
| Shape | Fixed | Takes container shape | No fixed shape |
| Volume | Fixed | Fixed | No fixed volume |
| Particle arrangement | Regular, tightly packed | Close, random | Far apart, random |
| Particle movement | Vibrate in place | Slide past each other | Move freely at high speed |
| Compressibility | Very low | Very low | High |

### Changes of State

| Change | Process | Energy |
|---|---|---|
| Solid → Liquid | Melting | Absorbed |
| Liquid → Solid | Freezing | Released |
| Liquid → Gas | Evaporation/Boiling | Absorbed |
| Gas → Liquid | Condensation | Released |
| Solid → Gas | Sublimation | Absorbed |

Water: melting point = 0°C, boiling point = 100°C (at standard pressure).

### Particle Theory

1. All matter is made of tiny particles
2. Particles are always moving
3. Temperature is a measure of the average kinetic energy of particles
4. Heating gives particles more energy - they move faster and further apart

### Diffusion

**Diffusion** is the net movement of particles from high concentration to low concentration. It is passive (no energy needed), faster at higher temperatures, and faster in gases than liquids.

### Solutions

- **Solute** - the substance dissolved (e.g. salt)
- **Solvent** - the substance doing the dissolving (e.g. water)
- **Solution** - the resulting mixture
- **Solubility** increases with temperature for most solids`;

const LESSON_STATES_OF_MATTER_IGBO = `## Ụdị Ihe Dị Iche Iche (States of Matter)

Ihe ọ bụla dị n'ụwa dị n'ụdị atọ: **ihe siri ike (solid)**, **mmiri (liquid)**, na **ikuku (gas)**. Ihe niile bụ obere irighiri ihe na-agbagharị agbagharị mejupụtara ha.

### Njirimara nke Ụdị Ọ bụla

| Njirimara | Ihe siri ike | Mmiri (Liquid) | Ikuku (Gas) |
|---|---|---|---|
| Ọdịdị (Shape) | Anaghị agbanwe | Na-adị ka arịa ọ nọ na ya | Enweghị ọdịdị pụrụ iche |
| Volume | Anaghị agbanwe | Anaghị agbanwe | Na-agbanwe agbanwe |
| Nhazi irighiri ihe | Haziri nke ọma | nọ nso, n'enweghị nhazi | nọ n'ebe dị anya |
| Ntugharị irighiri ihe | Na-ama jijiji n'otu ebe | Na-amị n'akụkụ onwe ha | Na-agagharị n'efu n'ọsọ ukwu |
| Mpikọ (Compressibility) | Dị nnọọ ala | Dị nnọọ ala | Dị elu |

### Mgbanwe nke Ụdị Ihe

| Mgbanwe | Usoro | Ike (Energy) |
|---|---|---|
| Solid → Liquid | Ịgbaze (Melting) | Amịkọrọ ya |
| Liquid → Solid | Ịkpọkọ (Freezing) | Ahapụrụ ya |
| Liquid → Gas | Ịghọ ikuku (Evaporation) | Amịkọrọ ya |
| Gas → Liquid | Ịghọ mmiri (Condensation) | Ahapụrụ ya |
| Solid → Gas | Sublimation | Amịkọrọ ya |

Mmiri: ebe ọ na-agbazere = 0°C, ebe ọ na-esi = 100°C.

### Ozizi Irighiri Ihe (Particle Theory)

1. Ihe niile bụ obere irighiri ihe mejupụtara ha
2. Irighiri ihe na-agagharị mgbe niile
3. Okpomọkụ bụ ihe atụ nke ike kinetic nke irighiri ihe
4. Inye ihe ọkụ na-enye irighiri ihe ike - ha na-agba ọsọ ma na-emewanye ka ha nọrọ n'ebe dị anya

### Diffusion

**Diffusion** bụ usoro irighiri ihe si ebe ha nọ n'ìgwè agaa ebe ha na-anọghị n'ìgwè. Ọ chọghị ike, ọ na-agba ọsọ n'okpomọkụ, ma na-agba ọsọ n'ikuku karịa na mmiri.

### Solutions

- **Solute** - ihe a na-agbazere (dịka nnu)
- **Solvent** - ihe eji agbazere ihe (dịka mmiri)
- **Solution** - ngwakọta sitere na ha
- **Solubility** na-abawanye n'okpomọkụ maka ọtụtụ ihe siri ike`;

const LESSON_ELECTRICITY = `## Electricity and Circuits

Electricity is the flow of electric charge (electrons) through a conductor.

### Key Quantities

**Current (I)** - rate of flow of charge. Measured in **amperes (A)** using an ammeter (in series).

**Voltage (V)** - energy per unit charge (potential difference). Measured in **volts (V)** using a voltmeter (in parallel).

**Resistance (R)** - opposition to current flow. Measured in **ohms (Ω)**.

### Ohm's Law

> V = I × R

A conductor obeys Ohm's Law if current is directly proportional to voltage at constant temperature.

### Series vs Parallel Circuits

**Series Circuit**
- Same current through all components
- Total voltage = sum of individual voltages
- Total resistance = sum of resistances
- If one component fails, circuit breaks

**Parallel Circuit**
- Voltage across each branch is the same
- Total current = sum of branch currents
- Total resistance is less than the smallest individual resistance
- If one branch fails, others continue working

### Power

> P = I × V (also P = I²R and P = V²/R)

Measured in watts (W). A 60W bulb at 230V draws about 0.26A.

### Circuit Components

| Component | Function |
|---|---|
| Cell/Battery | Provides voltage (EMF) |
| Resistor | Limits current |
| Lamp | Converts electrical to light energy |
| Switch | Opens/closes circuit |
| Diode | Allows current in one direction only |
| Ammeter | Measures current (in series) |
| Voltmeter | Measures voltage (in parallel) |

### Static Electricity

Static electricity results from the build-up of charge on an insulating material due to friction (electron transfer).
- Like charges repel; unlike charges attract`;

const LESSON_ELECTRICITY_IGBO = `## Ọkụ Eletrik na Uzọ Ya (Electricity and Circuits)

Ọkụ eletrik bụ usoro electrons na-agba n'ime ihe na-eduzi ọkụ.

### Onu ogugu ndi di mkpa

**Current (I)** - ọsịsọ ọkụ na-agba. A na-atụ ya na **amperes (A)** site n'iji ammeter.

**Voltage (V)** - ike ọkụ (potential difference). A na-atụ ya na **volts (V)** site n'iji voltmeter.

**Resistance (R)** - ihe mgbochi ọkụ. A na-atụ ya na **ohms (Ω)**.

### Iwu Ohm (Ohm's Law)

> V = I × R

Ihe na-eduzi ọkụ na-asọpụrụ Iwu Ohm ma ọ bụrụ na ọsịsọ ọkụ (current) na ike (voltage) na-agakwa n'otu ọkwa.

### Series vs Parallel Circuits

**Series Circuit**
- Otu ọsịsọ ọkụ na-agba n'akụkụ niile
- Ike (Voltage) niile = nchikota nke ike ọ bụla
- Ngụkọta mgbochi (Resistance) = nchikota nke mgbochi niile
- Ọ bụrụ na otu akụkụ emebie, ọkụ niile na-anyụ

**Parallel Circuit**
- Ike (Voltage) n'ụzọ ọ bụla bụ otu
- Ngụkọta ọsịsọ ọkụ = nchikota ọsịsọ n'ụzọ niile
- Ngụkọta mgbochi dị obere karịa nke kacha nta
- Ọ bụrụ na otu ụzọ emebie, ndị ọzọ na-anọgide na-arụ ọrụ

### Ike (Power)

> P = I × V

A na-atụ ya na watts (W).

### Akụkụ Uzọ Ọkụ (Circuit Components)

| Akụkụ | Ọrụ ya |
|---|---|
| Cell/Battery | Na-enye ike ọkụ |
| Resistor | Na-egbochi ọsịsọ ọkụ |
| Lamp | Na-agbanwe eletrik ka ọ bụrụ ìhè |
| Switch | Na-emechi ma ọ bụ na-emeghe ụzọ ọkụ |
| Diode | Na-ekwe ka ọkụ gbaa n'otu ụzọ naanị |
| Ammeter | Na-atụ ọsịsọ ọkụ (current) |
| Voltmeter | Na-atụ ike ọkụ (voltage) |

### Static Electricity

Static electricity na-apụta mgbe ebubo eletrik gbakọtara n'otu ebe n'ihi esemokwu (friction).
- Ebubo ndị yiri onwe ha na-achụghachi onwe ha; ndị na-adịghị ka onwe ha na-adọta onwe ha`;

const LESSON_GENETICS = `## Genetics and Heredity

Genetics is the study of genes, heredity, and variation in living organisms.

### DNA and Chromosomes

**DNA** is a double helix made of nucleotides. Each nucleotide contains a phosphate group, a deoxyribose sugar, and a nitrogenous base (A, T, C, or G).

**Base pairing rules:** A–T and C–G (held by hydrogen bonds).

Humans have **46 chromosomes** (23 pairs) in each body cell. Each chromosome contains thousands of **genes**. A gene is a section of DNA that codes for a specific protein.

### Key Definitions

| Term | Definition |
|---|---|
| Allele | A version of a gene |
| Dominant | Expressed with one copy (capital letter) |
| Recessive | Only expressed with two copies (lowercase) |
| Homozygous | Both alleles the same (TT or tt) |
| Heterozygous | Alleles are different (Tt) |
| Genotype | Genetic makeup (e.g. Tt) |
| Phenotype | Observable characteristic (e.g. tall) |

### Mendelian Inheritance

Punnett square for Tt × Tt (tall × tall, T dominant over t):

| | T | t |
|---|---|---|
| T | TT | Tt |
| t | Tt | tt |

Result: 3 tall : 1 short (3:1 ratio)

### Sex Determination

All eggs contain X. Sperm carry X or Y.
- XX = female; XY = male
- Sex is determined by the sperm

### Codominance

Both alleles expressed equally. Example: ABO blood groups - IA and IB are codominant; blood group AB has both A and B antigens.

### Mutations

A **mutation** is a change in DNA sequence. Can be caused by radiation, mutagens, or replication errors. Examples:
- **Cystic fibrosis** - recessive gene mutation
- **Huntington's disease** - dominant gene mutation
- **Down syndrome** - extra chromosome 21 (trisomy 21)`;

const LESSON_GENETICS_IGBO = `## Ihe Nketa na Mkpụrụ Ndụ (Genetics and Heredity)

Genetics bụ ọmụmụ banyere mkpụrụ ndụ ihe nketa, otu àgwà si agafe site n'aka nne na nna gaa n'ụmụ, na mgbanwe n'etiti ihe dị ndụ.

### DNA na Chromosomes

**DNA** bụ eriri abụọ gbakọrọ agbakọ (double helix). Ihe mejupụtara ya bụ nucleotides.

**Iwu njikọ (Base pairing):** A na T na-ezukọ, C na G na-ezukọ.

Ụmụ mmadụ nwere **chromosomes 46** (ụzọ 23) na mkpụrụ ndụ ahụ ọ bụla. Chromosome ọ bụla nwere puku kwuru puku **genes**. Gene bụ akụkụ nke DNA nke na-enye ntụziaka maka otu protein pụrụ iche.

### Nkọwa Okwu Ndị Dị Mkpa

| Okwu | Nkọwa ya |
|---|---|
| Allele | Ụdị dị iche iche nke otu gene |
| Dominant | Àgwà na-apụta ọbụna ma ọ bụrụ na ọ bụ naanị otu (leta ukwu) |
| Recessive | Àgwà na-apụta naanị ma ọ bụrụ na ha abụọ adị (leta obere) |
| Homozygous | Mgbe allele abụọ ahụ yiri (TT ma ọ bụ tt) |
| Heterozygous | Mgbe allele abụọ ahụ dị iche (Tt) |
| Genotype | Nhazi mkpụrụ ndụ ihe nketa (dịka Tt) |
| Phenotype | Àgwà a na-ahụ anya (dịka ogologo) |

### Usoro Mendelian (Inheritance)

Punnett square maka Tt × Tt (ogologo × ogologo, T kacha t):

| | T | t |
|---|---|---|
| T | TT | Tt |
| t | Tt | tt |

Ihe ọ pụtara: 3 ogologo : 1 mkpụmkpụ (3:1 ratio)

### Mkpebi Nwoke ma ọ bụ Nwaanyị

Akwa nwaanyị niile nwere X. Mkpụrụ ndụ nwoke na-ebu X ma ọ bụ Y.
- XX = nwaanyị; XY = nwoke
- Mkpụrụ ndụ nwoke (sperm) na-ekpebi ma nwa ọ bụ nwoke ma ọ bụ nwaanyị

### Codominance

Mgbe allele abụọ ahụ pụtara n'otu oge. Ọmụmaatụ: Ụdị ọbara ABO.

### Mmụgharị (Mutations)

**Mutation** bụ mgbanwe na nhazi DNA. Ọ nwere ike isi na radiation ma ọ bụ mmejọ n'oge mmeputakwa pụta. Ọmụmaatụ:
- **Cystic fibrosis** - recessive gene mutation
- **Huntington's disease** - dominant gene mutation
- **Down syndrome** - chromosome 21 dị mma (trisomy 21)`;

// ═══════════════════════════════════════════════════════════════════
// KEY TERMS
// ═══════════════════════════════════════════════════════════════════

const KT_PHOTOSYNTHESIS = [
  {
    id: "kt-p-1",
    englishTerm: "Photosynthesis",
    igboTerm: "Ọrụ Anyanwụ",
    igboExplanation:
      "Usoro nke osisi si eme nri ha site n'ọkụ anyanwụ, mmiri, na ikuku carbon dioxide",
  },
  {
    id: "kt-p-2",
    englishTerm: "Chlorophyll",
    igboTerm: "Mgbara Ndụ Osisi",
    igboExplanation:
      "Ihe ndụ n'ime chloroplast nke na-enye osisi agba ọcha-ọcha ma na-amịkọ ìhè anyanwụ",
  },
  {
    id: "kt-p-3",
    englishTerm: "Carbon Dioxide",
    igboTerm: "Ikuku Carbon",
    igboExplanation: "Ikuku ọjọọ (CO₂) nke osisi na-eji eme nri ha",
  },
  {
    id: "kt-p-4",
    englishTerm: "Chloroplast",
    igboTerm: "Ụlọ Mgbara Osisi",
    igboExplanation:
      "Akụkụ obere dị n'ime cell nke osisi ebe ọrụ anyanwụ na-eme",
  },
  {
    id: "kt-p-5",
    englishTerm: "Oxygen",
    igboTerm: "Ikuku Ndụ",
    igboExplanation: "Ikuku dị mma (O₂) nke osisi na-ewepụta n'oge ọrụ anyanwụ",
  },
  {
    id: "kt-p-6",
    englishTerm: "Glucose",
    igboTerm: "Shuga Osisi",
    igboExplanation:
      "Nri shuga (C₆H₁₂O₆) nke osisi na-emepụta n'oge ọrụ anyanwụ",
  },
  {
    id: "kt-p-7",
    englishTerm: "Stomata",
    igboTerm: "Ọnụ Ọgụgọ Osisi",
    igboExplanation:
      "Oghere obere dị n'akwụkwọ osisi ebe ikuku carbon dioxide na-abanye",
  },
];

const KT_CELL_STRUCTURE = [
  {
    id: "kt-c-1",
    englishTerm: "Cell",
    igboTerm: "Mkpụrụ Ndụ",
    igboExplanation:
      "Ihe kacha obere nke ọ bụla ihe dị ndụ na-esi na ya malite",
  },
  {
    id: "kt-c-2",
    englishTerm: "Nucleus",
    igboTerm: "Isi Mkpụrụ Ndụ",
    igboExplanation:
      "Akụkụ nke mkpụrụ ndụ nke na-achị ihe ọ bụla n'ime ya; ọ nwere DNA",
  },
  {
    id: "kt-c-3",
    englishTerm: "Cell Membrane",
    igboTerm: "Akpụkpọ Mkpụrụ Ndụ",
    igboExplanation:
      "Nchedo dị gburugburu mkpụrụ ndụ nke na-echebe ya ma na-ahazị ihe na-abanye na-apụ",
  },
  {
    id: "kt-c-4",
    englishTerm: "Cytoplasm",
    igboTerm: "Mmiri Mkpụrụ Ndụ",
    igboExplanation: "Mmiri dị n'ime mkpụrụ ndụ ebe ọrụ dị iche iche na-eme",
  },
  {
    id: "kt-c-5",
    englishTerm: "Mitochondria",
    igboTerm: "Ụlọ Ike Ndụ",
    igboExplanation: "Akụkụ mkpụrụ ndụ nke na-emepụta ike (ATP) site na nri",
  },
  {
    id: "kt-c-6",
    englishTerm: "Cell Wall",
    igboTerm: "Ọnọdụ Mkpụrụ Ndụ Osisi",
    igboExplanation:
      "Nchedo siri ike dị n'èzí akpụkpọ mkpụrụ ndụ osisi nke na-enye ya ike",
  },
  {
    id: "kt-c-7",
    englishTerm: "Vacuole",
    igboTerm: "Ebe Nchekwa Mkpụrụ Ndụ",
    igboExplanation: "Ebe nchekwa n'ime cell nke na-echekwa mmiri na nri",
  },
  {
    id: "kt-c-8",
    englishTerm: "Ribosome",
    igboTerm: "Ụlọ Mmepụta Protein",
    igboExplanation: "Akụkụ obere nke na-emepụta protein n'ime mkpụrụ ndụ",
  },
];

const KT_DIGESTION = [
  {
    id: "kt-d-1",
    englishTerm: "Digestion",
    igboTerm: "Ịgbaze Nri",
    igboExplanation:
      "Usoro nke ọrụ ahụ si emebi nri ka ọ ghọọ ihe obere nke ọbara nwere ike ị-weta",
  },
  {
    id: "kt-d-2",
    englishTerm: "Enzyme",
    igboTerm: "Ihe Mmezi Nri",
    igboExplanation:
      "Protein pụrụ iche nke na-enyere aka imebi nri ngwa ngwa n'ime ahụ",
  },
  {
    id: "kt-d-3",
    englishTerm: "Amylase",
    igboTerm: "Ihe Mmezi Ụkwa",
    igboExplanation: "Enzyme nke na-emebi ụkwa (starch) ka ọ ghọọ shuga",
  },
  {
    id: "kt-d-4",
    englishTerm: "Stomach",
    igboTerm: "Afo",
    igboExplanation:
      "Akụkụ n'ime ahụ ebe nri na-abịa mgbe ị rie ya, ebe acid na-emebi protein",
  },
  {
    id: "kt-d-5",
    englishTerm: "Small Intestine",
    igboTerm: "Afọ Obere",
    igboExplanation:
      "Ebe kacha mkpa n'ịgbaze nri ebe ihe ndị ọma si n'ime nri na-abanye n'ọbara",
  },
  {
    id: "kt-d-6",
    englishTerm: "Bile",
    igboTerm: "Mmiri Ọjị Imebi Abuba",
    igboExplanation:
      "Mmiri nke imeju (liver) na-emepụta nke na-enyere aka imebi abuba nri",
  },
  {
    id: "kt-d-7",
    englishTerm: "Peristalsis",
    igboTerm: "Mgbachi Ngọngọ Ihe Oriri",
    igboExplanation:
      "Mgbachi nke ogwe ọrụ n'ime tube ahụ nke na-agba nri n'ihu",
  },
  {
    id: "kt-d-8",
    englishTerm: "Villi",
    igboTerm: "Mkpọrọgwụ Afọ Obere",
    igboExplanation:
      "Ọkpụkpọ obere dị n'ime afọ obere nke na-abawanye oge ihe na-abanye n'ọbara",
  },
];

const KT_ECOSYSTEMS = [
  {
    id: "kt-e-1",
    englishTerm: "Ecosystem",
    igboTerm: "Ọdịnala Ndụ",
    igboExplanation:
      "Ógbè ebe ihe dị ndụ dị iche iche na ihe ndị enweghị ndụ na-arụ ọrụ ọnụ",
  },
  {
    id: "kt-e-2",
    englishTerm: "Producer",
    igboTerm: "Onye Emepụta Nri",
    igboExplanation:
      "Osisi na ihe ndị ọzọ nke na-eme nri ha onwe ha site n'ọrụ anyanwụ",
  },
  {
    id: "kt-e-3",
    englishTerm: "Consumer",
    igboTerm: "Onye Iri Nri",
    igboExplanation: "Ụmụ anụmanụ nke na-eri nri ha site n'iri ihe ndị ọzọ",
  },
  {
    id: "kt-e-4",
    englishTerm: "Food Chain",
    igboTerm: "Usoro Nri Ndụ",
    igboExplanation:
      "Usoro nke na-egosi otu nri si aga site n'otu ihe dị ndụ ruo n'ibe ya",
  },
  {
    id: "kt-e-5",
    englishTerm: "Predator",
    igboTerm: "Anụmanụ Ọchụ",
    igboExplanation: "Anụ ọhịa nke na-achụ ma na-eri anụmanụ ndị ọzọ",
  },
  {
    id: "kt-e-6",
    englishTerm: "Decomposer",
    igboTerm: "Onye Emebi Ihe Ọdịdị",
    igboExplanation:
      "Ọrịa obere (bacteria na fungi) nke na-emebi ihe ndị anwụọla ka ha ghọọ nri ala",
  },
  {
    id: "kt-e-7",
    englishTerm: "Habitat",
    igboTerm: "Ebe Obibi Ihe Ndụ",
    igboExplanation: "Ebe pụrụ iche ebe ụdị ihe dị ndụ pụrụ iche na-ebi",
  },
  {
    id: "kt-e-8",
    englishTerm: "Biodiversity",
    igboTerm: "Ọtụtụ Ụdị Ndụ",
    igboExplanation: "Ọchịchọ nke ụdị ihe dị ndụ dị iche iche n'otu ebe",
  },
];

const KT_REPRODUCTION = [
  {
    id: "kt-r-1",
    englishTerm: "Fertilisation",
    igboTerm: "Njikọ Mkpụrụ Ndụ Nna na Nne",
    igboExplanation:
      "Oge sperm na-ejikọ na ovum (ákwá) ka ha ghọọ mkpụrụ ndụ ọhụrụ",
  },
  {
    id: "kt-r-2",
    englishTerm: "Ovulation",
    igboTerm: "Ịtọpụ Ákwá",
    igboExplanation: "Oge nke ovary si tọpụ ákwá ozugbo n'oge chọrọ",
  },
  {
    id: "kt-r-3",
    englishTerm: "Uterus",
    igboTerm: "Ụlọ Nwa",
    igboExplanation:
      "Akụkụ nke ahụ nwaanyị ebe nwa na-eto eto ruo mgbe ọ bịa n'ụwa",
  },
  {
    id: "kt-r-4",
    englishTerm: "Placenta",
    igboTerm: "Ụgbọ Nri Nwa",
    igboExplanation:
      "Akụkụ pụrụ iche nke na-ebugharị nri na ikuku ndụ n'etiti nne na nwa",
  },
  {
    id: "kt-r-5",
    englishTerm: "Sperm",
    igboTerm: "Mkpụrụ Ndụ Nna",
    igboExplanation: "Mkpụrụ ndụ nke nwoke nke na-arụ ọrụ ịkọ ụmụ",
  },
  {
    id: "kt-r-6",
    englishTerm: "Ovum (Egg)",
    igboTerm: "Ákwá Nwaanyị",
    igboExplanation:
      "Mkpụrụ ndụ nke nwaanyị nke na-ejikọ na sperm n'oge ịmụ nwa",
  },
  {
    id: "kt-r-7",
    englishTerm: "Menstrual Cycle",
    igboTerm: "Oge Mmiri Ọbara Nwaanyị",
    igboExplanation:
      "Mgbanwe nke na-eme n'ahụ nwaanyị kwa ọnwa nke na-akọwa oge ịmụ nwa",
  },
  {
    id: "kt-r-8",
    englishTerm: "Embryo",
    igboTerm: "Nwa Ọhụrụ N'ime Ụlọ Nwa",
    igboExplanation: "Nwa mgbe ọ bụ obere n'oge mmalite ya n'ime ụlọ nwa",
  },
];

const KT_STATES_OF_MATTER = [
  {
    id: "kt-m-1",
    englishTerm: "Solid",
    igboTerm: "Ihe Siri Ike",
    igboExplanation:
      "Ụdị ihe nke nwere ọdịdị na ogo ya na-agbanwe-agbanwe; ihe ndị ya dị nso ọnụ",
  },
  {
    id: "kt-m-2",
    englishTerm: "Liquid",
    igboTerm: "Mmiri",
    igboExplanation:
      "Ụdị ihe nke nwere ogo ya na-agbanwe-agbanwe mana enweghị ọdịdị ya; na-asọ n'ala",
  },
  {
    id: "kt-m-3",
    englishTerm: "Gas",
    igboTerm: "Ikuku",
    igboExplanation:
      "Ụdị ihe nke nweghị ọdịdị mana na-juwe elu ọ bụla ya nọ; ihe ndị ya dị anya",
  },
  {
    id: "kt-m-4",
    englishTerm: "Melting",
    igboTerm: "Ịgba Ọkụ Ihe Siri Ike",
    igboExplanation: "Mgbanwe nke ihe siri ike ghọọ mmiri mgbe ọkụ na-abawanye",
  },
  {
    id: "kt-m-5",
    englishTerm: "Evaporation",
    igboTerm: "Ịfefe Mmiri",
    igboExplanation:
      "Oge mmiri si ghọọ ikuku site n'elu ya mgbe ọkụ na-enye ya",
  },
  {
    id: "kt-m-6",
    englishTerm: "Diffusion",
    igboTerm: "Ịgbasa Ihe",
    igboExplanation:
      "Usoro nke ihe si ebe ọ dị ọtụtụ aga n'ebe obere ruo mgbe ha di nha",
  },
  {
    id: "kt-m-7",
    englishTerm: "Condensation",
    igboTerm: "Ịlaghachi Mmiri",
    igboExplanation: "Oge ikuku si ghọọ mmiri mgbe ya na-ozighị",
  },
  {
    id: "kt-m-8",
    englishTerm: "Particle",
    igboTerm: "Ihe Obere Kacha",
    igboExplanation:
      "Ihe kacha obere nke ịhụ n'anya nwere ike ihe nọ n'ime ya; atom ma ọ bụ molecule",
  },
];

const KT_ELECTRICITY = [
  {
    id: "kt-el-1",
    englishTerm: "Electric Current",
    igboTerm: "Ọsịsọ Ọkụ Eletrik",
    igboExplanation:
      "Ọsọ nke electrons n'ime onye na-enyefe ọkụ; a na-eto ya n'ime ampere",
  },
  {
    id: "kt-el-2",
    englishTerm: "Voltage",
    igboTerm: "Ike Ọkụ Eletrik",
    igboExplanation:
      "Ike nke na-akwọ electrons ka ha gwee; a na-eto ya n'ime volt",
  },
  {
    id: "kt-el-3",
    englishTerm: "Resistance",
    igboTerm: "Mgbochi Ọkụ Eletrik",
    igboExplanation:
      "Ihe na-emes mgbochi n'ọsọ nke electrons n'ime wire; a na-eto ya n'ime ohm",
  },
  {
    id: "kt-el-4",
    englishTerm: "Circuit",
    igboTerm: "Uzọ Ọkụ Eletrik",
    igboExplanation:
      "Uzọ zuru ezu nke ọkụ eletrik na-agwa site n'isi ruo n'isi",
  },
  {
    id: "kt-el-5",
    englishTerm: "Series Circuit",
    igboTerm: "Usoro Ọkụ Ọbara Ọbara",
    igboExplanation:
      "Ụdị uzọ ọkụ eletrik ebe ihe ndị ọrụ dị n'usoro ọbara ọbara",
  },
  {
    id: "kt-el-6",
    englishTerm: "Parallel Circuit",
    igboTerm: "Usoro Ọkụ Ụzọ Abụọ",
    igboExplanation:
      "Ụdị uzọ ọkụ eletrik ebe ihe ndị ọrụ nwere ụzọ abụọ dị iche iche",
  },
  {
    id: "kt-el-7",
    englishTerm: "Ohm's Law",
    igboTerm: "Iwu Ohm",
    igboExplanation:
      "Iwu nke na-ekwu na V = I × R; voltage dị n'ọnụ ahịa current na resistance",
  },
  {
    id: "kt-el-8",
    englishTerm: "Power",
    igboTerm: "Ike Ọrụ",
    igboExplanation: "Ọsọ nke a si eji ike; P = I × V; a na-eto ya n'ime watt",
  },
];

const KT_GENETICS = [
  {
    id: "kt-g-1",
    englishTerm: "Gene",
    igboTerm: "Ihe Nketa",
    igboExplanation: "Akụkụ DNA nke na-achị ụdị ihe a na-ahụ n'ihe dị ndụ",
  },
  {
    id: "kt-g-2",
    englishTerm: "DNA",
    igboTerm: "Ihe Nketa Ndụ",
    igboExplanation:
      "Molecule nke na-eji ihe ọmụmụ nke ndụ; dị n'ime nucleus nke mkpụrụ ndụ",
  },
  {
    id: "kt-g-3",
    englishTerm: "Chromosome",
    igboTerm: "Usoro Ihe Nketa",
    igboExplanation: "Ihe nke DNA ji abụba n'ime nucleus; mmadụ nwere 46",
  },
  {
    id: "kt-g-4",
    englishTerm: "Allele",
    igboTerm: "Ụdị Ihe Nketa",
    igboExplanation:
      "Ụdị gene pụrụ iche - otu gene nwere ike ị nwee ụdị abụọ dị iche iche",
  },
  {
    id: "kt-g-5",
    englishTerm: "Dominant",
    igboTerm: "Ihe Nketa Siri Ike",
    igboExplanation:
      "Ụdị allele nke na-apụta ìhè ọbụna ma ọ bụ otu kopị naanị ka dị",
  },
  {
    id: "kt-g-6",
    englishTerm: "Recessive",
    igboTerm: "Ihe Nketa Adịghị Ike",
    igboExplanation:
      "Ụdị allele nke apụtaghị ìhè naanị ma ọ bụ kopị abụọ ka dị",
  },
  {
    id: "kt-g-7",
    englishTerm: "Phenotype",
    igboTerm: "Ihe A Na-Ahụ N'Ihe Dị Ndụ",
    igboExplanation:
      "Ihe a na-ahụ anya nke gene si pụta ìhè - dị ka agba akwa ma ọ bụ ogo",
  },
  {
    id: "kt-g-8",
    englishTerm: "Mutation",
    igboTerm: "Mgbanwe Ihe Nketa",
    igboExplanation:
      "Mgbanwe na-eme n'ime DNA nke nwere ike ịbawanye ụdị ọhụrụ ma ọ bụ ọrịa",
  },
];

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS - PHOTOSYNTHESIS (20)
// ═══════════════════════════════════════════════════════════════════

const Q_PHOTOSYNTHESIS = [
  {
    id: "q-p-1",
    type: QuestionType.MCQ,
    questionText: "What is photosynthesis?",
    questionTextIgbo: "Gịnị bụ fotosinthesis?",
    options: [
      "The process of breaking down food to release energy",
      "The process by which plants make their own food using light",
      "The movement of water in plants",
      "The process of respiration in animals",
    ],
    optionsIgbo: [
      "Imebi nri iji wepụta ike",
      "Usoro osisi si emepụta nri ha site n’ìhè",
      "Mmegharị mmiri n’osisi",
      "Usoro iku ume n’anụmanụ",
    ],
    correctAnswer:
      "The process by which plants make their own food using light",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "The process of breaking down food to release energy",
          feedback:
            "That is respiration. Photosynthesis is about MAKING food, not breaking it down.",
        },
      ],
      defaultFeedback:
        "Photosynthesis is the process plants use to make glucose using sunlight, carbon dioxide, and water.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-2",
    type: QuestionType.TRUE_FALSE,
    questionText: "Photosynthesis occurs in the chloroplast.",
    questionTextIgbo: "Fotosinthesis na-eme n’ime chloroplast?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "Wrong. Chloroplasts contain chlorophyll and are the site of photosynthesis.",
        },
      ],
      defaultFeedback:
        "Correct. Photosynthesis occurs in chloroplasts which contain chlorophyll to trap light energy.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-3",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What pigment absorbs light energy for photosynthesis?",
    questionTextIgbo: "Kedu pigment na-anata ìhè maka fotosinthesis?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "chlorophyll",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "chloroplast",
          feedback:
            "Chloroplast is the organelle. The pigment inside it that absorbs light is chlorophyll.",
        },
      ],
      defaultFeedback:
        "Chlorophyll is the green pigment that absorbs light energy for photosynthesis.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-4",
    type: QuestionType.MCQ,
    questionText: "Which gas is taken in by plants during photosynthesis?",
    questionTextIgbo: "Kedu gas osisi na-ewe n’ime fotosinthesis?",
    options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
    optionsIgbo: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: "Carbon dioxide",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Oxygen",
          feedback:
            "Oxygen is released, not taken in. Carbon dioxide is the gas plants absorb.",
        },
      ],
      defaultFeedback:
        "Plants take in carbon dioxide from the air through stomata for photosynthesis.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-5",
    type: QuestionType.MCQ,
    questionText: "What is the main product of photosynthesis used as food?",
    questionTextIgbo: "Gịnị bụ isi nri a na-emepụta na fotosinthesis?",
    options: ["Oxygen", "Glucose", "Water", "Carbon dioxide"],
    optionsIgbo: ["Oxygen", "Glucose", "Water", "Carbon dioxide"],
    correctAnswer: "Glucose",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Oxygen",
          feedback:
            "Oxygen is a by-product. Glucose is the actual food produced.",
        },
      ],
      defaultFeedback:
        "Glucose is produced and used by plants as food or stored as starch.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-6",
    type: QuestionType.TRUE_FALSE,
    questionText: "Sunlight is required for photosynthesis.",
    questionTextIgbo: "Ìhè anyanwụ dị mkpa maka fotosinthesis?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "No light means no photosynthesis. Light provides the energy for the process.",
        },
      ],
      defaultFeedback:
        "Correct. Light energy is essential for photosynthesis to occur.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-7",
    type: QuestionType.MCQ,
    questionText:
      "Which part of the plant allows gas exchange for photosynthesis?",
    questionTextIgbo:
      "Kedu akụkụ osisi na-enye ohere mgbanwe gas maka fotosinthesis?",
    options: ["Roots", "Stem", "Stomata", "Flowers"],
    optionsIgbo: ["Mgbọrọgwụ", "Osisi ogwe", "Stomata", "Ifuru"],
    correctAnswer: "Stomata",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Roots",
          feedback:
            "Roots absorb water, not gases. Gas exchange happens through stomata.",
        },
      ],
      defaultFeedback:
        "Stomata are tiny pores on leaves that allow carbon dioxide in and oxygen out.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-8",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the name of the process by which plants lose water vapour through stomata?",
    questionTextIgbo:
      "Gịnị ka a na-akpọ usoro osisi si tufuo mmiri site na stomata?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "transpiration",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "evaporation",
          feedback:
            "Evaporation is general water loss. In plants, the specific process is called transpiration.",
        },
      ],
      defaultFeedback:
        "The process is transpiration - loss of water vapour through stomata.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-9",
    type: QuestionType.MCQ,
    questionText: "Which factor does NOT affect the rate of photosynthesis?",
    questionTextIgbo: "Kedu ihe anaghị emetụta ọsọ fotosinthesis?",
    options: [
      "Light intensity",
      "Temperature",
      "Carbon dioxide concentration",
      "Sound",
    ],
    optionsIgbo: ["Ike ìhè", "Okpomọkụ", "Ogologo carbon dioxide", "Ụda"],
    correctAnswer: "Sound",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Temperature",
          feedback:
            "Temperature affects enzyme activity, so it DOES affect photosynthesis.",
        },
      ],
      defaultFeedback:
        "Sound has no role in photosynthesis. Light, CO₂, and temperature all affect the rate.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-10",
    type: QuestionType.TRUE_FALSE,
    questionText: "Oxygen is produced as a by-product of photosynthesis.",
    questionTextIgbo: "Oxygen na-apụta dịka ihe fọdụrụ na fotosinthesis?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "Incorrect. Oxygen is released during photosynthesis when water is split.",
        },
      ],
      defaultFeedback:
        "Correct. Oxygen is released as a by-product of photosynthesis.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-11",
    type: QuestionType.MCQ,
    questionText: "Which equation correctly represents photosynthesis?",
    questionTextIgbo: "Kedu equation ziri ezi maka fotosinthesis?",
    options: [
      "Glucose + Oxygen → Carbon dioxide + Water",
      "Carbon dioxide + Water → Glucose + Oxygen",
      "Oxygen + Water → Carbon dioxide + Glucose",
      "Water + Oxygen → Glucose + Carbon dioxide",
    ],
    optionsIgbo: [
      "Glucose + Oxygen → Carbon dioxide + Water",
      "Carbon dioxide + Water → Glucose + Oxygen",
      "Oxygen + Water → Carbon dioxide + Glucose",
      "Water + Oxygen → Glucose + Carbon dioxide",
    ],
    correctAnswer: "Carbon dioxide + Water → Glucose + Oxygen",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Glucose + Oxygen → Carbon dioxide + Water",
          feedback: "That is respiration, not photosynthesis.",
        },
      ],
      defaultFeedback:
        "Photosynthesis converts carbon dioxide and water into glucose and oxygen using light energy.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-12",
    type: QuestionType.TRUE_FALSE,
    questionText: "Photosynthesis can occur in the absence of chlorophyll.",
    questionTextIgbo: "Fotosinthesis nwere ike ime na-enweghị chlorophyll?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "Without chlorophyll, light energy cannot be absorbed. No photosynthesis happens.",
        },
      ],
      defaultFeedback:
        "Chlorophyll is essential for absorbing light energy. Without it, photosynthesis cannot occur.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-13",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What form of energy is converted into chemical energy during photosynthesis?",
    questionTextIgbo:
      "Kedu ụdị ike na-agbanwe gaa na chemical energy n’ime fotosinthesis?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "light energy",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "heat",
          feedback:
            "Heat is not used directly. Photosynthesis specifically uses light energy.",
        },
      ],
      defaultFeedback:
        "Light energy from the sun is converted into chemical energy stored in glucose.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-14",
    type: QuestionType.MCQ,
    questionText: "Where does the water used in photosynthesis come from?",
    questionTextIgbo: "Ebee ka mmiri eji eme fotosinthesis si abịa?",
    options: ["Air", "Soil", "Sunlight", "Leaves"],
    optionsIgbo: ["Ikuku", "Ala", "Ìhè", "Akwụkwọ"],
    correctAnswer: "Soil",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Air",
          feedback:
            "Water is absorbed from the soil by the roots, not from the air.",
        },
      ],
      defaultFeedback:
        "Water is absorbed from the soil by roots and transported to leaves.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-15",
    type: QuestionType.TRUE_FALSE,
    questionText: "Plants only carry out photosynthesis during the day.",
    questionTextIgbo: "Osisi na-eme fotosinthesis naanị n’ehihie?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "Photosynthesis requires light, so it happens only when light is available.",
        },
      ],
      defaultFeedback:
        "Correct. Photosynthesis requires light, so it mainly occurs during the day.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-16",
    type: QuestionType.MCQ,
    questionText: "Which part of the leaf contains the most chloroplasts?",
    questionTextIgbo: "Kedu akụkụ akwụkwọ nwere chloroplast kachasị?",
    options: [
      "Upper epidermis",
      "Palisade mesophyll",
      "Spongy mesophyll",
      "Cuticle",
    ],
    optionsIgbo: [
      "Epidermis elu",
      "Palisade mesophyll",
      "Spongy mesophyll",
      "Cuticle",
    ],
    correctAnswer: "Palisade mesophyll",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Spongy mesophyll",
          feedback:
            "Spongy mesophyll has fewer chloroplasts. Palisade mesophyll is packed with them.",
        },
      ],
      defaultFeedback:
        "Palisade mesophyll cells contain the highest number of chloroplasts for maximum light absorption.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-17",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What carbohydrate is glucose often converted into for storage in plants?",
    questionTextIgbo:
      "Kedu carbohydrate ka glucose na-agbanwe gaa iji chekwaa ya n’osisi?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "starch",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "cellulose",
          feedback:
            "Cellulose is for structure, not storage. Starch is the storage form.",
        },
      ],
      defaultFeedback:
        "Glucose is converted into starch for storage in plants.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-18",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Increasing carbon dioxide concentration always increases photosynthesis rate indefinitely.",
    questionTextIgbo:
      "Ibulite carbon dioxide na-eme ka fotosinthesis na-abawanye ruo mgbe ebighị ebi?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "Wrong. Other factors like light or temperature become limiting.",
        },
      ],
      defaultFeedback:
        "Photosynthesis is limited by the least available factor. Increasing CO₂ only helps up to a point.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-19",
    type: QuestionType.MCQ,
    questionText:
      "Which structure controls the opening and closing of stomata?",
    questionTextIgbo: "Kedu akụkụ na-achịkwa mmeghe na mmechi stomata?",
    options: ["Root cells", "Guard cells", "Xylem", "Phloem"],
    optionsIgbo: ["Sel mgbọrọgwụ", "Guard cells", "Xylem", "Phloem"],
    correctAnswer: "Guard cells",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Xylem",
          feedback:
            "Xylem transports water. Guard cells control stomatal opening.",
        },
      ],
      defaultFeedback:
        "Guard cells regulate the opening and closing of stomata.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-p-20",
    type: QuestionType.MCQ,
    questionText: "Which of the following is NOT required for photosynthesis?",
    questionTextIgbo: "Kedu n’ime ndị a anaghị achọ maka fotosinthesis?",
    options: ["Light", "Water", "Oxygen", "Carbon dioxide"],
    optionsIgbo: ["Ìhè", "Mmiri", "Oxygen", "Carbon dioxide"],
    correctAnswer: "Oxygen",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Water",
          feedback: "Water is essential. Oxygen is produced, not required.",
        },
      ],
      defaultFeedback:
        "Oxygen is a product of photosynthesis, not a requirement.",
    },
    difficulty: 0.5,
  },
];

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS - CELL STRUCTURE (20)
// ═══════════════════════════════════════════════════════════════════

const Q_CELL_STRUCTURE = [
  {
    id: "q-c-1",
    type: QuestionType.MCQ,
    questionText: "Which organelle is known as the control centre of the cell?",
    questionTextIgbo: "Kedu akụkụ sel a na-akpọ ebe njikwa ya?",
    options: ["Mitochondria", "Nucleus", "Cell Membrane", "Vacuole"],
    optionsIgbo: ["Mitochondria", "Nucleus", "Akpụkpọ Sel", "Vacuole"],
    correctAnswer: "Nucleus",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Mitochondria",
          feedback:
            "Mitochondria (Ụlọ Ike Ndụ) produce energy. The control centre containing DNA is the nucleus (Isi Mkpụrụ Ndụ).",
        },
      ],
      defaultFeedback:
        "The nucleus (Isi Mkpụrụ Ndụ) controls the cell. It contains DNA which carries instructions for all cell activities.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-2",
    type: QuestionType.TRUE_FALSE,
    questionText: "Both plant and animal cells have a cell wall.",
    questionTextIgbo: "Sel osisi na sel anụmanụ abụọ nwere mgbidi sel?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "Only plant cells have a cell wall (Ọnọdụ Mkpụrụ Ndụ Osisi). Animal cells have only a cell membrane.",
        },
      ],
      defaultFeedback:
        "The cell wall (Ọnọdụ Mkpụrụ Ndụ Osisi) is found ONLY in plant cells. It is made of cellulose.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-3",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the jelly-like fluid that fills the cell and surrounds the organelles?",
    questionTextIgbo:
      "Kedu ihe mmiri dị ka jelii na-eju sel ma gbaa akụkụ ya gburugburu?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "cytoplasm",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "nucleus",
          feedback:
            "The nucleus is a distinct organelle. The gel-like fluid is cytoplasm (Mmiri Mkpụrụ Ndụ).",
        },
      ],
      defaultFeedback:
        "The answer is cytoplasm (Mmiri Mkpụrụ Ndụ), where most chemical reactions occur.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-4",
    type: QuestionType.MCQ,
    questionText: "Which organelle is the site of protein synthesis?",
    questionTextIgbo: "Kedu akụkụ sel ebe a na-emepụta protein?",
    options: ["Mitochondria", "Ribosome", "Golgi apparatus", "Vacuole"],
    optionsIgbo: ["Mitochondria", "Ribosome", "Golgi apparatus", "Vacuole"],
    correctAnswer: "Ribosome",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Mitochondria",
          feedback:
            "Mitochondria (Ụlọ Ike Ndụ) produce energy. Protein synthesis takes place on ribosomes (Ụlọ Mmepụta Protein).",
        },
        {
          pattern: "Golgi apparatus",
          feedback:
            "The Golgi packages proteins after synthesis. The actual synthesis happens at ribosomes (Ụlọ Mmepụta Protein).",
        },
      ],
      defaultFeedback:
        "Ribosomes (Ụlọ Mmepụta Protein) are the sites of protein synthesis.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-5",
    type: QuestionType.MCQ,
    questionText: "What is the function of mitochondria?",
    questionTextIgbo: "Gịnị bụ ọrụ mitochondria?",
    options: [
      "Produce proteins",
      "Store water",
      "Produce energy (ATP)",
      "Control cell division",
    ],
    optionsIgbo: [
      "Imepụta protein",
      "Idobe mmiri",
      "Imepụta ike (ATP)",
      "Ijikwa nkewa sel",
    ],
    correctAnswer: "Produce energy (ATP)",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Produce proteins",
          feedback:
            "Proteins are made at ribosomes. Mitochondria (Ụlọ Ike Ndụ) produce ATP through respiration.",
        },
      ],
      defaultFeedback:
        "Mitochondria (Ụlọ Ike Ndụ) produce ATP - the cell's energy currency - through aerobic respiration.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-6",
    type: QuestionType.TRUE_FALSE,
    questionText: "The cell membrane is selectively permeable.",
    questionTextIgbo:
      "Akpụkpọ sel na-ahapụ ụfọdụ ihe ka ha gafee ma gbochie ndị ọzọ?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "This is true. The cell membrane (Akpụkpọ Mkpụrụ Ndụ) controls what enters and exits the cell.",
        },
      ],
      defaultFeedback:
        "Correct! The cell membrane (Akpụkpọ Mkpụrụ Ndụ) is selectively permeable - allowing some substances through while blocking others.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-7",
    type: QuestionType.MCQ,
    questionText: "Which organelle is found ONLY in plant cells?",
    questionTextIgbo: "Kedu akụkụ sel dị naanị n’ime sel osisi?",
    options: ["Mitochondria", "Nucleus", "Ribosome", "Chloroplast"],
    optionsIgbo: ["Mitochondria", "Nucleus", "Ribosome", "Chloroplast"],
    correctAnswer: "Chloroplast",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Mitochondria",
          feedback:
            "Mitochondria are found in both plant and animal cells. Chloroplasts (Ụlọ Mgbara Osisi) are unique to plant cells.",
        },
      ],
      defaultFeedback:
        "Chloroplasts (Ụlọ Mgbara Osisi) are found ONLY in plant cells. They are the site of photosynthesis.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-8",
    type: QuestionType.SHORT_ANSWER,
    questionText: "How many chromosomes does a normal human body cell contain?",
    questionTextIgbo: "Ole chromosomes ka sel ahụ mmadụ nkịtị nwere?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "46",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "23",
          feedback:
            "23 is the number in human gametes. Body cells (somatic cells) have 46 chromosomes - 23 pairs.",
        },
      ],
      defaultFeedback:
        "Normal human body cells contain 46 chromosomes, in 23 pairs. Gametes (sperm/eggs) have only 23.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-9",
    type: QuestionType.MCQ,
    questionText:
      "What is the role of the large central vacuole in plant cells?",
    questionTextIgbo: "Gịnị bụ ọrụ nnukwu vacuole dị n’etiti sel osisi?",
    options: [
      "Photosynthesis",
      "Protein synthesis",
      "Maintain shape and store cell sap",
      "Energy production",
    ],
    optionsIgbo: [
      "Fotosinthesis",
      "Imepụta protein",
      "Idobe udi sel na idobe mmiri sel",
      "Imepụta ike",
    ],
    correctAnswer: "Maintain shape and store cell sap",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Photosynthesis",
          feedback:
            "Photosynthesis occurs in chloroplasts. The vacuole (Ebe Nchekwa Mkpụrụ Ndụ) stores cell sap and maintains turgor pressure.",
        },
      ],
      defaultFeedback:
        "The large central vacuole (Ebe Nchekwa Mkpụrụ Ndụ) stores water and cell sap, creating turgor pressure that maintains plant cell shape.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-10",
    type: QuestionType.TRUE_FALSE,
    questionText: "Mature red blood cells have no nucleus.",
    questionTextIgbo: "Sel ọbara uhie tozuru etozu enweghị nucleus?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "Red blood cells lose their nucleus when they mature. This provides more space for haemoglobin to carry oxygen.",
        },
      ],
      defaultFeedback:
        "Correct! Mature red blood cells have no nucleus. This makes them biconcave and maximises space for haemoglobin.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-11",
    type: QuestionType.MCQ,
    questionText: "What is the cell wall in plant cells made of?",
    questionTextIgbo: "Gịnị ka e ji mee mgbidi sel osisi?",
    options: ["Protein", "Lipid", "Starch", "Cellulose"],
    optionsIgbo: ["Protein", "Lipid", "Starch", "Cellulose"],
    correctAnswer: "Cellulose",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Starch",
          feedback:
            "Starch is a storage carbohydrate. The cell wall (Ọnọdụ Mkpụrụ Ndụ Osisi) is made of cellulose fibres, providing rigidity.",
        },
      ],
      defaultFeedback:
        "The cell wall (Ọnọdụ Mkpụrụ Ndụ Osisi) is made of cellulose - a fibrous carbohydrate that gives plant cells their rigid, boxy shape.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-12",
    type: QuestionType.TRUE_FALSE,
    questionText: "All living cells contain DNA.",
    questionTextIgbo: "Sel niile dị ndụ nwere DNA?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "All living cells contain DNA (Ihe Nketa Ndụ), which carries the genetic instructions for the cell's activities and reproduction.",
        },
      ],
      defaultFeedback:
        "Correct! All living cells contain DNA (Ihe Nketa Ndụ). In eukaryotes it is in the nucleus; in prokaryotes (bacteria) it floats freely in the cytoplasm.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-13",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What name is given to the long extension of a nerve cell that transmits electrical signals?",
    questionTextIgbo:
      "Kedu aha a na-akpọ ogologo akụkụ sel akwara nke na-ebufe akara eletrik?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "axon",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "dendrite",
          feedback:
            "Dendrites receive signals from other neurons. The long extension that transmits signals away from the cell body is the axon.",
        },
      ],
      defaultFeedback:
        "The long extension is called an axon. Nerve cells (neurons) have very long axons to transmit electrical impulses quickly over distances.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-14",
    type: QuestionType.MCQ,
    questionText:
      "Which cell type has a large surface area to absorb water and minerals from the soil?",
    questionTextIgbo:
      "Kedu ụdị sel nwere nnukwu ebe elu iji were mmiri na mineral si n’ala?",
    options: ["Nerve cell", "Red blood cell", "Root hair cell", "Sperm cell"],
    optionsIgbo: ["Sel akwara", "Sel ọbara uhie", "Sel mgbọrọgwụ", "Sel sperm"],
    correctAnswer: "Root hair cell",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Red blood cell",
          feedback:
            "Red blood cells transport oxygen in the blood. Root hair cells are specialised with a large surface area for absorbing water and minerals from the soil.",
        },
      ],
      defaultFeedback:
        "Root hair cells have a long, thin extension that greatly increases their surface area for absorbing water and dissolved minerals from the soil.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-15",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "The smooth endoplasmic reticulum has ribosomes on its surface.",
    questionTextIgbo: "Smooth endoplasmic reticulum nwere ribosomes n’elu ya?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "That describes the ROUGH endoplasmic reticulum. The SMOOTH endoplasmic reticulum has no ribosomes - it deals with lipid synthesis and detoxification.",
        },
      ],
      defaultFeedback:
        "The ROUGH ER has ribosomes (Ụlọ Mmepụta Protein) on its surface and processes proteins. The SMOOTH ER has no ribosomes and handles lipids.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-16",
    type: QuestionType.MCQ,
    questionText: "What does the Golgi apparatus do?",
    questionTextIgbo: "Gịnị ka Golgi apparatus na-eme?",
    options: [
      "Produce energy",
      "Package and dispatch proteins",
      "Carry out photosynthesis",
      "Store genetic information",
    ],
    optionsIgbo: [
      "Imepụta ike",
      "Ikpuchi na izipu protein",
      "Ime fotosinthesis",
      "Idobe ozi mkpụrụ ndụ",
    ],
    correctAnswer: "Package and dispatch proteins",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Produce energy",
          feedback:
            "Energy is produced in mitochondria (Ụlọ Ike Ndụ). The Golgi apparatus modifies, packages, and sends proteins to their destinations.",
        },
      ],
      defaultFeedback:
        "The Golgi apparatus packages proteins made at ribosomes (Ụlọ Mmepụta Protein) and dispatches them to where they are needed - inside or outside the cell.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-17",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What type of cell surrounds the stomates (stomata) in plant leaves?",
    questionTextIgbo: "Kedu ụdị sel gbara stomata gburugburu n’akwụkwọ osisi?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "guard cells",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "root hair cells",
          feedback:
            "Root hair cells are in the roots for water absorption. The cells that surround stomata (Ọnụ Ọgụgọ Osisi) and control their opening are guard cells.",
        },
      ],
      defaultFeedback:
        "Guard cells surround each stoma (Ọnụ Ọgụgọ Osisi). When they absorb water and swell, the stoma opens; when they lose water, it closes.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-18",
    type: QuestionType.TRUE_FALSE,
    questionText: "Prokaryotic cells (like bacteria) do not have a nucleus.",
    questionTextIgbo: "Sel prokaryotic (dị ka bacteria) enweghị nucleus?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "This is true. Prokaryotes (bacteria) lack a membrane-bound nucleus (Isi Mkpụrụ Ndụ). Their DNA floats freely in the cytoplasm.",
        },
      ],
      defaultFeedback:
        "Correct! Prokaryotes (bacteria) have no nucleus. Their DNA is circular and floats in the cytoplasm (Mmiri Mkpụrụ Ndụ). This distinguishes them from eukaryotes.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-19",
    type: QuestionType.MCQ,
    questionText: "Which structure is found in both plant and animal cells?",
    questionTextIgbo: "Kedu akụkụ dị na sel osisi na sel anụmanụ abụọ?",
    options: ["Cell wall", "Chloroplast", "Mitochondria", "Central vacuole"],
    optionsIgbo: ["Mgbidi sel", "Chloroplast", "Mitochondria", "Vacuole etiti"],
    correctAnswer: "Mitochondria",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Cell wall",
          feedback:
            "Cell walls (Ọnọdụ Mkpụrụ Ndụ Osisi) are found only in plant cells. Mitochondria (Ụlọ Ike Ndụ) are in both plant and animal cells.",
        },
        {
          pattern: "Chloroplast",
          feedback:
            "Chloroplasts are found only in plant cells. Mitochondria (Ụlọ Ike Ndụ) are the organelle found in both.",
        },
      ],
      defaultFeedback:
        "Mitochondria (Ụlọ Ike Ndụ) are present in both plant and animal cells - all eukaryotic cells need ATP energy from respiration.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-c-20",
    type: QuestionType.MCQ,
    questionText:
      "What is the term for cells that are genetically identical and have a specific function?",
    questionTextIgbo:
      "Gịnị ka a na-akpọ sel ndị yiri ibe ha ma nwee ọrụ pụrụ iche?",
    options: ["Stem cells", "Specialised cells", "Prokaryotes", "Gametes"],
    optionsIgbo: ["Stem cells", "Sel pụrụ iche", "Prokaryotes", "Gametes"],
    correctAnswer: "Specialised cells",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Stem cells",
          feedback:
            "Stem cells are unspecialised and can develop into many cell types. Specialised cells have already differentiated to perform a specific function.",
        },
      ],
      defaultFeedback:
        "Specialised cells (like red blood cells, nerve cells, root hair cells) have differentiated to carry out a specific function. Their structure reflects their role.",
    },
    difficulty: 0.5,
  },
];

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS - DIGESTION (22)
// ═══════════════════════════════════════════════════════════════════

const Q_DIGESTION = [
  {
    id: "q-d-1",
    type: QuestionType.MCQ,
    questionText: "Where does digestion begin in the human body?",
    questionTextIgbo: "Ebee ka mgbaze nri na-amalite n’ahụ mmadụ?",
    options: ["Stomach", "Mouth", "Small intestine", "Oesophagus"],
    optionsIgbo: ["Afo", "Ọnụ", "Afọ obere", "Ọkpọkpọ nri"],
    correctAnswer: "Mouth",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Stomach",
          feedback:
            "Wrong. Digestion starts in the mouth with chewing and salivary amylase.",
        },
      ],
      defaultFeedback:
        "Digestion begins in the mouth where food is mechanically and chemically broken down.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-2",
    type: QuestionType.MCQ,
    questionText: "Which enzyme breaks down starch in the mouth?",
    questionTextIgbo: "Kedu enzyme na-agbaji starch n’ọnụ?",
    options: ["Pepsin", "Amylase", "Lipase", "Protease"],
    optionsIgbo: ["Pepsin", "Amylase", "Lipase", "Protease"],
    correctAnswer: "Amylase",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Pepsin",
          feedback:
            "Pepsin works in the stomach for protein digestion, not starch.",
        },
      ],
      defaultFeedback:
        "Salivary amylase begins the breakdown of starch into simpler sugars.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-3",
    type: QuestionType.TRUE_FALSE,
    questionText: "The stomach mainly digests proteins.",
    questionTextIgbo: "Afo na-agbaji protein nke ukwuu?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "Incorrect. The stomach uses pepsin and acid to digest proteins.",
        },
      ],
      defaultFeedback:
        "The stomach digests proteins using pepsin in an acidic environment.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-4",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What acid is found in the stomach?",
    questionTextIgbo: "Kedu acid dị n’ime afo?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "hydrochloric acid",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "sulfuric acid",
          feedback:
            "Wrong acid. The stomach uses hydrochloric acid, not industrial acids.",
        },
      ],
      defaultFeedback:
        "Hydrochloric acid creates the acidic environment needed for enzyme activity.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-5",
    type: QuestionType.MCQ,
    questionText: "Where does most nutrient absorption occur?",
    questionTextIgbo: "Ebee ka ọtụtụ nri na-amịkọrọ?",
    options: ["Stomach", "Small intestine", "Large intestine", "Oesophagus"],
    optionsIgbo: ["Afo", "Afọ obere", "Afọ nnukwu", "Ọkpọkpọ nri"],
    correctAnswer: "Small intestine",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Large intestine",
          feedback: "Large intestine mainly absorbs water, not nutrients.",
        },
      ],
      defaultFeedback:
        "Most nutrients are absorbed in the small intestine due to its large surface area.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-6",
    type: QuestionType.MCQ,
    questionText: "What is the role of bile?",
    questionTextIgbo: "Gịnị bụ ọrụ bile?",
    options: [
      "Digest proteins",
      "Break down starch",
      "Emulsify fats",
      "Absorb glucose",
    ],
    optionsIgbo: [
      "Igbaji protein",
      "Igbaji starch",
      "Ime ka abụba dị ntakịrị",
      "Imịkọrọ glucose",
    ],
    correctAnswer: "Emulsify fats",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Digest proteins",
          feedback:
            "Bile does not digest proteins. It breaks fat into smaller droplets.",
        },
      ],
      defaultFeedback:
        "Bile emulsifies fats, increasing surface area for lipase.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-7",
    type: QuestionType.TRUE_FALSE,
    questionText: "Peristalsis helps move food along the digestive system.",
    questionTextIgbo:
      "Peristalsis na-enyere aka ịkwaga nri n’ime usoro mgbaze?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "Wrong. Peristalsis is essential for pushing food through the system.",
        },
      ],
      defaultFeedback:
        "Peristalsis is the wave-like muscle contraction that moves food.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-8",
    type: QuestionType.MCQ,
    questionText: "Which enzyme digests proteins?",
    questionTextIgbo: "Kedu enzyme na-agbaji protein?",
    options: ["Amylase", "Lipase", "Protease", "Maltase"],
    optionsIgbo: ["Amylase", "Lipase", "Protease", "Maltase"],
    correctAnswer: "Protease",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Amylase",
          feedback: "Amylase digests starch, not protein.",
        },
      ],
      defaultFeedback: "Protease enzymes break proteins into amino acids.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-9",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What structure increases absorption in the small intestine?",
    questionTextIgbo: "Kedu ihe na-eme ka absorption bawanye n’afọ obere?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "villi",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "microvilli",
          feedback:
            "Close but incomplete. Villi are the main structures; microvilli are smaller extensions.",
        },
      ],
      defaultFeedback:
        "Villi increase surface area for efficient nutrient absorption.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-10",
    type: QuestionType.TRUE_FALSE,
    questionText: "The large intestine absorbs water.",
    questionTextIgbo: "Afọ nnukwu na-amịkọrọ mmiri?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "Wrong. Water absorption is the main role of the large intestine.",
        },
      ],
      defaultFeedback: "The large intestine absorbs water and forms faeces.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-11",
    type: QuestionType.MCQ,
    questionText: "Which organ produces bile?",
    questionTextIgbo: "Kedu akụkụ na-emepụta bile?",
    options: ["Pancreas", "Liver", "Stomach", "Gallbladder"],
    optionsIgbo: ["Pancreas", "Imeju", "Afo", "Gallbladder"],
    correctAnswer: "Liver",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Gallbladder",
          feedback: "Gallbladder stores bile, it does not produce it.",
        },
      ],
      defaultFeedback:
        "The liver produces bile which is stored in the gallbladder.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-12",
    type: QuestionType.MCQ,
    questionText: "What do enzymes act as?",
    questionTextIgbo: "Gịnị ka enzymes bụ?",
    options: ["Hormones", "Catalysts", "Cells", "Energy sources"],
    optionsIgbo: ["Hormones", "Catalysts", "Sel", "Isi ike"],
    correctAnswer: "Catalysts",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Hormones",
          feedback: "Hormones regulate processes. Enzymes speed up reactions.",
        },
      ],
      defaultFeedback:
        "Enzymes are biological catalysts that speed up digestion.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-13",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What is the end product of protein digestion?",
    questionTextIgbo: "Gịnị bụ ihe ikpeazụ protein na-agbanwe gaa?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "amino acids",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "peptides",
          feedback:
            "Peptides are intermediate. Final products are amino acids.",
        },
      ],
      defaultFeedback: "Proteins are broken down into amino acids.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-14",
    type: QuestionType.TRUE_FALSE,
    questionText: "Lipase breaks down fats.",
    questionTextIgbo: "Lipase na-agbaji abụba?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Wrong. Lipase specifically targets fats.",
        },
      ],
      defaultFeedback: "Lipase breaks fats into fatty acids and glycerol.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-15",
    type: QuestionType.MCQ,
    questionText: "Which organ produces digestive enzymes and hormones?",
    questionTextIgbo: "Kedu akụkụ na-emepụta enzymes na hormones?",
    options: ["Liver", "Pancreas", "Stomach", "Intestine"],
    optionsIgbo: ["Imeju", "Pancreas", "Afo", "Afọ"],
    correctAnswer: "Pancreas",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Liver",
          feedback:
            "Liver produces bile, not digestive enzymes in this context.",
        },
      ],
      defaultFeedback:
        "The pancreas produces enzymes and hormones like insulin.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-16",
    type: QuestionType.MCQ,
    questionText: "Where is bile stored?",
    questionTextIgbo: "Ebee ka a na-echekwa bile?",
    options: ["Liver", "Gallbladder", "Pancreas", "Stomach"],
    optionsIgbo: ["Imeju", "Gallbladder", "Pancreas", "Afo"],
    correctAnswer: "Gallbladder",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Liver",
          feedback: "Liver produces bile but does not store it.",
        },
      ],
      defaultFeedback: "Bile is stored in the gallbladder until needed.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-17",
    type: QuestionType.TRUE_FALSE,
    questionText: "Carbohydrates are broken down into glucose.",
    questionTextIgbo: "Carbohydrates na-agbanwe gaa na glucose?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Wrong. Final digestion of carbohydrates produces glucose.",
        },
      ],
      defaultFeedback:
        "Carbohydrates are broken down into simple sugars like glucose.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-18",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the name of the muscular tube that carries food to the stomach?",
    questionTextIgbo: "Gịnị ka a na-akpọ ụzọ nri si aga n’ime afo?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "oesophagus",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "trachea",
          feedback: "Trachea is for air, not food.",
        },
      ],
      defaultFeedback:
        "The oesophagus carries food from the mouth to the stomach.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-19",
    type: QuestionType.MCQ,
    questionText: "What is mechanical digestion?",
    questionTextIgbo: "Gịnị bụ mechanical digestion?",
    options: [
      "Breaking food with enzymes",
      "Breaking food physically",
      "Absorbing nutrients",
      "Producing bile",
    ],
    optionsIgbo: [
      "Igbaji nri site na enzyme",
      "Igbaji nri n’ahụ",
      "Imịkọrọ nri",
      "Ime bile",
    ],
    correctAnswer: "Breaking food physically",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Breaking food with enzymes",
          feedback: "That is chemical digestion, not mechanical.",
        },
      ],
      defaultFeedback:
        "Mechanical digestion is the physical breakdown of food.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-20",
    type: QuestionType.MCQ,
    questionText: "Which nutrient is NOT digested?",
    questionTextIgbo: "Kedu nutrient anaghị agbaji?",
    options: ["Carbohydrates", "Proteins", "Vitamins", "Fats"],
    optionsIgbo: ["Carbohydrates", "Proteins", "Vitamins", "Fats"],
    correctAnswer: "Vitamins",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Fats",
          feedback: "Fats are digested by lipase.",
        },
      ],
      defaultFeedback:
        "Vitamins do not need digestion; they are absorbed directly.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-21",
    type: QuestionType.TRUE_FALSE,
    questionText: "Digestion only occurs in the stomach.",
    questionTextIgbo: "Mgbaze nri na-eme naanị n’ime afo?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "Completely wrong. Digestion occurs in the mouth, stomach, and intestines.",
        },
      ],
      defaultFeedback:
        "Digestion happens in multiple organs, not just the stomach.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-d-22",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the process of taking digested nutrients into the bloodstream called?",
    questionTextIgbo: "Gịnị ka a na-akpọ usoro nri si abanye n’ime ọbara?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "absorption",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "digestion",
          feedback:
            "Digestion breaks food down. Absorption moves it into the blood.",
        },
      ],
      defaultFeedback:
        "Absorption is the movement of nutrients into the bloodstream.",
    },
    difficulty: 0.5,
  },
];

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS - ECOSYSTEMS (22)
// ═══════════════════════════════════════════════════════════════════

const Q_ECOSYSTEMS = [
  {
    id: "q-e-1",
    type: QuestionType.MCQ,
    questionText: "What is an ecosystem?",
    questionTextIgbo: "Gịnị bụ ecosystem?",
    options: [
      "Only living organisms in an area",
      "Only non-living components",
      "Living and non-living things interacting",
      "A single species population",
    ],
    optionsIgbo: [
      "Nanị ihe dị ndụ",
      "Nanị ihe na-adịghị ndụ",
      "Ihe dị ndụ na ihe na-adịghị ndụ na-emekọrịta",
      "Ụdị otu anụmanụ",
    ],
    correctAnswer: "Living and non-living things interacting",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Only living organisms in an area",
          feedback:
            "That's a community. Ecosystems include both living and non-living components.",
        },
      ],
      defaultFeedback:
        "An ecosystem includes organisms and their physical environment interacting together.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-2",
    type: QuestionType.MCQ,
    questionText: "What is a producer?",
    questionTextIgbo: "Gịnị bụ producer?",
    options: [
      "An organism that eats others",
      "An organism that makes its own food",
      "An organism that decomposes waste",
      "An organism that hunts prey",
    ],
    optionsIgbo: [
      "Ihe na-eri ndị ọzọ",
      "Ihe na-emepụta nri ya",
      "Ihe na-emebi ihe nwụrụ",
      "Ihe na-achụ anụ",
    ],
    correctAnswer: "An organism that makes its own food",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "An organism that eats others",
          feedback:
            "That's a consumer. Producers make their own food via photosynthesis.",
        },
      ],
      defaultFeedback: "Producers like plants make food using sunlight.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-3",
    type: QuestionType.TRUE_FALSE,
    questionText: "Energy decreases at each trophic level.",
    questionTextIgbo: "Ike na-ebelata n’ọkwa trophic ọ bụla?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Wrong. Energy is lost at each level mainly as heat.",
        },
      ],
      defaultFeedback:
        "Only a small percentage of energy transfers to the next level.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-4",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What do we call organisms that break down dead matter?",
    questionTextIgbo: "Gịnị ka a na-akpọ ihe na-emebi ihe nwụrụ?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "decomposers",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "scavengers",
          feedback:
            "Scavengers eat dead animals. Decomposers chemically break them down.",
        },
      ],
      defaultFeedback:
        "Decomposers recycle nutrients by breaking down dead organisms.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-5",
    type: QuestionType.MCQ,
    questionText: "Which is a primary consumer?",
    questionTextIgbo: "Kedu bụ primary consumer?",
    options: ["Lion", "Grass", "Rabbit", "Fungus"],
    optionsIgbo: ["Lion", "Ahịhịa", "Ọkụkọ ọhịa", "Fungus"],
    correctAnswer: "Rabbit",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Lion",
          feedback:
            "Lion is a higher-level consumer. Primary consumers eat producers.",
        },
      ],
      defaultFeedback:
        "Primary consumers feed directly on producers like plants.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-6",
    type: QuestionType.TRUE_FALSE,
    questionText: "A food web is more complex than a food chain.",
    questionTextIgbo: "Food web karịrị food chain mgbagwoju anya?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Food webs include multiple interconnected food chains.",
        },
      ],
      defaultFeedback: "Food webs better represent real feeding relationships.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-7",
    type: QuestionType.MCQ,
    questionText: "Which process removes carbon dioxide from the atmosphere?",
    questionTextIgbo: "Kedu usoro na-ewe carbon dioxide n’ime ikuku?",
    options: ["Respiration", "Combustion", "Photosynthesis", "Decomposition"],
    optionsIgbo: ["Respiration", "Ịkụ ọkụ", "Fotosinthesis", "Mmebi"],
    correctAnswer: "Photosynthesis",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Respiration",
          feedback: "Respiration releases CO₂, not removes it.",
        },
      ],
      defaultFeedback:
        "Photosynthesis removes CO₂ and converts it into glucose.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-8",
    type: QuestionType.MCQ,
    questionText: "Which organisms fix nitrogen from the atmosphere?",
    questionTextIgbo: "Kedu ihe na-eme nitrogen fixation?",
    options: ["Plants", "Animals", "Nitrogen-fixing bacteria", "Fungi"],
    optionsIgbo: ["Osisi", "Anụmanụ", "Bacteria", "Fungi"],
    correctAnswer: "Nitrogen-fixing bacteria",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Plants",
          feedback:
            "Plants rely on bacteria to convert nitrogen into usable forms.",
        },
      ],
      defaultFeedback:
        "Nitrogen-fixing bacteria convert N₂ into usable compounds.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-9",
    type: QuestionType.TRUE_FALSE,
    questionText: "Deforestation increases biodiversity.",
    questionTextIgbo: "Ịkpụ osisi na-abawanye biodiversity?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback: "Deforestation destroys habitats and reduces biodiversity.",
        },
      ],
      defaultFeedback: "Biodiversity decreases when habitats are destroyed.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-10",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What is the place where an organism lives called?",
    questionTextIgbo: "Kedu ebe ihe dị ndụ bi ka a na-akpọ?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "habitat",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "ecosystem",
          feedback:
            "Ecosystem is broader. Habitat is the specific living place.",
        },
      ],
      defaultFeedback: "A habitat is the natural home of an organism.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-11",
    type: QuestionType.MCQ,
    questionText: "What is a population?",
    questionTextIgbo: "Gịnị bụ population?",
    options: [
      "Different species together",
      "One species in an area",
      "All ecosystems combined",
      "Only plants",
    ],
    optionsIgbo: [
      "Ụdị dị iche iche",
      "Ụdị otu n’otu ebe",
      "Ecosystem niile",
      "Nanị osisi",
    ],
    correctAnswer: "One species in an area",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Different species together",
          feedback: "That describes a community, not a population.",
        },
      ],
      defaultFeedback:
        "A population is all individuals of one species in an area.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-12",
    type: QuestionType.TRUE_FALSE,
    questionText: "Producers form the base of food chains.",
    questionTextIgbo: "Producers bụ isi food chain?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Without producers, no energy enters the system.",
        },
      ],
      defaultFeedback: "Producers capture energy and support all other levels.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-13",
    type: QuestionType.MCQ,
    questionText: "Which is a biotic factor?",
    questionTextIgbo: "Kedu bụ biotic factor?",
    options: ["Temperature", "Rainfall", "Predator", "Soil"],
    optionsIgbo: ["Okpomọkụ", "Mmiri ozuzo", "Anụ ọhịa", "Ala"],
    correctAnswer: "Predator",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Temperature",
          feedback: "Temperature is abiotic, not living.",
        },
      ],
      defaultFeedback: "Biotic factors are living components of ecosystems.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-14",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What do we call animals that eat both plants and animals?",
    questionTextIgbo: "Gịnị ka a na-akpọ anụmanụ na-eri osisi na anụmanụ?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "omnivores",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "carnivores",
          feedback: "Carnivores eat only animals.",
        },
      ],
      defaultFeedback: "Omnivores eat both plants and animals.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-15",
    type: QuestionType.TRUE_FALSE,
    questionText: "Biomass decreases at higher trophic levels.",
    questionTextIgbo: "Biomass na-ebelata ka trophic level na-arị elu?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Energy loss leads to reduced biomass at higher levels.",
        },
      ],
      defaultFeedback: "Less energy means less biomass at higher levels.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-16",
    type: QuestionType.MCQ,
    questionText: "What is the main source of energy in ecosystems?",
    questionTextIgbo: "Kedu bụ isi ike na ecosystem?",
    options: ["Wind", "Sun", "Water", "Soil"],
    optionsIgbo: ["Ifufe", "Anyanwụ", "Mmiri", "Ala"],
    correctAnswer: "Sun",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Wind",
          feedback: "Wind is secondary. The sun drives almost all ecosystems.",
        },
      ],
      defaultFeedback: "The sun provides energy for photosynthesis.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-17",
    type: QuestionType.MCQ,
    questionText: "What type of relationship benefits both organisms?",
    questionTextIgbo: "Kedu mmekọrịta na-enyere ha abụọ aka?",
    options: ["Parasitism", "Mutualism", "Predation", "Competition"],
    optionsIgbo: ["Parasitism", "Mutualism", "Ịchụ anụ", "Asọmpi"],
    correctAnswer: "Mutualism",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Parasitism",
          feedback: "Parasitism benefits one and harms the other.",
        },
      ],
      defaultFeedback: "Mutualism benefits both organisms involved.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-18",
    type: QuestionType.TRUE_FALSE,
    questionText: "Overfishing can disrupt ecosystems.",
    questionTextIgbo: "Ịkụ azụ nke ukwuu nwere ike imebi ecosystem?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Removing species disrupts food webs.",
        },
      ],
      defaultFeedback: "Overfishing affects balance in marine ecosystems.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-19",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What term describes the variety of species in an ecosystem?",
    questionTextIgbo: "Gịnị ka a na-akpọ ọtụtụ ụdị ndụ?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "biodiversity",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "habitat",
          feedback: "Habitat is location, not variety.",
        },
      ],
      defaultFeedback: "Biodiversity refers to the variety of species.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-20",
    type: QuestionType.MCQ,
    questionText: "If predators are removed, what happens to prey?",
    questionTextIgbo: "Ọ bụrụ na predators apụ, gịnị na-eme prey?",
    options: ["Decrease", "Stay same", "Increase rapidly", "Disappear"],
    optionsIgbo: ["Belata", "Nọgide otu", "Bawanye ngwa ngwa", "Laa n’iyi"],
    correctAnswer: "Increase rapidly",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Decrease",
          feedback: "No predators means less control, so prey increases.",
        },
      ],
      defaultFeedback: "Without predators, prey populations grow rapidly.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-21",
    type: QuestionType.TRUE_FALSE,
    questionText: "Burning fossil fuels releases carbon dioxide.",
    questionTextIgbo: "Ịkụ fossil fuels na-ewepụta carbon dioxide?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Combustion releases CO₂ into the atmosphere.",
        },
      ],
      defaultFeedback: "Burning fuels increases atmospheric CO₂.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-e-22",
    type: QuestionType.MCQ,
    questionText: "Which is an abiotic factor?",
    questionTextIgbo: "Kedu bụ abiotic factor?",
    options: ["Plant", "Animal", "Rainfall", "Fungi"],
    optionsIgbo: ["Osisi", "Anụmanụ", "Mmiri ozuzo", "Fungi"],
    correctAnswer: "Rainfall",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Plant",
          feedback: "Plants are living (biotic), not abiotic.",
        },
      ],
      defaultFeedback: "Abiotic factors are non-living environmental factors.",
    },
    difficulty: 0.5,
  },
];

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS - REPRODUCTION (20)
// ═══════════════════════════════════════════════════════════════════

const Q_REPRODUCTION = [
  {
    id: "q-r-1",
    type: QuestionType.MCQ,
    questionText: "Where does fertilisation occur in humans?",
    questionTextIgbo: "Ebee ka fertilisation na-eme n’ime mmadụ?",
    options: ["Uterus", "Ovary", "Fallopian tube", "Vagina"],
    optionsIgbo: ["Ụlọ nwa", "Ovary", "Fallopian tube", "Vagina"],
    correctAnswer: "Fallopian tube",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Uterus",
          feedback:
            "Wrong. Implantation happens in the uterus. Fertilisation happens in the fallopian tube.",
        },
      ],
      defaultFeedback:
        "Fertilisation occurs in the fallopian tube before the embryo moves to the uterus.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-2",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "The placenta allows direct mixing of mother’s and foetus’s blood.",
    questionTextIgbo: "Placenta na-eme ka ọbara nne na nwa jikọọ ọnụ?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "Incorrect. The blood does NOT mix. Exchange happens across a membrane.",
        },
      ],
      defaultFeedback:
        "The placenta allows exchange of nutrients and gases without mixing blood.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-3",
    type: QuestionType.MCQ,
    questionText:
      "On which day of a 28-day cycle does ovulation typically occur?",
    questionTextIgbo: "Kedu ụbọchị ovulation na-eme n’ime cycle 28 ụbọchị?",
    options: ["Day 1", "Day 7", "Day 14", "Day 28"],
    optionsIgbo: ["Ụbọchị 1", "Ụbọchị 7", "Ụbọchị 14", "Ụbọchị 28"],
    correctAnswer: "Day 14",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Day 1",
          feedback: "Day 1 is menstruation. Ovulation is around day 14.",
        },
      ],
      defaultFeedback:
        "Ovulation usually occurs around day 14 in a 28-day cycle.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-4",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the process of the embryo attaching to the uterus called?",
    questionTextIgbo: "Gịnị ka a na-akpọ mgbe embryo na-ejikọta na uterus?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "implantation",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "fertilisation",
          feedback:
            "Fertilisation is sperm + egg. Implantation is attachment to uterus.",
        },
      ],
      defaultFeedback:
        "Implantation is when the embryo attaches to the uterus lining.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-5",
    type: QuestionType.MCQ,
    questionText: "Which hormone triggers ovulation?",
    questionTextIgbo: "Kedu hormone na-ebute ovulation?",
    options: ["Oestrogen", "Progesterone", "FSH", "LH"],
    optionsIgbo: ["Oestrogen", "Progesterone", "FSH", "LH"],
    correctAnswer: "LH",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "FSH",
          feedback: "FSH develops the follicle. LH triggers ovulation.",
        },
      ],
      defaultFeedback: "LH surge causes the release of the egg from the ovary.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-6",
    type: QuestionType.TRUE_FALSE,
    questionText: "Females produce new eggs continuously throughout life.",
    questionTextIgbo: "Ụmụ nwanyị na-emepụta ákwá ọhụrụ ndụ ha niile?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback: "Wrong. Females are born with all their eggs.",
        },
      ],
      defaultFeedback: "Females are born with a fixed number of eggs.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-7",
    type: QuestionType.MCQ,
    questionText: "What is the function of the testes?",
    questionTextIgbo: "Gịnị bụ ọrụ testes?",
    options: [
      "Produce eggs",
      "Produce sperm and testosterone",
      "Store urine",
      "Produce oestrogen",
    ],
    optionsIgbo: [
      "I mepụta ákwá",
      "I mepụta sperm na testosterone",
      "I chekwaa mmamịrị",
      "I mepụta oestrogen",
    ],
    correctAnswer: "Produce sperm and testosterone",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Produce eggs",
          feedback: "Eggs are produced by ovaries, not testes.",
        },
      ],
      defaultFeedback: "Testes produce sperm and the hormone testosterone.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-8",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What structure provides nutrients to the developing foetus?",
    questionTextIgbo: "Kedu akụkụ na-enye nwa nri n’ime ime?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "placenta",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "uterus",
          feedback: "Uterus houses the foetus. Placenta provides nutrients.",
        },
      ],
      defaultFeedback:
        "The placenta transfers nutrients and oxygen to the foetus.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-9",
    type: QuestionType.MCQ,
    questionText:
      "What happens to progesterone if fertilisation does not occur?",
    questionTextIgbo: "Gịnị na-eme progesterone ma fertilisation emeghị?",
    options: [
      "Increases",
      "Remains constant",
      "Decreases",
      "Changes to oestrogen",
    ],
    optionsIgbo: [
      "Na-abawanye",
      "Na-adị otu",
      "Na-ebelata",
      "Na-agbanwe gaa na oestrogen",
    ],
    correctAnswer: "Decreases",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Increases",
          feedback: "Progesterone rises only if pregnancy occurs.",
        },
      ],
      defaultFeedback: "Progesterone falls, leading to menstruation.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-10",
    type: QuestionType.TRUE_FALSE,
    questionText: "Human pregnancy lasts about 40 weeks.",
    questionTextIgbo: "Ime nwa mmadụ na-ewe ihe dị ka izu 40?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Average gestation is about 40 weeks.",
        },
      ],
      defaultFeedback: "Human gestation lasts approximately 40 weeks.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-11",
    type: QuestionType.MCQ,
    questionText: "Which structure connects the foetus to the placenta?",
    questionTextIgbo: "Kedu ihe na-ejikọta nwa na placenta?",
    options: ["Cervix", "Umbilical cord", "Vagina", "Ovary"],
    optionsIgbo: ["Cervix", "Umbilical cord", "Vagina", "Ovary"],
    correctAnswer: "Umbilical cord",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Cervix",
          feedback:
            "Cervix is the opening of the uterus, not a connection to placenta.",
        },
      ],
      defaultFeedback:
        "The umbilical cord carries nutrients and oxygen to the foetus.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-12",
    type: QuestionType.TRUE_FALSE,
    questionText: "FSH is produced by the pituitary gland.",
    questionTextIgbo: "FSH sitere na pituitary gland?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "FSH is secreted by the pituitary gland.",
        },
      ],
      defaultFeedback:
        "FSH is produced by the pituitary gland to stimulate egg development.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-13",
    type: QuestionType.MCQ,
    questionText: "What is the role of the scrotum?",
    questionTextIgbo: "Gịnị bụ ọrụ scrotum?",
    options: [
      "Produce sperm",
      "Keep testes cool",
      "Store urine",
      "Produce hormones",
    ],
    optionsIgbo: [
      "I mepụta sperm",
      "I mee ka testes dị jụụ",
      "I chekwaa mmamịrị",
      "I mepụta hormones",
    ],
    correctAnswer: "Keep testes cool",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Produce sperm",
          feedback: "Sperm is produced in the testes, not the scrotum.",
        },
      ],
      defaultFeedback:
        "The scrotum keeps testes slightly below body temperature.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-14",
    type: QuestionType.SHORT_ANSWER,
    questionText: "Which hormone maintains the uterus lining after ovulation?",
    questionTextIgbo:
      "Kedu hormone na-echekwa uterus lining mgbe ovulation gasịrị?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "progesterone",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "oestrogen",
          feedback:
            "Oestrogen rebuilds lining earlier. Progesterone maintains it.",
        },
      ],
      defaultFeedback:
        "Progesterone maintains the uterus lining after ovulation.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-15",
    type: QuestionType.MCQ,
    questionText: "What is a zygote?",
    questionTextIgbo: "Gịnị bụ zygote?",
    options: ["Unfertilised egg", "Fertilised egg", "Embryo", "Foetus"],
    optionsIgbo: [
      "Ákwá na-adịghị fertilised",
      "Ákwá fertilised",
      "Embryo",
      "Foetus",
    ],
    correctAnswer: "Fertilised egg",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Embryo",
          feedback: "Embryo develops after zygote starts dividing.",
        },
      ],
      defaultFeedback:
        "A zygote is the cell formed immediately after fertilisation.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-16",
    type: QuestionType.TRUE_FALSE,
    questionText: "The menstrual cycle is controlled by multiple hormones.",
    questionTextIgbo:
      "Menstrual cycle na-achịkwa site na hormones dị iche iche?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "It involves FSH, LH, oestrogen, and progesterone.",
        },
      ],
      defaultFeedback: "Multiple hormones regulate the menstrual cycle.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-17",
    type: QuestionType.MCQ,
    questionText: "Where are sperm stored after production?",
    questionTextIgbo: "Ebee ka a na-echekwa sperm?",
    options: ["Testes", "Epididymis", "Urethra", "Prostate"],
    optionsIgbo: ["Testes", "Epididymis", "Urethra", "Prostate"],
    correctAnswer: "Epididymis",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Testes",
          feedback: "Testes produce sperm. Epididymis stores and matures them.",
        },
      ],
      defaultFeedback: "Sperm are stored and mature in the epididymis.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-18",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What is the stage from fertilisation to 8 weeks called?",
    questionTextIgbo: "Gịnị ka a na-akpọ oge site na fertilisation ruo izu 8?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "embryo",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "foetus",
          feedback: "Foetus is after 8 weeks. Before that, it's embryo.",
        },
      ],
      defaultFeedback: "The early stage is called an embryo.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-19",
    type: QuestionType.MCQ,
    questionText: "What does oestrogen do in the menstrual cycle?",
    questionTextIgbo: "Gịnị ka oestrogen na-eme?",
    options: [
      "Triggers ovulation directly",
      "Breaks uterus lining",
      "Rebuilds uterus lining",
      "Produces sperm",
    ],
    optionsIgbo: [
      "Na-ebute ovulation ozugbo",
      "Na-ebibi lining",
      "Na-ewughachi lining",
      "Na-emepụta sperm",
    ],
    correctAnswer: "Rebuilds uterus lining",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Triggers ovulation directly",
          feedback: "LH triggers ovulation. Oestrogen prepares lining.",
        },
      ],
      defaultFeedback:
        "Oestrogen rebuilds the uterus lining after menstruation.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-r-20",
    type: QuestionType.TRUE_FALSE,
    questionText: "The male reproductive system produces sperm and hormones.",
    questionTextIgbo: "Usoro ọmụmụ nwoke na-emepụta sperm na hormones?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Testes produce both sperm and testosterone.",
        },
      ],
      defaultFeedback: "The testes produce sperm and testosterone.",
    },
    difficulty: 0.5,
  },
];

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS - STATES OF MATTER (22)
// ═══════════════════════════════════════════════════════════════════

const Q_STATES_OF_MATTER = [
  {
    id: "q-sm-1",
    type: QuestionType.MCQ,
    questionText: "Which state of matter has a fixed shape and fixed volume?",
    questionTextIgbo: "Kedu ọnọdụ ihe nwere udi na olu kwụsie ike?",
    options: ["Solid", "Liquid", "Gas", "Plasma"],
    optionsIgbo: ["Sọlid", "Likuid", "Gas", "Plasma"],
    correctAnswer: "Solid",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Liquid",
          feedback: "Liquid has fixed volume but no fixed shape.",
        },
      ],
      defaultFeedback: "Solids have both fixed shape and fixed volume.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-sm-2",
    type: QuestionType.TRUE_FALSE,
    questionText: "Gases have a fixed volume.",
    questionTextIgbo: "Gas nwere olu kwụsie ike?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback: "Gas expands to fill any container. No fixed volume.",
        },
      ],
      defaultFeedback: "Gases have neither fixed shape nor fixed volume.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-sm-3",
    type: QuestionType.MCQ,
    questionText:
      "Which state of matter takes the shape of its container but has fixed volume?",
    questionTextIgbo:
      "Kedu ọnọdụ ihe na-ewere udi nke akpa mana nwere otu olu?",
    options: ["Solid", "Liquid", "Gas", "Plasma"],
    optionsIgbo: ["Sọlid", "Likuid", "Gas", "Plasma"],
    correctAnswer: "Liquid",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Gas",
          feedback: "Gas has no fixed volume. Liquid does.",
        },
      ],
      defaultFeedback: "Liquids flow and take container shape but keep volume.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-sm-4",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the process of a solid changing directly into a gas called?",
    questionTextIgbo: "Gịnị ka a na-akpọ mgbe sọlid gbanwee ozugbo gaa gas?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "sublimation",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "melting",
          feedback: "Melting is solid to liquid, not gas.",
        },
      ],
      defaultFeedback: "Sublimation is solid directly to gas.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-sm-5",
    type: QuestionType.MCQ,
    questionText:
      "Which state of matter has particles that are far apart and move freely?",
    questionTextIgbo:
      "Kedu ọnọdụ ihe nwere mkpụrụ dị anya na na-agagharị n’efu?",
    options: ["Solid", "Liquid", "Gas", "All"],
    optionsIgbo: ["Sọlid", "Likuid", "Gas", "Ha niile"],
    correctAnswer: "Gas",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Liquid",
          feedback: "Liquid particles are close but can move past each other.",
        },
      ],
      defaultFeedback: "Gas particles are far apart and move freely.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-sm-6",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Particles in a solid vibrate but do not move from place to place.",
    questionTextIgbo:
      "Mkpụrụ dị na sọlid na-ama jijiji mana anaghị agagharị ebe ọzọ?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "They vibrate in fixed positions, not freely moving.",
        },
      ],
      defaultFeedback: "Solid particles vibrate in fixed positions.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-sm-7",
    type: QuestionType.MCQ,
    questionText: "What is the process of liquid changing into gas called?",
    questionTextIgbo: "Gịnị ka a na-akpọ mgbe likuid gbanwee gaa gas?",
    options: ["Condensation", "Evaporation", "Freezing", "Melting"],
    optionsIgbo: ["Condensation", "Evaporation", "Freezing", "Melting"],
    correctAnswer: "Evaporation",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Condensation",
          feedback: "Condensation is gas to liquid.",
        },
      ],
      defaultFeedback: "Evaporation is liquid to gas.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-sm-8",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What is the process of gas changing into liquid called?",
    questionTextIgbo: "Gịnị ka a na-akpọ mgbe gas gbanwee gaa likuid?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "condensation",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "evaporation",
          feedback: "Evaporation is liquid to gas.",
        },
      ],
      defaultFeedback: "Condensation is gas to liquid.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-sm-9",
    type: QuestionType.MCQ,
    questionText: "Which state of matter is most compressible?",
    questionTextIgbo: "Kedu ọnọdụ ihe kacha mfe ịpịkọta?",
    options: ["Solid", "Liquid", "Gas", "All equally"],
    optionsIgbo: ["Sọlid", "Likuid", "Gas", "Ha niile"],
    correctAnswer: "Gas",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Liquid",
          feedback: "Liquids are not easily compressible.",
        },
      ],
      defaultFeedback:
        "Gases compress easily due to large spaces between particles.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-sm-10",
    type: QuestionType.TRUE_FALSE,
    questionText: "Increasing temperature increases particle kinetic energy.",
    questionTextIgbo:
      "Ịbawanye okpomọkụ na-eme ka ike mmegharị mkpụrụ bawanye?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Higher temperature means higher particle motion.",
        },
      ],
      defaultFeedback:
        "Temperature is directly related to particle kinetic energy.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-sm-11",
    type: QuestionType.MCQ,
    questionText: "What happens during melting?",
    questionTextIgbo: "Gịnị na-eme mgbe melting na-eme?",
    options: [
      "Solid to liquid",
      "Liquid to gas",
      "Gas to liquid",
      "Liquid to solid",
    ],
    optionsIgbo: [
      "Sọlid gaa likuid",
      "Likuid gaa gas",
      "Gas gaa likuid",
      "Likuid gaa sọlid",
    ],
    correctAnswer: "Solid to liquid",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Liquid to gas",
          feedback: "That is evaporation, not melting.",
        },
      ],
      defaultFeedback: "Melting is the change from solid to liquid.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-sm-12",
    type: QuestionType.TRUE_FALSE,
    questionText: "Liquids cannot flow.",
    questionTextIgbo: "Likuid enweghị ike ịga?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback: "Flow is a defining property of liquids.",
        },
      ],
      defaultFeedback: "Liquids can flow and take the shape of containers.",
    },
    difficulty: 0.3,
  },

  {
    id: "q-sm-13",
    type: QuestionType.MCQ,
    questionText:
      "Which state of matter has the strongest intermolecular forces?",
    questionTextIgbo:
      "Kedu ọnọdụ ihe nwere ike njikọ kacha ike n’etiti mkpụrụ?",
    options: ["Solid", "Liquid", "Gas", "Plasma"],
    optionsIgbo: ["Sọlid", "Likuid", "Gas", "Plasma"],
    correctAnswer: "Solid",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Gas",
          feedback: "Gas has the weakest intermolecular forces.",
        },
      ],
      defaultFeedback:
        "Solids have tightly bound particles with strong forces.",
    },
    difficulty: 0.6,
  },

  {
    id: "q-sm-14",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What is the process of liquid changing into solid called?",
    questionTextIgbo: "Gịnị ka a na-akpọ mgbe likuid gbanwee gaa sọlid?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "freezing",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "melting",
          feedback: "Melting is solid to liquid.",
        },
      ],
      defaultFeedback: "Freezing is liquid to solid.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-sm-15",
    type: QuestionType.MCQ,
    questionText: "Which process requires heat energy to be absorbed?",
    questionTextIgbo: "Kedu usoro chọrọ ka okpomọkụ banye n’ime ya?",
    options: ["Freezing", "Condensation", "Melting", "All"],
    optionsIgbo: ["Freezing", "Condensation", "Melting", "Ha niile"],
    correctAnswer: "Melting",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Freezing",
          feedback: "Freezing releases heat, not absorbs.",
        },
      ],
      defaultFeedback: "Melting requires heat energy input.",
    },
    difficulty: 0.6,
  },

  {
    id: "q-sm-16",
    type: QuestionType.TRUE_FALSE,
    questionText: "Gas particles move faster than liquid particles on average.",
    questionTextIgbo: "Mkpụrụ gas na-agagharị ngwa ngwa karịa nke likuid?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Gas particles have higher kinetic energy.",
        },
      ],
      defaultFeedback:
        "Gas particles move fastest due to higher kinetic energy.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-sm-17",
    type: QuestionType.MCQ,
    questionText: "What is plasma?",
    questionTextIgbo: "Gịnị bụ plasma?",
    options: ["Solid particles", "Ionised gas", "Liquid metal", "Cold gas"],
    optionsIgbo: ["Mkpụrụ sọlid", "Gas nwere ions", "Likuid metal", "Gas oyi"],
    correctAnswer: "Ionised gas",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Cold gas",
          feedback: "Plasma is high-energy, not cold.",
        },
      ],
      defaultFeedback: "Plasma is an ionised, high-energy state of matter.",
    },
    difficulty: 0.6,
  },

  {
    id: "q-sm-18",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What is the term for particles spreading out to fill space?",
    questionTextIgbo: "Gịnị ka a na-akpọ mgbe mkpụrụ gbasaa jupụta ebe?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "diffusion",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "expansion",
          feedback: "Diffusion is the correct scientific term.",
        },
      ],
      defaultFeedback: "Diffusion is the spreading of particles.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-sm-19",
    type: QuestionType.MCQ,
    questionText: "Which change is exothermic?",
    questionTextIgbo: "Kedu mgbanwe na-ewepụta okpomọkụ?",
    options: ["Melting", "Evaporation", "Freezing", "Sublimation"],
    optionsIgbo: ["Melting", "Evaporation", "Freezing", "Sublimation"],
    correctAnswer: "Freezing",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Melting",
          feedback: "Melting absorbs heat, not releases.",
        },
      ],
      defaultFeedback: "Freezing releases heat energy.",
    },
    difficulty: 0.6,
  },

  {
    id: "q-sm-20",
    type: QuestionType.TRUE_FALSE,
    questionText: "All matter is made up of particles.",
    questionTextIgbo: "Ihe niile mejupụtara mkpụrụ?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Particle theory explains all matter.",
        },
      ],
      defaultFeedback: "All matter consists of particles.",
    },
    difficulty: 0.3,
  },
];

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS - ELECTRICITY (22)
// ═══════════════════════════════════════════════════════════════════

const Q_ELECTRICITY = [
  {
    id: "q-el-1",
    type: QuestionType.MCQ,
    questionText: "What is the unit of electric current?",
    questionTextIgbo: "Kedu otu esi atụ current eletrik?",
    options: ["Volt", "Ohm", "Ampere", "Watt"],
    optionsIgbo: ["Volt", "Ohm", "Ampere", "Watt"],
    correctAnswer: "Ampere",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Volt",
          feedback: "Volt measures voltage, not current.",
        },
        {
          pattern: "Ohm",
          feedback: "Ohm measures resistance, not current.",
        },
      ],
      defaultFeedback: "Current is measured in amperes (A).",
    },
    difficulty: 0.3,
  },

  {
    id: "q-el-2",
    type: QuestionType.MCQ,
    questionText:
      "Using Ohm’s Law, what is the current when V = 12V and R = 4Ω?",
    questionTextIgbo:
      "Site na iwu Ohm, kedu current ma ọ bụrụ V = 12V na R = 4Ω?",
    options: ["3A", "48A", "0.33A", "16A"],
    optionsIgbo: ["3A", "48A", "0.33A", "16A"],
    correctAnswer: "3A",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "48A",
          feedback: "You multiplied instead of dividing. I = V/R.",
        },
      ],
      defaultFeedback: "I = 12 / 4 = 3A.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-el-3",
    type: QuestionType.TRUE_FALSE,
    questionText: "In a series circuit, the current is the same at all points.",
    questionTextIgbo: "Na circuit series, current na-adị otu n'ebe niile?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Series circuits have one path, so current cannot vary.",
        },
      ],
      defaultFeedback: "Current is identical throughout a series circuit.",
    },
    difficulty: 0.3,
  },

  {
    id: "q-el-4",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "Write the formula for electrical power using voltage and current.",
    questionTextIgbo: "Dee formula ike eletrik jiri voltage na current.",
    options: null,
    optionsIgbo: null,
    correctAnswer: "P = IV",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "V = IR",
          feedback: "That is Ohm’s Law, not power.",
        },
      ],
      defaultFeedback: "Power equals current multiplied by voltage.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-el-5",
    type: QuestionType.MCQ,
    questionText: "How is a voltmeter connected in a circuit?",
    questionTextIgbo: "Kedu otu e si ejikọ voltmeter na circuit?",
    options: ["Series", "Parallel", "Across battery only", "Grounded"],
    optionsIgbo: ["Series", "Parallel", "N’elu batrị naanị", "Grounded"],
    correctAnswer: "Parallel",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Series",
          feedback: "Series connection is for ammeters, not voltmeters.",
        },
      ],
      defaultFeedback:
        "Voltmeters are connected in parallel across components.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-el-6",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "In a parallel circuit, voltage is the same across all branches.",
    questionTextIgbo: "Na parallel circuit, voltage na-adị otu n'akụkụ niile?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Voltage is constant across parallel branches.",
        },
      ],
      defaultFeedback:
        "Parallel circuits maintain equal voltage across branches.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-el-7",
    type: QuestionType.MCQ,
    questionText:
      "What happens to total resistance in a series circuit when more resistors are added?",
    questionTextIgbo:
      "Gịnị na-eme resistance mgbe a gbakwunye resistors na series?",
    options: ["Decreases", "Increases", "Stays same", "Becomes zero"],
    optionsIgbo: ["Na-ebelata", "Na-abawanye", "Na-adị otu", "Na-abụ zero"],
    correctAnswer: "Increases",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Decreases",
          feedback: "That is true for parallel circuits, not series.",
        },
      ],
      defaultFeedback:
        "Resistances add in series, increasing total resistance.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-el-8",
    type: QuestionType.MCQ,
    questionText:
      "Which component allows current to flow in only one direction?",
    questionTextIgbo: "Kedu component na-ekwe ka current gafee naanị otu ụzọ?",
    options: ["Resistor", "Capacitor", "Diode", "Battery"],
    optionsIgbo: ["Resistor", "Capacitor", "Diode", "Batrị"],
    correctAnswer: "Diode",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Resistor",
          feedback: "Resistors limit current, not direction.",
        },
      ],
      defaultFeedback: "A diode permits one-way current flow.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-el-9",
    type: QuestionType.TRUE_FALSE,
    questionText: "Resistance increases as wire length increases.",
    questionTextIgbo: "Resistance na-abawanye ka ogologo waya na-abawanye?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Longer wire means more collisions for electrons.",
        },
      ],
      defaultFeedback: "Resistance is proportional to length.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-el-10",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the formula for resistance using voltage and current?",
    questionTextIgbo: "Kedu formula resistance jiri voltage na current?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "R = V/I",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "R = IV",
          feedback:
            "That is incorrect. That gives power when rearranged wrongly.",
        },
      ],
      defaultFeedback: "Resistance equals voltage divided by current.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-el-11",
    type: QuestionType.MCQ,
    questionText: "Two resistors (2Ω and 3Ω) are in series. Total resistance?",
    questionTextIgbo: "Resistors 2Ω na 3Ω na series. Gịnị bụ total resistance?",
    options: ["5Ω", "6Ω", "1Ω", "2.5Ω"],
    optionsIgbo: ["5Ω", "6Ω", "1Ω", "2.5Ω"],
    correctAnswer: "5Ω",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "6Ω",
          feedback: "You multiplied instead of adding.",
        },
      ],
      defaultFeedback: "Series resistance = 2 + 3 = 5Ω.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-el-12",
    type: QuestionType.TRUE_FALSE,
    questionText: "Static electricity involves movement of electrons.",
    questionTextIgbo: "Static eletrik na-agụnye mmegharị electrons?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Static charge builds from electron transfer.",
        },
      ],
      defaultFeedback: "Static electricity results from electron transfer.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-el-13",
    type: QuestionType.MCQ,
    questionText: "A device uses 100W at 10V. What current flows?",
    questionTextIgbo: "Ngwaọrụ ji 100W na 10V. Kedu current?",
    options: ["10A", "0.1A", "1000A", "1A"],
    optionsIgbo: ["10A", "0.1A", "1000A", "1A"],
    correctAnswer: "10A",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "1A",
          feedback: "You divided incorrectly. I = P/V.",
        },
      ],
      defaultFeedback: "I = 100 / 10 = 10A.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-el-14",
    type: QuestionType.MCQ,
    questionText: "What does an ammeter measure?",
    questionTextIgbo: "Gịnị ka ammeter na-atụ?",
    options: ["Voltage", "Current", "Resistance", "Power"],
    optionsIgbo: ["Voltage", "Current", "Resistance", "Power"],
    correctAnswer: "Current",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Voltage",
          feedback: "Voltage is measured by a voltmeter.",
        },
      ],
      defaultFeedback: "An ammeter measures electric current.",
    },
    difficulty: 0.3,
  },

  {
    id: "q-el-15",
    type: QuestionType.TRUE_FALSE,
    questionText: "Like charges repel each other.",
    questionTextIgbo: "Charges yiri ibe ha na-achụpụ onwe ha?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Opposite charges attract, not like charges.",
        },
      ],
      defaultFeedback: "Like charges repel, unlike charges attract.",
    },
    difficulty: 0.3,
  },

  {
    id: "q-el-16",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What is the unit of resistance?",
    questionTextIgbo: "Kedu unit resistance?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "ohm",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "volt",
          feedback: "Volt measures voltage, not resistance.",
        },
      ],
      defaultFeedback: "Resistance is measured in ohms (Ω).",
    },
    difficulty: 0.3,
  },

  {
    id: "q-el-17",
    type: QuestionType.MCQ,
    questionText: "In parallel circuits, current is:",
    questionTextIgbo: "Na parallel circuit, current si otú?",
    options: [
      "Same everywhere",
      "Splits between branches",
      "Zero",
      "Constant only in battery",
    ],
    optionsIgbo: [
      "Na-adị otu",
      "Na-ekewa n’ụzọ dị iche",
      "Zero",
      "Na-adị naanị na batrị",
    ],
    correctAnswer: "Splits between branches",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Same everywhere",
          feedback: "That applies to series circuits.",
        },
      ],
      defaultFeedback: "Current divides across branches in parallel.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-el-18",
    type: QuestionType.TRUE_FALSE,
    questionText: "Thicker wires have lower resistance.",
    questionTextIgbo: "Waya buru ibu nwere resistance dị ala?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Larger cross-sectional area reduces resistance.",
        },
      ],
      defaultFeedback: "Thicker wires reduce resistance.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-el-19",
    type: QuestionType.MCQ,
    questionText: "What energy conversion occurs in a resistor?",
    questionTextIgbo: "Kedu mgbanwe ike na-eme na resistor?",
    options: [
      "Electrical to heat",
      "Heat to electrical",
      "Chemical to electrical",
      "Electrical to chemical",
    ],
    optionsIgbo: [
      "Eletrik gaa okpomọkụ",
      "Okpomọkụ gaa eletrik",
      "Chemical gaa eletrik",
      "Eletrik gaa chemical",
    ],
    correctAnswer: "Electrical to heat",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Chemical to electrical",
          feedback: "That occurs in batteries, not resistors.",
        },
      ],
      defaultFeedback: "Resistors convert electrical energy to heat.",
    },
    difficulty: 0.5,
  },
  {
    id: "q-el-20",
    type: QuestionType.MCQ,
    questionText: "Which material is the best conductor?",
    questionTextIgbo: "Kedu ihe kacha mma n’ịdu eletrik?",
    options: ["Wood", "Glass", "Silver", "Rubber"],
    optionsIgbo: ["Osisi", "Glass", "Silver", "Rubber"],
    correctAnswer: "Silver",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Wood",
          feedback: "Wood is an insulator.",
        },
      ],
      defaultFeedback: "Silver is the best conductor listed.",
    },
    difficulty: 0.4,
  },
  {
    id: "q-el-21",
    type: QuestionType.TRUE_FALSE,
    questionText: "In a series circuit, voltage is shared between components.",
    questionTextIgbo: "Na series circuit, voltage na-ekewa n'etiti components?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Voltage divides across components in series circuits.",
        },
      ],
      defaultFeedback:
        "In series circuits, total voltage is shared across components.",
    },
    difficulty: 0.4,
  },
  {
    id: "q-el-22",
    type: QuestionType.MCQ,
    questionText:
      "If voltage remains constant and resistance increases, what happens to current?",
    questionTextIgbo:
      "Ọ bụrụ na voltage adịghị agbanwe ma resistance abawanye, gịnị na-eme current?",
    options: ["Increases", "Decreases", "Stays same", "Becomes zero"],
    optionsIgbo: ["Na-abawanye", "Na-ebelata", "Na-adị otu", "Na-abụ zero"],
    correctAnswer: "Decreases",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Increases",
          feedback: "Ohm’s Law: I = V/R. Increasing R reduces I.",
        },
      ],
      defaultFeedback:
        "Current decreases when resistance increases at constant voltage.",
    },
    difficulty: 0.5,
  },
];

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS - GENETICS (24)
// ═══════════════════════════════════════════════════════════════════

const Q_GENETICS = [
  {
    id: "q-g-1",
    type: QuestionType.MCQ,
    questionText: "What are different versions of a gene called?",
    questionTextIgbo: "Gịnị ka a na-akpọ ụdị dị iche iche nke gene?",
    options: ["Chromosomes", "Alleles", "Genotypes", "Proteins"],
    optionsIgbo: ["Chromosomes", "Alleles", "Genotype", "Protein"],
    correctAnswer: "Alleles",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Chromosomes",
          feedback: "Chromosomes contain many genes, not versions of one gene.",
        },
      ],
      defaultFeedback: "Alleles are different forms of the same gene.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-g-2",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "A dominant allele can be expressed even if only one copy is present.",
    questionTextIgbo:
      "Allele siri ike nwere ike igosi onwe ya ọbụna ma ọ bụrụ na otu naanị dị?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "That describes recessive alleles, not dominant ones.",
        },
      ],
      defaultFeedback: "Dominant alleles are expressed with just one copy.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-g-3",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What base pairs with adenine (A) in DNA?",
    questionTextIgbo: "Kedu base na-ejikọta na adenine (A) na DNA?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "thymine",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "guanine",
          feedback: "Guanine pairs with cytosine, not adenine.",
        },
      ],
      defaultFeedback: "Adenine pairs with thymine in DNA.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-g-4",
    type: QuestionType.MCQ,
    questionText: "An organism with genotype Aa is described as:",
    questionTextIgbo: "Organism nwere genotype Aa bụ:",
    options: ["Homozygous", "Heterozygous", "Dominant", "Recessive"],
    optionsIgbo: ["Homozygous", "Heterozygous", "Dominant", "Recessive"],
    correctAnswer: "Heterozygous",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Homozygous",
          feedback: "Homozygous means identical alleles (AA or aa).",
        },
      ],
      defaultFeedback: "Heterozygous means two different alleles.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-g-5",
    type: QuestionType.MCQ,
    questionText: "What is the phenotype ratio of a Tt × Tt cross?",
    questionTextIgbo: "Gịnị bụ ratio phenotype nke Tt × Tt?",
    options: ["1:1", "3:1", "1:2:1", "All same"],
    optionsIgbo: ["1:1", "3:1", "1:2:1", "Ha niile"],
    correctAnswer: "3:1",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "1:2:1",
          feedback: "That is genotype ratio, not phenotype.",
        },
      ],
      defaultFeedback: "Phenotype ratio is 3 dominant : 1 recessive.",
    },
    difficulty: 0.6,
  },

  {
    id: "q-g-6",
    type: QuestionType.TRUE_FALSE,
    questionText: "Females have XX chromosomes.",
    questionTextIgbo: "Ụmụ nwanyị nwere chromosome XX?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "XY is male, not female.",
        },
      ],
      defaultFeedback: "Females are XX, males are XY.",
    },
    difficulty: 0.3,
  },

  {
    id: "q-g-7",
    type: QuestionType.MCQ,
    questionText: "Which disorder is caused by a recessive allele?",
    questionTextIgbo: "Kedu ọrịa sitere na allele adịghị ike?",
    options: [
      "Huntington’s disease",
      "Cystic fibrosis",
      "Down syndrome",
      "Albinism (choose one)",
    ],
    optionsIgbo: ["Huntington", "Cystic fibrosis", "Down syndrome", "Albinism"],
    correctAnswer: "Cystic fibrosis",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Huntington",
          feedback: "Huntington’s is dominant.",
        },
      ],
      defaultFeedback: "Cystic fibrosis is recessive.",
    },
    difficulty: 0.6,
  },

  {
    id: "q-g-8",
    type: QuestionType.MCQ,
    questionText: "What is a mutation?",
    questionTextIgbo: "Gịnị bụ mutation?",
    options: [
      "Gene copying",
      "Change in DNA sequence",
      "Cell division",
      "Protein formation",
    ],
    optionsIgbo: [
      "Mbipụta gene",
      "Mgbanwe DNA",
      "Nkewa cell",
      "Mmeputa protein",
    ],
    correctAnswer: "Change in DNA sequence",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Cell division",
          feedback: "Mutation is not cell division.",
        },
      ],
      defaultFeedback: "Mutation is a change in DNA sequence.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-g-9",
    type: QuestionType.TRUE_FALSE,
    questionText: "Blood group AB shows codominance.",
    questionTextIgbo: "Blood group AB na-egosi codominance?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Both alleles are expressed equally in AB.",
        },
      ],
      defaultFeedback: "AB expresses both A and B alleles.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-g-10",
    type: QuestionType.SHORT_ANSWER,
    questionText: "How many pairs of chromosomes do humans have?",
    questionTextIgbo: "Mmadu nwere pairs chromosome ole?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "23",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "46",
          feedback: "46 is total, but question asks for pairs.",
        },
      ],
      defaultFeedback: "Humans have 23 pairs.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-g-11",
    type: QuestionType.MCQ,
    questionText: "Genotype refers to:",
    questionTextIgbo: "Genotype pụtara:",
    options: [
      "Physical appearance",
      "Genetic makeup",
      "Protein structure",
      "DNA shape",
    ],
    optionsIgbo: ["Ihe a na-ahụ", "Nhazi gene", "Protein", "Udi DNA"],
    correctAnswer: "Genetic makeup",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Physical appearance",
          feedback: "That is phenotype.",
        },
      ],
      defaultFeedback: "Genotype is the allele combination.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-g-12",
    type: QuestionType.MCQ,
    questionText: "Down syndrome is caused by:",
    questionTextIgbo: "Down syndrome sitere na:",
    options: [
      "Missing chromosome",
      "Extra chromosome 21",
      "Mutation only",
      "Protein defect",
    ],
    optionsIgbo: [
      "Chromosome efu",
      "Chromosome 21 ọzọ",
      "Mutation naanị",
      "Nsogbu protein",
    ],
    correctAnswer: "Extra chromosome 21",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Missing chromosome",
          feedback: "It is an extra, not missing.",
        },
      ],
      defaultFeedback: "Down syndrome is trisomy 21.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-g-13",
    type: QuestionType.TRUE_FALSE,
    questionText: "DNA is located in the nucleus.",
    questionTextIgbo: "DNA dị n'ime nucleus?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "In eukaryotes, DNA is in nucleus.",
        },
      ],
      defaultFeedback: "DNA is stored in the nucleus.",
    },
    difficulty: 0.3,
  },

  {
    id: "q-g-14",
    type: QuestionType.SHORT_ANSWER,
    questionText: "List the four DNA bases.",
    questionTextIgbo: "Kpọọ bases anọ nke DNA.",
    options: null,
    optionsIgbo: null,
    correctAnswer: "A, T, C, G",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "A, U, C, G",
          feedback: "U is RNA, not DNA.",
        },
      ],
      defaultFeedback: "DNA bases are A, T, C, G.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-g-15",
    type: QuestionType.MCQ,
    questionText: "Phenotype refers to:",
    questionTextIgbo: "Phenotype pụtara:",
    options: [
      "DNA sequence",
      "Observable traits",
      "Alleles only",
      "Proteins only",
    ],
    optionsIgbo: ["DNA", "Ihe a na-ahụ", "Alleles naanị", "Protein naanị"],
    correctAnswer: "Observable traits",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "DNA sequence",
          feedback: "That is genotype.",
        },
      ],
      defaultFeedback: "Phenotype is observable characteristics.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-g-16",
    type: QuestionType.TRUE_FALSE,
    questionText: "Huntington’s disease is dominant.",
    questionTextIgbo: "Huntington bụ dominant?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Only one copy is needed for Huntington’s.",
        },
      ],
      defaultFeedback: "Huntington’s is dominant.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-g-17",
    type: QuestionType.MCQ,
    questionText: "What is the structure of DNA?",
    questionTextIgbo: "Kedu udi DNA?",
    options: ["Single helix", "Double helix", "Triple helix", "Linear"],
    optionsIgbo: ["Single helix", "Double helix", "Triple helix", "Linear"],
    correctAnswer: "Double helix",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Single helix",
          feedback: "DNA has two strands, not one.",
        },
      ],
      defaultFeedback: "DNA is a double helix.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-g-18",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What is the chart used to predict inheritance called?",
    questionTextIgbo: "Gịnị ka a na-akpọ chart iji chọpụta inheritance?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "Punnett square",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "family tree",
          feedback: "That tracks generations, not predictions.",
        },
      ],
      defaultFeedback: "Punnett square predicts genetic outcomes.",
    },
    difficulty: 0.5,
  },

  {
    id: "q-g-19",
    type: QuestionType.MCQ,
    questionText: "A carrier has which genotype?",
    questionTextIgbo: "Carrier nwere genotype kedu?",
    options: ["AA", "Aa", "aa", "None"],
    optionsIgbo: ["AA", "Aa", "aa", "None"],
    correctAnswer: "Aa",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "aa",
          feedback: "That shows disease, not carrier.",
        },
      ],
      defaultFeedback: "Carrier is heterozygous (Aa).",
    },
    difficulty: 0.5,
  },

  {
    id: "q-g-20",
    type: QuestionType.TRUE_FALSE,
    questionText: "Mutations can be caused by radiation.",
    questionTextIgbo: "Radiation nwere ike ibute mutation?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Radiation damages DNA.",
        },
      ],
      defaultFeedback: "Radiation can cause mutations.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-g-21",
    type: QuestionType.MCQ,
    questionText: "Which blood group is universal donor?",
    questionTextIgbo: "Kedu blood group bụ universal donor?",
    options: ["A", "B", "AB", "O"],
    optionsIgbo: ["A", "B", "AB", "O"],
    correctAnswer: "O",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "AB",
          feedback: "AB is universal recipient.",
        },
      ],
      defaultFeedback: "O is universal donor.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-g-22",
    type: QuestionType.TRUE_FALSE,
    questionText: "All body cells contain identical DNA.",
    questionTextIgbo: "Cells niile nwere otu DNA?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback: "Cells differ in expression, not DNA.",
        },
      ],
      defaultFeedback: "All cells share the same DNA.",
    },
    difficulty: 0.4,
  },

  {
    id: "q-g-23",
    type: QuestionType.MCQ,
    questionText:
      "What is the probability of getting a recessive phenotype from Aa × Aa?",
    questionTextIgbo: "Probability nke phenotype recessive site na Aa × Aa?",
    options: ["25%", "50%", "75%", "100%"],
    optionsIgbo: ["25%", "50%", "75%", "100%"],
    correctAnswer: "25%",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "50%",
          feedback: "You confused genotype vs phenotype.",
        },
      ],
      defaultFeedback: "1 out of 4 = 25%.",
    },
    difficulty: 0.7,
  },

  {
    id: "q-g-24",
    type: QuestionType.MCQ,
    questionText: "Which process produces gametes?",
    questionTextIgbo: "Kedu usoro na-emepụta gametes?",
    options: ["Mitosis", "Meiosis", "Diffusion", "Fertilisation"],
    optionsIgbo: ["Mitosis", "Meiosis", "Diffusion", "Fertilisation"],
    correctAnswer: "Meiosis",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Mitosis",
          feedback: "Mitosis produces identical cells, not gametes.",
        },
      ],
      defaultFeedback: "Meiosis produces gametes.",
    },
    difficulty: 0.5,
  },
];

// ═══════════════════════════════════════════════════════════════════
// NEW TOPICS 9–14 - registered in main() via seedTopic helper
// ═══════════════════════════════════════════════════════════════════
// NOTE: Add these calls inside main() - but since main() is already
// written above, we append them as a separate boot block executed
// via the module-level IIFE trick below. Instead, we patch main by
// re-exporting data only, and the seedTopic calls are already wired
// via the array extension at the bottom of this file.

// Extra topics seeded in a secondary runner called from main()
// (We need to patch the top of the file to call seedExtraTopics)
// Instead we export them inline and rely on the fact that seedTopic
// is a module-level helper - we just add an IIFE at the end.

async function seedExtraTopics() {
  await seedTopic({
    id: "topic-forces-motion",
    title: "Forces and Motion",
    titleIgbo: "Ike na Mmegharị",
    description:
      "Explore how forces cause objects to accelerate, decelerate, and change direction using Newton's Laws.",
    descriptionIgbo:
      "Mụta otú ike si eme ka ihe gbaa ọsọ, kwụsị, ma ọ bụ gbanwee ntụziaka dịka iwu Newton si dị.",
    duration: "30 mins",
    order: 9,
    lessonId: "lesson-forces-1",
    lessonContent: LESSON_FORCES,
    igboContent: LESSON_FORCES_IGBO,
    keyTerms: KT_FORCES,
    questions: Q_FORCES,
  });

  await seedTopic({
    id: "topic-atom",
    title: "The Atom",
    titleIgbo: "Atom",
    description:
      "Understand the structure of the atom, subatomic particles, and how the periodic table is organised.",
    descriptionIgbo:
      "Ghọta nhazi atom, ihe mejupụtara ya, na otu tebụl periodic si arụ ọrụ.",
    duration: "25 mins",
    order: 10,
    lessonId: "lesson-atom-1",
    lessonContent: LESSON_ATOM,
    igboContent: LESSON_ATOM_IGBO,
    keyTerms: KT_ATOM,
    questions: Q_ATOM,
  });

  await seedTopic({
    id: "topic-circulatory-system",
    title: "Human Circulatory System",
    titleIgbo: "Usoro Ọbara N’Ahụ Mmadụ",
    description:
      "Trace the path of blood through the heart and body, and learn how oxygen and nutrients are delivered to cells.",
    descriptionIgbo:
      "Soro ụzọ ọbara si aga n’ahụ mmadụ ma mụta otu oxygen na nri si erute sel.",
    duration: "25 mins",
    order: 11,
    lessonId: "lesson-circ-1",
    lessonContent: LESSON_CIRCULATION,
    igboContent: LESSON_CIRCULATION_IGBO,
    keyTerms: KT_CIRCULATION,
    questions: Q_CIRCULATION,
  });

  await seedTopic({
    id: "topic-plant-biology",
    title: "Plant Biology",
    titleIgbo: "Sayensị Osisi",
    description:
      "Study plant organs, transport systems, hormones, and how plants respond to their environment.",
    descriptionIgbo:
      "Mụta akụkụ osisi, ụzọ ha si ebufe ihe, na otu ha si aza gburugburu ebe ha nọ.",
    duration: "25 mins",
    order: 12,
    lessonId: "lesson-plant-1",
    lessonContent: LESSON_PLANTS,
    igboContent: LESSON_PLANTS_IGBO,
    keyTerms: KT_PLANTS,
    questions: Q_PLANTS,
  });

  await seedTopic({
    id: "topic-chemical-reactions",
    title: "Chemical Reactions",
    titleIgbo: "Mmeghachi Kemikal",
    description:
      "Understand what happens during chemical reactions, reaction types, rates, and energy changes.",
    descriptionIgbo:
      "Ghọta ihe na-eme mgbe kemikal na-emeghachi, ụdị mmeghachi na ọsọ ha.",
    duration: "30 mins",
    order: 13,
    lessonId: "lesson-chem-1",
    lessonContent: LESSON_CHEMISTRY,
    igboContent: LESSON_CHEMISTRY_IGBO,
    keyTerms: KT_CHEMISTRY,
    questions: Q_CHEMISTRY,
  });

  await seedTopic({
    id: "topic-nervous-system",
    title: "Human Nervous System",
    titleIgbo: "Usoro Akwara Ụbụrụ",
    description:
      "Learn how the brain, spinal cord, and nerves coordinate rapid responses to stimuli.",
    descriptionIgbo:
      "Mụta otu ụbụrụ, akwara azụ, na akwara si arụkọ ọrụ iji zaghachi ngwa ngwa.",
    duration: "25 mins",
    order: 14,
    lessonId: "lesson-nerve-1",
    lessonContent: LESSON_NERVOUS,
    igboContent: LESSON_NERVOUS_IGBO,
    keyTerms: KT_NERVOUS,
    questions: Q_NERVOUS,
  });

  await seedTopic({
    id: "topic-nervous-system",
    title: "Human Nervous System",
    titleIgbo: "Usoro Akwara Ụbụrụ",
    description:
      "Learn how the brain, spinal cord, and nerves coordinate rapid responses to stimuli.",
    descriptionIgbo:
      "Mụta otu ụbụrụ, akwara azụ, na akwara si arụkọ ọrụ iji zaghachi ngwa ngwa na ihe na-akpali.",
    duration: "25 mins",
    order: 15,
    lessonId: "lesson-nerve-1",
    lessonContent: LESSON_NERVOUS,
    igboContent: LESSON_NERVOUS_IGBO,
    keyTerms: KT_NERVOUS,
    questions: Q_NERVOUS,
  });
}

// ═══════════════════════════════════════════════════════════════════
// LESSON CONTENT - TOPICS 9–14
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
// FORCES AND MOTION
// ═══════════════════════════════════════════════════════════════════

const LESSON_FORCES = `## Forces and Motion

A **force** is a push or pull that can change an object's speed, direction, or shape. Forces are measured in **newtons (N)**.

### Types of Forces

- **Gravity** - pulls objects toward Earth; weight = mass × g (g ≈ 10 N/kg)
- **Normal force** - surface pushing back perpendicular to contact
- **Friction** - opposes motion between surfaces
- **Air resistance (drag)** - opposes motion through air
- **Tension** - force through a stretched rope or wire
- **Upthrust (buoyancy)** - upward force from a fluid on a submerged object

### Newton's Three Laws of Motion

**1st Law (Inertia)** - An object remains at rest or moves at constant velocity unless acted on by an unbalanced force.

**2nd Law** - F = ma (Force = mass × acceleration). The acceleration of an object is directly proportional to the net force and inversely proportional to its mass.

**3rd Law** - For every action, there is an equal and opposite reaction.

### Speed, Velocity, and Acceleration

- **Speed** = distance ÷ time (scalar - magnitude only)
- **Velocity** = displacement ÷ time (vector - magnitude + direction)
- **Acceleration** = change in velocity ÷ time = (v − u) ÷ t

### Distance–Time and Velocity–Time Graphs

| Graph | Flat line | Sloped line | Curved line |
|---|---|---|---|
| Distance–Time | Stationary | Constant speed | Changing speed |
| Velocity–Time | Constant velocity | Constant acceleration | Changing acceleration |

Area under a velocity–time graph = distance travelled.

### Momentum

> p = m × v (momentum = mass × velocity)

**Conservation of Momentum**: In a closed system, total momentum before a collision = total momentum after.

### Work, Energy, and Power

- **Work done** = Force × distance in direction of force (W = Fd)
- **Kinetic energy** = ½mv²
- **Gravitational potential energy** = mgh
- **Power** = work done ÷ time = W/t (watts, W)`;

const LESSON_FORCES_IGBO = `## Ike na Ntugharị (Forces and Motion)

**Ike (Force)** bụ nkwaba ma ọ bụ ndọpụ nke nwere ike ịgbanwe ọsọ, ihu, ma ọ bụ ọdịdị nke ihe. A na-atụ ike na **newtons (N)**.

### Ụdị Ike Dị Iche Iche

- **Ike ndọda (Gravity)** - na-adọta ihe n'ala; weight = mass × g (g ≈ 10 N/kg)
- **Normal force** - elu ihe na-akwaba azụ n'ụzọ perpendicular
- **Esemokwu (Friction)** - na-emegide ntugharị n'etiti elu ihe abụọ
- **Air resistance (drag)** - na-emegide ntugharị n'ime ikuku
- **Tension** - ike na-aga n'ime eriri agbatịrị agbatị
- **Upthrust (buoyancy)** - ike na-akwaba ihe elu n'ime mmiri ma ọ bụ ikuku

### Iwu Atọ nke Newton banyere Ntugharị

**Iwu mbụ (Inertia)** - Ihe na-anọ n'otu ebe ma ọ bụ na-agagharị n'otu ọsọ belụsọ ma ọ bụrụ na ike ọzọ abịa gbanwee ya.

**Iwu abụọ** - F = ma (Ike = mass × acceleration). Ọsọ ihe na-agba na-adabere n'ike e tinyere na ya na ibu (mass) ya.

**Iwu atọ** - Maka omume ọ bụla, e nwere mmeghachi omume hà nhata nke chere ihu n'akụkụ nke ọzọ.

### Speed, Velocity, na Acceleration

- **Speed** = anya (distance) ÷ oge (time) (na-egosi naanị ọsọ)
- **Velocity** = displacement ÷ oge (na-egosi ọsọ na ihu ọ na-aga)
- **Acceleration** = mgbanwe na velocity ÷ oge = (v − u) ÷ t

### Graphs nke Anya na Oge (Distance–Time na Velocity–Time)

| Graph | Ahịrị kwụ ọtọ | Ahịrị gbadara agbada | Ahịrị gbagọrọ agbagọ |
|---|---|---|---|
| Distance–Time | Ihe guzo otu ebe | Ọsọ na-adịghị agbanwe | Ọsọ na-agbanwe agbanwe |
| Velocity–Time | Velocity na-adịghị agbanwe | Acceleration na-adịghị agbanwe | Acceleration na-agbanwe agbanwe |

Ohere (area) dị n'okpuru velocity–time graph = anya a gara (distance travelled).

### Momentum

> p = m × v (momentum = mass × velocity)

**Nchekwa Momentum (Conservation of Momentum)**: N'ime usoro mechiri emechi, ngụkọta momentum tupu ihe abụọ akụkọrọ = ngụkọta momentum mgbe ha kụkọrọ.

### Work, Energy, na Power

- **Work done** = Ike × anya n'ihu ike ahụ (W = Fd)
- **Kinetic energy** = ½mv²
- **Gravitational potential energy** = mgh
- **Power** = work done ÷ oge = W/t (watts, W)`;

// ═══════════════════════════════════════════════════════════════════
// THE ATOM
// ═══════════════════════════════════════════════════════════════════

const LESSON_ATOM = `## The Atom

All matter is made of **atoms** - the smallest unit of an element that retains its chemical properties.

### Subatomic Particles

| Particle | Location | Charge | Relative Mass |
|---|---|---|---|
| Proton | Nucleus | +1 | 1 |
| Neutron | Nucleus | 0 | 1 |
| Electron | Shells (orbitals) | −1 | ~1/1836 |

The nucleus is tiny and dense. Most of the atom is empty space occupied by electron shells.

### Atomic Number and Mass Number

- **Atomic number (Z)** = number of protons (defines the element)
- **Mass number (A)** = protons + neutrons
- Neutral atoms: number of protons = number of electrons

### Isotopes

Isotopes are atoms of the same element with different numbers of neutrons (same atomic number, different mass number). E.g. Carbon-12 and Carbon-14.

### Electron Shells

Electrons occupy shells at specific energy levels:
- Shell 1: max 2 electrons
- Shell 2: max 8 electrons
- Shell 3: max 8 electrons (in simple model)

The electronic configuration of sodium (Na, Z=11): 2, 8, 1.

### The Periodic Table

Elements are arranged in order of **atomic number**. The table is organised into:
- **Periods** (rows) - elements in the same period have the same number of electron shells
- **Groups** (columns) - elements in the same group have the same number of outer electrons and similar chemical properties

### Ions

Atoms gain or lose electrons to form **ions**:
- Metal atoms lose electrons → positive ions (cations), e.g. Na⁺, Ca²⁺
- Non-metal atoms gain electrons → negative ions (anions), e.g. Cl⁻, O²⁻

### Radioactivity

Some nuclei are unstable and decay by emitting radiation:
- **Alpha (α)** - helium nucleus (2p + 2n); stopped by paper; ionising
- **Beta (β)** - fast electron; stopped by aluminium; moderately ionising
- **Gamma (γ)** - electromagnetic radiation; stopped by lead/thick concrete; weakly ionising`;

const LESSON_ATOM_IGBO = `## Atom

Ihe niile dị n'ụwa bụ **atoms** mejupụtara ha - nke bụ irighiri ihe kachasị obere nke element nke nwere njirimara kemịkal ya.

### Irighiri Ihe Dị N'ime Atom (Subatomic Particles)

| Irighiri Ihe | Ebe Ọ Nọ | Ebubo (Charge) | Ibu (Relative Mass) |
|---|---|---|---|
| Proton | Nucleus | +1 | 1 |
| Neutron | Nucleus | 0 | 1 |
| Electron | Shells (orbitals) | −1 | ~1/1836 |

Nucleus ahụ dị obere ma sie ike. Ihe ka ukwuu n'ime atom bụ oghere efu ebe electron shells nọ.

### Nọmba Atom na Nọmba Mass

- **Nọmba Atom (Z)** = ọnụ ọgụgụ protons (ọ na-akọwa ụdị element ọ bụ)
- **Nọmba Mass (A)** = protons + neutrons
- Atoms na-anaghị ebu ebubo: ọnụ ọgụgụ protons = ọnụ ọgụgụ electrons

### Isotopes

Isotopes bụ atoms nke otu element nwere ọnụ ọgụgụ neutrons dị iche (otu nọmba atom, mana nọmba mass dị iche). Ọmụmaatụ: Carbon-12 na Carbon-14.

### Electron Shells

Electrons na-anọ n'ime shells n'ogo ike dị iche iche:
- Shell 1: kacha electrons 2
- Shell 2: kacha electrons 8
- Shell 3: kacha electrons 8 (n'ụdị dị mfe)

Nhazi electrons nke sodium (Na, Z=11): 2, 8, 1.

### Tebụl Periodic (The Periodic Table)

A haziri elements dịka **nọmba atom** ha siri dị. Tebụl a nwere:
- **Periods** (ahịrị kwụ ọtọ) - elements nọ n'otu period nwere otu ọnụ ọgụgụ electron shells
- **Groups** (ahịrị kwụ n'ahịrị) - elements nọ n'otu group nwere otu ọnụ ọgụgụ electrons n'elu ma nwee njirimara kemịkal yiri onwe ha

### Ions

Atoms na-enweta ma ọ bụ na-atụfu electrons iji ghọọ **ions**:
- Metal atoms na-atụfu electrons → positive ions (cations), dịka Na⁺, Ca²⁺
- Non-metal atoms na-enweta electrons → negative ions (anions), dịka Cl⁻, O²⁻

### Radioactivity

Ụfọdụ nuclei anaghị akwụsi ike ma na-emebi site n'iwepụta radiation:
- **Alpha (α)** - helium nucleus (2p + 2n); akwụkwọ nwere ike igbochi ya
- **Beta (β)** - electron na-agba ọsọ; aluminium nwere ike igbochi ya
- **Gamma (γ)** - ebili mmiri electromagnetic; lead ma ọ bụ concrete siri ike na-egbochi ya`;

// ═══════════════════════════════════════════════════════════════════
// HUMAN CIRCULATORY SYSTEM
// ═══════════════════════════════════════════════════════════════════

const LESSON_CIRCULATION = `## The Human Circulatory System

The circulatory system delivers oxygen and nutrients to cells and removes waste products like CO₂.

### The Heart

The heart is a **double pump** made of cardiac muscle:
- **Right side** - pumps deoxygenated blood to the lungs (pulmonary circuit)
- **Left side** - pumps oxygenated blood to the body (systemic circuit)

**Chambers:** Right atrium → Right ventricle → Lungs → Left atrium → Left ventricle → Body

**Valves:** Prevent backflow of blood - tricuspid (right), bicuspid/mitral (left), pulmonary, aortic.

### Blood Vessels

| Vessel | Direction | Wall | Pressure |
|---|---|---|---|
| Artery | Away from heart | Thick, muscular | High |
| Vein | Toward heart | Thin, valves | Low |
| Capillary | Exchange | One cell thick | Very low |

### Double Circulation

1. **Pulmonary circuit** - heart → lungs → heart (blood picks up O₂, loses CO₂)
2. **Systemic circuit** - heart → body → heart (delivers O₂, picks up CO₂)

### Blood Components

- **Red blood cells** - carry oxygen bound to haemoglobin; no nucleus; biconcave
- **White blood cells** - immune defence (phagocytes engulf pathogens; lymphocytes produce antibodies)
- **Platelets** - clotting after injury
- **Plasma** - liquid carrying dissolved nutrients, hormones, CO₂, urea

### The Cardiac Cycle

1. **Diastole** - heart relaxes; chambers fill with blood
2. **Systole** - ventricles contract; blood pumped to lungs and body

Heart rate is controlled by the **sinoatrial (SA) node** - the heart's natural pacemaker.

### Coronary Heart Disease

Caused by fatty deposits (plaques) narrowing coronary arteries. Risk factors: high blood pressure, high cholesterol, smoking, obesity, diabetes.`;

const LESSON_CIRCULATION_IGBO = `## Usoro Mgbasa Ọbara (Human Circulatory System)

Usoro mgbasa ọbara na-ebuga oxygen na nri n'ime mkpụrụ ndụ ma na-ewepụ ihe mkpofu dịka CO₂.

### Obi (The Heart)

Obi bụ **pọmpụ abụọ** ejiri akwara cardiac mee:
- **Akụkụ aka nri** - na-apụnye ọbara na-enweghị oxygen n'akpa ume (pulmonary circuit)
- **Akụkụ aka ekpe** - na-apụnye ọbara nwere oxygen n'ahụ niile (systemic circuit)

**Ụlọ Obi (Chambers):** Right atrium → Right ventricle → Akpa ume → Left atrium → Left ventricle → Ahụ

**Valves:** Na-egbochi ọbara ịlaghachi azụ - tricuspid (nri), bicuspid/mitral (ekpe), pulmonary, aortic.

### Akwara Ọbara (Blood Vessels)

| Akwara | Ihu Ọ Na-aga | Mgbidi Ya | Ike Ọsọ (Pressure) |
|---|---|---|---|
| Artery | Na-esi n'obi pụọ | Siri ike, nwee akwara | Dị elu |
| Vein | Na-aga n'obi | Dị mfe, nwee valves | Dị ala |
| Capillary | Maka mgbanwe ihe | Dị mfe nke ukwuu | Dị ala nke ukwuu |

### Mgbasa Ọbara Abụọ (Double Circulation)

1. **Pulmonary circuit** - obi → akpa ume → obi (ọbara na-enweta O₂, tufuo CO₂)
2. **Systemic circuit** - obi → ahụ → obi (na-ebuga O₂, na-enweta CO₂)

### Ihe Mejupụtara Ọbara

- **Mkpụrụ ndụ ọbara uhie** - na-ebu oxygen; enweghị nucleus; nwee ọdịdị biconcave
- **Mkpụrụ ndụ ọbara ọcha** - na-echebe ahụ megide ọrịa
- **Platelets** - na-eme ka ọbara kụọ ma mmadụ merụọ ahụ
- **Plasma** - mmiri na-ebu nri gbazere agbaze, hormones, CO₂, na urea

### Okirikiri Obi (The Cardiac Cycle)

1. **Diastole** - obi na-ezu ike; ụlọ obi na-ejupụta n'ọbara
2. **Systole** - ventricles na-agbakọ; a na-apụnye ọbara n'akpa ume na n'ahụ

Ọsọ obi na-akụ bụ **sinoatrial (SA) node** na-achịkwa ya - ihe na-enye obi ọkụ n'onwe ya.

### Ọrịa Obi Coronary

Ihe na-ebute ya bụ abụba na-emechi akwara obi. Ihe ndị na-ebute ya: ọbara mgbali elu, cholesterol dị elu, ise siga, ibu oke, na ọrịa shuga.`;

// ═══════════════════════════════════════════════════════════════════
// PLANT BIOLOGY
// ═══════════════════════════════════════════════════════════════════

const LESSON_PLANTS = `## Plant Biology

Plants are multicellular photosynthetic organisms adapted to life on land.

### Plant Organs

- **Roots** - anchor the plant; absorb water and minerals; store food
- **Stem** - supports the plant; transports water and nutrients
- **Leaves** - main site of photosynthesis; gas exchange via stomata
- **Flowers** - reproduction (pollination and fertilisation)

### Transport in Plants

**Xylem** - carries water and dissolved minerals from roots to leaves. Movement driven by transpiration (water evaporating from leaves). Dead cells form hollow tubes; one-way flow upward.

**Phloem** - carries dissolved sugars (from photosynthesis) from leaves to all parts of the plant. Living cells; bidirectional flow (translocation).

### Transpiration

Water evaporates from leaves through stomata. This creates a transpiration pull that draws water up the xylem.

Factors increasing transpiration rate:
- Higher light intensity (stomata open wider)
- Higher temperature
- Lower humidity
- Higher wind speed

### Plant Hormones

**Auxin (IAA)** - produced at shoot tips; promotes cell elongation on the shaded side of a shoot, causing the shoot to bend toward light (**phototropism**). In roots, high auxin concentrations inhibit growth.

**Gibberellins** - promote stem elongation and seed germination.

**Ethylene (ethene)** - promotes fruit ripening.

### Plant Responses

- **Phototropism** - growth toward light (positive phototropism in shoots)
- **Gravitropism (geotropism)** - shoots grow against gravity; roots grow with gravity
- **Thigmotropism** - growth response to touch (e.g. climbing plants)

### Sexual Reproduction in Plants

**Pollination** - transfer of pollen (containing male gametes) to the stigma. Can be wind- or insect-pollinated.

**Fertilisation** - pollen tube grows down the style; male nucleus fuses with ovule → seed.

The ovary develops into a **fruit** surrounding the seed.`;

const LESSON_PLANTS_IGBO = `## Sayensị Osisi (Plant Biology)

Osisi bụ ihe dị ndụ nwere ọtụtụ mkpụrụ ndụ na-emepụta nri site n'anyanwụ ma nwee ike ibi n'elu ala.

### Akụkụ Osisi

- **Mgbọrọgwụ** - na-ejigide osisi n'ala; na-amịkọ mmiri na mineral; na-echekwa nri
- **Opa (Stem)** - na-akwado osisi; na-ebugharị mmiri na nri
- **Akwụkwọ** - isi ebe photosynthesis na-eme; mgbanwe ikuku na-eme na stomata
- **Okooko osisi** - maka mmeputakwa (pollination na fertilisation)

### Njem n'ime Osisi (Transport in Plants)

**Xylem** - na-ebu mmiri na mineral site na mgbọrọgwụ gaa n'akwụkwọ. Mmiri na-esi n'akwụkwọ apụ na-eme ka ọ na-arị elu. Ọ na-aga naanị n'elu.

**Phloem** - na-ebu shuga gbazere agbaze (sitere na photosynthesis) site n'akwụkwọ gaa n'akụkụ niile nke osisi. Ọ na-aga n'elu na n'ala.

### Mwepụta Mmiri (Transpiration)

Mmiri na-esi n'akwụkwọ pụọ n'ụdị ikuku site na stomata. Nke a na-adọta mmiri elu site na xylem.

Ihe na-eme ka mmiri pụọ ngwa ngwa:
- Ìhè anyanwụ ka ukwuu
- Okpomọkụ ka elu
- Mmiri dị n'ikuku (humidity) dị ala
- Ikuku na-efe n'ọsọ

### Hormones Osisi

**Auxin** - a na-emepụta ya n'ọnụ osisi; ọ na-eme ka akụkụ osisi gbagọọ n'akụkụ ìhè anyanwụ (**phototropism**).

**Gibberellins** - na-enyere osisi aka itolite ogologo ma na-enyere mkpụrụ aka ipu ome.

**Ethylene** - na-eme ka mkpụrụ osisi chaa ngwa ngwa.

### Mmeghachi Omume Osisi

- **Phototropism** - uto na-aga n'akụkụ ìhè
- **Gravitropism** - opa na-eto na-emegide ike ndọda; mgbọrọgwụ na-eto na-eso ike ndọda
- **Thigmotropism** - uto na-adabere na mmetụ (dịka osisi na-arị arị)

### Mmeputakwa na Osisi (Sexual Reproduction)

**Pollination** - ntụgharị pollen site n'aka nwoke gaa n'aka nwaanyị (stigma). Ikuku ma ọ bụ ụmụ ahụhụ nwere ike ime nke a.

**Fertilisation** - pollen na ovule na-ezukọ iji ghọọ mkpụrụ.

Ovary na-aghọ **mkpụrụ osisi (fruit)** nke gbara mkpụrụ ahụ gburugburu.`;

// ═══════════════════════════════════════════════════════════════════
// CHEMICAL REACTIONS
// ═══════════════════════════════════════════════════════════════════

const LESSON_CHEMISTRY = `## Chemical Reactions

A **chemical reaction** is a process in which substances (reactants) are transformed into new substances (products). Atoms are rearranged but not created or destroyed.

### Signs of a Chemical Reaction

- Colour change
- Gas produced (effervescence)
- Temperature change
- Precipitate forms
- Irreversible change (usually)

### Conservation of Mass

> Total mass of reactants = Total mass of products

Atoms are neither created nor destroyed in a reaction.

### Types of Chemical Reactions

**Synthesis (Combination):** A + B → AB (two substances combine)

**Decomposition:** AB → A + B (one substance breaks down)

**Combustion:** Fuel + O₂ → CO₂ + H₂O + energy (complete combustion)

**Neutralisation:** Acid + Base → Salt + Water

**Redox:** Involves transfer of electrons; oxidation = loss of electrons; reduction = gain of electrons (OIL RIG)

**Precipitation:** Two solutions react to form an insoluble solid (precipitate)

### Energy Changes

- **Exothermic** - releases energy to surroundings (temperature rises); e.g. combustion, neutralisation, respiration
- **Endothermic** - absorbs energy from surroundings (temperature falls); e.g. photosynthesis, thermal decomposition, dissolving ammonium nitrate

### Rates of Reaction

Factors that increase reaction rate:
1. **Higher temperature** - more particles with activation energy
2. **Higher concentration** - more particles per volume
3. **Larger surface area** - more collisions possible
4. **Catalyst** - provides alternative pathway with lower activation energy
5. **Light** (for photochemical reactions)

### Collision Theory

Reactions occur when particles collide with sufficient energy (activation energy) and correct orientation. Anything that increases the frequency or energy of successful collisions increases the rate.

### pH Scale and Acids/Bases

- **pH 0–6**: Acid (H⁺ ions)
- **pH 7**: Neutral
- **pH 8–14**: Alkali/Base (OH⁻ ions)
- **Universal indicator** changes colour across the pH range
- **Neutralisation**: Acid + Alkali → Salt + Water`;

const LESSON_CHEMISTRY_IGBO = `## Mmeghachi Omume Kemịkal (Chemical Reactions)

**Mmeghachi omume kemịkal** bụ usoro ihe (reactants) na-agbanwe ghọọ ihe ọhụrụ (products). A na-ahazi atoms ọzọ mana anaghị emepụta ma ọ bụ bibie ha.

### Ihe Ndị Na-egosi Mmeghachi Omume Kemịkal

- Mgbanwe agba
- Mwepụta ikuku (effervescence)
- Mgbanwe okpomọkụ
- Ihe siri ike na-apụta n'ime mmiri (precipitate)
- Mgbanwe a na-enweghị ike iweghachi azụ

### Nchekwa nke Mass (Conservation of Mass)

> Ngụkọta mass nke reactants = Ngụkọta mass nke products

Anaghị emepụta ma ọ bụ bibie atoms n'oge mmeghachi omume.

### Ụdị Mmeghachi Omume Kemịkal

**Synthesis (Njikọ):** A + B → AB (ihe abụọ ejikọọ)

**Decomposition (Ntikpọ):** AB → A + B (otu ihe atikpọọ)

**Combustion (Ọkụ):** Fuel + O₂ → CO₂ + H₂O + ike (ọkụ zuru ezu)

**Neutralisation:** Acid + Base → Nnu + Mmiri

**Redox:** Mgbanwe nke electrons; oxidation = ntụfu electrons; reduction = nnweta electrons

**Precipitation:** Ngwakọta abụọ na-emeghachi omume iji mepụta ihe siri ike na-adịghị agbazere agbazere

### Mgbanwe Ike (Energy Changes)

- **Exothermic** - na-ewepụta ike (okpomọkụ na-arị elu); dịka ọkụ, respiration
- **Endothermic** - na-amịkọrọ ike (okpomọkụ na-ada ala); dịka photosynthesis

### Ọsọ nke Mmeghachi Omume (Rates of Reaction)

Ihe na-eme ka ọ gbaa ọsọ:
1. **Okpomọkụ ka elu** - irighiri ihe na-enwekwu ike
2. **Ntinye uche (Concentration) ka elu** - irighiri ihe ka n'ụba n'otu ebe
3. **Mpaghara elu (Surface area) ka ukwuu** - ọtụtụ mmetụ na-eme
4. **Catalyst** - na-enyere mmeghachi omume aka iji obere ike mee
5. **Ìhè** (maka mmeghachi omume photochemical)

### Ozizi Mmetụ (Collision Theory)

Mmeghachi omume na-eme mgbe irighiri ihe metụrụ onwe ha n'ike zuru ezu (activation energy). Ihe ọ bụla na-eme ka mmetụ a na-eme mgbe niile na-eme ka ọsọ ya rịpụ elu.

### pH Scale na Acids/Bases

- **pH 0–6**: Acid (H⁺ ions)
- **pH 7**: Neutral (adịghị n'akụkụ ọ bụla)
- **pH 8–14**: Alkali/Base (OH⁻ ions)
- **Universal indicator** na-agbanwe agba na pH dị iche iche
- **Neutralisation**: Acid + Alkali → Nnu + Mmiri`;

// ═══════════════════════════════════════════════════════════════════
// HUMAN NERVOUS SYSTEM
// ═══════════════════════════════════════════════════════════════════

const LESSON_NERVOUS = `## The Human Nervous System

The nervous system allows the body to detect stimuli and coordinate rapid responses.

### Organisation

**Central Nervous System (CNS)** - brain + spinal cord; processes information

**Peripheral Nervous System (PNS)** - all other nerves; carries signals to/from the CNS

### Neurones (Nerve Cells)

Three types:
- **Sensory neurones** - carry impulses FROM receptors TO the CNS
- **Relay (interneurones)** - connect sensory and motor neurones within the CNS
- **Motor neurones** - carry impulses FROM the CNS TO effectors (muscles/glands)

Structure: Cell body, dendrites (receive signals), axon (transmit signals), myelin sheath (insulation, speeds up conduction), synaptic terminals.

### The Synapse

A **synapse** is the gap between two neurones. When an impulse reaches the end of one neurone:
1. Vesicles release **neurotransmitters** (e.g. acetylcholine) into the synaptic cleft
2. Neurotransmitters diffuse across and bind to receptors on the next neurone
3. If enough bind, a new impulse is triggered
4. Neurotransmitters are broken down or reabsorbed

### Reflex Arcs

A **reflex** is a rapid, automatic response that bypasses the conscious brain.

Pathway: **Stimulus → Receptor → Sensory neurone → Relay neurone (spinal cord) → Motor neurone → Effector → Response**

Examples: Knee-jerk reflex, withdrawing hand from heat, pupil dilation.

### The Brain

Major regions:
- **Cerebrum** - conscious thought, memory, learning, voluntary movement
- **Cerebellum** - coordination and balance
- **Medulla oblongata** - controls automatic functions (breathing, heart rate)
- **Hypothalamus** - regulates body temperature, hunger, thirst; links nervous and endocrine systems

### Receptors

| Receptor | Stimulus |
|---|---|
| Photoreceptors (rods, cones) | Light |
| Chemoreceptors | Chemicals (taste, smell) |
| Mechanoreceptors | Pressure, sound |
| Thermoreceptors | Temperature |
| Nociceptors | Pain |`;

const LESSON_NERVOUS_IGBO = `## Usoro Akwara Ozi (Human Nervous System)

Usoro akwara ozi na-enyere ahụ aka ịmata ihe na-eme gburugburu ma na-enye nzaghachi ngwa ngwa.

### Nhazi

**Central Nervous System (CNS)** - ụbụrụ + spinal cord; ọ na-ahazi ozi

**Peripheral Nervous System (PNS)** - akwara ndị ọzọ niile; na-ebu ozi na-aga ma na-esi na CNS

### Mkpụrụ Ndụ Akwara (Neurones)

Ụdị atọ dị:
- **Sensory neurones** - na-ebu ozi SITE NA receptors GAA NA CNS
- **Relay neurones** - na-ejikọ sensory na motor neurones n'ime CNS
- **Motor neurones** - na-ebu ozi SITE NA CNS GAA NA ahụ (akwara/glands)

Nhazi: Cell body, dendrites (na-anata ozi), axon (na-eziga ozi), myelin sheath (na-echebe ma na-eme ka ozi gbaa ọsọ).

### Synapse

**Synapse** bụ oghere dị n'etiti mkpụrụ ndụ akwara abụọ. Mgbe ozi ruru n'isi otu akwara:
1. A na-atọhapụ **neurotransmitters** (kemịkal ozi) n'ime oghere ahụ
2. Kemịkal ndị a na-aga n'akụkụ nke ọzọ wee rapala na receptors nke akwara ọzọ
3. Nke a na-amalite ozi ọhụrụ n'akwara nke abụọ ahụ

### Usoro Mmeghachi Omume Mberede (Reflex Arcs)

**Reflex** bụ nzaghachi ngwa ngwa na nke akpaka nke na-agaghị n'isi ụbụrụ tupu o mee.

Ụzọ ọ na-agbaso: **Ihe merenụ (Stimulus) → Onye natara ozi (Receptor) → Sensory neurone → Relay neurone (spinal cord) → Motor neurone → Ihe ga-eme ihe (Effector) → Nzaghachi**

Ọmụmaatụ: Iwepụ aka n'ọkụ ngwa ngwa, iku ume, ikpebi anya mgbe ìhè batara.

### Ụbụrụ (The Brain)

Akụkụ ndị dị mkpa:
- **Cerebrum (Isi Ụbụrụ)** - echiche, ncheta, mmụta, na ntugharị aka na ụkwụ
- **Cerebellum** - nhazi na itule ahụ (balance)
- **Medulla oblongata** - na-achịkwa ọrụ akpaka (iku ume, ọsọ obi)
- **Hypothalamus** - na-achịkwa okpomọkụ ahụ, agụụ, akpịrị ịkpọ nkụ

### Ndị Na-anata Ozi (Receptors)

| Onye Na-anata Ozi | Ihe Ọ Na-amata |
|---|---|
| Photoreceptors | Ìhè |
| Chemoreceptors | Kemịkal (ụtọ, isi) |
| Mechanoreceptors | Mmetụ, ụda |
| Thermoreceptors | Okpomọkụ |
| Nociceptors | Ihe mgbu |`;

// ═══════════════════════════════════════════════════════════════════
// KEY TERMS - TOPICS 9–14
// ═══════════════════════════════════════════════════════════════════

const KT_FORCES = [
  {
    id: "kt-f-1",
    englishTerm: "Force",
    igboTerm: "Ike Mgbachi",
    igboExplanation:
      "Ihe na-eme mgbanwe n'ọsọ, ụzọ, ma ọ bụ ọdịdị ihe - a na-eto ya n'ime newton",
  },
  {
    id: "kt-f-2",
    englishTerm: "Acceleration",
    igboTerm: "Ọsọ Ọsịsọ",
    igboExplanation: "Ọsọ nke ọsọ ihe si agbanwe; F = ma n'iwu Newton nke abụọ",
  },
  {
    id: "kt-f-3",
    englishTerm: "Friction",
    igboTerm: "Mgbochi Mmegharị",
    igboExplanation: "Ike na-emegide mmegharị ihe n'etiti elu abụọ",
  },
  {
    id: "kt-f-4",
    englishTerm: "Momentum",
    igboTerm: "Ike Gaa N'Ihu",
    igboExplanation:
      "Ọsọ na oke ihe jikọtara ọnụ; p = mv; a na-echekwa ya n'ọgbụgbọ",
  },
  {
    id: "kt-f-5",
    englishTerm: "Gravity",
    igboTerm: "Ike Dada Ala",
    igboExplanation:
      "Ike nke na-adọta ihe niile ruo n'ala; g ≈ 10 N/kg n'elu ụwa",
  },
  {
    id: "kt-f-6",
    englishTerm: "Inertia",
    igboTerm: "Ngọngọ Ihe Ịgbanwe",
    igboExplanation:
      "Agbụrụ nke ihe isi na-anọ n'otu ọnọdụ ya ruo mgbe ike agbanwe ya",
  },
  {
    id: "kt-f-7",
    englishTerm: "Newton's Second Law",
    igboTerm: "Iwu Newton Nke Abụọ",
    igboExplanation: "F = ma - ike dị n'ọnụ ahịa oke na ọsọ ọsịsọ ihe",
  },
  {
    id: "kt-f-8",
    englishTerm: "Velocity",
    igboTerm: "Ọsọ na Ụzọ",
    igboExplanation:
      "Ọsọ ihe na ụzọ ya - vector (nwere ọsọ na ụzọ); dị iche n'ọsọ naanị",
  },
];

const KT_ATOM = [
  {
    id: "kt-a-1",
    englishTerm: "Atom",
    igboTerm: "Mkpụrụ Ihe",
    igboExplanation:
      "Ihe kacha obere nke ngwá ihe - ihe niile n'ụwa mejupụtara ya",
  },
  {
    id: "kt-a-2",
    englishTerm: "Proton",
    igboTerm: "Ihe Ọpụrụiche Ume Ọha",
    igboExplanation:
      "Ihe obere nwere ume ọha dị mma (+1) dị n'ime isi nke atom",
  },
  {
    id: "kt-a-3",
    englishTerm: "Neutron",
    igboTerm: "Ihe Ọpụrụiche Enweghị Ume",
    igboExplanation:
      "Ihe obere enweghị ume dị n'isi atom; ọnụọgụ ya na-emepe isotopes",
  },
  {
    id: "kt-a-4",
    englishTerm: "Electron",
    igboTerm: "Ihe Ọpụrụiche Ume Ọjọọ",
    igboExplanation:
      "Ihe obere nwere ume ọjọọ (−1) na-agwa gburugburu isi atom n'ime ikpere",
  },
  {
    id: "kt-a-5",
    englishTerm: "Atomic Number",
    igboTerm: "Ọnụọgụ Proton",
    igboExplanation:
      "Ọnụọgụ protons dị n'ime isi atom - ọ na-akọwa ihe ngwá ya bụ",
  },
  {
    id: "kt-a-6",
    englishTerm: "Isotope",
    igboTerm: "Ụdị Atom Ọzọ",
    igboExplanation:
      "Atom nke otu ngwá ihe nwere neutron dị iche iche - ọnụọgụ proton ha dị otu",
  },
  {
    id: "kt-a-7",
    englishTerm: "Ion",
    igboTerm: "Atom Ọrịa Ume",
    igboExplanation:
      "Atom nke rachara ma ọ bụ natara electrons ka ọ nwee ume ọha ma ọ bụ ume ọjọọ",
  },
  {
    id: "kt-a-8",
    englishTerm: "Radioactivity",
    igboTerm: "Ihe Ọkụ Ọnụọgụ Isi",
    igboExplanation:
      "Isi nke atom ndị enweghị ike na-apụta ihe ọkụ (alpha, beta, gamma)",
  },
];

const KT_CIRCULATION = [
  {
    id: "kt-ci-1",
    englishTerm: "Heart",
    igboTerm: "Obi",
    igboExplanation:
      "Akụkụ ahụ nke na-akwọ ọbara gaa n'ahụ niile; nwere oghere anọ",
  },
  {
    id: "kt-ci-2",
    englishTerm: "Artery",
    igboTerm: "Akwara Ọbara Siri Ike",
    igboExplanation:
      "Tube ọbara na-ebu ọbara si n'obi gaa n'ahụ; ọbụna elu, oghere ya siri ike",
  },
  {
    id: "kt-ci-3",
    englishTerm: "Vein",
    igboTerm: "Akwara Ọbara Lọghachi",
    igboExplanation:
      "Tube ọbara na-ebu ọbara si n'ahụ lọghachi n'obi; nwere valves igbochi ọbara alaghachi",
  },
  {
    id: "kt-ci-4",
    englishTerm: "Capillary",
    igboTerm: "Akwara Ọbara Obere",
    igboExplanation:
      "Tube ọbara kacha obere - otu cell nke na-enye ohere exchange nri na ikuku",
  },
  {
    id: "kt-ci-5",
    englishTerm: "Haemoglobin",
    igboTerm: "Ihe Ọbara Na-Ebu Ikuku",
    igboExplanation:
      "Protein dị n'ime red blood cells nke na-ebu oxygen si n'afo gaa n'ahụ",
  },
  {
    id: "kt-ci-6",
    englishTerm: "Plasma",
    igboTerm: "Mmiri Ọbara",
    igboExplanation:
      "Mmiri ọcha dị n'ọbara nke na-ebu nri, hormone, CO₂ na urea",
  },
  {
    id: "kt-ci-7",
    englishTerm: "Atrium",
    igboTerm: "Oghere Elu Obi",
    igboExplanation:
      "Oghere abụọ dị elu n'obi nke na-anata ọbara; atrium nri na atrium aka ekpe",
  },
  {
    id: "kt-ci-8",
    englishTerm: "Ventricle",
    igboTerm: "Oghere Ala Obi",
    igboExplanation:
      "Oghere abụọ dị ala n'obi nke na-akwọ ọbara gaa n'ahụ na n'afo",
  },
];

const KT_PLANTS = [
  {
    id: "kt-pl-1",
    englishTerm: "Xylem",
    igboTerm: "Akwara Mmiri Osisi",
    igboExplanation:
      "Tube n'ime osisi nke na-ebu mmiri na nri si n'isi osisi elu gaa n'akwụkwọ",
  },
  {
    id: "kt-pl-2",
    englishTerm: "Phloem",
    igboTerm: "Akwara Shuga Osisi",
    igboExplanation:
      "Tube n'ime osisi nke na-ebu shuga (glucose) si n'akwụkwọ gaa n'ụzọ ọ bụla",
  },
  {
    id: "kt-pl-3",
    englishTerm: "Transpiration",
    igboTerm: "Ịpụsa Mmiri Osisi",
    igboExplanation:
      "Mmiri si n'akwụkwọ osisi pụọ site n'stomata - ọ na-adọta mmiri elu gaa n'osisi",
  },
  {
    id: "kt-pl-4",
    englishTerm: "Auxin",
    igboTerm: "Hormone Osisi Eto",
    igboExplanation:
      "Hormone osisi nke na-achị ọhụụ cell - ọ na-eme ka osisi tụgharịa n'ihu ìhè",
  },
  {
    id: "kt-pl-5",
    englishTerm: "Phototropism",
    igboTerm: "Ịgbago Osisi N'Ihu Ìhè",
    igboExplanation:
      "Ọhụụ nke osisi n'ụzọ ìhè - isi osisi na-atụgharị gaa n'ebe ìhè na-abịa",
  },
  {
    id: "kt-pl-6",
    englishTerm: "Pollination",
    igboTerm: "Ọnụnọ Nri Ọcha Osisi",
    igboExplanation:
      "Njem nri ọcha (pollen) si n'otu ọcha gaa n'ọcha ọzọ iji mee mkpụrụ",
  },
  {
    id: "kt-pl-7",
    englishTerm: "Root Hair Cell",
    igboTerm: "Mkpụrụ Ndụ Isi Osisi",
    igboExplanation:
      "Cell pụrụ iche dị n'isi osisi nke nwere elu ukwuu iji wọpụta mmiri na mineral",
  },
  {
    id: "kt-pl-8",
    englishTerm: "Stomata",
    igboTerm: "Ọnụ Ọgụgọ Akwụkwọ",
    igboExplanation:
      "Oghere obere n'akwụkwọ osisi ebe CO₂ na-abanye, oxygen na mmiri na-apụ",
  },
];

const KT_CHEMISTRY = [
  {
    id: "kt-ch-1",
    englishTerm: "Reactant",
    igboTerm: "Ihe Na-Abanye N'Ọrụ",
    igboExplanation:
      "Ihe ndị ọrụ kemistri na-abido ha - ha na-agbanwe ka ha ghọọ ihe ndị ọhụrụ",
  },
  {
    id: "kt-ch-2",
    englishTerm: "Product",
    igboTerm: "Ihe N'Esite N'Ọrụ",
    igboExplanation:
      "Ihe ọhụrụ nke a na-emepụta n'ọrụ kemistri mgbe ihe ndị na-abanye agbanwere",
  },
  {
    id: "kt-ch-3",
    englishTerm: "Exothermic",
    igboTerm: "Ọrụ Na-Ewepụta Ọkụ",
    igboExplanation:
      "Ọrụ kemistri nke na-ewepụta ike (ọkụ) n'ime ụwa - ọ na-eme ka ihe dị ọkụ",
  },
  {
    id: "kt-ch-4",
    englishTerm: "Endothermic",
    igboTerm: "Ọrụ Na-Amịkọ Ọkụ",
    igboExplanation:
      "Ọrụ kemistri nke na-amịkọ ike (ọkụ) si n'ụwa - ọ na-eme ka ihe dị ọzọzọ",
  },
  {
    id: "kt-ch-5",
    englishTerm: "Catalyst",
    igboTerm: "Ihe Enyemaka Ọrụ",
    igboExplanation:
      "Ihe na-eme ka ọrụ kemistri eme ngwa ngwa mana anaghị agbanwe onwe ya",
  },
  {
    id: "kt-ch-6",
    englishTerm: "Acid",
    igboTerm: "Ihe Mmiri Ọjọọ",
    igboExplanation:
      "Mmiri nke nwere ọtụtụ H⁺; ọ na-adaba n'ime pH 0–6 n'ọnụọgụ pH",
  },
  {
    id: "kt-ch-7",
    englishTerm: "Neutralisation",
    igboTerm: "Ịmezi Mmiri Ọjọọ",
    igboExplanation: "Ọrụ nke acid na base ṅụpụ ọnụ ka ha ghọọ mmiri na nnu",
  },
  {
    id: "kt-ch-8",
    englishTerm: "Activation Energy",
    igboTerm: "Ike Mmejupụta Ọrụ",
    igboExplanation:
      "Ike kacha nta dị mkpa iji malite ọrụ kemistri - catalyst na-ebelata ya",
  },
];

const KT_NERVOUS = [
  {
    id: "kt-n-1",
    englishTerm: "Neurone",
    igboTerm: "Mkpụrụ Ndụ Akwara",
    igboExplanation:
      "Mkpụrụ ndụ pụrụ iche nke na-ebugharị ozi (impulse) n'ọkụ eletrik n'ime ahụ",
  },
  {
    id: "kt-n-2",
    englishTerm: "Synapse",
    igboTerm: "Oghere Akwara",
    igboExplanation:
      "Oghere obere n'etiti akwara abụọ ebe chemical na-ebugharị ozi",
  },
  {
    id: "kt-n-3",
    englishTerm: "Reflex Action",
    igboTerm: "Nzaghachi Ngwa Ngwa",
    igboExplanation:
      "Nzaghachi ọsọ ọsọ nke anaghị atọ n'ụzọ uche - dị ka ịwepụ aka n'ọkụ",
  },
  {
    id: "kt-n-4",
    englishTerm: "Stimulus",
    igboTerm: "Ihe Na-Akpọ Nzaghachi",
    igboExplanation:
      "Mgbanwe n'ọdịdị gburugburu nke nwere ike ọrụ ahụ ghọta ma zaghachi ya",
  },
  {
    id: "kt-n-5",
    englishTerm: "Cerebrum",
    igboTerm: "Isi Ụbụrụ",
    igboExplanation:
      "Akụkụ kacha ọnụ n'ụbụrụ nke na-achị uche, ọmụmụ, na mmegharị ọhụọhụ",
  },
  {
    id: "kt-n-6",
    englishTerm: "Axon",
    igboTerm: "Okporo Akwara",
    igboExplanation:
      "Ihe ogologo nke mkpụrụ ndụ akwara nke na-ebugharị impulse ọkụ eletrik",
  },
  {
    id: "kt-n-7",
    englishTerm: "Receptor",
    igboTerm: "Ihe Ọ Nọta Stimulus",
    igboExplanation:
      "Cell pụrụ iche nke na-ata stimulus (ìhè, ọkụ, mgbachi) ma mee ka impulse pụta",
  },
  {
    id: "kt-n-8",
    englishTerm: "Neurotransmitter",
    igboTerm: "Chemical Akwara Ozi",
    igboExplanation:
      "Ihe ọgwụ nke na-agbasa n'ime oghere synapse iji bugharị ozi n'etiti akwara abụọ",
  },
];

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS - FORCES & MOTION (22)
// ═══════════════════════════════════════════════════════════════════

const Q_FORCES = [
  {
    id: "q-f-1",
    type: QuestionType.MCQ,
    questionText: "What is Newton's Second Law?",
    questionTextIgbo: "Gịnị bụ Iwu Newton Nke Abụọ?",
    options: [
      "An object at rest stays at rest",
      "F = ma",
      "Every action has an equal and opposite reaction",
      "Energy is conserved",
    ],
    optionsIgbo: [
      "Ihe dị jụụ na-anọgide jụụ",
      "F = ma",
      "Omume ọ bụla nwere mmeghachi omume hà na nke megidere ya",
      "A na-echekwa ike",
    ],
    correctAnswer: "F = ma",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "An object at rest stays at rest",
          feedback:
            "That is Newton's FIRST Law (Inertia). Newton's Second Law (Iwu Newton Nke Abụọ) states F = ma.",
        },
      ],
      defaultFeedback:
        "Newton's Second Law (Iwu Newton Nke Abụọ): F = ma - force equals mass times acceleration.",
    },
  },
  {
    id: "q-f-2",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "A heavier object always falls faster than a lighter one in a vacuum.",
    questionTextIgbo:
      "Ihe dị arọ na-adaba ngwa ngwa karịa nke dị mfe n'ime oghere efu?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "In a vacuum, all objects fall at the same rate due to gravity (g ≈ 10 m/s²) regardless of mass. Air resistance is what makes a feather fall slower than a stone.",
        },
      ],
      defaultFeedback:
        "In a vacuum, all objects fall with the same acceleration due to gravity (Ike Dada Ala) - about 10 m/s². Mass does not affect free fall rate.",
    },
  },
  {
    id: "q-f-3",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What is the formula for momentum?",
    questionTextIgbo: "Kedu usoro maka momentum?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "p = mv",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "F = ma",
          feedback:
            "F = ma is Newton's Second Law. Momentum (Ike Gaa N'Ihu) = mass × velocity: p = mv.",
        },
      ],
      defaultFeedback:
        "Momentum (Ike Gaa N'Ihu): p = mv (momentum = mass × velocity). Measured in kg·m/s.",
    },
  },
  {
    id: "q-f-4",
    type: QuestionType.MCQ,
    questionText: "What does the area under a velocity–time graph represent?",
    questionTextIgbo:
      "Gịnị ka mpaghara dị n'okpuru graph velocity–time na-anọchi anya?",
    options: ["Acceleration", "Force", "Distance travelled", "Momentum"],
    optionsIgbo: ["Ọsọ Ọsịsọ", "Ike", "Ụzọ gara", "Momentum"],
    correctAnswer: "Distance travelled",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Acceleration",
          feedback:
            "Acceleration is the GRADIENT (slope) of a velocity–time graph, not the area. The area under the graph gives distance (Ụzọ) travelled.",
        },
      ],
      defaultFeedback:
        "The area under a velocity–time graph equals the distance (Ụzọ) travelled. Area = ½base×height for triangular sections.",
    },
  },
  {
    id: "q-f-5",
    type: QuestionType.TRUE_FALSE,
    questionText: "Friction always acts in the same direction as motion.",
    questionTextIgbo:
      "Friction na-arụ ọrụ n'otu ụzọ ahụ na mmegharị mgbe niile?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "Friction (Mgbochi Mmegharị) OPPOSES motion - it acts in the opposite direction to movement.",
        },
      ],
      defaultFeedback:
        "Friction (Mgbochi Mmegharị) always acts against the direction of motion. It converts kinetic energy to heat.",
    },
  },
  {
    id: "q-f-6",
    type: QuestionType.MCQ,
    questionText: "A 5 kg object accelerates at 3 m/s². What force acts on it?",
    questionTextIgbo:
      "Ihe nwere ibu 5 kg na-enweta acceleration 3 m/s². Kedu ike na-arụ ọrụ na ya?",
    options: ["1.67 N", "8 N", "15 N", "0.6 N"],
    optionsIgbo: ["1.67 N", "8 N", "15 N", "0.6 N"],
    correctAnswer: "15 N",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "8 N",
          feedback: "Use F = ma: F = 5 × 3 = 15 N, not 5 + 3 = 8 N.",
        },
      ],
      defaultFeedback:
        "F = ma = 5 × 3 = 15 N. Newton's Second Law (Iwu Newton Nke Abụọ): Force = mass × acceleration.",
    },
  },
  {
    id: "q-f-7",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the principle that states momentum is conserved in a closed system?",
    questionTextIgbo:
      "Kedu iwu na-ekwu na a na-echekwa momentum n'ime sistem mechiri emechi?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "conservation of momentum",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "conservation of energy",
          feedback:
            "Conservation of energy is a different principle. The principle for momentum (Ike Gaa N'Ihu) in collisions is conservation of momentum.",
        },
      ],
      defaultFeedback:
        "The law of conservation of momentum (Ike Gaa N'Ihu): total momentum before a collision = total momentum after (in a closed system).",
    },
  },
  {
    id: "q-f-8",
    type: QuestionType.MCQ,
    questionText: "What is the difference between speed and velocity?",
    questionTextIgbo: "Kedu ihe dị iche n'etiti speed na velocity?",
    options: [
      "Speed has direction; velocity does not",
      "Velocity has direction; speed does not",
      "They are identical",
      "Speed is measured in m/s; velocity in km/h",
    ],
    optionsIgbo: [
      "Speed nwere direction; velocity enweghị",
      "Velocity nwere direction; speed enweghị",
      "Ha bụ otu ihe",
      "Speed na-atụ na m/s; velocity na km/h",
    ],
    correctAnswer: "Velocity has direction; speed does not",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Speed has direction; velocity does not",
          feedback:
            "It is the opposite. Velocity (Ọsọ na Ụzọ) is a vector (magnitude + direction); speed is a scalar (magnitude only).",
        },
      ],
      defaultFeedback:
        "Velocity (Ọsọ na Ụzọ) is a vector - it includes both magnitude and direction. Speed is scalar - magnitude only.",
    },
  },
  {
    id: "q-f-9",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Newton's Third Law states that every action has an equal and opposite reaction.",
    questionTextIgbo:
      "Iwu Newton Nke Atọ na-ekwu na omume ọ bụla nwere mmeghachi omume hà na nke megidere ya?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Newton's Third Law: if A exerts a force on B, then B exerts an equal and opposite force on A - e.g. a rocket pushing gas down, gas pushing rocket up.",
        },
      ],
      defaultFeedback:
        "Correct! Newton's Third Law: for every action force there is an equal and opposite reaction force acting on a different object.",
    },
  },
  {
    id: "q-f-10",
    type: QuestionType.MCQ,
    questionText:
      "An object travelling at constant velocity has what net force acting on it?",
    questionTextIgbo:
      "Ihe na-emegharị na velocity kwụsie ike nwere ike net nke ole na-arụ ọrụ na ya?",
    options: [
      "A large force",
      "A small force",
      "Zero force",
      "Its weight only",
    ],
    optionsIgbo: ["Ike buru ibu", "Ike nta", "Enweghị ike", "Naanị ibu ya"],
    correctAnswer: "Zero force",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "A large force",
          feedback:
            "By Newton's First Law (Inertia), constant velocity means the forces are BALANCED - net force = zero. A net force would cause acceleration.",
        },
      ],
      defaultFeedback:
        "At constant velocity, net force = zero. The forces are balanced (Newton's First Law). A net force would cause acceleration (Ọsọ Ọsịsọ).",
    },
  },
  {
    id: "q-f-11",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What is the formula for work done?",
    questionTextIgbo: "Kedu usoro maka work done?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "W = Fd",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "P = Fd",
          feedback:
            "P = Fd is not standard. Power = work/time. Work done = Force × distance: W = Fd.",
        },
      ],
      defaultFeedback:
        "Work done (W) = Force × distance in direction of force: W = Fd. Measured in joules (J).",
    },
  },
  {
    id: "q-f-12",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Kinetic energy depends on the square of an object's velocity.",
    questionTextIgbo:
      "Kinetic energy na-adabere na square nke velocity nke ihe?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. KE = ½mv² - doubling speed quadruples kinetic energy because velocity is squared.",
        },
      ],
      defaultFeedback:
        "Correct! KE = ½mv². Doubling velocity multiplies KE by 4 - this is why stopping distances increase dramatically at higher speeds.",
    },
  },
  {
    id: "q-f-13",
    type: QuestionType.MCQ,
    questionText:
      "What force opposes the motion of an object falling through air?",
    questionTextIgbo:
      "Kedu ike na-egbochi mmegharị nke ihe na-adaba n'ime ikuku?",
    options: ["Gravity", "Normal force", "Air resistance", "Tension"],
    optionsIgbo: ["Gravity", "Normal force", "Air resistance", "Tension"],
    correctAnswer: "Air resistance",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Gravity",
          feedback:
            "Gravity (Ike Dada Ala) pulls the object DOWN - it causes the fall, not oppose it. Air resistance (drag) opposes the downward motion.",
        },
      ],
      defaultFeedback:
        "Air resistance (Mgbochi Mmegharị) - also called drag - opposes the downward motion of a falling object. At terminal velocity, drag equals weight.",
    },
  },
  {
    id: "q-f-14",
    type: QuestionType.MCQ,
    questionText:
      "At terminal velocity, what can be said about the forces on a falling object?",
    questionTextIgbo:
      "N'oge terminal velocity, gịnị ka a ga-ekwu gbasara ike na-arụ ọrụ na ihe na-adaba?",
    options: [
      "Only gravity acts",
      "Only air resistance acts",
      "Forces are balanced",
      "Gravity is greater than drag",
    ],
    optionsIgbo: [
      "Naanị gravity na-arụ ọrụ",
      "Naanị air resistance na-arụ ọrụ",
      "Ike kwekọrọ",
      "Gravity karịrị drag",
    ],
    correctAnswer: "Forces are balanced",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Only gravity acts",
          feedback:
            "Both gravity (Ike Dada Ala) and air resistance act. At terminal velocity they are EQUAL - the object falls at constant speed.",
        },
      ],
      defaultFeedback:
        "At terminal velocity, gravity (Ike Dada Ala) and air resistance are equal and opposite - net force = 0, so velocity is constant.",
    },
  },
  {
    id: "q-f-15",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Gravitational potential energy increases as an object is lifted higher.",
    questionTextIgbo:
      "Gravitational potential energy na-abawanye mgbe a buliri ihe elu?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. GPE = mgh - as height (h) increases, so does gravitational potential energy.",
        },
      ],
      defaultFeedback:
        "Correct! Gravitational potential energy (GPE) = mgh. Lifting an object gives it more GPE, which converts to kinetic energy when it falls.",
    },
  },
  {
    id: "q-f-16",
    type: QuestionType.MCQ,
    questionText:
      "An object has mass 2 kg and velocity 6 m/s. Its momentum is:",
    questionTextIgbo: "Ihe nwere ibu 2 kg na velocity 6 m/s. Kedu momentum ya?",
    options: ["3 kg·m/s", "8 kg·m/s", "12 kg·m/s", "36 kg·m/s"],
    optionsIgbo: ["3 kg·m/s", "8 kg·m/s", "12 kg·m/s", "36 kg·m/s"],
    correctAnswer: "12 kg·m/s",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "8 kg·m/s",
          feedback:
            "Momentum (Ike Gaa N'Ihu) = m × v = 2 × 6 = 12 kg·m/s, not 2 + 6 = 8.",
        },
      ],
      defaultFeedback:
        "p = mv = 2 × 6 = 12 kg·m/s. Momentum (Ike Gaa N'Ihu) is mass times velocity.",
    },
  },
  {
    id: "q-f-17",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What name is given to the resistance of an object to changes in its motion?",
    questionTextIgbo:
      "Kedu aha a na-akpọ iguzogide mgbanwe na mmegharị nke ihe?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "inertia",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "friction",
          feedback:
            "Friction (Mgbochi Mmegharị) opposes sliding between surfaces. The resistance to change in motion is inertia (Ngọngọ Ihe Ịgbanwe) - related to mass.",
        },
      ],
      defaultFeedback:
        "Inertia (Ngọngọ Ihe Ịgbanwe) is an object's resistance to changes in its state of motion. Greater mass = greater inertia.",
    },
  },
  {
    id: "q-f-18",
    type: QuestionType.MCQ,
    questionText: "Which graph shows constant acceleration?",
    questionTextIgbo: "Kedu graph na-egosi acceleration na-adịgide?",
    options: [
      "Horizontal line on distance-time graph",
      "Curved line on distance-time graph",
      "Straight sloped line on velocity-time graph",
      "Horizontal line on velocity-time graph",
    ],
    optionsIgbo: [
      "Ahịrị kwụ ọtọ na distance-time graph",
      "Ahịrị gbagọrọ agbagọ na distance-time graph",
      "Ahịrị nwere slope kwụ ọtọ na velocity-time graph",
      "Ahịrị kwụ ọtọ na velocity-time graph",
    ],
    correctAnswer: "Straight sloped line on velocity-time graph",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Horizontal line on velocity-time graph",
          feedback:
            "A horizontal line on a velocity-time graph means constant VELOCITY (no acceleration). Constant acceleration is a straight SLOPE on the velocity-time graph.",
        },
      ],
      defaultFeedback:
        "Constant acceleration (Ọsọ Ọsịsọ) produces a straight sloped line on a velocity-time graph. The slope (gradient) equals the acceleration value.",
    },
  },
  {
    id: "q-f-19",
    type: QuestionType.TRUE_FALSE,
    questionText: "Power is the rate at which work is done.",
    questionTextIgbo: "Power bụ ọsọ e si arụ ọrụ?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Power (Ike Ọrụ) = work done ÷ time (P = W/t). Measured in watts (W). 1 watt = 1 joule per second.",
        },
      ],
      defaultFeedback:
        "Correct! Power (Ike Ọrụ) = work done ÷ time = W/t. 1 W = 1 J/s. A more powerful engine does the same work in less time.",
    },
  },
  {
    id: "q-f-20",
    type: QuestionType.MCQ,
    questionText: "What happens to stopping distance if a car's speed doubles?",
    questionTextIgbo:
      "Gịnị na-eme na stopping distance ma ọ bụrụ na ọsọ ụgbọ ala gbara abụọ?",
    options: ["Doubles", "Triples", "Quadruples", "Stays the same"],
    optionsIgbo: [
      "Na-agba abụọ",
      "Na-agba atọ",
      "Na-agba anọ",
      "Na-anọgide otu",
    ],
    correctAnswer: "Quadruples",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Doubles",
          feedback:
            "Stopping distance increases with the SQUARE of speed (from KE = ½mv²). Double the speed → quadruple the stopping distance.",
        },
      ],
      defaultFeedback:
        "Stopping distance is proportional to v². Doubling speed quadruples stopping distance - a key reason why speed limits save lives.",
    },
  },
  {
    id: "q-f-21",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What is the unit of force?",
    questionTextIgbo: "Kedu unit nke force?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "newton",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "joule",
          feedback:
            "Joule is the unit of energy/work. Force (Ike Mgbachi) is measured in newtons (N), named after Isaac Newton.",
        },
      ],
      defaultFeedback:
        "Force (Ike Mgbachi) is measured in newtons (N). 1 newton is the force needed to accelerate 1 kg at 1 m/s² (from F = ma).",
    },
  },
  {
    id: "q-f-22",
    type: QuestionType.TRUE_FALSE,
    questionText: "An object at rest has zero momentum.",
    questionTextIgbo: "Ihe dị jụụ nwere momentum efu?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Momentum (Ike Gaa N'Ihu) = m × v. If velocity = 0, then momentum = m × 0 = 0 regardless of mass.",
        },
      ],
      defaultFeedback:
        "Correct! Momentum (Ike Gaa N'Ihu) = mv. A stationary object has v = 0, so p = 0 regardless of its mass.",
    },
  },
];

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS - THE ATOM (20)
// ═══════════════════════════════════════════════════════════════════

const Q_ATOM = [
  {
    id: "q-a-1",
    type: QuestionType.MCQ,
    questionText: "What is found in the nucleus of an atom?",
    questionTextIgbo: "Gịnị ka a na-ahụ n'ime nucleus nke atom?",
    options: [
      "Electrons only",
      "Protons and neutrons",
      "Neutrons only",
      "Protons only",
    ],
    optionsIgbo: [
      "Naanị electrons",
      "Protons na neutrons",
      "Naanị neutrons",
      "Naanị protons",
    ],
    correctAnswer: "Protons and neutrons",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Electrons only",
          feedback:
            "Electrons (Ihe Ọpụrụiche Ume Ọjọọ) orbit the nucleus in shells. The nucleus contains protons (Ihe Ọpụrụiche Ume Ọha) and neutrons (Ihe Ọpụrụiche Enweghị Ume).",
        },
      ],
      defaultFeedback:
        "The nucleus contains protons (Ihe Ọpụrụiche Ume Ọha) and neutrons (Ihe Ọpụrụiche Enweghị Ume). Electrons orbit outside.",
    },
  },
  {
    id: "q-a-2",
    type: QuestionType.MCQ,
    questionText: "What charge does an electron carry?",
    questionTextIgbo: "Kedu charge electron na-eburu?",
    options: ["+1", "0", "−1", "−2"],
    optionsIgbo: ["+1", "0", "−1", "−2"],
    correctAnswer: "−1",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "+1",
          feedback:
            "+1 is the charge of a proton (Ihe Ọpụrụiche Ume Ọha). Electrons (Ihe Ọpụrụiche Ume Ọjọọ) carry a negative charge of −1.",
        },
      ],
      defaultFeedback:
        "Electrons (Ihe Ọpụrụiche Ume Ọjọọ) have a charge of −1. Protons are +1 and neutrons are 0.",
    },
  },
  {
    id: "q-a-3",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Isotopes of the same element have the same number of protons.",
    questionTextIgbo: "Isotopes nke otu element nwere otu ọnụọgụ protons?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Isotopes (Ụdị Atom Ọzọ) are atoms of the SAME element - same proton number - but with DIFFERENT numbers of neutrons, giving different mass numbers.",
        },
      ],
      defaultFeedback:
        "Correct! Isotopes (Ụdị Atom Ọzọ) have the same atomic number (protons) but different mass numbers (different neutron counts).",
    },
  },
  {
    id: "q-a-4",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What does the atomic number of an element tell you?",
    questionTextIgbo: "Kedu ihe atomic number nke element na-agwa gị?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "number of protons",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "number of neutrons",
          feedback:
            "The number of neutrons = mass number − atomic number. The atomic number (Ọnụọgụ Proton) directly gives the number of protons.",
        },
      ],
      defaultFeedback:
        "The atomic number (Ọnụọgụ Proton) equals the number of protons in the nucleus. It defines which element it is.",
    },
  },
  {
    id: "q-a-5",
    type: QuestionType.MCQ,
    questionText:
      "What is the maximum number of electrons in the second shell?",
    questionTextIgbo:
      "Kedu ọnụ ọgụgụ kacha elu nke electrons na shell nke abụọ?",
    options: ["2", "4", "8", "18"],
    optionsIgbo: ["2", "4", "8", "18"],
    correctAnswer: "8",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "2",
          feedback:
            "Shell 1 holds a maximum of 2 electrons. Shell 2 can hold up to 8 electrons.",
        },
      ],
      defaultFeedback:
        "Shell 2 can hold a maximum of 8 electrons. Shell 1 holds 2; shell 3 also holds 8 in the simple model.",
    },
  },
  {
    id: "q-a-6",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "In a neutral atom, the number of protons equals the number of electrons.",
    questionTextIgbo: "N'ime atom neutral, ọnụọgụ protons hà na electrons?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. In a neutral atom, the positive charge of protons (Ihe Ọpụrụiche Ume Ọha) is balanced exactly by the negative charge of electrons (Ihe Ọpụrụiche Ume Ọjọọ).",
        },
      ],
      defaultFeedback:
        "Correct! A neutral atom has equal protons and electrons. When it gains or loses electrons it becomes an ion (Atom Ọrịa Ume).",
    },
  },
  {
    id: "q-a-7",
    type: QuestionType.MCQ,
    questionText: "What is an ion?",
    questionTextIgbo: "Gịnị bụ ion?",
    options: [
      "An atom with extra neutrons",
      "An atom that has gained or lost electrons",
      "A radioactive atom",
      "A molecule",
    ],
    optionsIgbo: [
      "Atom nwere neutrons karịa",
      "Atom enwetara ma ọ bụ tufuo electrons",
      "Atom radioactive",
      "Molecule",
    ],
    correctAnswer: "An atom that has gained or lost electrons",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "An atom with extra neutrons",
          feedback:
            "An atom with extra neutrons is an isotope (Ụdị Atom Ọzọ), not an ion. An ion (Atom Ọrịa Ume) has gained or lost electrons, creating a net charge.",
        },
      ],
      defaultFeedback:
        "An ion (Atom Ọrịa Ume) forms when an atom gains or loses electrons. Metals lose electrons → positive ions; non-metals gain electrons → negative ions.",
    },
  },
  {
    id: "q-a-8",
    type: QuestionType.MCQ,
    questionText:
      "Elements in the same group of the periodic table have similar chemical properties because:",
    questionTextIgbo:
      "Elements nọ n'otu group na periodic table nwere àgwà kemịkal yiri nke ahụ n'ihi na:",
    options: [
      "Same mass number",
      "Same number of outer electrons",
      "Same number of neutrons",
      "Same physical state",
    ],
    optionsIgbo: [
      "Otu mass number",
      "Otu ọnụọgụ electrons n'èzí",
      "Otu ọnụọgụ neutrons",
      "Otu ọnọdụ anụ ahụ",
    ],
    correctAnswer: "Same number of outer electrons",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Same mass number",
          feedback:
            "Elements in the same group have very different mass numbers. Their similar properties come from having the same number of electrons in their outer shell.",
        },
      ],
      defaultFeedback:
        "Elements in the same group have the same number of outer electrons - this determines how they react. E.g. all Group 1 elements have 1 outer electron.",
    },
  },
  {
    id: "q-a-9",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Alpha radiation is the most ionising and least penetrating type.",
    questionTextIgbo:
      "Alpha radiation bụ nke kacha ionising ma nwee ntinye kacha nta?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Alpha particles (helium nuclei) are large and slow - they ionise strongly but are stopped by a sheet of paper. Gamma rays are weakly ionising but highly penetrating.",
        },
      ],
      defaultFeedback:
        "Correct! Alpha (α) radiation is the most ionising (strips electrons from atoms) but is stopped by paper or a few cm of air.",
    },
  },
  {
    id: "q-a-10",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What is the mass number of an atom?",
    questionTextIgbo: "Gịnị bụ mass number nke atom?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "protons plus neutrons",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "protons",
          feedback:
            "The atomic number = protons. Mass number (Ọnụọgụ Proton na Neutron) = protons + neutrons.",
        },
      ],
      defaultFeedback:
        "Mass number = number of protons + number of neutrons in the nucleus. Electrons are so light they are not included.",
    },
  },
  {
    id: "q-a-11",
    type: QuestionType.MCQ,
    questionText: "Carbon-12 and Carbon-14 are:",
    questionTextIgbo: "Carbon-12 na Carbon-14 bụ:",
    options: [
      "Different elements",
      "Isotopes of carbon",
      "Ions of carbon",
      "Allotropes of carbon",
    ],
    optionsIgbo: [
      "Elements dị iche",
      "Isotopes nke carbon",
      "Ions nke carbon",
      "Allotropes nke carbon",
    ],
    correctAnswer: "Isotopes of carbon",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Different elements",
          feedback:
            "Both have atomic number 6 (6 protons) - they are the same element (carbon). The difference is in neutrons (6 vs 8), making them isotopes (Ụdị Atom Ọzọ).",
        },
      ],
      defaultFeedback:
        "Carbon-12 and Carbon-14 are isotopes (Ụdị Atom Ọzọ) - same element (6 protons) but different mass numbers (12 vs 14), so different neutron counts.",
    },
  },
  {
    id: "q-a-12",
    type: QuestionType.TRUE_FALSE,
    questionText: "Most of an atom's volume is empty space.",
    questionTextIgbo: "Ọtụtụ akụkụ nke atom bụ oghere efu?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. The nucleus is tiny (about 1/10,000 of the atom's diameter) but contains almost all the mass. The rest is mostly empty space occupied by electrons.",
        },
      ],
      defaultFeedback:
        "Correct! The nucleus of an atom (Mkpụrụ Ihe) is incredibly small - if an atom were a football stadium, the nucleus would be a pea. Most of the volume is empty space.",
    },
  },
  {
    id: "q-a-13",
    type: QuestionType.MCQ,
    questionText: "What radiation is stopped by a thin sheet of aluminium?",
    questionTextIgbo:
      "Kedu radiation a na-egbochi site na aluminium dị ntakịrị?",
    options: ["Alpha", "Beta", "Gamma", "All three"],
    optionsIgbo: ["Alpha", "Beta", "Gamma", "Ha niile"],
    correctAnswer: "Beta",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Alpha",
          feedback:
            "Alpha (α) is stopped by paper alone. Beta (β) particles are stopped by a few mm of aluminium.",
        },
        {
          pattern: "Gamma",
          feedback:
            "Gamma (γ) requires thick lead or concrete to be significantly attenuated. Beta (β) is stopped by a few mm of aluminium.",
        },
      ],
      defaultFeedback:
        "Beta (β) radiation is stopped by a few mm of aluminium. Alpha needs only paper; gamma requires thick lead or concrete.",
    },
  },
  {
    id: "q-a-14",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the name for atoms of the same element with different mass numbers?",
    questionTextIgbo:
      "Kedu aha a na-akpọ atoms nke otu element nwere mass number dị iche?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "isotopes",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "ions",
          feedback:
            "Ions (Atom Ọrịa Ume) have different electron counts. Atoms with the same proton number but different mass numbers are isotopes (Ụdị Atom Ọzọ).",
        },
      ],
      defaultFeedback:
        "Isotopes (Ụdị Atom Ọzọ) are atoms of the same element with different numbers of neutrons - same atomic number, different mass number.",
    },
  },
  {
    id: "q-a-15",
    type: QuestionType.MCQ,
    questionText: "Which subatomic particle has the smallest mass?",
    questionTextIgbo: "Kedu subatomic particle nwere mass kacha nta?",
    options: ["Proton", "Neutron", "Electron", "They are all equal"],
    optionsIgbo: ["Proton", "Neutron", "Electron", "Ha niile hà"],
    correctAnswer: "Electron",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Neutron",
          feedback:
            "Neutrons (Ihe Ọpụrụiche Enweghị Ume) and protons are roughly equal in mass (~1 amu). Electrons are about 1/1836 the mass of a proton - tiny by comparison.",
        },
      ],
      defaultFeedback:
        "Electrons (Ihe Ọpụrụiche Ume Ọjọọ) have negligible mass compared to protons and neutrons. That's why mass number only counts protons and neutrons.",
    },
  },
  {
    id: "q-a-16",
    type: QuestionType.TRUE_FALSE,
    questionText: "Gamma radiation is a form of electromagnetic radiation.",
    questionTextIgbo: "Gamma radiation bụ ụdị electromagnetic radiation?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Gamma (γ) rays are high-energy electromagnetic radiation - part of the electromagnetic spectrum, like X-rays but even higher energy.",
        },
      ],
      defaultFeedback:
        "Correct! Gamma (γ) radiation is electromagnetic radiation - high-energy photons emitted from unstable nuclei during radioactive decay (Ihe Ọkụ Ọnụọgụ Isi).",
    },
  },
  {
    id: "q-a-17",
    type: QuestionType.MCQ,
    questionText: "What is the electronic configuration of sodium (Na, Z=11)?",
    questionTextIgbo: "Gịnị bụ electronic configuration nke sodium (Na, Z=11)?",
    options: ["2,9", "2,8,1", "3,8", "2,6,3"],
    optionsIgbo: ["2,9", "2,8,1", "3,8", "2,6,3"],
    correctAnswer: "2,8,1",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "2,9",
          feedback:
            "Shell 2 can only hold 8 electrons. Sodium (Z=11) fills shell 1 (2), shell 2 (8), then has 1 left in shell 3: configuration 2,8,1.",
        },
      ],
      defaultFeedback:
        "Sodium (Na) has 11 electrons: 2 in shell 1, 8 in shell 2, 1 in shell 3. Configuration = 2,8,1. That single outer electron explains Na's reactivity.",
    },
  },
  {
    id: "q-a-18",
    type: QuestionType.MCQ,
    questionText: "How are elements arranged in the modern periodic table?",
    questionTextIgbo: "Kedu ka e si hazie elements na modern periodic table?",
    options: [
      "By atomic mass",
      "By alphabetical order",
      "By atomic number",
      "By density",
    ],
    optionsIgbo: [
      "Site na atomic mass",
      "Site na mkpụrụedemede",
      "Site na atomic number",
      "Site na density",
    ],
    correctAnswer: "By atomic number",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "By atomic mass",
          feedback:
            "Historically Mendeleev used atomic mass, but the modern periodic table orders elements by ATOMIC NUMBER (Ọnụọgụ Proton) - number of protons.",
        },
      ],
      defaultFeedback:
        "Elements in the modern periodic table are arranged in order of increasing atomic number (Ọnụọgụ Proton) - the number of protons.",
    },
  },
  {
    id: "q-a-19",
    type: QuestionType.TRUE_FALSE,
    questionText: "Protons and neutrons have approximately equal mass.",
    questionTextIgbo: "Protons na neutrons nwere mass dị ka ibe ha?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Protons (Ihe Ọpụrụiche Ume Ọha) and neutrons (Ihe Ọpụrụiche Enweghị Ume) both have a relative mass of approximately 1 amu. Electrons are much lighter.",
        },
      ],
      defaultFeedback:
        "Correct! Protons and neutrons both have a relative mass of ~1 amu. This is why mass number = protons + neutrons.",
    },
  },
  {
    id: "q-a-20",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What type of charge do positive ions (cations) carry?",
    questionTextIgbo: "Kedu ụdị charge ions dị mma (cations) na-eburu?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "positive",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "negative",
          feedback:
            "Negative ions are called anions (non-metals that gained electrons). Cations are POSITIVE ions (Atom Ọrịa Ume) - metals that lost electrons.",
        },
      ],
      defaultFeedback:
        "Cations carry a positive charge - they form when atoms LOSE electrons. E.g. Na → Na⁺ + e⁻. Anions are negative (gained electrons).",
    },
  },
];

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS - CIRCULATION (20), PLANTS (20), CHEMISTRY (22), NERVOUS (20)
// ═══════════════════════════════════════════════════════════════════

const Q_CIRCULATION = [
  {
    id: "q-ci-1",
    type: QuestionType.MCQ,
    questionText: "Which side of the heart pumps blood to the lungs?",
    questionTextIgbo: "Kedu akụkụ obi na-ebuga ọbara gaa na akpa ume?",
    options: ["Left", "Right", "Both sides simultaneously", "Neither"],
    optionsIgbo: ["Ekpe", "Nri", "Ha abụọ n'otu oge", "Ọ dịghị"],
    correctAnswer: "Right",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Left",
          feedback:
            "The LEFT side pumps oxygenated blood to the BODY (systemic circuit). The RIGHT side pumps deoxygenated blood to the LUNGS (pulmonary circuit).",
        },
      ],
      defaultFeedback:
        "The right side of the heart (Obi) pumps deoxygenated blood to the lungs. The left side pumps oxygenated blood to the body.",
    },
  },
  {
    id: "q-ci-2",
    type: QuestionType.MCQ,
    questionText: "What is the function of valves in the heart?",
    questionTextIgbo: "Kedu ọrụ valves dị n’obi?",
    options: [
      "Speed up blood flow",
      "Prevent backflow of blood",
      "Produce blood cells",
      "Regulate heart rate",
    ],
    optionsIgbo: [
      "Mee ka ọbara gbaa ọsọ ọsọ",
      "Gbochie ọbara ịlaghachi azụ",
      "Mepụta mkpụrụ ndụ ọbara",
      "Hazie ọsọ obi",
    ],
    correctAnswer: "Prevent backflow of blood",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Regulate heart rate",
          feedback:
            "Heart rate is controlled by the SA node (pacemaker). Valves prevent blood from flowing backwards through the heart (Obi).",
        },
      ],
      defaultFeedback:
        "Heart valves prevent backflow of blood, ensuring it flows in one direction - from atria to ventricles to arteries (Akwara Ọbara Siri Ike).",
    },
  },
  {
    id: "q-ci-3",
    type: QuestionType.TRUE_FALSE,
    questionText: "Arteries carry blood away from the heart.",
    questionTextIgbo: "Arteries na-ebuga ọbara pụọ n’obi.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Arteries (Akwara Ọbara Siri Ike) carry blood AWAY from the heart (Obi) under high pressure. Veins carry blood TOWARD the heart.",
        },
      ],
      defaultFeedback:
        "Correct! Arteries (Akwara Ọbara Siri Ike) carry blood away from the heart at high pressure. A useful mnemonic: Arteries carry blood Away.",
    },
  },
  {
    id: "q-ci-4",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What protein in red blood cells carries oxygen?",
    questionTextIgbo: "Kedu protein dị na red blood cells na-eburu oxygen?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "haemoglobin",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "chlorophyll",
          feedback:
            "Chlorophyll (Mgbara Ndụ Osisi) is found in plants for photosynthesis. Haemoglobin (Ihe Ọbara Na-Ebu Ikuku) in red blood cells carries oxygen.",
        },
      ],
      defaultFeedback:
        "Haemoglobin (Ihe Ọbara Na-Ebu Ikuku) is the iron-containing protein in red blood cells that binds oxygen in the lungs and releases it in body tissues.",
    },
  },
  {
    id: "q-ci-5",
    type: QuestionType.MCQ,
    questionText: "Which blood vessel has the thinnest walls?",
    questionTextIgbo: "Kedu akwara ọbara nwere mgbidi kacha dịrị gịrịgịrị?",
    options: ["Artery", "Vein", "Capillary", "Aorta"],
    optionsIgbo: ["Artery", "Vein", "Capillary", "Aorta"],
    correctAnswer: "Capillary",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Vein",
          feedback:
            "Veins (Akwara Ọbara Lọghachi) have thinner walls than arteries, but capillaries (Akwara Ọbara Obere) have walls just ONE CELL thick - the thinnest.",
        },
      ],
      defaultFeedback:
        "Capillaries (Akwara Ọbara Obere) have walls only one cell thick, enabling efficient exchange of oxygen, nutrients, and waste between blood and body cells.",
    },
  },
  {
    id: "q-ci-6",
    type: QuestionType.TRUE_FALSE,
    questionText: "Veins have valves to prevent backflow.",
    questionTextIgbo: "Veins nwere valves iji gbochie ọbara ịlaghachi azụ.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Veins (Akwara Ọbara Lọghachi) carry blood at low pressure and have semi-lunar valves to prevent blood from pooling and flowing backwards.",
        },
      ],
      defaultFeedback:
        "Correct! Veins (Akwara Ọbara Lọghachi) have valves because blood pressure in veins is low - without valves, blood would flow backwards under gravity.",
    },
  },
  {
    id: "q-ci-7",
    type: QuestionType.MCQ,
    questionText: "What are the four components of blood?",
    questionTextIgbo: "Kedu akụkụ anọ mejupụtara ọbara?",
    options: [
      "Red cells, white cells, platelets, plasma",
      "Arteries, veins, capillaries, heart",
      "Oxygen, glucose, CO₂, water",
      "Haemoglobin, antibodies, clotting factors, hormones",
    ],
    optionsIgbo: [
      "Red cells, white cells, platelets, plasma",
      "Arteries, veins, capillaries, heart",
      "Oxygen, glucose, CO₂, water",
      "Haemoglobin, antibodies, clotting factors, hormones",
    ],
    correctAnswer: "Red cells, white cells, platelets, plasma",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Arteries, veins, capillaries, heart",
          feedback:
            "Those are blood VESSELS, not blood components. Blood (Ọbara) is made of red cells, white cells, platelets, and plasma (Mmiri Ọbara).",
        },
      ],
      defaultFeedback:
        "Blood consists of red blood cells (carry O₂), white blood cells (immune defence), platelets (clotting), and plasma (Mmiri Ọbara - liquid carrier).",
    },
  },
  {
    id: "q-ci-8",
    type: QuestionType.MCQ,
    questionText: "What is the role of white blood cells?",
    questionTextIgbo: "Kedu ọrụ white blood cells?",
    options: [
      "Carry oxygen",
      "Clot blood",
      "Defend against disease",
      "Carry nutrients",
    ],
    optionsIgbo: [
      "Buru oxygen",
      "Mee ka ọbara gbaa",
      "Chebe megide ọrịa",
      "Buru nri",
    ],
    correctAnswer: "Defend against disease",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Carry oxygen",
          feedback:
            "Oxygen is carried by red blood cells (haemoglobin). White blood cells are part of the immune system - they fight pathogens.",
        },
      ],
      defaultFeedback:
        "White blood cells defend the body against disease - phagocytes engulf pathogens; lymphocytes produce antibodies against specific antigens.",
    },
  },
  {
    id: "q-ci-9",
    type: QuestionType.TRUE_FALSE,
    questionText: "The human circulatory system is a single circulation.",
    questionTextIgbo: "Usoro mgbasa ọbara mmadụ bụ single circulation.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "The human circulatory system is a DOUBLE circulation - pulmonary (heart→lungs→heart) and systemic (heart→body→heart). Fish have single circulation.",
        },
      ],
      defaultFeedback:
        "Humans have a double circulation: pulmonary (heart ↔ lungs) and systemic (heart ↔ body). This keeps oxygenated and deoxygenated blood separate.",
    },
  },
  {
    id: "q-ci-10",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What is the name of the heart's natural pacemaker?",
    questionTextIgbo: "Kedu aha pacemaker nke obi?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "sinoatrial node",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "atrioventricular node",
          feedback:
            "The AV node relays the electrical signal to the ventricles. The natural pacemaker that initiates each heartbeat is the sinoatrial (SA) node.",
        },
      ],
      defaultFeedback:
        "The sinoatrial (SA) node is the heart's pacemaker - it generates electrical impulses that trigger each heartbeat at a regular rate.",
    },
  },
  {
    id: "q-ci-11",
    type: QuestionType.MCQ,
    questionText: "During diastole, what happens in the heart?",
    questionTextIgbo: "N’oge diastole, gịnị na-eme n’obi?",
    options: [
      "Ventricles contract",
      "Blood is pumped to the body",
      "Heart muscle relaxes and chambers fill",
      "Valves close permanently",
    ],
    optionsIgbo: [
      "Ventricles na-akpakọrịta",
      "A na-ebuga ọbara n’ahụ",
      "Obi na-ezu ike ma jupụta",
      "Valves na-emechi kpamkpam",
    ],
    correctAnswer: "Heart muscle relaxes and chambers fill",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Ventricles contract",
          feedback:
            "Ventricular contraction is systole. Diastole is the relaxation phase - the heart (Obi) refills with blood.",
        },
      ],
      defaultFeedback:
        "During diastole, the heart (Obi) relaxes and blood flows in from the veins (Akwara Ọbara Lọghachi) to fill the atria and ventricles.",
    },
  },
  {
    id: "q-ci-12",
    type: QuestionType.TRUE_FALSE,
    questionText: "Coronary arteries supply blood to the heart muscle.",
    questionTextIgbo: "Coronary arteries na-ebuga ọbara na akwara obi.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. The coronary arteries (Akwara Ọbara Siri Ike) run over the surface of the heart and supply oxygenated blood to the cardiac muscle itself.",
        },
      ],
      defaultFeedback:
        "Correct! Coronary arteries (Akwara Ọbara Siri Ike) supply the heart (Obi) muscle with oxygen and nutrients. Blockage causes a heart attack.",
    },
  },
  {
    id: "q-ci-13",
    type: QuestionType.MCQ,
    questionText: "What does plasma carry in the blood?",
    questionTextIgbo: "Gịnị ka plasma na-eburu n’ọbara?",
    options: [
      "Only oxygen",
      "Only red blood cells",
      "Nutrients, hormones, CO₂, and waste",
      "Only white blood cells",
    ],
    optionsIgbo: [
      "Naanị oxygen",
      "Naanị red blood cells",
      "Nri, hormones, CO₂ na ihe mkpofu",
      "Naanị white blood cells",
    ],
    correctAnswer: "Nutrients, hormones, CO₂, and waste",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Only oxygen",
          feedback:
            "Oxygen is mainly carried by haemoglobin in red blood cells. Plasma (Mmiri Ọbara) is the liquid that carries dissolved glucose, hormones, CO₂, urea, and more.",
        },
      ],
      defaultFeedback:
        "Plasma (Mmiri Ọbara) is the straw-coloured liquid that transports dissolved substances - glucose, amino acids, hormones, CO₂, urea, and heat.",
    },
  },
  {
    id: "q-ci-14",
    type: QuestionType.TRUE_FALSE,
    questionText: "Platelets are responsible for blood clotting.",
    questionTextIgbo: "Platelets na-ahụ maka ịgba ọbara.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Platelets are tiny cell fragments that clump together at a wound and release chemicals to form a fibrin clot, stopping bleeding.",
        },
      ],
      defaultFeedback:
        "Correct! Platelets are small cell fragments that initiate clotting - they aggregate at wound sites and trigger the coagulation cascade to form a fibrin clot.",
    },
  },
  {
    id: "q-ci-15",
    type: QuestionType.MCQ,
    questionText:
      "What condition results from fatty deposits narrowing coronary arteries?",
    questionTextIgbo: "Kedu ọrịa na-eme mgbe abụba mechiri coronary arteries?",
    options: ["Asthma", "Coronary heart disease", "Diabetes", "Anaemia"],
    optionsIgbo: ["Asthma", "Coronary heart disease", "Diabetes", "Anaemia"],
    correctAnswer: "Coronary heart disease",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Diabetes",
          feedback:
            "Diabetes involves blood sugar regulation. Narrowing of coronary arteries (Akwara Ọbara Siri Ike) by fatty plaques is coronary heart disease.",
        },
      ],
      defaultFeedback:
        "Coronary heart disease occurs when fatty plaques (atherosclerosis) narrow the coronary arteries (Akwara Ọbara Siri Ike), reducing blood flow to the heart (Obi) muscle.",
    },
  },
  {
    id: "q-ci-16",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What is the name of the lower chambers of the heart?",
    questionTextIgbo: "Kedu aha akụkụ ala obi?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "ventricles",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "atria",
          feedback:
            "Atria (Oghere Elu Obi) are the upper chambers. The lower chambers that pump blood out are the ventricles (Oghere Ala Obi).",
        },
      ],
      defaultFeedback:
        "The ventricles (Oghere Ala Obi) are the lower chambers of the heart. They have thicker walls and pump blood to the lungs and body.",
    },
  },
  {
    id: "q-ci-17",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "The left ventricle has thicker walls than the right ventricle.",
    questionTextIgbo: "Left ventricle nwere mgbidi karịrị nke right ventricle?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. The left ventricle pumps blood around the ENTIRE BODY (systemic circulation) - much further than the right ventricle which only pumps to the lungs. More work = thicker walls.",
        },
      ],
      defaultFeedback:
        "Correct! The left ventricle has thicker muscular walls because it pumps oxygenated blood around the whole body at high pressure (systemic circuit).",
    },
  },
  {
    id: "q-ci-18",
    type: QuestionType.MCQ,
    questionText: "What is the pulmonary circuit?",
    questionTextIgbo: "Gịnị bụ pulmonary circuit?",
    options: [
      "Heart to body and back",
      "Heart to lungs and back",
      "Lungs to kidneys",
      "Brain to heart",
    ],
    optionsIgbo: [
      "Obi gaa n’ahụ laghachi",
      "Obi gaa na akpa ume laghachi",
      "Akpa ume gaa n’akụrụ",
      "Ụbụrụ gaa n’obi",
    ],
    correctAnswer: "Heart to lungs and back",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Heart to body and back",
          feedback:
            "Heart to body and back is the SYSTEMIC circuit. Heart to lungs and back is the PULMONARY circuit - where blood picks up oxygen.",
        },
      ],
      defaultFeedback:
        "The pulmonary circuit carries deoxygenated blood from the right side of the heart (Obi) to the lungs, and returns oxygenated blood to the left side.",
    },
  },
  {
    id: "q-ci-19",
    type: QuestionType.TRUE_FALSE,
    questionText: "Red blood cells have no nucleus in their mature form.",
    questionTextIgbo: "Red blood cells enweghị nucleus mgbe ha tolitere?",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Mature red blood cells eject their nucleus, leaving more space for haemoglobin (Ihe Ọbara Na-Ebu Ikuku) to carry oxygen.",
        },
      ],
      defaultFeedback:
        "Correct! Mature red blood cells lack a nucleus - this gives them their biconcave shape and maximises space for haemoglobin (Ihe Ọbara Na-Ebu Ikuku).",
    },
  },
  {
    id: "q-ci-20",
    type: QuestionType.MCQ,
    questionText:
      "Which blood vessel carries oxygenated blood from the lungs to the heart?",
    questionTextIgbo:
      "Kedu akwara ọbara na-ebuga oxygenated blood site na akpa ume gaa n’obi?",
    options: ["Pulmonary artery", "Aorta", "Pulmonary vein", "Vena cava"],
    optionsIgbo: ["Pulmonary artery", "Aorta", "Pulmonary vein", "Vena cava"],
    correctAnswer: "Pulmonary vein",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Pulmonary artery",
          feedback:
            "The pulmonary artery carries DEOXYGENATED blood FROM the heart TO the lungs. The pulmonary VEIN carries oxygenated blood back.",
        },
      ],
      defaultFeedback:
        "The pulmonary vein (Akwara Ọbara Lọghachi) carries oxygenated blood from the lungs to the left atrium of the heart (Obi) - unusually, a vein carrying oxygenated blood.",
    },
  },
];

const Q_PLANTS = [
  {
    id: "q-pl-1",
    type: QuestionType.MCQ,
    questionText: "What is the function of xylem in plants?",
    questionTextIgbo: "Gịnị bụ ọrụ xylem n’osisi?",
    options: [
      "Transport sugars",
      "Transport water and minerals upward",
      "Store food",
      "Carry out photosynthesis",
    ],
    optionsIgbo: [
      "Buru shuga",
      "Buru mmiri na mineral elu",
      "Chekwaa nri",
      "Mee photosynthesis",
    ],
    correctAnswer: "Transport water and minerals upward",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Transport sugars",
          feedback:
            "Sugars are transported by PHLOEM (Akwara Shuga Osisi). Xylem (Akwara Mmiri Osisi) transports water and dissolved minerals from roots to leaves.",
        },
      ],
      defaultFeedback:
        "Xylem (Akwara Mmiri Osisi) carries water and dissolved minerals from the roots upward to the rest of the plant. It consists of dead cells forming hollow tubes.",
    },
  },
  {
    id: "q-pl-2",
    type: QuestionType.TRUE_FALSE,
    questionText: "Phloem transports sugars in both directions in the plant.",
    questionTextIgbo: "Phloem na-ebuga shuga n’ụzọ abụọ n’osisi.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Phloem (Akwara Shuga Osisi) can transport dissolved sugars both upward and downward - from leaves to growing roots or fruits. This bidirectional flow is called translocation.",
        },
      ],
      defaultFeedback:
        "Correct! Phloem (Akwara Shuga Osisi) transports dissolved sugars bidirectionally - from leaves to wherever sugar is needed (roots, fruits, growing tips).",
    },
  },
  {
    id: "q-pl-3",
    type: QuestionType.MCQ,
    questionText: "What drives the movement of water up xylem?",
    questionTextIgbo: "Gịnị na-akpali mmegharị mmiri n’ime xylem?",
    options: [
      "Active pumping by roots",
      "Transpiration pull from leaves",
      "Phloem pressure",
      "Gravity",
    ],
    optionsIgbo: [
      "Mgbapụta site na mgbọrọgwụ",
      "Ihichapụ mmiri site na akwụkwọ",
      "Phloem pressure",
      "Graviti",
    ],
    correctAnswer: "Transpiration pull from leaves",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Active pumping by roots",
          feedback:
            "Root pressure contributes but is minor. The main driver is the transpiration pull (Ịpụsa Mmiri Osisi) - water evaporating from leaves creates suction that pulls water up.",
        },
      ],
      defaultFeedback:
        "Transpiration (Ịpụsa Mmiri Osisi) from leaves creates a negative pressure (suction) that pulls water up the xylem (Akwara Mmiri Osisi) from roots.",
    },
  },
  {
    id: "q-pl-4",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What plant hormone causes shoots to bend toward light?",
    questionTextIgbo: "Kedu hormone osisi na-eme ka ọ gbadaa n’ebe ìhè dị?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "auxin",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "gibberellin",
          feedback:
            "Gibberellins promote overall elongation and seed germination. Auxin (Hormone Osisi Eto) specifically causes uneven growth that makes shoots bend toward light.",
        },
      ],
      defaultFeedback:
        "Auxin (Hormone Osisi Eto) accumulates on the shaded side of shoots, promoting cell elongation there, causing the shoot to curve toward light (phototropism).",
    },
  },
  {
    id: "q-pl-5",
    type: QuestionType.MCQ,
    questionText: "What is phototropism?",
    questionTextIgbo: "Gịnị bụ phototropism?",
    options: [
      "Growth response to gravity",
      "Growth response to light",
      "Growth response to water",
      "Growth response to touch",
    ],
    optionsIgbo: [
      "Mmegharị n’ihi gravitị",
      "Mmegharị n’ihi ìhè",
      "Mmegharị n’ihi mmiri",
      "Mmegharị n’ihi mmetụ",
    ],
    correctAnswer: "Growth response to light",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Growth response to gravity",
          feedback:
            "Growth response to gravity is gravitropism (geotropism). Phototropism (Ịgbago Osisi N'Ihu Ìhè) is the growth response to light.",
        },
      ],
      defaultFeedback:
        "Phototropism (Ịgbago Osisi N'Ihu Ìhè) is a plant's growth response to light. Shoots show positive phototropism - growing toward light.",
    },
  },
  {
    id: "q-pl-6",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Roots show positive gravitropism (they grow toward gravity).",
    questionTextIgbo:
      "Mgbọrọgwụ na-egosi positive gravitropism (ha na-eto n’ebe gravitị dị).",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Roots (Isi Osisi) grow downward with gravity (positive gravitropism) to reach water and anchor the plant. Shoots grow upward against gravity (negative gravitropism).",
        },
      ],
      defaultFeedback:
        "Correct! Roots show positive gravitropism - they grow toward gravity (downward). Shoots show negative gravitropism - they grow upward, against gravity.",
    },
  },
  {
    id: "q-pl-7",
    type: QuestionType.MCQ,
    questionText:
      "What process causes water to move up xylem via evaporation from leaves?",
    questionTextIgbo:
      "Kedu usoro na-eme ka mmiri si n’akwụkwọ pụọ ma kpalie ya elu n’ime xylem?",
    options: ["Osmosis", "Translocation", "Transpiration", "Photosynthesis"],
    optionsIgbo: [
      "Osmosis",
      "Translocation",
      "Transpiration",
      "Photosynthesis",
    ],
    correctAnswer: "Transpiration",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Translocation",
          feedback:
            "Translocation is the transport of sugars in phloem. Transpiration (Ịpụsa Mmiri Osisi) is the evaporation of water from leaf surfaces that pulls water up xylem.",
        },
      ],
      defaultFeedback:
        "Transpiration (Ịpụsa Mmiri Osisi) is the loss of water vapour from leaves through stomata. It creates the pull that draws water up through xylem (Akwara Mmiri Osisi).",
    },
  },
  {
    id: "q-pl-8",
    type: QuestionType.MCQ,
    questionText: "Which factor increases the rate of transpiration?",
    questionTextIgbo: "Kedu ihe na-abawanye ọsọ transpiration?",
    options: [
      "High humidity",
      "Darkness",
      "Low wind speed",
      "High temperature",
    ],
    optionsIgbo: [
      "Humidity dị elu",
      "Ọchịchịrị",
      "Ifufe dị ala",
      "Okpomọkụ dị elu",
    ],
    correctAnswer: "High temperature",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "High humidity",
          feedback:
            "High humidity actually DECREASES transpiration (Ịpụsa Mmiri Osisi) - less water vapour gradient means less evaporation from leaves.",
        },
      ],
      defaultFeedback:
        "High temperature increases the rate of transpiration (Ịpụsa Mmiri Osisi) - warmer air holds more water vapour, increasing evaporation from leaf surfaces.",
    },
  },
  {
    id: "q-pl-9",
    type: QuestionType.TRUE_FALSE,
    questionText: "Xylem cells are dead when they are functional.",
    questionTextIgbo: "Xylem cells anwụọla mgbe ha na-arụ ọrụ ha.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Mature xylem (Akwara Mmiri Osisi) cells are dead - their walls are reinforced with lignin and their cell contents are gone, forming hollow tubes for water transport.",
        },
      ],
      defaultFeedback:
        "Correct! Xylem (Akwara Mmiri Osisi) cells die at maturity, leaving hollow lignin-reinforced tubes - ideal for conducting water and minerals under tension.",
    },
  },
  {
    id: "q-pl-10",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the transfer of pollen from one flower to another called?",
    questionTextIgbo:
      "Kedu ihe a na-akpọ nnyefe pollen site n’otu ifuru gaa n’ọzọ?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "pollination",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "fertilisation",
          feedback:
            "Fertilisation is the fusion of gametes (male and female nuclei) inside the ovule. The transfer of pollen between flowers is pollination (Ọnụnọ Nri Ọcha Osisi).",
        },
      ],
      defaultFeedback:
        "Pollination (Ọnụnọ Nri Ọcha Osisi) is the transfer of pollen (containing male gametes) to the stigma of a flower - by insects, wind, or other agents.",
    },
  },
  {
    id: "q-pl-11",
    type: QuestionType.MCQ,
    questionText:
      "What structure in the ovary develops into a seed after fertilisation?",
    questionTextIgbo:
      "Kedu akụkụ n’ime ovary na-aghọ mkpụrụ mgbe fertilisation gasịrị?",
    options: ["Petal", "Ovule", "Stigma", "Anther"],
    optionsIgbo: ["Petal", "Ovule", "Stigma", "Anther"],
    correctAnswer: "Ovule",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Anther",
          feedback:
            "The anther produces pollen. The ovule - contained within the ovary - receives the male gamete and develops into a seed after fertilisation.",
        },
      ],
      defaultFeedback:
        "After fertilisation, the ovule develops into a seed. The entire ovary wall then develops into the fruit surrounding the seed.",
    },
  },
  {
    id: "q-pl-12",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Root hair cells have a large surface area to increase water and mineral absorption.",
    questionTextIgbo:
      "Root hair cells nwere nnukwu surface area iji mee ka absorption dị elu.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Root hair cells (Mkpụrụ Ndụ Isi Osisi) have a long, thin hair-like extension that greatly increases their surface area for absorbing water and dissolved minerals.",
        },
      ],
      defaultFeedback:
        "Correct! Root hair cells (Mkpụrụ Ndụ Isi Osisi) have large surface area due to their hair-like projections - maximising absorption from the soil.",
    },
  },
  {
    id: "q-pl-13",
    type: QuestionType.MCQ,
    questionText: "Which hormone is responsible for fruit ripening?",
    questionTextIgbo: "Kedu hormone na-eme ka mkpụrụ osisi ripen?",
    options: ["Auxin", "Gibberellin", "Ethylene", "Cytokinin"],
    optionsIgbo: ["Auxin", "Gibberellin", "Ethylene", "Cytokinin"],
    correctAnswer: "Ethylene",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Auxin",
          feedback:
            "Auxin (Hormone Osisi Eto) controls phototropism and cell elongation. Ethylene (ethene) is the gaseous hormone that triggers fruit ripening.",
        },
      ],
      defaultFeedback:
        "Ethylene (ethene) is a gaseous plant hormone that triggers fruit ripening. This is why placing unripe fruit in a bag with ripe fruit speeds up ripening.",
    },
  },
  {
    id: "q-pl-14",
    type: QuestionType.MCQ,
    questionText: "Where in a plant cell does photosynthesis take place?",
    questionTextIgbo: "Ebee ka photosynthesis na-eme n’ime plant cell?",
    options: ["Mitochondria", "Vacuole", "Chloroplast", "Ribosome"],
    optionsIgbo: ["Mitochondria", "Vacuole", "Chloroplast", "Ribosome"],
    correctAnswer: "Chloroplast",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Mitochondria",
          feedback:
            "Mitochondria produce energy via respiration, not photosynthesis. Photosynthesis (Ọrụ Anyanwụ) takes place in chloroplasts (Ụlọ Mgbara Osisi).",
        },
      ],
      defaultFeedback:
        "Photosynthesis (Ọrụ Anyanwụ) takes place in chloroplasts (Ụlọ Mgbara Osisi), which contain the green pigment chlorophyll (Mgbara Ndụ Osisi).",
    },
  },
  {
    id: "q-pl-15",
    type: QuestionType.TRUE_FALSE,
    questionText: "Stomata open when guard cells lose water.",
    questionTextIgbo: "Stomata na-emeghe mgbe guard cells tufuru mmiri.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "Stomata (Ọnụ Ọgụgọ Akwụkwọ) CLOSE when guard cells lose water and become flaccid. They OPEN when guard cells absorb water and become turgid.",
        },
      ],
      defaultFeedback:
        "Stomata (Ọnụ Ọgụgọ Akwụkwọ) OPEN when guard cells are turgid (full of water) and CLOSE when guard cells are flaccid (lacking water).",
    },
  },
  {
    id: "q-pl-16",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What is the main function of plant roots?",
    questionTextIgbo: "Gịnị bụ isi ọrụ mgbọrọgwụ osisi?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "absorb water and minerals",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "photosynthesis",
          feedback:
            "Photosynthesis (Ọrụ Anyanwụ) takes place mainly in leaves. Roots (Isi Osisi) anchor the plant and absorb water and mineral salts from the soil.",
        },
      ],
      defaultFeedback:
        "Roots (Isi Osisi) anchor the plant in the soil and absorb water and dissolved mineral salts through root hair cells (Mkpụrụ Ndụ Isi Osisi).",
    },
  },
  {
    id: "q-pl-17",
    type: QuestionType.MCQ,
    questionText:
      "What is the process by which sugars move through phloem called?",
    questionTextIgbo: "Kedu usoro shuga si aga n’ime phloem?",
    options: ["Transpiration", "Diffusion", "Translocation", "Osmosis"],
    optionsIgbo: ["Transpiration", "Diffusion", "Translocation", "Osmosis"],
    correctAnswer: "Translocation",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Transpiration",
          feedback:
            "Transpiration (Ịpụsa Mmiri Osisi) is water loss from leaves. Movement of sugars through phloem (Akwara Shuga Osisi) is translocation.",
        },
      ],
      defaultFeedback:
        "Translocation is the movement of dissolved sugars (made by photosynthesis) through phloem (Akwara Shuga Osisi) to all parts of the plant.",
    },
  },
  {
    id: "q-pl-18",
    type: QuestionType.TRUE_FALSE,
    questionText: "Auxin promotes cell elongation in plant shoots.",
    questionTextIgbo: "Auxin na-akwalite elongation nke cell n’ime shoots.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Auxin (Hormone Osisi Eto) promotes cell elongation in shoots at normal concentrations. This is how it causes phototropic bending - more auxin on the shaded side → that side grows longer.",
        },
      ],
      defaultFeedback:
        "Correct! Auxin (Hormone Osisi Eto) promotes cell elongation in shoots. Uneven auxin distribution causes uneven growth - the basis of phototropism (Ịgbago Osisi N'Ihu Ìhè).",
    },
  },
  {
    id: "q-pl-19",
    type: QuestionType.MCQ,
    questionText: "What is the function of the waxy cuticle on leaves?",
    questionTextIgbo: "Gịnị bụ ọrụ waxy cuticle dị na akwụkwọ?",
    options: [
      "Absorb light",
      "Reduce water loss",
      "Allow gas exchange",
      "Trap insects",
    ],
    optionsIgbo: [
      "Nabata ìhè",
      "Belata mfu mmiri",
      "Mee ka gas gafee",
      "Jide insects",
    ],
    correctAnswer: "Reduce water loss",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Allow gas exchange",
          feedback:
            "Gas exchange occurs through stomata (Ọnụ Ọgụgọ Akwụkwọ). The waxy cuticle is impermeable and reduces water loss from the leaf surface.",
        },
      ],
      defaultFeedback:
        "The waxy cuticle is a waterproof layer on the leaf surface that reduces water loss by evaporation - important for water conservation in plants.",
    },
  },
  {
    id: "q-pl-20",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What organ of a plant produces pollen?",
    questionTextIgbo: "Kedu akụkụ osisi na-emepụta pollen?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "anther",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "stigma",
          feedback:
            "The stigma receives pollen during pollination (Ọnụnọ Nri Ọcha Osisi). Pollen is produced by the anther, part of the stamen (male reproductive structure).",
        },
      ],
      defaultFeedback:
        "The anther is the part of the flower (stamen) that produces and releases pollen grains containing the male gametes.",
    },
  },
];

const Q_CHEMISTRY = [
  {
    id: "q-ch-1",
    type: QuestionType.MCQ,
    questionText: "What is an exothermic reaction?",
    questionTextIgbo: "Gịnị bụ exothermic reaction?",
    options: [
      "Absorbs heat from surroundings",
      "Releases heat to surroundings",
      "Has no energy change",
      "Only occurs in labs",
    ],
    optionsIgbo: [
      "Na-amịkọrọ okpomọkụ site n’ebe gbara ya gburugburu",
      "Na-ewepụta okpomọkụ n’ebe gbara ya gburugburu",
      "Enweghị mgbanwe ike",
      "Na-eme naanị n’ụlọ nyocha",
    ],
    correctAnswer: "Releases heat to surroundings",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Absorbs heat from surroundings",
          feedback:
            "Absorbing heat is ENDOTHERMIC (Ọrụ Na-Amịkọ Ọkụ). Exothermic (Ọrụ Na-Ewepụta Ọkụ) reactions release heat - the surroundings get warmer.",
        },
      ],
      defaultFeedback:
        "Exothermic (Ọrụ Na-Ewepụta Ọkụ) reactions release energy as heat - temperature rises. Examples: combustion, neutralisation, respiration.",
    },
  },
  {
    id: "q-ch-2",
    type: QuestionType.TRUE_FALSE,
    questionText: "In a chemical reaction, atoms are created and destroyed.",
    questionTextIgbo:
      "N'ime mmeghachi omume kemikal, a na-emepụta ma na-ebibi atoms.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "False! The Law of Conservation of Mass states that atoms are neither created nor destroyed - they are only rearranged into new combinations (products).",
        },
      ],
      defaultFeedback:
        "Atoms are REARRANGED, not created or destroyed. The total mass of reactants (Ihe Na-Abanye N'Ọrụ) equals the total mass of products (Ihe N'Esite N'Ọrụ).",
    },
  },
  {
    id: "q-ch-3",
    type: QuestionType.MCQ,
    questionText: "What does a catalyst do?",
    questionTextIgbo: "Gịnị ka catalyst na-eme?",
    options: [
      "Gets used up in the reaction",
      "Increases activation energy",
      "Speeds up reaction without being consumed",
      "Decreases the temperature",
    ],
    optionsIgbo: [
      "A na-eji ya n’ọrụ ahụ",
      "Na-abawanye activation energy",
      "Na-eme ka mmeghachi omume gaa ọsọ ọsọ na-enweghị ire ere",
      "Na-ebelata okpomọkụ",
    ],
    correctAnswer: "Speeds up reaction without being consumed",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Gets used up in the reaction",
          feedback:
            "A catalyst (Ihe Enyemaka Ọrụ) is not consumed - it provides an alternative reaction pathway with lower activation energy (Ike Mmejupụta Ọrụ) and can be reused.",
        },
      ],
      defaultFeedback:
        "A catalyst (Ihe Enyemaka Ọrụ) speeds up a reaction by providing an alternative pathway with lower activation energy. It is not consumed and can be reused.",
    },
  },
  {
    id: "q-ch-4",
    type: QuestionType.MCQ,
    questionText: "What pH does a neutral solution have?",
    questionTextIgbo: "Kedu pH nke solution na-anọpụ iche?",
    options: ["0", "7", "14", "4"],
    optionsIgbo: ["0", "7", "14", "4"],
    correctAnswer: "7",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "0",
          feedback:
            "pH 0 is the most strongly acidic (Ihe Mmiri Ọjọọ). A neutral solution has pH 7 - equal concentrations of H⁺ and OH⁻ ions.",
        },
      ],
      defaultFeedback:
        "Neutral solutions have pH 7. Acids (Ihe Mmiri Ọjọọ) have pH below 7; alkalis have pH above 7.",
    },
  },
  {
    id: "q-ch-5",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Increasing concentration increases the rate of a chemical reaction.",
    questionTextIgbo:
      "Ịbawanye concentration na-abawanye ọsọ nke mmeghachi omume kemikal.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Higher concentration means more particles per unit volume, increasing the frequency of collisions and therefore the rate of reaction.",
        },
      ],
      defaultFeedback:
        "Correct! Higher concentration = more particles in the same volume = more frequent collisions = faster reaction rate (collision theory).",
    },
  },
  {
    id: "q-ch-6",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What two products are formed in every neutralisation reaction?",
    questionTextIgbo:
      "Kedu ngwaahịa abụọ na-apụta n’ime neutralisation reaction ọ bụla?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "salt and water",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "acid and base",
          feedback:
            "Acid and base are the REACTANTS in neutralisation (Ịmezi Mmiri Ọjọọ). The products are a salt and water.",
        },
      ],
      defaultFeedback:
        "Neutralisation (Ịmezi Mmiri Ọjọọ): Acid + Alkali → Salt + Water. E.g. HCl + NaOH → NaCl + H₂O.",
    },
  },
  {
    id: "q-ch-7",
    type: QuestionType.MCQ,
    questionText:
      "What type of reaction releases energy as products have more energy than reactants?",
    questionTextIgbo:
      "Kedu ụdị mmeghachi omume na-ewepụta ike ka ngwaahịa nwee ike karịrị reactants?",
    options: ["Exothermic", "Endothermic", "Neutralisation", "Combustion"],
    optionsIgbo: ["Exothermic", "Endothermic", "Neutralisation", "Combustion"],
    correctAnswer: "Endothermic",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Exothermic",
          feedback:
            "In exothermic reactions, PRODUCTS have LESS energy than reactants - the difference is released as heat. Endothermic reactions produce higher-energy products by absorbing heat.",
        },
      ],
      defaultFeedback:
        "Endothermic (Ọrụ Na-Amịkọ Ọkụ) reactions absorb energy - the products have more energy than the reactants. Temperature of surroundings drops.",
    },
  },
  {
    id: "q-ch-8",
    type: QuestionType.MCQ,
    questionText: "Which factor does NOT affect reaction rate?",
    questionTextIgbo: "Kedu ihe na-adịghị emetụta ọsọ mmeghachi omume?",
    options: ["Temperature", "Catalyst", "Colour of reactants", "Surface area"],
    optionsIgbo: [
      "Temperature",
      "Catalyst",
      "Agba nke reactants",
      "Nnukwu elu",
    ],
    correctAnswer: "Colour of reactants",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Surface area",
          feedback:
            "Surface area DOES affect reaction rate - more surface area means more collisions possible. Colour of reactants does not affect reaction rate.",
        },
      ],
      defaultFeedback:
        "The colour of reactants does NOT affect reaction rate. Rate is affected by temperature, concentration, surface area, and catalysts (Ihe Enyemaka Ọrụ).",
    },
  },
  {
    id: "q-ch-9",
    type: QuestionType.TRUE_FALSE,
    questionText: "In oxidation, electrons are lost.",
    questionTextIgbo: "N’ime oxidation, electrons na-apụ n’aka ihe ahụ.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. OIL RIG - Oxidation Is Loss (of electrons), Reduction Is Gain (of electrons). This is the definition in redox chemistry.",
        },
      ],
      defaultFeedback:
        "Correct! OIL RIG: Oxidation Is Loss of electrons; Reduction Is Gain. In redox reactions, electrons are transferred between species.",
    },
  },
  {
    id: "q-ch-10",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What gas is produced in complete combustion of a hydrocarbon fuel?",
    questionTextIgbo:
      "Kedu gas na-apụta n’ime complete combustion nke hydrocarbon fuel?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "carbon dioxide",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "carbon monoxide",
          feedback:
            "Carbon monoxide is produced in INCOMPLETE combustion (limited oxygen). Complete combustion produces carbon dioxide (Ikuku Carbon) and water.",
        },
      ],
      defaultFeedback:
        "Complete combustion: fuel + O₂ → carbon dioxide (Ikuku Carbon) + water + energy. Incomplete combustion (limited O₂) produces CO and soot.",
    },
  },
  {
    id: "q-ch-11",
    type: QuestionType.MCQ,
    questionText:
      "Which of the following is an example of an endothermic process?",
    questionTextIgbo:
      "Kedu n’ime ihe ndị a bụ ihe atụ nke endothermic process?",
    options: [
      "Burning wood",
      "Neutralisation",
      "Photosynthesis",
      "Respiration",
    ],
    optionsIgbo: [
      "Ịkụ osisi ọkụ",
      "Neutralisation",
      "Photosynthesis",
      "Respiration",
    ],
    correctAnswer: "Photosynthesis",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Burning wood",
          feedback:
            "Burning wood is exothermic (Ọrụ Na-Ewepụta Ọkụ) - it releases heat. Photosynthesis absorbs light energy from the surroundings.",
        },
      ],
      defaultFeedback:
        "Photosynthesis (Ọrụ Anyanwụ) is endothermic (Ọrụ Na-Amịkọ Ọkụ) - it absorbs light energy from the sun to build glucose.",
    },
  },
  {
    id: "q-ch-12",
    type: QuestionType.TRUE_FALSE,
    questionText: "A larger surface area increases the rate of reaction.",
    questionTextIgbo: "Nnukwu surface area na-abawanye ọsọ mmeghachi omume.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Breaking a solid into smaller pieces increases surface area, exposing more particles to react. More surface = more collisions per second = faster reaction.",
        },
      ],
      defaultFeedback:
        "Correct! Larger surface area exposes more particles to collision. Powders react faster than lumps - e.g. powdered calcium carbonate reacts faster with acid than a large lump.",
    },
  },
  {
    id: "q-ch-13",
    type: QuestionType.MCQ,
    questionText: "In a precipitation reaction, what forms?",
    questionTextIgbo: "N’ime precipitation reaction, gịnị na-apụta?",
    options: ["A gas", "A solution", "An insoluble solid", "An acid"],
    optionsIgbo: ["Gas", "Solution", "Solid na-adịghị agbaze", "Acid"],
    correctAnswer: "An insoluble solid",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "A solution",
          feedback:
            "A precipitation reaction specifically forms an INSOLUBLE solid (precipitate) when two solutions are mixed. If it stayed dissolved, it would just be a solution.",
        },
      ],
      defaultFeedback:
        "A precipitation reaction produces an insoluble solid (precipitate) when two solutions containing certain ions are mixed - e.g. BaSO₄ forming when barium and sulfate ions meet.",
    },
  },
  {
    id: "q-ch-14",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What name is given to the minimum energy needed for a reaction to occur?",
    questionTextIgbo:
      "Kedu aha a na-akpọ ike kacha nta dị mkpa ka mmeghachi omume mee?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "activation energy",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "kinetic energy",
          feedback:
            "Kinetic energy is the energy of motion particles possess. The specific minimum energy threshold for a reaction to proceed is the activation energy (Ike Mmejupụta Ọrụ).",
        },
      ],
      defaultFeedback:
        "Activation energy (Ike Mmejupụta Ọrụ) is the minimum energy particles must have to react. Catalysts lower it; higher temperature means more particles exceed it.",
    },
  },
  {
    id: "q-ch-15",
    type: QuestionType.MCQ,
    questionText:
      "What does 'conservation of mass' mean in a chemical reaction?",
    questionTextIgbo:
      "Gịnị ka 'conservation of mass' pụtara n’ime chemical reaction?",
    options: [
      "Mass of products > mass of reactants",
      "No atoms are created or destroyed",
      "Temperature is conserved",
      "Only metals conserve mass",
    ],
    optionsIgbo: [
      "Mass nke ngwaahịa karịrị nke reactants",
      "Enweghị atom a na-emepụta ma ọ bụ na-ebibi",
      "A na-echekwa okpomọkụ",
      "Ọ bụ naanị metals na-echekwa mass",
    ],
    correctAnswer: "No atoms are created or destroyed",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Mass of products > mass of reactants",
          feedback:
            "Conservation of mass means the total mass of reactants (Ihe Na-Abanye N'Ọrụ) EQUALS the total mass of products (Ihe N'Esite N'Ọrụ) - no matter is gained or lost.",
        },
      ],
      defaultFeedback:
        "Conservation of mass: total mass of reactants (Ihe Na-Abanye N'Ọrụ) = total mass of products (Ihe N'Esite N'Ọrụ). Atoms are rearranged, not created or destroyed.",
    },
  },
  {
    id: "q-ch-16",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Higher temperature always increases the rate of a chemical reaction.",
    questionTextIgbo:
      "Okpomọkụ dị elu mgbe niile na-abawanye ọsọ mmeghachi omume kemikal.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Higher temperature gives particles more kinetic energy - more particles exceed the activation energy (Ike Mmejupụta Ọrụ), so collisions are more frequent and more successful.",
        },
      ],
      defaultFeedback:
        "Correct! Higher temperature increases reaction rate by giving particles more energy - more collisions exceed the activation energy (Ike Mmejupụta Ọrụ) per second.",
    },
  },
  {
    id: "q-ch-17",
    type: QuestionType.MCQ,
    questionText: "What is the product when an acid reacts with a metal?",
    questionTextIgbo: "Gịnị bụ ngwaahịa mgbe acid na metal meghachara?",
    options: [
      "Salt and water",
      "Salt and hydrogen gas",
      "Salt and CO₂",
      "Water and CO₂",
    ],
    optionsIgbo: [
      "Salt na water",
      "Salt na hydrogen gas",
      "Salt na CO₂",
      "Water na CO₂",
    ],
    correctAnswer: "Salt and hydrogen gas",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Salt and water",
          feedback:
            "Acid + base → salt + water (neutralisation). Acid + metal → salt + hydrogen GAS. E.g. Zn + H₂SO₄ → ZnSO₄ + H₂↑",
        },
      ],
      defaultFeedback:
        "Acid + metal → salt + hydrogen gas (H₂). E.g. zinc + hydrochloric acid → zinc chloride + hydrogen. The bubbling gas is hydrogen.",
    },
  },
  {
    id: "q-ch-18",
    type: QuestionType.MCQ,
    questionText:
      "What is the term for a reaction where one element replaces another in a compound?",
    questionTextIgbo:
      "Kedu aha a na-akpọ reaction ebe otu element dochie nke ọzọ n’ime compound?",
    options: ["Decomposition", "Synthesis", "Displacement", "Neutralisation"],
    optionsIgbo: [
      "Decomposition",
      "Synthesis",
      "Displacement",
      "Neutralisation",
    ],
    correctAnswer: "Displacement",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Decomposition",
          feedback:
            "Decomposition is AB → A + B (breaking down). Displacement is when a more reactive element pushes out a less reactive one from its compound.",
        },
      ],
      defaultFeedback:
        "Displacement reactions: a more reactive element replaces a less reactive one - e.g. iron displaces copper from copper sulfate solution.",
    },
  },
  {
    id: "q-ch-19",
    type: QuestionType.TRUE_FALSE,
    questionText: "Acids produce H⁺ ions in solution.",
    questionTextIgbo: "Acids na-emepụta H⁺ ions n’ime solution.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Acids (Ihe Mmiri Ọjọọ) are defined by their release of H⁺ ions (or protons) when dissolved in water - these are what make solutions acidic (pH < 7).",
        },
      ],
      defaultFeedback:
        "Correct! Acids (Ihe Mmiri Ọjọọ) produce H⁺ ions in solution. The more H⁺ ions, the lower the pH. Alkalis produce OH⁻ ions.",
    },
  },
  {
    id: "q-ch-20",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the name of the theory that explains why increasing concentration speeds up reactions?",
    questionTextIgbo:
      "Kedu aha theory na-akọwa ihe kpatara ịbawanye concentration ji eme ka reaction ọsọ ọsọ?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "collision theory",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "kinetic theory",
          feedback:
            "Kinetic theory explains particle motion in gases. Collision theory explains reaction rates - reactions happen when particles collide with sufficient activation energy (Ike Mmejupụta Ọrụ).",
        },
      ],
      defaultFeedback:
        "Collision theory states that reactions occur only when reactant particles collide with enough energy (≥ activation energy) and correct orientation. More collisions = faster rate.",
    },
  },
  {
    id: "q-ch-21",
    type: QuestionType.MCQ,
    questionText: "What gas is produced when acid reacts with a carbonate?",
    questionTextIgbo: "Kedu gas na-apụta mgbe acid meghachara na carbonate?",
    options: ["Hydrogen", "Oxygen", "Carbon dioxide", "Nitrogen"],
    optionsIgbo: ["Hydrogen", "Oxygen", "Carbon dioxide", "Nitrogen"],
    correctAnswer: "Carbon dioxide",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Hydrogen",
          feedback:
            "Hydrogen is produced when acid reacts with a METAL. Acid + carbonate → salt + water + carbon dioxide (Ikuku Carbon).",
        },
      ],
      defaultFeedback:
        "Acid + carbonate → salt + water + carbon dioxide (Ikuku Carbon). E.g. CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂. The CO₂ gas turns limewater milky.",
    },
  },
  {
    id: "q-ch-22",
    type: QuestionType.TRUE_FALSE,
    questionText: "An enzyme is a biological catalyst.",
    questionTextIgbo: "Enzyme bụ biological catalyst.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Enzymes (Ihe Mmezi Nri) are biological catalysts (Ihe Enyemaka Ọrụ) - proteins that speed up biochemical reactions in living organisms without being consumed.",
        },
      ],
      defaultFeedback:
        "Correct! Enzymes (Ihe Mmezi Nri) are biological catalysts - they speed up reactions in living cells by lowering activation energy (Ike Mmejupụta Ọrụ) without being used up.",
    },
  },
];

const Q_NERVOUS = [
  {
    id: "q-n-1",
    type: QuestionType.MCQ,
    questionText: "What are the three types of neurones?",
    questionTextIgbo: "Gịnị bụ ụdị neurone atọ?",
    options: [
      "Sensory, relay, motor",
      "Brain, spine, nerve",
      "Axon, dendrite, synapse",
      "Alpha, beta, gamma",
    ],
    optionsIgbo: [
      "Sensory, relay, motor",
      "Ụbụrụ, ọkpụkpụ azụ, akwara",
      "Axon, dendrite, synapse",
      "Alpha, beta, gamma",
    ],
    correctAnswer: "Sensory, relay, motor",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Axon, dendrite, synapse",
          feedback:
            "Those are parts of a neurone. The three TYPES of neurones (Mkpụrụ Ndụ Akwara) are sensory (to CNS), relay (within CNS), and motor (from CNS to effectors).",
        },
      ],
      defaultFeedback:
        "The three neurone types are: sensory (receptors → CNS), relay (within CNS), and motor (CNS → effectors like muscles or glands).",
    },
  },
  {
    id: "q-n-2",
    type: QuestionType.TRUE_FALSE,
    questionText: "A reflex action involves conscious thought in the brain.",
    questionTextIgbo: "Reflex action na-achọ echiche nke ụbụrụ.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "Reflex actions (Nzaghachi Ngwa Ngwa) bypass the conscious brain - the signal travels through the spinal cord to produce an automatic response. This makes them faster.",
        },
      ],
      defaultFeedback:
        "Reflex actions (Nzaghachi Ngwa Ngwa) are automatic and bypass the conscious brain. The pathway goes: receptor → spinal cord → effector, without waiting for brain processing.",
    },
  },
  {
    id: "q-n-3",
    type: QuestionType.MCQ,
    questionText: "What crosses the synaptic gap to transmit a signal?",
    questionTextIgbo: "Gịnị na-agafe synaptic gap iji zipu ozi?",
    options: ["Electrical impulse", "Enzyme", "Neurotransmitter", "Hormone"],
    optionsIgbo: [
      "Electrical impulse",
      "Enzyme",
      "Neurotransmitter",
      "Hormone",
    ],
    correctAnswer: "Neurotransmitter",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Electrical impulse",
          feedback:
            "Electrical impulses travel along the axon but CANNOT cross the synaptic gap (Oghere Akwara). Chemical neurotransmitters (Chemical Akwara Ozi) bridge the gap.",
        },
      ],
      defaultFeedback:
        "At a synapse (Oghere Akwara), neurotransmitters (Chemical Akwara Ozi) such as acetylcholine are released and diffuse across the gap to the next neurone.",
    },
  },
  {
    id: "q-n-4",
    type: QuestionType.MCQ,
    questionText: "What is the correct reflex arc pathway?",
    questionTextIgbo: "Kedu ụzọ reflex arc ziri ezi?",
    options: [
      "Brain → muscle → response",
      "Stimulus → receptor → sensory neurone → relay → motor neurone → effector",
      "Effector → brain → muscle",
      "Receptor → brain → effector",
    ],
    optionsIgbo: [
      "Ụbụrụ → muscle → nzaghachi",
      "Stimulus → receptor → sensory neurone → relay → motor neurone → effector",
      "Effector → ụbụrụ → muscle",
      "Receptor → ụbụrụ → effector",
    ],
    correctAnswer:
      "Stimulus → receptor → sensory neurone → relay → motor neurone → effector",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Receptor → brain → effector",
          feedback:
            "A reflex arc bypasses the brain - it goes through the spinal cord. The full path is: stimulus → receptor → sensory neurone → relay neurone (spinal cord) → motor neurone → effector.",
        },
      ],
      defaultFeedback:
        "Reflex arc: Stimulus → Receptor → Sensory neurone → Relay neurone (spinal cord) → Motor neurone → Effector → Response. The brain is NOT in this pathway.",
    },
  },
  {
    id: "q-n-5",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What part of the brain controls coordination and balance?",
    questionTextIgbo: "Kedu akụkụ ụbụrụ na-achịkwa nhazi na ịdị n’otu?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "cerebellum",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "cerebrum",
          feedback:
            "The cerebrum (Isi Ụbụrụ) controls conscious thought and voluntary movement. The cerebellum controls coordination and balance.",
        },
      ],
      defaultFeedback:
        "The cerebellum is responsible for coordination of movement and balance. It processes signals from muscles and sensory organs to fine-tune motor actions.",
    },
  },
  {
    id: "q-n-6",
    type: QuestionType.TRUE_FALSE,
    questionText: "Motor neurones carry signals FROM the CNS TO muscles.",
    questionTextIgbo: "Motor neurones na-ebuga ozi site na CNS gaa na muscle.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Motor neurones carry signals FROM the central nervous system TO effectors (muscles and glands). Sensory neurones carry signals in the opposite direction.",
        },
      ],
      defaultFeedback:
        "Correct! Motor neurones carry impulses FROM the CNS TO effectors (muscles/glands). Sensory neurones carry signals FROM receptors (Ihe Ọ Nọta Stimulus) TO the CNS.",
    },
  },
  {
    id: "q-n-7",
    type: QuestionType.MCQ,
    questionText: "What is the function of the myelin sheath?",
    questionTextIgbo: "Gịnị bụ ọrụ myelin sheath?",
    options: [
      "Produce neurotransmitters",
      "Insulate the axon and speed up impulses",
      "Store memories",
      "Connect neurones at synapses",
    ],
    optionsIgbo: [
      "Mepụta neurotransmitters",
      "Chebe axon ma mee ka impulse ọsọ ọsọ",
      "Chekwaa ncheta",
      "Jikọta neurones na synapse",
    ],
    correctAnswer: "Insulate the axon and speed up impulses",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Produce neurotransmitters",
          feedback:
            "Neurotransmitters (Chemical Akwara Ozi) are released from vesicles at synaptic terminals, not by myelin. Myelin insulates the axon (Okporo Akwara) to speed up impulse conduction.",
        },
      ],
      defaultFeedback:
        "The myelin sheath is a fatty insulating layer around the axon (Okporo Akwara). It allows impulses to jump between nodes (saltatory conduction), greatly increasing speed.",
    },
  },
  {
    id: "q-n-8",
    type: QuestionType.MCQ,
    questionText: "Which part of the brain regulates breathing and heart rate?",
    questionTextIgbo: "Kedu akụkụ ụbụrụ na-achịkwa iku ume na obi?",
    options: ["Cerebrum", "Cerebellum", "Medulla oblongata", "Hypothalamus"],
    optionsIgbo: [
      "Cerebrum",
      "Cerebellum",
      "Medulla oblongata",
      "Hypothalamus",
    ],
    correctAnswer: "Medulla oblongata",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Cerebrum",
          feedback:
            "The cerebrum (Isi Ụbụrụ) controls conscious activities. Autonomic functions like breathing rate and heart rate are controlled by the medulla oblongata.",
        },
      ],
      defaultFeedback:
        "The medulla oblongata controls automatic vital functions - breathing rate, heart rate, and blood pressure - without conscious effort.",
    },
  },
  {
    id: "q-n-9",
    type: QuestionType.TRUE_FALSE,
    questionText: "Sensory neurones carry signals from receptors to the CNS.",
    questionTextIgbo:
      "Sensory neurones na-ebuga ozi site na receptors gaa na CNS.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Sensory neurones carry impulses FROM receptors (Ihe Ọ Nọta Stimulus) TO the central nervous system (brain and spinal cord).",
        },
      ],
      defaultFeedback:
        "Correct! Sensory neurones transmit information about stimuli (Ihe Na-Akpọ Nzaghachi) from receptors to the CNS for processing.",
    },
  },
  {
    id: "q-n-10",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What is the name of the gap between two neurones?",
    questionTextIgbo: "Kedu aha oghere dị n’etiti neurones abụọ?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "synapse",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "axon",
          feedback:
            "An axon (Okporo Akwara) is the long fibre of a neurone. The gap between two neurones where chemical signalling occurs is the synapse (Oghere Akwara).",
        },
      ],
      defaultFeedback:
        "A synapse (Oghere Akwara) is the junction between two neurones. Signals cross it via chemical neurotransmitters (Chemical Akwara Ozi).",
    },
  },
  {
    id: "q-n-11",
    type: QuestionType.MCQ,
    questionText: "Which type of receptor detects changes in temperature?",
    questionTextIgbo: "Kedu ụdị receptor na-achọpụta mgbanwe okpomọkụ?",
    options: [
      "Photoreceptor",
      "Chemoreceptor",
      "Mechanoreceptor",
      "Thermoreceptor",
    ],
    optionsIgbo: [
      "Photoreceptor",
      "Chemoreceptor",
      "Mechanoreceptor",
      "Thermoreceptor",
    ],
    correctAnswer: "Thermoreceptor",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Photoreceptor",
          feedback:
            "Photoreceptors (rods and cones in the eye) detect light. Thermoreceptors detect changes in temperature (Ihe Ọ Nọta Stimulus).",
        },
      ],
      defaultFeedback:
        "Thermoreceptors detect temperature changes. They are found in the skin and hypothalamus and help maintain body temperature homeostasis.",
    },
  },
  {
    id: "q-n-12",
    type: QuestionType.TRUE_FALSE,
    questionText: "The spinal cord is part of the central nervous system.",
    questionTextIgbo: "Spinal cord bụ akụkụ nke central nervous system.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. The CNS consists of the brain and the spinal cord. All other nerves are part of the peripheral nervous system (PNS).",
        },
      ],
      defaultFeedback:
        "Correct! The CNS is made up of the brain and spinal cord. The spinal cord coordinates reflex actions (Nzaghachi Ngwa Ngwa) and relays signals between brain and body.",
    },
  },
  {
    id: "q-n-13",
    type: QuestionType.MCQ,
    questionText:
      "Which part of the nervous system controls voluntary movement?",
    questionTextIgbo:
      "Kedu akụkụ nervous system na-achịkwa mmegharị mmadụ họọrọ?",
    options: [
      "Medulla oblongata",
      "Spinal cord alone",
      "Cerebrum",
      "Hypothalamus",
    ],
    optionsIgbo: [
      "Medulla oblongata",
      "Spinal cord naanị",
      "Cerebrum",
      "Hypothalamus",
    ],
    correctAnswer: "Cerebrum",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Medulla oblongata",
          feedback:
            "The medulla controls involuntary functions like breathing. Voluntary movement - consciously chosen actions - is controlled by the cerebrum (Isi Ụbụrụ).",
        },
      ],
      defaultFeedback:
        "The cerebrum (Isi Ụbụrụ) is responsible for voluntary movement, conscious thought, memory, language, and sensory processing.",
    },
  },
  {
    id: "q-n-14",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What do effectors do in the nervous system?",
    questionTextIgbo: "Gịnị ka effectors na-eme na nervous system?",
    options: null,
    optionsIgbo: null,
    correctAnswer: "carry out responses",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "detect stimuli",
          feedback:
            "Detecting stimuli is the role of receptors (Ihe Ọ Nọta Stimulus). Effectors (muscles and glands) RESPOND to instructions from motor neurones.",
        },
      ],
      defaultFeedback:
        "Effectors carry out the body's responses to stimuli. They are muscles (which contract) or glands (which secrete hormones or other substances).",
    },
  },
  {
    id: "q-n-15",
    type: QuestionType.MCQ,
    questionText: "What is a stimulus?",
    questionTextIgbo: "Gịnị bụ stimulus?",
    options: [
      "A response by the body",
      "A type of neurone",
      "A change in the environment detected by receptors",
      "A brain chemical",
    ],
    optionsIgbo: [
      "Nzaghachi nke ahụ",
      "Ụdị neurone",
      "Mgbanwe n’ebe gbara gburugburu nke receptors na-achọpụta",
      "Kemikal nke ụbụrụ",
    ],
    correctAnswer: "A change in the environment detected by receptors",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "A response by the body",
          feedback:
            "A response is what the body DOES in reaction. A stimulus (Ihe Na-Akpọ Nzaghachi) is the environmental change that is DETECTED and triggers the response.",
        },
      ],
      defaultFeedback:
        "A stimulus (Ihe Na-Akpọ Nzaghachi) is a change in the internal or external environment detected by receptors (Ihe Ọ Nọta Stimulus) - e.g. light, heat, sound, pain.",
    },
  },
  {
    id: "q-n-16",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Neurotransmitters are broken down or reabsorbed after crossing the synapse.",
    questionTextIgbo:
      "A na-ebibi ma ọ bụ na-eweghachi neurotransmitters mgbe ha gafere synapse.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. After neurotransmitters (Chemical Akwara Ozi) bind to receptors and trigger a new impulse, they are rapidly broken down by enzymes or reabsorbed to prevent continuous stimulation.",
        },
      ],
      defaultFeedback:
        "Correct! Neurotransmitters (Chemical Akwara Ozi) are quickly broken down or reabsorbed after transmission. This resets the synapse (Oghere Akwara) for the next signal.",
    },
  },
  {
    id: "q-n-17",
    type: QuestionType.MCQ,
    questionText:
      "The hypothalamus links the nervous system to which other system?",
    questionTextIgbo:
      "Hypothalamus na-ejikọta nervous system na sistemu ọzọ nke gịnị?",
    options: [
      "Digestive system",
      "Circulatory system",
      "Endocrine (hormonal) system",
      "Immune system",
    ],
    optionsIgbo: [
      "Digestive system",
      "Circulatory system",
      "Endocrine system",
      "Immune system",
    ],
    correctAnswer: "Endocrine (hormonal) system",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Circulatory system",
          feedback:
            "The hypothalamus monitors blood temperature and composition, but it links the nervous system to the ENDOCRINE system via the pituitary gland.",
        },
      ],
      defaultFeedback:
        "The hypothalamus bridges the nervous and endocrine (hormonal) systems. It controls the pituitary gland, which releases hormones regulating temperature, hunger, and reproduction.",
    },
  },
  {
    id: "q-n-18",
    type: QuestionType.MCQ,
    questionText: "What is the role of dendrites in a neurone?",
    questionTextIgbo: "Gịnị bụ ọrụ dendrites n’ime neurone?",
    options: [
      "Transmit impulses away from cell body",
      "Receive signals from other neurones",
      "Produce neurotransmitters",
      "Insulate the neurone",
    ],
    optionsIgbo: [
      "Zipu impulses pụọ na cell body",
      "Nata ozi site na neurones ndị ọzọ",
      "Mepụta neurotransmitters",
      "Chebe neurone",
    ],
    correctAnswer: "Receive signals from other neurones",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Transmit impulses away from cell body",
          feedback:
            "The axon (Okporo Akwara) transmits impulses AWAY from the cell body. Dendrites receive incoming signals from other neurones.",
        },
      ],
      defaultFeedback:
        "Dendrites are branched extensions of the neurone that receive incoming signals from other neurones or receptors and relay them toward the cell body.",
    },
  },
  {
    id: "q-n-19",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Drugs that mimic neurotransmitters can affect nervous system function.",
    questionTextIgbo:
      "Drugs na-eme ka neurotransmitters dị ka ha nwere ike imetụta nervous system.",
    options: ["True", "False"],
    optionsIgbo: ["Eziokwu", "Ụgha"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Many drugs work by mimicking or blocking neurotransmitters (Chemical Akwara Ozi) at synapses (Oghere Akwara) - e.g. antidepressants block serotonin reuptake; anaesthetics block nerve signals.",
        },
      ],
      defaultFeedback:
        "Correct! Drugs can mimic, enhance, or block neurotransmitters (Chemical Akwara Ozi) at synapses (Oghere Akwara), altering how the nervous system functions.",
    },
  },
  {
    id: "q-n-20",
    type: QuestionType.MCQ,
    questionText:
      "Which brain region is associated with conscious thought and memory?",
    questionTextIgbo: "Kedu akụkụ ụbụrụ metụtara echiche na ncheta?",
    options: ["Cerebellum", "Medulla oblongata", "Cerebrum", "Hypothalamus"],
    optionsIgbo: [
      "Cerebellum",
      "Medulla oblongata",
      "Cerebrum",
      "Hypothalamus",
    ],
    correctAnswer: "Cerebrum",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Cerebellum",
          feedback:
            "The cerebellum coordinates movement and balance. Conscious thought, memory, and learning are functions of the cerebrum (Isi Ụbụrụ) - the largest brain region.",
        },
      ],
      defaultFeedback:
        "The cerebrum (Isi Ụbụrụ) is the seat of conscious thought, learning, memory, language, and voluntary movement - the most complex region of the brain.",
    },
  },
];

// ═══════════════════════════════════════════════════════════════════
// BOOT - wire seedExtraTopics into the main flow
// ═══════════════════════════════════════════════════════════════════

main()
  .then(() => seedExtraTopics())
  .then(() => {
    console.log("✅ All extra topics seeded (topics 9-15)");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
