const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'components', 'layout', 'Header.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to \n temporarily
const isCRLF = content.includes('\r\n');
const normalized = content.replace(/\r\n/g, '\n');

const targetOpen = `      <div className="hidden lg:block bg-[#111214] border-b border-white/10">
        <div className="site-container h-9 xl:h-10 3xl:h-11 flex items-stretch overflow-visible">
          <nav className="px-1 xl:px-2 flex-1 flex items-stretch justify-between flex-nowrap overflow-visible min-w-0">`;

const replacementOpen = `      <div className="hidden lg:block bg-white py-1.5 border-b border-gray-100">
        <div className="site-container">
          <div className="bg-[#111214] rounded-lg px-2 border border-white/10 shadow-xs">
            <div className="h-8 xl:h-8.5 flex items-stretch overflow-visible">
              <nav className="flex-1 flex items-stretch justify-between flex-nowrap overflow-visible min-w-0">`;

const targetClose = `          </nav>
        </div>
      </div>`;

const replacementClose = `              </nav>
            </div>
          </div>
        </div>
      </div>`;

const targetFont = 'text-[10px] xl:text-[11px] 2xl:text-[12px] 3xl:text-[13px] font-display font-bold tracking-[0.04em] xl:tracking-[0.06em]';
const replacementFont = 'text-[9.5px] xl:text-[10px] 2xl:text-[11px] 3xl:text-[11.5px] font-display font-bold tracking-[0.03em] xl:tracking-[0.05em]';

const targetChevron = '<ChevronDown className="w-3.5 h-3.5 text-white/60 group-hover:text-white transition-transform duration-200 group-hover:rotate-180" />';
const replacementChevron = '<ChevronDown className="w-2.5 h-2.5 text-white/60 group-hover:text-white transition-transform duration-200 group-hover:rotate-180" />';

if (!normalized.includes(targetOpen)) {
  console.error('targetOpen not found!');
  process.exit(1);
}
if (!normalized.includes(targetClose)) {
  console.error('targetClose not found!');
  process.exit(1);
}

let updated = normalized.replace(targetOpen, replacementOpen);
updated = updated.replace(targetClose, replacementClose);
updated = updated.replace(targetFont, replacementFont);
updated = updated.replace(targetChevron, replacementChevron);

if (isCRLF) {
  updated = updated.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, updated, 'utf8');
console.log('Successfully updated Header.tsx');

