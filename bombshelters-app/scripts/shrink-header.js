const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'components', 'layout', 'Header.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const isCRLF = content.includes('\r\n');
let norm = content.replace(/\r\n/g, '\n');

// 1. Shrink header main row
const targetHeaderRow = 'site-container h-14 sm:h-[72px] lg:h-20 3xl:h-[100px] flex items-center justify-between gap-2 sm:gap-6 xl:gap-10';
const replaceHeaderRow = 'site-container h-12 sm:h-14 lg:h-16 flex items-center justify-between gap-2 sm:gap-5 xl:gap-8';

// 2. Shrink logo
const targetLogo = 'className="h-7 xs:h-8 sm:h-9 lg:h-[46px] 3xl:h-[58px] w-auto max-w-[180px] xs:max-w-[220px] sm:max-w-none object-contain object-left transition-transform group-hover:scale-[1.02]"';
const replaceLogo = 'className="h-6 xs:h-7 sm:h-8 lg:h-[34px] xl:h-9 w-auto max-w-[150px] xs:max-w-[180px] sm:max-w-none object-contain object-left transition-transform group-hover:scale-[1.02]"';

// 3. Shrink search bar
const targetSearchForm = 'className="group/search hidden lg:flex justify-self-center w-full max-w-[560px] 3xl:max-w-[640px] items-center h-11 3xl:h-12 pl-5 pr-1 rounded-full bg-[#f2f2f3] border border-[#e2e2e5] hover:border-[#d4d4d8] focus-within:bg-white focus-within:border-[#0a0a0a] focus-within:shadow-[0_0_0_4px_rgba(10,10,10,0.06)] transition-all"';
const replaceSearchForm = 'className="group/search hidden lg:flex justify-self-center w-full max-w-[420px] xl:max-w-[480px] items-center h-9 xl:h-9.5 pl-3.5 pr-1 rounded-full bg-[#f2f2f3] border border-[#e2e2e5] hover:border-[#d4d4d8] focus-within:bg-white focus-within:border-[#0a0a0a] focus-within:shadow-[0_0_0_3px_rgba(10,10,10,0.06)] transition-all"';

const targetSearchBtn = 'className="shrink-0 h-9 3xl:h-10 px-5 rounded-full bg-[#0a0a0a] hover:bg-[#e11d1d] text-white text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d1d]"';
const replaceSearchBtn = 'className="shrink-0 h-7 xl:h-7.5 px-3.5 rounded-full bg-[#0a0a0a] hover:bg-[#e11d1d] text-white text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d1d]"';

const targetSearchIcon = 'className="w-[18px] h-[18px] shrink-0 text-[#71717a] group-focus-within/search:text-[#0a0a0a] transition-colors"';
const replaceSearchIcon = 'className="w-4 h-4 shrink-0 text-[#71717a] group-focus-within/search:text-[#0a0a0a] transition-colors"';

const targetSearchInput = 'className="flex-1 min-w-0 bg-transparent px-3 text-sm 3xl:text-[15px] text-[#0a0a0a] placeholder-[#71717a] focus:outline-none [&::-webkit-search-cancel-button]:hidden"';
const replaceSearchInput = 'className="flex-1 min-w-0 bg-transparent px-2.5 text-xs xl:text-[13px] text-[#0a0a0a] placeholder-[#71717a] focus:outline-none [&::-webkit-search-cancel-button]:hidden"';

// 4. Shrink call button
const targetCallBtn = 'className="call-pulse group/call inline-flex items-center justify-center gap-2.5 whitespace-nowrap h-9 w-9 sm:h-10 sm:w-10 md:w-auto lg:h-11 3xl:h-12 md:px-6 rounded-[6px] bg-[#e11d1d] hover:bg-[#c81414] text-white font-semibold text-[15px] 3xl:text-base shadow-[0_8px_20px_rgba(225,29,29,0.28)] hover:shadow-[0_10px_24px_rgba(225,29,29,0.38)] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d1d]"';
const replaceCallBtn = 'className="call-pulse group/call inline-flex items-center justify-center gap-2 whitespace-nowrap h-8 w-8 sm:h-8.5 sm:w-8.5 md:w-auto lg:h-9 xl:h-9.5 md:px-4 rounded-[5px] bg-[#e11d1d] hover:bg-[#c81414] text-white font-semibold text-xs xl:text-[13px] shadow-[0_4px_14px_rgba(225,29,29,0.25)] hover:shadow-[0_6px_18px_rgba(225,29,29,0.35)] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d1d]"';

const targetPhoneIcon = '<Phone className="call-ring w-[18px] h-[18px] shrink-0" />';
const replacePhoneIcon = '<Phone className="call-ring w-3.5 h-3.5 shrink-0" />';

// 5. Shrink nav bar height & text
const targetNavContainer = 'h-8 xl:h-8.5 flex items-stretch overflow-visible';
const replaceNavContainer = 'h-7.5 xl:h-8 flex items-stretch overflow-visible';

const targetNavWrap = '<div className="hidden lg:block bg-white py-1.5 border-b border-gray-100">';
const replaceNavWrap = '<div className="hidden lg:block bg-white py-1 border-b border-gray-100">';

const targetNavText = 'text-[9.5px] xl:text-[10px] 2xl:text-[11px] 3xl:text-[11.5px] font-display font-bold tracking-[0.03em] xl:tracking-[0.05em]';
const replaceNavText = 'text-[9px] xl:text-[9.5px] 2xl:text-[10.5px] 3xl:text-[11px] font-display font-bold tracking-[0.02em] xl:tracking-[0.04em]';

// 6. Shrink top red utility ribbon
const targetTopRibbon = 'site-container py-1.5 sm:py-2 flex items-center justify-between gap-3 text-xs';
const replaceTopRibbon = 'site-container py-1 sm:py-1.5 flex items-center justify-between gap-3 text-[11px] sm:text-xs';

norm = norm.replace(targetHeaderRow, replaceHeaderRow);
norm = norm.replace(targetLogo, replaceLogo);
norm = norm.replace(targetSearchForm, replaceSearchForm);
norm = norm.replace(targetSearchBtn, replaceSearchBtn);
norm = norm.replace(targetSearchIcon, replaceSearchIcon);
norm = norm.replace(targetSearchInput, replaceSearchInput);
norm = norm.replace(targetCallBtn, replaceCallBtn);
norm = norm.replace(targetPhoneIcon, replacePhoneIcon);
norm = norm.replace(targetNavContainer, replaceNavContainer);
norm = norm.replace(targetNavWrap, replaceNavWrap);
norm = norm.replace(targetNavText, replaceNavText);
norm = norm.replace(targetTopRibbon, replaceTopRibbon);

if (isCRLF) {
  norm = norm.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, norm, 'utf8');
console.log('Successfully shrunk header in Header.tsx');

