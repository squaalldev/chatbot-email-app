import requests
import json

class GeminiService:
    def __init__(self, api_key):
        self.api_key = api_key
        self.endpoint = 'https://gemini.googleapis.com/v1/email/generate'

    def generate_email(self, system_prompt, chat_history):
        # Prepare the payload for the API request
        payload = {
            'system_prompt': system_prompt,
            'chat_history': chat_history
        }

        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }

        try:
            response = requests.post(self.endpoint, headers=headers, json=payload)
            response.raise_for_status()  # Raise an error for bad responses
            return response.json()  # Return the JSON response
        except requests.exceptions.RequestException as e:
            print(f'Error during API call: {e}')
            return None

# Example usage:
# service = GeminiService('your_api_key')
# email_response = service.generate_email('Generate an email for...', ['Chat history item 1', 'Chat history item 2'])