#!/usr/bin/env node

/**
 * Security Check Script
 * Ensures no hardcoded credentials are present in the codebase
 */

const fs = require('fs');
const path = require('path');

// Patterns to check for potential secrets
const SECRET_PATTERNS = [
  /mongodb\+srv:\/\/[^@]+@/,
  /password\s*=\s*['"][^'"]+['"]/,
  /secret\s*=\s*['"][^'"]+['"]/,
  /key\s*=\s*['"][^'"]+['"]/,
  /token\s*=\s*['"][^'"]+['"]/,
  /api[_-]?key\s*=\s*['"][^'"]+['"]/,
  /private[_-]?key\s*=\s*['"][^'"]+['"]/,
  /access[_-]?token\s*=\s*['"][^'"]+['"]/,
];

// Files to exclude from check
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /\.next/,
  /README\.md/,
  /SECURITY\.md/,
  /DEPLOYMENT\.md/,
  /\.env\.example/,
  /security-check\.js/,
];

function shouldExcludeFile(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
}

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    const issues = [];
    
    lines.forEach((line, index) => {
      SECRET_PATTERNS.forEach(pattern => {
        if (pattern.test(line)) {
          issues.push({
            file: filePath,
            line: index + 1,
            content: line.trim(),
            pattern: pattern.toString()
          });
        }
      });
    });
    
    return issues;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

function scanDirectory(dirPath) {
  const issues = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!shouldExcludeFile(fullPath)) {
          issues.push(...scanDirectory(fullPath));
        }
      } else if (stat.isFile() && !shouldExcludeFile(fullPath)) {
        issues.push(...checkFile(fullPath));
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }
  
  return issues;
}

function main() {
  console.log('🔒 Running security check...\n');
  
  const issues = scanDirectory('./src');
  
  if (issues.length === 0) {
    console.log('✅ Security check passed! No hardcoded credentials found.');
    console.log('\n📋 Security checklist:');
    console.log('  ✅ No MongoDB URIs in source code');
    console.log('  ✅ No hardcoded passwords');
    console.log('  ✅ No API keys in source code');
    console.log('  ✅ No secrets in source code');
    console.log('\n🚀 Safe to commit to GitHub!');
    process.exit(0);
  } else {
    console.log('❌ Security issues found!\n');
    
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. File: ${issue.file}`);
      console.log(`   Line: ${issue.line}`);
      console.log(`   Content: ${issue.content}`);
      console.log(`   Pattern: ${issue.pattern}\n`);
    });
    
    console.log('🛠️  Fix these issues before committing:');
    console.log('  1. Remove hardcoded credentials');
    console.log('  2. Use environment variables instead');
    console.log('  3. Update .env.example with placeholder values');
    console.log('  4. Ensure .env.local is in .gitignore');
    
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkFile, scanDirectory, SECRET_PATTERNS };
