export const getLocation = async () => {
  try {
    const res = await fetch(
      "https://provinces.open-api.vn/api/?depth=3"
    );
    // https://countriesnow.space/api/v0.1/countries

    if (!res.ok) {
      throw new Error("Failed to fetch location");
    }

    const data = await res.json();

    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};