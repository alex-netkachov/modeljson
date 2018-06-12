export default class Utils {
  static locate(root, path) {
    return path.reduce((current, item) => current ? current[item] : undefined, root);
  }
}