# Email Generation Prompt System

def email_generation_prompt():
    print("Welcome to the Email Generation System! Please answer the following questions:")

    questions = [
        "1. What is the main purpose of your email? (e.g., inquiry, response, update)",
        "2. Who is the recipient of your email? (e.g., colleague, client, friend)",
        "3. What specific information do you want to convey?",
        "4. What tone do you want to use? (e.g., formal, casual, friendly)",
        "5. Do you want to include any attachments? (yes/no)"
    ]

    responses = []

    for question in questions:
        response = input(question + " ")
        responses.append(response)

    print("Thank you for your responses! Here is a draft of your email:")
    draft_email(responses)


def draft_email(responses):
    purpose, recipient, info, tone, attachments = responses
    draft = f"Dear {recipient},\n\n"

    if tone == "formal":
        draft += f"I am writing to you regarding {purpose}.\n"
    elif tone == "casual":
        draft += f"Hey {recipient}, just wanted to talk about {purpose}.\n"
    else:
        draft += f"Hello {recipient}, I hope this message finds you well. I wanted to discuss {purpose}.\n"

    draft += f"Here is the information you requested: {info}.\n"

    if attachments.lower() == "yes":
        draft += "Please find the attachments included.\n"
    else:
        draft += "If you need any additional information, feel free to reach out.\n"

    draft += "\nBest regards,\nYour Name"

    print(draft)

# Uncomment to run the email generation prompt
# email_generation_prompt()