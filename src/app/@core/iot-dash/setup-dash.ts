function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function someName(): string {
  const words = ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog'];
  return words[getRandomInt(words.length)] + ' ' + words[getRandomInt(words.length)];
}
function oneSixSixBits(): string {
  return (Date.now().toString(36) + Math.random().toString(36)).replace('0.', '');
}


export function setSampleData() {
  const sampleData = {
    sites: {},
    sensorData: {},
    actorData: {},
    users: {},
  };
  for (let siteIndex = 0; siteIndex < 3; siteIndex++) {
    // -------------- sensors --------------------
    const siteSensors = {};
    for (let sensorIndex = 0; sensorIndex < 4; sensorIndex++) {
      const sensorKey = oneSixSixBits();
      siteSensors[sensorKey] = {
        sensorKey,
        location: `Sensor #${sensorIndex} ${someName()}`,
      };
      // fake reports
      sampleData.sensorData[sensorKey] = {};
      for (let i = 0; i < getRandomInt(10); i++) {
        sampleData.sensorData[sensorKey][oneSixSixBits()] = {
          value: Math.random() * 60 - 10,
          timestamp: Date.now() - getRandomInt(100),
        };
      }
    }
    // -------------- actors --------------------
    const siteActors = {};
    for (let actorIndex = 0; actorIndex < 1; actorIndex++) {
      const actorKey = oneSixSixBits();
      siteActors[actorKey] = {
        actorKey,
        location: `Actor #${actorIndex} ${someName()}`,
      };
      // fake reports
      sampleData.actorData[actorKey] = {};
      for (let i = 0; i < getRandomInt(10); i++) {
        sampleData.actorData[actorKey][oneSixSixBits()] = {
          value: Math.random() > 0.5,
          timestamp: Date.now() - getRandomInt(100),
        };
      }
    }
    // -------------- sites --------------------
    sampleData.sites[oneSixSixBits()] = {
      name: `Site #${siteIndex} ${someName()}`,
      sensors: siteSensors,
      actors: siteActors,
    };
  }
  return sampleData;
}
