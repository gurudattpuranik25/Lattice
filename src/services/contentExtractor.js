import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function extractFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageCount = pdf.numPages;
  let fullText = '';

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n\n';
  }

  return {
    text: fullText.trim(),
    sourceInfo: {
      fileName: file.name,
      fileSize: file.size,
      pageCount,
    },
  };
}

export async function extractFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });

  return {
    text: result.value.trim(),
    sourceInfo: {
      fileName: file.name,
      fileSize: file.size,
    },
  };
}

export async function extractFromTxt(file) {
  const text = await file.text();
  return {
    text: text.trim(),
    sourceInfo: {
      fileName: file.name,
      fileSize: file.size,
    },
  };
}

const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export function extractYouTubeId(url) {
  const match = url.match(YOUTUBE_REGEX);
  return match ? match[1] : null;
}

// ---- YouTube extraction: multi-backend approach ----

// Backend 1: YouTube oEmbed (always works, has CORS, but only gives title + author)
async function fetchYouTubeOEmbed(videoId) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const resp = await fetch(oembedUrl);
    if (resp.ok) return await resp.json();
  } catch { /* ignore */ }
  return null;
}

// Backend 2: Piped API instances
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.adminforge.de',
  'https://pipedapi.in.projectsegfau.lt',
  'https://api.piped.yt',
  'https://pipedapi.darkness.services',
  'https://pipedapi.drgns.space',
];

async function fetchFromPiped(videoId) {
  for (const instance of PIPED_INSTANCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const resp = await fetch(`${instance}/streams/${videoId}`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (resp.ok) {
        const data = await resp.json();
        if (data.title) return data;
      }
    } catch { /* try next */ }
  }
  return null;
}

// Backend 3: Invidious API instances
const INVIDIOUS_INSTANCES = [
  'https://inv.nadeko.net',
  'https://invidious.fdn.fr',
  'https://invidious.nerdvpn.de',
  'https://vid.puffyan.us',
  'https://invidious.jing.rocks',
  'https://iv.datura.network',
];

async function fetchFromInvidious(videoId) {
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const resp = await fetch(`${instance}/api/v1/videos/${videoId}`, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (resp.ok) {
        const data = await resp.json();
        if (data.title) return data;
      }
    } catch { /* try next */ }
  }
  return null;
}

function decodeHtml(text) {
  const el = document.createElement('textarea');
  el.innerHTML = text;
  return el.value;
}

function parseCaptionXml(xml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const texts = doc.querySelectorAll('text');
  if (!texts.length) return '';
  return Array.from(texts)
    .map(node => decodeHtml(node.textContent.replace(/\n/g, ' ').trim()))
    .filter(Boolean)
    .join(' ');
}

function formatDuration(seconds) {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Try fetching captions from a URL (possibly through CORS proxies)
async function fetchCaptionText(captionUrl) {
  // Try direct first
  const urls = [
    captionUrl,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(captionUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(captionUrl)}`,
  ];
  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (resp.ok) {
        const text = await resp.text();
        const parsed = parseCaptionXml(text);
        if (parsed.length > 50) return parsed;
      }
    } catch { /* try next */ }
  }
  return '';
}

export async function extractFromYouTube(url) {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  let title = '';
  let author = '';
  let description = '';
  let duration = '';
  let keywords = '';
  let transcript = '';

  // Step 1: Always get basic info from oEmbed (most reliable)
  const oembed = await fetchYouTubeOEmbed(videoId);
  if (oembed) {
    title = oembed.title || '';
    author = oembed.author_name || '';
  }

  // Step 2: Try Piped API for full details + captions
  const pipedData = await fetchFromPiped(videoId);
  if (pipedData) {
    title = pipedData.title || title;
    author = pipedData.uploader || author;
    description = pipedData.description || '';
    duration = formatDuration(pipedData.duration);

    // Try to get transcript from Piped subtitles
    if (pipedData.subtitles?.length > 0) {
      const enSub = pipedData.subtitles.find(s =>
        s.code === 'en' || s.code?.startsWith('en')
      );
      const sub = enSub || pipedData.subtitles[0];
      if (sub?.url) {
        transcript = await fetchCaptionText(sub.url);
      }
    }
  }

  // Step 3: If Piped failed, try Invidious
  if (!pipedData) {
    const invData = await fetchFromInvidious(videoId);
    if (invData) {
      title = invData.title || title;
      author = invData.author || author;
      description = invData.description || invData.descriptionHtml?.replace(/<[^>]*>/g, ' ') || '';
      duration = formatDuration(invData.lengthSeconds);
      keywords = invData.keywords?.join(', ') || '';

      if (invData.captions?.length > 0) {
        const enCap = invData.captions.find(c =>
          c.language_code === 'en' || c.language_code?.startsWith('en')
        );
        const cap = enCap || invData.captions[0];
        if (cap?.url) {
          // Invidious caption URLs are relative to the instance
          for (const inst of INVIDIOUS_INSTANCES) {
            const capUrl = cap.url.startsWith('http') ? cap.url : `${inst}${cap.url}`;
            transcript = await fetchCaptionText(capUrl);
            if (transcript) break;
          }
        }
      }
    }
  }

  // Step 4: If we still have no title at all, everything failed
  if (!title) {
    throw new Error(
      'YOUTUBE_NEEDS_MANUAL_INPUT'
    );
  }

  // Step 5: Build text content
  const parts = [];
  parts.push(`Video Title: ${title}`);
  if (author) parts.push(`Channel: ${author}`);

  if (transcript && transcript.length > 50) {
    parts.push(`\nFull Transcript:\n${transcript}`);
  } else {
    if (description && description.length > 20) {
      parts.push(`\nVideo Description:\n${description}`);
    }
    if (keywords) parts.push(`\nTopics/Tags: ${keywords}`);
    if (!transcript) {
      parts.push('\n[Note: No transcript/captions available. Analysis is based on video metadata.]');
    }
  }

  return {
    text: parts.join('\n'),
    sourceInfo: { url, videoId, videoDuration: duration },
  };
}

const CORS_PROXIES = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

async function fetchWithProxy(url) {
  for (const proxyFn of CORS_PROXIES) {
    try {
      const proxyUrl = proxyFn(url);
      const response = await fetch(proxyUrl);
      if (response.ok) {
        return await response.text();
      }
    } catch {
      // try next proxy
    }
  }
  throw new Error('All proxies failed');
}

export async function extractFromURL(url) {
  try {
    const html = await fetchWithProxy(url);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove scripts, styles, navs, footers
    const removeTags = ['script', 'style', 'nav', 'footer', 'header', 'aside', 'iframe', 'noscript'];
    removeTags.forEach(tag => {
      doc.querySelectorAll(tag).forEach(el => el.remove());
    });

    // Try to find main content
    const article = doc.querySelector('article') || doc.querySelector('[role="main"]') || doc.querySelector('main') || doc.body;
    const text = article.textContent.replace(/\s+/g, ' ').trim();

    if (text.length < 100) {
      throw new Error('Could not extract enough content');
    }

    const domain = new URL(url).hostname.replace('www.', '');
    return {
      text,
      sourceInfo: {
        url,
        domain,
      },
    };
  } catch {
    throw new Error('Could not extract content from this URL. Please try pasting the article text directly.');
  }
}

export function extractFromText(text) {
  return {
    text: text.trim(),
    sourceInfo: {},
  };
}

export async function extractContent(input) {
  if (input instanceof File) {
    const ext = input.name.split('.').pop().toLowerCase();
    if (ext === 'pdf') return extractFromPDF(input);
    if (ext === 'docx' || ext === 'doc') return extractFromDocx(input);
    if (ext === 'txt') return extractFromTxt(input);
    throw new Error(`Unsupported file type: .${ext}`);
  }

  if (typeof input === 'string') {
    if (YOUTUBE_REGEX.test(input)) return extractFromYouTube(input);
    if (input.startsWith('http://') || input.startsWith('https://')) return extractFromURL(input);
    return extractFromText(input);
  }

  throw new Error('Unsupported input type');
}

export function detectSourceType(input) {
  if (input instanceof File) {
    const ext = input.name.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'docx' || ext === 'doc') return 'docx';
    return 'text';
  }
  if (typeof input === 'string') {
    if (YOUTUBE_REGEX.test(input)) return 'youtube';
    if (input.startsWith('http://') || input.startsWith('https://')) return 'url';
    return 'text';
  }
  return 'text';
}
