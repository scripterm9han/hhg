export const config = {
  runtime: 'edge',
};

export default function handler(request) {
  const url = new URL(request.url);
  const { searchParams } = url;

  const name = searchParams.get('n') || 'HH Goa Builder';
  const role = searchParams.get('r') || 'Builder';
  const stack = searchParams.get('s') || 'React • Node';
  const title = searchParams.get('t') || 'THE BUILDER';

  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  const isBot = /bot|facebookexternalhit|twitterbot|pinterest|linkedin|slackbot|telegrambot|whatsapp|discordbot/i.test(userAgent);

  const targetAppUrl = `${url.origin}/?${searchParams.toString()}`;
  const ogImageUrl = `${url.origin}/api/og?${searchParams.toString()}`;

  // If a human user is opening the link, redirect to the interactive SPA
  if (!isBot) {
    return Response.redirect(targetAppUrl, 302);
  }

  // If a social media crawler bot is visiting, serve pre-rendered HTML meta tags
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${name} | HH Goa 2026 Builder Frame</title>

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@HHGoa2026" />
    <meta name="twitter:title" content="${name} | ${title}" />
    <meta name="twitter:description" content="Framed @${name} for HH Goa 2026 ⚡ ${title}. See you in Goa! #FrameInGoa" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    <meta name="twitter:image:src" content="${ogImageUrl}" />
    <meta name="twitter:image:alt" content="${name} HH Goa 2026 Builder Frame" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="HH Goa 2026" />
    <meta property="og:title" content="${name} | ${title}" />
    <meta property="og:description" content="Framed @${name} for HH Goa 2026 ⚡ ${title}. See you in Goa! #FrameInGoa" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${targetAppUrl}" />
  </head>
  <body>
    <p>Redirecting to <a href="${targetAppUrl}">${name}'s HH Goa Builder Frame</a>...</p>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
