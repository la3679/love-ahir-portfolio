/**
 * Evidence-backed technology catalog shared by the hero rails and the
 * Capabilities section.
 *
 * Vendor artwork is self-hosted from pinned Devicon and Simple Icons commits:
 * - Devicon: 7330accdbc47e2dc0c19789a48533c4a3c50fe58
 * - Simple Icons: 34c22501f9ac9f22b12f825677ccbab1fb22e14b
 *
 * The grouping is deliberately narrower than the legacy toolkit list. Every
 * entry below is traceable to a dated role in `portfolio.ts` + `en-US.ts`, or
 * to a named project/case study. Docker and Selenium stay out until comparable
 * project-or-role evidence exists.
 */

export interface TechnologyDefinition {
  readonly name: string;
  readonly icon?: `/img/tech/${string}.svg`;
  readonly wide?: true;
}

export const technologies = {
  java: { name: "Java", icon: "/img/tech/java.svg" },
  springBoot: { name: "Spring Boot", icon: "/img/tech/spring-boot.svg" },
  python: { name: "Python", icon: "/img/tech/python.svg" },
  fastapi: { name: "FastAPI", icon: "/img/tech/fastapi.svg" },
  flask: { name: "Flask", icon: "/img/tech/flask.svg" },
  react: { name: "React", icon: "/img/tech/react.svg" },
  react19: { name: "React 19", icon: "/img/tech/react.svg" },
  typescript: { name: "TypeScript", icon: "/img/tech/typescript.svg" },
  nextjs: { name: "Next.js", icon: "/img/tech/nextjs.svg" },
  reactNative: { name: "React Native", icon: "/img/tech/react.svg" },
  threejs: { name: "Three.js", icon: "/img/tech/threejs.svg" },
  glsl: { name: "GLSL" },

  aws: {
    name: "AWS (ECS/Fargate)",
    icon: "/img/tech/aws.svg",
    wide: true,
  },
  gcp: { name: "GCP", icon: "/img/tech/gcp.svg" },
  grafana: { name: "Grafana", icon: "/img/tech/grafana.svg" },
  githubActions: {
    name: "GitHub Actions",
    icon: "/img/tech/github-actions.svg",
  },

  postgresql: { name: "PostgreSQL", icon: "/img/tech/postgresql.svg" },
  mysql: { name: "MySQL", icon: "/img/tech/mysql.svg" },
  mongodb: { name: "MongoDB", icon: "/img/tech/mongodb.svg" },
  gridfs: { name: "GridFS", icon: "/img/tech/mongodb.svg" },
  neo4j: { name: "Neo4j", icon: "/img/tech/neo4j.svg" },
  redis: { name: "Redis", icon: "/img/tech/redis.svg" },
  firebase: { name: "Firebase", icon: "/img/tech/firebase.svg" },

  langgraph: { name: "LangGraph", icon: "/img/tech/langgraph.svg" },
  scikitLearn: {
    name: "scikit-learn",
    icon: "/img/tech/scikit-learn.svg",
  },
  xgboost: { name: "XGBoost" },
  gemini: { name: "Gemini", icon: "/img/tech/gemini.svg" },

  appium: { name: "Appium", icon: "/img/tech/appium.svg" },
  pytest: { name: "pytest", icon: "/img/tech/pytest.svg" },

  kafka: { name: "Kafka", icon: "/img/tech/kafka.svg" },
  cicd: { name: "CI/CD" },
  rag: { name: "RAG" },
  embeddings: { name: "Embeddings" },
} as const satisfies Record<string, TechnologyDefinition>;

export type TechnologyId = keyof typeof technologies;

export function getTechnology(id: TechnologyId): TechnologyDefinition {
  return technologies[id];
}

export const capabilityGroups = [
  {
    id: "languages",
    technologies: [
      "java",
      "springBoot",
      "python",
      "fastapi",
      "flask",
      "react",
      "react19",
      "typescript",
      "nextjs",
      "reactNative",
      "threejs",
      "glsl",
    ],
  },
  {
    id: "cloud",
    technologies: ["aws", "gcp", "grafana", "githubActions"],
  },
  {
    id: "databases",
    technologies: [
      "postgresql",
      "mysql",
      "mongodb",
      "gridfs",
      "neo4j",
      "redis",
      "firebase",
    ],
  },
  {
    id: "ai",
    technologies: ["langgraph", "scikitLearn", "xgboost", "gemini"],
  },
  {
    id: "testing",
    technologies: ["appium", "pytest"],
  },
  {
    id: "practices",
    technologies: ["kafka", "cicd", "rag", "embeddings"],
  },
] as const satisfies ReadonlyArray<{
  readonly id: string;
  readonly technologies: readonly TechnologyId[];
}>;

export type CapabilityGroupId = (typeof capabilityGroups)[number]["id"];

/** Exactly doubled by the renderer; the two source sets remain disjoint. */
export const stageTechnologyRails = {
  top: ["java", "springBoot", "react", "postgresql", "aws"],
  bottom: ["python", "fastapi", "mongodb", "appium", "threejs"],
} as const satisfies Record<"top" | "bottom", readonly TechnologyId[]>;
