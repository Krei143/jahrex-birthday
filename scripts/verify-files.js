#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying project files for deployment...\n');

const requiredFiles = [
  // Core Next.js files
  'package.json',
  'next.config.js',
  'tsconfig.json',
  'postcss.config.mjs',
  'netlify.toml',
  
  // App files
  'app/layout.tsx',
  'app/page.tsx',
  'app/globals.css',
  
  // Component files
  'components/ParticleSystem.tsx',
  'components/HandGestureDetector.tsx',
  'components/WelcomeScreen.tsx',
  'components/DownloadOptions.tsx',
  'components/EnhancedControls.tsx',
  'components/ConfettiEffect.tsx',
  'components/AudioManager.tsx',
  'components/InstructionOverlay.tsx',
  'components/ShareMessage.tsx',
  
  // UI components
  'components/ui/button.tsx',
  'components/ui/card.tsx',
  
  // Utils
  'lib/utils.ts',
  
  // Types
  'types/gesture.ts',
];

let allFilesExist = true;
let missingFiles = [];

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING!`);
    allFilesExist = false;
    missingFiles.push(file);
  }
});

console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('✅ All required files exist!');
  console.log('\n📦 Ready to deploy to Netlify!');
  console.log('\nNext steps:');
  console.log('1. git add .');
  console.log('2. git commit -m "Ready for deployment"');
  console.log('3. git push');
  console.log('4. Connect to Netlify via GitHub');
  process.exit(0);
} else {
  console.log(`❌ Missing ${missingFiles.length} required file(s):`);
  missingFiles.forEach(file => console.log(`   - ${file}`));
  console.log('\n⚠️  Deployment may fail. Please ensure all files exist.');
  process.exit(1);
}
