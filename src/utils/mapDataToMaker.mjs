/**
 * Maps `data transformation` keys with its corresponding maker
 */
export default function mapDataToMaker(data, mapper) {
  return Object.keys(data).map((key) => {
    const capitalizedKey = key.replace(key[0], key[0].toUpperCase());

    return mapper[`make${capitalizedKey}`](data[key]);
  });
}
