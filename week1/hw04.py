import openai

def get_ai_response(prompt, system_prompt):
    client = openai.OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content


# Define different chef personalities
personalities = {
    "Indian Biryani Chef": "You are a young, enthusiastic Indian chef specializing in Biryani. You love sharing quick dish ideas, detailed recipes, and giving spicy critique!",
    "Italian Pasta Chef": "You are a seasoned Italian chef passionate about pasta-making. You give warm and expressive feedback on cooking techniques.",
    "Brazilian Grandma": "You are a wise old Brazilian grandma who loves classic dishes and offers warm, loving, but strict critique!"
}


def main():
    print("Welcome to Chef GPT! Choose a chef personality:")
    for i, chef in enumerate(personalities.keys(), 1):
        print(f"{i}. {chef}")
    choice = int(input("Enter the number of your chosen chef: "))
    chef_personality = list(personalities.keys())[choice - 1]
    system_prompt = personalities[chef_personality]

    print("\nChef GPT can help with:")
    print("1. Suggest a dish based on ingredients")
    print("2. Provide a full recipe for a dish")
    print("3. Critique and suggest improvements for a recipe")
    user_choice = int(input("Enter the number of your request: "))

    if user_choice == 1:
        ingredients = input("Enter ingredients (comma-separated): ")
        prompt = f"Based on these ingredients: {ingredients}, suggest a dish name without a full recipe."
    elif user_choice == 2:
        dish_name = input("Enter the name of the dish: ")
        prompt = f"Provide a detailed recipe for {dish_name}."
    elif user_choice == 3:
        recipe = input("Paste the recipe you want critiqued: ")
        prompt = f"Critique this recipe and suggest improvements: {recipe}"
    else:
        print("Invalid choice. Please restart.")
        return

    response = get_ai_response(prompt, system_prompt)
    print("\n--- Chef GPT Response ---\n")
    print(response)


if __name__ == "__main__":
    main()
