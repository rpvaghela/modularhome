const fs = require('fs');
const path = require('path');

// 1. Update Hero.tsx
const heroPath = path.join(__dirname, '..', 'components', 'sections', 'Hero.tsx');
let heroContent = fs.readFileSync(heroPath, 'utf8');
const heroCRLF = heroContent.includes('\r\n');
let heroNorm = heroContent.replace(/\r\n/g, '\n');

const targetHero = '<section className="w-full bg-[#ffffff] pt-2 sm:pt-4 pb-2 overflow-hidden">\n      <div className="site-container">\n        <div className="hero-fluid relative min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] flex items-center lg:flex-col lg:items-stretch overflow-hidden bg-[#0a0a0a] rounded-xl sm:rounded-2xl shadow-xl border border-[#1f2226]">';

const replaceHero = '<section className="w-full bg-[#ffffff] pt-2 sm:pt-4 overflow-hidden">\n      <div className="site-container">\n        <div className="hero-fluid relative min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] flex items-center lg:flex-col lg:items-stretch overflow-hidden bg-[#0a0a0a] rounded-t-xl sm:rounded-t-2xl border-t border-x border-[#1f2226]">';

if (!heroNorm.includes(targetHero)) {
  console.error('targetHero not found!');
  process.exit(1);
}
heroNorm = heroNorm.replace(targetHero, replaceHero);
if (heroCRLF) heroNorm = heroNorm.replace(/\n/g, '\r\n');
fs.writeFileSync(heroPath, heroNorm, 'utf8');
console.log('Hero.tsx updated successfully');

// 2. Update TrustStrip.tsx
const trustPath = path.join(__dirname, '..', 'components', 'sections', 'TrustStrip.tsx');
let trustContent = fs.readFileSync(trustPath, 'utf8');
const trustCRLF = trustContent.includes('\r\n');
let trustNorm = trustContent.replace(/\r\n/g, '\n');

const targetTrust = '<section className="bg-[#ffffff] pt-1 pb-3 sm:pb-4 overflow-hidden w-full">\n      <div className="site-container">\n        <div className="bg-[#0a0a0a] rounded-xl border border-[#1f2226] overflow-hidden shadow-md">';

const replaceTrust = '<section className="bg-[#ffffff] pb-3 sm:pb-4 overflow-hidden w-full">\n      <div className="site-container">\n        <div className="bg-[#0a0a0a] rounded-b-xl sm:rounded-b-2xl border-x border-b border-t border-[#1f2226] overflow-hidden shadow-lg">';

if (!trustNorm.includes(targetTrust)) {
  console.error('targetTrust not found!');
  process.exit(1);
}
trustNorm = trustNorm.replace(targetTrust, replaceTrust);
if (trustCRLF) trustNorm = trustNorm.replace(/\n/g, '\r\n');
fs.writeFileSync(trustPath, trustNorm, 'utf8');
console.log('TrustStrip.tsx updated successfully');

