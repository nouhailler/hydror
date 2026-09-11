/**
 * Utility to generate dynamic image links and export images directly from SVG/HTML elements.
 */

export function exportSvgToDataUrl(svgElement: SVGSVGElement): string {
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgElement);

  // Add name spaces if missing
  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  // Create well-formatted dynamic Data URL
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const downloadLink = document.createElement('a');
  downloadLink.href = dataUrl;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export function convertSvgToPngDataUrl(
  svgElement: SVGSVGElement,
  width = 1200,
  height = 900
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const svgDataUrl = exportSvgToDataUrl(svgElement);
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        // Fill dark slate background
        ctx.fillStyle = '#070e1d';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(image, 0, 0, width, height);
        const pngUrl = canvas.toDataURL('image/png');
        resolve(pngUrl);
      };
      image.onerror = (err) => reject(err);
      image.src = svgDataUrl;
    } catch (e) {
      reject(e);
    }
  });
}
