import moment from "moment";

const seeds = [
  "oceanic_wave",
  "firefly_dusk",
  "lunar_dream",
  "nebula_glow",
  "stellar_breeze",
  "comet_dash",
  "twilight_haven",
  "crystal_ridge",
  "aurora_flare",
  "zenith_echo",
  "canyon_spark",
  "forest_bloom",
  "horizon_fade",
  "midnight_blaze",
  "sunrise_glint",
  "pixel_mage",
  "cyber_wisp",
  "etheric_blush",
  "harmony_glide",
  "radiant_shore",
  "vivid_orbit",
  "shadow_wisp",
  "galaxy_surge",
  "cosmic_ray",
  "nebula_frost",
  "nova_pulse",
  "eclipse_haze",
  "driftwood_soul",
  "cascade_vault",
  "thunder_bloom",
  "ember_twist",
  "frost_spark",
  "verdant_whisper",
  "mystic_vibe",
  "shimmer_strike",
  "tidal_flight",
  "astral_ripple",
  "flame_jewel",
  "quartz_gale",
  "jade_spectrum",
  "aurora_dusk",
  "orbit_shift",
  "luminous_arc",
  "serenity_tide",
  "blaze_flicker",
  "prismatic_gleam",
  "celestial_glint",
  "ember_horizon",
  "velvet_wisp",
  "chrono_glow",
];

export const generateAvatar = () => {
  const randomNumber = Math.floor(Math.random() * 49);

  const layout =
    "https://api.dicebear.com/9.x/fun-emoji/svg?seed=" + seeds[randomNumber];
  return layout;
};

export const validCuid = (data) => {
  return data.length == 25 ? true : false;
};

export const validateDate = (data) => {
  return moment(data).isValid();
};

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
