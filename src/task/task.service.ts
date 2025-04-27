import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TaskService {
  constructor(private readonly configService: ConfigService) {}

  async callGemini(prompt: string): Promise<any> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.configService.get('GEMINI_API_KEY')}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  async create(createTaskDto: CreateTaskDto): Promise<{ title: string; description: string } | { error: string; details: string }> {
    const { difficulty_level, time_to_do } = createTaskDto;
    let prompt = '';

    if (difficulty_level === 1) {
      prompt = `Can you create a random simple punishment task for a friend that could be done in less than ${time_to_do} minutes, like doing 10 push-ups or posting an Instagram story where he shows his physique or asks for simple something from a stranger or recite the alphabet backward or tell a bad joke to 3 people or does something very interesting, but easy. Give me response in this form: title and then description. Give only one task. Title should be less than 15 symbols, while description should be less than 50 symbols.`;
    } else if (difficulty_level === 2) {
      prompt = `Can you create a random punishment task for a friend that could be done in less than ${time_to_do} minutes, like calling a person he/she loves or singing a popular song or giving a motivational speech in front of people or perform a short, silly dance routine in a public place or give a presentation on a random, absurd topic to a group of friends or doing something strange, but very interesting. Give me response in this form: title and then description. Give only one task. Title should be less than 15 symbols, while description should be less than 50 symbols.`;
    } else {
      prompt = `Can you create a random hard punishment task for a friend that could be done in less than ${time_to_do} minutes, like something very strange or very peculiar that most people won't even dare to do, like a taking a cold shower or asking a stranger to go on a date or cut/shave a part of their head or find and eat a spoonful of a very spicy food or perform a street performance for an hour to earn a small amount of money . Give me response in this form: title and then description. Give only one task. Title should be less than 15 symbols, while description should be less than 50 symbols.`;
    }

    console.log(prompt);

    try {
      const data = await this.callGemini(prompt);
      const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        return { error: 'Failed to extract text from Gemini response', details: 'Unexpected response format' };
      }

      const parts = responseText.split('\n\n');
      const title = parts[0].replace(/\*/g, '') || 'No Title';
      const description = parts.slice(1).join('\n').replace(/\*/g, '').replace(/\n/g, '') || 'No Description';

      return { title, description };
    } catch (error) {
      return { error: 'Failed to create task', details: error.message };
    }
  }
}
