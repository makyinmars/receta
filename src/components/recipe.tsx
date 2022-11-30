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
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {data &&
        data.map((recipe, i) => (
          <div
            key={recipe.id}
            className="custom-border group flex h-80 flex-col items-center justify-between gap-4 rounded bg-white bg-opacity-40 p-4 md:h-auto"
          >
            <p className="hidden text-sm font-semibold text-stone-700 group-hover:flex md:text-lg">
              {recipe.description}
            </p>
            <img
              src={recipe.thumbnailUrl}
              alt={recipe.name}
              className="h-40 w-60 self-center rounded group-hover:hidden md:h-80 md:w-80"
            />
            <div>
              <h2 className="text-lg font-bold">{recipe.name}</h2>
              <div className="flex justify-center">
                <button className="custom-button">View Recipe</button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Recipe;
