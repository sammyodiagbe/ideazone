# Idea Zone MVP - Implementation Plan

## Overview

**Idea Zone** is a single-page web platform that transforms raw product ideas into structured, actionable documentation. Users enter an idea and the system generates:

1. Clarified idea with assumptions
2. Structured PRD
3. MVP scope (P0/P1/P2 priorities)
4. Implementation roadmap (phases)
5. Delivery timeline (sprints)
6. AI-ready implementation prompts for every feature

All sections are **interactive, editable, and exportable**.

---

## Technical Architecture

### Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **AI**: Anthropic Claude API (streaming)
- **State**: React Context + useReducer
- **Persistence**: localStorage (no database for MVP)

### Key Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| State Management | React Context + useReducer | No extra deps, sufficient for single workspace |
| AI Model | Claude 3.5 Sonnet | Best quality/speed/cost balance |
| Streaming | Yes | Essential for UX with long-form content |
| UI Pattern | Single page + collapsible sections | Full context visible, easy navigation |
| Generation Flow | Sequential cascade | Each section uses previous as context for coherence |
| Design Style | Minimal/Clean | Spacious, content-focused (like Linear/Notion) |

---

## Data Models

```typescript
// types/workspace.ts

export type Priority = 'P0' | 'P1' | 'P2';
export type SectionStatus = 'empty' | 'generating' | 'generated' | 'edited' | 'error';

export interface Feature {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  acceptanceCriteria: string[];
  implementationPrompt: string;
  estimatedEffort: 'S' | 'M' | 'L' | 'XL';
  dependencies: string[];
  phase: number;
}

export interface Section<T = string> {
  id: string;
  title: string;
  content: T;
  status: SectionStatus;
  lastGenerated?: string;
  isExpanded: boolean;
  isLocked: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  rawIdea: string;
  clarifiedIdea: Section<ClarifiedIdea | null>;
  prd: Section<PRDContent | null>;
  mvpScope: Section<MVPScope | null>;
  roadmap: Section<Roadmap | null>;
  timeline: Section<Timeline | null>;
  implementationPrompts: Section<Feature[] | null>;
  generationSettings: GenerationSettings;
}

export interface GenerationSettings {
  techStack: string;
  teamSize: 'solo' | 'small' | 'medium' | 'large';
  sprintLength: number;
  complexity: 'simple' | 'moderate' | 'complex';
}
```

---

## File Structure

```
patna/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                      # Main Idea Zone page
│   ├── globals.css
│   └── api/
│       └── generate/
│           ├── clarify/route.ts
│           ├── prd/route.ts
│           ├── mvp-scope/route.ts
│           ├── roadmap/route.ts
│           ├── timeline/route.ts
│           └── prompts/route.ts
│
├── components/
│   ├── ui/                           # Reusable primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Textarea.tsx
│   │   ├── Badge.tsx
│   │   ├── Skeleton.tsx
│   │   └── Collapsible.tsx
│   │
│   ├── workspace/                    # Workspace components
│   │   ├── IdeaInput.tsx
│   │   ├── SectionCard.tsx
│   │   ├── SectionToolbar.tsx
│   │   ├── ClarifiedIdeaSection.tsx
│   │   ├── PRDSection.tsx
│   │   ├── MVPScopeSection.tsx
│   │   ├── RoadmapSection.tsx
│   │   ├── TimelineSection.tsx
│   │   ├── PromptsSection.tsx
│   │   └── FeatureCard.tsx
│   │
│   └── export/
│       ├── ExportModal.tsx
│       └── ExportButton.tsx
│
├── lib/
│   ├── ai/
│   │   ├── client.ts
│   │   ├── prompts/
│   │   │   ├── clarify.ts
│   │   │   ├── prd.ts
│   │   │   ├── mvp-scope.ts
│   │   │   ├── roadmap.ts
│   │   │   ├── timeline.ts
│   │   │   └── implementation.ts
│   │   └── stream.ts
│   │
│   ├── storage/localStorage.ts
│   ├── export/
│   │   ├── markdown.ts
│   │   └── json.ts
│   └── utils/id.ts
│
├── context/
│   ├── WorkspaceContext.tsx
│   └── ToastContext.tsx
│
├── hooks/
│   ├── useWorkspace.ts
│   ├── useGeneration.ts
│   └── useLocalStorage.ts
│
└── types/
    ├── workspace.ts
    └── api.ts
```

---

## Implementation Phases

### Phase 1: Foundation
**Goal**: Basic structure and first AI generation

| Task | Files | Effort |
|------|-------|--------|
| Create TypeScript interfaces | `types/workspace.ts` | S |
| Build UI primitives | `components/ui/*` | M |
| Implement WorkspaceContext | `context/WorkspaceContext.tsx` | M |
| Create IdeaInput component | `components/workspace/IdeaInput.tsx` | S |
| Build clarify API endpoint | `app/api/generate/clarify/route.ts` | M |
| Create ClarifiedIdeaSection | `components/workspace/ClarifiedIdeaSection.tsx` | M |
| Basic localStorage | `lib/storage/localStorage.ts` | S |
| Wire up main page | `app/page.tsx` | M |

**Deliverable**: User enters idea → gets clarified version

---

### Phase 2: Core Sections
**Goal**: All 6 sections generating

| Task | Files | Effort |
|------|-------|--------|
| PRD prompt + endpoint | `lib/ai/prompts/prd.ts`, `app/api/generate/prd/route.ts` | M |
| MVP Scope prompt + endpoint | `lib/ai/prompts/mvp-scope.ts`, `app/api/generate/mvp-scope/route.ts` | M |
| Roadmap prompt + endpoint | `lib/ai/prompts/roadmap.ts`, `app/api/generate/roadmap/route.ts` | M |
| Timeline prompt + endpoint | `lib/ai/prompts/timeline.ts`, `app/api/generate/timeline/route.ts` | M |
| Implementation prompts endpoint | `lib/ai/prompts/implementation.ts`, `app/api/generate/prompts/route.ts` | M |
| Section components | `components/workspace/*Section.tsx` | L |
| SectionCard container | `components/workspace/SectionCard.tsx` | M |
| Add streaming to all endpoints | All API routes | M |

**Deliverable**: Full generation pipeline end-to-end

---

### Phase 3: Interactivity
**Goal**: Edit, regenerate, interaction hooks

| Task | Files | Effort |
|------|-------|--------|
| SectionToolbar component | `components/workspace/SectionToolbar.tsx` | M |
| Section locking | `context/WorkspaceContext.tsx` | S |
| Context-aware regeneration | `lib/ai/prompts/*.ts` | M |
| "Simplify for MVP" action | API routes + UI | S |
| "Add technical depth" action | API routes + UI | S |
| Inline editing | Section components | M |

**Deliverable**: Full interactivity with all sections

---

### Phase 4: Export & Polish
**Goal**: Export functionality and UX polish

| Task | Files | Effort |
|------|-------|--------|
| Markdown export | `lib/export/markdown.ts` | M |
| JSON export | `lib/export/json.ts` | S |
| ExportModal | `components/export/ExportModal.tsx` | M |
| Toast notifications | `context/ToastContext.tsx` | S |
| Loading skeletons | `components/ui/Skeleton.tsx` | S |
| Mobile responsive polish | All components | M |

**Deliverable**: Polished MVP ready for users

---

## MVP Scope

### P0 - Must Have
- [ ] Raw idea input with settings
- [ ] AI-generated clarification
- [ ] AI-generated PRD
- [ ] AI-generated MVP scope (P0/P1/P2)
- [ ] AI-generated roadmap
- [ ] AI-generated timeline
- [ ] AI-generated implementation prompts
- [ ] Section display with expand/collapse
- [ ] localStorage persistence
- [ ] Markdown export

### P1 - Should Have
- [ ] Section regeneration
- [ ] Context-aware regeneration
- [ ] Section locking
- [ ] "Simplify for MVP" action
- [ ] "Add technical depth" action
- [ ] Inline editing
- [ ] JSON export
- [ ] Toast notifications

### P2 - Future
- [ ] Notion export
- [ ] Undo/redo
- [ ] Dark mode
- [ ] Multiple workspaces
- [ ] Share via URL

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/generate/clarify` | POST | Clarify raw idea |
| `/api/generate/prd` | POST | Generate PRD |
| `/api/generate/mvp-scope` | POST | Define MVP scope |
| `/api/generate/roadmap` | POST | Create roadmap |
| `/api/generate/timeline` | POST | Generate timeline |
| `/api/generate/prompts` | POST | Generate implementation prompts |

All endpoints:
- Accept `{ rawIdea, settings, context, action }`
- Return streaming JSON response
- Pass locked sections as context for consistency

---

## Generation Flow (Sequential Cascade)

When user clicks "Generate All":

```
1. Clarified Idea → generates first
         ↓ (passes result as context)
2. PRD → generates using clarified idea
         ↓ (passes both as context)
3. MVP Scope → generates using clarified + PRD
         ↓ (passes all as context)
4. Roadmap → generates using all above
         ↓
5. Timeline → generates using all above
         ↓
6. Implementation Prompts → generates using complete context
```

**Benefits**:
- Each section builds on previous, ensuring coherence
- User sees progress section by section
- Can stop/edit at any point before continuing
- Locked sections are respected in regeneration

---

## Dependencies to Add

```bash
npm install @anthropic-ai/sdk nanoid
```

## Environment Variables

```env
ANTHROPIC_API_KEY=sk-ant-...
```

---

## UI Wireframe

```
+------------------------------------------------------------------+
|  IDEA ZONE                                        [Export v] [?] |
+------------------------------------------------------------------+
|                                                                  |
|  +------------------------------------------------------------+  |
|  |  What's your product idea?                                 |  |
|  |  [Large textarea]                                          |  |
|  |                                                            |  |
|  |  [Tech Stack v] [Team Size v] [Complexity v]               |  |
|  |                              [Generate All Sections ->]    |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  +------------------------------------------------------------+  |
|  | [v] 1. Clarified Idea              [Lock] [Regen] [...]    |  |
|  |    Summary: ...                                            |  |
|  |    Problem: ...                                            |  |
|  |    Assumptions: ...                                        |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  +------------------------------------------------------------+  |
|  | [>] 2. PRD                         [Lock] [Regen] [...]    |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  +------------------------------------------------------------+  |
|  | [>] 3. MVP Scope                   [Lock] [Regen] [...]    |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  +------------------------------------------------------------+  |
|  | [>] 4. Roadmap                     [Lock] [Regen] [...]    |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  +------------------------------------------------------------+  |
|  | [>] 5. Timeline                    [Lock] [Regen] [...]    |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  +------------------------------------------------------------+  |
|  | [>] 6. Implementation Prompts      [Lock] [Regen] [...]    |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

---

## Critical Files (Start Here)

1. **`types/workspace.ts`** - Define all data models first
2. **`context/WorkspaceContext.tsx`** - Central state management
3. **`app/api/generate/clarify/route.ts`** - First API endpoint (sets pattern)
4. **`lib/ai/prompts/clarify.ts`** - First prompt template
5. **`components/workspace/SectionCard.tsx`** - Generic section wrapper
6. **`app/page.tsx`** - Main page composition

---

## Next Steps

1. Install dependencies (`@anthropic-ai/sdk`, `nanoid`)
2. Set up environment variable for API key
3. Create types/workspace.ts
4. Build Phase 1 components
5. Test first AI generation flow
