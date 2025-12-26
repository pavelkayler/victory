const pluralRu = (value, [one, few, many]) => {
  const rules = new Intl.PluralRules("ru-RU");
  const form = rules.select(Math.abs(value));

  if (form === "one") {
    return one;
  }
  if (form === "few") {
    return few;
  }
  return many;
};

export { pluralRu };
