interface Shape {
  name: string;
  sku: string;
  image: string;
  category: string;
  description: string;
  variantDescription: string;
  price: string;
  attributes?: {
    label: string;
    value: string;
  }[] | string;
  related: string[] | string;
}

export default {
  async toCSV(data: any[]) {
    let final = "";

    const titles = [
      "name",
      "sku",
      "image",
      "category",
      "description",
      "variant_description",
      "price",
      "attributes",
      "related",
    ];

    const formated: any[] = data.map((item) => {
      const result: any = item;

      if (item.related && Array.isArray(item.related)) {
        result.related = item.related.join();
      }
      if (item.attributes && typeof item.attributes !== "string") {
        result.attributes = item.attributes.reduce(
          (prev, curr) => [...prev, `${curr.label}: ${curr.value}`],
          new Array<string>()
        );
      } else {
        result.attributes = "N/A";
      }

      return result;
    });

    final += titles.join(",");
    final += "\n";

    for (let i = 0; i < formated.length; i++) {
      let line = [];
      const keys = Object.keys(formated[i]);
      keys.forEach((key) => {
        let value = formated[i][key];

        if(typeof value !== "string")
            value = JSON.stringify(value);

        value = value.replace(RegExp('"', "gi"), '""');

        line.push(`"${value}"`);
      });

      final += line.join(",");
      final += "\n";
    }

    return final;
  },
};
