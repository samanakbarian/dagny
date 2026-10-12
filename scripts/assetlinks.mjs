// Prints the Digital Asset Links file that ties the Android app to the website.
// Usage: node scripts/assetlinks.mjs <SHA-256> [<SHA-256> ...]
// Use the "App signing key certificate" SHA-256 from Play Console
// (Test and release → App integrity), and optionally your upload key's.
const fingerprints = process.argv.slice(2).map((f) => f.trim().toUpperCase());
const valid = /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/;
if (!fingerprints.length || !fingerprints.every((f) => valid.test(f))) {
  console.error('Ange minst ett SHA-256-fingeravtryck, t.ex. AB:CD:...:EF (32 par).');
  process.exit(1);
}
const links = [
  {
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: 'io.github.samanakbarian.dagny',
      sha256_cert_fingerprints: fingerprints,
    },
  },
];
console.log(JSON.stringify(links, null, 2));
