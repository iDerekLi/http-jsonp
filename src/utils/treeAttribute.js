/**
 * treeAttribute
 * @param obj
 * @param attrPath
 * @param value
 * @returns {*}
 */
function treeAttribute(obj, attrPath, value) {
  if (!(typeof obj === "object" && obj !== null)) {
    throw Error("obj is not an Object type");
  }

  if (!attrPath) return obj;

  const attrKeys =
    typeof attrPath === "string" ? attrPath.split(".") : attrPath;
  const length = attrKeys.length;

  const attr = attrKeys.shift();
  if (typeof attr !== "string" || attr === "")
    throw Error("error attribute path");

  if (length > 1) {
    return treeAttribute(obj[attr], attrKeys, value);
  }
  return value !== undefined ? (obj[attr] = value) : obj[attr];
}

export default treeAttribute;
