import { redirect } from "next/navigation";

// Actions
import { getInterviewById } from "@/lib/actions/general.actions";
import { getCurrentUser } from "@/lib/actions/auth.actions";

// Components
import Image from "next/image";
import TechIcons from "@/components/TechIcons";
import Agent from "@/components/Agent";

// Utils
import { getRandomInterviewCover } from "@/lib/utils";

const Page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();
  const interview = await getInterviewById(id);

  if (!interview) redirect('/');

  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image className="rounded-full object-cover size-[40px]" src={getRandomInterviewCover()} alt="Cover" height={40} width={40} />
            <h3 className="capitalize">{interview.role}</h3>
          </div>
          <TechIcons techStack={interview.techStack}/>
        </div>
        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize">{interview.type}</p>
      </div>
      <Agent userName={user!.name} userId={user!.id} interviewId={id} type="interview" questions={interview.questions}/>
    </>
  );
}

export default Page;
