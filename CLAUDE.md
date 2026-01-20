# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 4 application using Vue 3 and TypeScript.

## Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run generate` - Generate static site

## Architecture

This project follows Nuxt 4's app directory structure:

- `app/` - Application source code (Vue components, pages, layouts, etc.)
- `public/` - Static assets served at root
- `nuxt.config.ts` - Nuxt configuration

Nuxt auto-imports Vue composables, components, and utilities. No manual imports needed for:
- Vue APIs (`ref`, `computed`, `watch`, etc.)
- Components in `app/components/`
- Composables in `app/composables/`
- Utils in `app/utils/`
