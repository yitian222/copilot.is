import { NextResponse } from 'next/server';
import { createVertex } from '@ai-sdk/google-vertex';
import { generateText, streamText } from 'ai';
import { createAnthropicVertex } from 'anthropic-vertex';

import { appConfig } from '@/lib/appconfig';
import { VertexAIModels } from '@/lib/constant';
import { Message, type Usage } from '@/lib/types';
import { providerFromModel } from '@/lib/utils';
import { auth } from '@/server/auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type PostData = {
  messages: Message[];
  usage: Usage;
};

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const json: PostData = await req.json();
  const { messages, usage } = json;
  const {
    model,
    stream,
    prompt,
    previewToken,
    temperature,
    frequencyPenalty,
    presencePenalty,
    maxTokens
  } = usage;

  try {
    const provider = providerFromModel(model);
    const options = {
      project: appConfig.vertex.project,
      location: appConfig.vertex.location,
      googleAuthOptions: {
        keyFile: appConfig.vertex.credentials
      }
    };
    const vertex =
      provider === 'anthropic'
        ? createAnthropicVertex(options)
        : createVertex(options);

    const parameters = {
      model: vertex(VertexAIModels[model] || model),
      system: prompt,
      messages,
      temperature,
      frequencyPenalty,
      presencePenalty,
      maxTokens
    };

    if (!stream) {
      const { text } = await generateText(parameters);

      return NextResponse.json({
        role: 'assistant',
        content: text
      });
    }

    const res = await streamText(parameters);

    return res.toDataStreamResponse();
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
