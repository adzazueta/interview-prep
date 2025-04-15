// Components
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import InterviewCard from '@/components/InterviewCard';

// Constants
import { getCurrentUser } from '@/lib/actions/auth.actions';
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.actions';

const Page = async () => {
  const user = await getCurrentUser();
  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user!.id),
    await getLatestInterviews({ userId: user!.id })
  ]);
  const hasPastInterviews = userInterviews && userInterviews.length > 0;
  const hasUpcomingInterviews = latestInterviews && latestInterviews.length > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice and Feedback</h2>
          <p className="text-lg">Practice on real interview questions and get instant feedback</p>
          <Button className="btn-primary max-sm:w-full" asChild>
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>
        <Image className="max-sm:hidden" src="/robot.png" alt="Robot" height={400} width={400}/>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {hasPastInterviews
            ? userInterviews.map((interview) => (
                <InterviewCard key={interview.id} {...interview} />
              ))
            : <p>You haven&apos;t taken any interviews yet</p>
          }
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          {hasUpcomingInterviews
            ? latestInterviews.map((interview) => (
                <InterviewCard key={interview.id} {...interview} />
              ))
            : <p>There are no new interviews available</p>
          }
        </div>
      </section>
    </>
  );
}

export default Page;
