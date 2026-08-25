import { siteConfig } from './site';

export default function sitemap() {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date('2026-08-24'),
      changeFrequency: 'weekly',
      priority: 1,
      images: [
        `${siteConfig.url}/assets/baan-ying-siam-center.jpg`,
        `${siteConfig.url}/assets/katsuya-siam-square-one.jpg`,
        `${siteConfig.url}/assets/barbq-plaza-siam-square-one.jpg`,
        `${siteConfig.url}/assets/somtam-nua-siam.jpg`,
      ],
    },
  ];
}
