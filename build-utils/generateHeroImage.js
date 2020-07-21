#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const { separateFills } = require('./SvgManipulator')

const svgPath = path.join(
  __dirname,
  '../static/angkor32-florian-hahn-svgomg.svg'
)
const outputPath = path.join(
  __dirname,
  '../src/apps/website/components/HeroImage/HeroImage.generated.jsx'
)

const svgContents = fs.readFileSync(svgPath)
const HeroImageContents = convertToReactSvgContents(svgContents)
fs.writeFileSync(outputPath, HeroImageContents)

function convertToReactSvgContents(svgBuffer) {
  const svgContents = svgBuffer.toString('utf8')
  const { fills, svgWithFillReferences } = separateFills(svgContents)

  return `
    // generated with ${path.join(__dirname, __filename)}
    import React from 'react';

    const originalFills = ${JSON.stringify(fills)};

    function SvgImage({ useFills = (x) => x }) {
      const fills = useFills(originalFills);

      return ${svgWithFillReferences};
    }

    export default SvgImage;
  `
}
