import type { NextApiRequest, NextApiResponse } from "next";

import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { env } from "src/env/server.mjs";
import { RECIPE_LIST_URL } from "src/constants";

const recipes = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (session) {
    if (req.method === "GET") {
      const { search } = req.query;
      const options = {
        method: "GET",
        headers: {
          "X-RAPIDAPI-KEY": env.RAPID_API_KEY,
          "X-RAPIDAPI-HOST": env.RAPID_API_HOST,
        },
      };

      const response = await fetch(RECIPE_LIST_URL + search, options);

      const data = await response.json();

      console.log("Data");

      res.status(200).json(data);
    }
  }
};

export default recipes;
