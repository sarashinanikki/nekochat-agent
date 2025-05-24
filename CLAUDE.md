# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Discord AI conversation analysis platform that helps users understand and organize Discord conversations through AI-powered insights. The project uses Next.js frontend with Supabase backend and Mastra AI agent framework.

## Tech Stack

- **Frontend:** Next.js with TypeScript
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **AI Framework:** Mastra AI agent framework
- **LLM:** Google Gemini API
- **Discord Integration:** Discord.js
- **External APIs:** Web search APIs (Google Custom Search, SerpAPI)

## Project Architecture

**Core Approach:** On-demand Discord data fetching with AI analysis

1. **Data Flow:**
   - User requests analysis via web UI
   - Supabase Functions orchestrate Mastra AI agents
   - Agents fetch Discord data on-demand via Discord API
   - Gemini API analyzes conversations
   - Results stored in Supabase and displayed in UI

2. **Directory Structure (Planned):**
   - `/web/` - Next.js frontend application
   - `/supabase/functions/` - Supabase Edge Functions
   - `/agents/` - Mastra AI agents
   - `/docs/` - Project documentation and plans

## Key Features

- **Information Organization:** Extract key points, decisions, questions from Discord conversations
- **Research:** Investigate mentioned terms using external APIs
- **Explanation:** Generate plain-language explanations of complex discussions
- **Visualization:** Mind maps, Q&A lists, topic classification

## Development Phases

The project follows a 5-phase development plan documented in `/docs/development_plan.yaml`:

1. **Phase 1:** Core PoC (Discord data → AI analysis → Web UI)
2. **Phase 2:** Advanced features (keyword extraction, topic classification)
3. **Phase 3:** Authentication, error handling, robustness
4. **Phase 4:** Advanced UI/UX, mind maps, interactive features
5. **Phase 5:** Testing, evaluation, improvements

## Implementation Notes

- Target audience: Small friend groups (<5 people)
- Focus on simplicity over complex infrastructure
- TypeScript-unified stack
- No message archiving - fetch Discord data on-demand
- Web application as primary interface

## Documentation

Key planning documents in `/docs/`:
- `framework.md` - Technical architecture details
- `development_plan.yaml` - 5-phase roadmap
- `implementation_plan.yaml` - Detailed tasks
- `project.md` - Original requirements (Japanese)