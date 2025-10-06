#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Ensure routes-manifest.json exists after build
const routesManifestPath = path.join(process.cwd(), '.next', 'routes-manifest.json');

if (!fs.existsSync(routesManifestPath)) {
  console.log('Creating routes-manifest.json...');
  
  const routesManifest = {
    version: 3,
    pages404: true,
    caseSensitive: false,
    routes: [
      {
        page: '/',
        regex: '^/$'
      },
      {
        page: '/dashboard',
        regex: '^/dashboard$'
      },
      {
        page: '/api/auth/login',
        regex: '^/api/auth/login$'
      },
      {
        page: '/api/auth/signup',
        regex: '^/api/auth/signup$'
      },
      {
        page: '/api/vault',
        regex: '^/api/vault$'
      },
      {
        page: '/api/vault/[id]',
        regex: '^/api/vault/([^/]+?)$'
      }
    ],
    dynamicRoutes: [
      {
        page: '/api/vault/[id]',
        regex: '^/api/vault/([^/]+?)$'
      }
    ],
    staticRoutes: [
      {
        page: '/',
        regex: '^/$'
      },
      {
        page: '/dashboard',
        regex: '^/dashboard$'
      }
    ],
    dataRoutes: [
      {
        page: '/api/auth/login',
        regex: '^/api/auth/login$'
      },
      {
        page: '/api/auth/signup',
        regex: '^/api/auth/signup$'
      },
      {
        page: '/api/vault',
        regex: '^/api/vault$'
      },
      {
        page: '/api/vault/[id]',
        regex: '^/api/vault/([^/]+?)$'
      }
    ]
  };

  // Ensure .next directory exists
  const nextDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(nextDir)) {
    fs.mkdirSync(nextDir, { recursive: true });
  }

  fs.writeFileSync(routesManifestPath, JSON.stringify(routesManifest, null, 2));
  console.log('routes-manifest.json created successfully');
} else {
  console.log('routes-manifest.json already exists');
}
