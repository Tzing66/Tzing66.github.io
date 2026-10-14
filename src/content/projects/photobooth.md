## The idea

A vintage photobooth that lives in the browser. You step inside, strike four poses, and get back a developed photostrip, like the booths in old malls and train stations. You can use it in the **Booth** section of this page. Inspired by [mysketchbooth.com](https://mysketchbooth.com).

## How it works

- **Shoot or upload:** four shots from a phone or laptop camera, each with a 3-2-1 countdown and a flash, or four uploaded photos cropped to 3:4.
- **Set up the shot:** 16 frames (from Classic Black to Film Negative, Ticket Stub and Pressed Flowers) and backdrops: your own room, or a painted white wall, studio grey, black or velvet curtain, with a live preview of your own face.
- **Cut-out backdrops:** a MediaPipe selfie segmenter, self-hosted and running on-device, separates you from the room so you can stand in front of a painted backdrop, with a flash shadow behind you.
- **The darkroom:** a canvas pipeline develops the strip with flash glow, edge burn, black-and-white or film-colour toning, paper grain and dust. An "authentic" mode adds a harsh close-flash look: blown highlights, crushed blacks, halation and heavy grain.
- **Take it home:** save it (straight to Photos via the share sheet on phones), share a 1080×1920 story image, print it on A4, or cut the strip into four single prints. Every strip you make is kept in a gallery in your browser.

## Six booths

Retro '70s, Sketchbook, Darkroom, Pixel Arcade, Photo Boy and Hello Kitty & Friends. Each theme is just decor: the pages own all the behaviour, so a new booth is one new file.

## Privacy

Everything runs client-side. Photos are processed on your device and stored in your browser's IndexedDB; nothing is ever uploaded.

Built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, the Canvas API and MediaPipe.
