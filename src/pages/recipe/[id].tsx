import { useRouter } from "next/router";

const RecipeId = () => {
  const router = useRouter();
  const id = router.query.id as string;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-4xl font-bold">{id}</h1>
    </div>
  );
};

export default RecipeId;
