import axios from "axios";

interface response {
  data: {
    id: number;
    hash: string;
    url: string;
  };
}

async function getLink(amount: number, id: number) {
  const response: response = await axios.get(
    `https://lk.rukassa.is/api/v1/create?shop_id=2438&order_id=${id}&amount=${amount}&token=4513c2b8c49463e5aaa8e8e155a9cead&user_code=${id}`
  );

  const { url } = response.data;
  return url;
}

export { getLink };
