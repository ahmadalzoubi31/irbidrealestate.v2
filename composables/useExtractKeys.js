const extractKeys = (object, keys) => {
  return keys.reduce((result, key) => {
    const [mainKey, subKey, thirdKey] = key.split("."); // Split for nested keys
    if (thirdKey) {
      // Handle three-level nested keys
      if (object[mainKey] && object[mainKey][subKey] && thirdKey in object[mainKey][subKey]) {
        result[key] = object[mainKey][subKey][thirdKey];
      }
    } else if (subKey) {
      // Handle two-level nested keys
      if (object[mainKey] && subKey in object[mainKey]) {
        result[key] = object[mainKey][subKey];
      }
    } else if (mainKey in object) {
      // Handle single-level keys
      result[mainKey] = object[mainKey];
    }
    return result;
  }, {});
};

export default extractKeys;
