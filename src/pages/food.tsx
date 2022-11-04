const Food = () => {
  const food = {
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    name: "Food Title",
    description: "Description food",
    steps: [
      "Preheat the oven to 450ºF. Place a rack in the lowest position.",
      "Place the dough in the center of the baking sheet and drizzle with the oil. Turn the dough to coat it well, spreading some of the oil over the baking sheet.",
      "Mix together the shredded chicken and barbecue sauce in a bowl, then spread evenly over the pizza dough, leaving a little bit of a border around the pizza.",
    ],
  };
  return (
    <div className="container mx-auto flex flex-col gap-4 p-4">
      <h1 className="self-center text-xl font-bold">{food.name}</h1>
      <p>{food.description}</p>
      <img src={food.image} className="h-80 w-80 self-center rounded" />
      <ol>
        {food.steps.map((step, i) => (
          <div key={i}>
            <li className="list-decimal">{step}</li>
          </div>
        ))}
      </ol>
    </div>
  );
};

export default Food;
