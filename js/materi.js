'use strict';

function generateMathQuestions() {
  return shuffle(mathPool[state.levels.math]).slice(0, 10);
}

function generateBahasaQuestions() {
  return shuffle(bahasaPool[state.levels.bahasa]).slice(0, 10);
}

function generateIPAQuestions() {
  return shuffle(ipaPool[state.levels.ipa]).slice(0, 10);
}

function generateIPSQuestions() {
  return shuffle(ipsPool[state.levels.ips]).slice(0, 10);
}

function generateQuestions(subject) {
  switch (subject) {
    case 'math':   return generateMathQuestions();
    case 'bahasa': return generateBahasaQuestions();
    case 'ipa':    return generateIPAQuestions();
    case 'ips':    return generateIPSQuestions();
    default: return [];
  }
}
