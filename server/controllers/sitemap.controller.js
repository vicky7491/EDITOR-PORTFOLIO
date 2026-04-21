const Project = require('../models/Project');

const SITE_URL = 'https://vickyvfx.me';

const STATIC_ROUTES = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/portfolio', priority: '0.9', changefreq: 'weekly' },
  { url: '/services', priority: '0.8', changefreq: 'monthly' },
  { url: '/testimonials', priority: '0.7', changefreq: 'monthly' },
  { url: '/contact', priority: '0.6', changefreq: 'yearly' },
];

exports.getSitemap = async (req, res) => {
  try {
    const projects = await Project.find({ status: 'published' })
      .select('slug updatedAt')
      .lean();

    const staticUrls = STATIC_ROUTES.map(
      ({ url, priority, changefreq }) => `
  <url>
    <loc>${SITE_URL}${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    ).join('');

    const projectUrls = projects.map(
      (p) => `
  <url>
    <loc>${SITE_URL}/portfolio/${p.slug}</loc>
    <lastmod>${new Date(p.updatedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    ).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${projectUrls}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
};