import { useRouter } from "next/router";

type Recipe = {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
};

interface RecipeProps {
  data: Recipe[];
}

const Recipe = ({ data }: RecipeProps) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {data &&
        data.map((recipe, i) => (
          <div
            key={i}
            className="custom-border flex h-80 flex-col items-center justify-between gap-4 rounded bg-white bg-opacity-40 p-4 md:h-auto"
          >
            <img
              src={recipe.thumbnailUrl}
              alt={recipe.name}
              className="h-40 w-60 self-center rounded md:h-80 md:w-80"
            />
              <h2 className="text-center text-lg font-bold">{recipe.name}</h2>
              <p className="self-center text-stone-700 w-full">
                {recipe.description === ""
                  ? "No description. We will add it soon. In the meantime, you can bookmark this recipe and come back later. Thank you for your patience."
                  : recipe.description.substring(0, 110).concat("...")}
              </p>
              <div className="flex justify-center">
                <button
                  className="custom-button"
                  onClick={() => router.push(`/recipe/${recipe.id}`)}
                >
                  View Recipe
                </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Recipe;
