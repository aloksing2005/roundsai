function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidStringArray(value) {
  if (value === undefined) return true;
  if (!Array.isArray(value)) return false;
  return value.every(item => typeof item === 'string');
}

module.exports = { isNonEmptyString, isValidStringArray };