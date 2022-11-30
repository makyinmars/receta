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
            key={recipe.id}
            className="custom-border group flex h-80 flex-col items-center justify-between gap-4 rounded bg-white bg-opacity-40 p-4 md:h-auto"
          >
            <div className="flex flex-1">
              <p className="hidden self-center text-sm font-semibold text-stone-700 group-hover:flex md:text-lg">
                {recipe.description === ""
                  ? "No description. We will add it soon. In the meantime, you can bookmark this recipe and come back later. Thank you for your patience."
                  : recipe.description.substring(0, 132).concat("...")}
              </p>
              <img
                src={recipe.thumbnailUrl}
                alt={recipe.name}
                className="h-40 w-60 self-center rounded group-hover:hidden md:h-80 md:w-80"
              />
            </div>
            <div>
              <h2 className="text-center text-lg font-bold">{recipe.name}</h2>
              <div className="flex justify-center">
                <button
                  className="custom-button"
                  onClick={() => router.push(`/recipe/${recipe.id}`)}
                >
                  View Recipe
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Recipe;
