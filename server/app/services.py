import logging
import openai
import json
from typing import Dict, Any
from app.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)


def format_mood_analysis_prompt(title: str, content: str) -> str:
    prompt = f"""
Analyze the following journal entry and return a JSON response with the following keys:
- 'mood': A single word describing the overall mood (e.g., Happy, Sad, Anxious, Excited, Reflective, etc.)
- 'mood_score': A number from 1-10 representing the emotional intensity (1=very negative, 10=very positive)
- 'top_emotions': An array of 2-4 emotion words that capture the main feelings expressed
- 'summary': A 1-2 sentence overview of the main themes or events described

Journal Entry Title: {title}

Journal Entry Content:
{content}

Please respond ONLY with valid JSON in the exact format described above.
"""
    return prompt.strip()


def parse_mood_analysis_response(response_text: str) -> Dict[str, Any]:
    try:
        data = json.loads(response_text.strip())
        
        required_fields = ['mood', 'mood_score', 'top_emotions', 'summary']
        if not all(field in data for field in required_fields):
            logger.error(f"Missing required fields in response: {data}")
            return None
        
        if not isinstance(data['mood'], str):
            logger.error(f"Invalid mood type: {type(data['mood'])}")
            return None
            
        if not isinstance(data['mood_score'], (int, float)) or not (1 <= data['mood_score'] <= 10):
            logger.error(f"Invalid mood_score: {data['mood_score']}")
            return None
            
        if not isinstance(data['top_emotions'], list):
            logger.error(f"Invalid top_emotions type: {type(data['top_emotions'])}")
            return None
            
        if not isinstance(data['summary'], str):
            logger.error(f"Invalid summary type: {type(data['summary'])}")
            return None
        
        parsed_data = {
            'mood': data['mood'].strip().title(),
            'mood_score': float(data['mood_score']),
            'top_emotions': [emotion.strip().lower() for emotion in data['top_emotions'] if emotion.strip()],
            'summary': data['summary'].strip()
        }
        
        return parsed_data
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON response: {e}")
        logger.error(f"Response text: {response_text}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error parsing response: {e}")
        return None


def get_fallback_analysis() -> Dict[str, Any]:
    """
    Return a fallback analysis when OpenAI analysis fails.
    """
    return {
        'mood': 'Neutral',
        'mood_score': 5.0,
        'top_emotions': ['neutral'],
        'summary': 'Analysis could not be completed at this time.'
    }


class MoodAnalysisService:
    """
    Service class for handling mood analysis using OpenAI GPT API.
    """
    
    def __init__(self):
        self.client = None
        if settings.openai_api_key and settings.openai_api_key != "your-openai-api-key-here":
            try:
                self.client = openai.OpenAI(api_key=settings.openai_api_key)
            except Exception as e:
                logger.error(f"Failed to initialize OpenAI client: {e}")
        else:
            logger.warning("OpenAI API key not configured")
    
    async def analyze_journal_entry(self, title: str, content: str) -> Dict[str, Any]:
        """
        Analyze a journal entry and return mood analysis data.
        
        Args:
            title (str): The journal entry title
            content (str): The journal entry content to analyze
            
        Returns:
            dict: Dictionary containing mood, mood_score, top_emotions, and summary
        """
        if not self.client:
            logger.warning("OpenAI client not available, returning fallback analysis")
            return get_fallback_analysis()
        
        if not content or not content.strip():
            logger.warning("Empty entry content provided")
            return get_fallback_analysis()
        
        try:
            prompt = format_mood_analysis_prompt(title or "Untitled", content)
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that analyzes journal entries for mood and emotional content. Always respond with valid JSON only."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=300,
                temperature=0.3,
                timeout=30
            )
            
            response_text = response.choices[0].message.content
            logger.info(f"OpenAI response received: {response_text[:100]}...")
            
            analysis_data = parse_mood_analysis_response(response_text)
            
            if analysis_data:
                logger.info("Successfully parsed mood analysis data")
                return analysis_data
            else:
                logger.error("Failed to parse OpenAI response, using fallback")
                return get_fallback_analysis()
                
        except openai.AuthenticationError:
            logger.error("OpenAI authentication failed - check API key")
            return get_fallback_analysis()
        
        except openai.RateLimitError:
            logger.error("OpenAI rate limit exceeded")
            return get_fallback_analysis()
        
        except openai.APITimeoutError:
            logger.error("OpenAI API request timed out")
            return get_fallback_analysis()
        
        except Exception as e:
            logger.error(f"Unexpected error during mood analysis: {e}")
            return get_fallback_analysis()


mood_analysis_service = MoodAnalysisService() 