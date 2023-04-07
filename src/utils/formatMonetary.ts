const formatMonetary = (
  value: number,
  currency: string = "BRL",
  language: string = "pt-BR"
) => {
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency,
  }).format(value);
};

export default formatMonetary;
