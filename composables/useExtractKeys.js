const extractKeys = (object, keys) => {
  return keys.reduce((result, key) => {
    const [mainKey, subKey] = key.split("."); // Split for nested keys
    if (subKey) {
      // Handle nested keys
      if (object[mainKey] && subKey in object[mainKey]) {
        result[key] = object[mainKey][subKey];
      }
    } else if (mainKey in object) {
      result[mainKey] = object[mainKey];
    }
    return result;
  }, {});
};

export default extractKeys;
