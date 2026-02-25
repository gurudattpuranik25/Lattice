import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

export async function exportToPNG(element, filename = 'lattice-export') {
  const dataUrl = await toPng(element, {
    backgroundColor: '#09090B',
    pixelRatio: 2,
    style: {
      transform: 'none',
    },
  });

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
}

export async function exportToJPG(element, filename = 'lattice-export') {
  const dataUrl = await toJpeg(element, {
    backgroundColor: '#09090B',
    pixelRatio: 2,
    quality: 0.95,
  });

  const link = document.createElement('a');
  link.download = `${filename}.jpg`;
  link.href = dataUrl;
  link.click();
}

export async function exportToPDF(element, filename = 'lattice-export') {
  const dataUrl = await toPng(element, {
    backgroundColor: '#09090B',
    pixelRatio: 2,
  });

  const img = new Image();
  img.src = dataUrl;
  await new Promise((resolve) => { img.onload = resolve; });

  const pdf = new jsPDF({
    orientation: img.width > img.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [img.width / 2, img.height / 2],
  });

  pdf.addImage(dataUrl, 'PNG', 0, 0, img.width / 2, img.height / 2);
  pdf.save(`${filename}.pdf`);
}

export function copyTextToClipboard(text) {
  return navigator.clipboard.writeText(text);
}
