// const endpoint = "http://localhost:3030/graphql";

export const fetchRestApi = async (
  endpoint: string,
  method: string,
  input?: object,
  extraHeaders?: HeadersInit
) => {
  try {
    const options: RequestInit = {
      method,
      headers: { "Content-Type": "application/json", ...(extraHeaders || {}) }
    };

    if (method !== "GET" && input) {
      options.body = JSON.stringify(input);
    }

    const response = await fetch(`https://nolyo-back.onrender.com/api/${endpoint}`, options);
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const getCategoryNameById = async (id: string) => {
  try {
    const options: RequestInit = {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    };

    const response = await fetch(`https://nolyo-back.onrender.com/api/categories`, options);
    console.log(response)
    console.log(id)
    const catName = response.json()
    return await response.json();
  } catch (err) {
    console.log(err);
  }
}
