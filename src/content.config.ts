import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const documents = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/documents" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    category: z.string(),
    driveId: z.string(),
    driveUrl: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updates = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/updates" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    type: z.enum(["update", "info", "important"]),
  }),
});

const rd = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/rd" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    category: z.string(),
    type: z.enum(["project", "tool", "development", "artifact", "research"]),
    thumbnail: z.string(),
    preview: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    link: z.string().optional(),
  }),
});

const collaborations = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/collaborations" }),
  schema: z.object({
    clientName: z.string(),
    clientRole: z.string(),
    clientAvatar: z.string().optional(),
    projectTitle: z.string(),
    date: z.string(),
    status: z.enum(["completed", "ongoing", "archived"]),
    contributionDiagram: z.array(z.object({
      role: z.string(),
      percentage: z.number()
    })),
    testimonial: z.object({
      text: z.string(),
      audioUrl: z.string().optional(),
      videoUrl: z.string().optional()
    }).optional(),
    linkedinUrl: z.string().optional(),
    workflow: z.array(z.object({
      phase: z.string(),
      description: z.string(),
      status: z.enum(["done", "pending"])
    })),
    tools: z.array(z.string()),
    metrics: z.array(z.object({
      label: z.string(),
      value: z.string()
    })).optional()
  }),
});

export const collections = { documents, updates, rd, collaborations };
