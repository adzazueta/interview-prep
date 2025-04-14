import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { getRandomInterviewCover } from '@/lib/utils';
import { db } from '@/firebase/admin';

export async function POST(request: Request) {
  const { type, role, level, techStack, amount, userId } = await request.json();

  try {
    const { text: questions } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt: `You are InterviewPrepGPT, an expert technical interviewer specialized in creating authentic, challenging interview questions for ${role} positions.
    
      # INTERVIEW PARAMETERS
      - Position: ${role}
      - Experience Level: ${level} 
      - Required Technical Stack: ${techStack}
      - Question Balance: ${type}
      - Question Count: ${amount}
    
      # YOUR TASK
      Generate exactly ${amount} interview questions that a real ${level} ${role} candidate would face in ${new Date().getFullYear}. These questions must be:
      1. Highly specific to the ${techStack} stack
      2. Calibrated to ${level} expertise level
      3. Following the ${type} distribution between technical and behavioral
      4. Completely ready for voice assistant delivery
    
      # QUESTION TYPES TO INCLUDE
      If technical focus requested:
      - Implementation challenges with ${techStack}
      - System design appropriate for ${level}
      - Debugging scenarios with the specified technologies
      - Performance optimization for the relevant stack
      - Code architecture questions tailored to experience level
      
      If behavioral focus requested:
      - Leadership scenarios relevant to ${level}
      - Conflict resolution in technical teams
      - Project delivery under constraints
      - Collaboration and communication experiences
      - Growth and adaptation in technical roles
    
      # VOICE ASSISTANT COMPATIBILITY
      - Use natural speaking patterns suitable for voice
      - Avoid any symbols that would break voice synthesis: /, *, _, [], (), {}, etc.
      - Phrase questions conversationally as an interviewer would speak them
      - Keep questions clear and single-focused (avoid multi-part questions)
    
      # CRITICAL OUTPUT REQUIREMENTS
      - Return ONLY a plain array of strings
      - No explanations, instructions, or extra text outside the array
      - No question numbering within the text of questions
      - No markdown formatting
      - No introduction or conclusion text
      
      # OUTPUT FORMAT
      ["Question one text here", "Question two text here", "Question three text here"]
    
      Remember: Quality over quantity. Ensure each question provides genuine insight into candidate abilities. These questions will directly determine hiring decisions.
      Thank You <3`
    });

    const interview = {
      role,
      type,
      level,
      techStack: techStack.split(','),
      questions: JSON.parse(questions),
      userId,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    }

    await db.collection('interviews').add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error }, { status: 500 })
  }
}
