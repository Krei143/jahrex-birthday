# Happy Birthday Jahrex! 🎉💕

A magical gesture-controlled 3D particle system created as a special birthday gift for Jahrex!

## Features ✨

### 🖐️ Hand Gesture Control
Control beautiful 3D particle patterns using hand gestures captured by your camera:

- **1 Finger**: "Happy Birthday Babi" text pattern
- **2 Fingers**: Sphere pattern
- **3 Fingers**: Heart shape
- **4 Fingers**: Spiral pattern
- **5 Fingers (Open Hand)**: Galaxy explosion effect
- **Fist (Closed Hand)**: Contract particles toward center

### 🎨 Visual Customization
- Real-time color picker with preset colors
- Smooth particle animations
- Dynamic scaling based on hand distance
- Beautiful gradient backgrounds

### 📸 Capture & Download
- Download snapshots in multiple quality levels (1x, 2x, 4x)
- Record 10-second videos of your creations
- Save your favorite moments

### ⌨️ Keyboard Controls (Fallback)
If camera access is unavailable:
- **1-5**: Switch between patterns
- **Spacebar**: Toggle expand/contract
- **+/-**: Increase/decrease particle scale

### 🖥️ Interface Features
- Clean, minimalistic design
- Fullscreen mode support
- Interactive gesture guide
- Real-time camera feed preview
- Status indicators

## How to Use 🚀

1. **Allow Camera Access**: Click "Allow" when prompted for camera permissions
2. **Show Your Hand**: Position your hand in front of the camera
3. **Try Gestures**: 
   - Show different numbers of fingers to change patterns
   - Open your hand wide to expand particles
   - Close your fist to contract them
   - Move your hand closer/farther to scale
4. **Customize Colors**: Use the color picker at the bottom-left
5. **Download**: Click the download button for image/video options
6. **Go Fullscreen**: Click the maximize button for immersive experience

## Technical Details 🛠️

Built with:
- **Next.js 16** - React framework
- **Three.js & React Three Fiber** - 3D graphics
- **MediaPipe Hands** - Hand tracking and gesture recognition
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

### Particle Patterns

1. **Birthday Text**: 10,000+ particles forming "Happy Birthday Babi"
2. **Sphere**: 5,000 particles in perfect spherical formation
3. **Heart**: 8,000 particles creating a 3D heart shape
4. **Spiral**: 6,000 particles in a beautiful spiral pattern
5. **Galaxy**: 10,000 particles with spiral galaxy effect

### Gesture Detection
- Uses MediaPipe Hands for real-time hand tracking
- Detects finger count and hand openness
- Calculates scale based on hand size
- Smooth interpolation for natural animations

## Browser Compatibility 🌐

Works best on:
- Chrome/Edge (recommended)
- Firefox
- Safari (iOS 14+)

**Note**: Camera access required for gesture control. Keyboard controls available as fallback.

## Privacy & Security 🔒

- All hand tracking happens locally in your browser
- No video or image data is sent to any server
- Camera feed is only used for gesture detection
- You have full control over camera permissions

## Made with Love 💖

This interactive 3D experience was specially created for Jahrex's birthday. Every particle, every gesture, and every color was crafted with care and love.

**Happy Birthday, Babi! May your day be as magical as these particles! ✨**

---

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## License

Created with love for Jahrex 💕
