# Troubleshooting Guide for Jahrex Birthday Particle System

## Common Build Issues on Netlify

### Issue 1: TypeScript Cannot Find MediaPipe Modules

**Error:**
```
Cannot find module '@mediapipe/hands' or its corresponding type declarations.
```

**Solution:**
The project includes custom type declarations in `/types/mediapipe.d.ts` that define types for MediaPipe packages. This file should be automatically picked up by TypeScript.

If the error persists:
1. Ensure `tsconfig.json` includes `"**/*.ts"` in the include array
2. Clear Netlify cache and redeploy
3. Verify `/types/mediapipe.d.ts` exists in your repository

---

### Issue 2: No Styles Loading (Plain White Page)

**Symptoms:**
- Page loads but has no colors, spacing, or design
- Everything appears as plain HTML

**Causes & Solutions:**

1. **Missing Tailwind Config**
   - Ensure `tailwind.config.ts` exists at project root
   - Verify `postcss.config.mjs` is configured correctly

2. **CSS Not Imported**
   - Check that `app/layout.tsx` imports `'./globals.css'`
   - Verify `app/globals.css` exists and contains `@import 'tailwindcss'`

3. **Netlify Build Configuration**
   - Remove explicit `publish` directory from `netlify.toml`
   - Let `@netlify/plugin-nextjs` handle the output
   - Current correct config:
   ```toml
   [build]
     command = "npm run build"
   
   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

4. **Force Rebuild**
   ```bash
   # In Netlify UI: Site settings → Build & deploy → Clear cache and deploy site
   ```

---

### Issue 3: Dependency Conflicts (React Version)

**Error:**
```
ERESOLVE could not resolve
Conflicting peer dependency: react@18.3.1
```

**Solution:**
- Ensure `@vercel/analytics` is NOT in package.json (it doesn't support React 19)
- Remove it from both `dependencies` and any imports in `app/layout.tsx`
- Run `npm install --legacy-peer-deps` locally to test

---

### Issue 4: Camera/Hand Tracking Not Working

**Symptoms:**
- Camera preview shows but hand detection doesn't work
- "Initializing camera..." message stays forever

**Solutions:**

1. **HTTPS Required**
   - Camera access requires HTTPS
   - Netlify automatically provides HTTPS (use the `.netlify.app` URL)
   - Don't use HTTP or custom domains without SSL

2. **Browser Permissions**
   - User must explicitly allow camera access
   - Check browser permissions in settings
   - Try a different browser (Chrome/Edge work best)

3. **MediaPipe Files**
   - Check browser console for 404 errors
   - MediaPipe tries to load WASM files from CDN
   - Network issues can prevent hand tracking initialization

4. **Fallback to Keyboard**
   - Press keys 0-5 to manually switch patterns
   - Spacebar toggles hand open/close
   - Arrow keys adjust scale

---

### Issue 5: Build Succeeds but App Crashes on Load

**Check Browser Console:**
1. Open browser DevTools (F12)
2. Look for JavaScript errors
3. Common issues:
   - Three.js WebGL errors (try different browser)
   - Module loading errors (check imports)
   - Memory errors (reduce particle count)

**Quick Fixes:**
- Clear browser cache
- Try incognito/private mode
- Use Chrome or Edge browser

---

## Deployment Checklist

Before deploying to Netlify, verify:

- [ ] All files committed to Git
- [ ] `package.json` has no `@vercel/analytics`
- [ ] `netlify.toml` doesn't have `publish` directory
- [ ] `/types/mediapipe.d.ts` exists
- [ ] `tailwind.config.ts` exists
- [ ] `app/globals.css` has `@import 'tailwindcss'`
- [ ] `app/layout.tsx` imports `'./globals.css'`
- [ ] Node version set to 20.9.0 in `netlify.toml`

Run verification script:
```bash
npm run verify
```

---

## Testing Locally Before Deploy

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build locally:**
   ```bash
   npm run build
   ```

3. **Test production build:**
   ```bash
   npm start
   ```

4. **If build succeeds locally but fails on Netlify:**
   - Check Netlify build logs for specific errors
   - Ensure all files are committed to Git
   - Try deploying via GitHub instead of manual upload

---

## Performance Issues

**Symptoms:**
- Slow frame rate
- Laggy particle animations
- Browser becomes unresponsive

**Solutions:**

1. **Reduce Particle Count**
   Edit `/components/ParticleSystem.tsx`:
   ```tsx
   // Change from 5000-8000 to lower values
   const particleCount = pattern === 1 ? 2000 : 3000
   ```

2. **Lower Quality Settings**
   - Use simpler patterns (sphere instead of text)
   - Reduce particle size
   - Lower camera resolution

3. **Hardware Requirements**
   - This app requires a decent GPU
   - Works best on desktop/laptop
   - Mobile devices may struggle

---

## Camera Issues

**Camera won't start:**
1. Check browser permissions
2. Ensure no other app is using camera
3. Try closing other tabs using camera
4. Restart browser

**Hand detection not accurate:**
1. Ensure good lighting
2. Keep hand in camera frame
3. Try solid colored background
4. Move hand slower

**Video is mirrored:**
- This is intentional for easier hand control
- It feels more natural when mirrored

---

## Getting Help

If issues persist:

1. **Check Netlify Deploy Logs**
   - Go to Netlify Dashboard → Deploys
   - Click on failed deploy
   - Read full error log

2. **Check Browser Console**
   - F12 → Console tab
   - Look for red error messages
   - Screenshot and save errors

3. **Test Different Patterns**
   - Press 1-5 keys to test each pattern
   - Some patterns are more performance intensive

4. **Try Different Browser**
   - Chrome recommended
   - Edge also works well
   - Firefox may have issues with MediaPipe

---

## Quick Reset

If everything is broken:

1. **Clear Netlify Cache:**
   - Site settings → Build & deploy
   - Clear cache and deploy site

2. **Clear Local Node Modules:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

3. **Redeploy from Scratch:**
   ```bash
   git add .
   git commit -m "Reset deployment"
   git push origin main
   ```

---

## Contact & Support

For birthday surprise tips:
- Test the site thoroughly before sharing with Jahrex
- Use the gesture guide overlay to practice
- Download a few screenshots before the event
- Create a short demo video showing how to use it

Enjoy the experience!
