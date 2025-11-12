// Regex to match headers <h1> ... <h6>
const headerRegex = /<h([1-6]).*?id\=\"([^ ]*?)\".*?>(.*?)<\/h\1>/gis;

const fileInput = document.getElementById('fileInput');
const output = document.getElementById('output');
const copyBtn = document.getElementById('copyBtn');
const urlInput = document.getElementById('urlInput');
let url = "";

document.addEventListener('DOMContentLoaded', () => {
    url = urlInput.value;
});

urlInput.addEventListener('change', () => {
    url = urlInput.value;
});


fileInput.addEventListener('change', () => {
    if (url === undefined) {
        alert('Waiting for the page to load, please try again after a few seconds. If the issue persists, please report it using the link below the page.');
        return;
    }
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        const html = e.target.result;
        const matches = [...html.matchAll(headerRegex)];

        // Build markdown Table of Contents
        const tocLines = matches.map(([, level, id, content]) => {
            const text = content.replace(/<[^>]*>/g, '').trim();
            // const idMatch = content.match(/id=["']([^"']+)["']/i);
            // const id = idMatch ? idMatch[1]: '';
            // console.log('content:', content, ', text:', text, ', idMatch:', idMatch, ',id:', id);
            console.log('level:', level, ', content:', content, ', text:', text, ', id:', id);
                // text
                //     .replace(/[^\p{L}\p{N}_-]+/gu, '-')
                //     .replace(/^-+|-+$/g, '');
            const indent = '  '.repeat(Number(level) - 1);
            return `${indent}- [${text}](${url}#${id})`;
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