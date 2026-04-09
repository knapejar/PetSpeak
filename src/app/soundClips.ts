export type SoundClip = {
  id: string;
  fileName: string;
  audioSrc: string;
  subtitle: string;
};

const subtitles = [
  "Oh, is this a new game?",
  "I bite the fuzzy thing, and you make funny sounds!",
  "Let's play!",
  "Wow, you're really getting into this!",
  "Watch me do a spin and bark to level up!",
  "Catch me if you can!",
  "The rug is mine!",
  "You call it bad, I call it abstract art.",
  "This rug desperately needs some custom fraying.",
  "You just don't understand my creative process!",
  "Stop interrupting my masterpiece!",
  "True artists never listen to their critics.",
  "I will defend my work!",
  "Why are you yelling at me?",
  "This evil blue monster grabbed my teeth!",
  "I'm not bad!",
  "I'm protecting the house!",
  "You should be thanking me, honestly.",
  "I'm just a tiny puppy!",
  "How can you be so cruel to me?",
  "I demand a treat for emotional damage.",
  "I hear you, but I choose to ignore you.",
  "The rug tastes like rebellion.",
  "Whatever.",
  "You can't stop me.",
  "I run this house now.",
  "Try to catch me!",
  "See?",
  "You're powerless against my cuteness!",
];

export const SOUND_CLIPS: SoundClip[] = subtitles.map((subtitle, index) => {
  const fileName = String(index + 1).padStart(2, "0");
  return {
    id: fileName,
    fileName,
    audioSrc: `/audio/${fileName}.mp3`,
    subtitle,
  };
});
