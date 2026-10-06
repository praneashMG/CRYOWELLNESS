const fs = require('fs');
const path = require('path');

const files = [
    'index.html', 'about.html', 'services.html', 'memberships.html', 'contact.html', 'home2.html'
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the <main> tag
    const mainStart = content.indexOf('<main');
    if (mainStart === -1) return;
    
    // Find the first <section> inside <main>
    const sectionStart = content.indexOf('<section', mainStart);
    if (sectionStart === -1) return;
    
    // Find the end of this section
    const sectionEnd = content.indexOf('</section>', sectionStart) + '</section>'.length;
    
    const oldSection = content.substring(sectionStart, sectionEnd);
    
    // Extract text content from old section
    // Extract h1
    let h1Match = oldSection.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    let h1Content = h1Match ? h1Match[1].trim() : 'Title';
    // Clean up classes inside h1 content (like text-accent etc, keep them or let them be)
    // Actually, in the dark overlay, text-accent might not be bright enough, but it's fine.
    
    // Extract p
    let pMatch = oldSection.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    let pContent = pMatch ? pMatch[1].trim() : 'Subtitle text goes here.';
    
    // Use a relevant image based on filename, or a generic one
    let bgUrl = 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=2070&auto=format&fit=crop';
    if (file === 'about.html') bgUrl = 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?auto=format&fit=crop&w=2070&q=80';
    if (file === 'services.html') bgUrl = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=2070&q=80';
    if (file === 'contact.html') bgUrl = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2070&q=80';
    
    const newSection = `<section class="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
        <img src="${bgUrl}" alt="Hero Background" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/60"></div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white mt-16">
        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-md">
            ${h1Content}
        </h1>

        <p class="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-8 drop-shadow">
            ${pContent}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="booking.html" class="btn-primary px-8 py-3.5 rounded-full font-bold text-sm sm:text-base shadow-lg w-full sm:w-auto text-center border-none">
                Book a Session
            </a>
            <a href="services.html" class="bg-white/10 hover:bg-white/20 text-white border border-white/30 transition-all px-8 py-3.5 rounded-full font-bold text-sm sm:text-base w-full sm:w-auto text-center backdrop-blur-sm">
                Explore Services
            </a>
        </div>
    </div>
</section>`;

    const newContent = content.substring(0, sectionStart) + newSection + content.substring(sectionEnd);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${file}`);
});
