//

export default function isset(fn) {
  var value;
  try {
    value = fn();
  } catch (e) {
    value = undefined;
  } finally {
    return value !== undefined;
  }
}
