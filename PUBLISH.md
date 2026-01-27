# Publishing @etoile-dev/react to NPM

## Pre-publish checklist

- [ ] All tests pass
- [ ] Build succeeds: `npm run build`
- [ ] Version bumped in `package.json`
- [ ] CHANGELOG updated (if applicable)
- [ ] README is accurate
- [ ] LICENSE is correct

## Build

```bash
npm run build
```

This will:
1. Compile TypeScript to JavaScript + declarations
2. Copy `styles.css` to dist

## Test the package locally

```bash
# Pack the package
npm pack

# This creates @etoile-dev-react-0.1.0.tgz
# Install it in another project:
npm install /path/to/@etoile-dev-react-0.1.0.tgz
```

## Publish to NPM

```bash
# Login (if not already)
npm login

# Dry run to see what will be published
npm publish --dry-run

# Publish for real
npm publish --access public
```

## Post-publish

- [ ] Verify package on npm: https://www.npmjs.com/package/@etoile-dev/react
- [ ] Test installation: `npm i @etoile-dev/react`
- [ ] Update documentation site (if applicable)
- [ ] Announce release

## Version bumping

```bash
# Patch (0.1.0 -> 0.1.1)
npm version patch

# Minor (0.1.0 -> 0.2.0)
npm version minor

# Major (0.1.0 -> 1.0.0)
npm version major
```

## Troubleshooting

**Error: Package already exists**
- You can't republish the same version
- Bump the version first: `npm version patch`

**Error: 402 Payment Required**
- You need to set `--access public` for scoped packages (@etoile-dev/*)

**Files missing from package**
- Check the `files` field in `package.json`
- Check `.npmignore` isn't too aggressive
- Use `npm pack` to preview what will be published
