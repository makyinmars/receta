import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {data &&
        data.map((recipe, i) => (
          <Card key={i} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{recipe.name}</CardTitle>
              <CardDescription>
                {recipe.description === ""
                  ? "No description. We will add it soon. In the meantime, you can bookmark this recipe and come back later. Thank you for your patience."
                  : recipe.description.substring(0, 100) + "..."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src={recipe.thumbnailUrl}
                alt={recipe.name}
                className="mx-auto h-40 w-60 self-center rounded md:h-80 md:w-80"
              />
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => router.push(`/recipe/${recipe.id}`)}
              >
                View Recipe
              </Button>
            </CardFooter>
          </Card>
        ))}
    </div>
  );
};

export default Recipe;
