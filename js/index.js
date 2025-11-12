// Regex to match headers <h1> ... <h6>
const headerRegex = /<h([1-6]).*?>(.*?)<\/h\1>/gis;

const fileInput = document.getElementById('fileInput');
const output = document.getElementById('output');
const copyBtn = document.getElementById('copyBtn');

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        const html = e.target.result;
        const matches = [...html.matchAll(headerRegex)];

        // Build markdown Table of Contents
        const tocLines = matches.map(([, level, content]) => {
            const text = content.replace(/<[^>]*>/g, '').trim();
            const idMatch = content.match(/id=["']([^"']+)["']/i);
            const id = idMatch
                ? idMatch[1]
                : text
                    .replace(/[^\p{L}\p{N}_-]+/gu, '-')
                    .replace(/^-+|-+$/g, '');
            const indent = '  '.repeat(Number(level) - 1);
            return `${indent}- [${text}](https://lowresnx.inutilis.com/docs/manual.html#${id})`;
        });

        output.value = tocLines.join('\n') || 'No headers found.';
    };
    reader.readAsText(file);
});

copyBtn.addEventListener('click', () => {
    output.select();
    document.execCommand('copy');
    copyBtn.textContent = 'Copied!';
    setTimeout(() => (copyBtn.textContent = 'Copy to Clipboard'), 2000);
});