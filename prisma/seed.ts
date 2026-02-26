// prisma/seed.ts
import "dotenv/config";
import { PrismaClient, QuestionType } from "@prisma/client";
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
    update: { role: "ADMIN" },
    create: {
      name: "Admin User",
      email: "admin@cal.edu",
      password: hashedAdmin,
      role: "ADMIN",
    },
  });
  await prisma.user.upsert({
    where: { email: "learner@cal.edu" },
    update: {},
    create: {
      name: "Ada Okonkwo",
      email: "learner@cal.edu",
      password: hashedLearner,
      role: "LEARNER",
    },
  });

  await seedTopic({
    id: "topic-photosynthesis",
    title: "Photosynthesis",
    description:
      "Learn how plants make their own food using sunlight, water, and carbon dioxide.",
    duration: "20 mins",
    order: 1,
    lessonId: "lesson-photo-1",
    lessonContent: LESSON_PHOTOSYNTHESIS,
    keyTerms: KT_PHOTOSYNTHESIS,
    questions: Q_PHOTOSYNTHESIS,
  });
  await seedTopic({
    id: "topic-cell-structure",
    title: "Cell Structure",
    description:
      "Explore the building blocks of life and understand the role of each organelle.",
    duration: "25 mins",
    order: 2,
    lessonId: "lesson-cell-1",
    lessonContent: LESSON_CELL_STRUCTURE,
    keyTerms: KT_CELL_STRUCTURE,
    questions: Q_CELL_STRUCTURE,
  });
  await seedTopic({
    id: "topic-digestion",
    title: "Human Digestive System",
    description:
      "Trace the journey of food through the human body and understand how nutrients are absorbed.",
    duration: "30 mins",
    order: 3,
    lessonId: "lesson-digestion-1",
    lessonContent: LESSON_DIGESTION,
    keyTerms: KT_DIGESTION,
    questions: Q_DIGESTION,
  });
  await seedTopic({
    id: "topic-ecosystems",
    title: "Ecosystems and Food Chains",
    description:
      "Understand how living things interact with each other and their environment.",
    duration: "25 mins",
    order: 4,
    lessonId: "lesson-eco-1",
    lessonContent: LESSON_ECOSYSTEMS,
    keyTerms: KT_ECOSYSTEMS,
    questions: Q_ECOSYSTEMS,
  });
  await seedTopic({
    id: "topic-reproduction",
    title: "Human Reproductive System",
    description:
      "Learn about the organs and processes involved in human reproduction and development.",
    duration: "30 mins",
    order: 5,
    lessonId: "lesson-repro-1",
    lessonContent: LESSON_REPRODUCTION,
    keyTerms: KT_REPRODUCTION,
    questions: Q_REPRODUCTION,
  });
  await seedTopic({
    id: "topic-states-matter",
    title: "States of Matter",
    description:
      "Discover the properties of solids, liquids, and gases and how matter changes between states.",
    duration: "20 mins",
    order: 6,
    lessonId: "lesson-matter-1",
    lessonContent: LESSON_STATES_OF_MATTER,
    keyTerms: KT_STATES_OF_MATTER,
    questions: Q_STATES_OF_MATTER,
  });
  await seedTopic({
    id: "topic-electricity",
    title: "Electricity and Circuits",
    description:
      "Understand electric current, voltage, resistance, and how to build simple circuits.",
    duration: "30 mins",
    order: 7,
    lessonId: "lesson-elec-1",
    lessonContent: LESSON_ELECTRICITY,
    keyTerms: KT_ELECTRICITY,
    questions: Q_ELECTRICITY,
  });
  await seedTopic({
    id: "topic-genetics",
    title: "Genetics and Heredity",
    description:
      "Explore how traits are inherited from parents to offspring through genes and chromosomes.",
    duration: "35 mins",
    order: 8,
    lessonId: "lesson-gen-1",
    lessonContent: LESSON_GENETICS,
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
  description: string;
  duration: string;
  order: number;
  lessonId: string;
  lessonContent: string;
  keyTerms: {
    id: string;
    englishTerm: string;
    igboTerm: string;
    igboExplanation: string;
  }[];
  questions: {
    id: string;
    type: QuestionType;
    questionText: string;
    options: string[] | null;
    correctAnswer: string;
    feedbackRules: object;
  }[];
}) {
  const topic = await prisma.topic.upsert({
    where: { id: opts.id },
    update: { published: true },
    create: {
      id: opts.id,
      title: opts.title,
      description: opts.description,
      duration: opts.duration,
      order: opts.order,
      published: true,
    },
  });
  await prisma.lesson.upsert({
    where: { id: opts.lessonId },
    update: { content: opts.lessonContent },
    create: {
      id: opts.lessonId,
      topicId: topic.id,
      order: 1,
      content: opts.lessonContent,
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
      create: { ...t, topicId: topic.id },
    });
  }
  for (const q of opts.questions) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {
        type: q.type,
        questionText: q.questionText,
        options: q.options ?? [],
        correctAnswer: q.correctAnswer,
        feedbackRules: q.feedbackRules,
      },
      create: {
        ...q,
        topicId: topic.id,
        options: q.options === null ? undefined : q.options,
      },
    });
  }
}

// ═══════════════════════════════════════════════════════════════════
// LESSON CONTENT
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

const LESSON_ECOSYSTEMS = `## Ecosystems and Food Chains

An **ecosystem** is a community of living organisms interacting with each other and their non-living environment.

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
    questionText: "Where does photosynthesis primarily take place in a plant?",
    options: ["Mitochondria", "Nucleus", "Chloroplast", "Cell Wall"],
    correctAnswer: "Chloroplast",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Mitochondria",
          feedback:
            "Mitochondria (Ụlọ Ike Ndụ) produces energy through respiration, not photosynthesis. Photosynthesis happens in the chloroplast (Ụlọ Mgbara Osisi).",
        },
        {
          pattern: "Nucleus",
          feedback:
            "The nucleus controls the cell. Photosynthesis occurs in the chloroplast (Ụlọ Mgbara Osisi).",
        },
      ],
      defaultFeedback:
        "Photosynthesis takes place in the chloroplast (Ụlọ Mgbara Osisi), which contains chlorophyll (Mgbara Ndụ Osisi).",
    },
  },
  {
    id: "q-p-2",
    type: QuestionType.TRUE_FALSE,
    questionText: "Photosynthesis produces carbon dioxide as its main output.",
    options: ["True", "False"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "Plants take IN carbon dioxide (Ikuku Carbon) and release oxygen (Ikuku Ndụ) and glucose (Shuga Osisi).",
        },
      ],
      defaultFeedback:
        "Photosynthesis outputs are oxygen (Ikuku Ndụ) and glucose (Shuga Osisi). Carbon dioxide is an INPUT.",
    },
  },
  {
    id: "q-p-3",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "Name the green pigment that absorbs light energy for photosynthesis.",
    options: null,
    correctAnswer: "chlorophyll",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "chloroplast",
          feedback:
            "Chloroplast (Ụlọ Mgbara Osisi) is the organelle. The green pigment inside it is chlorophyll (Mgbara Ndụ Osisi).",
        },
      ],
      defaultFeedback:
        "The answer is chlorophyll (Mgbara Ndụ Osisi), found inside chloroplasts.",
    },
  },
  {
    id: "q-p-4",
    type: QuestionType.MCQ,
    questionText: "Which gas is absorbed by plants during photosynthesis?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctAnswer: "Carbon Dioxide",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Oxygen",
          feedback:
            "Oxygen (Ikuku Ndụ) is released during photosynthesis. Plants absorb carbon dioxide (Ikuku Carbon).",
        },
      ],
      defaultFeedback:
        "Plants absorb carbon dioxide (Ikuku Carbon - CO₂) through their stomata (Ọnụ Ọgụgọ Osisi).",
    },
  },
  {
    id: "q-p-5",
    type: QuestionType.MCQ,
    questionText:
      "Which of the following is a raw material (input) for photosynthesis?",
    options: ["Oxygen", "Glucose", "Water", "Starch"],
    correctAnswer: "Water",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Oxygen",
          feedback:
            "Oxygen (Ikuku Ndụ) is a product of photosynthesis, not a raw material.",
        },
        {
          pattern: "Glucose",
          feedback:
            "Glucose (Shuga Osisi) is produced by photosynthesis - it is an output.",
        },
      ],
      defaultFeedback:
        "The raw materials are water (H₂O) from roots and carbon dioxide (Ikuku Carbon) from air.",
    },
  },
  {
    id: "q-p-6",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Photosynthesis can occur in total darkness if water and CO₂ are present.",
    options: ["True", "False"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "Light energy is essential - it powers the splitting of water molecules. Without light, photosynthesis cannot proceed.",
        },
      ],
      defaultFeedback:
        "Light is a required input for photosynthesis: CO₂ + H₂O + LIGHT → glucose + oxygen.",
    },
  },
  {
    id: "q-p-7",
    type: QuestionType.MCQ,
    questionText:
      "In which part of the chloroplast does the Calvin Cycle take place?",
    options: ["Thylakoid", "Stroma", "Outer membrane", "Vacuole"],
    correctAnswer: "Stroma",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Thylakoid",
          feedback:
            "The thylakoid membranes are the site of LIGHT-DEPENDENT reactions. The Calvin Cycle occurs in the stroma.",
        },
      ],
      defaultFeedback:
        "The Calvin Cycle takes place in the stroma - the fluid inside the chloroplast.",
    },
  },
  {
    id: "q-p-8",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What are the tiny pores on the underside of leaves through which CO₂ enters?",
    options: null,
    correctAnswer: "stomata",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "roots",
          feedback:
            "Roots absorb water. CO₂ enters through stomata (Ọnụ Ọgụgọ Osisi) in the leaves.",
        },
      ],
      defaultFeedback:
        "The pores are called stomata (Ọnụ Ọgụgọ Osisi), controlled by guard cells.",
    },
  },
  {
    id: "q-p-9",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Plants only photosynthesise during the day but respire both day and night.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "This is true. Photosynthesis needs light; it only occurs by day. Respiration is continuous.",
        },
      ],
      defaultFeedback:
        "Correct! Photosynthesis requires light and occurs only during daylight. Respiration occurs 24 hours a day.",
    },
  },
  {
    id: "q-p-10",
    type: QuestionType.MCQ,
    questionText:
      "What is the main product of the light-dependent reactions of photosynthesis?",
    options: ["Glucose", "Starch", "ATP and NADPH", "Oxygen only"],
    correctAnswer: "ATP and NADPH",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Glucose",
          feedback:
            "Glucose is made in the light-INDEPENDENT reactions (Calvin Cycle). The light-dependent reactions produce ATP and NADPH.",
        },
        {
          pattern: "Oxygen only",
          feedback:
            "Oxygen is released as a byproduct, but the main useful products of the light-dependent reactions are the energy carriers ATP and NADPH.",
        },
      ],
      defaultFeedback:
        "The light-dependent reactions produce ATP and NADPH - energy carriers used to power the Calvin Cycle to make glucose.",
    },
  },
  {
    id: "q-p-11",
    type: QuestionType.MCQ,
    questionText:
      "How does increasing light intensity affect the rate of photosynthesis initially?",
    options: ["Decreases it", "Has no effect", "Increases it", "Stops it"],
    correctAnswer: "Increases it",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Decreases it",
          feedback:
            "More light means more energy available to drive the reaction. Increasing light intensity increases the rate of photosynthesis (Ọrụ Anyanwụ) until another factor limits it.",
        },
      ],
      defaultFeedback:
        "Increasing light intensity increases the rate of photosynthesis (Ọrụ Anyanwụ) up to a saturation point - beyond that, CO₂ or temperature becomes limiting.",
    },
  },
  {
    id: "q-p-12",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Starch is stored in plant cells as a direct result of photosynthesis.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "This is true. Glucose (Shuga Osisi) produced in photosynthesis is converted to starch for storage in leaves, roots, and seeds.",
        },
      ],
      defaultFeedback:
        "Correct! Glucose (Shuga Osisi) from photosynthesis is converted to insoluble starch for storage - it can later be converted back to glucose when energy is needed.",
    },
  },
  {
    id: "q-p-13",
    type: QuestionType.MCQ,
    questionText: "What is the correct overall equation for photosynthesis?",
    options: [
      "CO₂ + H₂O → C₆H₁₂O₆ + O₂",
      "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂",
      "C₆H₁₂O₆ + O₂ → CO₂ + H₂O",
      "6O₂ + light → 6CO₂ + 6H₂O",
    ],
    correctAnswer: "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "C₆H₁₂O₆ + O₂ → CO₂ + H₂O",
          feedback:
            "That is the equation for respiration - the reverse process. Photosynthesis (Ọrụ Anyanwụ) uses CO₂ and water to make glucose.",
        },
      ],
      defaultFeedback:
        "The balanced equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Six CO₂ and six water molecules produce one glucose and six oxygen molecules.",
    },
  },
  {
    id: "q-p-14",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "Which substance carries hydrogen atoms from the light-dependent reactions to the Calvin Cycle?",
    options: null,
    correctAnswer: "NADPH",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "ATP",
          feedback:
            "ATP carries energy, not hydrogen. NADPH is the hydrogen carrier that delivers reducing power to the Calvin Cycle.",
        },
      ],
      defaultFeedback:
        "NADPH is the hydrogen carrier produced in the light-dependent reactions and used in the Calvin Cycle to reduce CO₂ to glucose (Shuga Osisi).",
    },
  },
  {
    id: "q-p-15",
    type: QuestionType.MCQ,
    questionText: "Which factor would NOT limit the rate of photosynthesis?",
    options: [
      "Low CO₂",
      "High oxygen concentration",
      "Low temperature",
      "Low light intensity",
    ],
    correctAnswer: "High oxygen concentration",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Low CO₂",
          feedback:
            "Low CO₂ is a classic limiting factor - less carbon dioxide means less raw material for the Calvin Cycle, slowing photosynthesis (Ọrụ Anyanwụ).",
        },
        {
          pattern: "Low temperature",
          feedback:
            "Low temperature reduces enzyme activity (chlorophyll-related enzymes), which slows photosynthesis (Ọrụ Anyanwụ).",
        },
      ],
      defaultFeedback:
        "High oxygen concentration does NOT limit photosynthesis (Ọrụ Anyanwụ). The main limiting factors are light intensity, CO₂ concentration, and temperature.",
    },
  },
  {
    id: "q-p-16",
    type: QuestionType.TRUE_FALSE,
    questionText: "Algae can also carry out photosynthesis.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "Algae contain chlorophyll and carry out photosynthesis (Ọrụ Anyanwụ) just like plants. In fact, algae produce a significant portion of Earth's oxygen.",
        },
      ],
      defaultFeedback:
        "Correct! Algae, like plants, contain chlorophyll (Mgbara Ndụ Osisi) and carry out photosynthesis. They are responsible for a large proportion of Earth's oxygen production.",
    },
  },
  {
    id: "q-p-17",
    type: QuestionType.MCQ,
    questionText: "Where is water absorbed for use in photosynthesis?",
    options: ["Leaves", "Stem", "Roots", "Flowers"],
    correctAnswer: "Roots",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Leaves",
          feedback:
            "Leaves absorb light and take in CO₂ through stomata (Ọnụ Ọgụgọ Osisi). Water is absorbed from the soil through root hair cells.",
        },
      ],
      defaultFeedback:
        "Water (H₂O) is absorbed from the soil through the roots - specifically root hair cells - and transported up to the leaves for photosynthesis (Ọrụ Anyanwụ).",
    },
  },
  {
    id: "q-p-18",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What do guard cells control?",
    options: null,
    correctAnswer: "stomata",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "water",
          feedback:
            "Guard cells do regulate water loss indirectly, but their specific function is to open and close stomata (Ọnụ Ọgụgọ Osisi).",
        },
      ],
      defaultFeedback:
        "Guard cells control the opening and closing of stomata (Ọnụ Ọgụgọ Osisi). When guard cells are full of water, stomata open; when dehydrated, they close.",
    },
  },
  {
    id: "q-p-19",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "The rate of photosynthesis increases indefinitely as temperature rises.",
    options: ["True", "False"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "Beyond an optimal temperature (about 30–35°C), enzymes involved in photosynthesis (Ọrụ Anyanwụ) begin to denature and the rate falls sharply.",
        },
      ],
      defaultFeedback:
        "False - above the optimum temperature, enzymes are denatured and the rate of photosynthesis (Ọrụ Anyanwụ) drops. Temperature is a limiting factor only within a range.",
    },
  },
  {
    id: "q-p-20",
    type: QuestionType.MCQ,
    questionText:
      "Which wavelengths of light does chlorophyll absorb most effectively?",
    options: [
      "Green and yellow",
      "Red and blue",
      "Ultraviolet and infrared",
      "Orange and violet",
    ],
    correctAnswer: "Red and blue",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Green and yellow",
          feedback:
            "Green and yellow light is mostly REFLECTED by chlorophyll - that is why plants look green! Chlorophyll (Mgbara Ndụ Osisi) absorbs red and blue light.",
        },
      ],
      defaultFeedback:
        "Chlorophyll (Mgbara Ndụ Osisi) absorbs red and blue light most efficiently for photosynthesis. Green light is reflected, which is why plants appear green.",
    },
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
    options: ["Mitochondria", "Nucleus", "Cell Membrane", "Vacuole"],
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
  },
  {
    id: "q-c-2",
    type: QuestionType.TRUE_FALSE,
    questionText: "Both plant and animal cells have a cell wall.",
    options: ["True", "False"],
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
  },
  {
    id: "q-c-3",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the jelly-like fluid that fills the cell and surrounds the organelles?",
    options: null,
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
  },
  {
    id: "q-c-4",
    type: QuestionType.MCQ,
    questionText: "Which organelle is the site of protein synthesis?",
    options: ["Mitochondria", "Ribosome", "Golgi apparatus", "Vacuole"],
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
  },
  {
    id: "q-c-5",
    type: QuestionType.MCQ,
    questionText: "What is the function of mitochondria?",
    options: [
      "Produce proteins",
      "Store water",
      "Produce energy (ATP)",
      "Control cell division",
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
  },
  {
    id: "q-c-6",
    type: QuestionType.TRUE_FALSE,
    questionText: "The cell membrane is selectively permeable.",
    options: ["True", "False"],
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
  },
  {
    id: "q-c-7",
    type: QuestionType.MCQ,
    questionText: "Which organelle is found ONLY in plant cells?",
    options: ["Mitochondria", "Nucleus", "Ribosome", "Chloroplast"],
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
  },
  {
    id: "q-c-8",
    type: QuestionType.SHORT_ANSWER,
    questionText: "How many chromosomes does a normal human body cell contain?",
    options: null,
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
  },
  {
    id: "q-c-9",
    type: QuestionType.MCQ,
    questionText:
      "What is the role of the large central vacuole in plant cells?",
    options: [
      "Photosynthesis",
      "Protein synthesis",
      "Maintain shape and store cell sap",
      "Energy production",
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
  },
  {
    id: "q-c-10",
    type: QuestionType.TRUE_FALSE,
    questionText: "Mature red blood cells have no nucleus.",
    options: ["True", "False"],
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
  },
  {
    id: "q-c-11",
    type: QuestionType.MCQ,
    questionText: "What is the cell wall in plant cells made of?",
    options: ["Protein", "Lipid", "Starch", "Cellulose"],
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
  },
  {
    id: "q-c-12",
    type: QuestionType.TRUE_FALSE,
    questionText: "All living cells contain DNA.",
    options: ["True", "False"],
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
  },
  {
    id: "q-c-13",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What name is given to the long extension of a nerve cell that transmits electrical signals?",
    options: null,
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
  },
  {
    id: "q-c-14",
    type: QuestionType.MCQ,
    questionText:
      "Which cell type has a large surface area to absorb water and minerals from the soil?",
    options: ["Nerve cell", "Red blood cell", "Root hair cell", "Sperm cell"],
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
  },
  {
    id: "q-c-15",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "The smooth endoplasmic reticulum has ribosomes on its surface.",
    options: ["True", "False"],
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
  },
  {
    id: "q-c-16",
    type: QuestionType.MCQ,
    questionText: "What does the Golgi apparatus do?",
    options: [
      "Produce energy",
      "Package and dispatch proteins",
      "Carry out photosynthesis",
      "Store genetic information",
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
  },
  {
    id: "q-c-17",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What type of cell surrounds the stomates (stomata) in plant leaves?",
    options: null,
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
  },
  {
    id: "q-c-18",
    type: QuestionType.TRUE_FALSE,
    questionText: "Prokaryotic cells (like bacteria) do not have a nucleus.",
    options: ["True", "False"],
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
  },
  {
    id: "q-c-19",
    type: QuestionType.MCQ,
    questionText: "Which structure is found in both plant and animal cells?",
    options: ["Cell wall", "Chloroplast", "Mitochondria", "Central vacuole"],
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
  },
  {
    id: "q-c-20",
    type: QuestionType.MCQ,
    questionText:
      "What is the term for cells that are genetically identical and have a specific function?",
    options: ["Stem cells", "Specialised cells", "Prokaryotes", "Gametes"],
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
  },
];

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS - DIGESTION (22)
// ═══════════════════════════════════════════════════════════════════

const Q_DIGESTION = [
  {
    id: "q-d-1",
    type: QuestionType.MCQ,
    questionText: "Where does chemical digestion of starch begin?",
    options: ["Stomach", "Small intestine", "Mouth", "Large intestine"],
    correctAnswer: "Mouth",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Stomach",
          feedback:
            "The stomach (Afo) digests proteins, not starch. Starch digestion begins in the mouth with salivary amylase (Ihe Mmezi Ụkwa).",
        },
      ],
      defaultFeedback:
        "Starch digestion begins in the mouth. Saliva contains amylase (Ihe Mmezi Ụkwa) which breaks starch into maltose.",
    },
  },
  {
    id: "q-d-2",
    type: QuestionType.MCQ,
    questionText: "What is the role of bile in digestion?",
    options: [
      "Digest proteins",
      "Kill bacteria",
      "Emulsify fats",
      "Absorb glucose",
    ],
    correctAnswer: "Emulsify fats",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Kill bacteria",
          feedback:
            "Hydrochloric acid kills bacteria. Bile (Mmiri Ọjị Imebi Abuba) emulsifies fats, increasing surface area for lipase.",
        },
      ],
      defaultFeedback:
        "Bile (Mmiri Ọjị Imebi Abuba) emulsifies fats - breaking large fat droplets into smaller ones for lipase to digest.",
    },
  },
  {
    id: "q-d-3",
    type: QuestionType.TRUE_FALSE,
    questionText: "Peristalsis moves food along the digestive tract.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Peristalsis (Mgbachi Ngọngọ Ihe Oriri) is the wave-like muscle contractions that push food through the digestive tract.",
        },
      ],
      defaultFeedback:
        "Correct! Peristalsis (Mgbachi Ngọngọ Ihe Oriri) is rhythmic muscle contractions that propel food in one direction.",
    },
  },
  {
    id: "q-d-4",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What is the enzyme that digests proteins in the stomach?",
    options: null,
    correctAnswer: "pepsin",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "amylase",
          feedback:
            "Amylase (Ihe Mmezi Ụkwa) digests starch, not proteins. The protein-digesting enzyme in the stomach (Afo) is pepsin.",
        },
      ],
      defaultFeedback:
        "Pepsin is the protease enzyme in the stomach (Afo). It breaks proteins into shorter peptide chains in the acidic environment.",
    },
  },
  {
    id: "q-d-5",
    type: QuestionType.MCQ,
    questionText: "What is the main site of nutrient absorption?",
    options: ["Stomach", "Large intestine", "Small intestine", "Oesophagus"],
    correctAnswer: "Small intestine",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Stomach",
          feedback:
            "The stomach (Afo) digests but absorbs very little. The small intestine (Afọ Obere) is the main absorption site.",
        },
        {
          pattern: "Large intestine",
          feedback:
            "The large intestine absorbs mainly water. Most nutrients are absorbed in the small intestine (Afọ Obere).",
        },
      ],
      defaultFeedback:
        "The small intestine (Afọ Obere) is the main absorption site. Its villi (Mkpọrọgwụ Afọ Obere) create a vast surface area.",
    },
  },
  {
    id: "q-d-6",
    type: QuestionType.MCQ,
    questionText: "Which organ produces bile?",
    options: ["Pancreas", "Stomach", "Liver", "Gallbladder"],
    correctAnswer: "Liver",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Gallbladder",
          feedback:
            "The gallbladder STORES bile. The liver PRODUCES bile (Mmiri Ọjị Imebi Abuba).",
        },
        {
          pattern: "Pancreas",
          feedback:
            "The pancreas produces digestive enzymes. Bile (Mmiri Ọjị Imebi Abuba) is produced by the liver.",
        },
      ],
      defaultFeedback:
        "The liver produces bile (Mmiri Ọjị Imebi Abuba). It is stored in the gallbladder and released into the duodenum when fatty food arrives.",
    },
  },
  {
    id: "q-d-7",
    type: QuestionType.TRUE_FALSE,
    questionText: "The large intestine's main role is to digest carbohydrates.",
    options: ["True", "False"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "Carbohydrate digestion happens in the mouth and small intestine. The large intestine absorbs water from waste.",
        },
      ],
      defaultFeedback:
        "The large intestine primarily absorbs water. Carbohydrate digestion occurs in the mouth and small intestine (Afọ Obere).",
    },
  },
  {
    id: "q-d-8",
    type: QuestionType.MCQ,
    questionText: "What does lipase break down?",
    options: ["Carbohydrates", "Proteins", "Fats", "Vitamins"],
    correctAnswer: "Fats",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Carbohydrates",
          feedback:
            "Carbohydrates are broken down by amylase (Ihe Mmezi Ụkwa). Lipase breaks down fats into fatty acids and glycerol.",
        },
        {
          pattern: "Proteins",
          feedback:
            "Proteins are broken down by proteases. Lipase digests fats (lipids) into fatty acids and glycerol.",
        },
      ],
      defaultFeedback:
        "Lipase breaks down fats (lipids) into fatty acids and glycerol, mainly in the small intestine (Afọ Obere).",
    },
  },
  {
    id: "q-d-9",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What finger-like projections line the small intestine wall to increase absorption surface area?",
    options: null,
    correctAnswer: "villi",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "microvilli",
          feedback:
            "Microvilli are even smaller projections on top of villi. The larger projections themselves are called villi (Mkpọrọgwụ Afọ Obere).",
        },
      ],
      defaultFeedback:
        "Villi (Mkpọrọgwụ Afọ Obere) are finger-like projections. Each is covered in microvilli - together they create an enormous absorption surface area.",
    },
  },
  {
    id: "q-d-10",
    type: QuestionType.TRUE_FALSE,
    questionText: "The stomach produces hydrochloric acid.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. The stomach (Afo) secretes hydrochloric acid (pH ≈ 2), which kills bacteria and activates pepsin for protein digestion.",
        },
      ],
      defaultFeedback:
        "Correct! The stomach (Afo) secretes hydrochloric acid, creating the acidic environment needed for pepsin to digest proteins.",
    },
  },
  {
    id: "q-d-11",
    type: QuestionType.MCQ,
    questionText: "What are the products of fat digestion?",
    options: [
      "Glucose and water",
      "Amino acids",
      "Fatty acids and glycerol",
      "Maltose and fructose",
    ],
    correctAnswer: "Fatty acids and glycerol",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Glucose and water",
          feedback:
            "Glucose comes from carbohydrate digestion. Fat (lipid) digestion by lipase produces fatty acids and glycerol.",
        },
      ],
      defaultFeedback:
        "Lipase breaks fats into fatty acids and glycerol, which are absorbed through the walls of the small intestine (Afọ Obere).",
    },
  },
  {
    id: "q-d-12",
    type: QuestionType.MCQ,
    questionText: "Which of the following is mechanical digestion?",
    options: [
      "Enzymes breaking down food",
      "Chewing food into smaller pieces",
      "Absorbing nutrients into blood",
      "Bile emulsifying fat",
    ],
    correctAnswer: "Chewing food into smaller pieces",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Enzymes breaking down food",
          feedback:
            "Enzyme action is CHEMICAL digestion. Mechanical digestion is physical - chewing and churning.",
        },
      ],
      defaultFeedback:
        "Mechanical digestion is the physical breakdown of food (chewing, churning). It increases surface area for enzymes (Ihe Mmezi Nri) to act on.",
    },
  },
  {
    id: "q-d-13",
    type: QuestionType.SHORT_ANSWER,
    questionText: "Which enzyme in saliva begins the digestion of starch?",
    options: null,
    correctAnswer: "amylase",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "pepsin",
          feedback:
            "Pepsin is in the stomach and digests proteins. Saliva contains amylase (Ihe Mmezi Ụkwa) which digests starch.",
        },
      ],
      defaultFeedback:
        "Salivary amylase (Ihe Mmezi Ụkwa) in saliva begins the digestion of starch, breaking it into maltose.",
    },
  },
  {
    id: "q-d-14",
    type: QuestionType.TRUE_FALSE,
    questionText: "The pancreas produces both digestive enzymes and hormones.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True! The pancreas has two roles: it produces digestive enzymes (amylase, lipase, protease) and it produces hormones like insulin and glucagon to regulate blood sugar.",
        },
      ],
      defaultFeedback:
        "Correct! The pancreas produces digestive enzymes (amylase, lipase, protease) that enter the small intestine (Afọ Obere), and hormones like insulin for blood sugar control.",
    },
  },
  {
    id: "q-d-15",
    type: QuestionType.MCQ,
    questionText: "What is the pH of the stomach?",
    options: [
      "7 (neutral)",
      "10 (alkaline)",
      "2 (acidic)",
      "5 (slightly acidic)",
    ],
    correctAnswer: "2 (acidic)",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "7 (neutral)",
          feedback:
            "pH 7 is neutral. The stomach (Afo) is highly acidic - around pH 2 - due to hydrochloric acid secretion.",
        },
      ],
      defaultFeedback:
        "The stomach (Afo) has a pH of approximately 2 - strongly acidic due to hydrochloric acid. This kills bacteria and activates pepsin.",
    },
  },
  {
    id: "q-d-16",
    type: QuestionType.MCQ,
    questionText:
      "Where is bile stored before being released into the small intestine?",
    options: ["Liver", "Pancreas", "Gallbladder", "Stomach"],
    correctAnswer: "Gallbladder",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Liver",
          feedback:
            "The liver PRODUCES bile. It is then stored in the gallbladder until fat-containing food arrives in the duodenum.",
        },
      ],
      defaultFeedback:
        "Bile (Mmiri Ọjị Imebi Abuba) is stored in the gallbladder. When fatty food enters the duodenum, the gallbladder releases bile into the small intestine (Afọ Obere).",
    },
  },
  {
    id: "q-d-17",
    type: QuestionType.TRUE_FALSE,
    questionText: "Absorption of water mainly occurs in the small intestine.",
    options: ["True", "False"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "Water is mainly absorbed in the LARGE intestine, not the small intestine. The small intestine (Afọ Obere) absorbs nutrients like glucose and amino acids.",
        },
      ],
      defaultFeedback:
        "Water is mainly absorbed in the LARGE intestine. The small intestine (Afọ Obere) is the main site for absorbing digested nutrients.",
    },
  },
  {
    id: "q-d-18",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What term describes the transport of digested nutrients from the small intestine into the bloodstream?",
    options: null,
    correctAnswer: "absorption",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "digestion",
          feedback:
            "Digestion (Ịgbaze Nri) is the breaking down of food. Once food is small enough to enter the blood, the process is absorption.",
        },
      ],
      defaultFeedback:
        "Absorption is the movement of digested nutrients from the small intestine (Afọ Obere) into the blood and lymphatic system.",
    },
  },
  {
    id: "q-d-19",
    type: QuestionType.MCQ,
    questionText: "What is the first part of the small intestine called?",
    options: ["Ileum", "Jejunum", "Duodenum", "Caecum"],
    correctAnswer: "Duodenum",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Ileum",
          feedback:
            "The ileum is the final part of the small intestine. The first part, where bile and pancreatic juice enter, is the duodenum.",
        },
      ],
      defaultFeedback:
        "The duodenum is the first section of the small intestine (Afọ Obere). Bile and pancreatic enzymes (Ihe Mmezi Nri) enter here to continue digestion.",
    },
  },
  {
    id: "q-d-20",
    type: QuestionType.TRUE_FALSE,
    questionText: "Enzymes are reusable biological catalysts.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True! Enzymes (Ihe Mmezi Nri) are biological catalysts that speed up reactions without being used up. They can be used again and again.",
        },
      ],
      defaultFeedback:
        "Correct! Enzymes (Ihe Mmezi Nri) are biological catalysts - they speed up chemical reactions and are not consumed in the process, so they can be reused.",
    },
  },
  {
    id: "q-d-21",
    type: QuestionType.MCQ,
    questionText: "What happens to undigested food in the large intestine?",
    options: [
      "It is digested by bile",
      "Nutrients are absorbed from it",
      "Water is absorbed and it forms faeces",
      "It is returned to the stomach",
    ],
    correctAnswer: "Water is absorbed and it forms faeces",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Nutrients are absorbed from it",
          feedback:
            "Most nutrient absorption occurs earlier in the small intestine (Afọ Obere). The large intestine mainly absorbs water and forms faeces.",
        },
      ],
      defaultFeedback:
        "In the large intestine, water is absorbed from undigested material. The remaining solid waste forms faeces, stored in the rectum before elimination.",
    },
  },
  {
    id: "q-d-22",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What are the building blocks of proteins produced when proteases digest them?",
    options: null,
    correctAnswer: "amino acids",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "glucose",
          feedback:
            "Glucose comes from carbohydrate digestion. Proteases break proteins down into amino acids - the building blocks of proteins.",
        },
      ],
      defaultFeedback:
        "Proteases (like pepsin) digest proteins into amino acids - small molecules that are absorbed into the bloodstream through the small intestine (Afọ Obere).",
    },
  },
];

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS - ECOSYSTEMS (22)
// ═══════════════════════════════════════════════════════════════════

const Q_ECOSYSTEMS = [
  {
    id: "q-e-1",
    type: QuestionType.MCQ,
    questionText:
      "What is an organism that makes its own food through photosynthesis called?",
    options: ["Consumer", "Decomposer", "Producer", "Predator"],
    correctAnswer: "Producer",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Consumer",
          feedback:
            "Consumers (Onye Iri Nri) eat other organisms. Organisms that make their own food via photosynthesis are producers (Onye Emepụta Nri).",
        },
      ],
      defaultFeedback:
        "Producers (Onye Emepụta Nri) make their own food using photosynthesis. They form the base of every food chain.",
    },
  },
  {
    id: "q-e-2",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Only about 10% of energy is passed from one trophic level to the next.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True - about 90% of energy is lost as heat, through respiration, and in waste. Only ~10% transfers to the next level.",
        },
      ],
      defaultFeedback:
        "Correct! The 10% rule explains why food chains rarely exceed 4–5 levels - too little energy remains at higher levels.",
    },
  },
  {
    id: "q-e-3",
    type: QuestionType.MCQ,
    questionText: "What is the role of decomposers in an ecosystem?",
    options: [
      "Hunt prey",
      "Produce food from sunlight",
      "Break down dead organisms and return nutrients",
      "Compete with plants for light",
    ],
    correctAnswer: "Break down dead organisms and return nutrients",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Hunt prey",
          feedback:
            "Hunting prey is the role of predators (Anụmanụ Ọchụ). Decomposers (Onye Emebi Ihe Ọdịdị) break down dead matter.",
        },
      ],
      defaultFeedback:
        "Decomposers (Onye Emebi Ihe Ọdịdị) - bacteria and fungi - recycle nutrients by breaking down dead organisms and returning them to the soil.",
    },
  },
  {
    id: "q-e-4",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What term describes all populations of different species living together in one area?",
    options: null,
    correctAnswer: "community",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "ecosystem",
          feedback:
            "An ecosystem (Ọdịnala Ndụ) includes the community AND the non-living environment. The living part alone is a community.",
        },
      ],
      defaultFeedback:
        "A community is all populations of different species living and interacting in the same area.",
    },
  },
  {
    id: "q-e-5",
    type: QuestionType.MCQ,
    questionText:
      "In the food chain Grass → Rabbit → Fox → Eagle, what is the rabbit?",
    options: [
      "Producer",
      "Primary consumer",
      "Secondary consumer",
      "Decomposer",
    ],
    correctAnswer: "Primary consumer",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Producer",
          feedback:
            "The grass is the producer. The rabbit eats the producer, making it the primary consumer.",
        },
        {
          pattern: "Secondary consumer",
          feedback:
            "The fox is the secondary consumer. The rabbit eats the producer (grass) so it is the primary consumer.",
        },
      ],
      defaultFeedback:
        "The rabbit is the primary consumer - it eats the producer (grass). The fox is secondary consumer and eagle is tertiary.",
    },
  },
  {
    id: "q-e-6",
    type: QuestionType.TRUE_FALSE,
    questionText: "A food web is more realistic than a single food chain.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. A food web (Usoro Nri Ndụ) shows multiple overlapping chains, reflecting the real diversity of feeding relationships.",
        },
      ],
      defaultFeedback:
        "Correct! A food web shows multiple interconnected food chains. Most organisms eat several different things.",
    },
  },
  {
    id: "q-e-7",
    type: QuestionType.MCQ,
    questionText:
      "Which process removes CO₂ from the atmosphere in the carbon cycle?",
    options: ["Respiration", "Combustion", "Photosynthesis", "Decomposition"],
    correctAnswer: "Photosynthesis",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Respiration",
          feedback:
            "Respiration RELEASES CO₂. Photosynthesis (Ọrụ Anyanwụ) removes CO₂ from the atmosphere.",
        },
      ],
      defaultFeedback:
        "Photosynthesis (Ọrụ Anyanwụ) removes CO₂ from the atmosphere, converting it into glucose. This is a crucial part of the carbon cycle.",
    },
  },
  {
    id: "q-e-8",
    type: QuestionType.MCQ,
    questionText:
      "Which bacteria convert atmospheric nitrogen into compounds plants can absorb?",
    options: [
      "Decomposing bacteria",
      "Nitrifying bacteria",
      "Nitrogen-fixing bacteria",
      "Denitrifying bacteria",
    ],
    correctAnswer: "Nitrogen-fixing bacteria",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Denitrifying bacteria",
          feedback:
            "Denitrifying bacteria do the OPPOSITE - they convert nitrates back to N₂. Nitrogen-fixing bacteria convert N₂ into usable compounds.",
        },
      ],
      defaultFeedback:
        "Nitrogen-fixing bacteria convert atmospheric N₂ into ammonia or nitrates in the soil, which plant roots can absorb.",
    },
  },
  {
    id: "q-e-9",
    type: QuestionType.TRUE_FALSE,
    questionText: "Deforestation increases biodiversity.",
    options: ["True", "False"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "Deforestation actually REDUCES biodiversity (Ọtụtụ Ụdị Ndụ). Forests contain the richest diversity on Earth. Clearing them destroys habitats.",
        },
      ],
      defaultFeedback:
        "Deforestation reduces biodiversity (Ọtụtụ Ụdị Ndụ). Forest habitats (Ebe Obibi Ihe Ndụ) support enormous numbers of species.",
    },
  },
  {
    id: "q-e-10",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What term describes the specific place where an organism lives?",
    options: null,
    correctAnswer: "habitat",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "ecosystem",
          feedback:
            "An ecosystem (Ọdịnala Ndụ) is the entire system. A habitat (Ebe Obibi Ihe Ndụ) is the specific place where one organism lives.",
        },
      ],
      defaultFeedback:
        "A habitat (Ebe Obibi Ihe Ndụ) is the specific environment where an organism naturally lives, e.g. a rainforest or coral reef.",
    },
  },
  {
    id: "q-e-11",
    type: QuestionType.MCQ,
    questionText:
      "What term describes all the individuals of one species in an area?",
    options: ["Community", "Ecosystem", "Population", "Habitat"],
    correctAnswer: "Population",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Community",
          feedback:
            "A community includes ALL species in an area. A population is all individuals of ONE species in that area.",
        },
      ],
      defaultFeedback:
        "A population is all individuals of a single species living in a defined area - e.g. all the lions in the Serengeti.",
    },
  },
  {
    id: "q-e-12",
    type: QuestionType.TRUE_FALSE,
    questionText: "Producers are at the base of every food chain.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Producers (Onye Emepụta Nri) - plants and algae - capture energy from sunlight and form the foundation of all food chains.",
        },
      ],
      defaultFeedback:
        "Correct! Producers (Onye Emepụta Nri) capture solar energy through photosynthesis, making them the energy source for all consumers.",
    },
  },
  {
    id: "q-e-13",
    type: QuestionType.MCQ,
    questionText:
      "Which of the following is a biotic (living) factor in an ecosystem?",
    options: ["Temperature", "Rainfall", "Predators", "Soil type"],
    correctAnswer: "Predators",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Temperature",
          feedback:
            "Temperature is an abiotic (non-living) factor. Predators (Anụmanụ Ọchụ) are biotic - they are living organisms that affect other organisms.",
        },
      ],
      defaultFeedback:
        "Predators (Anụmanụ Ọchụ) are a biotic factor - they directly affect the populations of prey species in the ecosystem (Ọdịnala Ndụ).",
    },
  },
  {
    id: "q-e-14",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the name for organisms that eat both plants and animals?",
    options: null,
    correctAnswer: "omnivores",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "herbivores",
          feedback:
            "Herbivores eat only plants. Animals that eat both plants and animals are omnivores.",
        },
        {
          pattern: "carnivores",
          feedback:
            "Carnivores eat only animals. Animals that eat both plants and animals are omnivores.",
        },
      ],
      defaultFeedback:
        "Omnivores eat both plants and animals - e.g. humans, bears, and pigs. They can occupy multiple levels in a food web (Usoro Nri Ndụ).",
    },
  },
  {
    id: "q-e-15",
    type: QuestionType.TRUE_FALSE,
    questionText: "A pyramid of biomass always has a wider base than top.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True in most cases. The biomass decreases at each trophic level because energy is lost, so there is always less total mass higher up the chain.",
        },
      ],
      defaultFeedback:
        "A pyramid of biomass shows decreasing total mass at each higher trophic level, always producing a pyramid shape widest at the base (producers).",
    },
  },
  {
    id: "q-e-16",
    type: QuestionType.MCQ,
    questionText:
      "What is the main source of energy for almost all ecosystems?",
    options: ["Wind", "The moon", "The sun", "Geothermal heat"],
    correctAnswer: "The sun",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Wind",
          feedback:
            "Wind is a form of energy, but the PRIMARY energy input to most ecosystems (Ọdịnala Ndụ) is sunlight, captured by producers through photosynthesis.",
        },
      ],
      defaultFeedback:
        "The sun is the ultimate energy source for almost all ecosystems (Ọdịnala Ndụ). Producers (Onye Emepụta Nri) capture solar energy through photosynthesis.",
    },
  },
  {
    id: "q-e-17",
    type: QuestionType.MCQ,
    questionText:
      "What type of relationship is it when both species benefit from each other?",
    options: ["Predation", "Parasitism", "Mutualism", "Competition"],
    correctAnswer: "Mutualism",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Parasitism",
          feedback:
            "In parasitism, one organism benefits and the other is harmed. When BOTH species benefit, it is mutualism - e.g. bees and flowers.",
        },
      ],
      defaultFeedback:
        "Mutualism is a relationship where both species benefit - e.g. bees get nectar from flowers, and flowers get pollinated by bees.",
    },
  },
  {
    id: "q-e-18",
    type: QuestionType.TRUE_FALSE,
    questionText: "Overfishing can disrupt marine food webs.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Removing large numbers of a species from a food web (Usoro Nri Ndụ) cascades through the ecosystem - prey populations explode and predators starve.",
        },
      ],
      defaultFeedback:
        "Correct! Overfishing removes key species from marine food webs. This creates cascade effects throughout the entire ecosystem (Ọdịnala Ndụ).",
    },
  },
  {
    id: "q-e-19",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What term describes the variety of species in an ecosystem?",
    options: null,
    correctAnswer: "biodiversity",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "habitat",
          feedback:
            "Habitat (Ebe Obibi Ihe Ndụ) is where organisms live. The variety of species present is called biodiversity (Ọtụtụ Ụdị Ndụ).",
        },
      ],
      defaultFeedback:
        "Biodiversity (Ọtụtụ Ụdị Ndụ) refers to the variety of different species in an ecosystem. High biodiversity usually indicates a healthy ecosystem.",
    },
  },
  {
    id: "q-e-20",
    type: QuestionType.MCQ,
    questionText:
      "What happens to the population of rabbits if all foxes are removed from an ecosystem?",
    options: [
      "Rabbit population decreases",
      "Rabbit population stays the same",
      "Rabbit population increases rapidly",
      "Rabbits become extinct",
    ],
    correctAnswer: "Rabbit population increases rapidly",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Rabbit population decreases",
          feedback:
            "Without predators (Anụmanụ Ọchụ), prey populations typically increase rapidly due to reduced predation pressure.",
        },
      ],
      defaultFeedback:
        "Without foxes (predators/Anụmanụ Ọchụ), rabbits (prey) have no natural population control - their numbers increase rapidly, which can then lead to overgrazing.",
    },
  },
  {
    id: "q-e-21",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "In the carbon cycle, burning fossil fuels releases CO₂ into the atmosphere.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Combustion of fossil fuels releases the carbon stored millions of years ago as CO₂, contributing to the greenhouse effect.",
        },
      ],
      defaultFeedback:
        "Correct! Burning fossil fuels (combustion) releases stored carbon as CO₂. This is a key driver of rising atmospheric CO₂ and climate change.",
    },
  },
  {
    id: "q-e-22",
    type: QuestionType.MCQ,
    questionText:
      "Which of the following correctly describes an abiotic factor?",
    options: [
      "A rabbit eating grass",
      "Fungi decomposing a log",
      "Rainfall amount",
      "A lion hunting zebra",
    ],
    correctAnswer: "Rainfall amount",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Fungi decomposing a log",
          feedback:
            "Fungi are living organisms - they are biotic factors. Rainfall is a non-living (abiotic) environmental factor.",
        },
      ],
      defaultFeedback:
        "Abiotic factors are non-living components of an ecosystem (Ọdịnala Ndụ) - e.g. rainfall, temperature, light intensity, and soil pH.",
    },
  },
];

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS - REPRODUCTION (20)
// ═══════════════════════════════════════════════════════════════════

const Q_REPRODUCTION = [
  {
    id: "q-r-1",
    type: QuestionType.MCQ,
    questionText: "Where does fertilisation normally take place?",
    options: ["Uterus", "Ovary", "Fallopian tube", "Vagina"],
    correctAnswer: "Fallopian tube",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Uterus",
          feedback:
            "The uterus (Ụlọ Nwa) is where the fertilised egg implants and develops. Fertilisation (Njikọ Mkpụrụ Ndụ Nna na Nne) occurs in the fallopian tube.",
        },
      ],
      defaultFeedback:
        "Fertilisation (Njikọ Mkpụrụ Ndụ Nna na Nne) occurs in the fallopian tube. The fertilised egg then travels to the uterus (Ụlọ Nwa) for implantation.",
    },
  },
  {
    id: "q-r-2",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "The placenta allows the mother's and foetus's blood to mix directly.",
    options: ["True", "False"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "The placenta (Ụgbọ Nri Nwa) keeps the two blood systems separate. Nutrients and gases are exchanged across the membrane, but blood never mixes.",
        },
      ],
      defaultFeedback:
        "They do NOT mix. The placenta (Ụgbọ Nri Nwa) allows exchange of nutrients and gases without the blood supplies ever meeting.",
    },
  },
  {
    id: "q-r-3",
    type: QuestionType.MCQ,
    questionText:
      "On which day of the 28-day cycle does ovulation typically occur?",
    options: ["Day 1", "Day 7", "Day 14", "Day 28"],
    correctAnswer: "Day 14",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Day 1",
          feedback:
            "Day 1 is the start of menstruation. Ovulation (Ịtọpụ Ákwá) occurs around Day 14 of a typical 28-day cycle.",
        },
      ],
      defaultFeedback:
        "Ovulation (Ịtọpụ Ákwá) typically occurs around Day 14, triggered by a surge in LH from the pituitary gland.",
    },
  },
  {
    id: "q-r-4",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the term for the fertilised egg attaching to the uterus wall?",
    options: null,
    correctAnswer: "implantation",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "fertilisation",
          feedback:
            "Fertilisation (Njikọ Mkpụrụ Ndụ Nna na Nne) is the joining of sperm and egg. Implantation is when the embryo embeds into the uterus (Ụlọ Nwa) wall.",
        },
      ],
      defaultFeedback:
        "Implantation is when the embryo (Nwa Ọhụrụ N'ime Ụlọ Nwa) embeds into the uterus wall, approximately 6–10 days after fertilisation.",
    },
  },
  {
    id: "q-r-5",
    type: QuestionType.MCQ,
    questionText: "Which hormone triggers ovulation?",
    options: ["Oestrogen", "Progesterone", "FSH", "LH"],
    correctAnswer: "LH",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "FSH",
          feedback:
            "FSH stimulates egg development. The hormone that directly triggers the egg's release (Ịtọpụ Ákwá) is LH.",
        },
        {
          pattern: "Oestrogen",
          feedback:
            "Oestrogen triggers the LH surge, but it is LH (luteinising hormone) that directly causes ovulation (Ịtọpụ Ákwá).",
        },
      ],
      defaultFeedback:
        "LH (luteinising hormone) triggers ovulation (Ịtọpụ Ákwá). Its sudden surge around Day 14 causes the follicle to rupture and release the egg.",
    },
  },
  {
    id: "q-r-6",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Women produce new egg cells throughout their lives as men produce new sperm.",
    options: ["True", "False"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "False. Women are born with all their eggs (ákwá) already present. Men continuously produce new sperm (Mkpụrụ Ndụ Nna) from puberty.",
        },
      ],
      defaultFeedback:
        "Women are born with all their eggs (ákwá). Men continuously produce new sperm (Mkpụrụ Ndụ Nna) from puberty throughout their lives.",
    },
  },
  {
    id: "q-r-7",
    type: QuestionType.MCQ,
    questionText: "What is the function of the testes?",
    options: [
      "Produce eggs",
      "Produce sperm and testosterone",
      "Store urine",
      "Produce oestrogen",
    ],
    correctAnswer: "Produce sperm and testosterone",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Produce eggs",
          feedback:
            "Eggs (ákwá) are produced by the ovaries. The testes produce sperm (Mkpụrụ Ndụ Nna) and testosterone.",
        },
      ],
      defaultFeedback:
        "The testes produce sperm (Mkpụrụ Ndụ Nna) through spermatogenesis and the hormone testosterone.",
    },
  },
  {
    id: "q-r-8",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What structure nourishes the foetus during pregnancy?",
    options: null,
    correctAnswer: "placenta",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "uterus",
          feedback:
            "The uterus (Ụlọ Nwa) houses the foetus. The specific structure transferring nutrients and oxygen between mother and foetus is the placenta (Ụgbọ Nri Nwa).",
        },
      ],
      defaultFeedback:
        "The placenta (Ụgbọ Nri Nwa) transfers oxygen and nutrients from mother to foetus and removes waste in the other direction.",
    },
  },
  {
    id: "q-r-9",
    type: QuestionType.MCQ,
    questionText: "What happens to progesterone if an egg is NOT fertilised?",
    options: [
      "It rises sharply",
      "It remains constant",
      "It falls, triggering menstruation",
      "It converts to oestrogen",
    ],
    correctAnswer: "It falls, triggering menstruation",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "It rises sharply",
          feedback:
            "Progesterone rises only if implantation occurs. Without fertilisation, progesterone falls, causing the uterus lining to shed.",
        },
      ],
      defaultFeedback:
        "Without fertilisation, progesterone falls sharply. This causes the uterus (Ụlọ Nwa) lining to shed - menstruation (Oge Mmiri Ọbara Nwaanyị), Day 1 of the new cycle.",
    },
  },
  {
    id: "q-r-10",
    type: QuestionType.TRUE_FALSE,
    questionText: "Human gestation lasts approximately 40 weeks.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Human pregnancy lasts about 40 weeks (approximately 9 months).",
        },
      ],
      defaultFeedback:
        "Correct! Human gestation is approximately 40 weeks from the last menstrual period (Oge Mmiri Ọbara Nwaanyị) to birth.",
    },
  },
  {
    id: "q-r-11",
    type: QuestionType.MCQ,
    questionText: "Which structure connects the foetus to the placenta?",
    options: ["Fallopian tube", "Cervix", "Umbilical cord", "Vagina"],
    correctAnswer: "Umbilical cord",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Cervix",
          feedback:
            "The cervix is the lower part of the uterus (Ụlọ Nwa). The umbilical cord connects the foetus to the placenta (Ụgbọ Nri Nwa).",
        },
      ],
      defaultFeedback:
        "The umbilical cord connects the foetus to the placenta (Ụgbọ Nri Nwa), carrying blood vessels for nutrient and gas exchange.",
    },
  },
  {
    id: "q-r-12",
    type: QuestionType.TRUE_FALSE,
    questionText: "FSH is produced by the pituitary gland.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. FSH (follicle-stimulating hormone) is produced by the pituitary gland in the brain. It stimulates follicle and egg development in the ovaries.",
        },
      ],
      defaultFeedback:
        "Correct! FSH is produced by the pituitary gland and travels in the blood to the ovaries, stimulating egg development.",
    },
  },
  {
    id: "q-r-13",
    type: QuestionType.MCQ,
    questionText: "What is the purpose of the scrotum?",
    options: [
      "Store urine",
      "Keep testes slightly below body temperature",
      "Produce testosterone",
      "Produce sperm directly",
    ],
    correctAnswer: "Keep testes slightly below body temperature",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Produce testosterone",
          feedback:
            "Testosterone is produced by cells within the testes themselves. The scrotum is the external pouch that maintains testes at slightly below body temperature for optimal sperm production.",
        },
      ],
      defaultFeedback:
        "The scrotum keeps the testes at about 2–3°C below body temperature. This lower temperature is necessary for optimal sperm (Mkpụrụ Ndụ Nna) production.",
    },
  },
  {
    id: "q-r-14",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What hormone maintains the uterus lining during the second half of the menstrual cycle?",
    options: null,
    correctAnswer: "progesterone",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "oestrogen",
          feedback:
            "Oestrogen rebuilds the uterus lining in the FIRST half of the cycle. Progesterone maintains it in the second half (luteal phase).",
        },
      ],
      defaultFeedback:
        "Progesterone (produced by the corpus luteum) maintains the uterus (Ụlọ Nwa) lining after ovulation. If no fertilisation occurs, progesterone falls and menstruation begins.",
    },
  },
  {
    id: "q-r-15",
    type: QuestionType.MCQ,
    questionText: "What is a zygote?",
    options: [
      "An unfertilised egg",
      "A mature sperm",
      "A fertilised egg",
      "An implanted embryo",
    ],
    correctAnswer: "A fertilised egg",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "An unfertilised egg",
          feedback:
            "An unfertilised egg is just an ovum (Ákwá Nwaanyị). Once fertilised by sperm, it becomes a zygote.",
        },
        {
          pattern: "An implanted embryo",
          feedback:
            "An embryo forms after the zygote begins dividing. A zygote is specifically the cell formed immediately at fertilisation (Njikọ Mkpụrụ Ndụ Nna na Nne).",
        },
      ],
      defaultFeedback:
        "A zygote is the single cell formed when a sperm (Mkpụrụ Ndụ Nna) fertilises an egg (Ákwá Nwaanyị). It contains DNA from both parents and will develop into an embryo.",
    },
  },
  {
    id: "q-r-16",
    type: QuestionType.TRUE_FALSE,
    questionText: "The menstrual cycle is controlled entirely by one hormone.",
    options: ["True", "False"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "The menstrual cycle (Oge Mmiri Ọbara Nwaanyị) is controlled by at least four hormones working together: FSH, LH, oestrogen, and progesterone.",
        },
      ],
      defaultFeedback:
        "The menstrual cycle (Oge Mmiri Ọbara Nwaanyị) is regulated by four hormones: FSH and LH (from the pituitary) and oestrogen and progesterone (from the ovaries).",
    },
  },
  {
    id: "q-r-17",
    type: QuestionType.MCQ,
    questionText: "Where are sperm stored after production until ejaculation?",
    options: ["Urethra", "Seminal vesicle", "Epididymis", "Prostate gland"],
    correctAnswer: "Epididymis",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Seminal vesicle",
          feedback:
            "Seminal vesicles produce fluid that nourishes sperm. Sperm (Mkpụrụ Ndụ Nna) are stored and mature in the epididymis.",
        },
      ],
      defaultFeedback:
        "Sperm (Mkpụrụ Ndụ Nna) mature and are stored in the epididymis - a coiled tube attached to each testis - until ejaculation.",
    },
  },
  {
    id: "q-r-18",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the name for the stage of pregnancy from fertilisation to 8 weeks?",
    options: null,
    correctAnswer: "embryo",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "foetus",
          feedback:
            "A foetus is the term used from 8 weeks onwards. In the first 8 weeks after fertilisation (Njikọ Mkpụrụ Ndụ Nna na Nne), the developing organism is called an embryo (Nwa Ọhụrụ N'ime Ụlọ Nwa).",
        },
      ],
      defaultFeedback:
        "The developing organism is called an embryo (Nwa Ọhụrụ N'ime Ụlọ Nwa) from fertilisation to 8 weeks. After 8 weeks, it is called a foetus.",
    },
  },
  {
    id: "q-r-19",
    type: QuestionType.MCQ,
    questionText:
      "What does oestrogen stimulate in the first half of the menstrual cycle?",
    options: [
      "Ovulation directly",
      "Breaking down the uterus lining",
      "Rebuilding the uterus lining",
      "Sperm production",
    ],
    correctAnswer: "Rebuilding the uterus lining",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Ovulation directly",
          feedback:
            "Oestrogen triggers the LH surge, which causes ovulation (Ịtọpụ Ákwá). But oestrogen's direct action is rebuilding the uterus (Ụlọ Nwa) lining.",
        },
        {
          pattern: "Breaking down the uterus lining",
          feedback:
            "That happens when progesterone falls at the end of the cycle. Oestrogen REBUILDS the uterus (Ụlọ Nwa) lining after menstruation.",
        },
      ],
      defaultFeedback:
        "Oestrogen rebuilds the uterus (Ụlọ Nwa) lining (endometrium) after menstruation and causes it to thicken in preparation for implantation.",
    },
  },
  {
    id: "q-r-20",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "The male reproductive system produces both sperm and hormones.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. The testes produce sperm (Mkpụrụ Ndụ Nna) through spermatogenesis AND testosterone through Leydig cells - both functions occur in the testes.",
        },
      ],
      defaultFeedback:
        "Correct! The testes produce sperm (Mkpụrụ Ndụ Nna) and the hormone testosterone, which is responsible for male secondary sex characteristics.",
    },
  },
];

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS - STATES OF MATTER (22)
// ═══════════════════════════════════════════════════════════════════

const Q_STATES_OF_MATTER = [
  {
    id: "q-m-1",
    type: QuestionType.MCQ,
    questionText: "Which state of matter has fixed shape and fixed volume?",
    options: ["Gas", "Liquid", "Solid", "Plasma"],
    correctAnswer: "Solid",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Liquid",
          feedback:
            "A liquid (Mmiri) has fixed volume but takes the shape of its container. Only a solid (Ihe Siri Ike) has both fixed shape and fixed volume.",
        },
      ],
      defaultFeedback:
        "A solid (Ihe Siri Ike) has both fixed shape and volume because particles are held in fixed positions.",
    },
  },
  {
    id: "q-m-2",
    type: QuestionType.MCQ,
    questionText: "What is the change of state from liquid to gas called?",
    options: ["Condensation", "Sublimation", "Evaporation", "Melting"],
    correctAnswer: "Evaporation",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Condensation",
          feedback:
            "Condensation (Ịlaghachi Mmiri) is the OPPOSITE - gas to liquid. Liquid to gas is evaporation (Ịfefe Mmiri).",
        },
      ],
      defaultFeedback:
        "Evaporation (Ịfefe Mmiri) is when a liquid changes to a gas. At boiling point, this happens throughout the liquid.",
    },
  },
  {
    id: "q-m-3",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Gas particles are much closer together than liquid particles.",
    options: ["True", "False"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "Gas particles (Ihe Obere Kacha) are much FURTHER apart than liquid particles - gases are about 1000x less dense than liquids.",
        },
      ],
      defaultFeedback:
        "Gas particles (Ihe Obere Kacha) are far apart and move randomly at high speed. Liquid particles are much closer and can flow.",
    },
  },
  {
    id: "q-m-4",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "At what temperature does pure water boil at standard atmospheric pressure?",
    options: null,
    correctAnswer: "100",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "0",
          feedback:
            "0°C is water's melting/freezing point. Water boils at 100°C at standard atmospheric pressure.",
        },
      ],
      defaultFeedback:
        "Pure water boils at 100°C (212°F) at standard atmospheric pressure. Below this, evaporation (Ịfefe Mmiri) can still occur from the surface.",
    },
  },
  {
    id: "q-m-5",
    type: QuestionType.MCQ,
    questionText: "What happens to particles when a substance is heated?",
    options: [
      "They stop moving",
      "They move slower",
      "They gain energy and move faster",
      "They change chemical composition",
    ],
    correctAnswer: "They gain energy and move faster",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "They stop moving",
          feedback:
            "Particles only stop at absolute zero (−273°C). Heating gives particles (Ihe Obere Kacha) more kinetic energy - they move faster.",
        },
      ],
      defaultFeedback:
        "Heating gives particles (Ihe Obere Kacha) more kinetic energy - they move faster and further apart, eventually changing state.",
    },
  },
  {
    id: "q-m-6",
    type: QuestionType.MCQ,
    questionText: "Diffusion is the movement of particles from:",
    options: [
      "Low to high concentration",
      "High to low concentration",
      "Only in liquids",
      "Only requiring energy",
    ],
    correctAnswer: "High to low concentration",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Low to high concentration",
          feedback:
            "That describes active transport (requires energy). Diffusion (Ịgbasa Ihe) is passive movement from HIGH to LOW concentration.",
        },
      ],
      defaultFeedback:
        "Diffusion (Ịgbasa Ihe) is passive movement from areas of HIGH concentration to LOW concentration. No energy is required.",
    },
  },
  {
    id: "q-m-7",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Liquids are virtually incompressible under normal conditions.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "Liquids are nearly incompressible because their particles are already closely packed with little space between them.",
        },
      ],
      defaultFeedback:
        "Correct! Liquids are almost incompressible - their closely packed particles leave little room to compress. This makes hydraulic systems possible.",
    },
  },
  {
    id: "q-m-8",
    type: QuestionType.MCQ,
    questionText: "What are the two components of a solution called?",
    options: [
      "Solute and solvent",
      "Element and compound",
      "Acid and base",
      "Reactant and product",
    ],
    correctAnswer: "Solute and solvent",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Acid and base",
          feedback:
            "Acids and bases are categories of chemicals. In a solution the dissolved substance is the solute and the dissolving medium is the solvent.",
        },
      ],
      defaultFeedback:
        "A solution has a solute (dissolved substance, e.g. salt) and a solvent (dissolving medium, e.g. water).",
    },
  },
  {
    id: "q-m-9",
    type: QuestionType.MCQ,
    questionText:
      "What change of state occurs when a gas cools and becomes a liquid?",
    options: ["Evaporation", "Melting", "Condensation", "Freezing"],
    correctAnswer: "Condensation",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Freezing",
          feedback:
            "Freezing is liquid to solid. Gas to liquid is condensation (Ịlaghachi Mmiri) - like water droplets forming on a cold glass.",
        },
      ],
      defaultFeedback:
        "Condensation (Ịlaghachi Mmiri) is when a gas cools and becomes liquid - e.g. water vapour condensing on a cold mirror.",
    },
  },
  {
    id: "q-m-10",
    type: QuestionType.TRUE_FALSE,
    questionText: "Diffusion is faster at higher temperatures.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Higher temperature gives particles (Ihe Obere Kacha) more kinetic energy, so they diffuse (Ịgbasa Ihe) more quickly.",
        },
      ],
      defaultFeedback:
        "Correct! At higher temperatures, particles (Ihe Obere Kacha) have more energy and move faster, increasing the rate of diffusion (Ịgbasa Ihe).",
    },
  },
  {
    id: "q-m-11",
    type: QuestionType.MCQ,
    questionText: "What happens at the melting point of a substance?",
    options: [
      "Liquid becomes gas",
      "Solid becomes liquid",
      "Gas becomes solid",
      "Liquid becomes solid",
    ],
    correctAnswer: "Solid becomes liquid",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Liquid becomes gas",
          feedback:
            "Liquid becoming gas is the boiling/evaporation point. The melting point (Ịgba Ọkụ Ihe Siri Ike) is when a solid becomes a liquid.",
        },
      ],
      defaultFeedback:
        "At the melting point (Ịgba Ọkụ Ihe Siri Ike), a solid gains enough energy for particles to break free from their fixed positions and flow as a liquid.",
    },
  },
  {
    id: "q-m-12",
    type: QuestionType.TRUE_FALSE,
    questionText: "Sublimation is when a solid changes directly to a gas.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Sublimation is the direct change from solid to gas without passing through the liquid state - e.g. dry ice (solid CO₂) subliming at room temperature.",
        },
      ],
      defaultFeedback:
        "Correct! Sublimation is solid → gas directly. A familiar example is dry ice (solid CO₂) which sublimates at room temperature.",
    },
  },
  {
    id: "q-m-13",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What term describes the maximum amount of solute that dissolves in a solvent at a given temperature?",
    options: null,
    correctAnswer: "solubility",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "concentration",
          feedback:
            "Concentration describes how much solute is already dissolved. Solubility is the MAXIMUM amount that CAN dissolve at a specific temperature.",
        },
      ],
      defaultFeedback:
        "Solubility is the maximum amount of solute that can dissolve in a given amount of solvent at a specific temperature. It usually increases with temperature for solids.",
    },
  },
  {
    id: "q-m-14",
    type: QuestionType.MCQ,
    questionText: "In which state do particles have the most kinetic energy?",
    options: ["Solid", "Liquid", "Gas", "All the same"],
    correctAnswer: "Gas",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Solid",
          feedback:
            "Solid particles have the LEAST kinetic energy - they only vibrate in place. Gas particles (Ihe Obere Kacha) move fastest and have the most energy.",
        },
      ],
      defaultFeedback:
        "Gas particles (Ihe Obere Kacha) have the most kinetic energy - they move randomly at high speed and are far apart.",
    },
  },
  {
    id: "q-m-15",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "When a substance changes state, its temperature remains constant.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. During a state change (e.g. melting or boiling), energy is used to break intermolecular bonds rather than raise temperature - so temperature stays constant.",
        },
      ],
      defaultFeedback:
        "Correct! During a state change, energy input goes into breaking particle bonds (latent heat), not raising temperature. Temperature stays constant throughout the change.",
    },
  },
  {
    id: "q-m-16",
    type: QuestionType.MCQ,
    questionText:
      "What is the name for the energy absorbed during melting or evaporation?",
    options: [
      "Specific heat",
      "Latent heat",
      "Activation energy",
      "Thermal energy",
    ],
    correctAnswer: "Latent heat",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Specific heat",
          feedback:
            "Specific heat capacity relates to temperature change during heating. Latent heat is the energy absorbed or released during a change of state at constant temperature.",
        },
      ],
      defaultFeedback:
        "Latent heat is the energy absorbed or released during a change of state - melting (solid→liquid) or evaporation (liquid→gas) - without a change in temperature.",
    },
  },
  {
    id: "q-m-17",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the name for the change of state from gas directly to solid?",
    options: null,
    correctAnswer: "deposition",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "sublimation",
          feedback:
            "Sublimation is solid to gas. The reverse - gas directly to solid - is called deposition (e.g. frost forming on a cold surface).",
        },
      ],
      defaultFeedback:
        "Deposition is when a gas changes directly to a solid without passing through liquid - the reverse of sublimation. Frost formation is a common example.",
    },
  },
  {
    id: "q-m-18",
    type: QuestionType.TRUE_FALSE,
    questionText: "Gases can be compressed much more easily than liquids.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Gas particles (Ihe Obere Kacha) are far apart, leaving lots of empty space. This makes gases highly compressible, unlike liquids where particles are already close.",
        },
      ],
      defaultFeedback:
        "Correct! Gas particles have large spaces between them, making gases highly compressible. This is why gas syringes and pneumatic systems work.",
    },
  },
  {
    id: "q-m-19",
    type: QuestionType.MCQ,
    questionText:
      "Which property allows liquids to flow and take the shape of their container?",
    options: [
      "Fixed particle positions",
      "Intermolecular bonds",
      "Particles able to slide past each other",
      "High particle speed",
    ],
    correctAnswer: "Particles able to slide past each other",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Fixed particle positions",
          feedback:
            "Fixed positions describe solids (Ihe Siri Ike). Liquids (Mmiri) flow because their particles can slide past each other, unlike rigid solids.",
        },
      ],
      defaultFeedback:
        "In liquids (Mmiri), particles can slide past each other - they are close together but not locked in place. This gives liquids their ability to flow and fill container shapes.",
    },
  },
  {
    id: "q-m-20",
    type: QuestionType.MCQ,
    questionText:
      "What happens to the boiling point of water at high altitude?",
    options: [
      "It increases",
      "It decreases",
      "It stays the same",
      "It becomes 0°C",
    ],
    correctAnswer: "It decreases",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "It increases",
          feedback:
            "At high altitude, atmospheric pressure is LOWER. Lower pressure means water molecules escape more easily, so the boiling point DECREASES below 100°C.",
        },
      ],
      defaultFeedback:
        "At high altitude, atmospheric pressure is lower. This means water boils at temperatures below 100°C - which is why cooking takes longer in mountainous regions.",
    },
  },
  {
    id: "q-m-21",
    type: QuestionType.TRUE_FALSE,
    questionText: "The particles in a solid vibrate even at room temperature.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Solid particles (Ihe Obere Kacha) vibrate constantly - even at room temperature. Only at absolute zero (−273°C) would vibration cease completely.",
        },
      ],
      defaultFeedback:
        "Correct! Solid particles (Ihe Siri Ike) are always vibrating around their fixed positions. Heating increases the amplitude of vibration until they break free and melt.",
    },
  },
  {
    id: "q-m-22",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the term for spreading of a substance through a mixture without stirring?",
    options: null,
    correctAnswer: "diffusion",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "osmosis",
          feedback:
            "Osmosis is specifically water moving across a semi-permeable membrane. The general spreading of any substance from high to low concentration is diffusion (Ịgbasa Ihe).",
        },
      ],
      defaultFeedback:
        "Diffusion (Ịgbasa Ihe) is the passive spreading of particles from a region of high concentration to low concentration - no stirring or energy required.",
    },
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
    options: ["Volt", "Ohm", "Ampere", "Watt"],
    correctAnswer: "Ampere",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Volt",
          feedback:
            "Volt is the unit of voltage (Ike Ọkụ Eletrik). Current (Ọsịsọ Ọkụ Eletrik) is measured in amperes (A).",
        },
        {
          pattern: "Ohm",
          feedback:
            "Ohm is the unit of resistance (Mgbochi Ọkụ Eletrik). Current (Ọsịsọ Ọkụ Eletrik) is measured in amperes (A).",
        },
      ],
      defaultFeedback:
        "Electric current (Ọsịsọ Ọkụ Eletrik) is measured in amperes (A). It is the rate of flow of electric charge.",
    },
  },
  {
    id: "q-el-2",
    type: QuestionType.MCQ,
    questionText:
      "If resistance doubles with voltage constant, what happens to current?",
    options: ["Doubles", "Halves", "Stays same", "Becomes zero"],
    correctAnswer: "Halves",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Doubles",
          feedback:
            "From Ohm's Law (Iwu Ohm): I = V/R. If R doubles and V is fixed, I is halved.",
        },
      ],
      defaultFeedback:
        "Ohm's Law (Iwu Ohm): I = V/R. Doubling resistance with constant voltage halves the current.",
    },
  },
  {
    id: "q-el-3",
    type: QuestionType.TRUE_FALSE,
    questionText: "In a series circuit, all components share the same current.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. In a series circuit (Usoro Ọkụ Ọbara Ọbara), there is only one path, so the same current flows through all components.",
        },
      ],
      defaultFeedback:
        "Correct! In a series circuit (Usoro Ọkụ Ọbara Ọbara), current has one path - the same value flows through every component.",
    },
  },
  {
    id: "q-el-4",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "Write the formula for electrical power in terms of current (I) and voltage (V).",
    options: null,
    correctAnswer: "P = IV",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "V = IR",
          feedback: "V = IR is Ohm's Law (Iwu Ohm). Power (Ike Ọrụ) = I × V.",
        },
      ],
      defaultFeedback:
        "Power (Ike Ọrụ) = I × V. Measured in watts (W). A device drawing 2A at 12V uses 24W.",
    },
  },
  {
    id: "q-el-5",
    type: QuestionType.MCQ,
    questionText: "How is a voltmeter connected in a circuit?",
    options: [
      "In series",
      "In parallel",
      "Between battery terminals only",
      "In series with battery",
    ],
    correctAnswer: "In parallel",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "In series",
          feedback:
            "Ammeters connect in series. A voltmeter must connect in PARALLEL (Usoro Ọkụ Ụzọ Abụọ) across the component being measured.",
        },
      ],
      defaultFeedback:
        "A voltmeter connects in parallel (Usoro Ọkụ Ụzọ Abụọ) across the component. Its very high resistance means it draws negligible current.",
    },
  },
  {
    id: "q-el-6",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "In a parallel circuit, if one branch breaks, the other branches continue working.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True - each branch has its own path in a parallel circuit (Usoro Ọkụ Ụzọ Abụọ). A break in one branch doesn't affect the others.",
        },
      ],
      defaultFeedback:
        "Correct! This is why household circuits use parallel (Usoro Ọkụ Ụzọ Abụọ) wiring - one failed bulb doesn't cut the whole circuit.",
    },
  },
  {
    id: "q-el-7",
    type: QuestionType.MCQ,
    questionText: "Voltage is 12V, current is 3A. What is the resistance?",
    options: ["0.25 Ω", "4 Ω", "36 Ω", "9 Ω"],
    correctAnswer: "4 Ω",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "36 Ω",
          feedback:
            "Don't multiply - use Ohm's Law (Iwu Ohm): R = V/I = 12 ÷ 3 = 4 Ω.",
        },
      ],
      defaultFeedback:
        "R = V/I = 12 ÷ 3 = 4 Ω. Ohm's Law (Iwu Ohm): Voltage = Current × Resistance.",
    },
  },
  {
    id: "q-el-8",
    type: QuestionType.MCQ,
    questionText: "Which component allows current in one direction only?",
    options: ["Resistor", "Capacitor", "Diode", "Inductor"],
    correctAnswer: "Diode",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Resistor",
          feedback:
            "A resistor (Mgbochi Ọkụ Eletrik) limits current in both directions. A diode allows current in one direction only.",
        },
      ],
      defaultFeedback:
        "A diode allows current to flow in only one direction. It is used in rectifiers to convert AC to DC.",
    },
  },
  {
    id: "q-el-9",
    type: QuestionType.TRUE_FALSE,
    questionText: "Increasing wire length increases its electrical resistance.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. A longer wire means more material for electrons to collide with, increasing resistance (Mgbochi Ọkụ Eletrik).",
        },
      ],
      defaultFeedback:
        "Correct! Resistance (Mgbochi Ọkụ Eletrik) is proportional to wire length - longer wire = more resistance.",
    },
  },
  {
    id: "q-el-10",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What law relates voltage (V), current (I), and resistance (R)?",
    options: null,
    correctAnswer: "Ohm's Law",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Newton's Law",
          feedback:
            "Newton's Laws describe motion. The law connecting V, I, and R is Ohm's Law (Iwu Ohm): V = I × R.",
        },
      ],
      defaultFeedback:
        "Ohm's Law (Iwu Ohm): V = I × R. Applies to conductors at constant temperature.",
    },
  },
  {
    id: "q-el-11",
    type: QuestionType.MCQ,
    questionText: "Two resistors 3Ω and 5Ω in series. Total resistance?",
    options: ["1.875 Ω", "8 Ω", "15 Ω", "2 Ω"],
    correctAnswer: "8 Ω",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "15 Ω",
          feedback:
            "Don't multiply. In series (Usoro Ọkụ Ọbara Ọbara): R_total = R₁ + R₂ = 3 + 5 = 8 Ω.",
        },
        {
          pattern: "1.875 Ω",
          feedback:
            "That uses the parallel formula. In SERIES (Usoro Ọkụ Ọbara Ọbara): simply add resistances: 3 + 5 = 8 Ω.",
        },
      ],
      defaultFeedback:
        "In series (Usoro Ọkụ Ọbara Ọbara): R_total = R₁ + R₂ = 3 + 5 = 8 Ω.",
    },
  },
  {
    id: "q-el-12",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "Static electricity is caused by the build-up of charge on an insulator.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Static electricity builds up on insulators when electrons are transferred by friction - e.g. rubbing a balloon on hair.",
        },
      ],
      defaultFeedback:
        "Correct! Static electricity results from electron transfer (friction) creating a charge imbalance on an insulating surface.",
    },
  },
  {
    id: "q-el-13",
    type: QuestionType.MCQ,
    questionText: "A device uses 60W at 230V. What current does it draw?",
    options: ["0.26 A", "3.8 A", "13,800 A", "0.004 A"],
    correctAnswer: "0.26 A",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "3.8 A",
          feedback:
            "Use P = IV, rearranged to I = P/V = 60 ÷ 230 ≈ 0.26 A, not 3.8 A.",
        },
      ],
      defaultFeedback:
        "I = P/V = 60 ÷ 230 ≈ 0.26 A. A 60W lamp at 230V draws about a quarter of an ampere.",
    },
  },
  {
    id: "q-el-14",
    type: QuestionType.MCQ,
    questionText: "What does an ammeter measure and how is it connected?",
    options: [
      "Voltage, in parallel",
      "Resistance, in series",
      "Current, in series",
      "Power, in parallel",
    ],
    correctAnswer: "Current, in series",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Voltage, in parallel",
          feedback:
            "A voltmeter measures voltage and connects in parallel. An ammeter measures current (Ọsịsọ Ọkụ Eletrik) and MUST connect in series.",
        },
      ],
      defaultFeedback:
        "An ammeter measures current (Ọsịsọ Ọkụ Eletrik) and is connected in series in the circuit. It has very low resistance to minimise its effect on the circuit.",
    },
  },
  {
    id: "q-el-15",
    type: QuestionType.TRUE_FALSE,
    questionText: "Like charges attract each other.",
    options: ["True", "False"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "Like charges REPEL each other. Unlike charges (positive and negative) attract. This is a fundamental law of electrostatics.",
        },
      ],
      defaultFeedback:
        "Like charges repel; unlike charges attract. Two positive charges push apart, while a positive and negative charge pull together.",
    },
  },
  {
    id: "q-el-16",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What is the unit of electrical resistance?",
    options: null,
    correctAnswer: "ohm",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "volt",
          feedback:
            "Volt is the unit of voltage (Ike Ọkụ Eletrik). Resistance (Mgbochi Ọkụ Eletrik) is measured in ohms (Ω).",
        },
        {
          pattern: "ampere",
          feedback:
            "Ampere is the unit of current (Ọsịsọ Ọkụ Eletrik). Resistance (Mgbochi Ọkụ Eletrik) is measured in ohms (Ω).",
        },
      ],
      defaultFeedback:
        "Resistance (Mgbochi Ọkụ Eletrik) is measured in ohms (Ω), named after Georg Ohm who formulated Ohm's Law (Iwu Ohm).",
    },
  },
  {
    id: "q-el-17",
    type: QuestionType.MCQ,
    questionText: "In a parallel circuit, what is the same across each branch?",
    options: ["Current", "Resistance", "Voltage", "Power"],
    correctAnswer: "Voltage",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Current",
          feedback:
            "Current is the same in series (Usoro Ọkụ Ọbara Ọbara). In parallel (Usoro Ọkụ Ụzọ Abụọ), each branch has the same voltage but different currents.",
        },
      ],
      defaultFeedback:
        "In a parallel circuit (Usoro Ọkụ Ụzọ Abụọ), all branches share the same voltage. Current divides between branches based on their resistance.",
    },
  },
  {
    id: "q-el-18",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "A thicker wire has less resistance than a thin wire of the same length and material.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. A thicker wire has a larger cross-sectional area, giving electrons more space to flow - lower resistance (Mgbochi Ọkụ Eletrik).",
        },
      ],
      defaultFeedback:
        "Correct! Resistance (Mgbochi Ọkụ Eletrik) decreases as cross-sectional area increases. Thicker wire = more pathways for electrons = less resistance.",
    },
  },
  {
    id: "q-el-19",
    type: QuestionType.MCQ,
    questionText: "What is the energy transfer in a resistor?",
    options: [
      "Electrical to chemical",
      "Electrical to heat",
      "Chemical to electrical",
      "Heat to electrical",
    ],
    correctAnswer: "Electrical to heat",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Electrical to chemical",
          feedback:
            "Electrical to chemical energy conversion happens in batteries (during charging) or electrolysis. Resistors convert electrical energy to heat.",
        },
      ],
      defaultFeedback:
        "Resistors (Mgbochi Ọkụ Eletrik) convert electrical energy to heat as electrons collide with the material's atoms. This is the basis of electric heaters and filament bulbs.",
    },
  },
  {
    id: "q-el-20",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the formula for resistance in terms of voltage and current?",
    options: null,
    correctAnswer: "R = V/I",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "R = IV",
          feedback:
            "That gives power (P = IV). Resistance is R = V/I - rearranging Ohm's Law (Iwu Ohm): V = IR.",
        },
      ],
      defaultFeedback:
        "R = V/I - rearranged from Ohm's Law (Iwu Ohm): V = I × R. So resistance equals voltage divided by current.",
    },
  },
  {
    id: "q-el-21",
    type: QuestionType.TRUE_FALSE,
    questionText: "Household appliances are connected in parallel.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Household appliances are wired in parallel (Usoro Ọkụ Ụzọ Abụọ) so each gets the full supply voltage and can be switched independently.",
        },
      ],
      defaultFeedback:
        "Correct! Parallel wiring (Usoro Ọkụ Ụzọ Abụọ) gives each appliance the full mains voltage and means switching one off doesn't affect others.",
    },
  },
  {
    id: "q-el-22",
    type: QuestionType.MCQ,
    questionText: "Which material is the best conductor of electricity?",
    options: ["Glass", "Wood", "Silver", "Rubber"],
    correctAnswer: "Silver",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Glass",
          feedback:
            "Glass is an insulator - it has very high resistance (Mgbochi Ọkụ Eletrik). Silver is the best electrical conductor, though copper is more commonly used due to cost.",
        },
      ],
      defaultFeedback:
        "Silver is the best electrical conductor of the options listed, followed closely by copper. Insulators like glass and rubber resist current flow (Ọsịsọ Ọkụ Eletrik).",
    },
  },
];

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS - GENETICS (24)
// ═══════════════════════════════════════════════════════════════════

const Q_GENETICS = [
  {
    id: "q-g-1",
    type: QuestionType.MCQ,
    questionText: "What are the different versions of a gene called?",
    options: ["Chromosomes", "Alleles", "Genotypes", "Phenotypes"],
    correctAnswer: "Alleles",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Chromosomes",
          feedback:
            "Chromosomes (Usoro Ihe Nketa) contain thousands of genes. The different versions of a single gene are alleles (Ụdị Ihe Nketa).",
        },
      ],
      defaultFeedback:
        "Alleles (Ụdị Ihe Nketa) are the different versions of a gene - e.g. the gene for eye colour has alleles for brown, blue, etc.",
    },
  },
  {
    id: "q-g-2",
    type: QuestionType.TRUE_FALSE,
    questionText:
      "A dominant allele is only expressed when two copies are present.",
    options: ["True", "False"],
    correctAnswer: "False",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "True",
          feedback:
            "That describes a RECESSIVE allele. A dominant allele (Ihe Nketa Siri Ike) is expressed with just ONE copy.",
        },
      ],
      defaultFeedback:
        "A dominant allele (Ihe Nketa Siri Ike) is expressed with one copy. A recessive allele (Ihe Nketa Adịghị Ike) requires two copies.",
    },
  },
  {
    id: "q-g-3",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What base always pairs with adenine (A) in DNA?",
    options: null,
    correctAnswer: "thymine",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "guanine",
          feedback:
            "Guanine pairs with cytosine. Adenine (A) always pairs with thymine (T) in DNA.",
        },
        {
          pattern: "uracil",
          feedback:
            "Uracil pairs with adenine in RNA. In DNA, adenine (A) pairs with thymine (T).",
        },
      ],
      defaultFeedback:
        "Adenine (A) always pairs with Thymine (T). Cytosine (C) pairs with Guanine (G). These are the DNA base pairing rules.",
    },
  },
  {
    id: "q-g-4",
    type: QuestionType.MCQ,
    questionText: "An organism with two identical alleles (TT or tt) is:",
    options: ["Heterozygous", "Codominant", "Homozygous", "Recessive"],
    correctAnswer: "Homozygous",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Heterozygous",
          feedback:
            "Heterozygous means two DIFFERENT alleles (e.g. Tt). Two identical alleles (TT or tt) = homozygous.",
        },
      ],
      defaultFeedback:
        "Homozygous means both alleles are the same (TT or tt). Heterozygous means different alleles (Tt).",
    },
  },
  {
    id: "q-g-5",
    type: QuestionType.MCQ,
    questionText: "Tt × Tt cross gives what phenotype ratio?",
    options: ["1:1", "1:2:1", "3:1", "All tall"],
    correctAnswer: "3:1",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "1:1",
          feedback:
            "1:1 comes from Tt × tt. Tt × Tt gives TT, Tt, Tt, tt - 3 tall : 1 short.",
        },
      ],
      defaultFeedback:
        "Tt × Tt Punnett square: TT, Tt, Tt, tt. Three have at least one T (tall), one is tt (short). Ratio = 3:1.",
    },
  },
  {
    id: "q-g-6",
    type: QuestionType.TRUE_FALSE,
    questionText: "A person's sex is determined by the sperm, not the egg.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. All eggs carry X. Sperm carry X or Y. X sperm → XX (female); Y sperm → XY (male).",
        },
      ],
      defaultFeedback:
        "Correct! All eggs (ákwá) carry X. The sperm (Mkpụrụ Ndụ Nna) determines sex - X sperm gives female (XX), Y sperm gives male (XY).",
    },
  },
  {
    id: "q-g-7",
    type: QuestionType.MCQ,
    questionText: "Which disorder is caused by a recessive allele?",
    options: [
      "Huntington's disease",
      "Cystic fibrosis",
      "Down syndrome",
      "Colour blindness (choose one)",
    ],
    correctAnswer: "Cystic fibrosis",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Huntington's disease",
          feedback:
            "Huntington's is caused by a DOMINANT allele. Cystic fibrosis is caused by a recessive allele (Ihe Nketa Adịghị Ike).",
        },
        {
          pattern: "Down syndrome",
          feedback:
            "Down syndrome is a chromosomal mutation (extra chromosome 21), not a recessive allele disorder.",
        },
      ],
      defaultFeedback:
        "Cystic fibrosis is caused by a recessive allele (Ihe Nketa Adịghị Ike). Both parents must carry the faulty allele for a child to be affected.",
    },
  },
  {
    id: "q-g-8",
    type: QuestionType.MCQ,
    questionText: "What is a mutation?",
    options: [
      "Passing traits to offspring",
      "A change in DNA sequence",
      "Physical appearance",
      "Two gametes combining",
    ],
    correctAnswer: "A change in DNA sequence",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Passing traits to offspring",
          feedback:
            "Passing traits is heredity/inheritance. A mutation (Mgbanwe Ihe Nketa) is a change in the DNA sequence itself.",
        },
      ],
      defaultFeedback:
        "A mutation (Mgbanwe Ihe Nketa) is a change in the DNA sequence. Causes include radiation, chemical mutagens, or replication errors.",
    },
  },
  {
    id: "q-g-9",
    type: QuestionType.TRUE_FALSE,
    questionText: "A person with blood group AB has both A and B antigens.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Blood group AB results from codominance - both IA and IB alleles are expressed, producing A and B antigens.",
        },
      ],
      defaultFeedback:
        "Correct! AB blood group is codominance - both alleles expressed equally, producing both A and B antigens on red blood cells.",
    },
  },
  {
    id: "q-g-10",
    type: QuestionType.SHORT_ANSWER,
    questionText: "How many pairs of chromosomes do humans normally have?",
    options: null,
    correctAnswer: "23",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "46",
          feedback:
            "46 is the total number of chromosomes. They come in 23 PAIRS.",
        },
      ],
      defaultFeedback:
        "Humans have 23 pairs of chromosomes (46 total) - 22 pairs of autosomes and 1 pair of sex chromosomes.",
    },
  },
  {
    id: "q-g-11",
    type: QuestionType.MCQ,
    questionText: "What term describes an organism's genetic makeup?",
    options: ["Phenotype", "Allele", "Genotype", "Karyotype"],
    correctAnswer: "Genotype",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Phenotype",
          feedback:
            "Phenotype (Ihe A Na-Ahụ N'Ihe Dị Ndụ) is the observable trait. Genotype (Ihe Nketa Ndụ) is the underlying genetic makeup (e.g. Tt).",
        },
      ],
      defaultFeedback:
        "Genotype (Ihe Nketa Ndụ) is the genetic makeup - the actual allele combination (e.g. TT, Tt, tt).",
    },
  },
  {
    id: "q-g-12",
    type: QuestionType.MCQ,
    questionText: "Down syndrome is caused by:",
    options: [
      "Missing chromosome 21",
      "Extra chromosome 21",
      "Mutation on chromosome 7",
      "Extra X chromosome",
    ],
    correctAnswer: "Extra chromosome 21",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Missing chromosome 21",
          feedback:
            "Missing a chromosome causes different conditions. Down syndrome is trisomy 21 - having THREE copies of chromosome 21.",
        },
      ],
      defaultFeedback:
        "Down syndrome (trisomy 21) results from three copies of chromosome 21 instead of the usual two - a chromosomal mutation (Mgbanwe Ihe Nketa).",
    },
  },
  {
    id: "q-g-13",
    type: QuestionType.TRUE_FALSE,
    questionText: "DNA is found in the nucleus of eukaryotic cells.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. In eukaryotes (plants, animals), DNA (Ihe Nketa Ndụ) is stored in the nucleus (Isi Mkpụrụ Ndụ), wound around proteins as chromosomes.",
        },
      ],
      defaultFeedback:
        "Correct! In eukaryotic cells, DNA (Ihe Nketa Ndụ) is stored in the nucleus (Isi Mkpụrụ Ndụ), organised into chromosomes (Usoro Ihe Nketa).",
    },
  },
  {
    id: "q-g-14",
    type: QuestionType.SHORT_ANSWER,
    questionText: "What are the four bases found in DNA?",
    options: null,
    correctAnswer: "A, T, C, G",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "A, U, C, G",
          feedback:
            "Uracil (U) is found in RNA, not DNA. The four DNA bases are Adenine (A), Thymine (T), Cytosine (C), and Guanine (G).",
        },
      ],
      defaultFeedback:
        "The four DNA bases are: Adenine (A), Thymine (T), Cytosine (C), and Guanine (G). In RNA, Uracil replaces Thymine.",
    },
  },
  {
    id: "q-g-15",
    type: QuestionType.MCQ,
    questionText:
      "In codominance, what happens when two different alleles are present?",
    options: [
      "One is always hidden",
      "Both are fully expressed",
      "One is always dominant",
      "Neither is expressed",
    ],
    correctAnswer: "Both are fully expressed",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "One is always hidden",
          feedback:
            "That describes standard dominance/recessiveness. In codominance, BOTH alleles are fully expressed simultaneously - neither is hidden.",
        },
      ],
      defaultFeedback:
        "In codominance, both alleles are fully expressed when present together. E.g. in AB blood group, both A and B antigens are produced.",
    },
  },
  {
    id: "q-g-16",
    type: QuestionType.TRUE_FALSE,
    questionText: "Huntington's disease can be inherited from just one parent.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. Huntington's is caused by a DOMINANT allele (Ihe Nketa Siri Ike) - inheriting just one copy from one parent is enough to develop the disease.",
        },
      ],
      defaultFeedback:
        "Correct! Huntington's disease is autosomal dominant - one copy of the allele (Ụdị Ihe Nketa) from either parent is sufficient to cause it.",
    },
  },
  {
    id: "q-g-17",
    type: QuestionType.MCQ,
    questionText: "What is the shape of the DNA molecule?",
    options: ["Single helix", "Double helix", "Triple helix", "Linear strand"],
    correctAnswer: "Double helix",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Single helix",
          feedback:
            "DNA (Ihe Nketa Ndụ) has TWO strands twisted together - a double helix, like a twisted ladder. This structure was discovered by Watson and Crick in 1953.",
        },
      ],
      defaultFeedback:
        "DNA (Ihe Nketa Ndụ) is a double helix - two complementary strands twisted around each other, held together by hydrogen bonds between base pairs.",
    },
  },
  {
    id: "q-g-18",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What term describes the observable characteristics of an organism?",
    options: null,
    correctAnswer: "phenotype",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "genotype",
          feedback:
            "Genotype (Ihe Nketa Ndụ) is the genetic makeup. Phenotype (Ihe A Na-Ahụ N'Ihe Dị Ndụ) is what you can observe - e.g. eye colour, height.",
        },
      ],
      defaultFeedback:
        "Phenotype (Ihe A Na-Ahụ N'Ihe Dị Ndụ) is the observable characteristic - the result of genotype interacting with the environment.",
    },
  },
  {
    id: "q-g-19",
    type: QuestionType.MCQ,
    questionText:
      "A carrier of a recessive genetic disorder has which genotype?",
    options: [
      "Homozygous dominant (AA)",
      "Heterozygous (Aa)",
      "Homozygous recessive (aa)",
      "No alleles for the gene",
    ],
    correctAnswer: "Heterozygous (Aa)",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "Homozygous dominant (AA)",
          feedback:
            "AA has no recessive allele to pass on - they cannot be a carrier. A carrier has one dominant and one recessive allele: Aa (heterozygous).",
        },
        {
          pattern: "Homozygous recessive (aa)",
          feedback:
            "aa would HAVE the disease (if aa is the affected genotype). A carrier has the disease allele but is unaffected: Aa (heterozygous).",
        },
      ],
      defaultFeedback:
        "A carrier is heterozygous (Aa) - they have one normal dominant allele and one recessive disease allele, but do not show symptoms themselves.",
    },
  },
  {
    id: "q-g-20",
    type: QuestionType.TRUE_FALSE,
    questionText: "Mutations can be caused by UV radiation.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True. UV radiation can damage DNA and cause mutations (Mgbanwe Ihe Nketa), including the type associated with skin cancer.",
        },
      ],
      defaultFeedback:
        "Correct! UV radiation is a known mutagen - it can alter the DNA base sequence, potentially causing cancer-causing mutations (Mgbanwe Ihe Nketa).",
    },
  },
  {
    id: "q-g-21",
    type: QuestionType.MCQ,
    questionText: "What is the sex chromosome combination in human females?",
    options: ["XY", "YY", "XX", "X only"],
    correctAnswer: "XX",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "XY",
          feedback:
            "XY is the male sex chromosome combination. Human females are XX - two X chromosomes.",
        },
      ],
      defaultFeedback:
        "Human females have two X chromosomes (XX). Males have one X and one Y (XY). The Y chromosome carries the gene for male sex determination.",
    },
  },
  {
    id: "q-g-22",
    type: QuestionType.SHORT_ANSWER,
    questionText:
      "What is the name of the chart used to predict offspring genotype ratios?",
    options: null,
    correctAnswer: "Punnett square",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "family tree",
          feedback:
            "A family tree (pedigree) shows inherited traits across generations. A Punnett square specifically predicts genotype ratios for a single cross.",
        },
      ],
      defaultFeedback:
        "A Punnett square is the grid used to predict the probability of genotypes and phenotypes in offspring from a given genetic cross.",
    },
  },
  {
    id: "q-g-23",
    type: QuestionType.MCQ,
    questionText:
      "Which blood group is the universal donor for red blood cells?",
    options: ["AB", "A", "B", "O"],
    correctAnswer: "O",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "AB",
          feedback:
            "AB is the universal RECIPIENT (can receive any blood type). Blood group O (no A or B antigens) is the universal donor.",
        },
      ],
      defaultFeedback:
        "Blood group O is the universal donor - O red blood cells have no A or B antigens, so they won't trigger immune reactions in any recipient.",
    },
  },
  {
    id: "q-g-24",
    type: QuestionType.TRUE_FALSE,
    questionText: "Every cell in a person's body has the same DNA.",
    options: ["True", "False"],
    correctAnswer: "True",
    feedbackRules: {
      misconceptions: [
        {
          pattern: "False",
          feedback:
            "True (with minor exceptions like gametes and mature red blood cells). Every body cell contains the same DNA (Ihe Nketa Ndụ), copied during cell division.",
        },
      ],
      defaultFeedback:
        "Correct! Every body cell has the same DNA (Ihe Nketa Ndụ) - produced by mitosis from the original fertilised egg. Different cell types express different genes, but the DNA is identical.",
    },
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
    description:
      "Explore how forces cause objects to accelerate, decelerate, and change direction using Newton's Laws.",
    duration: "30 mins",
    order: 9,
    lessonId: "lesson-forces-1",
    lessonContent: LESSON_FORCES,
    keyTerms: KT_FORCES,
    questions: Q_FORCES,
  });
  await seedTopic({
    id: "topic-atom",
    title: "The Atom",
    description:
      "Understand the structure of the atom, subatomic particles, and how the periodic table is organised.",
    duration: "25 mins",
    order: 10,
    lessonId: "lesson-atom-1",
    lessonContent: LESSON_ATOM,
    keyTerms: KT_ATOM,
    questions: Q_ATOM,
  });
  await seedTopic({
    id: "topic-circulatory-system",
    title: "Human Circulatory System",
    description:
      "Trace the path of blood through the heart and body, and learn how oxygen and nutrients are delivered to cells.",
    duration: "25 mins",
    order: 11,
    lessonId: "lesson-circ-1",
    lessonContent: LESSON_CIRCULATION,
    keyTerms: KT_CIRCULATION,
    questions: Q_CIRCULATION,
  });
  await seedTopic({
    id: "topic-plant-biology",
    title: "Plant Biology",
    description:
      "Study plant organs, transport systems, hormones, and how plants respond to their environment.",
    duration: "25 mins",
    order: 12,
    lessonId: "lesson-plant-1",
    lessonContent: LESSON_PLANTS,
    keyTerms: KT_PLANTS,
    questions: Q_PLANTS,
  });
  await seedTopic({
    id: "topic-chemical-reactions",
    title: "Chemical Reactions",
    description:
      "Understand what happens during chemical reactions, reaction types, rates, and energy changes.",
    duration: "30 mins",
    order: 13,
    lessonId: "lesson-chem-1",
    lessonContent: LESSON_CHEMISTRY,
    keyTerms: KT_CHEMISTRY,
    questions: Q_CHEMISTRY,
  });
  await seedTopic({
    id: "topic-nervous-system",
    title: "Human Nervous System",
    description:
      "Learn how the brain, spinal cord, and nerves coordinate rapid responses to stimuli.",
    duration: "25 mins",
    order: 14,
    lessonId: "lesson-nerve-1",
    lessonContent: LESSON_NERVOUS,
    keyTerms: KT_NERVOUS,
    questions: Q_NERVOUS,
  });
}

// ═══════════════════════════════════════════════════════════════════
// LESSON CONTENT - TOPICS 9–14
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
    options: [
      "An object at rest stays at rest",
      "F = ma",
      "Every action has an equal and opposite reaction",
      "Energy is conserved",
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
    options: ["True", "False"],
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
    options: null,
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
    options: ["Acceleration", "Force", "Distance travelled", "Momentum"],
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
    options: ["True", "False"],
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
    options: ["1.67 N", "8 N", "15 N", "0.6 N"],
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
    options: null,
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
    options: [
      "Speed has direction; velocity does not",
      "Velocity has direction; speed does not",
      "They are identical",
      "Speed is measured in m/s; velocity in km/h",
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
    options: ["True", "False"],
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
    options: [
      "A large force",
      "A small force",
      "Zero force",
      "Its weight only",
    ],
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
    options: null,
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
    options: ["True", "False"],
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
    options: ["Gravity", "Normal force", "Air resistance", "Tension"],
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
    options: [
      "Only gravity acts",
      "Only air resistance acts",
      "Forces are balanced",
      "Gravity is greater than drag",
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
    options: ["True", "False"],
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
    options: ["3 kg·m/s", "8 kg·m/s", "12 kg·m/s", "36 kg·m/s"],
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
    options: null,
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
    options: [
      "Horizontal line on distance-time graph",
      "Curved line on distance-time graph",
      "Straight sloped line on velocity-time graph",
      "Horizontal line on velocity-time graph",
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
    options: ["True", "False"],
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
    options: ["Doubles", "Triples", "Quadruples", "Stays the same"],
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
    options: null,
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
    options: ["True", "False"],
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
    options: [
      "Electrons only",
      "Protons and neutrons",
      "Neutrons only",
      "Protons only",
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
    options: ["+1", "0", "−1", "−2"],
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
    options: ["True", "False"],
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
    options: null,
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
    options: ["2", "4", "8", "18"],
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
    options: ["True", "False"],
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
    options: [
      "An atom with extra neutrons",
      "An atom that has gained or lost electrons",
      "A radioactive atom",
      "A molecule",
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
    options: [
      "Same mass number",
      "Same number of outer electrons",
      "Same number of neutrons",
      "Same physical state",
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
    options: ["True", "False"],
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
    options: null,
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
    options: [
      "Different elements",
      "Isotopes of carbon",
      "Ions of carbon",
      "Allotropes of carbon",
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
    options: ["True", "False"],
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
    options: ["Alpha", "Beta", "Gamma", "All three"],
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
    options: null,
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
    options: ["Proton", "Neutron", "Electron", "They are all equal"],
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
    options: ["True", "False"],
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
    options: ["2,9", "2,8,1", "3,8", "2,6,3"],
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
    options: [
      "By atomic mass",
      "By alphabetical order",
      "By atomic number",
      "By density",
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
    options: ["True", "False"],
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
    options: null,
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
    options: ["Left", "Right", "Both sides simultaneously", "Neither"],
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
    options: [
      "Speed up blood flow",
      "Prevent backflow of blood",
      "Produce blood cells",
      "Regulate heart rate",
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
    options: ["True", "False"],
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
    options: null,
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
    options: ["Artery", "Vein", "Capillary", "Aorta"],
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
    options: ["True", "False"],
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
    options: [
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
    options: [
      "Carry oxygen",
      "Clot blood",
      "Defend against disease",
      "Carry nutrients",
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
    options: ["True", "False"],
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
    options: null,
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
    options: [
      "Ventricles contract",
      "Blood is pumped to the body",
      "Heart muscle relaxes and chambers fill",
      "Valves close permanently",
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
    options: ["True", "False"],
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
    options: [
      "Only oxygen",
      "Only red blood cells",
      "Nutrients, hormones, CO₂, and waste",
      "Only white blood cells",
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
    options: ["True", "False"],
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
    options: ["Asthma", "Coronary heart disease", "Diabetes", "Anaemia"],
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
    options: null,
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
    options: ["True", "False"],
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
    options: [
      "Heart to body and back",
      "Heart to lungs and back",
      "Lungs to kidneys",
      "Brain to heart",
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
    options: ["True", "False"],
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
    options: ["Pulmonary artery", "Aorta", "Pulmonary vein", "Vena cava"],
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
    options: [
      "Transport sugars",
      "Transport water and minerals upward",
      "Store food",
      "Carry out photosynthesis",
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
    options: ["True", "False"],
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
    options: [
      "Active pumping by roots",
      "Transpiration pull from leaves",
      "Phloem pressure",
      "Gravity",
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
    options: null,
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
    options: [
      "Growth response to gravity",
      "Growth response to light",
      "Growth response to water",
      "Growth response to touch",
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
    options: ["True", "False"],
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
    options: ["Osmosis", "Translocation", "Transpiration", "Photosynthesis"],
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
    options: [
      "High humidity",
      "Darkness",
      "Low wind speed",
      "High temperature",
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
    options: ["True", "False"],
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
    options: null,
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
    options: ["Petal", "Ovule", "Stigma", "Anther"],
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
    options: ["True", "False"],
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
    options: ["Auxin", "Gibberellin", "Ethylene", "Cytokinin"],
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
    options: ["Mitochondria", "Vacuole", "Chloroplast", "Ribosome"],
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
    options: ["True", "False"],
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
    options: null,
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
    options: ["Transpiration", "Diffusion", "Translocation", "Osmosis"],
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
    options: ["True", "False"],
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
    options: [
      "Absorb light",
      "Reduce water loss",
      "Allow gas exchange",
      "Trap insects",
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
    options: null,
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
    options: [
      "Absorbs heat from surroundings",
      "Releases heat to surroundings",
      "Has no energy change",
      "Only occurs in labs",
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
    options: ["True", "False"],
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
    options: [
      "Gets used up in the reaction",
      "Increases activation energy",
      "Speeds up reaction without being consumed",
      "Decreases the temperature",
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
    options: ["0", "7", "14", "4"],
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
    options: ["True", "False"],
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
    options: null,
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
    options: ["Exothermic", "Endothermic", "Neutralisation", "Combustion"],
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
    options: ["Temperature", "Catalyst", "Colour of reactants", "Surface area"],
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
    options: ["True", "False"],
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
    options: null,
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
    options: [
      "Burning wood",
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
    options: ["True", "False"],
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
    options: ["A gas", "A solution", "An insoluble solid", "An acid"],
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
    options: null,
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
    options: [
      "Mass of products > mass of reactants",
      "No atoms are created or destroyed",
      "Temperature is conserved",
      "Only metals conserve mass",
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
    options: ["True", "False"],
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
    options: [
      "Salt and water",
      "Salt and hydrogen gas",
      "Salt and CO₂",
      "Water and CO₂",
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
    options: ["Decomposition", "Synthesis", "Displacement", "Neutralisation"],
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
    options: ["True", "False"],
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
    options: null,
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
    options: ["Hydrogen", "Oxygen", "Carbon dioxide", "Nitrogen"],
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
    options: ["True", "False"],
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
    options: [
      "Sensory, relay, motor",
      "Brain, spine, nerve",
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
    options: ["True", "False"],
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
    options: ["Electrical impulse", "Enzyme", "Neurotransmitter", "Hormone"],
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
    options: [
      "Brain → muscle → response",
      "Stimulus → receptor → sensory neurone → relay → motor neurone → effector",
      "Effector → brain → muscle",
      "Receptor → brain → effector",
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
    options: null,
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
    options: ["True", "False"],
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
    options: [
      "Produce neurotransmitters",
      "Insulate the axon and speed up impulses",
      "Store memories",
      "Connect neurones at synapses",
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
    options: ["Cerebrum", "Cerebellum", "Medulla oblongata", "Hypothalamus"],
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
    options: ["True", "False"],
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
    options: null,
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
    options: [
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
    options: ["True", "False"],
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
    options: [
      "Medulla oblongata",
      "Spinal cord alone",
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
    options: null,
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
    options: [
      "A response by the body",
      "A type of neurone",
      "A change in the environment detected by receptors",
      "A brain chemical",
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
    options: ["True", "False"],
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
    options: [
      "Digestive system",
      "Circulatory system",
      "Endocrine (hormonal) system",
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
    options: [
      "Transmit impulses away from cell body",
      "Receive signals from other neurones",
      "Produce neurotransmitters",
      "Insulate the neurone",
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
    options: ["True", "False"],
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
    options: ["Cerebellum", "Medulla oblongata", "Cerebrum", "Hypothalamus"],
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
    console.log("✅ All extra topics seeded (topics 9–14)");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
