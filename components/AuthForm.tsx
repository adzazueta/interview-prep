"use client"

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Hooks
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

// Components
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import FormField from '@/components/FormField';

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-in' ? z.string().optional() : z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
  });
}

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  });

  const isSignIn = type === 'sign-in';

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isSignIn) {
        toast.success('Sign in successfully.');
        router.push('/');
        return;
      }

      toast.success('Account created successfully. Please sign in.');
      router.push('/sign-in');
    } catch (error) {
      console.error(error)
      toast.error(`There was an error: ${error}`);
    }
  }

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">Interview Prep</h2>
        </div>
        <h3>Practice job interview with AI</h3>
        <Form {...form}>
          <form className="w-full space-y-6 mt-4 form" onSubmit={form.handleSubmit(onSubmit)}>
            {!isSignIn && <FormField control={form.control} name="name" label="Name" placeholder="Your Name" />}
            <FormField control={form.control} name="email" label="Email" placeholder="Your Email" type="email" />
            <FormField control={form.control} name="password" label="Password" placeholder="Your Password" type="password" />
            <Button className="btn" type="submit">{isSignIn ? 'Sign in' : 'Create an account'}</Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? 'No account yet?' : 'Have and account already?'}
          <Link className="font-bold text-user-primary ml-1" href={isSignIn ? '/sign-up' : '/sign-in'}>
            {isSignIn ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
