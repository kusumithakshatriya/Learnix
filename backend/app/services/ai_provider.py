class AIProvider:
    def generate_response(self, messages: list, mode: str, student_context: dict) -> str:
        raise NotImplementedError("Subclasses must implement generate_response")

class MockAIProvider(AIProvider):
    def generate_response(self, messages: list, mode: str, student_context: dict) -> str:
        # Development mock
        return f"AI Mentor development response: I received your question and will use your Learnix student context once an AI provider is connected. Mode: {mode}."

def get_ai_provider() -> AIProvider:
    return MockAIProvider()
