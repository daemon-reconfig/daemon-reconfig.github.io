import { NextRequest, NextResponse } from 'next/server';

function stripScripts(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<noscript[\s\S]*?>[\s\S]*?<\/noscript>/gi, '');
}

function toRetroDocument(url: string, html: string) {
  const safeHtml = stripScripts(html);
  const titleMatch = safeHtml.match(/<title[^>]*>(.*?)<\/title>/i);
  const title = titleMatch?.[1] ?? url;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <base href="${url}" />
    <style>
      body { font-family: Arial, sans-serif; margin: 16px; line-height: 1.5; }
      .banner { background: #090812; color: #6cf2ff; padding: 8px; margin-bottom: 12px; }
      img, video { max-width: 100%; height: auto; }
      a { color: #1d4ed8; }
    </style>
  </head>
  <body>
    <div class="banner">Retro Browser Proxy Mode • ${title}</div>
    ${safeHtml}
  </body>
</html>`;
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get('url');
  if (!rawUrl) {
    return NextResponse.json({ html: '<h1>Missing URL</h1>' }, { status: 400 });
  }

  try {
    const target = new URL(rawUrl);
    const response = await fetch(target.toString(), {
      headers: {
        'User-Agent': 'RetroBrowser/1.0',
      },
      cache: 'no-store',
    });

    const html = await response.text();
    return NextResponse.json({ html: toRetroDocument(target.toString(), html) });
  } catch {
    return NextResponse.json(
      { html: '<h1>Unable to load URL</h1><p>Try another address.</p>' },
      { status: 500 }
    );
  }
}
