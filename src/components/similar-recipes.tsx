interface SRProps {
  id: string;
}

const SimilarRecipes = ({ id }: SRProps) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-4xl font-bold">Similar Recipes: {id}</h1>
    </div>
  );
};

export default SimilarRecipes;
