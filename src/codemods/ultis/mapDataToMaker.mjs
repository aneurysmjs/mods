/**
 * Maps `data transformation` keys with its corresponding maker
 */
export default function mapDataToMaker(obj, mapper) {
  return Object.keys(obj).map((key) => {
    const cappedKey = key.replace(key[0], key[0].toUpperCase());

    return mapper[`make${cappedKey}`](...Object.values(obj[key]));
  });
}
