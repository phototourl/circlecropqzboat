# Circle Crop Image

Round the corners of your images – Next.js app to crop images into perfect circles.  
Supports local storage with Cloudflare R2 upload when configured.

## Development

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Environment

Copy `env.example` to `.env.local` (or set in Vercel):
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` - Google Analytics ID
- `NEXT_PUBLIC_SITE_URL` - Site URL (e.g., https://circlecropimage.qzboat.com)
- `R2_BUCKET`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_BASE_URL` (optional; if empty falls back to local)

## Deploy

- Push to GitHub and connect to Vercel.
- Add your Cloudflare R2 vars to Vercel env, redeploy.

## Related Products

Check out our other tools:
- [Photo to URL](https://phototourl.com) - Turn photos into shareable links
- [Discord Wrapped](https://discordwarpped.qzboat.com) - Personalized Discord stats
- [qzboat](https://www.qzboat.com) - Professional AI SaaS Platform

## License

MIT
