import { FileText, Youtube, Globe, FileType, Type } from 'lucide-react';

const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

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

export function getSourceIcon(sourceType) {
  switch (sourceType) {
    case 'pdf': return FileText;
    case 'youtube': return Youtube;
    case 'url': return Globe;
    case 'docx': return FileType;
    default: return Type;
  }
}

export function getSourceLabel(sourceType, sourceInfo) {
  switch (sourceType) {
    case 'pdf':
      return `PDF${sourceInfo?.pageCount ? ` \u00B7 ${sourceInfo.pageCount} pages` : ''}`;
    case 'youtube':
      return `YouTube${sourceInfo?.videoDuration ? ` \u00B7 ${sourceInfo.videoDuration}` : ''}`;
    case 'url':
      return `Article${sourceInfo?.domain ? ` \u00B7 ${sourceInfo.domain}` : ''}`;
    case 'docx':
      return 'Word Document';
    default:
      return 'Text';
  }
}

export function getFormatColor(format) {
  const colors = {
    cornellNotes: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    timeline: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    flashcards: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    infographic: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    keyTakeaways: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    knowledgeCards: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  };
  return colors[format] || 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
}

export function getSourceColor(sourceType) {
  const colors = {
    pdf: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
    youtube: { bg: 'bg-red-500/10', text: 'text-red-400' },
    url: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    docx: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
    text: { bg: 'bg-zinc-500/10', text: 'text-zinc-400' },
  };
  return colors[sourceType] || colors.text;
}
